import { NextRequest, NextResponse } from "next/server";

// Set as dynamic route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const points = url.searchParams.get("points") || "10";
    const streak = url.searchParams.get("streak") || "1";
    const fid = url.searchParams.get("fid") || "0";

    // 设置基础URL，优先使用环境变量
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "wrapai.app";
    // 确保URL有https://前缀
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = "https://" + baseUrl;
    }

    // 构建图片URL - 指向一个真实的图片生成端点
    const imageUrl = `${baseUrl}/api/og-image?points=${points}&streak=${streak}&fid=${fid}`;
    const splashImageUrl = `${baseUrl}/logo-large.png`;

    // 根据layout.tsx创建frame对象
    const frame = {
      version: "next",
      imageUrl: imageUrl,
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

    // 构建HTML响应，包含必要的元标签
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WrapAI Check-in Success</title>
          <meta property="og:title" content="WrapAI Check-in Success" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="${JSON.stringify(frame)}" />
        </head>
        <body>
          <p>WrapAI Check-in Success</p>
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
    console.error("Error generating frame:", error);
    return new NextResponse("Error generating frame", { status: 500 });
  }
}
