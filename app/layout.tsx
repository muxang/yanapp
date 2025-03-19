import "./globals.css";
import { WagmiProvider } from "./components/providers/WagmiProvider";

export const metadata = {
  title: "每日签到",
  description: "连续签到获得更多积分",
};

// Base URL - replace with your deployed URL
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://wrapcast.vercel.app";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        {/* Frame metadata */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/api/og`} />
        <meta property="fc:frame:button:1" content="Check In Daily" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/frame`} />
        <link
          href="https://fonts.cdnfonts.com/css/sf-pro-display"
          rel="stylesheet"
        />
      </head>
      <body>
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  );
}
