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

// Use banner image for splash (ideally should be 200x200px and < 1MB)
// TODO: Replace with a proper square logo image
const splashImageUrl = `${baseUrl}/logo-large.png`;

interface Props {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  // 检查是否有查询参数
  const points = searchParams?.points || "0";
  const streak = searchParams?.streak || "0";

  // 决定使用哪个图片 - 如果有积分信息，使用动态生成的图片，否则使用标准横幅
  const imageUrl =
    points && Number(points) > 0
      ? `${baseUrl}/api/og-image?points=${points}&streak=${streak}`
      : `${baseUrl}/images/wrapai-banner.png`;

  // 创建frame对象
  const frame = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Check In Now",
      action: {
        type: "launch_frame",
        name: "WrapAI | Daily Check-in System",
        url: baseUrl,
        splashImageUrl: splashImageUrl,
        splashBackgroundColor: "#142B44",
      },
    },
  };

  return {
    title: "WrapAI | Daily Check-in System",
    description:
      "Earn points through daily check-ins and redeem for exclusive Web3 rewards",
    openGraph: {
      title: "WrapAI | Daily Check-in System",
      description:
        "Earn points through daily check-ins and redeem for Web3 rewards",
      images: [imageUrl],
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
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
