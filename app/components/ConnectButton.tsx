import React from "react";
import { connectWallet } from "../lib/wallet";

interface ConnectButtonProps {
  isConnected: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function ConnectButton({
  isConnected,
  address,
  onConnect,
  onDisconnect,
}: ConnectButtonProps) {
  return (
    <button
      onClick={isConnected ? onDisconnect : onConnect}
      className="w-full max-w-[400px] py-4 px-8 text-xl font-semibold rounded-full transition-all duration-200 bg-[#4F6AF6] text-white hover:bg-[#4059DC] active:bg-[#364AC7] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isConnected
        ? `已连接: ${address?.slice(0, 6)}...${address?.slice(-4)}`
        : "连接钱包"}
    </button>
  );
}
