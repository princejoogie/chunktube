import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const bigNumber = (num: number | bigint) => {
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(num);
};

export const getVideoId = (url: string) => {
  const regex =
    /[?&]v=([^&#]*)|youtu\.be\/([^&#]*)|youtube\.com\/shorts\/([^&#]*)/;
  const match = regex.exec(url);

  if (match?.[1]) return match[1];
  if (match?.[2]) return match[2];
  if (match?.[3]) return match[3];

  throw new Error("Invalid YouTube URL");
};
