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
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isHasCheckedInToday } = useHasCheckedInToday();

  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.actions.ready();
        // 自动尝试添加Frame
        await sdk.actions.addFrame();
      } catch (err) {
        console.error("Failed to initialize Frame:", err);
      }
    };
    initFrame();
  }, []);

  // 处理签到
  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setIsSuccess(false);

      // 调用合约签到
      await checkIn();
      await refetch();
      setIsSuccess(true);
    } catch (error) {
      console.error("Check-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算连续签到天数和奖励
  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  const isEligibleForBonus =
    userInfo?.lastCheckIn &&
    Date.now() / 1000 - Number(userInfo.lastCheckIn) <= 86400 * 2;
  const expectedBonusPoints = isEligibleForBonus
    ? (consecutiveDays + 1) * 5
    : 0;

  // 渲染连续签到指示器
  const renderStreakIndicators = () => {
    const indicators = [];
    for (let i = 0; i < 7; i++) {
      indicators.push(
        <div
          key={i}
          className={`w-8 h-8 rounded-full ${
            i < consecutiveDays ? "bg-[#4F6AF6]" : "bg-[#E5E7EB]"
          } flex items-center justify-center text-white`}
        >
          {i + 1}
        </div>
      );
    }
    return <div className="flex gap-2 justify-center mb-4">{indicators}</div>;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {renderStreakIndicators()}

      {isHasCheckedInToday ? (
        <button
          disabled
          className="w-full py-4 px-6 rounded-full bg-gray-200 text-gray-500 font-medium text-lg"
        >
          Already Checked In
        </button>
      ) : (
        <button
          onClick={handleCheckIn}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-full bg-[#4F6AF6] hover:bg-[#4059DC] text-white font-medium text-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span className="text-2xl">✌️</span>
          Check in Now
          {expectedBonusPoints > 0 && (
            <span className="ml-1 bg-[#FFA500] text-white text-sm px-2 py-0.5 rounded-full">
              +{expectedBonusPoints}
            </span>
          )}
        </button>
      )}

      {isSuccess && (
        <div className="mt-4 text-center text-green-500">
          Successfully checked in!
        </div>
      )}
    </div>
  );
}
