import { Html, Head, Main, NextScript } from "next/document";

export const siteTitle = "Giggle";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{siteTitle}</title>
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
