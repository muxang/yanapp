import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  try {
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
            backgroundColor: "#eeccff",
            backgroundImage:
              "linear-gradient(135deg, #eeccff 0%, #4F6AF6 100%)",
            padding: "50px 30px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              backgroundColor: "#4F6AF6",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              W
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ffffff, #edf2ff)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "20px",
            }}
          >
            WrapAI
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "30px",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "40px",
            }}
          >
            Web3 AI Points System
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              fontSize: "24px",
              color: "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>✓</div>
              <div>Daily Check-ins</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>✓</div>
              <div>Streak Rewards</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>✓</div>
              <div>Web3 Powered</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    console.log(`${error.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
