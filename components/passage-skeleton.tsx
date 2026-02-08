export function PassageSkeleton() {
  return (
    <div className="w-full max-w-5xl px-4 py-10 min-h-[260px]">
      <div className="animate-pulse flex flex-wrap gap-[6px]">
        {Array.from({ length: 180 }).map((_, i) => (
          <div key={i} className="h-4 w-3 rounded bg-neutral-800" />
        ))}
      </div>
    </div>
  );
}
