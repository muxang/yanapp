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
      className="apple-button"
    >
      {isConnected
        ? `已连接: ${address?.slice(0, 6)}...${address?.slice(-4)}`
        : "连接钱包"}
    </button>
  );
}
