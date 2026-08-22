import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the mark on the brand's deep-space navy, never transparent. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="132" height="132">
  <g transform="rotate(-25 16 16)">
    <path d="M25.19 22.08 A 13 8.6 0 1 1 27.26 11.70" fill="none" stroke="#f8fafc" stroke-width="1.9" stroke-linecap="round" opacity="0.5"/>
    <circle cx="27.26" cy="11.7" r="2.8" fill="#22d3ee"/>
  </g>
  <circle cx="16" cy="16" r="5.5" fill="#f8fafc"/>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1120",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={132}
          height={132}
          alt=""
          src={`data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`}
        />
      </div>
    ),
    size,
  );
}
