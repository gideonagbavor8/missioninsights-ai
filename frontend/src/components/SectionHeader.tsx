interface Props {
  title: string;
  count?: number;
}

export default function SectionHeader({ title, count }: Props) {
  return (
    <div className="flex items-baseline gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-700">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {count !== undefined && (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
          {count}
        </span>
      )}
    </div>
  );
}
