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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wrapai.app";

    // 构建图片URL - 指向一个真实的图片生成端点
    const imageUrl = `${baseUrl}/api/og-image?points=${points}&streak=${streak}&fid=${fid}`;
    const splashImageUrl = `${baseUrl}/images/wrapai-banner.png`;

    // 构建HTML响应，包含必要的元标签
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WrapAI Check-in Success</title>
          <meta property="og:title" content="WrapAI Check-in Success" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="View App" />
          <meta property="fc:frame:button:1:action" content="post_redirect" />
          <meta property="fc:frame:button:1:target" content="${baseUrl}" />
          <meta property="fc:frame:button:2" content="Share Again" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-share" />
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
