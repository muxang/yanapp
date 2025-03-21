import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// Base URL - replace with your deployed URL
let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "wrapai.app";
// Ensure URL has https:// prefix
if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
  baseUrl = "https://" + baseUrl;
}

// Warpcast Frame URL for direct app entry
const warpcastFrameUrl = `https://warpcast.com/~/frames/launch?domain=wrapai.app`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "WrapAI | Web3 AI Points System",
  description:
    "Earn points through daily check-ins and redeem for exclusive Web3 rewards",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "WrapAI | Web3 AI Points System",
    description:
      "Earn points through daily check-ins and redeem for exclusive Web3 rewards",
    images: ["/images/wrapai-banner.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4F6AF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Farcaster Frames v2 meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content={`${baseUrl}/images/wrapai-banner.png`}
        />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Enter Mini App" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content={warpcastFrameUrl} />
        <meta
          property="fc:frame:post_url"
          content={`${baseUrl}/api/frame-check-in`}
        />

        {/* Progressive enhancement for Frame association */}
        <meta
          property="og:image"
          content={`${baseUrl}/images/wrapai-banner.png`}
        />
        <meta property="og:title" content="WrapAI | Daily Check-in System" />
        <meta
          property="og:description"
          content="Earn points through daily check-ins and redeem for Web3 rewards"
        />

        {/* Font resources */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
