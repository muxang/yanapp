"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as Provider, createConfig, Config } from "wagmi";
import { createPublicClient, http } from "viem";
import { frameConnector } from "../../../lib/connector";
import { getContractConfig } from "../../contracts/config";
import { useEffect, useState } from "react";

const contractConfig = getContractConfig();

const config = createConfig({
  chains: [contractConfig.chain],
  client: ({ chain }) =>
    createPublicClient({
      chain,
      transport: http(),
    }),
  connectors: [frameConnector()],
}) satisfies Config;

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [isFrame, setIsFrame] = useState(false);

  useEffect(() => {
    // 检查是否在 Frame 环境中
    try {
      const frameContext = window?.parent !== window;
      setIsFrame(frameContext);
    } catch (error) {
      console.warn("Failed to detect frame context:", error);
      setIsFrame(false);
    }
  }, []);

  if (!isFrame) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">请在 Farcaster 中打开</h1>
          <p className="text-gray-600">
            此应用需要在 Farcaster Frame 环境中运行。
          </p>
        </div>
      </div>
    );
  }

  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
