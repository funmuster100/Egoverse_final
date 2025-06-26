// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="de" data-theme="light">
        <Head>
          {/* Google Font – bereits in deiner CSS verwendet */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
            rel="stylesheet"
          />
          {/* Meta-Optimierungen */}
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#4a90e2" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
