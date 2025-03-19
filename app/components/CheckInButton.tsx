"use client";

import { useCheckIn, useUserInfo } from "../hooks/useContract";
import { useAccount } from "wagmi";
import { useState } from "react";
import sdk from "@farcaster/frame-sdk";

export function CheckInButton() {
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setError(null);
      const tx = await checkIn();
      await sdk.actions.ready();
      await refetch();
    } catch (error) {
      console.error("Check-in failed:", error);
      setError("签到失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const canCheckIn =
    isConnected &&
    userInfo &&
    (!userInfo.lastCheckIn ||
      Date.now() / 1000 - Number(userInfo.lastCheckIn) >= 86400);

  return (
    <div className="animate-slide-up">
      <button
        onClick={handleCheckIn}
        disabled={!canCheckIn || isLoading}
        className={`button-primary w-full ${isLoading ? "button-loading" : ""}`}
      >
        {isLoading ? "签到中..." : "每日签到"}
      </button>
      {error && <p className="error-text">{error}</p>}
      {!canCheckIn && isConnected && userInfo && (
        <div className="success-text flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>今日已签到，请明天再来</span>
        </div>
      )}
    </div>
  );
}
