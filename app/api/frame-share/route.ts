import { NextRequest, NextResponse } from "next/server";

// Set as dynamic route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 设置基础URL，优先使用环境变量
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wrapai.app";

    // 获取请求数据
    const body = await request.json();
    // 获取用户信息
    const { untrustedData } = body;
    const fid = untrustedData?.fid || "0";

    // 准备HTML响应，包括必要的元标签
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WrapAI Check-in</title>
          <meta property="og:title" content="WrapAI Check-in System" />
          <meta property="og:image" content="${baseUrl}/images/wrapai-banner.png" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/images/wrapai-banner.png" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="Open App" />
          <meta property="fc:frame:button:1:action" content="post_redirect" />
          <meta property="fc:frame:button:1:target" content="${baseUrl}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-check-in" />
        </head>
        <body>
          <p>Thanks for sharing your WrapAI Check-in!</p>
          <script>
            // 重定向到应用首页
            window.location.href = "${baseUrl}";
          </script>
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
