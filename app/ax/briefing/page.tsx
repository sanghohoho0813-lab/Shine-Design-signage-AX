"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { marginOf } from "@/lib/data";
import { resolveBids } from "@/lib/bids";
import { resolveOrders } from "@/lib/production";
import { AxSkeleton } from "@/components/ax/Skeleton";
import { ActionStateControl } from "@/components/ax/ActionState";
import { AiReadyBadge } from "@/components/ax/AiReady";
import { Provenance } from "@/components/ax/Provenance";
import { AI_ENGINES, METHOD_LABELS, LEVEL_LABELS } from "@/lib/ai";

interface Engine {
  id: string;
  name: string;
  color: string;
  what: string;
  why: string[];
  actions: { label: string; href: string }[];
}

export default function BriefingPage() {
  const { projects, hydrated, inquiries, customBids, bidChecks, bidStates, customOrders, orderStates } = useApp();
  if (!hydrated) return <AxSkeleton variant="cards" />;
  const seedBids = resolveBids(customBids, bidChecks, bidStates).filter((b) => !b.record?.result);
  const seedProduction = resolveOrders(customOrders, orderStates);
  const todayIso = new Date().toISOString().slice(0, 10);
  const late = projects.filter((p) => p.stage !== "완료" && /^\d{4}-\d{2}-\d{2}$/.test(p.deadline) && p.deadline < todayIso);
  const byDate = new Map<string, string[]>();
  projects.filter((p) => p.stage !== "완료" && /^\d{4}-\d{2}-\d{2}$/.test(p.deadline)).forEach((p) => byDate.set(p.deadline, [...(byDate.get(p.deadline) ?? []), p.client]));
  const clashes = [...byDate.entries()].filter(([, v]) => v.length >= 2);
  const lateOrders = seedProduction.filter((o) => {
    const proj = projects.find((p) => p.id === o.projectId);
    return proj && o.status !== "완료" && o.status !== "설치대기" && /^\d{4}-\d{2}-\d{2}$/.test(proj.deadline) && o.due > proj.deadline;
  });

  const risky = projects.filter((p) => p.risk === "높음");
  const lowMargin = projects.filter((p) => {
    const m = marginOf(p);
    return m !== null && m < 30 && p.stage !== "완료";
  });
  const topBid = [...seedBids].sort((a, b) => b.readiness - a.readiness)[0] ?? { institution: "—", readiness: 0, deadline: "—", insight: "결과가 기록되지 않은 입찰이 없습니다.", checklist: [] as { done: boolean }[] };
  const qcPending = seedProduction.filter((o) => o.status === "검수대기");

  const engines: Engine[] = [
    {
      id: "risk",
      name: "AI Project Risk",
      color: "var(--ic-risk)",
      what: risky.length ? `설치·납기 리스크 ${risky.length}건 — ${risky.map((p) => p.client).join(", ")}` : "현재 높은 리스크 프로젝트 없음",
      why: risky.length
        ? risky.map((p) => `${p.client}: ${p.riskNote ?? "납기 " + p.deadline}`)
        : ["모든 진행 프로젝트의 납기·승인·제작 일정이 계획 범위 내에 있습니다."],
      actions: [
        { label: "승인 독촉", href: "/ax/pipeline" },
        { label: "파트너 일정 확인", href: "/ax/production" },
      ],
    },
    {
      id: "margin",
      name: "Margin Guard",
      color: "var(--ic-sales)",
      what: lowMargin.length ? `목표 Margin(30%) 미달 ${lowMargin.length}건` : "모든 견적이 목표 Margin 이상",
      why: lowMargin.length
        ? lowMargin.map((p) => `${p.client}: 예상 Margin ${marginOf(p)!.toFixed(1)}% · OEM 비중 확인 필요`)
        : ["진행 중 견적의 예상 Margin이 모두 30% 이상입니다."],
      actions: [
        { label: "견적 재검토", href: "/ax/quotes" },
        { label: "원가 구성 보기", href: "/ax/quotes" },
      ],
    },
    {
      id: "bid",
      name: "Bid Readiness",
      color: "var(--ic-crm)",
      what: `${topBid.institution} 준비도 ${topBid.readiness}% — 마감 ${topBid.deadline}`,
      why: [
        topBid.insight,
        `미확인 서류 ${topBid.checklist.filter((c) => !c.done).length}건이 준비도를 낮추고 있습니다.`,
      ],
      actions: [
        { label: "준비항목 보기", href: "/ax/bids" },
        { label: "유사실적 연결", href: "/ax/evidence" },
      ],
    },
    {
      id: "schedule",
      name: "Schedule Guard",
      color: "var(--ic-partner)",
      what: late.length || clashes.length || lateOrders.length
        ? `지난 납기 ${late.length}건 · 겹치는 날 ${clashes.length}일 · 제작 납기가 프로젝트 납기보다 늦은 발주 ${lateOrders.length}건`
        : "일정 충돌·지난 납기 없음",
      why: [
        ...late.slice(0, 3).map((p) => `${p.client}: 납기 ${p.deadline} 지남 (현재 ${p.stage}) — 납기 조정 또는 완료 처리`),
        ...clashes.slice(0, 2).map(([d, v]) => `${d}: ${v.join(", ")} 같은 날 납기 — 시공팀 분리 필요`),
        ...lateOrders.slice(0, 2).map((o) => `${o.partner} ${o.item}: 제작 납기 ${o.due}가 프로젝트 납기보다 늦음`),
        ...(late.length + clashes.length + lateOrders.length === 0 ? ["진행 프로젝트 납기와 제작 납기가 모두 오늘 이후이고 같은 날 겹치지 않습니다."] : []),
      ],
      actions: [
        { label: "설치 일정 보기", href: "/ax/schedule" },
        { label: "납기 변경(사유)", href: "/ax/pipeline" },
      ],
    },
    {
      id: "next",
      name: "Next Action",
      color: "var(--ic-ai)",
      what: "오늘 처리하면 좋은 일 3가지",
      why: [
        inquiries.length ? `신규 고객 문의 ${inquiries.length}건 — 파이프라인 '문의' 단계에서 대기 중` : "한국도로교통공단 CI 개정판 승인 요청 — 지연 D+2",
        qcPending.length ? `검수대기 ${qcPending.length}건(${qcPending.map((o) => o.partner).join(", ")}) — 설치 전 검수 필요` : "검수 대기 없음",
        "완료 프로젝트 1건 — 증빙·포트폴리오 자산 전환 확인",
      ],
      actions: [
        { label: "파이프라인 열기", href: "/ax/pipeline" },
        { label: "증빙 확인", href: "/ax/evidence" },
      ],
    },
  ];

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-shell p-5">
        <div className="min-w-0">
          <h2 className="font-black text-nav-active">AI 브리핑 — 오늘의 판단</h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-nav-inactive">
            5개의 규칙 엔진(Project Risk · Margin Guard · Bid Readiness · Schedule Guard · Next Action)이 무엇을(What) →
            왜(Why) → 무엇을 할지(Action) 순서로 알려줍니다.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <AiReadyBadge dark />
          <Provenance dark />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {engines.map((e) => (
          <section key={e.id} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-bold text-ink">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} aria-hidden />
                {e.name}
              </h3>
              <AiReadyBadge engineId={e.id} compact />
            </div>
            {(() => {
              const meta = AI_ENGINES.find((m) => m.id === e.id);
              return meta ? (
                <p className="mt-1 text-[0.6875rem] text-muted">
                  {METHOD_LABELS[meta.method].split(" ")[0]} · {LEVEL_LABELS[meta.level]} · 승인: {meta.approval.split(" — ")[0]}
                </p>
              ) : null;
            })()}
            <p className="mt-3 rounded-xl p-3.5 text-sm font-bold leading-snug text-ink" style={{ background: `color-mix(in srgb, ${e.color} 8%, transparent)` }}>
              {e.what}
            </p>
            <div className="mt-3">
              <p className="text-[0.6875rem] font-bold tracking-wide text-muted">WHY</p>
              <ul className="mt-1.5 space-y-1.5">
                {e.why.map((w, i) => (
                  <li key={i} className="flex gap-2 text-[0.8125rem] leading-relaxed text-ink-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="self-center text-[0.6875rem] font-bold tracking-wide text-muted">ACTION</span>
              {e.actions.map((a) => (
                <Link key={a.label} href={a.href} className="tap hover-lift rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-soft">
                  {a.label} →
                </Link>
              ))}
            </div>
            {/* 이 추천을 어떻게 처리했는지 — 추천 → 확인 → 실행중 → 완료 / 보류 / 무시 */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              <span className="text-[0.6875rem] font-bold tracking-wide text-muted">처리 상태</span>
              <ActionStateControl id={`engine-${e.id}`} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
