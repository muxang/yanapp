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
  const [showShareButton, setShowShareButton] = useState(false);

  const { isHasCheckedInToday, isLoading: isCheckStatusLoading } =
    useHasCheckedInToday();

  // 成功后的逻辑
  useEffect(() => {
    if (success) {
      setShowTip(true);
      const timer = setTimeout(() => {
        setShowTip(false);
        setShowShareButton(true); // 显示分享按钮
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

  // 分享到Warpcast
  const shareToWarpcast = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    // 构建分享URL，指向支持Farcaster Frame V2规范的端点
    const shareUrl = `${baseUrl}/api/frame-success?points=${
      earnedPoints || 10
    }&streak=${Number(userInfo?.consecutiveCheckIns || 0)}&fid=0`;

    // 构建分享文本
    const shareText = isConsecutive
      ? `🎯 Just completed my ${Number(
          userInfo?.consecutiveCheckIns || 0
        )}-day check-in streak on WrapAI! Earned ${
          earnedPoints || 10
        } points today.`
      : `✅ Just checked in on WrapAI! Earned ${
          earnedPoints || 10
        } points today.`;

    // 创建Warpcast分享URL - 直接分享Frame URL
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;

    // 打开Warpcast
    sdk.actions.openUrl(warpcastUrl);
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
            className="check-in-button !bg-gray-100 !text-gray-400 border border-gray-200"
            style={{ cursor: "not-allowed", opacity: 0.8 }}
          >
            Already Checked In
          </button>
          <div className="text-sm text-center mt-2 text-gray-500">
            Next check-in available in{" "}
            <span className="font-medium text-primary">
              {formatTimeRemaining()}
            </span>
          </div>

          {/* 添加分享按钮，即使已经签到过 */}
          <button
            onClick={shareToWarpcast}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share to Warpcast
          </button>
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
      ) : success && !showShareButton ? (
        <div className="check-in-success flex flex-col items-center justify-center my-2">
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
            <span className="font-medium text-primary">
              {formatTimeRemaining()}
            </span>
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

      {/* 显示分享按钮 */}
      {showShareButton && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={shareToWarpcast}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share to Warpcast
          </button>
        </div>
      )}
    </div>
  );
};
