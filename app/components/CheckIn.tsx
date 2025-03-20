"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import { useUserInfo } from "../hooks/useContract";
import { CheckInButton } from "./CheckInButton";

export default function CheckIn() {
  const { isConnected } = useAccount();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.actions.ready();
        await sdk.actions.addFrame();
      } catch (err) {
        console.error("Failed to initialize Frame:", err);
      }
    };
    initFrame();
  }, []);

  const renderStreakIndicators = () => {
    const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);

    // Display all 7 days without any progress bar element
    return (
      <div className="check-in-days">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div
            key={day}
            className={
              day <= consecutiveDays
                ? "day-circle day-active"
                : "day-circle day-inactive"
            }
          >
            {day}
            {day % 3 === 0 && <div className="day-bonus">+{day * 5}</div>}
          </div>
        ))}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daily Check-in</h1>
      {renderStreakIndicators()}

      <CheckInButton />

      <div className="mt-12 space-y-3 w-full">
        <h2 className="text-xl font-bold mb-2 text-gray-800">How It Works</h2>
        <p className="text-gray-600">Check in daily to earn 10 base points</p>
        <p className="text-gray-600">
          Earn streak bonus: day × 5 points (Day 3 = +15 bonus)
        </p>
        <p className="text-gray-600">
          Redeem points for WrapAI rewards in the Rewards tab
        </p>
      </div>
    </div>
  );
}
