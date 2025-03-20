"use client";

import {
  useCheckIn,
  useUserInfo,
  useHasCheckedInToday,
} from "../hooks/useContract";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export default function CheckIn() {
  const { isConnected } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [isConsecutive, setIsConsecutive] = useState(false);

  const { isHasCheckedInToday } = useHasCheckedInToday();

  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.actions.ready();
        await sdk.actions.addFrame();
      } catch (err) {
        console.error("Failed to initialize Frame:", err);
      }
    };
    initFrame();
  }, []);

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
      const bonusPoints = i === 2 ? "+15" : i === 5 ? "+30" : null;
      indicators.push(
        <div key={i} className="relative">
          <div
            className={`w-10 h-10 rounded-full ${
              i < consecutiveDays ? "bg-[#4F6AF6]" : "bg-[#E5E7EB]"
            } flex items-center justify-center text-[#666666] border-2 border-white`}
          >
            {i + 1}
          </div>
          {bonusPoints && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FFA500] text-white text-xs px-2 py-0.5 rounded-full">
              {bonusPoints}
            </div>
          )}
        </div>
      );
    }
    return <div className="flex gap-3 justify-center mb-8">{indicators}</div>;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Daily Check-in</h1>
      <p className="text-gray-500 mb-6">
        Last check-in:{" "}
        {userInfo?.lastCheckIn
          ? new Date(Number(userInfo.lastCheckIn) * 1000).toLocaleDateString()
          : "Never"}
      </p>
      {renderStreakIndicators()}

      <div className="w-full">
        <button
          onClick={handleCheckIn}
          disabled={isLoading || isHasCheckedInToday}
          className={`w-full py-3 px-6 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-medium text-base flex items-center justify-center gap-2 transition-colors ${
            isHasCheckedInToday ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span role="img" aria-label="peace">
            ✌️
          </span>
          Check in Now
        </button>
      </div>

      <div className="mt-12 space-y-4 w-full">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600">Check in daily to earn 10 base points</p>
        <p className="text-gray-600">
          Earn streak bonus: day × 5 points (Day 3 = +15 bonus)
        </p>
        <p className="text-gray-600">
          Redeem points for MWGA rewards in the Rewards tab
        </p>
      </div>
    </div>
  );
}
