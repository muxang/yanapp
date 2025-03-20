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
            backgroundColor: "white",
            padding: "40px 20px",
            backgroundImage:
              "linear-gradient(to bottom right, #eeccff22, #4F6AF622)",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#4F6AF6",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
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
              fontSize: "48px",
              fontWeight: "bold",
              color: "#333333",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            WrapAI Points System
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "24px",
              color: "#666666",
              marginBottom: "40px",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            Earn rewards through daily check-ins and build your streak
          </div>

          {/* Check-in Days */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: day <= 3 ? "#4F6AF6" : "#E5E7EB",
                  color: day <= 3 ? "white" : "#6B7280",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                {day}
              </div>
            ))}
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
