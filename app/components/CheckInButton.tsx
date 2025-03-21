"use client";

import {
  useCheckIn,
  useUserInfo,
  useHasCheckedInToday,
} from "../hooks/useContract";
import { useAccount } from "wagmi";
import { useState } from "react";
import sdk from "@farcaster/frame-sdk";

export const CheckInButton = () => {
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [isConsecutive, setIsConsecutive] = useState(false);

  const { isHasCheckedInToday } = useHasCheckedInToday();

  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // 根据当前的Day ID检查是否是连续签到
      const currentDayId = Math.floor(Date.now() / 86400);
      const lastCheckInDayId = userInfo?.lastCheckInDayId
        ? Number(userInfo.lastCheckInDayId)
        : 0;
      const isConsecutiveCheckIn = lastCheckInDayId === currentDayId - 1;

      // 获取连续签到天数
      const consecutiveDays = isConsecutiveCheckIn
        ? Number(userInfo?.consecutiveCheckIns || 0) + 1
        : 1;

      // 计算预期获得的积分 - 基础积分加连续奖励
      // 使用合约中的公式：dailyPoints + (consecutiveCheckIns * consecutiveBonus)
      const dailyPoints = 10; // 从合约中获取
      const consecutiveBonus = 5; // 从合约中获取
      const expectedPoints =
        dailyPoints +
        (isConsecutiveCheckIn ? consecutiveDays * consecutiveBonus : 0);

      const tx = await checkIn();
      await sdk.actions.ready(); // 等待处理完成
      await refetch();

      setSuccess(true);
      setEarnedPoints(expectedPoints);
      setIsConsecutive(isConsecutiveCheckIn);
    } catch (err) {
      console.error("Check-in error:", err);
      setError("Failed to check in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 检查用户是否可以签到（使用合约提供的canCheckIn结果）
  const canCheckIn = isConnected && !isHasCheckedInToday;

  // 检查用户是否有资格获得连续签到奖励
  const currentDayId = Math.floor(Date.now() / 86400);
  const lastCheckInDayId = userInfo?.lastCheckInDayId
    ? Number(userInfo.lastCheckInDayId)
    : 0;
  const isEligibleForBonus = lastCheckInDayId === currentDayId - 1;

  // 获取连续签到天数和奖励
  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  const dailyPoints = 10; // 从合约中获取
  const consecutiveBonus = 5; // 从合约中获取
  const expectedBonusPoints = isEligibleForBonus
    ? (consecutiveDays + 1) * consecutiveBonus
    : 0;

  // 计算下次签到的等待时间
  const formatTimeRemaining = () => {
    if (!userInfo?.lastCheckIn) return "";

    const lastCheckInTime = Number(userInfo.lastCheckIn);
    const nextCheckInTime = lastCheckInTime + 86400;
    const secondsRemaining = Math.max(0, nextCheckInTime - Date.now() / 1000);

    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  if (isHasCheckedInToday) {
    return (
      <div className="mt-4 w-full">
        <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-lg py-3 px-4 text-green-700">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className="font-medium">Today's check-in completed</span>
        </div>
        <div className="text-sm text-center mt-2 text-gray-500">
          Next check-in available in{" "}
          <span className="font-medium text-primary">
            {formatTimeRemaining()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      {error && <div className="error-text">{error}</div>}

      {success ? (
        <div className="success-text animate-fade-in flex flex-col items-center justify-center gap-2">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-success mr-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Check-in successful!
          </div>
          {earnedPoints && (
            <div className="text-center">
              <span className="font-bold">+{earnedPoints} points</span> earned
              {isConsecutive && (
                <div className="text-xs text-primary">
                  Including {consecutiveDays * consecutiveBonus} bonus points
                  for day {consecutiveDays} streak!
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={handleCheckIn}
            disabled={!canCheckIn || isLoading}
            className="check-in-button"
          >
            <svg
              className="check-in-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: "16px", height: "16px" }}
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {!isLoading ? "Check In Now" : "Loading..."}
          </button>

          {isEligibleForBonus && (
            <div className="text-xs text-center mt-2 text-primary">
              Day {consecutiveDays + 1} streak bonus: +{expectedBonusPoints}{" "}
              points
            </div>
          )}
        </>
      )}

      {!canCheckIn && isConnected && userInfo && !success && (
        <div className="text-xs text-center mt-2 text-gray-500 max-w-[200px] mx-auto">
          Already checked in today, come back tomorrow!
        </div>
      )}
    </div>
  );
};
