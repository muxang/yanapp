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

      // 检查是否是连续签到（昨天签到过）
      const isConsecutiveCheckIn = userInfo?.lastCheckIn
        ? Date.now() / 1000 - Number(userInfo.lastCheckIn) <= 86400 * 2
        : false;

      // 获取连续签到天数
      const consecutiveDays = isConsecutiveCheckIn
        ? Number(userInfo?.consecutiveCheckIns || 0) + 1
        : 1;

      // 计算预期获得的积分 - 基础10分 + 连续签到奖励(天数 * 5)
      const streakBonus = isConsecutiveCheckIn ? consecutiveDays * 5 : 0;
      const expectedPoints = 10 + streakBonus;

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

  // 检查用户是否可以签到（智能合约规则：自上次签到以来已经过了至少86400秒）
  const canCheckIn =
    isConnected &&
    userInfo &&
    (!userInfo.lastCheckIn ||
      Date.now() / 1000 - Number(userInfo.lastCheckIn) >= 86400);

  // 检查用户是否有资格获得连续签到奖励
  const isEligibleForBonus =
    userInfo?.lastCheckIn &&
    Date.now() / 1000 - Number(userInfo.lastCheckIn) <= 86400 * 2;

  // 获取连续签到天数和奖励
  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  const expectedBonusPoints = isEligibleForBonus
    ? (consecutiveDays + 1) * 5
    : 0;

  // 计算下次签到的等待时间
  const formatTimeRemaining = () => {
    if (!userInfo?.lastCheckIn) return "";

    const secondsElapsed = Date.now() / 1000 - Number(userInfo.lastCheckIn);
    const secondsRemaining = Math.max(0, 86400 - secondsElapsed);

    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  if (isHasCheckedInToday) {
    return (
      <div className="mt-4 w-full">
        <button className="already-checked-in" disabled>
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Already Checked In Today
        </button>
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
              className="w-5 h-5 text-success mr-1"
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
                  Including {consecutiveDays * 5} bonus points for day{" "}
                  {consecutiveDays} streak!
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
            className={`button-primary w-full ${
              isLoading ? "button-loading" : ""
            }`}
          >
            <svg
              className="w-5 h-5 mr-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            {!isLoading && "Check In Now"}
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
        <div className="text-sm text-center mt-2 text-gray-500">
          Already checked in today, come back tomorrow!
        </div>
      )}
    </div>
  );
};
