"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserInfo } from "./hooks/useContract";
import CheckIn from "./components/CheckIn";
import Splash from "./components/Splash";
import { StatsDisplay } from "./components/StatsDisplay";
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
              <div className="points-badge">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{totalPoints} Points</span>
              </div>
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
