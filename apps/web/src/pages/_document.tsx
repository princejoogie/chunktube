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
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WPRQ3X6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
          <NextScript />
          <Script
            id="gtm-head"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WPRQ3X6');
            `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
