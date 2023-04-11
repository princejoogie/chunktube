import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
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
export const httpApi = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      headers: {},
    }),
  ],
  transformer: superjson,
});
