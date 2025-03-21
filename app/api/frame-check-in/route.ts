import { NextRequest, NextResponse } from "next/server";

// Base URL - keep consistent with layout.tsx
let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "wrapai.app";
// Ensure URL has https:// prefix
if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
  baseUrl = "https://" + baseUrl;
}

// Simplified Farcaster Frame message structure
interface FrameMessage {
  untrustedData: {
    fid: number;
    buttonIndex: number;
  };
}

// Render v2 frame response
function renderFrameResponse(
  title: string,
  description: string,
  imageUrl: string
) {
  // Create frame JSON object for Farcaster V2
  const frame = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Enter Mini App",
      action: {
        type: "launch_frame",
        name: title,
        url: baseUrl,
        splashImageUrl: imageUrl,
        splashBackgroundColor: "#142B44",
      },
    },
  };

  // Generate HTML with metadata
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="fc:frame" content="${JSON.stringify(frame)}" />
  </head>
  <body>
    <p>${description}</p>
  </body>
</html>`;
}

// Handler for GET requests - required for initial frame loading
export async function GET(req: NextRequest): Promise<NextResponse> {
  const title = "WrapAI Check-in System";
  const description =
    "Earn points through daily check-ins and redeem for Web3 rewards";
  const imageUrl = `${baseUrl}/images/wrapai-banner.png`;

  return new NextResponse(renderFrameResponse(title, description, imageUrl), {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as FrameMessage;

    // Validate basic frame message
    if (!body || !body.untrustedData) {
      const title = "WrapAI - Error";
      const description = "Invalid request format";
      const imageUrl = `${baseUrl}/api/frame-error`;

      return new NextResponse(
        renderFrameResponse(title, description, imageUrl),
        {
          status: 400,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    // Any button click should redirect to the app
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: baseUrl,
      },
    });
  } catch (error) {
    console.error("Error processing frame request:", error);

    const title = "WrapAI - Error";
    const description = "An error occurred";
    const imageUrl = `${baseUrl}/api/frame-error`;

    return new NextResponse(renderFrameResponse(title, description, imageUrl), {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}
