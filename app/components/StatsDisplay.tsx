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
  const [todayEarned, setTodayEarned] = useState("0");

  useEffect(() => {
    // 计算连续签到天数
    const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);

    // 今日积分计算逻辑
    if (isHasCheckedInToday) {
      // 基础积分为10分
      setDailyPoints("10");

      // 计算连续签到奖励 (天数 * 5)
      if (consecutiveDays > 0) {
        const bonus = consecutiveDays * 5;
        setStreakBonus(`+${bonus}`);

        // 今日总收益 = 基础分 + 奖励分
        setTodayEarned(`${10 + bonus}`);
      } else {
        setStreakBonus("+0");
        setTodayEarned("10");
      }
    } else {
      // 今天未签到
      setDailyPoints("0");
      setStreakBonus("+0");
      setTodayEarned("0");
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
      <StatsCard
        label="Today's Points"
        value={todayEarned}
        secondaryText={
          isHasCheckedInToday
            ? `${dailyPoints} base ${streakBonus} bonus`
            : "Check in to earn"
        }
        isLoading={isLoading}
      />
    </div>
  );
}
