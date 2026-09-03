"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, portfolio, IMG } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { PhotoBand } from "@/components/ui";
import RecordsList from "@/components/customer/Records";
import { RECORD_TOTAL, sectorCounts } from "@/lib/records";

export default function PortfolioPage() {
  const [cat, setCat] = useState<string>("전체");
  const [q, setQ] = useState("");
  const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");
  const items = portfolio.filter(
    (p) =>
      (cat === "전체" || p.category === cat) &&
      (!q || norm(p.title + p.client + p.summary + p.scope.join("")).includes(norm(q))),
  );
  const countOf = (c: string) => (c === "전체" ? portfolio.length : portfolio.filter((p) => p.category === c).length);

  return (
    <>
      <PhotoBand image={IMG.trustBanner} alt="공공기관에 설치된 사인 시스템" position="50% 55%">
        <div className="py-16 lg:py-20">
          <p className="t-eyebrow">Portfolio</p>
          <h1 className="t-h1 mt-3 text-white">포트폴리오</h1>
          <p className="measure mt-4 t-body text-nav-inactive">
            한국도로교통공단 전국 지부·시험장부터 병원·경찰서·도서관까지, 실제 수행한 프로젝트와 실제
            시공 현장 사진입니다.
          </p>
        </div>
      </PhotoBand>

      <section className="section-sm bg-canvas">
        <div className="container-page">
          {/* 검색 */}
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-surface px-4 shadow-sm focus-within:border-accent">
            <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="기관명·프로젝트명으로 검색 (예: 도로교통공단, 병원, 보령)"
              aria-label="포트폴리오 검색"
              className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted"
            />
            {q && (
              <button onClick={() => setQ("")} className="tap shrink-0 rounded-full p-1 text-muted hover:bg-soft hover:text-ink" aria-label="검색어 지우기">
                ✕
              </button>
            )}
          </div>

          {/* 분야 필터 */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="포트폴리오 분야 필터">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`tap flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                  cat === c ? "bg-shell text-white shadow" : "border border-line bg-surface text-ink-2 hover:bg-soft"
                }`}
              >
                {c}
                <span className={`text-[0.6875rem] tabular-nums ${cat === c ? "text-accent" : "text-muted"}`}>{countOf(c)}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 t-meta">
            {q ? `'${q}' 검색 결과` : cat === "전체" ? "전체" : cat} <b className="text-ink-2">{items.length}건</b>
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 70}>
                <Link
                  href={`/portfolio/${p.id}`}
                  className="img-zoom tap hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
                >
                  <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur">
                      {p.category}
                    </span>
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="m-4 flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-shell">
                        프로젝트 보기 <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="t-h3 text-ink group-hover:text-primary">{p.title}</h2>
                    <p className="mt-1.5 t-meta">
                      {p.client} · {p.year}
                    </p>
                    <p className="mt-2.5 line-clamp-2 t-body text-[0.875rem]">{p.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                      {p.scope.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-soft px-2.5 py-0.5 text-[0.6875rem] font-medium text-ink-2">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-surface py-16 text-center">
              <p className="t-h3 text-ink">검색 결과가 없습니다</p>
              <p className="mx-auto mt-2 max-w-sm t-body">
                {q && (
                  <>
                    &lsquo;{q}&rsquo;와 일치하는 프로젝트를 찾지 못했습니다.
                    <br />
                  </>
                )}
                다른 검색어를 입력하시거나 분야를 &lsquo;전체&rsquo;로 바꿔보세요.
              </p>
              <button
                onClick={() => {
                  setQ("");
                  setCat("전체");
                }}
                className="tap btn btn-ghost btn-sm mt-5"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 전체 수행 실적 — 지명원 기업실적 */}
      <section id="records" className="section bg-surface">
        <div className="container-page">
          <div className="mb-8">
            <p className="t-eyebrow">Business Records</p>
            <h2 className="t-h2 mt-2 text-ink">
              2013년부터 <span className="tabular-nums text-accent">{RECORD_TOTAL}건</span>, 전체 수행 실적
            </h2>
            <p className="measure-wide mt-3 t-body">
              위 {portfolio.length}건은 현장 사진이 있는 대표 사례입니다. 아래는 지명원에 수록된 전체
              실적으로, 담당하시는 기관과 같은 유형을 저희가 해봤는지 바로 확인하실 수 있습니다.
            </p>
          </div>

          {/* 발주처 성격별 집계 */}
          <ul className="mb-8 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {sectorCounts().map((s) => (
              <li key={s.label} className="rounded-xl border border-line bg-canvas px-4 py-3">
                <p className="text-lg font-black tabular-nums leading-none text-accent">{s.count}</p>
                <p className="mt-1.5 text-[0.75rem] font-medium leading-snug text-ink-2">{s.label}</p>
              </li>
            ))}
          </ul>

          <RecordsList />

          <p className="mt-6 t-meta">
            출처: ㈜샤인디자인 지명원(2026) 기업실적. 계약금액은 지명원에 기재되어 있지 않아 표기하지
            않습니다. 연도는 지명원 실적 페이지 단위로 묶어 표기했습니다.
          </p>
        </div>
      </section>
    </>
  );
}
