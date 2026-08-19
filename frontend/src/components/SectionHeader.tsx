interface Props {
  title: string;
  count?: number;
  /** Optional one-line explanation shown under the title. */
  hint?: string;
  /** Right-aligned content — status chips, filters. */
  trailing?: React.ReactNode;
}

export default function SectionHeader({ title, count, hint, trailing }: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
          {count !== undefined && (
            <span className="chip t-num" data-tone="neutral">
              {count}
            </span>
          )}
        </div>
        {hint && <p className="t-meta mt-1">{hint}</p>}
      </div>
      {trailing && <div className="flex shrink-0 items-center gap-1.5">{trailing}</div>}
    </div>
  );
}
