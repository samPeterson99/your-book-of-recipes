import { Html, Head, Main, NextScript } from "next/document";

export const globalMeta = {
  siteName: "Your Book of Recipes",
  siteUrl: "https://www.yourbook.recipes/",
  siteLogo: "",
  email: "samuelmpeterson@gmail.com",
  description: "An online recipe book that can pull recipes from blogs",
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          property="og:title"
          content="Your Book of Recipes"
          key="title"
        />
        <meta
          name="description"
          content="An online recipe book that can pull recipes from blogs"
          key="description"
        />
        <meta
          name="keywords"
          content="recipes, recipe book, cooking"
        />
        <link
          rel="canonical"
          href="https://www.yourbook.recipes/"
        />
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
