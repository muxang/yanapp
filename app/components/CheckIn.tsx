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

  // 直接分享到Warpcast，不需要对话框
  const shareToWarpcast = () => {
    // 设置基础URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    // 确保URL有https://前缀
    if (
      typeof baseUrl === "string" &&
      !baseUrl.startsWith("http://") &&
      !baseUrl.startsWith("https://")
    ) {
      baseUrl = "https://" + baseUrl;
    }

    const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
    const totalPoints = Number(userInfo?.totalPoints || 0);
    const earnedPoints = 200; // 假设默认为200，可以根据实际情况调整

    // 使用应用主URL但附加积分和连续签到天数作为查询参数
    const shareUrl = `${baseUrl}?points=${earnedPoints}&streak=${consecutiveDays}`;

    // 构建分享文本
    const shareText = `🎯 Just completed my ${consecutiveDays}-day check-in streak on WrapAI! Earned ${earnedPoints} points today.`;

    // 创建Warpcast分享URL - 分享应用主URL并带有查询参数
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;

    // 使用Farcaster SDK打开URL
    sdk.actions.openUrl(warpcastUrl);
  };

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

      {/* 分享按钮 - 明显位置 */}
      <div className="mt-6 mb-8 w-full max-w-sm">
        <button
          onClick={shareToWarpcast}
          className="w-full py-3.5 px-4 bg-[#6366F1] hover:bg-[#5355D1] text-white font-medium rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:translate-y-[-2px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          <span className="flex-grow text-center">
            Share Check-in Streak to Wrapcast
          </span>
        </button>

        <div className="flex items-center justify-center mt-2">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Earn extra points for sharing
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3 w-full">
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
