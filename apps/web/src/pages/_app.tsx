import "~/styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { type AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import * as gtag from "~/lib/gtm";
import { api } from "~/utils/api";
import { Toaster } from "~/components/toaster";

/* export const queryClient = new QueryClient(); */

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

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
      />

      {/* @ts-expect-error - types  */}
      <Component {...pageProps} />
      <div className="h-48 w-full" />
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(App);
