import { NextRequest, NextResponse } from "next/server";

// Base URL - keep consistent with layout.tsx
let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "wrapai.app";
// Ensure URL has https:// prefix
if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
  baseUrl = "https://" + baseUrl;
}

// Warpcast Frame URL for direct app entry
const warpcastFrameUrl = `https://warpcast.com/~/frames/launch?domain=wrapai.app`;

// Simplified Farcaster Frame message structure
interface FrameMessage {
  untrustedData: {
    fid: number;
    buttonIndex: number;
  };
}

// Handler for GET requests - required for initial frame loading
export async function GET(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/images/wrapai-banner.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Enter Mini App" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content="${warpcastFrameUrl}" />
        <meta property="fc:frame:image:link" content="${warpcastFrameUrl}" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-check-in" />
        <title>WrapAI Check-in System</title>
      </head>
      <body>
        <p>WrapAI Daily Check-in System</p>
      </body>
    </html>
    `,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as FrameMessage;

    // Validate basic frame message
    // if (!body || !body.untrustedData) {
    //   return generateErrorResponse("Invalid request format");
    // }

    // Any button click should redirect to the app
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: warpcastFrameUrl,
      },
    });
  } catch (error) {
    console.error("Error processing frame request:", error);
    return generateErrorResponse("An error occurred");
  }
}

// Helper function to generate error response
function generateErrorResponse(message: string): NextResponse {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame-error" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Enter Mini App" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content="${warpcastFrameUrl}" />
        <meta property="fc:frame:image:link" content="${warpcastFrameUrl}" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-check-in" />
      </head>
      <body>${message}</body>
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
