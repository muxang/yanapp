import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import * as React from "react";
import { join } from "path";
import * as fs from "fs";

// 设置为动态路由
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 从URL参数中获取数据
    const url = new URL(req.url);
    const points = url.searchParams.get("points") || "0";
    const streak = url.searchParams.get("streak") || "0";
    const fid = url.searchParams.get("fid") || "未知";

    // 加载字体
    const fontPath = join(process.cwd(), "public", "fonts", "inter-normal.ttf");
    const fontData = fs.readFileSync(fontPath);

    const pointsNum = parseInt(points, 10);
    const streakNum = parseInt(streak, 10);

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
              签到成功!
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
              今日获得积分:
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
              连续签到:
            </div>
            <div
              style={{ fontWeight: "bold", fontSize: "24px", color: "#FF9800" }}
            >
              {streakNum} {streakNum === 1 ? "天" : "天"}
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
              ? `连续签到${streakNum}天！继续保持可获得更多奖励！`
              : "开始你的签到之旅！每天签到可以积累更多奖励。"}
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
            weight: 400,
            style: "normal",
          },
        ],
      }
    );

    // 将SVG转换为PNG（这里实际返回的是SVG）
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    console.error("生成成功图像时出错:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
