"use client";

import React from "react";
import { WagmiProvider } from "./components/providers/WagmiProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProvider>{children}</WagmiProvider>;
}
