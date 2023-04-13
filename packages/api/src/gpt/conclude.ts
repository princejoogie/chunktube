import { openai } from "./config";
import { getSubtitles } from "../utils/youtube/subtitles";

const getConclusion = async (
  param: Awaited<ReturnType<typeof getSubtitles>>["captions"][number]
) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Summarize the following text as best you can, keep it short and straight to the point. Maximum of 5 sentences. Begin your summary with 'For this segment, ...' or 'This segment talks about' or something similar that fits the current context.",
      },
      { role: "user", content: param.content },
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
    order: param.order,
  };
};

export const conclude = async (videoId: string) => {
  const video = await getSubtitles(videoId);
  const conclusions = await Promise.all(video.captions.map(getConclusion));
  return { conclusions, details: video.details };
};
