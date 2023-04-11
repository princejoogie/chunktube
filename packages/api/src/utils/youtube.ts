import type EventEmitter from "events";
import { youtube } from "@googleapis/youtube";
import { TRPCError } from "@trpc/server";

const parseDuration = (e: string) => {
  const hours = e.match(/(\d+)H/);
  const mins = e.match(/(\d+)M/);
  const secs = e.match(/(\d+)S/);

  const h = hours?.[1] ? +hours[1] : 0;
  const m = mins?.[1] ? +mins[1] : 0;
  const s = secs?.[1] ? +secs[1] : 0;

  const hh = `${h.toString().padStart(2, "0")}`;
  const mm = `${m.toString().padStart(2, "0")}`;
  const ss = `${s.toString().padStart(2, "0")}`;
  const hms = `${hh}:${mm}:${ss}`;

  const totalSeconds = h * 3600 + m * 60 + s;

  return { hms, totalSeconds };
};

export const getVideoId = (url: string) => {
  const regex = /[?&]v=([^&#]*)|youtu\.be\/([^&#]*)/;
  const match = regex.exec(url);

  if (match?.[1]) return match[1];
  if (match?.[2]) return match[2];

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "Invalid YouTube URL",
  });
};

interface Opts {
  ee: EventEmitter;
  url: string;
}

export const getVideoDetails = async (videoId: string, opts?: Opts) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No Youtube API key provided",
    });
  }

  opts?.ee.emit(`progress/${opts.url}`, {
    message: "Fetching video details",
    percentage: 5,
  });
  const details = await youtube("v3").videos.list({
    auth: apiKey,
    id: [videoId],
    part: ["snippet", "contentDetails"],
  });

  if (!details.data.items?.[0]) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No video with id ${videoId} found`,
    });
  }

  if (!details.data.items[0].snippet) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No video snippet found",
    });
  }

  if (!details.data.items[0].contentDetails) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No video content details found",
    });
  }

  const title = details.data.items[0].snippet.title;
  const thumbnail = details.data.items[0].snippet.thumbnails?.high?.url;
  const duration = details.data.items[0].contentDetails.duration;

  if (!title || !duration || !thumbnail) {
    return {
      title: "No video title",
      thumbnail: "https://i.imgur.com/removed.png",
      duration: parseDuration("PT0H0M0S"),
    };
  }

  return { title, thumbnail, duration: parseDuration(duration) };
};
