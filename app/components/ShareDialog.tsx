"use client";

import React from "react";
import sdk from "@farcaster/frame-sdk";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    consecutiveDays: number;
    earnedPoints: number;
    totalPoints: number;
  };
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  const shareToWarpcast = () => {
    // 设置基础URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    // 确保URL有https://前缀
    if (
      typeof baseUrl === "string" &&
      !baseUrl.startsWith("http://") &&
      !baseUrl.startsWith("https://")
    ) {
      baseUrl = "https://" + baseUrl;
    }

    // 使用应用主URL但附加积分和连续签到天数作为查询参数
    const shareUrl = `${baseUrl}?points=${data.earnedPoints}&streak=${data.consecutiveDays}`;

    // 构建分享文本
    const shareText = `🎯 Just completed my ${data.consecutiveDays}-day check-in streak on WrapAI! Earned ${data.earnedPoints} points today.`;

    // 创建Warpcast分享URL - 分享应用主URL并带有查询参数
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;

    // 使用Farcaster SDK打开URL
    sdk.actions.openUrl(warpcastUrl);
    onClose(); // 关闭分享对话框
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-[90%] overflow-hidden shadow-xl animate-fade-in"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center">
            <div className="bg-[#6366F1] w-12 h-12 rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 2h4v4h-4V5zm0 6h4v4h-4v-4zM6 5h4v4H6V5zm0 6h4v4H6v-4zm0 6h12v2H6v-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[19px] font-bold text-gray-800">
                Web3 Check-in
              </h3>
              <p className="text-[14px] text-gray-500">Daily Achievement</p>
            </div>
          </div>
        </div>

        <div className="bg-[#6366F1] py-10">
          <div className="text-center">
            <div className="text-[90px] leading-none font-bold text-white">
              {data.consecutiveDays}
            </div>
            <div className="text-gray-300 text-[16px] mt-1">Day Streak</div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-[22px] font-bold text-gray-800 mb-5">
            Daily Check-in Milestone
          </h3>

          <div className="space-y-4 mb-5">
            <div className="flex items-center">
              <div className="text-[#6366F1] w-7 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[17px] font-medium text-gray-700">
                {data.consecutiveDays} days streak
              </span>
            </div>

            <div className="flex items-center">
              <div className="text-[#6366F1] w-7 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                    clipRule="evenodd"
                  />
                  <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                </svg>
              </div>
              <span className="text-[17px] font-medium text-gray-700">
                {data.earnedPoints} points today
              </span>
            </div>

            <div className="flex items-center">
              <div className="text-[#6366F1] w-7 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[17px] font-medium text-gray-700">
                {data.totalPoints} total points
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <button
            onClick={shareToWarpcast}
            className="w-full py-4 bg-[#6366F1] text-white font-medium rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span>Share to Wrapcast</span>
          </button>
        </div>
      </div>
    </div>
  );
};
