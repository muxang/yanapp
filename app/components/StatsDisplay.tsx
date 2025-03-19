"use client";

import { useUserInfo } from "../hooks/useContract";
import { useAccount } from "wagmi";
import { StatsCard } from "./StatsCard";

export function StatsDisplay() {
  const { address } = useAccount();
  const { userInfo, isLoading } = useUserInfo();

  if (!address) {
    return null;
  }

  const stats = [
    {
      label: "连续签到",
      value: userInfo?.consecutiveCheckIns.toString() || "0",
      unit: "天",
    },
    {
      label: "总积分",
      value: userInfo?.totalPoints.toString() || "0",
      unit: "分",
    },
    {
      label: "总签到",
      value: userInfo?.totalCheckIns.toString() || "0",
      unit: "次",
    },
    {
      label: "上次签到",
      value: userInfo?.lastCheckIn
        ? new Date(Number(userInfo.lastCheckIn) * 1000).toLocaleDateString()
        : "-",
    },
  ];

  return (
    <div className="stats-grid animate-slide-up">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
