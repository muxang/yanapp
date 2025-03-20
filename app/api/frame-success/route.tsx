import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  // 获取URL参数
  const searchParams = req.nextUrl.searchParams;
  const points = searchParams.get("points") || "10";
  const streak = searchParams.get("streak") || "1";
  const fid = searchParams.get("fid") || "unknown";

  // 可以尝试根据FID获取更多用户信息
  // 这里简单地使用FID作为标识符
  const userInfo = `FID: ${fid}`;

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
          background: "linear-gradient(to bottom, #065f46, #064e3b)",
          padding: "40px",
          color: "white",
          fontFamily: "Inter, sans-serif",
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
              color: "#4ade80",
            }}
          >
            Check-in Success!
          </div>

          <div
            style={{
              fontSize: "22px",
              marginBottom: "10px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {userInfo}
          </div>

          <div
            style={{
              fontSize: "24px",
              marginBottom: "40px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            You earned {points} points
            {Number(streak) > 1 ? ` with a ${streak}-day streak` : ""}!
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "36px", fontWeight: "bold" }}>
                {points}
              </div>
              <div style={{ fontSize: "18px" }}>Points Earned</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "36px", fontWeight: "bold" }}>
                {streak}
              </div>
              <div style={{ fontSize: "18px" }}>
                Day{Number(streak) > 1 ? "s" : ""} Streak
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
