"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { costTotal, marginOf, Project, CostBreakdown } from "@/lib/data";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";
import { toast } from "@/components/Toast";

/* 원가 카테고리 팔레트 — dataviz 검증 통과(고정 순서, 순환 금지) */
const COST_ITEMS: { key: keyof NonNullable<Project["costs"]>; label: string; color: string }[] = [
  { key: "design", label: "디자인비", color: "#5b8def" },
  { key: "material", label: "자재비", color: "#3aafa9" },
  { key: "oem", label: "OEM 제작비", color: "#c37b4a" },
  { key: "direct", label: "직접 제작비", color: "#7376d9" },
  { key: "transport", label: "운송비", color: "#d79a43" },
  { key: "install", label: "설치비", color: "#3c9a75" },
  { key: "etc", label: "기타비용", color: "#a66bbe" },
];

function marginColor(m: number) {
  return m >= 30 ? "var(--ic-evidence)" : m >= 25 ? "var(--ic-sales)" : "var(--ic-risk)";
}

function quoteInsights(p: Project): { level: "risk" | "warn" | "ok"; text: string }[] {
  const out: { level: "risk" | "warn" | "ok"; text: string }[] = [];
  const m = marginOf(p);
  if (!p.costs || m === null) return out;
  if (m < 25) out.push({ level: "risk", text: `Margin ${m.toFixed(1)}% — 목표(30%) 대비 낮습니다. 사양 조정 또는 견적 재검토가 필요합니다.` });
  else if (m < 30) out.push({ level: "warn", text: `Margin ${m.toFixed(1)}% — 목표(30%)에 근접하지만 미달입니다.` });
  else out.push({ level: "ok", text: `Margin ${m.toFixed(1)}% — 목표 범위입니다.` });
  const oemShare = p.costs.oem / costTotal(p.costs);
  if (oemShare > 0.5) out.push({ level: "warn", text: `OEM 제작비 비중 ${(oemShare * 100).toFixed(0)}% — 파트너 견적 변동이 수익성에 직결됩니다.` });
  if (p.costs.install === 0) out.push({ level: "risk", text: "설치비 항목이 비어 있습니다. 견적 누락 위험." });
  return out;
}

/* 원가 실입력 — v14. 시드 원가는 DEMO지만 여기서 고친 값은 브라우저에 저장되고
   Margin 미달 KPI가 실입력 기준으로 바뀐다. 빈 항목은 0으로 저장한다. */
