"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatDistanceToNow } from "date-fns";
import {
  useCheckIn,
  useUserInfo,
  useHasCheckedInToday,
} from "../hooks/useContract";

export default function CheckIn() {
  const { address, isConnected } = useAccount();
  const [timeUntilNextCheckIn, setTimeUntilNextCheckIn] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 使用合约hooks
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const { isHasCheckedInToday } = useHasCheckedInToday();

  // 从合约数据计算是否可以签到
  const canCheckIn = isConnected && !isHasCheckedInToday;

  // 计算下次签到时间
  useEffect(() => {
    if (!isConnected || !userInfo?.lastCheckIn) return;

    const lastCheckInTime = Number(userInfo.lastCheckIn);
    if (lastCheckInTime === 0) return;

    const now = Math.floor(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    const nextCheckInTime = lastCheckInTime + oneDayInSeconds;

    if (now < nextCheckInTime) {
      const updateTimer = () => {
        const secondsLeft = nextCheckInTime - Math.floor(Date.now() / 1000);
        if (secondsLeft <= 0) {
          setTimeUntilNextCheckIn("");
          refetch(); // 刷新签到状态
          clearInterval(intervalId);
        } else {
          setTimeUntilNextCheckIn(
            formatDistanceToNow(nextCheckInTime * 1000, { addSuffix: true })
          );
        }
      };

      updateTimer();
      const intervalId = setInterval(updateTimer, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isConnected, userInfo?.lastCheckIn, refetch]);

  // 处理签到
  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);

      // 调用合约签到
      await checkIn();

      // 刷新用户数据
      await refetch();

      setIsSuccess(true);
    } catch (error) {
      console.error("Check-in error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
      {!isConnected ? (
        <div className="flex flex-col items-center">
          <ConnectButton />
          <p className="mt-4 text-gray-400">Connect wallet to check in</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-2xl font-bold">
                {userInfo ? Number(userInfo.consecutiveCheckIns) : 0}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Total Points</p>
              <p className="text-2xl font-bold">
                {userInfo ? Number(userInfo.totalPoints) : 0}
              </p>
            </div>
          </div>

          <div className="text-center">
            {canCheckIn ? (
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Checking in..." : "Check In Now"}
              </button>
            ) : (
              <div>
                <div className="bg-gray-700 p-4 rounded-lg mb-2">
                  <p className="text-sm text-gray-400">
                    Next check-in available
                  </p>
                  <p className="font-medium">{timeUntilNextCheckIn}</p>
                </div>
                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-700 rounded-lg font-medium opacity-50 cursor-not-allowed"
                >
                  Already Checked In
                </button>
              </div>
            )}
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-500 p-3 rounded-lg">
              <p className="text-green-400">Successfully checked in!</p>
            </div>
          )}

          {isError && (
            <div className="bg-red-900/30 border border-red-500 p-3 rounded-lg">
              <p className="text-red-400">Failed to check in. Try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
