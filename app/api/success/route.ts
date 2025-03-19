import { createCanvas, GlobalFonts, SKRSContext2D } from "@napi-rs/canvas";
import { NextRequest } from "next/server";
import { join } from "path";

// 注册字体
try {
  GlobalFonts.registerFromPath(
    join(process.cwd(), "public/fonts/SF-Pro-Display-Medium.otf"),
    "SF Pro Display"
  );
} catch (error) {
  console.error("Failed to register font:", error);
}

const width = 1200;
const height = 630;

function createGradientBackground(ctx: SKRSContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#34c759");
  gradient.addColorStop(1, "#32d74b");
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
  glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
  glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, width, height);

  // 绘制成功图标
  ctx.fillStyle = "#ffffff";
  ctx.font = '120px "SF Pro Display"';
  ctx.textAlign = "center";
  ctx.fillText("✓", width / 2, height / 2 - 60);

  // 设置文本样式
  ctx.font = '72px "SF Pro Display"';
  ctx.fillText("签到成功", width / 2, height / 2 + 60);

  const buffer = await canvas.encode("png");
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
