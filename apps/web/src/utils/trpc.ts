import superjson from "superjson";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { appRouter } from "api";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCReact<typeof appRouter>();

export const queryClient = new QueryClient();

export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      headers: {},
    }),
  ],
  transformer: superjson,
});
