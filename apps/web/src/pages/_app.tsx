import "../styles/globals.css";
import type { AppProps } from "next/app";
import { api, client, queryClient } from "../utils/api";
import { QueryClientProvider } from "@tanstack/react-query";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <api.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </api.Provider>
  );
};

export default App;
