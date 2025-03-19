"use client";

import { useCheckIn, useUserInfo } from "../contracts";
import { useAccount } from "wagmi";
import { useState } from "react";

export function CheckInButton() {
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      await checkIn();
      await refetch();
    } catch (error) {
      console.error("Check-in failed:", error);
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
    <button
      onClick={handleCheckIn}
      disabled={!canCheckIn || isLoading}
      className={`apple-button ${isLoading ? "pulse-animation" : ""}`}
    >
      {isLoading ? "签到中..." : "每日签到"}
    </button>
  );
}
