"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { useAccount } from "wagmi";
import { CheckInButton } from "./components/CheckInButton";
import { StatsDisplay } from "./components/StatsDisplay";

export default function Home() {
  const { isConnected } = useAccount();
  const [context, setContext] = useState<any>();

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        console.log("Frame context loaded:", ctx);
      } catch (error) {
        console.error("Failed to load frame context:", error);
      }
    };
    loadContext();
  }, []);

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">每日签到</h1>
        <p className="text-gray-600">连续签到获得更多积分</p>
      </div>

      {context && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}

      <div className="space-y-4">
        <CheckInButton />
        {isConnected && <StatsDisplay />}
      </div>
    </div>
  );
}
