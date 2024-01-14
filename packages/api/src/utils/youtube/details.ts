import { google } from "googleapis";
import { TRPCError } from "@trpc/server";

const youtube = google.youtube("v3");

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
  const regex =
    /[?&]v=([^&#]*)|youtu\.be\/([^&#]*)|youtube\.com\/shorts\/([^&#]*)/;
  const match = regex.exec(url);

  if (match?.[1]) return match[1];
  if (match?.[2]) return match[2];
  if (match?.[3]) return match[3];

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "Invalid YouTube URL",
  });
};

export const getVideoDetails = async (videoId: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No Youtube API key provided",
    });
  }

  const details = await youtube.videos.list({
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

  const deets = details.data.items[0];

  if (!deets.snippet || !deets.contentDetails) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No video snippet or content details found",
    });
  }

  const { title, thumbnails, channelId } = deets.snippet;
  const { duration } = deets.contentDetails;
  const thumbnail = thumbnails?.high;

  if (
    !title ||
    !duration ||
    !thumbnail?.url ||
    !thumbnail.width ||
    !thumbnail.height ||
    !channelId
  ) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid video details",
    });
  }

  return {
    title,
    channelId,
    thumbnail: {
      url: thumbnail.url,
      width: thumbnail.width,
      height: thumbnail.height,
    },
    duration: parseDuration(duration),
  };
};

export const getChannelDetails = async (channelId: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No Youtube API key provided",
    });
  }

  const details = await youtube.channels.list({
    key: apiKey,
    id: [channelId],
    part: ["snippet", "statistics"],
  });

  const snippet = details.data.items?.[0]?.snippet;
  const stats = details.data.items?.[0]?.statistics;

  if (!snippet || !stats) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No channel with id ${channelId} found`,
    });
  }

  const { title, thumbnails, customUrl } = snippet;
  const { hiddenSubscriberCount, subscriberCount } = stats;
  const thumbnail = thumbnails?.high;

  if (
    !title ||
    !thumbnail?.url ||
    !thumbnail.width ||
    !thumbnail.height ||
    !customUrl ||
    !subscriberCount
  ) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid channel details",
    });
  }

  return {
    channelName: title,
    thumbnail: {
      url: thumbnail.url,
      width: thumbnail.width,
      height: thumbnail.height,
    },
    username: customUrl,
    hiddenSubscriberCount: Boolean(hiddenSubscriberCount),
    subscriberCount,
  };
};

export type ChannelDetails = Awaited<ReturnType<typeof getChannelDetails>>;

export const searchVideo = async (query: string, pageToken?: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No Youtube API key provided",
      cause: "searchVideo",
    });
  }

  const data = await youtube.search.list({
    pageToken,
    auth: apiKey,
    part: ["snippet"],
    maxResults: 5,
    q: query,
  });

  return data.data.items?.filter((e) => e.id?.kind === "youtube#video");
};
