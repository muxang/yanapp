"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as Provider, createConfig } from "wagmi";
import { http } from "viem";
import { base } from "wagmi/chains";
import { frameConnector } from "../../../lib/connector";
import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [frameConnector()],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // 禁用自动重试
      refetchOnWindowFocus: false, // 禁用窗口聚焦时重新获取
      staleTime: 5000, // 数据5秒内认为是新鲜的
    },
  },
});

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

  if (!isSDKLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">加载中...</h1>
        </div>
      </div>
    );
  }

  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </Provider>
  );
}
