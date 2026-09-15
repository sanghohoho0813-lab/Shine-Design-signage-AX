"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { seedProduction, STAGES } from "@/lib/data";
import { PageHeader } from "@/components/ax/PageHeader";
import { AxSkeleton } from "@/components/ax/Skeleton";

/* ---------------------------------------------------------------------------
   설치 일정 — v14. 향후 확장 NEXT 1순위였던 '설치 일정·배차'의 기본 월 캘린더.
   새 데이터를 만들지 않는다: 프로젝트 납기(파이프라인)와 제작 납기(파트너 발주)를
   날짜 위에 올려 겹침을 미리 보이게 한다. 시공팀·차량·장비 배정은 아직 없다.
--------------------------------------------------------------------------- */

type Kind = "설치·납기" | "제작 납기";
interface Ev {
  date: string; // YYYY-MM-DD
  kind: Kind;
  title: string;
  sub: string;
  href: string;
  overdue?: boolean;
}
const TONE: Record<Kind, string> = { "설치·납기": "var(--ic-ops)", "제작 납기": "var(--ic-partner)" };
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export default function SchedulePage() {
  const { projects, hydrated } = useApp();
  const today = new Date();
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());
  const [cur, setCur] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const events = useMemo<Ev[]>(() => {
    const out: Ev[] = [];
    projects.forEach((p) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.deadline) || p.stage === "완료") return;
      const late = STAGES.indexOf(p.stage) >= 0 && p.deadline < todayIso;
      out.push({ date: p.deadline, kind: "설치·납기", title: p.client, sub: `${p.name} · ${p.stage}`, href: "/ax/pipeline", overdue: late });
    });
    seedProduction.forEach((o) => {
      if (o.status === "완료" || o.status === "설치대기") return;
      const client = projects.find((p) => p.id === o.projectId)?.client ?? "-";
      out.push({ date: o.due, kind: "제작 납기", title: `${client} · ${o.partner}`, sub: o.item, href: "/ax/production", overdue: o.due < todayIso });
    });
    return out.sort((a, b) => a.date.localeCompare(b.date));
  }, [projects, todayIso]);

  if (!hydrated) return <AxSkeleton variant="cards" />;

  const byDate = new Map<string, Ev[]>();
  events.forEach((e) => byDate.set(e.date, [...(byDate.get(e.date) ?? []), e]));

  const first = new Date(cur.y, cur.m, 1);
  const startDow = first.getDay();
  const daysIn = new Date(cur.y, cur.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const monthPrefix = `${cur.y}-${pad(cur.m + 1)}`;
  const monthEvents = events.filter((e) => e.date.startsWith(monthPrefix));
  const clashDays = [...byDate.entries()].filter(([d, es]) => d.startsWith(monthPrefix) && es.filter((e) => e.kind === "설치·납기").length >= 2);
  const overdue = events.filter((e) => e.overdue);
  const in30 = events.filter((e) => e.date >= todayIso && e.date <= iso(today.getFullYear(), today.getMonth(), today.getDate() + 30));
  const move = (d: number) => setCur(({ y, m }) => ({ y: new Date(y, m + d, 1).getFullYear(), m: new Date(y, m + d, 1).getMonth() }));

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="설치 일정"
        purpose="프로젝트 납기와 제작 납기를 한 달력에 올려 겹치는 날을 미리 봅니다. 새로 입력하는 데이터는 없고, 파이프라인·파트너 발주의 날짜를 그대로 씁니다."
        stat={`이번 달 ${monthEvents.length}건`}
      />

      {/* 요약 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="schedule-summary">
        <Stat label="30일 내 일정" value={`${in30.length}건`} bar="var(--ic-overview)" />
        <Stat label="겹치는 날 (이번 달)" value={`${clashDays.length}일`} sub="같은 날 설치·납기 2건 이상" bar={clashDays.length ? "var(--ic-sales)" : "var(--ic-evidence)"} accent={!!clashDays.length} />
        <Stat label="지난 납기 (미완료)" value={`${overdue.length}건`} sub="완료 처리 또는 납기 조정 필요" bar={overdue.length ? "var(--ic-risk)" : "var(--ic-evidence)"} accent={!!overdue.length} />
        <Stat label="제작 납기" value={`${events.filter((e) => e.kind === "제작 납기").length}건`} sub="발주 전 · 제작중 · 검수대기" bar="var(--ic-partner)" />
      </div>

      {/* 달력 */}
      <section className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-ink" aria-live="polite">
            {cur.y}년 {cur.m + 1}월 <span className="text-xs font-normal text-muted">· {monthEvents.length}건</span>
          </h3>
          <div className="flex items-center gap-1">
            <button onClick={() => move(-1)} className="tap rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2 hover:bg-soft" aria-label="이전 달">‹</button>
            <button onClick={() => setCur({ y: today.getFullYear(), m: today.getMonth() })} className="tap rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2 hover:bg-soft">오늘</button>
            <button onClick={() => move(1)} className="tap rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2 hover:bg-soft" aria-label="다음 달">›</button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] text-muted">
          {(Object.keys(TONE) as Kind[]).map((k) => (
            <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: TONE[k] }} aria-hidden />{k}</span>
          ))}
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--ic-sales)]" aria-hidden />겹침</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--ic-risk)]" aria-hidden />지난 납기</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line" role="grid" aria-label={`${cur.y}년 ${cur.m + 1}월 일정`}>
          {DAYS.map((d, i) => (
            <div key={d} role="columnheader" className={`bg-canvas py-1.5 text-center text-[0.625rem] font-bold ${i === 0 ? "text-[var(--ic-risk)]" : i === 6 ? "text-[var(--ic-overview)]" : "text-muted"}`}>{d}</div>
          ))}
          {cells.map((d, i) => {
            const key = d ? iso(cur.y, cur.m, d) : "";
            const es = d ? byDate.get(key) ?? [] : [];
            const clash = es.filter((e) => e.kind === "설치·납기").length >= 2;
            const isToday = key === todayIso;
            return (
              <div key={i} role="gridcell" aria-label={d ? `${cur.m + 1}월 ${d}일 ${es.length}건` : undefined} className={`min-h-[3.25rem] min-w-0 bg-surface p-1 sm:min-h-[5.5rem] sm:p-1.5 ${d ? "" : "bg-canvas/60"}`}>
                {d && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.6875rem] tabular-nums ${isToday ? "bg-accent font-black" : "text-ink-2"}`} style={isToday ? { color: "var(--on-accent)" } : undefined}>{d}</span>
                      {clash && <span className="rounded bg-[var(--ic-sales)]/15 px-1 text-[0.5rem] font-black text-[var(--ic-sales)]" title="같은 날 설치·납기 2건 이상">겹침</span>}
                    </div>
                    {/* 모바일: 점 · 데스크톱: 칩 */}
                    <div className="mt-1 flex flex-wrap gap-0.5 sm:hidden">
                      {es.slice(0, 4).map((e, j) => (
                        <span key={j} className="h-1.5 w-1.5 rounded-full" style={{ background: e.overdue ? "var(--ic-risk)" : TONE[e.kind] }} aria-hidden />
                      ))}
                    </div>
                    <ul className="mt-1 hidden space-y-0.5 sm:block">
                      {es.slice(0, 3).map((e, j) => (
                        <li key={j}>
                          <Link href={e.href} className="block truncate rounded px-1 py-0.5 text-[0.625rem] font-semibold leading-tight hover:opacity-80" style={{ color: e.overdue ? "var(--ic-risk)" : TONE[e.kind], background: `color-mix(in srgb, ${e.overdue ? "var(--ic-risk)" : TONE[e.kind]} 12%, transparent)` }} title={`${e.title} — ${e.sub}`}>
                            {e.title}
                          </Link>
                        </li>
                      ))}
                      {es.length > 3 && <li className="px-1 text-[0.5625rem] text-muted">+{es.length - 3}</li>}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 목록 — 겹침 · 지난 납기 · 다가오는 30일 */}
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h3 className="font-bold text-ink">
            겹치는 날 <span className="text-xs font-normal text-muted">— {cur.m + 1}월, 규칙: 같은 날 설치·납기 2건 이상</span>
          </h3>
          {clashDays.length === 0 ? (
            <p className="mt-2 text-sm text-muted">이번 달에는 같은 날 겹치는 설치·납기가 없습니다.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {clashDays.map(([d, es]) => (
                <li key={d} className="rounded-xl border border-[var(--ic-sales)]/30 bg-[var(--ic-sales)]/6 p-3 text-sm">
                  <p className="font-bold text-ink">{d.slice(5).replace("-", ".")} · {es.length}건</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-ink-2">
                    {es.map((e, i) => <li key={i}>{e.title} <span className="text-muted">— {e.sub}</span></li>)}
                  </ul>
                  <p className="mt-1.5 text-[0.6875rem] text-muted">시공팀·차량 배정은 아직 없습니다 — 파이프라인에서 납기를 조정하거나 야간·주말 시공으로 나누세요.</p>
                </li>
              ))}
            </ul>
          )}
          {overdue.length > 0 && (
            <>
              <h4 className="mt-5 text-sm font-bold text-[var(--ic-risk)]">지난 납기 · 미완료 {overdue.length}건</h4>
              <ul className="mt-2 space-y-1.5 text-xs">
                {overdue.map((e, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-canvas px-3 py-2">
                    <span className="min-w-0 truncate text-ink-2"><b className="text-ink">{e.title}</b> — {e.sub}</span>
                    <Link href={e.href} className="shrink-0 tabular-nums text-muted hover:text-ink">{e.date.slice(5)} →</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h3 className="font-bold text-ink">다가오는 30일 <span className="text-xs font-normal text-muted">({in30.length}건)</span></h3>
          {in30.length === 0 ? (
            <p className="mt-2 text-sm text-muted">30일 안에 잡힌 납기가 없습니다.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {in30.map((e, i) => (
                <li key={i} className="flex items-center gap-3 py-2 text-sm">
                  <span className="w-12 shrink-0 tabular-nums text-xs font-bold text-ink">{e.date.slice(5).replace("-", ".")}</span>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TONE[e.kind] }} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-ink-2"><b className="text-ink">{e.title}</b> — {e.sub}</span>
                  <Link href={e.href} className="shrink-0 text-xs text-muted hover:text-ink">열기 →</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <p className="text-[0.6875rem] text-muted">※ 날짜는 파이프라인 납기와 파트너 발주 납기에서 가져옵니다(시드 값은 DEMO). 시공팀·차량·장비 배정은 향후 확장(설치 일정·배차)에 남아 있습니다.</p>
    </div>
  );
}

function Stat({ label, value, sub, bar, accent }: { label: string; value: string; sub?: string; bar: string; accent?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-4 pl-5 shadow-sm">
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: bar }} aria-hidden />
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-xl font-black tabular-nums ${accent ? "" : "text-ink"}`} style={accent ? { color: bar } : undefined}>{value}</p>
      {sub && <p className="mt-0.5 text-[0.6875rem] text-secondary">{sub}</p>}
    </div>
  );
}
