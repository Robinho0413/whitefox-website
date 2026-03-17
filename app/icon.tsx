import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default async function Icon() {
  const logoBuffer = await readFile(join(process.cwd(), "public", "images", "logo-black.png"));
  const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 28,
          overflow: "hidden",
        }}
      >
        <img
          src={logoDataUri}
          alt="Whitefox Cheer"
          width={168}
          height={168}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
