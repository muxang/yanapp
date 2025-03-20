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
      label: "Total Days",
      value: userInfo?.totalCheckIns.toString() || "0",
    },
    {
      label: "Today's Points",
      value: "+100",
    },
    {
      label: "Streak Bonus",
      value: Number(userInfo?.consecutiveCheckIns || 0) >= 3 ? "+50" : "+0",
    },
  ];

  return (
    <div className="stats-grid animate-slide-up">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
