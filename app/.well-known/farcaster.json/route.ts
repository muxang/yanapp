export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjU2NzYwNiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDAxY0M0NmQyNTcwNDcwMzVmNjYxM2M2M0QwODgyM2Q0M0QyMjIyNDQifQ",
      payload: "eyJkb21haW4iOiJ3cmFwYWkuYXBwIn0",
      signature:
        "MHg3NGNkOTc2N2NiZGFiMjczZWRjY2UyZTIzNWEwMjYxMzgzNTdjZjI5MWEwY2Q3MGUwOGQ2N2JiMzk3ZGU0ODMwNjRiZTczYzRiOGI3OTEyNGI5NmFjMzFmNzZkZTg2ZThiMjM0MDYyN2E1YmJhOWIzMjJlZDc4M2ZiZjZhMDY1ZTFi",
    },
    frame: {
      version: "1",
      name: "Example Frame",
      iconUrl: "https://wrapai.app/icon.png",
      homeUrl: "https://wrapai.app",
      imageUrl: "https://wrapai.app/image.png",
      buttonTitle: "Check this out",
      splashImageUrl: "https://wrapai.app/splash.png",
      splashBackgroundColor: "#eeccff",
      webhookUrl: "https://wrapai.app/api/webhook",
    },
  };

  return Response.json(config);
}
