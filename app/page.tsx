"use client";

import { CheckInButton } from "./components/CheckInButton";
import { StatsDisplay } from "./components/StatsDisplay";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="container mx-auto px-4 py-8 max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">每日签到</h1>
        <p className="text-gray-600">连续签到获得更多积分</p>
      </div>

      <div className="space-y-6">
        <CheckInButton />
        {isConnected && <StatsDisplay />}
      </div>
    </main>
  );
}
