"use client";

import {
  useCheckIn,
  useUserInfo,
  useHasCheckedInToday,
} from "../hooks/useContract";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

// 定义组件Props接口
interface CheckInButtonProps {
  onCheckInSuccess?: (data: {
    earnedPoints: number;
    consecutiveDays: number;
    isConsecutive: boolean;
  }) => void;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckInSuccess,
}) => {
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [isConsecutive, setIsConsecutive] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);

  const { isHasCheckedInToday, isLoading: isCheckStatusLoading } =
    useHasCheckedInToday();

  // 成功后的逻辑
  useEffect(() => {
    if (success) {
      setShowTip(true);
      const timer = setTimeout(() => {
        setShowTip(false);

        // 通知父组件签到成功
        if (onCheckInSuccess) {
          onCheckInSuccess({
            earnedPoints: earnedPoints || 0,
            consecutiveDays: Number(userInfo?.consecutiveCheckIns || 0),
            isConsecutive,
          });
        }

        refetch();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [
    success,
    refetch,
    earnedPoints,
    userInfo,
    isConsecutive,
    onCheckInSuccess,
  ]);

  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setShowShareButton(false);

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
      <div className="w-full">
        <div className="flex flex-col items-center">
          <button
            disabled
            className="w-full bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-full flex items-center justify-center"
            style={{ cursor: "not-allowed", opacity: 0.8 }}
          >
            Already Checked In
          </button>
          <div className="text-sm text-center mt-2 text-gray-500">
            Next check-in available in{" "}
            <span className="font-medium text-[#4776E6]">
              {formatTimeRemaining()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="text-red-500 text-sm text-center mb-2">{error}</div>
      )}

      {showTip ? (
        <div className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl text-green-700 shadow-sm">
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
        <div className="flex flex-col items-center justify-center my-2">
          <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center mb-1">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div className="text-sm text-gray-700 mb-1">
            Today's check-in complete!
          </div>
          <div className="text-xs text-gray-500">
            Next check-in available in{" "}
            <span className="font-medium text-[#4776E6]">
              {formatTimeRemaining()}
            </span>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={handleCheckIn}
            disabled={!canCheckIn || isLoading || isCheckStatusLoading}
            className={`w-full bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center ${
              isLoading ? "opacity-70" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Check in Now"
            )}
          </button>

          {isEligibleForBonus && (
            <div className="text-xs text-center mt-2 text-[#4776E6]">
              Day {consecutiveDays + 1} streak bonus: +{expectedBonusPoints}{" "}
              points
            </div>
          )}
        </>
      )}
    </div>
  );
};
