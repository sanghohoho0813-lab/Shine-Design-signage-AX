"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { IMG, portfolio } from "@/lib/data";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";

export default function EvidencePage() {
  const { projects, hydrated } = useApp();
  if (!hydrated) return <AxSkeleton variant="cards" />;

  const completed = projects.filter((p) => p.stage === "완료");

  const today = new Date().toLocaleDateString("ko-KR");

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="증빙 · 리포트"
        purpose="완료된 프로젝트의 증빙을 모아 봅니다. 실적 요약은 그대로 인쇄하거나 PDF로 저장해 제출자료로 쓸 수 있습니다."
        stat={`완료 ${completed.length}건`}
      >
        <button onClick={() => window.print()} className="tap hover-lift btn btn-primary btn-sm no-print">
          🖨 실적 요약 인쇄 / PDF
        </button>
      </PageHeader>

      {/* 인쇄 전용 실적 요약 — 화면에서는 숨김 */}
      <div className="hidden print-area">
        <div className="print-block mb-6 border-b-2 border-black pb-4">
          <p className="text-sm">㈜샤인디자인 · 대표이사 권유진 · 사업자등록번호 519-87-03609</p>
          <h1 className="mt-2 text-2xl font-black">수행 실적 요약</h1>
          <p className="mt-1 text-sm">발행일 {today} · 본 자료는 내부 관리 시스템에서 생성되었습니다.</p>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-2 pr-3">발주처</th>
              <th className="py-2 pr-3">프로젝트</th>
              <th className="py-2 pr-3">분야</th>
              <th className="py-2 pr-3">완료(예정)일</th>
              <th className="py-2">수행 범위</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((p) => (
              <tr key={p.id} className="print-block border-b border-gray-400">
                <td className="py-2 pr-3 font-bold">{p.client}</td>
                <td className="py-2 pr-3">{p.name}</td>
                <td className="py-2 pr-3">{p.category}</td>
                <td className="py-2 pr-3">{p.deadline}</td>
                <td className="py-2">디자인 · 제작 · 시공</td>
              </tr>
            ))}
            {portfolio.map((w) => (
              <tr key={w.id} className="print-block border-b border-gray-400">
                <td className="py-2 pr-3 font-bold">{w.client}</td>
                <td className="py-2 pr-3">{w.title}</td>
                <td className="py-2 pr-3">{w.category}</td>
                <td className="py-2 pr-3">{w.year}</td>
                <td className="py-2">{w.scope.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="print-block mt-5 text-xs">
          총 {completed.length + portfolio.length}건 · 보유 자격: 산업디자인전문회사 · 여성기업 ·
          옥외광고사업 등록 · 공장등록 · 창업기업
        </p>
      </div>

      <div className="no-print relative overflow-hidden rounded-2xl">
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
