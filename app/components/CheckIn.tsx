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
import Image from "next/image";

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

  // 分享到Warpcast - 分享成就
  const shareToWarpcast = async () => {
    try {
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

      // 计算今日获得的积分（基础分 + 连续奖励）
      const basePoints = 100; // 基础签到积分
      const streakBonus = consecutiveDays * consecutiveBonus; // 连续签到奖励
      const earnedPoints = basePoints + streakBonus; // 总积分

      // 获取用户名 - 尝试从 SDK 获取
      let userName = "";
      let userAvatar = ""; // 存储用户头像URL

      // 获取Farcaster用户上下文
      const context = await sdk.context;

      // 尝试获取Farcaster用户信息
      if (context?.user?.displayName) {
        userName = context.user.displayName;
      } else if (context?.user?.username) {
        userName = `@${context.user.username}`;
      }

      // 获取用户头像
      if (context?.user?.pfpUrl) {
        userAvatar = context.user.pfpUrl;
      }

      // 如果没有Farcaster用户名，使用钱包地址
      if (!userName && address) {
        userName = `${address.substring(0, 6)}...${address.substring(
          address.length - 4
        )}`;
      } else if (!userName) {
        userName = "WrapAI User"; // 默认用户名
      }

      // 构建包含用户名的分享文本
      const shareText = `🎯 ${userName} just completed a ${consecutiveDays}-day check-in streak on WrapAI! Earned ${earnedPoints} points today. #WrapAI #Web3`;

      // 构建分享URL，包含参数以生成分享图片
      const shareUrl = `${baseUrl}?points=${earnedPoints}&streak=${consecutiveDays}&userName=${encodeURIComponent(
        userName
      )}`;

      // 创建图片URL，包含用户头像参数
      let imageUrl = `${baseUrl}/api/share-image?username=${encodeURIComponent(
        userName
      )}&streak=${consecutiveDays}&points=${earnedPoints}`;

      // 如果有用户头像，添加到图片URL
      if (userAvatar) {
        imageUrl += `&avatar=${encodeURIComponent(userAvatar)}`;
      }

      // 创建Warpcast分享URL - 使用自定义图片
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        shareText
      )}&embeds[]=${encodeURIComponent(shareUrl)}&embeds[]=${encodeURIComponent(
        imageUrl
      )}`;

      // 使用Farcaster SDK打开URL
      sdk.actions.openUrl(warpcastUrl);
    } catch (error) {
      console.error("Error sharing to Warpcast:", error);
    }
  };

  const renderStreakIndicators = () => {
    const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);

    return (
      <div className="flex justify-center gap-2 mb-6 mt-4 overflow-x-auto py-4 px-2">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div
            key={day}
            className={`relative flex items-center justify-center h-[33px] w-[33px] rounded-full border ${
              day <= consecutiveDays
                ? "bg-[#4776E6] text-white border-none"
                : day === 7
                ? "bg-white text-[#8A8A8E] border-dashed border-[#E0E0E0]"
                : "bg-[#EAEAEA] text-[#8A8A8E] border-none"
            } text-sm font-bold`}
          >
            {day}
            {day === 7 && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#FF9800] text-white text-[7px] font-bold px-2 py-[1px] rounded">
                +10
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto p-4 bg-white rounded-[20px] shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-[#333333]">
          Daily Check-in
        </h1>
        <p className="text-sm text-[#4B5563] opacity-80 mb-4">
          Earn points for Web3 benefits
        </p>
        <button
          onClick={() => connect({ connector: wagmiConfig.connectors[0] })}
          className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white font-bold py-3 px-6 rounded-full w-full max-w-[280px] flex items-center justify-center gap-2 shadow-lg"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  const totalDays = Number(userInfo?.totalCheckIns || 0);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white rounded-t-[20px] p-5">
        <h1 className="text-2xl font-bold mb-1">Daily Check-in</h1>
        <p className="text-sm opacity-80">Earn points for Web3 benefits</p>
        <div className="bg-white/20 rounded-full mt-4 py-1 px-3 inline-flex items-center">
          <span className="text-white font-bold">0</span>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-md p-5 -mt-4">
        <div className="flex flex-col items-center mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-3 text-[#333333]">
            <span className="text-[#FF9800]">⭐</span>
            Check-in Points Rules
          </h2>
          <ul className="space-y-2 w-full">
            <li className="flex items-center gap-2">
              <span className="text-[#4CAF50]">✓</span>
              <span className="text-[#333333]">
                Daily check-in: +{dailyPoints} points per day
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#4CAF50]">✓</span>
              <span className="text-[#333333]">
                Consecutive check-ins: +{consecutiveBonus} points × days in
                streak
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#4CAF50]">✓</span>
              <span className="text-[#333333]">
                Example: 7-day streak = +{dailyPoints + 7 * consecutiveBonus}{" "}
                points
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#4CAF50]">✓</span>
              <span className="text-[#333333]">
                Example: 30-day streak = +{dailyPoints + 30 * consecutiveBonus}{" "}
                points
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#4CAF50]">✓</span>
              <span className="text-[#333333]">
                Missing a day resets your streak to 1
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-[20px] shadow-md p-5 mb-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-3 text-[#333333]">
              <span className="text-[#FF9800]">⭐</span>
              Web3 Rewards
            </h2>
            <p className="text-center text-[#4B5563] text-sm">
              Exciting Web3 rewards are coming soon! Keep checking in to
              accumulate points.
            </p>
            <button className="bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white text-sm font-bold py-2 px-4 rounded-full mt-3 flex items-center justify-center gap-1">
              <span>🔍</span> Learn More
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-md p-5 mb-6">
          <div className="flex flex-col items-center mb-4">
            <span className="text-[40px] font-bold bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-transparent bg-clip-text">
              {consecutiveDays}
            </span>
            <span className="text-[#8A8A8E] text-sm">Consecutive Days</span>
            <span className="text-[#8A8A8E] text-xs mt-1">
              {consecutiveDays > 0
                ? `${consecutiveDays} day streak!`
                : "You haven't checked in yet"}
            </span>
          </div>

          {renderStreakIndicators()}

          <CheckInButton onCheckInSuccess={handleCheckInSuccess} />

          <div className="border-t border-[#F0F0F0] mt-4 pt-4 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <span className="text-[#4776E6] font-bold text-lg">
                {totalDays}
              </span>
              <span className="text-[#8A8A8E] text-xs">Total Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#4776E6] font-bold text-lg">+100</span>
              <span className="text-[#8A8A8E] text-xs">Today's Points</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#4776E6] font-bold text-lg">
                +{consecutiveDays * consecutiveBonus}
              </span>
              <span className="text-[#8A8A8E] text-xs">Streak Bonus</span>
            </div>
          </div>

          {consecutiveDays > 0 && (
            <button
              onClick={shareToWarpcast}
              className="bg-gradient-to-r from-[#FF9800] to-[#F44336] text-white font-bold py-3 px-6 rounded-full w-full mt-4 flex items-center justify-center gap-2 shadow-md opacity-80"
            >
              <span>🔗</span> Share My Achievement
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
