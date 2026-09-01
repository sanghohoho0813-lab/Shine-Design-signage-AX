"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { costTotal, marginOf, Project } from "@/lib/data";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";

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

export default function QuotesPage() {
  const { projects, hydrated, role } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);

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
  const totalQuote = quoted.reduce((s, p) => s + p.budget, 0);
  const totalCost = quoted.reduce((s, p) => s + costTotal(p.costs), 0);
  const totalMargin = ((totalQuote - totalCost) / totalQuote) * 100;
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
        <Stat label="예상 원가 합계" value={totalCost.toLocaleString() + "원"} bar="var(--ic-partner)" sub={`OEM 비중 ${((quoted.reduce((s, p) => s + (p.costs?.oem ?? 0), 0) / totalCost) * 100).toFixed(0)}%`} />
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
                    <p className="mb-2 text-xs font-bold text-muted">견적 인사이트 <span className="font-normal">(규칙 기반 · AI READY)</span></p>
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
      <p className="text-[0.6875rem] text-muted">※ 금액은 데모 데이터입니다. 점선 구간은 견적 대비 Margin 여유분입니다.</p>
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
