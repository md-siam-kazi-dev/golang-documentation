import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          padding: "80px",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ fontSize: "36px", fontWeight: 600, color: "#c7d2fe" }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1.1 }}>
            {SITE_TAGLINE}
          </div>
          <div style={{ fontSize: "30px", color: "#94a3b8" }}>
            Fundamentals · Concurrency · Standard Library · REST APIs · Databases
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
