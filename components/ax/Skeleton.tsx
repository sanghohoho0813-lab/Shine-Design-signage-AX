/** AX 화면 로딩 자리표시 — 빈 텍스트 대신 실제 레이아웃 모양을 보여준다 */
export function AxSkeleton({ variant = "list" }: { variant?: "list" | "dashboard" | "cards" }) {
  const bar = "animate-pulse rounded bg-soft";
  return (
    <div className="space-y-5 p-4 sm:p-6" aria-busy="true" aria-label="불러오는 중">
      <div>
        <div className={`h-5 w-40 ${bar}`} />
        <div className={`mt-2 h-3.5 w-72 max-w-full ${bar}`} />
      </div>

      {variant === "dashboard" && (
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-line bg-surface p-3.5">
              <div className={`h-3 w-20 ${bar}`} />
              <div className={`mt-2 h-6 w-14 ${bar}`} />
              <div className={`mt-2 h-2.5 w-24 ${bar}`} />
            </div>
          ))}
        </div>
      )}

      {variant === "cards" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface p-5">
              <div className={`h-4 w-32 ${bar}`} />
              <div className={`mt-3 h-3 w-full ${bar}`} />
              <div className={`mt-2 h-3 w-4/5 ${bar}`} />
              <div className={`mt-4 h-9 w-full ${bar}`} />
            </div>
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-line p-4 last:border-0">
              <div className="flex-1">
                <div className={`h-4 w-40 ${bar}`} />
                <div className={`mt-2 h-3 w-56 max-w-full ${bar}`} />
              </div>
              <div className={`hidden h-6 w-16 sm:block ${bar}`} />
              <div className={`hidden h-4 w-24 md:block ${bar}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
