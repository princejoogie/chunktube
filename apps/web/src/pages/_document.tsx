import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />

        <meta name="description" content="It's just YouTube.. but text!" />
        <meta property="og:title" content="ChunkTube" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chunktube.tech" />
        <meta property="og:image" content="https://chunktube.tech/api/og" />
        <meta
          property="og:description"
          content="It's just YouTube.. but text!"
        />
        <meta property="og:site_name" content="ChunkTube" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content="chunktube.tech" />
        <meta name="twitter:url" content="https://chunktube.tech" />
        <meta name="twitter:creator" content="@princecaarlo" />
        <meta name="twitter:title" content="ChunkTube" />
        <meta
          name="twitter:description"
          content="It's just YouTube.. but text!"
        />
        <meta name="twitter:image" content="/api/og" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
