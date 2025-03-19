import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";

export async function GET() {
  // Create a canvas for the frame image (1200x630 is recommended for frames)
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Create Apple-style background
  ctx.fillStyle = "#f9f9f9";
  ctx.fillRect(0, 0, width, height);

  // Add light gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(0, 122, 255, 0.05)");
  gradient.addColorStop(1, "rgba(0, 122, 255, 0.15)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add blue shape in corner
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 122, 255, 0.8)";
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.4, 0);
  ctx.lineTo(0, height * 0.4);
  ctx.closePath();
  ctx.fill();

  // Add title text
  ctx.fillStyle = "#000000";
  ctx.font = 'bold 80px "SF Pro Display", Arial';
  ctx.textAlign = "center";
  ctx.fillText("Daily Check-in", width / 2, height / 2 - 50);

  // Add subtitle
  ctx.font = '40px "SF Pro Display", Arial';
  ctx.fillStyle = "#666666";
  ctx.fillText("Earn points and rewards", width / 2, height / 2 + 50);

  // Add call to action
  ctx.fillStyle = "rgb(0, 122, 255)";
  ctx.font = 'bold 36px "SF Pro Display", Arial';
  ctx.fillText("Tap to check in now", width / 2, height - 100);

  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer("image/png");

  // Return the image as a response
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
