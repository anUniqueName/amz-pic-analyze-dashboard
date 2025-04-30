import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Apple Watch Band Market Analysis</title>
        <meta name="description" content="Analysis dashboard for Apple Watch bands" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Component />
    </>
  );
}
