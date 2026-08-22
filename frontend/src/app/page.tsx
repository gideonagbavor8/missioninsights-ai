import type { Metadata } from "next";
import Link from "next/link";

import LandingNav from "@/components/landing/LandingNav";
import HeroVisual from "@/components/landing/HeroVisual";
import Reveal from "@/components/landing/Reveal";
import Footer from "@/components/Footer";
import StatusChip from "@/components/ui/StatusChip";
import Meter from "@/components/ui/Meter";
import { SECTIONS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` bypasses the layout's "%s — MissionInsights AI" template, which
  // would otherwise repeat the product name.
  title: { absolute: "MissionInsights AI | Intelligent Space Mission Control" },
  description: SITE.description,
  openGraph: {
    title: "MissionInsights AI | Intelligent Space Mission Control",
    description: SITE.description,
  },
};

// ── Content ──────────────────────────────────────────────────────────────────

/** Capabilities that exist in the codebase today — nothing aspirational. */
const FEATURES = [
  {
    title: "Mission Health Score",
    body: "A single 0–100 readout derived from battery, fuel, signal, temperature and thruster vibration, adjusted for the severity and confidence of any active anomalies.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: "Telemetry Monitoring",
    body: "Spacecraft telemetry surfaced as gauges and time-series charts, so drift in any subsystem is visible at a glance rather than buried in a table.",
    icon: (
      <>
        <path d="M3 16l4-5 4 3 4-7 6 4" />
        <path d="M3 20h18" />
      </>
    ),
  },
  {
    title: "AI Anomaly Detection",
    body: "Trend analysis across consecutive telemetry records flags rising vibration, declining battery and climbing temperature, each with a severity and confidence score.",
    icon: (
      <>
        <path d="M12 4l9 16H3z" />
        <path d="M12 10v4" />
        <path d="M12 17.5h.01" />
      </>
    ),
  },
  {
    title: "Mission Commander",
    body: "Ask questions in plain language and get answers grounded in the current telemetry and anomaly state, rather than generic model output.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 20h8" />
        <path d="M7 9l3 3-3 3" />
      </>
    ),
  },
  {
    title: "AI Mission Reports",
    body: "Generated analysis summarising mission health, detected anomalies and recommended actions — reused when the mission state has not changed.",
    icon: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </>
    ),
  },
];

const FLOW = [
  { label: "Spacecraft Telemetry", detail: "Battery, fuel, signal, thermal, vibration" },
  { label: "AI Analysis", detail: "IBM Granite reads the current mission state" },
  { label: "Anomaly Detection", detail: "Trends scored by severity and confidence" },
  { label: "Mission Health", detail: "Weighted 0–100 index with factor breakdown" },
  { label: "Actionable Insights", detail: "Ranked recommendations for the crew" },
];

const TECH = [
  {
    name: "IBM watsonx.ai",
    detail: "Foundation-model inference for all mission analysis and Q&A.",
  },
  {
    name: "IBM Granite",
    detail: "granite-4-h-small generates health summaries, risk levels and recommendations.",
  },
  {
    name: "IBM Bob",
    detail: "Used throughout development to plan, scaffold and review the build.",
  },
];

// ── Small building blocks ────────────────────────────────────────────────────

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="section-label" style={{ color: "var(--accent-text)" }}>
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {body && <p className="t-body-muted mt-3 text-[15px]">{body}</p>}
    </div>
  );
}

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
      style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-line)" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent-text)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="space-bg" style={{ background: "var(--bg-base)" }}>
      <LandingNav />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="space-glow" aria-hidden="true" />
          <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
            <Reveal>
              <StatusChip tone="accent">IBM AI Builders Challenge</StatusChip>

              <h1
                className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl"
                style={{ color: "var(--text-primary)" }}
              >
                Intelligent mission control for the next generation of space
                exploration
              </h1>

              <p className="t-body-muted mt-5 max-w-xl text-[15px] sm:text-base">
                MissionInsights AI turns raw spacecraft telemetry into actionable
                mission intelligence — continuous health scoring, AI anomaly
                detection and grounded analysis from IBM watsonx Granite.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard" className="btn btn-primary">
                  Launch Mission Control
                </Link>
                <a href={`#${SECTIONS.platform}`} className="btn btn-secondary">
                  Explore the Platform
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <HeroVisual />
            </Reveal>
          </div>
        </section>

        {/* ── Platform / features ── */}
        <section
          id={SECTIONS.platform}
          className="scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto max-w-screen-xl">
            <Reveal>
              <SectionHeading
                eyebrow="Platform"
                title="Everything a mission team needs to read the spacecraft"
                body="Five capabilities, each backed by mission telemetry rather than static dashboards."
              />
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 70}>
                  <article className="card card-interactive h-full p-6">
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <h3
                      className="mt-4 text-[15px] font-semibold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="t-body-muted mt-2">{feature.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Intelligence flow ── */}
        <section
          id={SECTIONS.intelligence}
          className="scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto max-w-screen-xl">
            <Reveal>
              <SectionHeading
                eyebrow="Mission Intelligence"
                title="From raw telemetry to a decision"
                body="Every reading follows the same path through the platform."
              />
            </Reveal>

            <ol className="mt-14 grid gap-y-10 lg:grid-cols-5 lg:gap-x-12">
              {FLOW.map((step, i) => (
                <Reveal key={step.label} delay={i * 80}>
                  <li className="flow-step relative list-none text-center">
                    <span
                      className="t-num mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold"
                      style={{
                        background: "var(--accent-bg)",
                        border: "1px solid var(--accent-line)",
                        color: "var(--accent-text)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <h3
                      className="mt-3 text-[13px] font-semibold uppercase tracking-[0.07em]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {step.label}
                    </h3>
                    <p className="t-meta mt-1.5">{step.detail}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Dashboard preview ── */}
        <section
          id={SECTIONS.dashboard}
          className="scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto grid max-w-screen-xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="section-label" style={{ color: "var(--accent-text)" }}>
                Mission Dashboard
              </p>
              <h2
                className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                Mission intelligence at a glance
              </h2>
              <p className="t-body-muted mt-4 text-[15px]">
                Monitor critical telemetry, active anomalies, mission health and
                AI-generated insights from one centralised interface — with each
                region loading independently so the page never waits on the
                slowest system.
              </p>
              <div className="mt-8">
                <Link href="/dashboard" className="btn btn-primary">
                  Enter Mission Control
                </Link>
              </div>
            </Reveal>

            {/* Built from the dashboard's own primitives (card, StatusChip,
                Meter) so the preview cannot drift from the real design system.
                Values are illustrative. */}
            <Reveal delay={120}>
              <div className="card p-5" role="img" aria-label="Preview of the mission dashboard interface">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="section-label">Mission</p>
                    <p
                      className="mt-1 text-[15px] font-semibold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Artemis Explorer
                    </p>
                  </div>
                  <StatusChip tone="ok" dot>
                    Active
                  </StatusChip>
                </div>

                <div
                  className="mt-4 space-y-3 pt-4"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  {[
                    { label: "Battery", value: 80, tone: "ok" as const },
                    { label: "Fuel", value: 61, tone: "ok" as const },
                    { label: "Signal", value: 92, tone: "ok" as const },
                    { label: "Vibration", value: 34, tone: "warn" as const },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                          {row.label}
                        </span>
                        <span
                          className="t-num text-[11px] font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.value}
                        </span>
                      </div>
                      <Meter percent={row.value} tone={row.tone} size={5} />
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 rounded-lg px-3.5 py-3"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2">
                    <StatusChip tone="warn">Medium risk</StatusChip>
                    <span className="t-meta">AI mission report</span>
                  </div>
                  <p className="t-body-muted mt-2">
                    Thruster vibration is trending upward while battery declines.
                    Inspect the propulsion subsystem and increase monitoring
                    frequency.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Technology ── */}
        <section
          id={SECTIONS.technology}
          className="scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto max-w-screen-xl">
            <Reveal>
              <SectionHeading
                eyebrow="Technology"
                title="Built on IBM watsonx"
                body="Every mission summary, risk level and recommendation on the dashboard is produced by IBM Granite through watsonx.ai."
              />
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {TECH.map((tech, i) => (
                <Reveal key={tech.name} delay={i * 80}>
                  <div className="card h-full p-6">
                    <h3
                      className="text-[15px] font-semibold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {tech.name}
                    </h3>
                    <p className="t-body-muted mt-2">{tech.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Purpose ── */}
        <section
          className="border-t px-4 py-20 sm:px-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-label" style={{ color: "var(--accent-text)" }}>
                The Mission
              </p>
              <p
                className="mt-4 text-lg leading-relaxed sm:text-xl"
                style={{ color: "var(--text-primary)" }}
              >
                MissionInsights AI reduces the complexity of spacecraft telemetry
                analysis — turning raw mission data into understandable health
                indicators, anomaly alerts and AI-assisted mission intelligence.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── Final CTA ── */}
        <section
          className="relative overflow-hidden border-t px-4 py-24 sm:px-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="space-glow" aria-hidden="true" />
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                Ready to explore the mission?
              </h2>
              <p className="t-body-muted mt-4 text-[15px]">
                Enter Mission Control and see the intelligence behind the telemetry.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/dashboard" className="btn btn-primary">
                  Launch Mission Control
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
