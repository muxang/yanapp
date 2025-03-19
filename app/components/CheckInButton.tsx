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

      // 等待交易确认
      await sdk.actions.ready();

      // 刷新用户数据
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
    <div>
      <button
        onClick={handleCheckIn}
        disabled={!canCheckIn || isLoading}
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        {isLoading ? "签到中..." : "每日签到"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {!canCheckIn && isConnected && userInfo && (
        <p className="text-gray-500 text-sm mt-2">今日已签到，请明天再来</p>
      )}
    </div>
  );
}
