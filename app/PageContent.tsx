"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserInfo } from "./hooks/useContract";
import CheckIn from "./components/CheckIn";
import Splash from "./components/Splash";
import { StatsDisplay } from "./components/StatsDisplay";
import sdk from "@farcaster/frame-sdk";
import Link from "next/link";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { userInfo } = useUserInfo();
  const [showSplash, setShowSplash] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);

  // 用户的连续签到天数
  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  // 用户的总积分
  const totalPoints = Number(userInfo?.totalPoints || 0);

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

  // 分享到Warpcast
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

    const earnedPoints = 200; // 默认值
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

              {/* 分享按钮替代Points显示 */}
              <button
                onClick={shareToWarpcast}
                className="points-badge"
                aria-label="Share to Warpcast"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            <nav className="nav-bar">
              <Link href="/" className="nav-item active">
                <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                <span>Check-in</span>
              </Link>
              <Link href="/rewards" className="nav-item">
                <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
                </svg>
                <span>Rewards</span>
              </Link>
              <Link href="/profile" className="nav-item">
                <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span>Profile</span>
              </Link>
            </nav>
          </>
        )}
      </div>
    </>
  );
}
