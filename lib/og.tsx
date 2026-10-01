import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** 1200x630 social card in the site's warm-paper style. */
export function renderOg({
  title,
  kicker,
  footer,
}: {
  title: string;
  kicker: string;
  footer: string;
}) {
  const size = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f2",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          color: "#2a2623",
          borderLeft: "16px solid #2f6f5e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#2f6f5e",
              color: "#fff",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            p
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#5e574f" }}>
            {kicker}
          </div>
        </div>
        <div
          style={{
            fontSize: size,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: -1.5,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#5e574f", display: "flex" }}>
          {footer}
        </div>
      </div>
    ),
    ogSize,
  );
}
