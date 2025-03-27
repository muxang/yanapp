"use client";

import { useCheckIn, useUserInfo } from "../hooks/useContract";
import { useAccount, useReadContract } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { shareToWarpcast } from "../utils/share";
import { CHECK_IN_ABI } from "../contracts/abi";
import { getContractConfig } from "../contracts/config";
import { toast } from "react-hot-toast";
import { cn } from "../utils/cn";
import { CheckCircle, Calendar, Share2 } from "lucide-react";
import { usePoints } from "../hooks/usePoints";
import { useHasCheckedInToday } from "../hooks/useHasCheckedInToday";
import { useConsecutiveDays } from "../hooks/useConsecutiveDays";
import { useToast } from "../hooks/useToast";

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

  const config = getContractConfig();
  const { data: dailyPoints } = useReadContract({
    address: config.address,
    abi: CHECK_IN_ABI,
    functionName: "dailyPoints",
    query: {
      enabled: true,
      staleTime: 5000,
    },
  });

  const { data: consecutiveBonus } = useReadContract({
    address: config.address,
    abi: CHECK_IN_ABI,
    functionName: "consecutiveBonus",
    query: {
      enabled: true,
      staleTime: 5000,
    },
  });

  const { isHasCheckedInToday, isLoading: isCheckingIn } =
    useHasCheckedInToday();
  const { addPoints } = usePoints();

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

        // 刷新数据
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

  const handleShare = async () => {
    try {
      const currentPoints = Number(userInfo?.totalPoints || 0);
      await shareToWarpcast({
        userName: getUserName(),
        consecutiveDays: Number(userInfo?.consecutiveCheckIns || 0),
        earnedPoints: currentPoints,
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!isConnected || isHasCheckedInToday) return;

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
      const expectedPoints =
        Number(dailyPoints || 0) +
        (isConsecutiveCheckIn
          ? consecutiveDays * Number(consecutiveBonus || 0)
          : 0);

      await checkIn();
      await addPoints(expectedPoints);

      // 更新状态
      setSuccess(true);
      setEarnedPoints(expectedPoints);
      setIsConsecutive(isConsecutiveCheckIn);

      // 等待一段时间确保数据已更新
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 刷新数据
      await refetch();

      // 分享
      await handleShare();

      toast.success("Check-in successful!");
    } catch (error) {
      console.error("Check-in failed:", error);
      setError("Failed to check in. Please try again.");
      toast.error("Failed to check in");
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
  const expectedBonusPoints = isEligibleForBonus
    ? (consecutiveDays + 1) * Number(consecutiveBonus || 0)
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

  // 渲染签到按钮
  const renderCheckInButton = () => {
    if (isHasCheckedInToday) {
      return (
        <>
          <button
            disabled
            className="check-in-button !bg-gray-100 !text-gray-400 border border-gray-200"
            style={{ cursor: "not-allowed", opacity: 0.8 }}
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Already Checked In</span>
            </div>
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

    if (!isConnected) {
      return (
        <button
          disabled
          className="check-in-button !bg-gray-100 !text-gray-400 border border-gray-200"
          style={{ cursor: "not-allowed", opacity: 0.8 }}
        >
          <div className="flex items-center justify-center">
            <span>Connect Wallet to Check In</span>
          </div>
        </button>
      );
    }

    return (
      <>
        <button
          onClick={handleCheckIn}
          disabled={isLoading || isCheckingIn}
          className={cn("check-in-button", isLoading && "opacity-70")}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="loading-spinner mr-2"></span>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Check In Now</span>
            </div>
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
                        Including{" "}
                        {consecutiveDays * Number(consecutiveBonus || 0)} bonus
                        points for your {consecutiveDays}-day streak!
                      </span>
                    )}
                  </p>
                )}
              </div>
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
            <Share2 className="w-4 h-4 mr-2" />
            <span>Share My Achievement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
