// 确保目录存在
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 创建宣传图
async function generateBanner() {
  try {
    // 紫色渐变背景
    const width = 1200;
    const height = 800;

    // 创建一个基础的SVG图片
    const svgImage = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A791FF" />
          <stop offset="100%" stop-color="#655BFC" />
        </linearGradient>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#gradient)" />
      
      <!-- Logo Circle -->
      <circle cx="${width / 2}" cy="280" r="90" fill="#5470FF" />
      
      <!-- Logo V shape -->
      <path d="M ${width / 2 - 40} 230 L ${width / 2} 330 L ${
      width / 2 + 40
    } 230" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="${width / 2 + 50}" cy="240" r="10" fill="#FFD166" />
      <path d="M ${width / 2 - 60} 260 L ${
      width / 2 - 20
    } 260" stroke="white" stroke-width="8" stroke-linecap="round" fill="none" />
      
      <!-- Text -->
      <text x="${
        width / 2
      }" y="450" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="rgba(255, 255, 255, 0.9)" text-anchor="middle">WrapAI</text>
      <text x="${
        width / 2
      }" y="520" font-family="Arial, sans-serif" font-size="48" fill="rgba(255, 255, 255, 0.9)" text-anchor="middle">Web3 + AI Points</text>
      
      <!-- Call to Action Background -->
      <rect x="${
        width / 2 - 350
      }" y="580" width="700" height="160" rx="20" ry="20" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" />
      
      <!-- Call to Action Text -->
      <text x="${
        width / 2
      }" y="660" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle">Connect your wallet and start earning points</text>
      <text x="${
        width / 2
      }" y="700" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle">through daily check-ins and AI interactions</text>
    </svg>
    `;

    // 确保目录存在
    const imagesDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // 将SVG转换为PNG并保存
    const outputPath = path.join(imagesDir, "wrapai-banner.png");
    await sharp(Buffer.from(svgImage)).png().toFile(outputPath);

    console.log(`Banner generated successfully at ${outputPath}`);
  } catch (error) {
    console.error("Error generating banner:", error);
  }
}

generateBanner();
