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
      className="fixed inset-0 flex flex-col justify-end z-[9999]"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full overflow-hidden shadow-xl animate-slide-up"
        style={{
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
          animation: "slideUp 0.3s ease-out forwards",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>

        <div className="p-5">
          <div className="flex items-center">
            <div className="bg-[#4e7cff] w-12 h-12 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 2h4v4h-4V5zm0 6h4v4h-4v-4zM6 5h4v4H6V5zm0 6h4v4H6v-4zm0 6h12v2H6v-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-gray-800">
                Web3 Check-in
              </h3>
              <p className="text-[13px] text-gray-500">Daily Achievement</p>
            </div>
          </div>
        </div>

        <div className="bg-[#4e7cff] py-8">
          <div className="text-center">
            <div className="text-[72px] leading-none font-bold text-white">
              {data.consecutiveDays}
            </div>
            <div className="text-gray-300 text-sm mt-1">Day Streak</div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Daily Check-in Milestone
          </h3>

          <div className="space-y-3">
            <div className="flex items-center">
              <div className="text-[#4e7cff] w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-700">
                {data.consecutiveDays} days streak
              </span>
            </div>

            <div className="flex items-center">
              <div className="text-[#4e7cff] w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-700">
                {data.earnedPoints} points today
              </span>
            </div>

            <div className="flex items-center">
              <div className="text-[#4e7cff] w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684z" />
                  <path d="M13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-700">
                {data.totalPoints} total points
              </span>
            </div>
          </div>

          <div className="mt-6 pb-6">
            <button
              onClick={shareToWarpcast}
              className="w-full py-3 px-4 bg-[#4e7cff] text-white font-medium rounded-full flex items-center justify-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share to Wrapcast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
