import { ImageResponse } from "next/og";

export const alt = "MissionInsights AI — AI-powered space mission intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The brand mark, inlined as a data URI so the image needs no network fetch. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="220" height="220">
  <g transform="rotate(-25 16 16)">
    <path d="M25.19 22.08 A 13 8.6 0 1 1 27.26 11.70" fill="none" stroke="#f8fafc" stroke-width="1.9" stroke-linecap="round" opacity="0.5"/>
    <circle cx="27.26" cy="11.7" r="2.8" fill="#22d3ee"/>
  </g>
  <circle cx="16" cy="16" r="5.5" fill="#f8fafc"/>
</svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1120",
          color: "#f8fafc",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={220}
          height={220}
          alt=""
          src={`data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`}
        />
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 48 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>Mission</div>
          {/* Negative offset closes the gap Satori leaves between flex items —
              "MissionInsights" must read as a single word. */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              color: "#a5b4fc",
              marginLeft: -6,
            }}
          >
            Insights
          </div>
          <div style={{ fontSize: 52, fontWeight: 600, marginLeft: 16 }}>AI</div>
        </div>
        <div style={{ fontSize: 28, color: "#9aa4b2", marginTop: 20 }}>
          AI-powered space mission intelligence
        </div>
      </div>
    ),
    size,
  );
}
