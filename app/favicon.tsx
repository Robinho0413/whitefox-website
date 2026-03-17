import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = {
  width: 48,
  height: 48,
};

export default async function Favicon() {
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
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <img
          src={logoDataUri}
          alt="Whitefox Cheer"
          width={40}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    {
      width: 48,
      height: 48,
    }
  );
}
