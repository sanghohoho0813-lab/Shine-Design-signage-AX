"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { IMG, portfolio } from "@/lib/data";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";
import { COMPANY, CREDENTIALS } from "@/lib/company";
import { BUSINESS_RECORDS, RECORD_TOTAL } from "@/lib/records";
import { MONEY_KPIS, KPI_KIND_LABELS, kpiNow } from "@/lib/kpi";
import { marginOf } from "@/lib/data";
import { ACTION_LABELS, fmtTime } from "@/lib/store";

export default function EvidencePage() {
  const { projects, hydrated, inquiries, actionStates } = useApp();
  if (!hydrated) return <AxSkeleton variant="cards" />;
  const now = kpiNow(projects, inquiries, marginOf as never);

  /* Evidence Log — 사람이 무엇을 했는지가 남는다 (v3.0 §9 Evidence Type) */
  type Ev = { type: string; at: string; note: string };
  const evidence: Ev[] = [];
  Object.entries(actionStates).forEach(([id, r]) => {
    if (r.state === "todo") return;
    evidence.push({
      type: r.state === "done" ? "RESULT" : r.state === "skip" || r.state === "hold" ? "RISK" : "ACTION",
      at: r.at,
      note: `${id.replace(/^engine-/, "엔진 ").replace(/^risk-/, "리스크 ").replace(/^mg-/, "Margin ").replace(/^qc-/, "검수 ").replace(/^inq-/, "문의 ").replace(/^bid-/, "입찰 ")} → ${ACTION_LABELS[r.state]}${r.reason ? ` (${r.reason})` : ""}`,
    });
  });
  inquiries.forEach((q) =>
    (q.statusLog ?? [{ status: q.axStatus, at: q.createdAt }]).forEach((l) =>
      evidence.push({ type: "CUSTOMER", at: l.at, note: `문의 ${q.id.toUpperCase()} · ${q.clientType} · ${l.status}` }),
    ),
  );
  evidence.sort((a, b) => (a.at < b.at ? 1 : -1));
  const EV_TONE: Record<string, string> = { RESULT: "var(--ic-evidence)", ACTION: "var(--ic-overview)", RISK: "var(--ic-risk)", CUSTOMER: "var(--ic-crm)", BASELINE: "var(--ic-system)" };

  const completed = projects.filter((p) => p.stage === "완료");

  const today = new Date().toLocaleDateString("ko-KR");

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="증빙 · 리포트"
        purpose="완료된 프로젝트의 증빙을 모아 봅니다. 실적 요약은 그대로 인쇄하거나 PDF로 저장해 제출자료로 쓸 수 있습니다."
        stat={`완료 ${completed.length}건`}
      >
        <button onClick={() => window.print()} className="tap hover-lift btn btn-primary btn-sm no-print">
          🖨 실적 요약 인쇄 / PDF
        </button>
      </PageHeader>

      {/* 인쇄 전용 실적 요약 — 화면에서는 숨김 */}
      <div className="hidden print-area">
        <div className="print-block mb-6 border-b-2 border-black pb-4">
          <p className="text-sm">
            {COMPANY.name} · 대표이사 {COMPANY.ceo} · 사업자등록번호 {COMPANY.bizNo}
          </p>
          <p className="text-sm">
            {COMPANY.address} · TEL {COMPANY.tel} · E {COMPANY.email}
          </p>
          <h1 className="mt-2 text-2xl font-black">수행 실적 요약</h1>
          <p className="mt-1 text-sm">발행일 {today} · 본 자료는 내부 관리 시스템에서 생성되었습니다.</p>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-2 pr-3">발주처</th>
              <th className="py-2 pr-3">프로젝트</th>
              <th className="py-2 pr-3">분야</th>
              <th className="py-2 pr-3">완료(예정)일</th>
              <th className="py-2">수행 범위</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((p) => (
              <tr key={p.id} className="print-block border-b border-gray-400">
                <td className="py-2 pr-3 font-bold">{p.client}</td>
                <td className="py-2 pr-3">{p.name}</td>
                <td className="py-2 pr-3">{p.category}</td>
                <td className="py-2 pr-3">{p.deadline}</td>
                <td className="py-2">디자인 · 제작 · 시공</td>
              </tr>
            ))}
            {portfolio.map((w) => (
              <tr key={w.id} className="print-block border-b border-gray-400">
                <td className="py-2 pr-3 font-bold">{w.client}</td>
                <td className="py-2 pr-3">{w.title}</td>
                <td className="py-2 pr-3">{w.category}</td>
                <td className="py-2 pr-3">{w.year}</td>
                <td className="py-2">{w.scope.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="print-block mt-5 text-xs">
          사진 증빙 보유 {completed.length + portfolio.length}건 · 보유 자격:{" "}
          {CREDENTIALS.map((c) => c.label).join(" · ")}
        </p>

        {/* 지명원 기업실적 전체 */}
        <div className="print-block mt-8 border-t-2 border-black pt-4">
          <h2 className="text-lg font-black">전체 수행 실적 ({RECORD_TOTAL}건)</h2>
          <p className="mt-1 text-xs">출처: ㈜샤인디자인 지명원 기업실적 · 계약금액 미기재</p>
        </div>
        {BUSINESS_RECORDS.map((g) => (
          <div key={g.period} className="mt-4">
            <p className="print-block border-b border-black pb-1 text-sm font-black">
              {g.period} ({g.items.length}건)
            </p>
            <ul className="mt-1.5 grid grid-cols-2 gap-x-6">
              {g.items.map((it) => (
                <li key={it} className="print-block border-b border-gray-300 py-1 text-[0.6875rem] leading-snug">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="no-print relative overflow-hidden rounded-2xl">
        <img src={IMG.axEvidence} alt="프로젝트 증빙 리포트" className="h-36 w-full object-cover sm:h-44" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-shell/90 to-shell/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
          <h2 className="text-lg font-black text-white sm:text-xl">증빙 · 리포트</h2>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-nav-inactive sm:text-[0.8125rem]">
            완료된 프로젝트는 납품 증빙 → 포트폴리오 자산 → 유사실적 → 입찰 신뢰도로 이어집니다.
          </p>
        </div>
      </div>

      {/* Closed loop diagram */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h3 className="font-bold text-ink">Closed Loop — 완료가 곧 다음 수주의 자산</h3>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.75rem] font-semibold">
          {["고객 문의", "프로젝트 Pipeline", "디자인·견적", "제작 파트너", "설치", "증빙", "포트폴리오 자산", "다음 입찰·영업"].map((s, i, arr) => (
            <span key={s} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1.5 ${i >= 5 ? "bg-accent/15 text-accent" : "bg-soft text-ink-2"}`}>{s}</span>
              {i < arr.length - 1 && <span className="text-muted" aria-hidden>→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Money KPI 계약 — Baseline 없이는 개선율을 말하지 않는다 */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-ink">
            Money KPI 계약 <span className="text-xs font-normal text-muted">— Cost · Revenue · Scale</span>
          </h3>
          <span className="rounded-full bg-[var(--ic-system)]/12 px-2.5 py-0.5 text-[0.6875rem] font-bold text-[var(--ic-system)]">BASELINE: UNKNOWN</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          실제 Baseline은 실운영 12주 뒤에 확정합니다. 아래 &lsquo;현재값&rsquo;은 Demo 데이터 계산이며 개선율이 아닙니다.
        </p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {MONEY_KPIS.map((k) => (
            <li key={k.id} className="rounded-xl border border-line p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-soft px-1.5 py-0.5 text-[0.625rem] font-bold text-ink-2">{KPI_KIND_LABELS[k.kind]}</span>
                <span className="text-[0.6875rem] tabular-nums text-muted">현재값(Demo) <b className="text-ink">{now[k.id] ?? "—"}</b></span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-ink">{k.name}</p>
              <p className="mt-0.5 text-[0.75rem] text-ink-2">{k.definition}</p>
              <p className="mt-1.5 text-[0.6875rem] text-muted">측정: {k.measurement}</p>
              <p className="text-[0.6875rem] text-muted">Constraint: {k.constraint}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Evidence Log */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-ink">
            Evidence Log <span className="text-xs font-normal text-muted">({evidence.length}건)</span>
          </h3>
          <div className="flex flex-wrap gap-1">
            {["BASELINE", "ACTION", "RESULT", "CUSTOMER", "RISK"].map((t) => (
              <span key={t} className="rounded-md px-1.5 py-0.5 text-[0.5625rem] font-bold" style={{ color: EV_TONE[t], background: `color-mix(in srgb, ${EV_TONE[t]} 12%, transparent)` }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">추천 → 사람의 결정 → 결과가 시간순으로 남습니다. 12주 실증 종료 시 Evidence Pack의 재료가 됩니다.</p>
        {evidence.length === 0 ? (
          <p className="mt-3 rounded-xl bg-canvas p-4 text-sm text-muted">
            아직 기록이 없습니다. 대시보드 &lsquo;오늘 할 일&rsquo;에서 Action을 확인·완료하거나, 고객 문의를 접수하면 여기에 쌓입니다.
          </p>
        ) : (
          <ul className="mt-3 max-h-72 divide-y divide-line overflow-y-auto scrollbar-thin">
            {evidence.slice(0, 50).map((e, i) => (
              <li key={i} className="flex items-center gap-3 py-2 text-xs">
                <span className="w-16 shrink-0 rounded-md px-1.5 py-0.5 text-center text-[0.5625rem] font-bold" style={{ color: EV_TONE[e.type], background: `color-mix(in srgb, ${EV_TONE[e.type]} 12%, transparent)` }}>
                  {e.type}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink-2">{e.note}</span>
                <span className="shrink-0 tabular-nums text-muted">{fmtTime(e.at) ?? e.at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Completed → evidence records */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-ink">완료 프로젝트 증빙 <span className="text-xs font-normal text-muted">({completed.length}건)</span></h3>
          <Link href="/ax/pipeline" className="tap text-xs font-semibold text-muted hover:text-ink">파이프라인 →</Link>
        </div>
        {completed.length === 0 ? (
          <p className="mt-4 rounded-xl bg-canvas p-4 text-sm text-muted">
            아직 완료 처리된 프로젝트가 없습니다. 파이프라인에서 프로젝트를 완료하면 이곳에 증빙 레코드가 생성됩니다.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {completed.map((p) => (
              <li key={p.id} className="rounded-xl border border-line p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-ink">{p.client}</p>
                    <p className="text-sm text-ink-2">{p.name}</p>
                  </div>
                  <span className="rounded-full bg-[var(--ic-evidence)]/12 px-2 py-0.5 text-[0.625rem] font-bold text-[var(--ic-evidence)]">완료</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[0.6875rem]">
                  {["납품 확인서", "준공 사진", "검수 리포트", "유사실적 카드"].map((d) => (
                    <span key={d} className="flex items-center gap-1.5 rounded-lg bg-canvas px-2.5 py-1.5 text-ink-2">
                      <span className="text-[var(--ic-evidence)]" aria-hidden>✓</span>
                      {d}
                    </span>
                  ))}
                </div>
                <p className="mt-2.5 text-[0.6875rem] text-muted">→ 고객 사이트 &lsquo;최근 완료된 프로젝트&rsquo;와 입찰 유사실적에 연결됨</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Portfolio asset count */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">지명원 누적 실적</p>
          <p className="mt-1 text-xl font-black text-ink">{RECORD_TOTAL}건</p>
          <p className="text-[0.6875rem] text-secondary">2013 ~ 2025 · 유사실적 근거</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">사진 증빙 보유</p>
          <p className="mt-1 text-xl font-black text-ink">{portfolio.length + completed.length}건</p>
          <p className="text-[0.6875rem] text-secondary">공개 {portfolio.length} + 신규 완료 {completed.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">보유 자격·등록</p>
          <p className="mt-1 text-xl font-black text-ink">{CREDENTIALS.length}종</p>
          <p className="text-[0.6875rem] text-secondary">직접생산확인 7개 품목 포함</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs text-muted">입찰 연결 가능 증빙</p>
          <p className="mt-1 text-xl font-black text-ink">{4 + completed.length}건</p>
          <p className="text-[0.6875rem] text-secondary">준비도 산정에 자동 반영 (데모)</p>
        </div>
      </section>
    </div>
  );
}
