import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // 创建一个1200x630的图像，这是frames推荐的尺寸
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#1E40AF", // 蓝色背景
            color: "white",
            padding: "40px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            MWGA Daily Check-in
          </div>
          <div style={{ fontSize: "36px", marginBottom: "40px" }}>
            Earn points for MWGA benefits
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "20px 40px",
              borderRadius: "16px",
              fontSize: "32px",
              marginTop: "20px",
            }}
          >
            Tap to check in and earn rewards
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new NextResponse("Failed to generate image", { status: 500 });
  }
}
