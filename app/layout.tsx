import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// Base URL - replace with your deployed URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wrapai.app";

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
    images: ["/og-image.png"],
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
          content={`${baseUrl}/api/frame-image`}
        />
        <meta property="fc:frame:button:1" content="Check In Now" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta
          property="fc:frame:post_url"
          content={`${baseUrl}/api/frame-check-in`}
        />

        {/* 字体资源 */}
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
