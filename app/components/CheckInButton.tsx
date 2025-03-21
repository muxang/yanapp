"use client";

import {
  useCheckIn,
  useUserInfo,
  useHasCheckedInToday,
} from "../hooks/useContract";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
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
  const [showTip, setShowTip] = useState(false);

  const { isHasCheckedInToday, isLoading: isCheckStatusLoading } =
    useHasCheckedInToday();

  // 成功后的刷新逻辑
  useEffect(() => {
    if (success) {
      setShowTip(true);
      const timer = setTimeout(() => {
        setShowTip(false);
        refetch();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, refetch]);

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

      // 计算预期获得的积分
      const dailyPoints = 10; // 从合约中获取
      const consecutiveBonus = 5; // 从合约中获取
      const expectedPoints =
        dailyPoints +
        (isConsecutiveCheckIn ? consecutiveDays * consecutiveBonus : 0);

      const tx = await checkIn();
      await sdk.actions.ready();

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

  // 检查用户是否可以签到
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

  if (isHasCheckedInToday || (!canCheckIn && isConnected && userInfo)) {
    return (
      <div className="mt-4 w-full">
        <div className="flex flex-col items-center">
          <button
            disabled
            className="check-in-button bg-gray-200 hover:bg-gray-200 text-gray-500"
            style={{ cursor: "not-allowed" }}
          >
            Already Checked In
          </button>
          <div className="text-sm text-center mt-2 text-gray-500">
            Next check-in available in{" "}
            <span className="font-medium text-primary">
              {formatTimeRemaining()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      {error && <div className="error-text">{error}</div>}

      {showTip ? (
        <div className="success-message animate-fade-in">
          <div className="flex flex-col items-center justify-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl text-green-700 shadow-sm">
            <div className="success-icon-container mb-3">
              <svg
                className="w-12 h-12 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="currentColor"
                  strokeWidth="2"
                ></circle>
                <path
                  d="M7 13l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">
                Check-in Successful!
              </h3>
              {earnedPoints && (
                <p className="text-sm">
                  You've earned{" "}
                  <span className="font-bold">+{earnedPoints} points</span>
                  {isConsecutive && (
                    <span className="block text-xs mt-1">
                      Including {consecutiveDays * consecutiveBonus} bonus
                      points for your {consecutiveDays}-day streak!
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : success ? (
        <div className="flex justify-center my-2">
          <div className="loading-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={handleCheckIn}
            disabled={!canCheckIn || isLoading || isCheckStatusLoading}
            className={`check-in-button ${isLoading ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="loading-spinner mr-2"></span>
                <span>Processing...</span>
              </div>
            ) : (
              <>Check In Now</>
            )}
          </button>

          {isEligibleForBonus && (
            <div className="text-xs text-center mt-2 text-primary">
              Day {consecutiveDays + 1} streak bonus: +{expectedBonusPoints}{" "}
              points
            </div>
          )}
        </>
      )}
    </div>
  );
};
