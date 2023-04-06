import superjson from "superjson";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "api";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const api = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const client = api.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      headers: {},
    }),
  ],
  transformer: superjson,
});
