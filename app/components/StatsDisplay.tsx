"use client";

import { useUserInfo } from "@/hooks/useContract";
import { UserInfo } from "../contracts";
import { useAccount } from "wagmi";

export function StatsDisplay() {
  const { address } = useAccount();
  const { userInfo, isLoading } = useUserInfo();

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="apple-card animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-12 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!userInfo) {
    return <div className="text-center mt-6 text-gray-500">还没有签到记录</div>;
  }

  const stats = [
    {
      label: "连续签到",
      value: userInfo.consecutiveCheckIns.toString(),
      unit: "天",
    },
    {
      label: "总积分",
      value: userInfo.totalPoints.toString(),
      unit: "分",
    },
    {
      label: "总签到",
      value: userInfo.totalCheckIns.toString(),
      unit: "次",
    },
    {
      label: "上次签到",
      value: new Date(Number(userInfo.lastCheckIn) * 1000).toLocaleDateString(),
      unit: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {stats.map(({ label, value, unit }) => (
        <div key={label} className="apple-card">
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          <div className="text-2xl font-semibold value-animation">
            {value}
            {unit && <span className="text-base ml-1">{unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
