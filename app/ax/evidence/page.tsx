"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { IMG, portfolio } from "@/lib/data";

export default function EvidencePage() {
  const { projects, hydrated } = useApp();
  if (!hydrated) return <div className="p-6 text-sm text-muted">불러오는 중…</div>;

  const completed = projects.filter((p) => p.stage === "완료");

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="relative overflow-hidden rounded-2xl">
        <img src={IMG.axEvidence} alt="프로젝트 증빙 리포트" className="h-36 w-full object-cover sm:h-44" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-shell/90 to-shell/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
          <h2 className="text-lg font-black text-white sm:text-xl">증빙 · 리포트</h2>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-nav-inactive sm:text-[0.8125rem]">
            완료된 프로젝트는 납품 증빙 → 포트폴리오 자산 → 유사실적 → 입찰 신뢰도로 이어집니다.
          </p>
        </div>
      </div>

      {/* Closed loop diagram */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h3 className="font-bold text-ink">Closed Loop — 완료가 곧 다음 수주의 자산</h3>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.75rem] font-semibold">
          {["고객 문의", "프로젝트 Pipeline", "디자인·견적", "제작 파트너", "설치", "증빙", "포트폴리오 자산", "다음 입찰·영업"].map((s, i, arr) => (
            <span key={s} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1.5 ${i >= 5 ? "bg-accent/15 text-accent" : "bg-soft text-ink-2"}`}>{s}</span>
              {i < arr.length - 1 && <span className="text-muted" aria-hidden>→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Completed → evidence records */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-ink">완료 프로젝트 증빙 <span className="text-xs font-normal text-muted">({completed.length}건)</span></h3>
          <Link href="/ax/pipeline" className="tap text-xs font-semibold text-muted hover:text-ink">파이프라인 →</Link>
        </div>
        {completed.length === 0 ? (
          <p className="mt-4 rounded-xl bg-canvas p-4 text-sm text-muted">
            아직 완료 처리된 프로젝트가 없습니다. 파이프라인에서 프로젝트를 완료하면 이곳에 증빙 레코드가 생성됩니다.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {completed.map((p) => (
              <li key={p.id} className="rounded-xl border border-line p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-ink">{p.client}</p>
                    <p className="text-sm text-ink-2">{p.name}</p>
                  </div>
                  <span className="rounded-full bg-[var(--ic-evidence)]/12 px-2 py-0.5 text-[0.625rem] font-bold text-[var(--ic-evidence)]">완료</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[0.6875rem]">
                  {["납품 확인서", "준공 사진", "검수 리포트", "유사실적 카드"].map((d) => (
                    <span key={d} className="flex items-center gap-1.5 rounded-lg bg-canvas px-2.5 py-1.5 text-ink-2">
                      <span className="text-[var(--ic-evidence)]" aria-hidden>✓</span>
                      {d}
                    </span>
                  ))}
                </div>
                <p className="mt-2.5 text-[0.6875rem] text-muted">→ 고객 사이트 &lsquo;최근 완료된 프로젝트&rsquo;와 입찰 유사실적에 연결됨</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Portfolio asset count */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">포트폴리오 자산</p>
          <p className="mt-1 text-xl font-black text-ink">{portfolio.length + completed.length}건</p>
          <p className="text-[0.6875rem] text-secondary">공개 {portfolio.length} + 신규 완료 {completed.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">유사실적 분야</p>
          <p className="mt-1 text-xl font-black text-ink">7개</p>
          <p className="text-[0.6875rem] text-secondary">교통·행정·의료·문화·교육·공공·민간</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">입찰 연결 가능 증빙</p>
          <p className="mt-1 text-xl font-black text-ink">{4 + completed.length}건</p>
          <p className="text-[0.6875rem] text-secondary">준비도 산정에 자동 반영 (데모)</p>
        </div>
      </section>
    </div>
  );
}
