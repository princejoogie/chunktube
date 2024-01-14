import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

import type { DocumentContext, DocumentInitialProps } from "next/document";

import * as gtag from "@/lib/gtm";

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
          <link href="/favicon.ico" rel="icon" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
          <link
            crossOrigin="use-credentials"
            href="/manifest.json"
            rel="manifest"
          />
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta content="#FFFFFF" name="theme-color" />

          <meta content="It's just YouTube.. but text!" name="description" />
          <meta content="ChunkTube" property="og:title" />
          <meta content="website" property="og:type" />
          <meta content="https://chunktube.tech" property="og:url" />
          <meta content="/api/og" property="og:image" />
          <meta
            content="It's just YouTube.. but text!"
            property="og:description"
          />
          <meta content="ChunkTube" property="og:site_name" />

          <meta content="summary_large_image" name="twitter:card" />
          <meta content="chunktube.tech" name="twitter:domain" />
          <meta content="https://chunktube.tech" name="twitter:url" />
          <meta content="@princecaarlo" name="twitter:creator" />
          <meta content="ChunkTube" name="twitter:title" />
          <meta
            content="It's just YouTube.. but text!"
            name="twitter:description"
          />
          <meta content="/api/og" name="twitter:image" />

          <Script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtag.GTM_TRACKING_ID}');
            `,
            }}
            id="gtm-head"
            strategy="beforeInteractive"
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GTM_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
            }}
            id="google-analytics"
            strategy="beforeInteractive"
          />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GTM_TRACKING_ID}`}
            strategy="beforeInteractive"
          />
        </Head>
        <body>
          <iframe
            height="0"
            src={`https://www.googletagmanager.com/ns.html?id=${gtag.GTM_TRACKING_ID}`}
            style={{ display: "none", visibility: "hidden" }}
            title="gtm hidden"
            width="0"
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
