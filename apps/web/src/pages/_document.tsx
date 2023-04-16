import Document, {
  type DocumentContext,
  type DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link
            rel="manifest"
            crossOrigin="use-credentials"
            href="/manifest.json"
          />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#FFFFFF" />

          <meta name="description" content="It's just YouTube.. but text!" />
          <meta property="og:title" content="ChunkTube" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://chunktube.tech" />
          <meta property="og:image" content="/api/og" />
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
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5644238710712581"
            crossOrigin="anonymous"
          ></Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
