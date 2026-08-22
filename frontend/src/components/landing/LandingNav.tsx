import Link from "next/link";

import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { SECTIONS, SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: `#${SECTIONS.platform}`, label: "Platform" },
  { href: `#${SECTIONS.intelligence}`, label: "Intelligence" },
  { href: `#${SECTIONS.technology}`, label: "Technology" },
];

export default function LandingNav() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg-base) 82%, transparent)",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-screen-xl items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0 rounded-md">
          <Logo variant="icon" size={30} className="sm:hidden" />
          <Logo variant="full" size={30} className="hidden sm:inline-flex" />
        </Link>

        {/* Section links — hidden on small screens, where the CTA takes priority */}
        <ul className="ml-6 hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${SITE.name} on GitHub`}
            className="hidden h-9 w-9 items-center justify-center rounded-lg transition-colors sm:inline-flex"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>

          <ThemeToggle />

          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Launch Mission Control
          </Link>
        </div>
      </nav>
    </header>
  );
}
