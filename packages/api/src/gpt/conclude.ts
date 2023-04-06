import fs from "fs";
import { transcribe } from "./transcribe";
import { openai } from "./config";
import type EventEmitter from "events";

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const conclude = async (url: string, ee: EventEmitter) => {
  ee.emit("progress", { message: "Initializing", percentage: 0 });
  await sleep(2000);
  const transcriptions = await transcribe(url, ee);

  let percentage = 70;
  ee.emit("progress", { message: "Concluding segments", percentage });

  const percentagePerSegment = 30 / transcriptions.length;
  const conclusions = await Promise.all(
    transcriptions.map((e, i) =>
      getConclusion(e, i).then((data) => {
        percentage += percentagePerSegment;
        ee.emit("progress", {
          message: `Done segment ${i + 1}`,
          percentage,
        });
        return data;
      })
    )
  );

  ee.emit("progress", { message: "Done", percentage: 100 });
  return conclusions;
};
