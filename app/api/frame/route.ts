import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";

// This endpoint handles the frame action (check-in)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract the Farcaster user info from the frame message
    const { fid, address } = body.trustedData.messageBytes;

    // TODO: Interact with the smart contract using the user's FID and address
    // This would require server-side contract interaction using ethers.js

    // For now, we'll return a success message
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://wrapcast.vercel.app";

    return NextResponse.json({
      image: `${baseUrl}/api/success`, // Image showing check-in success
      text: "You've successfully checked in! Open the app to see your points.",
    });
  } catch (error) {
    console.error("Error processing frame action:", error);
    return NextResponse.json(
      { error: "Failed to process check-in" },
      { status: 500 }
    );
  }
}

// Fallback GET method
export async function GET() {
  return NextResponse.json({ message: "Use POST method to check in" });
}
