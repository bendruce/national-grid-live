import "../styles/globals.css";
import type { AppProps } from "next/app";

/**
 * @file This file defines the `MyApp` component, which wraps around all the pages in the Next.js application.
 * It is the root component for each page, allowing us to inject global styles, state, or other configurations
 * across all routes. This component uses the App component provided by Next.js to manage routing and rendering.
 *
 * By importing global CSS in this file, we ensure that the styles are applied to the entire app.
 * This component can also be customized to add layout wrappers or manage global state using a state management
 * solution (e.g., Redux, Context API).
 *
 * @param {AppProps} props - These are the props provided by Next.js, which include the component to render and any page-specific props.
 * @returns The wrapped page component to be rendered.
 *
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app Custom App in Next.js}
 */

function MyApp({ Component, pageProps }: AppProps) {
  // The `Component` prop refers to the active page being rendered, and `pageProps` contains the props passed to that page.
  return <Component {...pageProps} />;
}

export default MyApp;
