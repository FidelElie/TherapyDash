// ! Next and React
import type { AppProps } from "next/app";

// ! Assets
import "../assets/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp;
