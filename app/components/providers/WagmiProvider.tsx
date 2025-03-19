"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as Provider, createConfig, Config } from "wagmi";
import { createPublicClient, http } from "viem";
import { frameConnector } from "../../../lib/connector";
import { getContractConfig } from "../../contracts/config";

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
  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
