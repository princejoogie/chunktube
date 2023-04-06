import fs from "fs";
import { transcribe } from "./transcribe";
import { openai } from "./config";
import type EventEmitter from "events";

type GetConclusionParam = Awaited<ReturnType<typeof transcribe>>[number];

const getConclusion = async (
  param: GetConclusionParam,
  index: number,
  ee: EventEmitter
) => {
  ee.emit("progress", {
    message: `Concluding chunk ${index + 1}`,
    percentage: 95,
  });
  const content = fs.readFileSync(param.filePath, "utf-8");
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Summarize the following text as best you can, keep it short and straight to the point. Begin your summary with the following sentence: For this segment, ...",
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

export const conclude = async (url: string, ee: EventEmitter) => {
  ee.emit("progress", { message: "Transcribing", percentage: 0 });
  const transcriptions = await transcribe(url, ee);

  ee.emit("progress", { message: "Getting conclusion", percentage: 80 });
  const conclusions = await Promise.all(
    transcriptions.map((e, i) => getConclusion(e, i, ee))
  );

  ee.emit("progress", { message: "Done", percentage: 100 });
  return conclusions;
};
