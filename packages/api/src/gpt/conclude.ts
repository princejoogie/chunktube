import fs from "fs";
import path from "path";
import crypto from "crypto";

import { transcribe } from "./transcribe";
import { openai } from "./config";
import { getVideoDetails, getVideoId } from "../utils/youtube";
import { execAsync } from "../utils/helpers";

type GetConclusionParam = Awaited<ReturnType<typeof transcribe>>[number];

const getConclusion = async (param: GetConclusionParam, index: number) => {
  const content = fs.readFileSync(param.filePath, "utf-8");
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Summarize the following text as best you can, keep it short and straight to the point. Maximum of 5 sentences. Begin your summary with 'For this segment, ...' or 'This segment talks about' or something similar that fits the current context.",
      },
      { role: "user", content },
    ],
  });

  if (response.data.choices.length <= 0) {
    throw new Error("ERROR: No choices returned");
  }

  if (!response.data.choices[0]?.message?.content) {
    throw new Error("ERROR: No output returned");
  }

  return {
    content: response.data.choices[0].message.content,
    time: param.time,
    order: index,
  };
};

const generateId = () => crypto.randomBytes(16).toString("hex");

export const conclude = async (url: string) => {
  const tmpDir = path.join(__dirname, "tmp", generateId());
  const videoId = getVideoId(url);
  const details = await getVideoDetails(videoId);
  const transcriptions = await transcribe(url, tmpDir);
  const conclusions = await Promise.all(
    transcriptions.map((e, i) => getConclusion(e, i))
  );
  await execAsync(`rm -rf ${tmpDir}`);
  return { conclusions, details };
};
