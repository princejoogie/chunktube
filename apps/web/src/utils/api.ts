import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "api";

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const getWsUrl = () => {
  if (process.env.NEXT_PUBLIC_WS_API_URL) {
    return process.env.NEXT_PUBLIC_WS_API_URL;
  }

  return `ws://localhost:${process.env.PORT ?? 3000}`;
};

export const api = createTRPCReact<AppRouter>();
