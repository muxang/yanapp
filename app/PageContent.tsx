"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserInfo } from "./hooks/useContract";
import CheckIn from "./components/CheckIn";
import Splash from "./components/Splash";
import { StatsDisplay } from "./components/StatsDisplay";
import sdk from "@farcaster/frame-sdk";
import Link from "next/link";
import NavigationBar from "./components/NavigationBar";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { userInfo } = useUserInfo();
  const [showSplash, setShowSplash] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);
  const [farcasterUsername, setFarcasterUsername] = useState("");

  // 用户的连续签到天数
  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  // 用户的总积分
  const totalPoints = Number(userInfo?.totalPoints || 0);

  // 获取Farcaster用户名
  useEffect(() => {
    const getFarcasterUser = async () => {
      try {
        await sdk.actions.ready();

        const context = await sdk.context;
        console.log("Frame context:", context);

        // 从context获取用户信息，参考profile页面实现
        if (context?.user) {
          let username = "";
          if (context.user.displayName) {
            username = context.user.displayName;
          } else if (context.user.username) {
            username = `@${context.user.username}`;
          }

          if (username) {
            setFarcasterUsername(username);
            console.log("Farcaster username:", username);
          }
        }
      } catch (err) {
        console.error("Failed to initialize Farcaster SDK:", err);
      }
    };

    getFarcasterUser();
  }, []);

  // 获取用户名称 - 优先使用Farcaster用户名，其次使用钱包地址
  const getUserName = () => {
    if (farcasterUsername) return farcasterUsername;

    // 备选：使用钱包地址
    if (address) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return "WrapAI User"; // 默认名称
  };

  useEffect(() => {
    // 检查是否是从外部进入
    const isExternalVisit = !sessionStorage.getItem("hasVisitedWrapAI");
    if (isExternalVisit) {
      setShowSplash(true);
      // 使用 sessionStorage 记录本次会话已访问
      sessionStorage.setItem("hasVisitedWrapAI", "true");
    }
  }, []);

  // 处理Splash完成
  const handleSplashFinish = () => {
    setSplashExiting(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 500);
  };

  // 分享到Warpcast - 优化版，包含用户名和自定义图片
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

    const earnedPoints = totalPoints; // 默认值
    const userName = getUserName();

    // 构建包含用户名的分享文本
    const shareText = `🎯 ${userName} just completed a ${consecutiveDays}-day check-in streak on WrapAI! Earned ${earnedPoints} points today. #WrapAI #Web3`;

    const shareUrl = `${baseUrl}?points=${earnedPoints}&streak=${consecutiveDays}&userName=${userName}`;

    // 构建图片URL - 使用动态图片生成服务

    // 创建Warpcast分享URL - 使用自定义图片
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;

    // 使用Farcaster SDK打开URL
    sdk.actions.openUrl(warpcastUrl);
  };

  return (
    <>
      <div className="app-container">
        {showSplash && (
          <div className={`${splashExiting ? "splash-exit" : ""}`}>
            <Splash onFinish={handleSplashFinish} />
          </div>
        )}

        {!showSplash && (
          <>
            <header className="page-header">
              <h1 className="header-title">WrapAI</h1>
              <p className="header-subtitle">Web3 AI Points System</p>

              {/* 分享按钮 - 优化设计 */}
              <button
                onClick={shareToWarpcast}
                className="points-badge share-btn"
                aria-label="Share to Warpcast"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="share-icon"
                >
                  <path
                    d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.18838C7.54308 8.46953 6.78914 8 5.93558 8C4.31104 8 3 9.31104 3 10.9356C3 12.5601 4.31104 13.8711 5.93558 13.8711C6.78914 13.8711 7.54308 13.4016 8.08261 12.6827L15.0227 16.5005C15.0077 16.6219 15 16.7456 15 16.8711C15 18.5279 16.3431 19.8711 18 19.8711C19.6569 19.8711 21 18.5279 21 16.8711C21 15.2142 19.6569 13.8711 18 13.8711C17.1464 13.8711 16.3925 14.3406 15.853 15.0595L8.91289 11.2416C8.92786 11.1202 8.93558 10.9965 8.93558 10.8711C8.93558 10.7456 8.92786 10.6219 8.91289 10.5005L15.853 6.68273C16.3925 7.40158 17.1464 7.87113 18 7.87113"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Share</span>
              </button>
            </header>

            <main className="animate-fade-in pb-20">
              {/* Context display (for development only) */}
              {process.env.NODE_ENV === "development" && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>isConnected: {isConnected ? "true" : "false"}</div>
                  <div>address: {address}</div>
                  <div>consecutive days: {consecutiveDays}</div>
                  <div>
                    farcaster username: {farcasterUsername || "not available"}
                  </div>
                  <div>displayed name: {getUserName()}</div>
                </div>
              )}

              {/* Stats */}
              <div className="card">
                <h2 className="section-title">Your Stats</h2>
                <StatsDisplay />
              </div>

              {/* Check-in Component */}
              <div className="card">
                <CheckIn />
              </div>
            </main>

            {/* Navigation Bar */}
            <NavigationBar />
          </>
        )}
      </div>
    </>
  );
}
