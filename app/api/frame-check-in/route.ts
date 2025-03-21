import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { CHECK_IN_ABI } from "../../contracts/abi";
import { getContractConfig } from "../../contracts/config";
import { UserInfo } from "../../contracts/types";

// Base URL - keep consistent with layout.tsx
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wrapai.app";

// Farcaster Frame message structure interface
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

// Farcaster user context interface
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

// Validate Frame message
function validateFrameMessage(body: any): boolean {
  // Verify if necessary fields exist
  if (!body || !body.untrustedData || !body.untrustedData.fid) {
    return false;
  }
  return true;
}

// Get public client
function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://base.llamarpc.com"
    ),
  });
}

// Get wallet client
function getWalletClient() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Admin private key not set");
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

// Get user information
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
    console.error("Failed to get user info:", error);
    return null;
  }
}

// Perform check-in for user
async function checkInForUser(userAddress: `0x${string}`) {
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();
  const config = getContractConfig();

  try {
    // Check if user can check in
    const canCheckIn = await publicClient.readContract({
      address: config.address,
      abi: CHECK_IN_ABI,
      functionName: "canCheckIn",
      args: [userAddress],
    });

    if (!canCheckIn) {
      return { success: false, message: "Already checked in today" };
    }

    // Check-in operation
    const hash = await walletClient.writeContract({
      address: config.address,
      abi: CHECK_IN_ABI,
      functionName: "checkIn",
    });

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Get updated user information
    const updatedUserInfo = await getUserInfo(userAddress);

    return {
      success: true,
      hash: receipt.transactionHash,
      userInfo: updatedUserInfo,
    };
  } catch (error) {
    console.error("Check-in failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Check-in operation failed",
    };
  }
}

// Get user address from Farcaster ID
async function getFarcasterUserAddress(
  fid: number
): Promise<`0x${string}` | null> {
  try {
    // Implement logic to get user address from Farcaster ID
    // Can use Neynar API or other services
    // For demonstration purposes
    const mockAddresses: Record<number, `0x${string}`> = {
      // Add some test FIDs and addresses here
      1: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    };

    return mockAddresses[fid] || null;
  } catch (error) {
    console.error("Failed to get user address:", error);
    return null;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as FrameMessage;

    // Validate Frame message
    if (!validateFrameMessage(body)) {
      return new NextResponse(
        `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/images/wrapai-banner.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-check-in" />
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

    // Get user info and button index from untrustedData
    const { fid, buttonIndex, inputText } = body.untrustedData;

    // Handle "Learn More" button click (button index 2)
    if (buttonIndex === 2) {
      return new NextResponse(
        `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/learn-more-image" />
            <meta property="fc:frame:button:1" content="Start Check-in" />
            <meta property="fc:frame:button:1:action" content="post_redirect" />
            <meta property="fc:frame:button:1:target" content="${baseUrl}" />
            <meta property="fc:frame:button:2" content="Back" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-check-in" />
          </head>
          <body>View WrapAI Check-in System Details</body>
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

    // Handle "Check In Now" button click (button index 1)
    // For post_redirect buttons, we redirect directly to the app
    if (buttonIndex === 1) {
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: baseUrl,
        },
      });
    }

    // Get user address
    const userAddress = await getFarcasterUserAddress(fid);
    if (!userAddress) {
      // Return redirect to app
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: baseUrl,
        },
      });
    }

    // Attempt to check in for user
    const result = await checkInForUser(userAddress);

    if (!result.success) {
      return new NextResponse(
        `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/frame-error" />
            <meta property="fc:frame:button:1" content="Return to App" />
            <meta property="fc:frame:button:1:action" content="post_redirect" />
            <meta property="fc:frame:button:1:target" content="${baseUrl}" />
          </head>
          <body>Check-in failed: ${result.message}</body>
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

    // Get user info from result
    const userInfo = result.userInfo;
    const points = userInfo ? Number(userInfo.totalPoints || 0) : 0;
    const streak = userInfo ? Number(userInfo.consecutiveCheckIns || 0) : 0;

    // Include user info in image URL
    const imageUrl = `${baseUrl}/api/frame-success?points=${points}&streak=${streak}&fid=${fid}`;

    // Return Frame with result
    return new NextResponse(
      `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Open App" />
          <meta property="fc:frame:button:1:action" content="post_redirect" />
          <meta property="fc:frame:button:1:target" content="${baseUrl}" />
        </head>
        <body>Check-in successful! Points: ${points}, Consecutive Check-ins: ${streak} days</body>
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
          <meta property="fc:frame:image" content="${baseUrl}/api/frame-error" />
          <meta property="fc:frame:button:1" content="Retry" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-check-in" />
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
