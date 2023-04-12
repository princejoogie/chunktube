import "../styles/globals.css";
import type { AppProps } from "next/app";
import superjson from "superjson";
import { useMemo } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  createWSClient,
  splitLink,
  httpBatchLink,
  wsLink,
} from "@trpc/react-query";

import { api, getWsUrl, getBaseUrl } from "../utils/api";

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
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
      transformer: superjson,
    });
  }, []);

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#16a34a" },
        elements: { userButtonPopoverCard: "border-2 border-gray-600" },
      }}
    >
      <api.Provider client={client} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </api.Provider>
    </ClerkProvider>
  );
};

export default App;
