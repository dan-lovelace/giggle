import { Html, Head, Main, NextScript } from "next/document";

import { siteTitle } from "../lib/config";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A self-hosted, customizable and ad-free Google Search experience"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
