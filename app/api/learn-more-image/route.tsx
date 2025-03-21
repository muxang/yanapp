import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import * as React from "react";
import { join } from "path";
import * as fs from "fs";

// Set as dynamic route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Load font
    const fontPath = join(process.cwd(), "public", "fonts", "inter-bold.ttf");
    const fontData = fs.readFileSync(fontPath);

    // Generate SVG using satori
    const svg = await satori(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#142B44",
          backgroundImage: "linear-gradient(to bottom right, #142B44, #1F3E5A)",
          fontFamily: '"Inter"',
          color: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            WrapAI Check-in System
          </h1>
          <div
            style={{ fontSize: "20px", textAlign: "center", maxWidth: "80%" }}
          >
            Earn points daily and get rewards by maintaining your streak
          </div>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "30px",
            width: "85%",
            marginTop: "10px",
          }}
        >
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                marginBottom: "10px",
                color: "#4CAF50",
              }}
            >
              How It Works:
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 20px", fontSize: "18px" }}>
              <li style={{ marginBottom: "10px" }}>
                Check in daily to earn base points
              </li>
              <li style={{ marginBottom: "10px" }}>
                Get bonus rewards on day 3 (+15) and day 6 (+30)
              </li>
              <li style={{ marginBottom: "10px" }}>
                Maintain your streak for maximum benefits
              </li>
              <li style={{ marginBottom: "10px" }}>
                Redeem points for exclusive perks and features
              </li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#FFC107",
            }}
          >
            Start your check-in journey today!
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            fontSize: "14px",
            opacity: 0.7,
          }}
        >
          WrapAI Check-in System
        </div>
      </div>,
      {
        width: 600,
        height: 400,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    // Return SVG
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating learn more image:", error);
    return new NextResponse("Failed to generate image", { status: 500 });
  }
}
