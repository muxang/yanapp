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

interface Props {
  params: Promise<{
    name: string;
  }>;
}

const frame = {
  version: "next",
  imageUrl: `${baseUrl}/images/wrapai-banner.png`,
  button: {
    title: "WrapAI",
    action: {
      type: "launch_frame",
      name: "WrapAI | Daily Check-in Syste",
      url: warpcastFrameUrl,
      splashImageUrl: `${baseUrl}/images/wrapai-banner.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "WrapAI | Daily Check-in Syste",
    openGraph: {
      title: "WrapAI | Daily Check-in Syste",
      description: "WrapAIapp.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Providers>{children}</Providers>;
}
