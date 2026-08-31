"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, portfolio, IMG } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export default function PortfolioPage() {
  const [cat, setCat] = useState<string>("전체");
  const items = portfolio.filter((p) => cat === "전체" || p.category === cat);
  const countOf = (c: string) => (c === "전체" ? portfolio.length : portfolio.filter((p) => p.category === c).length);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={IMG.trustBanner} alt="공공기관에 설치된 사인 시스템" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 55%" }} />
        <div className="absolute inset-0 bg-shell/75" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">PORTFOLIO</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">포트폴리오</h1>
          <p className="mt-3 max-w-xl text-sm text-nav-inactive">
            한국도로교통공단 전국 지부·시험장부터 병원·경찰서·도서관까지, 실제 수행한 프로젝트와 실제
            시공 현장 사진입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Filters with counts */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin" role="tablist" aria-label="포트폴리오 분야 필터">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`tap flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ${
                cat === c ? "bg-shell text-white shadow" : "border border-line bg-surface text-ink-2 hover:bg-soft"
              }`}
            >
              {c}
              <span className={`text-[0.6875rem] tabular-nums ${cat === c ? "text-accent" : "text-muted"}`}>{countOf(c)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <Link
                href={`/portfolio/${p.id}`}
                className="img-zoom tap hover-lift group block overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur">
                    {p.category}
                  </span>
                  {/* hover overlay */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="m-4 flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-shell">
                      View Project <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-bold leading-snug text-ink group-hover:text-primary">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {p.client} · {p.year}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-2">{p.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">해당 분야의 공개 가능한 프로젝트를 준비 중입니다.</p>
        )}
      </section>
    </>
  );
}
