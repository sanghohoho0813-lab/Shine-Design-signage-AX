export default function Loading() {
  return (
    <div className="container-page section" aria-busy="true" aria-label="불러오는 중">
      <div className="h-4 w-28 animate-pulse rounded bg-soft" />
      <div className="mt-4 h-9 w-2/3 max-w-md animate-pulse rounded bg-soft" />
      <div className="mt-3 h-4 w-1/2 max-w-sm animate-pulse rounded bg-soft" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="aspect-[3/2] w-full animate-pulse bg-soft" />
            <div className="space-y-2 p-5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-soft" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-soft" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
