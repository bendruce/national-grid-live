import { Html, Head, Main, NextScript } from "next/document";

/**
 * @file Custom `Document` component for the Next.js app. This file is responsible for rendering
 * the initial HTML structure that wraps the entire application. It allows you to customize
 * the `<html>` and `<body>` tags, as well as add custom elements to the `<head>`, such as fonts,
 * meta tags, or analytics scripts.
 *
 * The component renders once on the server and is used to augment the existing `App` component.
 * This is useful for setting up things that are outside the React lifecycle, such as language attributes
 * on the `<html>` tag or global fonts.
 *
 * @see {@link https://nextjs.org/docs/advanced-features/custom-document Custom Document in Next.js}
 */

export default function Document() {
  return (
    <Html>
      {/* The <Head> component allows us to define elements to include inside the <head> tag of our page.
          This is where we can import global styles or fonts. */}
      <Head>
        {/* Google Fonts import for the Roboto family, with font weights 400, 500, and 700 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body>
        {/* The <Main> component renders the content of the page being served by Next.js.
            This is where the body of your app is injected. */}
        <Main />

        {/* The <NextScript> component injects the necessary Next.js scripts into the page.
            These scripts include Next.js's JavaScript and any scripts necessary to run your app. */}
        <NextScript />
      </body>
    </Html>
  );
}
