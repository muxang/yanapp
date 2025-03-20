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
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, #991b1b, #7f1d1d)",
            padding: "40px",
            color: "white",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#fca5a5",
              }}
            >
              Error Occurred
            </div>

            <div
              style={{
                fontSize: "24px",
                marginBottom: "40px",
                maxWidth: "80%",
                textAlign: "center",
              }}
            >
              Something went wrong with your check-in request
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px 32px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "20px",
              }}
            >
              Try Again
            </div>
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
