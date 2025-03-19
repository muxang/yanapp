import sharp from "sharp";
import { NextRequest } from "next/server";

const width = 1200;
const height = 630;

export async function GET(req: NextRequest) {
  // 创建一个渐变背景
  const svg = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.1)" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <text x="50%" y="285" font-family="SF Pro Display" font-size="72" fill="white" text-anchor="middle">每日签到</text>
      <text x="50%" y="355" font-family="SF Pro Display" font-size="36" fill="rgba(255,255,255,0.8)" text-anchor="middle">连续签到获得更多积分</text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
