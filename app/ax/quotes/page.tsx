"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { costTotal, marginOf, Project } from "@/lib/data";

const COST_LABELS: [keyof NonNullable<Project["costs"]>, string][] = [
  ["design", "디자인비"],
  ["material", "자재비"],
  ["oem", "OEM 제작비"],
  ["direct", "직접 제작비"],
  ["transport", "운송비"],
  ["install", "설치비"],
  ["etc", "기타비용"],
];

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

  if (!hydrated) return <div className="p-6 text-sm text-muted">불러오는 중…</div>;

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

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="견적 합계" value={totalQuote.toLocaleString() + "원"} />
        <Stat label="예상 원가 합계" value={totalCost.toLocaleString() + "원"} />
        <Stat label="예상 Margin" value={(((totalQuote - totalCost) / totalQuote) * 100).toFixed(1) + "%"} accent />
      </div>

      <div className="space-y-3">
        {quoted.map((p) => {
          const m = marginOf(p)!;
          const insights = quoteInsights(p);
          const open = openId === p.id;
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <button
                onClick={() => setOpenId(open ? null : p.id)}
                className="tap flex w-full items-center gap-4 p-4 text-left hover:bg-canvas sm:px-5"
                aria-expanded={open}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink">{p.client} <span className="font-normal text-muted">· {p.name}</span></p>
                  <p className="mt-0.5 text-xs text-muted">{p.stage} · 납기 {p.deadline}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[11px] text-muted">견적</p>
                  <p className="text-sm font-bold tabular-nums text-ink">{p.budget.toLocaleString()}원</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[11px] text-muted">원가</p>
                  <p className="text-sm font-medium tabular-nums text-ink-2">{costTotal(p.costs).toLocaleString()}원</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted">Margin</p>
                  <p className={`text-base font-black tabular-nums ${m >= 30 ? "text-[var(--ic-evidence)]" : m >= 25 ? "text-[var(--ic-sales)]" : "text-[var(--ic-risk)]"}`}>
                    {m.toFixed(1)}%
                  </p>
                </div>
                <span className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>▾</span>
              </button>

              {open && p.costs && (
                <div className="anim-reveal grid gap-5 border-t border-line p-5 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-bold text-muted">원가 구성</p>
                    <ul className="space-y-1.5">
                      {COST_LABELS.map(([k, label]) => {
                        const v = p.costs![k];
                        const pct = (v / costTotal(p.costs)) * 100;
                        return (
                          <li key={k} className="flex items-center gap-3 text-sm">
                            <span className="w-24 shrink-0 text-muted">{label}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
                              <div className="h-full rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-28 shrink-0 text-right tabular-nums text-ink-2">{v.toLocaleString()}원</span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-3 flex justify-between border-t border-line pt-2 text-sm font-bold text-ink">
                      <span>합계</span>
                      <span className="tabular-nums">{costTotal(p.costs).toLocaleString()}원</span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold text-muted">견적 인사이트 <span className="font-normal">(규칙 기반)</span></p>
                    <ul className="space-y-2">
                      {insights.map((ins, i) => (
                        <li
                          key={i}
                          className="rounded-lg p-3 text-sm leading-relaxed"
                          style={{
                            background: `color-mix(in srgb, ${ins.level === "risk" ? "var(--ic-risk)" : ins.level === "warn" ? "var(--ic-sales)" : "var(--ic-evidence)"} 8%, transparent)`,
                            color: "var(--ink-2)",
                          }}
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
      <p className="text-[11px] text-muted">※ 금액은 데모 데이터입니다. 인사이트는 규칙 기반(AI READY)으로 산출됩니다.</p>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-xl font-black tabular-nums ${accent ? "text-accent" : "text-ink"}`}>{value}</p>
    </div>
  );
}
