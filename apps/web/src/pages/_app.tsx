import "../styles/globals.css";
import type { AppProps } from "next/app";
import superjson from "superjson";
import { api, getWsUrl, getBaseUrl } from "../utils/api";
import {
  createWSClient,
  splitLink,
  httpBatchLink,
  wsLink,
} from "@trpc/react-query";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const queryClient = new QueryClient();
const isBrowser = typeof window !== "undefined";

const App = ({ Component, pageProps }: AppProps) => {
  const client = useMemo(() => {
    if (isBrowser) {
      const wsClient = createWSClient({
        url: `${getWsUrl()}/trpc`,
      });

      return api.createClient({
        links: [
          splitLink({
            condition: (op) => op.type === "subscription",
            true: wsLink({ client: wsClient }),
            false: httpBatchLink({
              url: `${getBaseUrl()}/trpc`,
              headers: {},
            }),
          }),
        ],
        transformer: superjson,
      });
    }
    return api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          headers: {},
        }),
      ],
      transformer: superjson,
    });
  }, []);

  return (
    <api.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </api.Provider>
  );
};

export default App;
