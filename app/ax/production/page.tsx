"use client";

import { useState } from "react";
import { partners, PRODUCTION_STATUSES, ProductionStatus } from "@/lib/data";
import { IMG } from "@/lib/data";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";
import { useApp, fmtTime } from "@/lib/store";
import { resolveOrders, nextOrderStatus, type ResolvedOrder } from "@/lib/production";
import { toast } from "@/components/Toast";

const STATUS_COLORS: Record<ProductionStatus, string> = {
  "발주 전": "var(--ic-system)",
  제작중: "var(--ic-partner)",
  검수대기: "var(--ic-sales)",
  완료: "var(--ic-evidence)",
  설치대기: "var(--ic-overview)",
};

/* 신규 발주 등록 — v15. 프로젝트·파트너를 고르고 품목·납기·제작비를 적는다 */
function NewOrderForm({ onDone }: { onDone: () => void }) {
  const { projects, addOrder } = useApp();
  const open = projects.filter((p) => p.stage !== "완료");
  const [f, setF] = useState({ projectId: open[0]?.id ?? "", item: "", partner: partners[0].name, due: "", cost: "", installLink: "" });
  return (
    <form
      aria-label="새 발주 등록"
      className="rounded-2xl border border-accent/40 bg-surface p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!f.projectId || !f.item.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(f.due)) { toast("프로젝트·품목·납기(YYYY-MM-DD)를 입력하세요", "info"); return; }
        addOrder({ projectId: f.projectId, item: f.item.trim(), partner: f.partner, due: f.due, cost: Math.max(0, Number(f.cost.replace(/[^\d]/g, "")) || 0), installLink: f.installLink.trim() || "미정" });
        toast("발주를 등록했습니다 — 설치 일정 '제작 납기'에 올라갑니다");
        onDone();
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-ink">새 발주 등록</h3>
        <button type="button" onClick={onDone} className="tap rounded-lg p-1.5 text-muted hover:bg-soft" aria-label="등록 취소">✕</button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-ink-2">프로젝트
          <select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })} className="input mt-1" aria-label="프로젝트">
            {open.map((p) => <option key={p.id} value={p.id}>{p.client} · {p.name}</option>)}
          </select>
        </label>
        <label className="text-xs text-ink-2">파트너
          <select value={f.partner} onChange={(e) => setF({ ...f, partner: e.target.value })} className="input mt-1" aria-label="파트너">
            {partners.map((pt) => <option key={pt.name} value={pt.name}>{pt.name} — {pt.field}</option>)}
          </select>
        </label>
        <label className="text-xs text-ink-2">제작 품목
          <input value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} className="input mt-1" aria-label="제작 품목" placeholder="예: 층별 유도사인 24EA" />
        </label>
        <label className="text-xs text-ink-2">납기
          <input type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} className="input mt-1" aria-label="납기" />
        </label>
        <label className="text-xs text-ink-2">제작비 (원)
          <input inputMode="numeric" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} className="input mt-1 tabular-nums" aria-label="제작비" placeholder="0" />
        </label>
        <label className="text-xs text-ink-2">설치 연결 (선택)
          <input value={f.installLink} onChange={(e) => setF({ ...f, installLink: e.target.value })} className="input mt-1" aria-label="설치 연결" placeholder="예: 설치 2차(10-14)" />
        </label>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onDone} className="tap btn btn-ghost btn-sm">취소</button>
        <button type="submit" className="tap btn btn-primary btn-sm">등록</button>
      </div>
    </form>
  );
}

