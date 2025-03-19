import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";

export async function GET() {
  // Create a canvas for the success image
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Create Apple-style background
  ctx.fillStyle = "#f9f9f9";
  ctx.fillRect(0, 0, width, height);

  // Add light gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(52, 199, 89, 0.05)");
  gradient.addColorStop(1, "rgba(52, 199, 89, 0.15)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add green shape in corner
  ctx.beginPath();
  ctx.fillStyle = "rgba(52, 199, 89, 0.8)";
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.4, 0);
  ctx.lineTo(0, height * 0.4);
  ctx.closePath();
  ctx.fill();

  // Draw success circle
  const centerX = width / 2;
  const centerY = height / 2 - 50;
  const radius = 80;

  // Draw circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgb(52, 199, 89)";
  ctx.fill();

  // Draw checkmark
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY);
  ctx.lineTo(centerX - 10, centerY + 20);
  ctx.lineTo(centerX + 30, centerY - 20);
  ctx.lineWidth = 12;
  ctx.strokeStyle = "white";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Add success message
  ctx.fillStyle = "#000000";
  ctx.font = 'bold 60px "SF Pro Display", Arial';
  ctx.textAlign = "center";
  ctx.fillText("Check-in Successful!", width / 2, height / 2 + 100);

  // Add points message
  ctx.font = '36px "SF Pro Display", Arial';
  ctx.fillStyle = "#666666";
  ctx.fillText("Open the app to see your points", width / 2, height / 2 + 170);

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
