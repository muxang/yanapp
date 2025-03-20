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
      setError("Check-in failed, please try again");
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
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
        {isLoading ? "Checking in..." : "Check in Now"}
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
          <span>Already checked in today, come back tomorrow!</span>
        </div>
      )}
    </div>
  );
}
