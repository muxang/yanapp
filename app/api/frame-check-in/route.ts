import { NextRequest, NextResponse } from "next/server";

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
            <meta property="fc:frame:image" content="https://wrapcast.vercel.app/api/frame-image" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="https://wrapcast.vercel.app/api/frame-check-in" />
          </head>
          <body>Invalid request format</body>
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

    // 尝试使用可信数据获取更多用户信息（如果有的话）
    let username = "User";

    // 模拟检查处理
    const points = 10;
    const streak = Math.floor(Math.random() * 10) + 1; // 模拟连续签到天数

    // 在图像URL中包含用户的FID和其他相关信息
    const imageUrl = `https://wrapcast.vercel.app/api/frame-success?points=${points}&streak=${streak}&fid=${fid}`;

    // 返回带有结果的Frame，包含用户个性化信息
    return new NextResponse(
      `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Go to App" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://wrapcast.vercel.app" />
        </head>
        <body>Check-in successful for FID: ${fid}!</body>
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
    console.error("Error processing frame check-in:", error);
    return new NextResponse(
      `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://wrapcast.vercel.app/api/frame-error" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="https://wrapcast.vercel.app/api/frame-check-in" />
        </head>
        <body>An error occurred</body>
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
