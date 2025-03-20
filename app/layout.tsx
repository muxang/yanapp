import "./globals.css";
import { WagmiProvider } from "./components/providers/WagmiProvider";

export const metadata = {
  title: "Daily Check-in | MWGA Rewards",
  description: "Earn points for MWGA benefits through daily check-ins",
};

// Base URL - replace with your deployed URL
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://wrapcast.vercel.app";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Frame metadata */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/api/og`} />
        <meta property="fc:frame:button:1" content="Check In Daily" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/frame`} />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  );
}
