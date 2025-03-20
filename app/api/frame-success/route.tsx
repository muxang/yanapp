import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // 获取URL参数
    const { searchParams } = new URL(req.url);
    const points = searchParams.get("points") || "10";

    // 创建一个1200x630的图像
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#059669", // 绿色背景
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
            Check-in Successful!
          </div>
          <div style={{ fontSize: "48px", marginBottom: "40px" }}>
            You earned{" "}
            <span style={{ fontWeight: "bold" }}>{points} points</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", fontSize: "36px" }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span style={{ marginLeft: "12px" }}>Keep your streak going!</span>
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
