import fs from "fs";
import path from "path";
import { customAlphabet } from "nanoid";
import { execSync } from "child_process";
import { openai } from "./config";
import { hasBin, fileExists } from "../utils/has-bin";

const generateId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

const getAudioLength = (audioPath: string) => {
  if (!hasBin("ffprobe")) throw new Error("ERROR: ffprobe not found");

  try {
    const duration = execSync(
      `ffprobe -i ${audioPath} -show_entries format=duration -v quiet -of csv="p=0"`
    )
      .toString()
      .trim();
    return parseFloat(duration);
  } catch {
    throw new Error("ERROR: Failed to get audio length");
  }
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

const downloadAudio = (url: string, tmpDir: string) => {
  if (!hasBin("yt-dlp")) throw new Error("ERROR: yt-dlp not found");

  const audioFileName = "extracted_audio.mp3";
  const audioPath = path.join(tmpDir, audioFileName);

  try {
    execSync(
      `yt-dlp -x --audio-quality 6 --audio-format mp3 --output ${audioPath} ${url}`
    );

    if (!fileExists(audioPath)) {
      throw new Error("ERROR: Failed to download audio");
    }

    return audioPath;
  } catch {
    throw new Error("ERROR: Failed to download audio");
  }
};

const chopAudio = (audioPath: string, tmpDir: string) => {
  if (!hasBin("ffmpeg")) throw new Error("ERROR: ffmpeg not found");

  try {
    const chopDir = path.join(tmpDir, "chops");
    const outputTemplate = path.join(chopDir, "%03d.mp3");

    execSync(`mkdir ${chopDir}`);
    execSync(
      `ffmpeg -i ${audioPath} -c copy -map 0 -segment_time 00:05:00 -f segment -reset_timestamps 1 ${outputTemplate}`
    );

    const files = fs.readdirSync(chopDir);
    return files
      .sort()
      .map((file) => ({ path: path.join(chopDir, file), fileName: file }));
  } catch {
    throw new Error("ERROR: Failed to chop audio");
  }
};

const getTranscriptions = async (
  chops: ReturnType<typeof chopAudio>,
  tmpDir: string
) => {
  const txPath = path.join(tmpDir, "transcriptions");
  execSync(`mkdir ${txPath}`);

  const promises = chops.map((chop, offset) => {
    return new Promise<{ filePath: string; time: string }>(async (res, rej) => {
      try {
        const filePath = path.join(
          txPath,
          chop.fileName.replace(".mp3", ".txt")
        );

        console.log("Transcribing", chop.fileName, "...");
        const txt = await getText(chop.path);
        const length = getAudioLength(chop.path);
        const time = getTimeOffset(length, offset);
        console.log("Transcribing", chop.fileName, "... done");

        console.log("Writing transcription to", filePath, "...");
        fs.writeFileSync(filePath, txt);
        console.log("Writing transcription to", filePath, "... done");

        res({ filePath, time });
      } catch (e) {
        rej(e);
      }
    });
  });

  return await Promise.all(promises);
};

export const transcribe = async (url: string) => {
  const tmpDir = path.join(__dirname, "tmp", generateId());

  console.log("Downloading audio...");
  const audioPath = downloadAudio(url, tmpDir);
  console.log("Downloading audio... done");
  console.log("Audio path:", audioPath, "\n");

  console.log("Chopping audio...");
  const chops = chopAudio(audioPath, tmpDir);
  console.log("Chopping audio... done");
  console.log("Chops:", chops, "\n");

  console.log("Transcribing audio...");
  const transcriptions = await getTranscriptions(chops, tmpDir);
  console.log("Transcribing audio... done");
  console.log("Transcriptions:", transcriptions, "\n");

  return transcriptions;
};
