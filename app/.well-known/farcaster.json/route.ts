export async function GET() {
  let i = 1;
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
      name: "WrapAI",
      iconUrl: "https://wrapai.app/logo-hd.png",
      homeUrl: "https://wrapai.app/",
      imageUrl: "https://wrapai.app/images/wrapai-banner.png",
      buttonTitle: "Go To WrapAi",
      splashImageUrl: "https://wrapai.app/logo-large.png",
      splashBackgroundColor: "#eeccff",
      webhookUrl: "https://wrapai.app/api/webhook",
    },
    triggers: {
      type: "cast",
      id: "wrapai",
      url: "https://wrapai.app",
      name: "Check In Now",
    },
  };

  return Response.json(config);
}
