import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import * as React from "react";
import { join } from "path";
import * as fs from "fs";

// Set as dynamic route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get data from URL parameters
    const url = new URL(req.url);
    const points = url.searchParams.get("points") || "0";
    const streak = url.searchParams.get("streak") || "0";
    const fid = url.searchParams.get("fid") || "Unknown";

    // Load font
    const fontPath = join(process.cwd(), "public", "fonts", "inter-bold.ttf");
    const fontData = fs.readFileSync(fontPath);

    const pointsNum = parseInt(points, 10);
    const streakNum = parseInt(streak, 10);

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
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#4CAF50",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
              Check-in Success!
            </h1>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "30px",
            width: "90%",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
              Points Earned Today:
            </div>
            <div
              style={{ fontWeight: "bold", fontSize: "24px", color: "#4CAF50" }}
            >
              +{pointsNum}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
              Consecutive Check-ins:
            </div>
            <div
              style={{ fontWeight: "bold", fontSize: "24px", color: "#FF9800" }}
            >
              {streakNum} {streakNum === 1 ? "day" : "days"}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "16px",
            }}
          >
            {streakNum > 1
              ? `${streakNum} consecutive days! Keep it up for more rewards!`
              : "Start your check-in journey! Daily check-ins will earn you more rewards."}
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
          WrapAI Check-in | FID: {fid}
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

    // Convert SVG to PNG (actually returning SVG)
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    console.error("Error generating success image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
