// ! Next and React
import type { AppProps } from "next/app";

// ! Assets
import "../assets/styles/globals.css";

// ! Library
import LoaderProvider from "../lib/providers/loader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LoaderProvider>
      <Component {...pageProps} />
    </LoaderProvider>
  )
}
export default MyApp;
