import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export default function Favicon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #3BA59B 0%, #2A9B8D 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          borderRadius: 16,
        }}
      >
        WF
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
