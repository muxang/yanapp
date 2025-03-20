import { NextRequest, NextResponse } from "next/server";

// 简单验证函数，实际生产环境需要更健壮的验证
function validateFrameMessage(body: any) {
  // 检查必要字段
  if (!body.untrustedData || !body.untrustedData.fid) {
    return { isValid: false, message: null };
  }

  // 返回处理后的消息结构
  return {
    isValid: true,
    message: {
      fid: body.untrustedData.fid,
      buttonIndex: body.untrustedData.buttonIndex || 0,
      inputText: body.untrustedData.inputText || "",
      state: body.untrustedData.state || "",
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    // 从请求中获取帧数据
    const body = await req.json();

    // 验证帧消息
    const { isValid, message } = validateFrameMessage(body);
    if (!isValid || !message) {
      return new NextResponse("Invalid frame message", { status: 400 });
    }

    // 提取用户信息
    const { fid, buttonIndex } = message;

    // 获取之前存储的状态
    const frameState = message.state
      ? JSON.parse(Buffer.from(message.state, "base64").toString())
      : {};
    console.log(`User ${fid} clicked button ${buttonIndex}`, frameState);

    // 处理签到逻辑
    // 注意：这里只是模拟，实际应用中你需要连接到合约进行真正的签到
    const success = true; // 假设签到成功
    const pointsEarned = 10; // 假设获得10积分

    // 返回签到结果
    if (success) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="/api/frame-success?points=${pointsEarned}" />
            <meta property="fc:frame:button:1" content="Open App for More" />
            <meta property="fc:frame:button:1:action" content="link" />
            <meta property="fc:frame:button:1:target" content="https://${req.headers.get(
              "host"
            )}" />
            <meta property="og:title" content="MWGA Daily Check-in - Success!" />
          </head>
          <body>
            <p>Check-in successful! You earned ${pointsEarned} points.</p>
          </body>
        </html>`,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    } else {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="/api/frame-error" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:button:1:action" content="post_url" />
            <meta property="fc:frame:post_url" content="/api/frame-interaction" />
            <meta property="og:title" content="MWGA Daily Check-in - Failed" />
          </head>
          <body>
            <p>Check-in failed. Please try again.</p>
          </body>
        </html>`,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error processing check-in:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
