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
        "Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    console.error("Error generating error image:", error);
    return new NextResponse("Failed to generate image", { status: 500 });
  }
}
