import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const bigNumber = (num: number | bigint) => {
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(num);
};
