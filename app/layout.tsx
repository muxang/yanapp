import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import Frame from "./components/Frame";

export const metadata: Metadata = {
  title: "Daily Check-in",
  description: "Daily check-in app for Farcaster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Frame />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/sf-pro-display"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
