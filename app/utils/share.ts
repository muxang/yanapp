import sdk from "@farcaster/frame-sdk";

interface ShareData {
  userName: string;
  consecutiveDays: number;
  earnedPoints: number;
}

/**
 * 分享到Warpcast的通用函数
 */
export const shareToWarpcast = async (data: ShareData) => {
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

  const { userName, consecutiveDays, earnedPoints } = data;

  // 从 SDK 上下文中获取用户头像
  let userAvatar = "";
  try {
    await sdk.actions.ready();
    const context = await sdk.context;

    // 安全地获取头像URL
    if (
      context?.user &&
      "pfpUrl" in context.user &&
      typeof context.user.pfpUrl === "string"
    ) {
      userAvatar = context.user.pfpUrl;
    }
  } catch (err) {
    console.error("Failed to get user avatar from Farcaster SDK:", err);
  }

  // 构建包含用户名的分享文本
  // 定义可能的用户名列表
  const userNames = [
    "@nonlinear.eth",
    "@alok",
    "@hades",
    "@ted",
    "@matthew",
    "@giu",
    "@keccers.eth",
    "@tayyab",
    "@brenner.eth",
    "@0xluo.eth",
    "@jacek",
    "@proxystudio.eth",
    "@six",
    "@woj.eth",
    "@antimofm.eth",
    "@corbin.eth",
    "@scharf",
    "@colin",
    "@july",
    "@balajis.eth",
    "@gt",
    "@nick",
    "@0xdesigner",
    "@pfista",
    "@zachterrell",
    "@adrienne",
    "@yitong",
    "@vgr",
  ];

  // 随机选择一个用户名
  const randomUser = userNames[Math.floor(Math.random() * userNames.length)];

  const shareText = `🎯 ${userName} just completed a ${consecutiveDays}-day check-in streak on WrapAI! Earned ${earnedPoints} points today.`;

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
