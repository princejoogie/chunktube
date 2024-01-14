/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import he from "he";
import axios from "axios";
import { find } from "lodash";
import striptags from "striptags";

import { getVideoDetails } from "./details";
import { secToHMS } from "../helpers";

export const getSubtitles = async (
  videoId: string,
  lang: "en" | "de" | "fr" = "en"
) => {
  const details = await getVideoDetails(videoId);
  const { data } = await axios.get<string>(
    `https://youtube.com/watch?v=${videoId}`
  );

  // * ensure we have access to captions data
  if (!data.includes("captionTracks"))
    throw new Error(`Could not find captions for video: ${videoId}`);

  const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
  // @ts-expect-error - we know this will match
  const [match] = regex.exec(data);

  const { captionTracks } = JSON.parse(`${match}}`) as {
    captionTracks: Record<string, unknown>;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtitle: any =
    find(captionTracks, {
      vssId: `.${lang}`,
    }) ||
    find(captionTracks, {
      vssId: `a.${lang}`,
    }) ||
    find(captionTracks, ({ vssId }: { vssId: string }) =>
      vssId?.match(`.${lang}`)
    );

  // * ensure we have found the correct subtitle lang
  if (!subtitle || (subtitle && !subtitle.baseUrl))
    throw new Error(`Could not find ${lang} captions for ${videoId}`);

  const { data: transcript } = await axios.get<string>(subtitle.baseUrl);
  const lines: { start: number; dur: number; text: string }[] = transcript
    .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', "")
    .replace("</transcript>", "")
    .split("</text>")
    .filter((line: string) => line?.trim())
    .map((line: string) => {
      const startRegex = /start="([\d.]+)"/;
      const durRegex = /dur="([\d.]+)"/;

      const [, start] = startRegex.exec(line);
      const [, dur] = durRegex.exec(line);

      const htmlText = line
        .replace(/<text.+>/, "")
        .replace(/&amp;/gi, "&")
        .replace(/<\/?[^>]+(>|$)/g, "");
      const decodedText = he.decode(htmlText);
      const text = striptags(decodedText);
      return {
        start: +start,
        dur: +dur,
        text,
      };
    });

  const captionsPer5Minutes = Array(
    Math.ceil(details.duration.totalSeconds / 300)
  ) as { content: string; time: string; order: number }[];

  lines.forEach((line) => {
    const index = Math.floor(line.start / 300);

    if (!captionsPer5Minutes[index]) {
      captionsPer5Minutes[index] = {
        content: "",
        time: "",
        order: 0,
      };
    }

    captionsPer5Minutes[index]!.content += ` ${line.text}`;
    captionsPer5Minutes[index]!.time =
      index === captionsPer5Minutes.length - 1
        ? secToHMS(line.start + line.dur)
        : secToHMS(300 * (index + 1));
    captionsPer5Minutes[index]!.order = index;
  });

  return { captions: captionsPer5Minutes, details };
};
