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
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#333333",
              marginBottom: "40px",
            }}
          >
            Daily Check-in
          </div>

          {/* Check-in Days */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "40px",
              position: "relative",
              paddingTop: "20px",
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
                  backgroundColor:
                    day === 3 || day === 6 ? "#4F6AF6" : "#E5E7EB",
                  color: day === 3 || day === 6 ? "white" : "#6B7280",
                  fontWeight: "bold",
                  fontSize: "24px",
                  position: "relative",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {day}
                {day % 3 === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-15px",
                      backgroundColor: "#FFA500",
                      color: "white",
                      fontSize: "14px",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      fontWeight: "bold",
                    }}
                  >
                    +{day * 5}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 32px",
              backgroundColor: "#4F6AF6",
              color: "white",
              borderRadius: "40px",
              fontWeight: "bold",
              fontSize: "24px",
              marginBottom: "40px",
              boxShadow: "0 4px 12px rgba(79, 106, 246, 0.3)",
            }}
          >
            <div style={{ marginRight: "8px" }}>✓</div>
            Check In Now
          </div>

          {/* Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "20px",
              color: "#666666",
              textAlign: "center",
            }}
          >
            <div>Check in daily to earn 10 base points</div>
            <div>Earn streak bonus: day × 5 points</div>
            <div>Redeem points for WrapAI rewards</div>
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
