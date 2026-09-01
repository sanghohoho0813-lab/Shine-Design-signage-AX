"use client";

import { useState } from "react";
import { seedBids, Bid } from "@/lib/data";
import { Overlay } from "@/components/Overlay";
import { PageHeader } from "@/components/ax/PageHeader";

export default function BidsPage() {
  const [sel, setSel] = useState<Bid | null>(null);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="입찰·제안 관리"
        purpose="발굴 → 검토 → 준비 → 제출 → 결과. 보유 자격과 유사실적을 준비도 점수로 관리하며, 완료 프로젝트가 다음 입찰의 증빙이 됩니다."
        stat={`${seedBids.length}건 추적 중`}
      />

      <div data-tutorial="bid-list" className="grid gap-4 lg:grid-cols-2">
        {seedBids.map((b) => (
          <div key={b.id} className="hover-lift rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-soft px-2 py-0.5 text-[0.625rem] font-bold text-ink-2">{b.status}</span>
                  <span className="text-[0.6875rem] text-muted">마감 {b.deadline}</span>
                </div>
                <h3 className="mt-1.5 font-bold text-ink">{b.institution}</h3>
                <p className="text-sm text-ink-2">{b.project}</p>
              </div>
              <div className="text-right">
                <p className="text-[0.625rem] text-muted">입찰 준비도</p>
                <p className={`text-2xl font-black tabular-nums ${b.readiness >= 70 ? "text-[var(--ic-evidence)]" : b.readiness >= 55 ? "text-[var(--ic-sales)]" : "text-[var(--ic-risk)]"}`}>
                  {b.readiness}%
                </p>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft" role="progressbar" aria-valuenow={b.readiness} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${b.readiness}%`,
                  background: b.readiness >= 70 ? "var(--ic-evidence)" : b.readiness >= 55 ? "var(--ic-sales)" : "var(--ic-risk)",
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>예상 규모 <b className="tabular-nums text-ink-2">{b.amount.toLocaleString()}원</b></span>
              <span>Portfolio Match <b className={b.portfolioMatch === "높음" ? "text-[var(--ic-evidence)]" : "text-ink-2"}>{b.portfolioMatch}</b></span>
              <span>서류 <b className="tabular-nums text-ink-2">{b.checklist.filter((c) => c.done).length}/{b.checklist.length}</b></span>
            </div>

            <div className="mt-3 rounded-xl bg-canvas p-3.5 text-[0.8125rem] leading-relaxed text-ink-2">
              <b className="mr-1 rounded bg-[var(--ic-ai)]/15 px-1.5 py-0.5 text-[0.625rem] font-black text-[var(--ic-ai)]">AI</b>
              {b.insight}
            </div>

            <button
              onClick={() => setSel(b)}
              className="tap hover-lift mt-4 w-full rounded-lg bg-shell py-2.5 text-sm font-semibold text-white hover:bg-shell-2"
            >
              준비항목 보기
            </button>
          </div>
        ))}
      </div>

      {sel && (
        <Overlay onClose={() => setSel(null)} align="right" labelledBy="bid-title">
          <div className="anim-drawer-r flex h-dvh w-[min(94vw,400px)] flex-col overflow-y-auto bg-surface shadow-2xl">
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <p className="text-[0.6875rem] font-bold text-accent">준비도 {sel.readiness}% · {sel.status}</p>
                <h3 id="bid-title" className="mt-1 font-black text-ink">{sel.institution}</h3>
                <p className="text-sm text-ink-2">{sel.project}</p>
              </div>
              <button onClick={() => setSel(null)} className="tap rounded-lg p-2 text-muted hover:bg-soft" aria-label="닫기">✕</button>
            </div>
            <ul className="flex-1 space-y-2 p-5">
              {sel.checklist.map((c) => (
                <li
                  key={c.label}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                    c.done ? "border-line bg-canvas text-ink-2" : "border-[var(--ic-risk)]/25 bg-[var(--ic-risk)]/5 text-ink"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-bold ${
                      c.done ? "bg-[var(--ic-evidence)]/15 text-[var(--ic-evidence)]" : "bg-[var(--ic-risk)]/15 text-[var(--ic-risk)]"
                    }`}
                    aria-hidden
                  >
                    {c.done ? "✓" : "!"}
                  </span>
                  <span className="flex-1 font-medium">{c.label}</span>
                  {c.demo && <span className="rounded bg-soft px-1.5 py-0.5 text-[0.5625rem] font-bold text-muted">DEMO</span>}
                  {!c.done && <span className="text-[0.6875rem] font-semibold text-[var(--ic-risk)]">미확인</span>}
                </li>
              ))}
            </ul>
            <p className="border-t border-line p-5 text-xs leading-relaxed text-muted">
              보유 자격(여성기업·산업디자인전문회사·공장등록·옥외광고사업)은 회사 제공 자료 기준이며, 일부
              체크 항목은 데모 표시입니다.
            </p>
          </div>
        </Overlay>
      )}
    </div>
  );
}
