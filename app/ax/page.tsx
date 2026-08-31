"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { seedProduction, seedBids, partners, STAGES, fmtKRWshort, costTotal, IMG } from "@/lib/data";

export default function AxDashboard() {
  const { projects, inquiries, role, hydrated } = useApp();
  if (!hydrated) return <div className="p-6 text-sm text-muted">불러오는 중…</div>;

  const active = projects.filter((p) => p.stage !== "완료");
  const making = projects.filter((p) => p.stage === "제작");
  const installing = projects.filter((p) => p.stage === "설치");
  const quoting = projects.filter((p) => p.stage === "견적" || p.stage === "디자인");
  const revenue = active.reduce((s, p) => s + p.budget, 0);
  const cost = active.reduce((s, p) => s + costTotal(p.costs), 0);
  const margin = revenue ? ((revenue - cost) / revenue) * 100 : 0;
  const risky = projects.filter((p) => p.risk === "높음");
  const canSeeMoney = role === "ceo";

  // 최근 8주 추이 (DEMO) — 스파크라인용
  const kpis = [
    { label: "진행 프로젝트", value: `${active.length}건`, delta: "▲ 신규 문의 " + inquiries.length + "건", href: "/ax/pipeline", spark: [5, 6, 6, 7, 7, 8, 8, active.length] },
    { label: "견적·디자인 단계", value: `${quoting.length}건`, delta: "이번달 견적 예정", href: "/ax/quotes", spark: [1, 2, 1, 3, 2, 2, 3, quoting.length] },
    { label: "제작 진행", value: `${making.length}건`, delta: `발주 ${seedProduction.filter((m) => m.status === "제작중").length}건 제작중`, href: "/ax/production", spark: [1, 1, 2, 1, 2, 3, 2, making.length] },
    { label: "설치 예정", value: `${installing.length}건`, delta: "이번주 일정 확인", href: "/ax/pipeline", spark: [0, 1, 1, 2, 1, 1, 2, installing.length] },
    canSeeMoney
      ? { label: "예상 매출", value: fmtKRWshort(revenue), delta: "진행 프로젝트 합계", href: "/ax/quotes", spark: [1.2, 1.4, 1.3, 1.6, 1.8, 1.7, 2.0, revenue / 100000000] }
      : { label: "예상 매출", value: "권한 제한", delta: "대표 전용 지표", href: "/ax/settings" },
    canSeeMoney
      ? { label: "예상 Margin", value: margin.toFixed(1) + "%", delta: margin >= 30 ? "▲ 목표(30%) 이상" : "▼ 목표(30%) 미만", href: "/ax/quotes", spark: [28, 27, 29, 26, 28, 27, 26, margin], warn: margin < 30 }
      : { label: "예상 Margin", value: "권한 제한", delta: "대표 전용 지표", href: "/ax/settings" },
    { label: "입찰 준비 건", value: `${seedBids.length}건`, delta: `준비도 최고 ${Math.max(...seedBids.map((b) => b.readiness))}%`, href: "/ax/bids", spark: [1, 1, 2, 2, 3, 3, 4, seedBids.length] },
    { label: "리스크 프로젝트", value: `${risky.length}건`, delta: risky.length ? "즉시 확인 필요" : "안정", href: "/ax/briefing", spark: [0, 1, 1, 0, 1, 2, 1, risky.length], warn: risky.length > 0 },
  ] as { label: string; value: string; delta: string; href: string; spark?: number[]; warn?: boolean }[];

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {role === "ceo" && (
        <p className="text-sm text-muted">
          <b className="text-ink">권유진 대표님</b>, 오늘의 샤인디자인입니다 — 확인이 필요한 항목{" "}
          <b className="text-[var(--ic-risk)]">{risky.length + inquiries.length}건</b>
        </p>
      )}
      {/* KPI row */}
      <section data-tutorial="kpi-row" className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="tap hover-lift group relative overflow-hidden rounded-xl border border-line bg-surface p-3.5 shadow-sm">
            <p className="text-[11px] font-medium text-muted">{k.label}</p>
            <p className="mt-1 text-lg font-black tabular-nums text-ink">{k.value}</p>
            <p className={`mt-0.5 truncate text-[10px] ${k.delta.startsWith("▼") || k.delta.includes("즉시") ? "text-[var(--ic-risk)]" : "text-secondary"}`}>{k.delta}</p>
            {k.spark && <Sparkline data={k.spark} warn={k.warn} />}
          </Link>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Pipeline snapshot */}
        <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">프로젝트 진행 현황</h2>
            <Link href="/ax/pipeline" className="tap text-xs font-semibold text-muted hover:text-ink">전체 보기 →</Link>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {STAGES.map((s, i) => {
              const n = projects.filter((p) => p.stage === s).length;
              return (
                <div key={s} className="flex items-center">
                  <div className={`min-w-[76px] rounded-lg px-2.5 py-2 text-center ${n ? "bg-soft" : "bg-canvas"}`}>
                    <p className="text-[10px] text-muted">{s}</p>
                    <p className={`text-base font-black tabular-nums ${n ? "text-ink" : "text-muted/50"}`}>{n}</p>
                  </div>
                  {i < STAGES.length - 1 && <span className="px-0.5 text-line" aria-hidden>›</span>}
                </div>
              );
            })}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {active.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link href="/ax/pipeline" className="tap flex items-center gap-3 py-2.5 hover:bg-canvas">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: p.risk === "높음" ? "var(--ic-risk)" : p.risk === "보통" ? "var(--ic-sales)" : "var(--ic-evidence)" }}
                    aria-label={`리스크 ${p.risk}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {p.client} <span className="font-normal text-muted">· {p.name}</span>
                    </p>
                    <p className="text-[11px] text-muted">{p.stage} · 납기 {p.deadline}{p.fromInquiry && " · 고객 문의 유입"}</p>
                  </div>
                  <span className="text-[11px] font-medium tabular-nums text-ink-2">{p.budget ? fmtKRWshort(p.budget) : "견적 전"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* AI briefing */}
        <section
          data-tutorial="ai-card"
          className="relative overflow-hidden rounded-2xl bg-shell p-5 shadow-lg"
        >
          <img src={IMG.axManager} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[0.14]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-nav-active">
                <span className="rounded-md bg-[var(--ic-ai)]/30 px-1.5 py-0.5 text-[10px] font-black text-white">AI</span>
                오늘의 AX 브리핑
              </h2>
              <span className="text-[10px] text-nav-muted">규칙 기반 · AI READY</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-nav-primary">이번 주 가장 주의할 프로젝트 {Math.min(risky.length, 2) || "0"}건</p>
            <div className="mt-3 space-y-2.5">
              {risky.slice(0, 2).map((p, i) => (
                <div key={p.id} className="rounded-xl bg-white/8 p-3.5 backdrop-blur">
                  <p className="flex items-start gap-2 text-[13px] font-bold text-nav-active">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-black text-shell">{i + 1}</span>
                    {p.client} {p.name}
                  </p>
                  <p className="ml-7 mt-1 text-[12px] leading-relaxed text-nav-inactive">{p.riskNote}</p>
                  <div className="ml-7 mt-2">
                    <Link href="/ax/briefing" className="tap inline-block rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold text-shell hover:brightness-110">
                      Action 보기
                    </Link>
                  </div>
                </div>
              ))}
              {risky.length === 0 && <p className="rounded-xl bg-white/8 p-3.5 text-sm text-nav-inactive">현재 높은 리스크 프로젝트가 없습니다.</p>}
            </div>
            <Link href="/ax/briefing" className="tap mt-3 block rounded-lg border border-white/20 py-2 text-center text-xs font-semibold text-nav-primary hover:bg-white/10">
              전체 추천 Action 보기
            </Link>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Margin summary */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="font-bold text-ink">견적 / 매출 / Margin <span className="text-xs font-normal text-muted">(진행 기준)</span></h2>
          {canSeeMoney ? (
            <div className="mt-4 flex items-center gap-5">
              <Donut pct={margin} />
              <dl className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted">예상 매출</dt><dd className="font-bold tabular-nums text-ink">{revenue.toLocaleString()}원</dd></div>
                <div className="flex justify-between"><dt className="text-muted">예상 원가</dt><dd className="font-medium tabular-nums text-ink-2">{cost.toLocaleString()}원</dd></div>
                <div className="flex justify-between"><dt className="text-muted">예상 Margin</dt><dd className="font-bold tabular-nums text-accent">{(revenue - cost).toLocaleString()}원</dd></div>
              </dl>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-canvas p-4 text-sm text-muted">금액 지표는 대표 역할에서만 표시됩니다.</p>
          )}
          <Link href="/ax/quotes" className="tap mt-4 block rounded-lg border border-line py-2 text-center text-xs font-semibold text-ink-2 hover:bg-soft">
            견적·원가 관리 →
          </Link>
        </section>

        {/* Partner status */}
        <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="font-bold text-ink">제작 파트너 진행 현황</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted">
                <th className="pb-2 font-medium">파트너</th>
                <th className="pb-2 font-medium">진행</th>
                <th className="pb-2 font-medium">납기준수</th>
                <th className="pb-2 text-right font-medium">부하</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((pt) => (
                <tr key={pt.name} className="border-t border-line hover:bg-canvas">
                  <td className="py-2 font-semibold text-ink">{pt.name}</td>
                  <td className="py-2 tabular-nums text-ink-2">{pt.activeOrders}건</td>
                  <td className={`py-2 tabular-nums font-semibold ${pt.onTime >= 90 ? "text-[var(--ic-evidence)]" : pt.onTime >= 80 ? "text-[var(--ic-sales)]" : "text-[var(--ic-risk)]"}`}>{pt.onTime}%</td>
                  <td className="py-2 text-right text-xs text-muted">{pt.load}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link href="/ax/production" className="tap mt-3 block rounded-lg border border-line py-2 text-center text-xs font-semibold text-ink-2 hover:bg-soft">
            제작·파트너 관리 →
          </Link>
        </section>

        {/* Bid readiness */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="font-bold text-ink">입찰 준비도 상위</h2>
          <ul className="mt-3 space-y-3">
            {[...seedBids].sort((a, b) => b.readiness - a.readiness).slice(0, 3).map((b) => (
              <li key={b.id}>
                <Link href="/ax/bids" className="tap block rounded-xl border border-line p-3 hover:bg-canvas">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold text-ink">{b.institution}</p>
                    <span className="font-black tabular-nums text-accent">{b.readiness}%</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted">{b.project} · 마감 {b.deadline}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soft">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${b.readiness}%` }} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/ax/bids" className="tap mt-3 block rounded-lg border border-line py-2 text-center text-xs font-semibold text-ink-2 hover:bg-soft">
            입찰·제안 관리 →
          </Link>
        </section>
      </div>
    </div>
  );
}

