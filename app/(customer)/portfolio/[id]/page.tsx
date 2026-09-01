import { portfolio } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/customer/Gallery";
import { Section } from "@/components/ui";

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
      <section className="relative isolate flex min-h-[24rem] items-end overflow-hidden bg-shell lg:min-h-[28rem]">
        <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-card" aria-hidden />
        <div className="container-page relative pb-10 pt-24">
          <Link href="/portfolio" className="tap mb-4 inline-block text-sm text-nav-inactive hover:text-white">
            ← 포트폴리오
          </Link>
          <span className="block w-fit rounded-full bg-accent px-3 py-1 text-[0.6875rem] font-bold text-shell">{p.category}</span>
          <h1 className="t-h1 mt-3 max-w-3xl text-white">{p.title}</h1>
          <p className="mt-3 t-meta text-nav-inactive">
            {p.client} · {p.year} · 실제 수행 프로젝트
          </p>
        </div>
      </section>

      <Section tone="canvas">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
              <p className="t-eyebrow">Project</p>
              <h2 className="t-h3 mt-2 text-ink">{p.summary}</h2>
              <p className="measure-wide mt-3.5 t-body">{p.detail}</p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
              <p className="t-eyebrow">Gallery</p>
              <Gallery images={[p.image, ...(p.gallery ?? [])]} title={p.title} />
              <p className="mt-3 t-meta">※ 실제 시공 현장 사진 (회사소개서 수록)</p>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <h2 className="t-h3 text-ink">프로젝트 정보</h2>
              <dl className="mt-4 space-y-3.5 text-sm">
                <div>
                  <dt className="t-meta">발주처 / 시설</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{p.client}</dd>
                </div>
                <div>
                  <dt className="t-meta">프로젝트 유형</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{p.category}</dd>
                </div>
                <div>
                  <dt className="t-meta">수행 범위</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.scope.map((s) => (
                      <span key={s} className="rounded-full bg-soft px-2.5 py-0.5 text-xs font-medium text-ink-2">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="t-meta">수행 연도</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{p.year}</dd>
                </div>
              </dl>
              <Link href="/inquiry" className="tap hover-lift btn btn-primary mt-6 w-full">
                유사 프로젝트 문의
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {others.length > 0 && (
        <Section tone="surface" size="sm">
          <h2 className="t-h3 mb-4 text-ink">같은 분야의 다른 프로젝트</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/portfolio/${o.id}`}
                className="img-zoom tap hover-lift flex h-full flex-col overflow-hidden rounded-xl border border-line bg-canvas shadow-sm"
              >
                <img src={o.image} alt={o.title} className="aspect-[3/2] w-full shrink-0 object-cover" loading="lazy" />
                <p className="p-4 text-sm font-bold leading-snug text-ink">{o.title}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
