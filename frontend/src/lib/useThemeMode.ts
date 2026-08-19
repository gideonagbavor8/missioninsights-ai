"use client";

import { useMemo, useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light";

/**
 * The theme lives on <html> as a class, written by the pre-paint script in
 * layout.tsx and by ThemeToggle. That makes it an external store, so we
 * subscribe to it rather than mirroring it into React state.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeMode {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Matches the class rendered by layout.tsx, so hydration agrees. */
function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Resolves CSS custom properties off <html>, re-reading them when the theme
 * flips. Components that paint into SVG presentation attributes (Recharts)
 * cannot use `var(--token)` directly, so they need the computed values in JS.
 *
 * `names` and `fallback` are expected to be module-level constants.
 */
export function useThemeTokens<T extends Record<string, string>>(
  names: T,
  fallback: Record<keyof T, string>,
): Record<keyof T, string> {
  const mode = useThemeMode();

  return useMemo(() => {
    if (typeof document === "undefined") return fallback;

    const computed = getComputedStyle(document.documentElement);
    const resolved = {} as Record<keyof T, string>;

    for (const key of Object.keys(names) as (keyof T)[]) {
      resolved[key] = computed.getPropertyValue(names[key]).trim() || fallback[key];
    }

    return resolved;
    // `mode` looks unused to the linter, but it is the whole point of the dep
    // array here: it is the signal that the computed values have changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, names, fallback]);
}
