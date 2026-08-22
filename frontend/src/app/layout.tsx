import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Child routes set only their own segment; "— MissionInsights AI" is appended.
  title: {
    default: "MissionInsights AI",
    template: "%s — MissionInsights AI",
  },
  description:
    "AI-powered space mission intelligence: live telemetry, anomaly detection, mission health scoring and IBM watsonx Granite analysis.",
  applicationName: "MissionInsights AI",
  openGraph: {
    title: "MissionInsights AI",
    description:
      "AI-powered space mission intelligence: live telemetry, anomaly detection, mission health scoring and IBM watsonx Granite analysis.",
    siteName: "MissionInsights AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MissionInsights AI",
    description: "AI-powered space mission intelligence.",
  },
};

/**
 * Applies the stored theme before first paint. Without this the page always
 * renders dark and then snaps to light on hydration for anyone who chose light.
 */
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("missioninsights-theme");
    var mode = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    var root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
