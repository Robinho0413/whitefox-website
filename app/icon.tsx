import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "linear-gradient(135deg, #3BA59B 0%, #2A9B8D 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          borderRadius: 28,
        }}
      >
        WF
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
