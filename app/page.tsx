"use client";

import { useAccount } from "wagmi";
import { CheckInButton } from "./components/CheckInButton";
import { StatsDisplay } from "./components/StatsDisplay";
import { useUserInfo, useHasCheckedInToday } from "./hooks/useContract";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { userInfo, isLoading } = useUserInfo();
  const { isHasCheckedInToday } = useHasCheckedInToday();
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  useEffect(() => {
    if (userInfo?.consecutiveCheckIns) {
      setConsecutiveDays(Number(userInfo.consecutiveCheckIns));
    }
  }, [userInfo]);

  return (
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
          <span>
            {userInfo?.totalPoints ? Number(userInfo.totalPoints) : 0}
          </span>
        </div>
      </header>

      <main>
        {/* Streak Card */}
        <div className="card">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">
              {consecutiveDays}
            </div>
            <div className="text-gray-500 mb-1">Consecutive Days</div>
            {userInfo?.lastCheckIn && (
              <div className="last-check-in">
                Last check-in: {isHasCheckedInToday ? "Today" : "Yesterday"}
              </div>
            )}
            <p className="text-gray-600 mb-5">
              {consecutiveDays > 0
                ? `You're on a ${consecutiveDays} day streak!`
                : "You haven't checked in yet"}
            </p>

            {/* Day Circles */}
            <div className="check-in-days">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`day-circle ${
                    day <= consecutiveDays ? "day-active" : "day-inactive"
                  }`}
                >
                  {day}
                  {day === 6 && <span className="day-bonus">+10</span>}
                </div>
              ))}
            </div>

            <CheckInButton />
          </div>
        </div>

        {/* Stats Section */}
        {isConnected && <StatsDisplay />}

        {/* Rules Card */}
        <div className="card">
          <h2 className="section-title">
            <svg
              className="w-5 h-5 text-secondary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
            Check-in Points Rules
          </h2>

          <div className="rules-list">
            <div className="rule-item">
              <svg
                className="w-5 h-5 text-success"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>Daily check-in: +100 points per day</span>
            </div>
            <div className="rule-item">
              <svg
                className="w-5 h-5 text-success"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>3 days consecutive: +50 points bonus</span>
            </div>
            <div className="rule-item">
              <svg
                className="w-5 h-5 text-success"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>7 days consecutive: +100 points bonus</span>
            </div>
            <div className="rule-item">
              <svg
                className="w-5 h-5 text-success"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>15 days consecutive: +150 points bonus</span>
            </div>
            <div className="rule-item">
              <svg
                className="w-5 h-5 text-success"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>30 days consecutive: +250 points bonus</span>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link href="/" className="nav-item active">
          <svg className="nav-icon" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
          <span>Check-in</span>
        </Link>
        <Link href="/rewards" className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
          </svg>
          <span>Rewards</span>
        </Link>
        <Link href="/profile" className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
