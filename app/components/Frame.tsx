import React from "react";
import Head from "next/head";

export default function Frame() {
  // Base URL - replace with your deployed URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://wrapcast.vercel.app";

  return (
    <Head>
      {/* Frame metadata */}
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content={`${baseUrl}/api/og`} />
      <meta property="fc:frame:button:1" content="Check In Daily" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:post_url" content={`${baseUrl}/api/frame`} />
    </Head>
  );
}
