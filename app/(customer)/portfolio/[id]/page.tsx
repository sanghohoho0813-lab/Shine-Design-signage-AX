import { portfolio } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return portfolio.map((p) => ({ id: p.id }));
}

export default async function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = portfolio.find((x) => x.id === id);
  if (!p) notFound();

  const others = portfolio.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
          <Link href="/portfolio" className="tap mb-4 text-sm text-nav-inactive hover:text-white">
            ← 포트폴리오
          </Link>
          <span className="w-fit rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-shell">{p.category}</span>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">{p.title}</h1>
          <p className="mt-2 text-sm text-nav-inactive">
            {p.client} · {p.year}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {[
            ["Challenge", "프로젝트 배경", p.challenge],
            ["Design Approach", "디자인 접근", p.approach],
            ["Production & Installation", "제작·시공", p.production],
          ].map(([en, ko, body]) => (
            <div key={en} className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold tracking-[0.15em] text-accent">{en.toUpperCase()}</p>
              <h2 className="mt-1 text-lg font-bold text-ink">{ko}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{body}</p>
            </div>
          ))}
        </div>
        <aside>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
            <h2 className="text-sm font-bold text-ink">프로젝트 정보</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">발주처 / 시설</dt>
                <dd className="mt-0.5 font-medium text-ink">{p.client}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">프로젝트 유형</dt>
                <dd className="mt-0.5 font-medium text-ink">{p.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">수행 범위</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {p.scope.map((s) => (
                    <span key={s} className="rounded-full bg-soft px-2.5 py-0.5 text-xs font-medium text-ink-2">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">연도</dt>
                <dd className="mt-0.5 font-medium text-ink">{p.year}</dd>
              </div>
            </dl>
            <Link
              href="/inquiry"
              className="tap hover-lift mt-6 block rounded-lg bg-shell px-4 py-3 text-center text-sm font-semibold text-white hover:bg-shell-2"
            >
              유사 프로젝트 문의
            </Link>
          </div>
        </aside>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="text-lg font-bold text-ink">같은 분야의 다른 프로젝트</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} href={`/portfolio/${o.id}`} className="img-zoom tap hover-lift overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
                <img src={o.image} alt={o.title} className="aspect-[3/2] w-full object-cover" loading="lazy" />
                <p className="p-4 text-sm font-bold text-ink">{o.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
