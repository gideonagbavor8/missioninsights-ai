import Link from "next/link";

import Logo from "./brand/Logo";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer
      className="relative z-10"
      style={{ borderTop: "1px solid var(--border)", background: "var(--bg-base)" }}
    >
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Identity */}
          <div className="max-w-xs">
            <Logo variant="full" size={30} />
            <p className="t-body-muted mt-3">{SITE.tagline}</p>
          </div>

          {/* Links */}
          <div className="flex gap-12 sm:gap-16">
            <div>
              <h2 className="section-label mb-3">Platform</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-[13px] transition-colors hover:opacity-80"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Mission Dashboard
                  </Link>
                </li>
                <li>
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] transition-colors hover:opacity-80"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Source on GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="section-label mb-3">Built with</h2>
              <ul className="space-y-2 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                <li>IBM watsonx.ai</li>
                <li>IBM Granite</li>
                <li>Next.js &amp; FastAPI</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="t-meta">© 2026 {SITE.name}</p>
          <p className="t-meta">
            Mission analysis powered by IBM watsonx Granite.
          </p>
        </div>
      </div>
    </footer>
  );
}
