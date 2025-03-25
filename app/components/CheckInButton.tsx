"use client";

import {
  useCheckIn,
  useUserInfo,
  useHasCheckedInToday,
} from "../hooks/useContract";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import { shareToWarpcast } from "../utils/share";

// 定义组件Props接口
interface CheckInButtonProps {
  onCheckInSuccess?: (data: {
    earnedPoints: number;
    consecutiveDays: number;
    isConsecutive: boolean;
  }) => void;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckInSuccess,
}) => {
  const { isConnected, address } = useAccount();
  const { checkIn } = useCheckIn();
  const { userInfo, refetch } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [isConsecutive, setIsConsecutive] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [farcasterUsername, setFarcasterUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const { isHasCheckedInToday, isLoading: isCheckStatusLoading } =
    useHasCheckedInToday();

  // 获取Farcaster用户信息
  useEffect(() => {
    const getFarcasterUser = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;

        if (context?.user) {
          let username = "";
          if (context.user.displayName) {
            username = context.user.displayName;
          } else if (context.user.username) {
            username = `@${context.user.username}`;
          }

          if (username) {
            setFarcasterUsername(username);
          }

          // 获取头像 - 安全地访问pfp属性
          const userPfp =
            context.user && "pfp" in context.user
              ? typeof context.user.pfp === "string"
                ? context.user.pfp
                : ""
              : "";
          if (userPfp) {
            setProfileImage(userPfp);
          }
        }
      } catch (err) {
        console.error("Failed to get Farcaster user:", err);
      }
    };

    getFarcasterUser();
  }, []);

  // 成功后的逻辑
  useEffect(() => {
    if (success) {
      setShowTip(true);
      const timer = setTimeout(() => {
        setShowTip(false);

        // 通知父组件签到成功
        if (onCheckInSuccess) {
          onCheckInSuccess({
            earnedPoints: earnedPoints || 0,
            consecutiveDays: Number(userInfo?.consecutiveCheckIns || 0),
            isConsecutive,
          });
        }

        refetch();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [
    success,
    refetch,
    earnedPoints,
    userInfo,
    isConsecutive,
    onCheckInSuccess,
  ]);

  const handleCheckIn = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // 根据当前的Day ID检查是否是连续签到
      const currentDayId = Math.floor(Date.now() / 86400);
      const lastCheckInDayId = userInfo?.lastCheckInDayId
        ? Number(userInfo.lastCheckInDayId)
        : 0;
      const isConsecutiveCheckIn = lastCheckInDayId === currentDayId - 1;

      // 获取连续签到天数
      const consecutiveDays = isConsecutiveCheckIn
        ? Number(userInfo?.consecutiveCheckIns || 0) + 1
        : 1;

      // 计算预期获得的积分
      const dailyPoints = 10; // 从合约中获取
      const consecutiveBonus = 5; // 从合约中获取
      const expectedPoints =
        dailyPoints +
        (isConsecutiveCheckIn ? consecutiveDays * consecutiveBonus : 0);

      const tx = await checkIn();
      await sdk.actions.ready();

      // 等待交易确认后刷新用户信息
      await refetch();

      setSuccess(true);
      setEarnedPoints(expectedPoints);
      setIsConsecutive(isConsecutiveCheckIn);
    } catch (err) {
      console.error("Check-in error:", err);
      setError("Failed to check in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 检查用户是否可以签到
  const canCheckIn = isConnected && !isHasCheckedInToday;

  // 检查用户是否有资格获得连续签到奖励
  const currentDayId = Math.floor(Date.now() / 86400);
  const lastCheckInDayId = userInfo?.lastCheckInDayId
    ? Number(userInfo.lastCheckInDayId)
    : 0;
  const isEligibleForBonus = lastCheckInDayId === currentDayId - 1;

  // 获取连续签到天数和奖励
  const consecutiveDays = Number(userInfo?.consecutiveCheckIns || 0);
  const dailyPoints = 10; // 从合约中获取
  const consecutiveBonus = 5; // 从合约中获取
  const expectedBonusPoints = isEligibleForBonus
    ? (consecutiveDays + 1) * consecutiveBonus
    : 0;

  // 计算下次签到的等待时间
  const formatTimeRemaining = () => {
    if (!userInfo?.lastCheckIn) return "";

    const lastCheckInTime = Number(userInfo.lastCheckIn);
    const nextCheckInTime = lastCheckInTime + 86400;
    const secondsRemaining = Math.max(0, nextCheckInTime - Date.now() / 1000);

    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  // 获取用户名称
  const getUserName = () => {
    if (farcasterUsername) return farcasterUsername;

    if (address) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return "WrapAI User";
  };

  // 分享处理
  const handleShare = () => {
    const points = isHasCheckedInToday
      ? Number(userInfo?.totalPoints || 0)
      : earnedPoints || 0;

    shareToWarpcast({
      userName: getUserName(),
      consecutiveDays,
      earnedPoints: points,
    });
  };

  // 渲染签到按钮
  const renderCheckInButton = () => {
    if (isHasCheckedInToday || (!canCheckIn && isConnected && userInfo)) {
      return (
        <>
          <button
            disabled
            className="check-in-button !bg-gray-100 !text-gray-400 border border-gray-200"
            style={{ cursor: "not-allowed", opacity: 0.8 }}
          >
            Already Checked In
          </button>
          <div className="text-sm text-center mt-2 text-gray-500">
            Next check-in available in{" "}
            <span className="font-medium text-primary">
              {formatTimeRemaining()}
            </span>
          </div>
        </>
      );
    }

    return (
      <>
        <button
          onClick={handleCheckIn}
          disabled={!canCheckIn || isLoading || isCheckStatusLoading}
          className={`check-in-button ${isLoading ? "opacity-70" : ""}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="loading-spinner mr-2"></span>
              <span>Processing...</span>
            </div>
          ) : (
            <>Check In Now</>
          )}
        </button>

        {isEligibleForBonus && (
          <div className="text-xs text-center mt-2 text-primary">
            Day {consecutiveDays + 1} streak bonus: +{expectedBonusPoints}{" "}
            points
          </div>
        )}
      </>
    );
  };

  return (
    <div className="mt-4 w-full">
      {error && <div className="error-text">{error}</div>}

      <div className="flex flex-col items-center">
        {showTip ? (
          <div className="success-message animate-fade-in w-full mb-4">
            <div className="flex flex-col items-center justify-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl text-green-700 shadow-sm">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">
                  Check-in Successful!
                </h3>
                {earnedPoints && (
                  <p className="text-sm">
                    You've earned{" "}
                    <span className="font-bold">+{earnedPoints} points</span>
                    {isConsecutive && (
                      <span className="block text-xs mt-1">
                        Including {consecutiveDays * consecutiveBonus} bonus
                        points for your {consecutiveDays}-day streak!
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : success ? (
          <div className="check-in-success flex flex-col items-center justify-center mb-4 w-full">
            <div className="text-sm text-gray-700 mb-1">
              Today's check-in complete!
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Next check-in available in{" "}
              <span className="font-medium text-primary">
                {formatTimeRemaining()}
              </span>
            </div>
          </div>
        ) : (
          renderCheckInButton()
        )}

        {/* 分享按钮 - 始终显示 */}
        <div className="share-button-container mt-4">
          <button
            onClick={handleShare}
            className="share-main-btn"
            style={{ display: "flex" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="share-icon"
            >
              <path
                d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.18838C7.54308 8.46953 6.78914 8 5.93558 8C4.31104 8 3 9.31104 3 10.9356C3 12.5601 4.31104 13.8711 5.93558 13.8711C6.78914 13.8711 7.54308 13.4016 8.08261 12.6827L15.0227 16.5005C15.0077 16.6219 15 16.7456 15 16.8711C15 18.5279 16.3431 19.8711 18 19.8711C19.6569 19.8711 21 18.5279 21 16.8711C21 15.2142 19.6569 13.8711 18 13.8711C17.1464 13.8711 16.3925 14.3406 15.853 15.0595L8.91289 11.2416C8.92786 11.1202 8.93558 10.9965 8.93558 10.8711C8.93558 10.7456 8.92786 10.6219 8.91289 10.5005L15.853 6.68273C16.3925 7.40158 17.1464 7.87113 18 7.87113"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Share My Achievement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