export default function ProductionPage() {
  const { hydrated, projects, customOrders, orderStates, setOrderState } = useApp();
  const [filter, setFilter] = useState<ProductionStatus | "전체">("전체");
  const [adding, setAdding] = useState(false);
  if (!hydrated) return <AxSkeleton variant="list" />;
  const all = resolveOrders(customOrders, orderStates);
  const orders = all.filter((o) => filter === "전체" || o.status === filter);
  const projectName = (id: string) => projects.find((p) => p.id === id)?.client ?? "-";
  const advance = (o: ResolvedOrder) => {
    const next = nextOrderStatus(o.status);
    if (!next) return;
    setOrderState(o.id, { status: next, ...(next === "완료" ? { qc: "완료" as const } : {}) }, { status: o.status, qc: o.qc });
    toast(`${o.item} → ${next}`);
  };
  const toggleQc = (o: ResolvedOrder) => {
    const qc = o.qc === "완료" ? "대기" : "완료";
    setOrderState(o.id, { qc }, { status: o.status, qc: o.qc });
    toast(qc === "완료" ? "검수 완료로 기록했습니다" : "검수 대기로 되돌렸습니다");
  };
  const lateOrders = all.filter((o) => o.status !== "완료" && o.status !== "설치대기" && o.due < new Date().toISOString().slice(0, 10));
  const qcPending = all.filter((o) => o.status === "검수대기");

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="제작·파트너 관리"
        purpose="자체 공장과 외부 파트너의 발주·납기·검수·설치 연결을 한 화면에서 추적합니다. 상태·검수를 바꾸면 저장되고 설치 일정·오늘 할 일에 반영됩니다."
        stat={`발주 ${all.length}건`}
      >
        {!adding && <button onClick={() => setAdding(true)} className="tap hover-lift btn btn-primary btn-sm">＋ 새 발주 등록</button>}
      </PageHeader>
      {adding && <NewOrderForm onDone={() => setAdding(false)} />}
      {/* Context banner — restrained AX photo use */}
      <div className="relative overflow-hidden rounded-2xl">
        <img src={IMG.axOperation} alt="제작 파트너 공정 현장" className="h-36 w-full object-cover sm:h-44" style={{ objectPosition: "50% 45%" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-shell/90 to-shell/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
          <h2 className="text-lg font-black text-white sm:text-xl">제작 파트너 관리</h2>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-nav-inactive sm:text-[0.8125rem]">
            화성 공장의 자체 가공·조립 라인과 전문 제작·시공 파트너를 함께 운용합니다. 발주–제작–검수–설치
            연결을 한 화면에서 추적합니다.
          </p>
        </div>
      </div>

      {/* Partner summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {partners.map((pt) => (
          <div key={pt.name} className="hover-lift rounded-xl border border-line bg-surface p-4 shadow-sm">
            <p className="font-bold text-ink">{pt.name}</p>
            <p className="text-[0.6875rem] text-muted">{pt.field}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[0.625rem] text-muted">납기 준수율</p>
                <p className={`text-lg font-black tabular-nums ${pt.onTime >= 90 ? "text-[var(--ic-evidence)]" : pt.onTime >= 80 ? "text-[var(--ic-sales)]" : "text-[var(--ic-risk)]"}`}>
                  {pt.onTime}%
                </p>
              </div>
              <span className="rounded-full bg-soft px-2 py-0.5 text-[0.625rem] font-semibold text-ink-2">부하 {pt.load}</span>
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
            {s !== "전체" && <span className="ml-1 tabular-nums opacity-70">{all.filter((o) => o.status === s).length}</span>}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.6875rem] text-muted">
              <th className="px-4 py-3 font-medium">프로젝트</th>
              <th className="px-4 py-3 font-medium">제작 품목</th>
              <th className="px-4 py-3 font-medium">파트너</th>
              <th className="px-4 py-3 font-medium">납기</th>
              <th className="px-4 py-3 text-right font-medium">제작비</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">QC</th>
              <th className="px-4 py-3 font-medium">설치 연결</th>
              <th className="px-4 py-3 font-medium">처리</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-canvas">
                <td className="px-4 py-3 font-semibold text-ink">
                  {projectName(o.projectId)}
                  {o.custom && <span className="ml-1.5 rounded bg-accent/15 px-1.5 py-0.5 text-[0.5625rem] font-bold text-accent">신규</span>}
                </td>
                <td className="px-4 py-3 text-ink-2">
                  {o.item}
                  {o.risk && <span className="ml-2 rounded bg-[var(--ic-risk)]/12 px-1.5 py-0.5 text-[0.625rem] font-bold text-[var(--ic-risk)]">{o.risk}</span>}
                </td>
                <td className="px-4 py-3 text-ink-2">{o.partner}</td>
                <td className="px-4 py-3 tabular-nums text-ink-2">{o.due}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-2">{o.cost.toLocaleString()}원</td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[0.6875rem] font-bold"
                    style={{ color: STATUS_COLORS[o.status], background: `color-mix(in srgb, ${STATUS_COLORS[o.status]} 12%, transparent)` }}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-2">
                  <button onClick={() => toggleQc(o)} className={`tap rounded-md border px-2 py-0.5 text-[0.6875rem] font-semibold ${o.qc === "완료" ? "border-[var(--ic-evidence)]/40 text-[var(--ic-evidence)]" : "border-line text-ink-2 hover:bg-soft"}`} aria-label={`${o.item} 검수 ${o.qc === "완료" ? "완료 취소" : "완료 처리"}`}>
                    {o.qc === "완료" ? "✓ 완료" : o.qc === "대기" ? "대기 → 완료" : "검수 기록"}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{o.installLink}</td>
                <td className="px-4 py-3">
                  {nextOrderStatus(o.status) ? (
                    <button onClick={() => advance(o)} className="tap whitespace-nowrap rounded-md bg-shell px-2.5 py-1 text-[0.6875rem] font-bold text-white hover:bg-shell-2" aria-label={`${o.item} 다음 상태`}>
                      → {nextOrderStatus(o.status)}
                    </button>
                  ) : (
                    <span className="text-[0.6875rem] text-muted">{o.record ? fmtTime(o.record.at) : "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[var(--ic-sales)]/30 bg-[var(--ic-sales)]/6 p-4 text-sm text-ink-2">
        <b className="text-[var(--ic-sales)]">규칙 기반 리스크 체크</b> — 납기 지난 발주 {lateOrders.length}건
        {lateOrders.length > 0 && <span className="text-muted"> ({lateOrders.map((o) => `${o.partner} ${o.due.slice(5)}`).join(", ")})</span>} · 검수 대기 {qcPending.length}건
        {qcPending.length > 0 && <span className="text-muted"> ({qcPending.map((o) => o.partner).join(", ")})</span>}. 날짜 겹침은 설치 일정에서 확인합니다.
      </div>
    </div>
  );
}