function CostEditor({ project, onDone }: { project: Project; onDone: () => void }) {
  const { updateProject } = useApp();
  const init = project.costs ?? { design: 0, material: 0, oem: 0, direct: 0, transport: 0, install: 0, etc: 0 };
  const [budget, setBudget] = useState(String(project.budget || ""));
  const [c, setC] = useState<Record<keyof CostBreakdown, string>>(
    Object.fromEntries(COST_ITEMS.map((i) => [i.key, init[i.key] ? String(init[i.key]) : ""])) as Record<keyof CostBreakdown, string>,
  );
  const num = (v: string) => Math.max(0, Math.round(Number(v.replace(/[^\d]/g, "")) || 0));
  const total = COST_ITEMS.reduce((s, i) => s + num(c[i.key]), 0);
  const b = num(budget);
  const m = b > 0 && total > 0 ? ((b - total) / b) * 100 : null;
  return (
    <form
      className="rounded-xl border border-accent/40 bg-canvas p-4"
      aria-label={`${project.client} 원가 입력`}
      onSubmit={(e) => {
        e.preventDefault();
        if (b <= 0) { toast("견적금액을 입력하세요", "info"); return; }
        const costs = Object.fromEntries(COST_ITEMS.map((i) => [i.key, num(c[i.key])])) as unknown as CostBreakdown;
        updateProject(project.id, { budget: b, costs });
        toast("원가를 저장했습니다 — Margin KPI에 반영됩니다");
        onDone();
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs text-ink-2 sm:col-span-2 lg:col-span-4">
          견적금액 (원)
          <input inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} className="input mt-1 w-full tabular-nums" aria-label="견적금액" placeholder="예: 25000000" />
        </label>
        {COST_ITEMS.map((i) => (
          <label key={i.key} className="text-xs text-ink-2">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-[2px]" style={{ background: i.color }} aria-hidden />{i.label}</span>
            <input inputMode="numeric" value={c[i.key]} onChange={(e) => setC({ ...c, [i.key]: e.target.value })} className="input mt-1 w-full tabular-nums" aria-label={i.label} placeholder="0" />
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-ink-2">
          원가 합계 <b className="tabular-nums text-ink">{total.toLocaleString()}원</b>
          {m !== null && <> · 예상 Margin <b className="tabular-nums" style={{ color: marginColor(m) }}>{m.toFixed(1)}%</b></>}
        </span>
        <span className="flex gap-2">
          <button type="button" onClick={onDone} className="tap btn btn-ghost btn-sm">취소</button>
          <button type="submit" className="tap btn btn-primary btn-sm">저장</button>
        </span>
      </div>
    </form>
  );
}

export default function QuotesPage() {
  const { projects, hydrated, role } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  if (!hydrated) return <AxSkeleton variant="list" />;

  if (role === "staff") {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-2xl" aria-hidden>🔒</p>
          <h2 className="mt-2 font-bold text-ink">견적·원가·Margin은 대표 전용입니다</h2>
          <p className="mt-1 text-sm text-muted">설정에서 역할을 &lsquo;대표&rsquo;로 전환하면 확인할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  const quoted = projects.filter((p) => p.costs);
  const unquoted = projects.filter((p) => !p.costs && p.stage !== "완료");
  const totalQuote = quoted.reduce((s, p) => s + p.budget, 0);
  const totalCost = quoted.reduce((s, p) => s + costTotal(p.costs), 0);
  const totalMargin = totalQuote ? ((totalQuote - totalCost) / totalQuote) * 100 : 0;
  const lowCount = quoted.filter((p) => (marginOf(p) ?? 100) < 30).length;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="견적·원가 관리"
        purpose="프로젝트별 원가 구성과 예상 Margin을 봅니다. 카드를 클릭하면 항목별 금액과 견적 인사이트가 열립니다."
        stat={`목표 Margin 30%`}
      />
      {/* Summary — 컬러 스탯 타일 */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="견적 합계" value={totalQuote.toLocaleString() + "원"} bar="var(--ic-overview)" sub={`${quoted.length}개 프로젝트`} />
        <Stat label="예상 원가 합계" value={totalCost.toLocaleString() + "원"} bar="var(--ic-partner)" sub={`OEM 비중 ${totalCost ? ((quoted.reduce((s, p) => s + (p.costs?.oem ?? 0), 0) / totalCost) * 100).toFixed(0) : 0}%`} />
        <Stat label="예상 Margin" value={totalMargin.toFixed(1) + "%"} bar={marginColor(totalMargin)} sub={(totalQuote - totalCost).toLocaleString() + "원"} accent />
        <Stat label="Margin 미달 건" value={`${lowCount}건`} bar={lowCount ? "var(--ic-risk)" : "var(--ic-evidence)"} sub="목표 30% 기준" />
      </div>

      {/* 범례 — 원가 구성 색상 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-line bg-surface px-4 py-2.5">
        <span className="text-[0.6875rem] font-bold text-muted">원가 구성</span>
        {COST_ITEMS.map((c) => (
          <span key={c.key} className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-ink-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: c.color }} aria-hidden />
            {c.label}
          </span>
        ))}
      </div>

      {/* 프로젝트별 카드 */}
      <div className="space-y-3">
        {quoted.map((p) => {
          const m = marginOf(p)!;
          const total = costTotal(p.costs);
          const insights = quoteInsights(p);
          const open = openId === p.id;
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <button
                onClick={() => setOpenId(open ? null : p.id)}
                className="tap block w-full p-4 text-left hover:bg-canvas sm:px-5"
                aria-expanded={open}
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">
                      {p.client} <span className="font-normal text-muted">· {p.name}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{p.stage} · 납기 {p.deadline}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[0.6875rem] text-muted">견적</p>
                    <p className="text-sm font-bold tabular-nums text-ink">{p.budget.toLocaleString()}원</p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1.5 text-sm font-black tabular-nums"
                    style={{ color: marginColor(m), background: `color-mix(in srgb, ${marginColor(m)} 12%, transparent)` }}
                  >
                    {m.toFixed(1)}%
                  </span>
                  <span className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>▾</span>
                </div>

                {/* 원가 구성 스택 바 — 세그먼트 간 2px 갭 */}
                <div className="mt-3 flex h-3.5 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label="원가 구성 비율">
                  {COST_ITEMS.filter((c) => (p.costs![c.key] ?? 0) > 0).map((c) => (
                    <span
                      key={c.key}
                      className="h-full rounded-[2px] transition-all"
                      style={{ width: `${(p.costs![c.key] / total) * 100}%`, background: c.color }}
                      title={`${c.label} ${p.costs![c.key].toLocaleString()}원`}
                    />
                  ))}
                  {/* Margin 여백 표시 */}
                  {p.budget > total && (
                    <span
                      className="h-full rounded-[2px] border border-dashed"
                      style={{ width: `${((p.budget - total) / p.budget) * 100}%`, borderColor: marginColor(m), background: `color-mix(in srgb, ${marginColor(m)} 6%, transparent)` }}
                      title={`Margin ${(p.budget - total).toLocaleString()}원`}
                    />
                  )}
                </div>
              </button>

              {open && p.costs && (
                <div className="anim-reveal grid gap-5 border-t border-line p-5 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-bold text-muted">원가 구성 상세</p>
                    <ul className="space-y-1.5">
                      {COST_ITEMS.map((c) => {
                        const v = p.costs![c.key];
                        const pct = (v / total) * 100;
                        return (
                          <li key={c.key} className="flex items-center gap-3 text-sm">
                            <span className="flex w-28 shrink-0 items-center gap-1.5 text-ink-2">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: c.color }} aria-hidden />
                              {c.label}
                            </span>
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-soft">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                            </div>
                            <span className="w-28 shrink-0 text-right tabular-nums text-ink-2">{v.toLocaleString()}원</span>
                            <span className="w-10 shrink-0 text-right text-[0.6875rem] tabular-nums text-muted">{pct.toFixed(0)}%</span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-3 flex justify-between border-t border-line pt-2 text-sm font-bold text-ink">
                      <span>원가 합계</span>
                      <span className="tabular-nums">{total.toLocaleString()}원</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-muted">견적 인사이트 <span className="font-normal">(규칙 기반 · AI READY)</span></p>
                      {editId !== p.id && (
                        <button onClick={() => setEditId(p.id)} className="tap btn btn-ghost btn-sm" aria-label={`${p.client} 원가 수정`}>✎ 원가 수정</button>
                      )}
                    </div>
                    {editId === p.id && <div className="mb-3"><CostEditor project={p} onDone={() => setEditId(null)} /></div>}
                    <ul className="space-y-2">
                      {insights.map((ins, i) => (
                        <li
                          key={i}
                          className="rounded-lg p-3 text-sm leading-relaxed text-ink-2"
                          style={{ background: `color-mix(in srgb, ${ins.level === "risk" ? "var(--ic-risk)" : ins.level === "warn" ? "var(--ic-sales)" : "var(--ic-evidence)"} 8%, transparent)` }}
                        >
                          <b style={{ color: ins.level === "risk" ? "var(--ic-risk)" : ins.level === "warn" ? "var(--ic-sales)" : "var(--ic-evidence)" }}>
                            {ins.level === "risk" ? "● 위험" : ins.level === "warn" ? "● 주의" : "● 양호"}
                          </b>{" "}
                          {ins.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* 원가 미입력 — 문의·낙찰로 들어온 건은 여기서 원가를 채워야 Margin KPI에 잡힌다 */}
      <section className="rounded-2xl border border-dashed border-line bg-surface p-5" data-testid="unquoted">
        <h3 className="font-bold text-ink">
          원가 미입력 프로젝트 <span className="text-xs font-normal text-muted">({unquoted.length}건) — 입력해야 Margin 미달 KPI에 집계됩니다</span>
        </h3>
        {unquoted.length === 0 ? (
          <p className="mt-2 text-sm text-muted">진행 중인 모든 프로젝트에 원가가 입력되어 있습니다.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {unquoted.map((p) => (
              <li key={p.id} className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{p.client} <span className="font-normal text-muted">· {p.name}</span></p>
                    <p className="text-xs text-muted">{p.stage} · 납기 {p.deadline}{p.fromInquiry ? " · 문의 유입" : p.isBid ? " · 입찰 수주" : ""}</p>
                  </div>
                  {editId !== p.id && (
                    <button onClick={() => setEditId(p.id)} className="tap btn btn-primary btn-sm" aria-label={`${p.client} 원가 입력`}>원가 입력</button>
                  )}
                </div>
                {editId === p.id && <div className="mt-3"><CostEditor project={p} onDone={() => setEditId(null)} /></div>}
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-[0.6875rem] text-muted">※ 시드 금액은 데모 데이터이며, 여기서 입력·수정한 값은 브라우저에 저장됩니다. 점선 구간은 견적 대비 Margin 여유분입니다.</p>
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
