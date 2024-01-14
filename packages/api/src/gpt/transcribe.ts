import fs from "fs";
import path from "path";

import { openai } from "./config";
import { hasBin, fileExists } from "../utils/has-bin";
import { execAsync } from "../utils/helpers";
import { logger } from "../lib/logger";

const getAudioLength = async (audioPath: string) => {
  if (!hasBin("ffprobe")) throw new Error("ERROR: ffprobe not found");

  const raw = await execAsync(
    `ffprobe -i ${audioPath} -show_entries format=duration -v quiet -of csv="p=0"`,
    "Failed to get audio length"
  );
  const duration = parseFloat(raw);
  return duration;
};

const getTimeOffset = (length: number, offset: number) => {
  const len = length + offset * (5 * 60);
  const d = new Date(len * 1000);
  return d.toISOString().slice(11, 19);
};

const getText = async (audioPath: string) => {
  const response = await openai.createTranscription(
    fs.createReadStream(audioPath),
    "whisper-1",
    undefined,
    "text"
  );

  if (response.data) {
    if (typeof response.data === "string") {
      return response.data;
    } else if (response.data.text) {
      return response.data.text;
    }
    return JSON.stringify(response.data);
  } else {
    throw new Error("ERROR: No transcription data");
  }
};

const downloadAudio = async (url: string, tmpDir: string) => {
  if (!hasBin("yt-dlp")) throw new Error("ERROR: yt-dlp not found");

  const audioFileName = "extracted_audio.mp3";
  const audioPath = path.join(tmpDir, audioFileName);

  try {
    await execAsync(
      `yt-dlp -x --audio-quality 6 --audio-format mp3 --output ${audioPath} ${url}`
    );

    if (!fileExists(audioPath)) {
      throw new Error("ERROR: Failed to download audio");
    }

    return audioPath;
  } catch {
    logger.error("f(downloadAudio)", `Failed to download audio from ${url}`);
    throw new Error("ERROR: Failed to download audio");
  }
};

const chopAudio = async (audioPath: string, tmpDir: string) => {
  if (!hasBin("ffmpeg")) throw new Error("ERROR: ffmpeg not found");

  try {
    const chopDir = path.join(tmpDir, "chops");
    const outputTemplate = path.join(chopDir, "%03d.mp3");

    await execAsync(`mkdir ${chopDir}`);
    await execAsync(
      `ffmpeg -i ${audioPath} -c copy -map 0 -segment_time 00:05:00 -f segment -reset_timestamps 1 ${outputTemplate}`
    );

    const files = fs.readdirSync(chopDir);
    return files
      .sort()
      .map((file) => ({ path: path.join(chopDir, file), fileName: file }));
  } catch (e) {
    logger.error("f(chopAudio)", `Failed to chop audio`, e);
    throw new Error("ERROR: Failed to chop audio");
  }
};

const getTranscriptions = async (
  chops: Awaited<ReturnType<typeof chopAudio>>,
  tmpDir: string
) => {
  const txPath = path.join(tmpDir, "transcriptions");
  await execAsync(`mkdir ${txPath}`);

  const promises = chops.map((chop, offset) => {
    return new Promise<{ filePath: string; time: string }>(
      // eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
      async (res, rej) => {
        try {
          const filePath = path.join(
            txPath,
            chop.fileName.replace(".mp3", ".txt")
          );
          const txt = await getText(chop.path);
          const length = await getAudioLength(chop.path);
          const time = getTimeOffset(length, offset);
          fs.writeFileSync(filePath, txt);

          res({ filePath, time });
        } catch (e) {
          logger.error(
            "f(getTranscriptions)",
            `Failed to get transcription`,
            e
          );
          rej(e);
        }
      }
    );
  });

  return await Promise.all(promises);
};

export const transcribe = async (url: string, tmpDir: string) => {
  const audioPath = await downloadAudio(url, tmpDir);
  const chops = await chopAudio(audioPath, tmpDir);
  const transcriptions = await getTranscriptions(chops, tmpDir);
  return transcriptions;
};
