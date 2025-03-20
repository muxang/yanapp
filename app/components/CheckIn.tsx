"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import { useUserInfo } from "../hooks/useContract";
import { CheckInButton } from "./CheckInButton";

export default function CheckIn() {
  const { isConnected } = useAccount();
  const { userInfo } = useUserInfo();

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

  // 渲染连续签到指示器
  const renderStreakIndicators = () => {
    const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
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

      <CheckInButton />

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
