import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("userName") || "WrapAI User";
    const streak = searchParams.get("streak") || "1";
    const points = searchParams.get("points") || "10";
    const userAvatar = searchParams.get("userAvatar") || null;

    // 构建分享图片
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            padding: "40px",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {/* Logo and Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                margin: "0",
              }}
            >
              WrapAI
            </h1>
          </div>

          {/* User Achievement */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "32px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "800px",
            }}
          >
            {/* User info with avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  width="80"
                  height="80"
                  style={{
                    borderRadius: "40px",
                    marginRight: "16px",
                    border: "3px solid white",
                  }}
                  alt={username}
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "40px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
              <h2
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {username}'s Achievement
              </h2>
            </div>

            <p
              style={{
                fontSize: "28px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{streak}-Day</span> Check-in
              Streak!
            </p>
            <p
              style={{
                fontSize: "28px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              Earned <span style={{ fontWeight: "bold" }}>{points} points</span>{" "}
              today
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {/* Streak Fire Icons */}
              {[...Array(Math.min(Number(streak), 5))].map((_, i) => (
                <div
                  key={i}
                  style={{
                    margin: "0 8px",
                    fontSize: "36px",
                  }}
                >
                  🔥
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              fontSize: "20px",
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>wrapai.app | Web3 AI Points System</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating share image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
