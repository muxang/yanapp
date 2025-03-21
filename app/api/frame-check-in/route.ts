import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { CHECK_IN_ABI } from "../../contracts/abi";
import { getContractConfig } from "../../contracts/config";
import { UserInfo } from "../../contracts/types";

// Farcaster Frame消息的结构接口
interface FrameMessage {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    inputText?: string;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData?: {
    messageBytes: string;
  };
}

// Farcaster用户上下文接口
interface UserContext {
  fid: number;
  username?: string;
  displayName?: string;
  pfp?: string;
  bio?: string;
  location?: {
    placeId: string;
    description: string;
  };
}

// 验证Frame消息
function validateFrameMessage(body: any): boolean {
  // 验证必要的字段是否存在
  if (!body || !body.untrustedData || !body.untrustedData.fid) {
    return false;
  }
  return true;
}

// 获取公共客户端
function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://base.llamarpc.com"
    ),
  });
}

// 获取钱包客户端
function getWalletClient() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("管理员私钥未设置");
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({
    account,
    chain: base,
    transport: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://base.llamarpc.com"
    ),
  });
}

// 获取用户信息
async function getUserInfo(
  userAddress: `0x${string}`
): Promise<UserInfo | null> {
  const publicClient = getPublicClient();
  const config = getContractConfig();

  try {
    const userInfo = (await publicClient.readContract({
      address: config.address,
      abi: CHECK_IN_ABI,
      functionName: "getUserInfo",
      args: [userAddress],
    })) as unknown as UserInfo;

    return userInfo;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
}

// 为用户执行签到
async function checkInForUser(userAddress: `0x${string}`) {
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();
  const config = getContractConfig();

  try {
    // 检查用户是否可以签到
    const canCheckIn = await publicClient.readContract({
      address: config.address,
      abi: CHECK_IN_ABI,
      functionName: "canCheckIn",
      args: [userAddress],
    });

    if (!canCheckIn) {
      return { success: false, message: "今天已经签到过了" };
    }

    // 签到操作
    const hash = await walletClient.writeContract({
      address: config.address,
      abi: CHECK_IN_ABI,
      functionName: "checkIn",
    });

    // 等待交易确认
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // 获取更新后的用户信息
    const updatedUserInfo = await getUserInfo(userAddress);

    return {
      success: true,
      hash: receipt.transactionHash,
      userInfo: updatedUserInfo,
    };
  } catch (error) {
    console.error("签到失败:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "签到操作失败",
    };
  }
}

// 从Farcaster ID获取用户地址
async function getFarcasterUserAddress(
  fid: number
): Promise<`0x${string}` | null> {
  try {
    // 这里应该实现从Farcaster ID获取用户地址的逻辑
    // 可以通过Neynar API或者其他服务
    // 临时演示用
    const mockAddresses: Record<number, `0x${string}`> = {
      // 这里可以添加一些测试FID和地址
      1: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    };

    return mockAddresses[fid] || null;
  } catch (error) {
    console.error("获取用户地址失败:", error);
    return null;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as FrameMessage;

    // 验证Frame消息
    if (!validateFrameMessage(body)) {
      return new NextResponse(
        `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://wrapai.app/images/wrapai-banner.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="https://wrapai.app" />
          </head>
          <body>无效的请求格式</body>
        </html>
        `,
        {
          status: 400,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    // 从untrustedData中获取用户信息
    const { fid } = body.untrustedData;

    // 获取用户地址
    const userAddress = await getFarcasterUserAddress(fid);
    if (!userAddress) {
      return new NextResponse(
        `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://wrapcast.vercel.app/api/frame-error" />
            <meta property="fc:frame:button:1" content="连接钱包" />
            <meta property="fc:frame:button:1:action" content="link" />
            <meta property="fc:frame:button:1:target" content="https://wrapcast.vercel.app" />
          </head>
          <body>无法获取您的钱包地址，请先连接钱包</body>
        </html>
        `,
        {
          status: 400,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    // 尝试为用户签到
    const result = await checkInForUser(userAddress);

    if (!result.success) {
      return new NextResponse(
        `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://wrapcast.vercel.app/api/frame-error" />
            <meta property="fc:frame:button:1" content="返回应用" />
            <meta property="fc:frame:button:1:action" content="link" />
            <meta property="fc:frame:button:1:target" content="https://wrapcast.vercel.app" />
          </head>
          <body>签到失败: ${result.message}</body>
        </html>
        `,
        {
          status: 400,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    // 从结果中获取用户信息
    const userInfo = result.userInfo;
    const points = userInfo ? Number(userInfo.totalPoints || 0) : 0;
    const streak = userInfo ? Number(userInfo.consecutiveCheckIns || 0) : 0;

    // 在图像URL中包含用户信息
    const imageUrl = `https://wrapcast.vercel.app/api/frame-success?points=${points}&streak=${streak}&fid=${fid}`;

    // 返回带有结果的Frame
    return new NextResponse(
      `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="打开应用" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://wrapcast.vercel.app" />
        </head>
        <body>签到成功! 积分: ${points}, 连续签到: ${streak}天</body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("处理frame签到时出错:", error);
    return new NextResponse(
      `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://wrapcast.vercel.app/api/frame-error" />
          <meta property="fc:frame:button:1" content="重试" />
          <meta property="fc:frame:post_url" content="https://wrapcast.vercel.app/api/frame-check-in" />
        </head>
        <body>发生错误</body>
      </html>
      `,
      {
        status: 500,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }
}
