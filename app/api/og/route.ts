import { createCanvas, GlobalFonts, SKRSContext2D } from "@napi-rs/canvas";
import { NextRequest } from "next/server";
import path from "path";

// 注册字体
GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/SF-Pro-Display-Medium.otf"),
  "SF Pro Display"
);

const width = 1200;
const height = 630;

function createGradientBackground(ctx: SKRSContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1a1a1a");
  gradient.addColorStop(1, "#2a2a2a");
  return gradient;
}

export async function GET(req: NextRequest) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 设置背景
  ctx.fillStyle = createGradientBackground(ctx);
  ctx.fillRect(0, 0, width, height);

  // 添加光效
  const glowGradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width / 2
  );
  glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
  glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, width, height);

  // 设置文本样式
  ctx.font = '72px "SF Pro Display"';
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("每日签到", width / 2, height / 2 - 40);

  ctx.font = '36px "SF Pro Display"';
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText("连续签到获得更多积分", width / 2, height / 2 + 40);

  const buffer = await canvas.encode("png");
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
