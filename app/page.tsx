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
      const ctx = await sdk.context;
      setContext(ctx);
    };
    loadContext();
  }, []);

  return (
    <div className="w-[300px] mx-auto py-6 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[--primary] to-[--primary-dark] bg-clip-text text-transparent">
          每日签到
        </h1>
        <p className="text-[--text-secondary]">连续签到获得更多积分</p>
      </div>

      <div className="space-y-6">
        <CheckInButton />
        {isConnected && <StatsDisplay />}
      </div>

      {context && process.env.NODE_ENV === "development" && (
        <div className="card mt-6 text-xs">
          <pre className="overflow-x-auto">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
