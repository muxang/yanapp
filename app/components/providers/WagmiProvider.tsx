"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as Provider, createConfig } from "wagmi";
import { http } from "viem";
import { base, degen, mainnet, optimism, unichain } from "wagmi/chains";
import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

export const config = createConfig({
  chains: [base, optimism, mainnet, degen, unichain],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
    [mainnet.id]: http(),
    [degen.id]: http(),
    [unichain.id]: http(),
  },
  connectors: [farcasterFrame()],
});

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
        setError(null);
      } catch (error) {
        console.error("Failed to initialize Frame SDK:", error);
        setError("Failed to initialize Frame SDK");
      }
    };
    load();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-500">错误</h1>
          <p className="text-gray-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">
            请在 Farcaster Frame 中打开此应用
          </p>
        </div>
      </div>
    );
  }

  // if (!isSDKLoaded) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-100">
  //       <div className="rounded-lg bg-white p-8 shadow-lg">
  //         <h1 className="mb-4 text-2xl font-bold">加载中...</h1>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
