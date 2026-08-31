"use client";

import { useMemo, useState } from "react";
import { useApp, Inquiry } from "@/lib/store";
import { STAGES, Stage, Project, fmtKRWshort, costTotal, marginOf } from "@/lib/data";
import { Overlay } from "@/components/Overlay";
import { toast } from "@/components/Toast";

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

function dday(deadline: string): { label: string; urgent: boolean } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return null;
  const diff = Math.ceil((new Date(deadline + "T00:00:00").getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: `D+${-diff}`, urgent: true };
  return { label: diff === 0 ? "D-Day" : `D-${diff}`, urgent: diff <= 7 };
}

export default function PipelinePage() {
  const { projects, hydrated, advanceProject, inquiries, markInquiry } = useApp();
  const [sel, setSel] = useState<Project | null>(null);
  const [view, setView] = useState<"list" | "board">("list");
  const [stageFilter, setStageFilter] = useState<Stage | "전체">("전체");

  const sorted = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (a.stage === "완료" && b.stage !== "완료") return 1;
        if (b.stage === "완료" && a.stage !== "완료") return -1;
        return a.deadline.localeCompare(b.deadline);
      }),
    [projects],
  );

  if (!hydrated) return <div className="p-6 text-sm text-muted">불러오는 중…</div>;

  const current = sel ? projects.find((p) => p.id === sel.id) ?? null : null;
  const currentInquiry: Inquiry | undefined = current?.fromInquiry
    ? inquiries.find((q) => "pi-" + q.id === current.id)
    : undefined;
  const filtered = sorted.filter((p) => stageFilter === "전체" || p.stage === stageFilter);

  return (
    <div className="space-y-4 p-4 sm:p-6" data-tutorial="pipeline-board">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-ink">프로젝트 Pipeline</h2>
          <p className="text-xs text-muted">문의 → 현장·요구사항 → 디자인 → 견적 → 승인 → 제작 → 설치 → 완료</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-ink-2">
            진행 {projects.filter((p) => p.stage !== "완료").length}건 / 총 {projects.length}건
          </span>
          <div className="flex rounded-lg border border-line p-0.5" role="tablist" aria-label="보기 방식">
            {(["list", "board"] as const).map((v) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`tap rounded-md px-3 py-1.5 text-xs font-semibold ${
                  view === v ? "bg-shell text-white" : "text-muted hover:text-ink"
                }`}
              >
                {v === "list" ? "☰ 리스트" : "▦ 보드"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage strip — 클릭하면 해당 단계만 필터 */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="단계 필터">
        <button
          role="tab"
          aria-selected={stageFilter === "전체"}
          onClick={() => setStageFilter("전체")}
          className={`tap rounded-full px-3 py-1.5 text-xs font-semibold ${
            stageFilter === "전체" ? "bg-shell text-white" : "border border-line bg-surface text-ink-2 hover:bg-soft"
          }`}
        >
          전체 <span className="tabular-nums opacity-70">{projects.length}</span>
        </button>
        {STAGES.map((s) => {
          const n = projects.filter((p) => p.stage === s).length;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={stageFilter === s}
              onClick={() => setStageFilter(stageFilter === s ? "전체" : s)}
              className={`tap flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                stageFilter === s ? "bg-shell text-white" : "border border-line bg-surface text-ink-2 hover:bg-soft"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLORS[s] }} aria-hidden />
              {s} <span className="tabular-nums opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------ LIST VIEW ------------------------------ */}
      {view === "list" && (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <table className="w-full text-sm">
            <thead className="hidden border-b border-line text-left text-[0.6875rem] text-muted md:table-header-group">
              <tr>
                <th className="px-4 py-3 font-medium">프로젝트</th>
                <th className="px-3 py-3 font-medium">단계</th>
                <th className="px-3 py-3 font-medium">납기</th>
                <th className="hidden px-3 py-3 font-medium lg:table-cell">담당</th>
                <th className="px-3 py-3 text-right font-medium">견적금액</th>
                <th className="w-10 px-2 py-3" aria-label="상세" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const d = dday(p.deadline);
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSel(p)}
                    className="tap cursor-pointer border-b border-line last:border-0 hover:bg-canvas"
                    style={{ boxShadow: `inset 3px 0 0 0 ${p.risk === "높음" ? "var(--ic-risk)" : p.risk === "보통" ? "var(--ic-sales)" : "transparent"}` }}
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-bold leading-snug text-ink">
                        {p.client}
                        {p.fromInquiry && (
                          <span className="ml-2 rounded bg-[var(--ic-overview)]/12 px-1.5 py-0.5 text-[0.625rem] font-bold text-[var(--ic-overview)]">신규문의</span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] text-ink-2">{p.name}</p>
                      {/* mobile 보조 정보 */}
                      <p className="mt-1 text-[0.6875rem] text-muted md:hidden">
                        {p.stage} · {p.deadline}
                        {d && <b className={`ml-1 ${d.urgent ? "text-[var(--ic-risk)]" : ""}`}>{d.label}</b>}
                      </p>
                    </td>
                    <td className="hidden px-3 py-3.5 md:table-cell">
                      <span
                        className="whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6875rem] font-bold"
                        style={{ color: STAGE_COLORS[p.stage], background: `color-mix(in srgb, ${STAGE_COLORS[p.stage]} 12%, transparent)` }}
                      >
                        {p.stage}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-3.5 tabular-nums text-ink-2 md:table-cell">
                      {p.deadline}
                      {d && (
                        <span className={`ml-1.5 text-[0.6875rem] font-bold ${d.urgent ? "text-[var(--ic-risk)]" : "text-muted"}`}>{d.label}</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-3.5 text-ink-2 lg:table-cell">{p.owner}</td>
                    <td className="hidden whitespace-nowrap px-3 py-3.5 text-right tabular-nums font-medium text-ink md:table-cell">
                      {p.budget ? fmtKRWshort(p.budget) : <span className="text-muted">견적 전</span>}
                    </td>
                    <td className="px-2 py-3.5 text-center text-muted" aria-hidden>›</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted">해당 단계의 프로젝트가 없습니다.</p>}
        </div>
      )}

      {/* ------------------------------ BOARD VIEW ----------------------------- */}
      {view === "board" && (
        <div className="grid min-w-0 gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(8.5rem, 1fr))" }}>
          {STAGES.map((s) => {
            const list = filtered.filter((p) => p.stage === s);
            return (
              <div key={s} className="min-w-0 rounded-xl bg-soft/60 p-2">
                <div className="flex items-center justify-between px-1 py-1">
                  <p className="flex min-w-0 items-center gap-1.5 text-[0.6875rem] font-bold text-ink-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STAGE_COLORS[s] }} aria-hidden />
                    <span className="truncate">{s}</span>
                  </p>
                  <span className="text-[0.6875rem] font-bold tabular-nums text-muted">{list.length}</span>
                </div>
                <div className="mt-1 space-y-2">
                  {list.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSel(p)}
                      className="tap hover-lift block w-full rounded-lg border border-line bg-surface p-2.5 text-left shadow-sm"
                      style={{ borderLeftWidth: 3, borderLeftColor: p.risk === "높음" ? "var(--ic-risk)" : p.risk === "보통" ? "var(--ic-sales)" : "var(--line)" }}
                    >
                      <p className="line-clamp-2 text-[0.75rem] font-bold leading-snug text-ink">{p.client}</p>
                      <p className="mt-0.5 line-clamp-1 text-[0.6875rem] text-ink-2">{p.name}</p>
                      <p className="mt-1 text-[0.625rem] tabular-nums text-muted">{p.deadline.slice(5)}</p>
                    </button>
                  ))}
                  {list.length === 0 && <p className="py-2 text-center text-[0.625rem] text-muted/60">없음</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[0.6875rem] text-muted">
        ※ 공공입찰 트랙(발굴→검토→준비→제출→결과)은 <b>입찰·제안 관리</b>에서 별도로 관리합니다.
      </p>

      {/* ---------------------------- DETAIL DRAWER ---------------------------- */}
      {current && (
        <Overlay onClose={() => setSel(null)} align="right" labelledBy="proj-title">
          <div className="anim-drawer-r flex h-dvh w-[min(94vw,440px)] flex-col overflow-y-auto bg-surface shadow-2xl">
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <p className="flex items-center gap-1.5 text-[0.6875rem] font-bold" style={{ color: STAGE_COLORS[current.stage] }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLORS[current.stage] }} aria-hidden />
                  {current.stage}
                </p>
                <h3 id="proj-title" className="mt-1 text-lg font-black text-ink">{current.client}</h3>
                <p className="text-sm text-ink-2">{current.name}</p>
              </div>
              <button onClick={() => setSel(null)} className="tap rounded-lg p-2 text-muted hover:bg-soft" aria-label="닫기">✕</button>
            </div>

            <div className="flex-1 space-y-4 p-5">
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
                <Info k="납기" v={current.deadline + (dday(current.deadline) ? ` (${dday(current.deadline)!.label})` : "")} />
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

              {/* Customer Bridge — 문의 원본 정보 + 응대 상태 */}
              {currentInquiry && (
                <div className="rounded-xl border border-[var(--ic-overview)]/25 bg-[var(--ic-overview)]/6 p-4">
                  <p className="text-xs font-bold text-[var(--ic-overview)]">Customer Bridge — 고객 문의 원본</p>
                  <dl className="mt-2 space-y-1.5 text-[0.8125rem] text-ink-2">
                    <div className="flex justify-between"><dt className="text-muted">담당자</dt><dd className="font-semibold text-ink">{currentInquiry.name} {currentInquiry.org && `(${currentInquiry.org})`}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">연락처</dt><dd className="tabular-nums">{currentInquiry.phone}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">진행 단계</dt><dd>{currentInquiry.status}</dd></div>
                    {currentInquiry.budget && <div className="flex justify-between"><dt className="text-muted">예산 범위</dt><dd>{currentInquiry.budget}</dd></div>}
                    {currentInquiry.location && <div className="flex justify-between"><dt className="text-muted">위치</dt><dd>{currentInquiry.location}</dd></div>}
                    {currentInquiry.schedule && <div className="flex justify-between"><dt className="text-muted">희망 일정</dt><dd>{currentInquiry.schedule}</dd></div>}
                  </dl>
                  <div className="mt-3 flex gap-1.5">
                    {(["접수", "검토중", "상담예약"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          markInquiry(currentInquiry.id, st);
                          toast(`문의 상태 → '${st}'`);
                        }}
                        aria-pressed={currentInquiry.axStatus === st}
                        className={`tap flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                          currentInquiry.axStatus === st
                            ? "bg-[var(--ic-overview)] text-white"
                            : "border border-line bg-surface text-ink-2 hover:bg-soft"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {current.fromInquiry && !currentInquiry && (
                <div className="rounded-xl border border-[var(--ic-overview)]/25 bg-[var(--ic-overview)]/6 p-4 text-sm text-ink-2">
                  <p className="text-xs font-bold text-[var(--ic-overview)]">Customer Bridge</p>
                  <p className="mt-1">고객 사이트 프로젝트 문의에서 자동 생성된 건입니다.</p>
                </div>
              )}
            </div>

            <div className="border-t border-line p-5">
              {current.stage !== "완료" ? (
                <button
                  onClick={() => {
                    const next = STAGES[STAGES.indexOf(current.stage) + 1];
                    advanceProject(current.id);
                    toast(next === "완료" ? `${current.client} 완료 — 증빙·포트폴리오 자산으로 전환됨` : `${current.client} → '${next}' 단계로 이동`);
                  }}
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
      <dt className="text-[0.625rem] text-muted">{k}</dt>
      <dd className="mt-0.5 font-semibold text-ink" style={color ? { color } : undefined}>{v}</dd>
    </div>
  );
}
