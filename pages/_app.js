import React from 'react';
import Head from 'next/head';
import '../src/app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>3D Glass Effect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 