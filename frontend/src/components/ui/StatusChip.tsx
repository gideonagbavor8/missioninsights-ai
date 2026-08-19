import type { Tone } from "@/lib/tone";
import { solidVar } from "@/lib/tone";

interface Props {
  tone: Tone;
  children: React.ReactNode;
  /** Show a filled dot in the tone's saturated colour. */
  dot?: boolean;
  className?: string;
}

/**
 * The one status pill used across the dashboard. Colour comes from the `chip`
 * rules in globals.css keyed on `data-tone`, so every pill flips with the theme
 * instead of each component shipping its own dark-only colour table.
 */
export default function StatusChip({ tone, children, dot = false, className = "" }: Props) {
  return (
    <span className={`chip capitalize ${className}`} data-tone={tone}>
      {dot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: solidVar(tone) }}
        />
      )}
      {children}
    </span>
  );
}
