import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // 创建一个1200x630的错误图像
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#DC2626", // 红色背景
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
            Check-in Failed
          </div>
          <div style={{ fontSize: "36px", marginBottom: "40px" }}>
            Something went wrong with your check-in
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
            Please try again
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
