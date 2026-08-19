interface Props {
  title: string;
  count?: number;
}

export default function SectionHeader({ title, count }: Props) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {count !== undefined && (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-secondary)" }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
