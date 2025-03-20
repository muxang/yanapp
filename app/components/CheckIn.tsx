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
import sdk from "@farcaster/frame-sdk";

// 定义FrameContext接口
interface UserContext {
  fid: number;
  username?: string;
  displayName?: string;
  pfp?: string;
  bio?: string;
  location?: {
    placeId: string;
    description: string;
  };
}

interface FrameContext {
  user?: UserContext;
  isAuthenticated?: boolean;
}

export const CheckInButton = () => {
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [isConsecutive, setIsConsecutive] = useState(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { isHasCheckedInToday } = useHasCheckedInToday();

  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.actions.ready();
        setIsFrameLoaded(true);
      } catch (err) {
        console.error("Failed to initialize Frame:", err);
      }
    };
    initFrame();
  }, []);

  const handleSaveFrame = async () => {
    if (!isFrameLoaded) return;
    try {
      await sdk.actions.openUrl(window.location.href);
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save frame:", err);
    }
  };

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
        {isFrameLoaded && !isSaved && (
          <button
            onClick={handleSaveFrame}
            className="mt-4 button-secondary w-full"
          >
            Save Frame
          </button>
        )}
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
          {isFrameLoaded && !isSaved && (
            <button
              onClick={handleSaveFrame}
              className="mt-4 button-secondary w-full"
            >
              Save Frame
            </button>
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

export default function CheckIn() {
  const { address, isConnected } = useAccount();
  const [timeUntilNextCheckIn, setTimeUntilNextCheckIn] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [frameContext, setFrameContext] = useState<FrameContext | null>(null);

  // 使用合约hooks
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const { isHasCheckedInToday } = useHasCheckedInToday();

  // 从合约数据计算是否可以签到
  const canCheckIn = isConnected && !isHasCheckedInToday;

  // 初始化Frame SDK并获取用户上下文
  useEffect(() => {
    async function initFrameSDK() {
      try {
        // 加载SDK
        await sdk.actions.ready();
        setIsFrameLoaded(true);

        // 获取用户上下文
        const context = await sdk.context;
        setFrameContext(context);
        console.log("Frame context:", context);
      } catch (error) {
        console.error("Failed to initialize Frame SDK:", error);
      }
    }

    initFrameSDK();
  }, []);

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

  // 保存Frame到Farcaster
  const handleSaveFrame = async () => {
    if (!isFrameLoaded) return;
    try {
      await sdk.actions.openUrl(window.location.href);
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save frame:", err);
    }
  };

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

  // 获取用户显示名称
  const getUserDisplayName = () => {
    if (frameContext?.user?.displayName) {
      return frameContext.user.displayName;
    }
    if (frameContext?.user?.username) {
      return `@${frameContext.user.username}`;
    }
    if (frameContext?.user?.fid) {
      return `FID: ${frameContext.user.fid}`;
    }
    return "User";
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
          {frameContext?.user && (
            <div className="bg-gray-700 p-4 rounded-lg text-center mb-4">
              <p className="text-gray-300 text-sm">Welcome</p>
              <p className="text-xl font-bold">{getUserDisplayName()}</p>
            </div>
          )}

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

          {isFrameLoaded && (
            <div className="mt-4">
              <button
                onClick={handleSaveFrame}
                disabled={isSaved}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  isSaved
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {isSaved ? "✓ Saved to Farcaster" : "Save to Farcaster"}
              </button>
            </div>
          )}

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
