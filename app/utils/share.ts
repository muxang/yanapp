import sdk from "@farcaster/frame-sdk";

interface ShareData {
  userName: string;
  consecutiveDays: number;
  earnedPoints: number;
  userAvatar?: string; // 添加用户头像URL可选参数
}

/**
 * 分享到Warpcast的通用函数
 */
export const shareToWarpcast = (data: ShareData) => {
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

  const { userName, consecutiveDays, earnedPoints, userAvatar } = data;

  // 构建包含用户名的分享文本
  const shareText = `🎯 ${userName} just completed a ${consecutiveDays}-day check-in streak on WrapAI! Earned ${earnedPoints} points today. #WrapAI #Web3`;

  // 构建URL参数，包含头像
  const shareParams = new URLSearchParams();
  shareParams.append("points", earnedPoints.toString());
  shareParams.append("streak", consecutiveDays.toString());
  shareParams.append("userName", userName);
  if (userAvatar) {
    shareParams.append("userAvatar", userAvatar);
  }

  const shareUrl = `${baseUrl}?${shareParams.toString()}`;

  // 创建Warpcast分享URL
  const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
    shareText
  )}&embeds[]=${encodeURIComponent(shareUrl)}`;

  // 使用Farcaster SDK打开URL
  sdk.actions.openUrl(warpcastUrl);
};
