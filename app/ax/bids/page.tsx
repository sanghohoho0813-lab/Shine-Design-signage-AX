"use client";

import { useState } from "react";
import Link from "next/link";
import { seedBids, Bid } from "@/lib/data";
import { useApp, BID_STATUSES, type BidResult, type BidStatus, fmtTime } from "@/lib/store";
import { Overlay } from "@/components/Overlay";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";
import { toast } from "@/components/Toast";

/* ---------------------------------------------------------------------------
   입찰·제안 관리 — v14부터 상태와 결과가 저장된다.
   시드 4건은 고정 자료(DEMO)지만, 상태 진행과 결과(낙찰/유찰/미참여)는 기록으로
   남고 '낙찰률' KPI와 Evidence Log(BID)로 이어진다. 낙찰은 파이프라인 프로젝트가 된다.
--------------------------------------------------------------------------- */

const RESULT_TONE: Record<BidResult, string> = { 낙찰: "var(--ic-evidence)", 유찰: "var(--ic-risk)", 미참여: "var(--ic-system)" };

export default function BidsPage() {
  const { hydrated, bidStates, setBidStatus, setBidResult } = useApp();
  const [sel, setSel] = useState<Bid | null>(null);
  if (!hydrated) return <AxSkeleton variant="cards" />;

  const statusOf = (b: Bid): BidStatus => bidStates[b.id]?.status ?? b.status;
  const resultOf = (b: Bid) => bidStates[b.id]?.result;
  const results = seedBids.map(resultOf).filter(Boolean) as BidResult[];
  const won = results.filter((r) => r === "낙찰").length;
  const lost = results.filter((r) => r === "유찰").length;
  const skipped = results.filter((r) => r === "미참여").length;
  const winRate = won + lost ? `${Math.round((won / (won + lost)) * 100)}%` : "—";

  const advance = (b: Bid) => {
    const cur = statusOf(b);
    const i = BID_STATUSES.indexOf(cur);
    if (i >= BID_STATUSES.length - 1) return;
    setBidStatus(b.id, BID_STATUSES[i + 1], b.status);
    toast(`${b.institution} → ${BID_STATUSES[i + 1]}`);
  };
  const record = (b: Bid, r: BidResult) => {
    const note = window.prompt(`${r} 사유·메모 (선택)`, "");
    if (note === null) return;
    setBidResult(b.id, r, { status: statusOf(b), institution: b.institution, project: b.project, amount: b.amount, deadline: b.deadline }, note.trim() || undefined);
    toast(r === "낙찰" ? `낙찰 기록 — 파이프라인 '승인' 단계에 프로젝트로 추가됐습니다` : `${r} 기록 — 낙찰률 KPI에 반영됩니다`);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="입찰·제안 관리"
        purpose="발굴 → 검토 → 준비 → 제출 → 결과. 결과를 입력하면 낙찰률이 실측되고, 낙찰 건은 파이프라인 프로젝트가 됩니다."
        stat={`${seedBids.length}건 추적 중`}
      />

      {/* 결과 집계 — 낙찰률 KPI의 현재값. 결과가 없으면 "—" */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="bid-summary">
        <Stat label="낙찰률 (기록 기준)" value={winRate} sub={won + lost ? `낙찰 ${won} ÷ 결과 ${won + lost}` : "결과 입력 전"} bar="var(--ic-crm)" accent />
        <Stat label="낙찰" value={`${won}건`} bar="var(--ic-evidence)" />
        <Stat label="유찰" value={`${lost}건`} bar="var(--ic-risk)" />
        <Stat label="미참여" value={`${skipped}건`} sub="분모 제외" bar="var(--ic-system)" />
      </div>

      <div data-tutorial="bid-list" className="grid gap-4 lg:grid-cols-2">
        {seedBids.map((b) => {
          const st = statusOf(b);
          const rs = resultOf(b);
          const rec = bidStates[b.id];
          const nextIdx = BID_STATUSES.indexOf(st) + 1;
          return (
            <div key={b.id} className="hover-lift rounded-2xl border border-line bg-surface p-5 shadow-sm" data-testid={`bid-${b.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[0.625rem] font-bold text-ink-2">{st}</span>
                    {rs && (
                      <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-black" style={{ color: RESULT_TONE[rs], background: `color-mix(in srgb, ${RESULT_TONE[rs]} 12%, transparent)` }}>
                        {rs}{rec?.resultAt ? ` · ${fmtTime(rec.resultAt)}` : ""}
                      </span>
                    )}
                    <span className="text-[0.6875rem] text-muted">마감 {b.deadline}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-ink">{b.institution}</h3>
                  <p className="text-sm text-ink-2">{b.project}</p>
                </div>
                <div className="shrink-0 text-right">
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

              {/* 상태 스텝 — 어디까지 왔는지 */}
              <ol className="mt-3 flex flex-wrap items-center gap-1 text-[0.625rem]" aria-label="입찰 진행 단계">
                {BID_STATUSES.map((s, i) => {
                  const idx = BID_STATUSES.indexOf(st);
                  const done = i <= idx;
                  return (
                    <li key={s} className="flex items-center gap-1">
                      <span className={`rounded-md px-1.5 py-0.5 font-bold ${done ? "bg-accent/15 text-accent" : "bg-soft text-muted"}`}>{s}</span>
                      {i < BID_STATUSES.length - 1 && <span className="text-muted" aria-hidden>›</span>}
                    </li>
                  );
                })}
              </ol>

              <div className="mt-3 rounded-xl bg-canvas p-3.5 text-[0.8125rem] leading-relaxed text-ink-2">
                <b className="mr-1 rounded bg-[var(--ic-ai)]/15 px-1.5 py-0.5 text-[0.625rem] font-black text-[var(--ic-ai)]">규칙</b>
                {b.insight}
              </div>

              {/* 실행 — 다음 단계 / 결과 입력 */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setSel(b)} className="tap hover-lift btn btn-ghost btn-sm">
                  준비항목 보기
                </button>
                {!rs && nextIdx < BID_STATUSES.length && (
                  <button onClick={() => advance(b)} className="tap hover-lift btn btn-primary btn-sm" aria-label={`${b.institution} 다음 단계`}>
                    다음 단계 → {BID_STATUSES[nextIdx]}
                  </button>
                )}
                {!rs && (st === "제출" || st === "결과대기") && (
                  <span className="flex flex-wrap gap-1.5" role="group" aria-label={`${b.institution} 결과 입력`}>
                    {(["낙찰", "유찰", "미참여"] as BidResult[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => record(b, r)}
                        className="tap rounded-lg border px-2.5 py-1.5 text-xs font-bold"
                        style={{ color: RESULT_TONE[r], borderColor: `color-mix(in srgb, ${RESULT_TONE[r]} 40%, transparent)` }}
                      >
                        {r}
                      </button>
                    ))}
                  </span>
                )}
                {rs === "낙찰" && (
                  <Link href="/ax/pipeline" className="tap btn btn-ghost btn-sm">
                    파이프라인에서 보기 →
                  </Link>
                )}
              </div>
              {rec?.note && <p className="mt-2 text-[0.6875rem] text-muted">메모: {rec.note}</p>}
            </div>
          );
        })}
      </div>
      <p className="text-[0.6875rem] text-muted">※ 입찰 건 4개는 시연용 시드입니다. 상태·결과 입력은 브라우저에 저장되고 Evidence Log(BID)와 낙찰률 KPI에 반영됩니다.</p>

      {sel && (
        <Overlay onClose={() => setSel(null)} align="right" labelledBy="bid-title">
          <div className="anim-drawer-r flex h-dvh w-[min(94vw,400px)] flex-col overflow-y-auto bg-surface shadow-2xl">
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <p className="text-[0.6875rem] font-bold text-accent">준비도 {sel.readiness}% · {statusOf(sel)}</p>
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
            {bidStates[sel.id]?.log.length ? (
              <div className="border-t border-line p-5">
                <p className="text-xs font-bold text-ink-2">상태 이력</p>
                <ul className="mt-1.5 space-y-1 text-xs text-muted">
                  {bidStates[sel.id].log.map((l, i) => (
                    <li key={i} className="flex justify-between gap-3"><span>{l.status}</span><span className="tabular-nums">{fmtTime(l.at)}</span></li>
                  ))}
                </ul>
              </div>
            ) : null}
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

function Stat({ label, value, sub, bar, accent }: { label: string; value: string; sub?: string; bar: string; accent?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-4 pl-5 shadow-sm">
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: bar }} aria-hidden />
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-xl font-black tabular-nums ${accent ? "" : "text-ink"}`} style={accent ? { color: bar } : undefined}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[0.6875rem] text-secondary">{sub}</p>}
    </div>
  );
}
