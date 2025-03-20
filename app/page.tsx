"use client";

import { useAccount } from "wagmi";
import { StatsDisplay } from "./components/StatsDisplay";
import { useUserInfo, useHasCheckedInToday } from "./hooks/useContract";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import CheckIn from "./components/CheckIn";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { userInfo, isLoading } = useUserInfo();
  const { isHasCheckedInToday } = useHasCheckedInToday();
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (userInfo?.consecutiveCheckIns) {
      setConsecutiveDays(Number(userInfo.consecutiveCheckIns));
    }
    if (userInfo?.totalPoints) {
      setTotalPoints(Number(userInfo.totalPoints));
    }
  }, [userInfo]);

  return (
    <>
      <Head>
        {/* Farcaster Frames v2 meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/api/frame-image" />
        <meta property="fc:frame:button:1" content="Open Check-in App" />
        <meta property="fc:frame:button:1:action" content="post_url" />
        <meta property="fc:frame:post_url" content="/api/frame-interaction" />
      </Head>
      <div className="app-container content-padding">
        {/* Header */}
        <header className="page-header">
          <h1 className="header-title">Daily Check-in</h1>
          <p className="header-subtitle">Earn points for MWGA benefits</p>
          <div className="points-badge">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
            <span>{totalPoints}</span>
          </div>
        </header>

        <main className="animate-fade-in">
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
      </div>
    </>
  );
}
