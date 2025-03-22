import { NextRequest, NextResponse } from "next/server";

// Set as dynamic route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 设置基础URL，优先使用环境变量
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "wrapai.app";
    // 确保URL有https://前缀
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = "https://" + baseUrl;
    }

    // 获取请求数据
    const body = await request.json();
    // 获取用户信息
    const { untrustedData } = body;
    const fid = untrustedData?.fid || "0";

    // 使用logo作为splash图片
    const splashImageUrl = `${baseUrl}/logo-large.png`;

    // 严格按照layout.tsx中的方式创建frame对象
    const frame = {
      version: "next",
      imageUrl: `${baseUrl}/images/wrapai-banner.png`,
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          name: "WrapAI | Daily Check-in System",
          url: baseUrl,
          splashImageUrl: splashImageUrl,
          splashBackgroundColor: "#142B44",
        },
      },
    };

    // 准备HTML响应，包括必要的元标签
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WrapAI Check-in</title>
          <meta property="og:title" content="WrapAI Check-in System" />
          <meta property="og:image" content="${baseUrl}/images/wrapai-banner.png" />
          <meta property="fc:frame" content="${JSON.stringify(frame)}" />
        </head>
        <body>
          <div>
          </div>
        </body>
      </html>
    `;

    // 返回HTML响应
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    console.error("Error processing share:", error);
    return new NextResponse("Error processing share", { status: 500 });
  }
}
