"use client";

import React from "react";
import { WagmiProvider } from "./components/providers/WagmiProvider";
import { ShareDialogProvider } from "./context/ShareDialogContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <ShareDialogProvider>{children}</ShareDialogProvider>
    </WagmiProvider>
  );
}
