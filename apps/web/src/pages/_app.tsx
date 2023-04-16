import "~/styles/globals.css";
import Script from "next/script";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { api } from "~/utils/api";
import { Toaster } from "~/components/toaster";

/* export const queryClient = new QueryClient(); */

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#16a34a" },
        elements: { userButtonPopoverCard: "border-2 border-gray-600" },
      }}
    >
      <Script
        async
        data-ad-client="ca-pub-5644238710712581"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5644238710712581"
        crossOrigin="anonymous"
        onError={console.error}
      ></Script>
      <Component {...pageProps} />
      <div className="h-48 w-full" />
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(App);
