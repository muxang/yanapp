import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background: "linear-gradient(to bottom, #1e293b, #0f172a)",
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
          <h1
            style={{
              fontSize: "48px",
              margin: "0 0 20px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #2563eb, #4f46e5)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Daily Check-in
          </h1>
          <div
            style={{
              fontSize: "24px",
              marginBottom: "40px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            Check in daily to earn points and build your streak for MWGA rewards
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 32px",
              background: "linear-gradient(to right, #2563eb, #4f46e5)",
              borderRadius: "12px",
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Check In Now
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
