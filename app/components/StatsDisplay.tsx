"use client";

import { useUserInfo, useHasCheckedInToday } from "../hooks/useContract";
import { useAccount } from "wagmi";
import { StatsCard } from "./StatsCard";
import { useEffect, useState } from "react";

export function StatsDisplay() {
  const { address } = useAccount();
  const { userInfo, isLoading } = useUserInfo();
  const { isHasCheckedInToday } = useHasCheckedInToday();
  const [streakBonus, setStreakBonus] = useState("0");
  const [dailyPoints, setDailyPoints] = useState("0");

  useEffect(() => {
    // 今日积分计算逻辑
    if (isHasCheckedInToday) {
      // 如果今天已经签到
      setDailyPoints("100");

      // 计算连续签到奖励
      const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
      if (consecutiveDays >= 1) {
        setStreakBonus(`+${10 * consecutiveDays}`);
      } else {
        setStreakBonus("+0");
      }
    } else {
      // 今天未签到
      setDailyPoints("0");
      setStreakBonus("+0");
    }
  }, [userInfo, isHasCheckedInToday]);

  if (!address) {
    return null;
  }

  return (
    <div className="stats-grid animate-slide-up">
      <StatsCard
        label="Total Days"
        value={userInfo?.totalCheckIns.toString() || "0"}
        isLoading={isLoading}
      />
      <StatsCard
        label="Total Points"
        value={userInfo?.totalPoints.toString() || "0"}
        isLoading={isLoading}
      />
      <StatsCard
        label="Streak"
        value={userInfo?.consecutiveCheckIns.toString() || "0"}
        unit="days"
        isLoading={isLoading}
      />
    </div>
  );
}
