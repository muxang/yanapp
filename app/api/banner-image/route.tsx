import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import * as React from "react";
import { join } from "path";
import * as fs from "fs";
import sharp from "sharp";

// 设置为动态路由
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 加载字体
    const fontPath = join(process.cwd(), "public", "fonts", "inter-bold.ttf");
    let fontData;
    try {
      fontData = fs.readFileSync(fontPath);
    } catch (error) {
      // 如果字体不存在，使用系统默认字体
      console.warn("Font not found, using default font");
    }

    // 图像尺寸 - 3:2比例
    const width = 1200;
    const height = 800;

    // 使用satori生成SVG
    const svg = await satori(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #A791FF 0%, #655BFC 100%)",
          fontFamily: fontData ? '"Inter"' : "system-ui",
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
            width: "100%",
          }}
        >
          {/* Logo圆形背景 */}
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              backgroundColor: "#5470FF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "40px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            }}
          >
            {/* WrapAI Logo - V形状 */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <path
                d="M30 20L50 70L70 20"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="80" cy="30" r="10" fill="#FFD166" />
              <path
                d="M20 40H40"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Text Content */}
          <h1
            style={{
              fontSize: "120px",
              fontWeight: "bold",
              margin: "0 0 20px 0",
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            WrapAI
          </h1>
          <div
            style={{
              fontSize: "48px",
              opacity: 0.9,
              marginBottom: "60px",
              letterSpacing: "1px",
            }}
          >
            Web3 + AI Points
          </div>

          {/* Call to Action */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              padding: "30px 50px",
              maxWidth: "700px",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <p
              style={{
                fontSize: "32px",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Connect your wallet and start earning points today through daily
              check-ins and AI interactions
            </p>
          </div>
        </div>
      </div>,
      {
        width,
        height,
        fonts: fontData
          ? [
              {
                name: "Inter",
                data: fontData,
                weight: 700 as const,
                style: "normal" as const,
              },
            ]
          : [],
      }
    );

    // 使用sharp将SVG转换为PNG
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    // 将PNG保存到public目录
    const pngPath = join(
      process.cwd(),
      "public",
      "images",
      "wrapai-banner.png"
    );
    fs.writeFileSync(pngPath, pngBuffer);

    // 返回PNG
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=60",
      },
    });
  } catch (error) {
    console.error("生成图像时出错:", error);
    return new NextResponse(`Error generating image: ${error}`, {
      status: 500,
    });
  }
}