/* KPI 미니 추이선 — 단일 시리즈, 얇은 선 + 은은한 영역, 축·격자 없음 */
function Sparkline({ data, warn }: { data: number[]; warn?: boolean }) {
  const w = 96;
  const h = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 2 - ((v - min) / span) * (h - 5),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const color = warn ? "var(--ic-risk)" : "var(--secondary)";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute bottom-0 right-0 h-[22px] w-24 opacity-50 transition-opacity group-hover:opacity-90"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path d={`${line}L${w},${h}L0,${h}Z`} fill={color} opacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.4" fill={color} />
    </svg>
  );
}

function Donut({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-label={`예상 Margin ${pct.toFixed(1)}%`}>
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--soft)" strokeWidth="11" />
      <circle
        cx="48" cy="48" r={r} fill="none" stroke="var(--accent)" strokeWidth="11" strokeLinecap="round"
        strokeDasharray={`${(Math.max(0, Math.min(100, pct)) / 100) * c} ${c}`} transform="rotate(-90 48 48)"
      />
      <text x="48" y="45" textAnchor="middle" className="fill-[var(--ink)]" fontSize="17" fontWeight="900">
        {pct.toFixed(1)}%
      </text>
      <text x="48" y="60" textAnchor="middle" className="fill-[var(--muted)]" fontSize="9">
        예상 Margin
      </text>
    </svg>
  );
}
