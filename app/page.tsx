import { Metadata } from "next";
import Home from "./PageContent";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wrapai.app";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}): Promise<Metadata> {
  // 原有 generateMetadata 内容保持不变
  const points =
    typeof searchParams.points === "string" ? searchParams.points : "0";
  const streak =
    typeof searchParams.streak === "string" ? searchParams.streak : "0";

  const userName =
    typeof searchParams.userName === "string"
      ? searchParams.userName
      : "WrapAi User";

  const userAvatar =
    typeof searchParams.userAvatar === "string" ? searchParams.userAvatar : "";

  // 构建OG图片URL
  let imageUrl = `${baseUrl}/images/wrapai-banner.png`;

  if (Number(points) > 0) {
    imageUrl = `${baseUrl}/api/og-image?points=${points}&streak=${streak}&userName=${userName}`;

    // 如果有头像，添加到URL参数中
    if (userAvatar) {
      imageUrl += `&userAvatar=${encodeURIComponent(userAvatar)}`;
    }
  }

  const frame = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Check In",
      action: {
        type: "launch_frame",
        name: "WrapAI | Daily Check-in System",
        url: baseUrl,
        splashImageUrl: `${baseUrl}/logo-large.png`,
        splashBackgroundColor: "#142B44",
      },
    },
  };

  return {
    title: "WrapAI | Daily Check-in System",
    description: "Earn points through daily check-ins...",
    openGraph: {
      title: "WrapAI | Daily Check-in System",
      description:
        "Earn points through daily check-ins and redeem for exclusive Web3 rewards",
      images: [imageUrl],
    },
    other: { "fc:frame": JSON.stringify(frame) },
  };
}
export default function Page() {
  return <Home />;
}
