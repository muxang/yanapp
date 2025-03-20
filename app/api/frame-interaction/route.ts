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
    const { fid, buttonIndex, inputText } = message;
    console.log(`User ${fid} clicked button ${buttonIndex}`, inputText);

    // 根据按钮索引处理不同的交互
    switch (buttonIndex) {
      case 1: {
        // 用户点击了"Open Check-in App"按钮
        // 在这里，我们将返回一个HTML响应，使Farcaster客户端重定向到应用
        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="/api/frame-image" />
              <meta property="fc:frame:button:1" content="Check In Now" />
              <meta property="fc:frame:button:1:action" content="post_url" />
              <meta property="fc:frame:post_url" content="/api/frame-check-in" />
              <meta property="og:title" content="MWGA Daily Check-in" />
              <meta property="fc:frame:state" content="${Buffer.from(
                JSON.stringify({ fid })
              ).toString("base64")}" />
            </head>
            <body>
              <p>Redirecting to check-in app...</p>
              <script>
                window.location.href = "https://${req.headers.get("host")}";
              </script>
            </body>
          </html>`,
          {
            headers: {
              "Content-Type": "text/html",
            },
          }
        );
      }
      default:
        return new NextResponse("Invalid button index", { status: 400 });
    }
  } catch (error) {
    console.error("Error processing frame interaction:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
