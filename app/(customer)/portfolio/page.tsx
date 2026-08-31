"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, portfolio, IMG } from "@/lib/data";

export default function PortfolioPage() {
  const [cat, setCat] = useState<string>("전체");
  const items = portfolio.filter((p) => cat === "전체" || p.category === cat || (cat === "공공기관" && p.category !== "상업·민간"));

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={IMG.trustBanner} alt="공공기관에 설치된 사인 시스템" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 55%" }} />
        <div className="absolute inset-0 bg-shell/75" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">PORTFOLIO</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">포트폴리오</h1>
          <p className="mt-3 max-w-xl text-sm text-nav-inactive">
            공공기관을 중심으로 수행한 대표 프로젝트 유형입니다. 발주처 보안 정책에 따라 일부 명칭은
            분야로 표기합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin" role="tablist" aria-label="포트폴리오 분야 필터">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`tap shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                cat === c ? "bg-shell text-white shadow" : "border border-line bg-surface text-ink-2 hover:bg-soft"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/portfolio/${p.id}`}
              className="img-zoom tap hover-lift group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <h2 className="font-bold leading-snug text-ink group-hover:text-primary">{p.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {p.client} · {p.year}
                </p>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{p.summary}</p>
                <p className="mt-3 text-xs font-semibold text-accent">View Project →</p>
              </div>
            </Link>
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">해당 분야의 공개 가능한 프로젝트를 준비 중입니다.</p>
        )}
      </section>
    </>
  );
}
