import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
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

export const trpc = createTRPCNext<AppRouter>({
  config: ({ ctx }) => {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          headers: { ...ctx?.req?.headers },
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: false,
});

export const httpApi = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
  transformer: superjson,
});
