"use client";

import { useState } from "react";
import { seedProduction, partners, PRODUCTION_STATUSES, ProductionStatus, seedProjects } from "@/lib/data";
import { IMG } from "@/lib/data";

const STATUS_COLORS: Record<ProductionStatus, string> = {
  "발주 전": "var(--ic-system)",
  제작중: "var(--ic-partner)",
  검수대기: "var(--ic-sales)",
  완료: "var(--ic-evidence)",
  설치대기: "var(--ic-overview)",
};

export default function ProductionPage() {
  const [filter, setFilter] = useState<ProductionStatus | "전체">("전체");
  const orders = seedProduction.filter((o) => filter === "전체" || o.status === filter);
  const projectName = (id: string) => seedProjects.find((p) => p.id === id)?.client ?? "-";

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* Context banner — restrained AX photo use */}
      <div className="relative overflow-hidden rounded-2xl">
        <img src={IMG.axOperation} alt="제작 파트너 공정 현장" className="h-36 w-full object-cover sm:h-44" style={{ objectPosition: "50% 45%" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-shell/90 to-shell/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
          <h2 className="text-lg font-black text-white sm:text-xl">제작 파트너 관리</h2>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-nav-inactive sm:text-[13px]">
            화성·남양주 자체 가공·조립 라인과 전문 제작·시공 파트너를 함께 운용합니다. 발주–제작–검수–설치
            연결을 한 화면에서 추적합니다.
          </p>
        </div>
      </div>

      {/* Partner summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {partners.map((pt) => (
          <div key={pt.name} className="hover-lift rounded-xl border border-line bg-surface p-4 shadow-sm">
            <p className="font-bold text-ink">{pt.name}</p>
            <p className="text-[11px] text-muted">{pt.field}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-muted">납기 준수율</p>
                <p className={`text-lg font-black tabular-nums ${pt.onTime >= 90 ? "text-[var(--ic-evidence)]" : pt.onTime >= 80 ? "text-[var(--ic-sales)]" : "text-[var(--ic-risk)]"}`}>
                  {pt.onTime}%
                </p>
              </div>
              <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-semibold text-ink-2">부하 {pt.load}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" role="tablist" aria-label="제작 상태 필터">
        {(["전체", ...PRODUCTION_STATUSES] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={filter === s}
            onClick={() => setFilter(s)}
            className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              filter === s ? "bg-shell text-white" : "border border-line bg-surface text-ink-2 hover:bg-soft"
            }`}
          >
            {s}
            {s !== "전체" && <span className="ml-1 tabular-nums opacity-70">{seedProduction.filter((o) => o.status === s).length}</span>}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] text-muted">
              <th className="px-4 py-3 font-medium">프로젝트</th>
              <th className="px-4 py-3 font-medium">제작 품목</th>
              <th className="px-4 py-3 font-medium">파트너</th>
              <th className="px-4 py-3 font-medium">납기</th>
              <th className="px-4 py-3 text-right font-medium">제작비</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">QC</th>
              <th className="px-4 py-3 font-medium">설치 연결</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-canvas">
                <td className="px-4 py-3 font-semibold text-ink">{projectName(o.projectId)}</td>
                <td className="px-4 py-3 text-ink-2">
                  {o.item}
                  {o.risk && <span className="ml-2 rounded bg-[var(--ic-risk)]/12 px-1.5 py-0.5 text-[10px] font-bold text-[var(--ic-risk)]">{o.risk}</span>}
                </td>
                <td className="px-4 py-3 text-ink-2">{o.partner}</td>
                <td className="px-4 py-3 tabular-nums text-ink-2">{o.due}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-2">{o.cost.toLocaleString()}원</td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ color: STATUS_COLORS[o.status], background: `color-mix(in srgb, ${STATUS_COLORS[o.status]} 12%, transparent)` }}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-2">{o.qc}</td>
                <td className="px-4 py-3 text-xs text-muted">{o.installLink}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[var(--ic-sales)]/30 bg-[var(--ic-sales)]/6 p-4 text-sm text-ink-2">
        <b className="text-[var(--ic-sales)]">규칙 기반 리스크 체크</b> — 납기 임박 1건(자체 1공장 · 09-08),
        검수 미완료 1건(빛나라사인). 설치 일정과 충돌하는 발주 건은 없습니다.
      </div>
    </div>
  );
}
