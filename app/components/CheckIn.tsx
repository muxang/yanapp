"use client";

import { useAccount, useConnect } from "wagmi";
import { useEffect, useState } from "react";
import { useUserInfo } from "../hooks/useContract";
import { CheckInButton } from "./CheckInButton";
import { useReadContract } from "wagmi";
import { CHECK_IN_ABI } from "../contracts/abi";
import { getContractConfig } from "../contracts/config";
import { config as wagmiConfig } from "./providers/WagmiProvider";
import sdk from "@farcaster/frame-sdk";

// 定义数据类型
interface CheckInSuccessData {
  earnedPoints: number;
  consecutiveDays: number;
  isConsecutive: boolean;
}

export default function CheckIn() {
  const { isConnected, address } = useAccount();
  const { userInfo, refetch } = useUserInfo();
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const config = getContractConfig();
  const { connect } = useConnect();

  // 从合约中获取积分和奖励配置
  const { data: dailyPointsData } = useReadContract({
    address: config.address,
    abi: CHECK_IN_ABI,
    functionName: "dailyPoints",
  });

  const { data: consecutiveBonusData } = useReadContract({
    address: config.address,
    abi: CHECK_IN_ABI,
    functionName: "consecutiveBonus",
  });

  const dailyPoints = dailyPointsData ? Number(dailyPointsData) : 10;
  const consecutiveBonus = consecutiveBonusData
    ? Number(consecutiveBonusData)
    : 5;

  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.actions.ready();
        await sdk.actions.addFrame();
        setIsFrameLoaded(true);
      } catch (err) {
        console.error("Failed to initialize Frame:", err);
      }
    };
    initFrame();
  }, []);

  // 处理CheckInButton组件的成功签到
  const handleCheckInSuccess = (data: CheckInSuccessData) => {
    console.log("Check-in success data received:", data);
    // 刷新用户数据
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const renderStreakIndicators = () => {
    const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);

    return (
      <div className="check-in-days">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div
            key={day}
            className={
              day <= consecutiveDays
                ? "day-circle day-active"
                : "day-circle day-inactive"
            }
          >
            {day}
            {day === 3 && <div className="day-bonus">+15</div>}
            {day === 6 && <div className="day-bonus">+30</div>}
          </div>
        ))}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => connect({ connector: wagmiConfig.connectors[0] })}
          className={`check-in-button`}
        >
          connect wallet
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daily Check-in</h1>
      {renderStreakIndicators()}

      <CheckInButton onCheckInSuccess={handleCheckInSuccess} />

      <div className="mt-12 space-y-3 w-full">
        <h2 className="text-xl font-bold mb-2 text-gray-800">How It Works</h2>
        <p className="text-gray-600">
          Check in daily to earn {dailyPoints} base points
        </p>
        <p className="text-gray-600">
          Earn streak bonus: day × {consecutiveBonus} points (Day 3 = +
          {3 * consecutiveBonus} bonus)
        </p>
        <p className="text-gray-600">
          Redeem points for WrapAI rewards in the Rewards tab
        </p>
      </div>
    </div>
  );
}
