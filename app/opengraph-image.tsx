import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "㈜샤인디자인 — 공간을 읽고, 사인으로 완성합니다";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(120deg, #16181d 0%, #1f232b 60%, #2a2f39 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#c4a15f",
              color: "#16181d",
              fontSize: 36,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            S
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>SHINE DESIGN</span>
            <span style={{ fontSize: 16, color: "#aeb7c3", letterSpacing: 4 }}>샤인디자인</span>
          </div>
        </div>

        <div style={{ marginTop: 56, fontSize: 62, fontWeight: 800, lineHeight: 1.25, display: "flex", flexDirection: "column" }}>
          <span>공간을 읽고,</span>
          <span>
            <span style={{ color: "#c4a15f" }}>사인</span>으로 완성합니다.
          </span>
        </div>

        <div style={{ marginTop: 36, fontSize: 24, color: "#e5e7eb" }}>
          공공기관·의료·업무시설 사인 시스템 · 기획부터 제작·시공까지
        </div>
      </div>
    ),
    size,
  );
}
