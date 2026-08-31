"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { STAGES, Stage, Project, fmtKRWshort, costTotal, marginOf } from "@/lib/data";
import { Overlay } from "@/components/Overlay";

const STAGE_COLORS: Record<Stage, string> = {
  문의: "var(--ic-overview)",
  "현장·요구사항": "var(--ic-ops)",
  디자인: "var(--ic-crm)",
  견적: "var(--ic-sales)",
  승인: "var(--ic-ai)",
  제작: "var(--ic-partner)",
  설치: "var(--ic-risk)",
  완료: "var(--ic-evidence)",
};

export default function PipelinePage() {
  const { projects, hydrated, advanceProject } = useApp();
  const [sel, setSel] = useState<Project | null>(null);
  if (!hydrated) return <div className="p-6 text-sm text-muted">불러오는 중…</div>;

  const current = sel ? projects.find((p) => p.id === sel.id) ?? null : null;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-ink">프로젝트 Pipeline</h2>
          <p className="text-xs text-muted">문의 → 현장·요구사항 → 디자인 → 견적 → 승인 → 제작 → 설치 → 완료</p>
        </div>
        <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-ink-2">
          총 {projects.length}건 · 진행 {projects.filter((p) => p.stage !== "완료").length}건
        </span>
      </div>

      {/* Board */}
      <div data-tutorial="pipeline-board" className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
        {STAGES.map((s) => {
          const list = projects.filter((p) => p.stage === s);
          return (
            <div key={s} className="w-[240px] shrink-0 rounded-xl bg-soft/60 p-2">
              <div className="flex items-center justify-between px-1.5 py-1">
                <p className="flex items-center gap-1.5 text-[12px] font-bold text-ink-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLORS[s] }} aria-hidden />
                  {s}
                </p>
                <span className="text-[11px] font-bold tabular-nums text-muted">{list.length}</span>
              </div>
              <div className="mt-1 space-y-2">
                {list.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSel(p)}
                    className="tap hover-lift block w-full rounded-lg border border-line bg-surface p-3 text-left shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-bold leading-snug text-ink">{p.client}</p>
                      {p.risk === "높음" && <span className="shrink-0 rounded bg-[var(--ic-risk)]/12 px-1.5 py-0.5 text-[9px] font-bold text-[var(--ic-risk)]">위험</span>}
                      {p.fromInquiry && <span className="shrink-0 rounded bg-[var(--ic-overview)]/12 px-1.5 py-0.5 text-[9px] font-bold text-[var(--ic-overview)]">신규문의</span>}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-2">{p.name}</p>
                    <p className="mt-1.5 text-[10px] text-muted">
                      {p.deadline} · {p.owner} {p.budget ? `· ${fmtKRWshort(p.budget)}` : ""}
                    </p>
                  </button>
                ))}
                {list.length === 0 && <p className="px-1.5 py-3 text-center text-[11px] text-muted/70">없음</p>}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted">
        ※ 공공입찰 트랙(발굴→검토→준비→제출→결과)은 <b>입찰·제안 관리</b>에서 별도로 관리합니다.
      </p>

      {/* Detail drawer */}
      {current && (
        <Overlay onClose={() => setSel(null)} align="right" labelledBy="proj-title">
          <div className="anim-drawer-r flex h-dvh w-[min(94vw,420px)] flex-col overflow-y-auto bg-surface shadow-2xl">
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: STAGE_COLORS[current.stage] }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLORS[current.stage] }} aria-hidden />
                  {current.stage}
                </p>
                <h3 id="proj-title" className="mt-1 text-lg font-black text-ink">{current.client}</h3>
                <p className="text-sm text-ink-2">{current.name}</p>
              </div>
              <button onClick={() => setSel(null)} className="tap rounded-lg p-2 text-muted hover:bg-soft" aria-label="닫기">✕</button>
            </div>

            <div className="flex-1 space-y-4 p-5">
              {/* Stage progress */}
              <div className="flex items-center gap-1" aria-label={`진행 단계: ${current.stage}`}>
                {STAGES.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i <= STAGES.indexOf(current.stage) ? "bg-accent" : "bg-soft"}`} />
                  </div>
                ))}
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Info k="분야" v={current.category} />
                <Info k="담당" v={current.owner} />
                <Info k="납기" v={current.deadline} />
                <Info k="리스크" v={current.risk} color={current.risk === "높음" ? "var(--ic-risk)" : current.risk === "보통" ? "var(--ic-sales)" : "var(--ic-evidence)"} />
                <Info k="견적금액" v={current.budget ? current.budget.toLocaleString() + "원" : "견적 전"} />
                <Info k="예상 원가" v={current.costs ? costTotal(current.costs).toLocaleString() + "원" : "-"} />
              </dl>

              {current.costs && (
                <div className="rounded-xl bg-canvas p-4">
                  <p className="text-xs font-semibold text-muted">예상 Margin</p>
                  <p className="mt-1 text-2xl font-black tabular-nums text-accent">{marginOf(current)?.toFixed(1)}%</p>
                </div>
              )}

              {current.riskNote && (
                <div className="rounded-xl border border-[var(--ic-risk)]/25 bg-[var(--ic-risk)]/6 p-4">
                  <p className="text-xs font-bold text-[var(--ic-risk)]">리스크 메모</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{current.riskNote}</p>
                </div>
              )}

              {current.fromInquiry && (
                <div className="rounded-xl border border-[var(--ic-overview)]/25 bg-[var(--ic-overview)]/6 p-4 text-sm text-ink-2">
                  <p className="text-xs font-bold text-[var(--ic-overview)]">Customer Bridge</p>
                  <p className="mt-1">고객 사이트 프로젝트 문의에서 자동 생성된 건입니다. 요구사항 확인 후 단계를 진행하세요.</p>
                </div>
              )}
            </div>

            <div className="border-t border-line p-5">
              {current.stage !== "완료" ? (
                <button
                  onClick={() => advanceProject(current.id)}
                  className="tap hover-lift w-full rounded-lg bg-shell py-3 text-sm font-bold text-white hover:bg-shell-2"
                >
                  다음 단계로 이동 → {STAGES[STAGES.indexOf(current.stage) + 1]}
                </button>
              ) : (
                <p className="rounded-lg bg-[var(--ic-evidence)]/10 py-3 text-center text-sm font-semibold text-[var(--ic-evidence)]">
                  ✓ 완료 — 증빙·포트폴리오 자산으로 전환됨
                </p>
              )}
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Info({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="rounded-lg border border-line p-2.5">
      <dt className="text-[10px] text-muted">{k}</dt>
      <dd className="mt-0.5 font-semibold text-ink" style={color ? { color } : undefined}>{v}</dd>
    </div>
  );
}
