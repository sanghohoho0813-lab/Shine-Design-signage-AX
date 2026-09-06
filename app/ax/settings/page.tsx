"use client";

import { useEffect, useState } from "react";
import { useApp, THEMES, ROLE_LABELS, Role, FontScale, fmtTime } from "@/lib/store";
import { toast } from "@/components/Toast";
import { AxSkeleton } from "@/components/ax/Skeleton";
import { AiReadyBadge } from "@/components/ax/AiReady";
import { Provenance } from "@/components/ax/Provenance";
import { AI_ENGINES, AI_SUMMARY, METHOD_LABELS, LEVEL_LABELS, ERROR_COST_LABELS } from "@/lib/ai";
import { ENTITIES, CSV_SAMPLES } from "@/lib/dictionary";
import { CREDENTIALS, DIRECT_PRODUCTION } from "@/lib/company";
import { readEvents, clearEvents, EVENT_LABELS, type TrackedEvent } from "@/lib/events";

/* ---------------------------------------------------------------------------
   설정 — Unified v3.0 Settings Completion Standard
   [화면] [사용자/권한] [데모] [데이터] [AI] [기술·사업화 자산]
   보이는 토글·버튼·피커는 전부 실제로 상태를 바꾼다.
--------------------------------------------------------------------------- */

const TOKENS = ["--shell", "--primary", "--secondary", "--accent", "--highlight", "--soft"] as const;

/** 권한 매트릭스 — 화면에서 실제로 적용되는 규칙만 적는다 */
const PERMISSIONS: { area: string; ceo: string; staff: string; customer: string }[] = [
  { area: "Business AX 진입", ceo: "가능", staff: "가능", customer: "차단 · 진입점 숨김" },
  { area: "대시보드 금액 KPI (매출·Margin)", ceo: "표시", staff: "권한 제한", customer: "—" },
  { area: "견적·원가 관리 메뉴", ceo: "표시", staff: "숨김", customer: "—" },
  { area: "프로젝트 단계 진행", ceo: "가능", staff: "가능", customer: "—" },
  { area: "문의 응대 상태 변경", ceo: "가능", staff: "가능", customer: "내 문의 현황에서 열람만" },
  { area: "Action 상태 기록", ceo: "가능", staff: "가능", customer: "—" },
  { area: "설정 · Demo Reset", ceo: "가능", staff: "가능", customer: "—" },
  { area: "고객 사이트 · 문의 · 문의 현황", ceo: "가능", staff: "가능", customer: "가능" },
];

export default function SettingsPage() {
  const app = useApp();
  const [resetDone, setResetDone] = useState(false);
  const [owner, setOwner] = useState(app.axOwner);
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [entity, setEntity] = useState(ENTITIES[0].entity);

  useEffect(() => setOwner(app.axOwner), [app.axOwner]);
  useEffect(() => {
    const load = () => setEvents(readEvents().slice().reverse());
    load();
    window.addEventListener("shine-events", load);
    return () => window.removeEventListener("shine-events", load);
  }, []);

  if (!app.hydrated) return <AxSkeleton variant="cards" />;

  const download = (name: string, text: string) => {
    const blob = new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shine-${name}-sample.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`${name} 샘플 CSV를 내려받았습니다`);
  };

  const ent = ENTITIES.find((e) => e.entity === entity)!;

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-black text-ink">설정</h2>
        <Provenance />
      </div>

      {/* ------------------------------- 화면 ------------------------------- */}
      <Card title="화면" desc="Theme · Font Scale · Motion — PC와 모바일, 미리보기 안까지 동일하게 적용됩니다.">
        <p className="text-xs font-semibold text-ink-2">
          Theme <span className="text-muted">— Canonical {THEMES.length}종 · 각 6개 토큰</span>
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="테마 선택">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => app.setTheme(t.id)}
              role="radio"
              aria-checked={app.theme === t.id}
              className={`tap hover-lift rounded-xl border-2 p-3 text-left ${app.theme === t.id ? "border-accent bg-accent/5" : "border-line hover:border-secondary"}`}
            >
              {/* 해당 테마의 6개 토큰 실시간 스와치 — shell / primary / secondary / accent / highlight / soft */}
              <span data-theme={t.id} className="flex gap-1" aria-hidden>
                {TOKENS.map((v) => (
                  <span key={v} className="h-5 w-5 rounded-md border border-black/8" style={{ background: `var(${v})` }} />
                ))}
              </span>
              <span className="mt-1.5 block text-[0.6875rem] font-bold text-ink">{t.name}</span>
              <span className={`text-[0.625rem] ${app.theme === t.id ? "font-semibold text-accent" : "text-muted"}`}>
                {app.theme === t.id ? "사용 중 ✓" : t.seed}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">
          테마는 사이드바·강조·선택 상태만 바꿉니다. 본문 글자·표·카드 배경은 어떤 테마에서도 같은 Neutral을 씁니다.
        </p>

        <p className="mt-5 text-xs font-semibold text-ink-2">Font Scale</p>
        <div className="mt-2 flex gap-2">
          {(["md", "lg", "xl"] as FontScale[]).map((f) => (
            <button
              key={f}
              onClick={() => app.setFontScale(f)}
              aria-pressed={app.fontScale === f}
              className={`tap flex-1 rounded-lg border py-2.5 font-bold ${
                app.fontScale === f ? "border-shell bg-shell text-white" : "border-line text-ink-2 hover:bg-soft"
              } ${f === "md" ? "text-sm" : f === "lg" ? "text-base" : "text-lg"}`}
            >
              가 {f === "md" ? "기본" : f === "lg" ? "크게" : "매우 크게"}
            </button>
          ))}
        </div>
        <div className="mt-2 rounded-xl border border-line bg-canvas p-4">
          <p className="text-xs text-muted">미리보기 · 현재 {app.fontScale === "md" ? "기본" : app.fontScale === "lg" ? "크게" : "매우 크게"}</p>
          <p className="mt-1 font-bold text-ink">한국도로교통공단 포항운전면허시험장 사인 개선</p>
          <p className="mt-0.5 text-sm text-ink-2">제작 단계 · 납기 2026-09-18 · 예상 Margin 17.9%</p>
        </div>

        <label className="mt-5 flex items-center justify-between rounded-xl border border-line p-3.5">
          <span>
            <span className="block text-sm font-semibold text-ink">Motion 줄이기</span>
            <span className="text-xs text-muted">장식 애니메이션을 줄이고 상태 피드백은 유지합니다.</span>
          </span>
          <button
            role="switch"
            aria-checked={app.reducedMotion}
            onClick={() => app.setReducedMotion(!app.reducedMotion)}
            className={`tap relative h-6 w-11 rounded-full transition-colors ${app.reducedMotion ? "bg-accent" : "bg-line"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${app.reducedMotion ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </label>
      </Card>

      {/* --------------------------- 사용자 / 권한 -------------------------- */}
      <Card title="사용자 · 권한" desc="역할을 바꾸면 메뉴·금액 지표·AX 진입점이 실제로 달라집니다.">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => app.setRole(r)}
              aria-pressed={app.role === r}
              className={`tap rounded-xl border-2 p-3.5 text-center ${app.role === r ? "border-accent bg-accent/5" : "border-line hover:bg-soft"}`}
            >
              <span className="block text-sm font-black text-ink">{ROLE_LABELS[r]}</span>
              <span className="mt-0.5 block text-[0.625rem] leading-tight text-muted">
                {r === "ceo" ? "전체 지표 + 금액" : r === "staff" ? "금액 지표 제한" : "AX 접근 불가"}
              </span>
            </button>
          ))}
        </div>
        {app.role === "customer" && (
          <p className="mt-3 rounded-lg bg-[var(--ic-risk)]/8 p-3 text-xs leading-relaxed text-ink-2">
            &lsquo;고객&rsquo; 역할에서는 이 설정 화면을 나가면 Business AX에 다시 들어올 수 없습니다. 고객
            사이트에서 AX 진입점도 숨겨집니다.
          </p>
        )}

        {/* 권한 매트릭스 — RLS(사용자별로 볼 수 있는 데이터를 나누는 보안 규칙) 미리보기 */}
        <p className="mt-5 text-xs font-semibold text-ink-2">
          권한 매트릭스 <span className="font-normal text-muted">— RLS(사용자별로 볼 수 있는 데이터를 나누는 보안 규칙) 미리보기</span>
        </p>
        <div className="mt-2 max-w-full overflow-x-auto rounded-xl border border-line scrollbar-thin">
          <table className="w-full min-w-[30rem] text-xs">
            <thead className="bg-canvas text-left text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">영역</th>
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <th key={r} className={`px-3 py-2 font-medium ${app.role === r ? "text-accent" : ""}`}>
                    {ROLE_LABELS[r]}
                    {app.role === r && " ●"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.area} className="border-t border-line hover:bg-canvas">
                  <td className="px-3 py-2 font-medium text-ink">{p.area}</td>
                  {(["ceo", "staff", "customer"] as Role[]).map((r) => (
                    <td key={r} className={`px-3 py-2 ${app.role === r ? "bg-accent/5 font-semibold text-ink" : "text-ink-2"}`}>
                      {p[r]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.6875rem] text-muted">실서비스에서는 이 표가 Supabase RLS 정책으로 그대로 옮겨집니다.</p>

        {/* AX Owner */}
        <p className="mt-5 text-xs font-semibold text-ink-2">
          AX Owner <span className="font-normal text-muted">— KPI · 데이터 품질 · 사용 교육을 책임지는 사람</span>
        </p>
        <div className="mt-2 flex gap-2">
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            aria-label="AX Owner 이름"
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            onClick={() => {
              const v = owner.trim();
              if (!v) return;
              app.setAxOwner(v);
              toast(`AX Owner: ${v}`);
            }}
            className="tap btn btn-primary btn-sm"
          >
            저장
          </button>
        </div>
      </Card>

      {/* -------------------------------- 데모 ------------------------------ */}
      <Card title="데모" desc="현재 단계와 시연 도구입니다.">
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-canvas px-3.5 py-2.5 text-sm">
          <span className="text-ink-2">현재 단계</span>
          <span className="rounded-full bg-[var(--ic-sales)]/12 px-2.5 py-0.5 text-xs font-bold text-[var(--ic-sales)]">DEMO</span>
          <span className="text-xs text-muted">→ PILOT(실데이터 일부) → PRODUCTION(실사용). 시연 데이터를 실제 성과처럼 말하지 않습니다.</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => window.dispatchEvent(new Event("shine-presentation"))}
            className="tap hover-lift rounded-xl border border-accent/40 bg-accent/5 p-4 text-left hover:bg-accent/10"
          >
            <span className="block text-sm font-bold text-ink">▶ 시연 모드 시작</span>
            <span className="text-xs text-muted">영업·심사용 10단계 Guided Product Demo</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event("shine-tutorial"))}
            className="tap hover-lift rounded-xl border border-line p-4 text-left hover:bg-soft"
          >
            <span className="block text-sm font-bold text-ink">튜토리얼 다시 보기</span>
            <span className="text-xs text-muted">4단계 가이드를 실제 화면 위에서 재생</span>
          </button>
          <button
            onClick={() => {
              app.resetDemo();
              try {
                localStorage.removeItem("shine-ax-tutorial-seen");
              } catch {}
              setResetDone(true);
              toast("데모 데이터가 초기 상태로 복원되었습니다");
              setTimeout(() => setResetDone(false), 2500);
            }}
            className="tap hover-lift rounded-xl border border-[var(--ic-risk)]/30 p-4 text-left hover:bg-[var(--ic-risk)]/5"
          >
            <span className="block text-sm font-bold text-[var(--ic-risk)]">{resetDone ? "초기화 완료 ✓" : "Demo Reset"}</span>
            <span className="text-xs text-muted">문의·진행 상태·Action 기록·테마를 초기 데모 상태로 복원</span>
          </button>
        </div>
      </Card>

      {/* ------------------------------- 데이터 ----------------------------- */}
      <Card title="데이터" desc="이 화면의 숫자가 어디서 오는지, 어떤 형식으로 들어오는지입니다.">
        <ul className="space-y-2 text-sm">
          <Row k="데이터 소스" v="Demo Repository — 브라우저 localStorage (shine-ax-state-v1)" />
          <Row k="마지막 업데이트" v={fmtTime(app.updatedAt) ?? "시드 상태 (변경 없음)"} />
          <Row k="교체 지점" v="CSV 가져오기 → Supabase → 외부 API — 같은 필드 구조" />
        </ul>

        <p className="mt-5 text-xs font-semibold text-ink-2">
          CSV 샘플 <span className="font-normal text-muted">— 실제 필드명과 같은 헤더. 이 형식으로 채우면 바로 붙습니다.</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(CSV_SAMPLES).map(([k, v]) => (
            <button key={k} onClick={() => download(k, v)} className="tap btn btn-ghost btn-sm">
              ⬇ {k}.csv
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold text-ink-2">
          필드 구조 · SSOT <span className="font-normal text-muted">— Entity마다 기준 데이터가 한 곳에만 있습니다</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5" role="tablist" aria-label="Entity 선택">
          {ENTITIES.map((e) => (
            <button
              key={e.entity}
              role="tab"
              aria-selected={entity === e.entity}
              onClick={() => setEntity(e.entity)}
              className={`tap rounded-full px-3 py-1 text-xs font-semibold ${entity === e.entity ? "bg-shell text-white" : "border border-line text-ink-2 hover:bg-soft"}`}
            >
              {e.ko}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-line bg-canvas p-4">
          <dl className="grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
            <div><dt className="text-muted">기준 위치 (지금)</dt><dd className="font-medium text-ink">{ent.sor.now}</dd></div>
            <div><dt className="text-muted">기준 위치 (실서비스)</dt><dd className="font-medium text-ink">{ent.sor.next}</dd></div>
            <div><dt className="text-muted">입력 주체</dt><dd className="text-ink-2">{ent.writer}</dd></div>
            <div><dt className="text-muted">업데이트</dt><dd className="text-ink-2">{ent.update}</dd></div>
            <div><dt className="text-muted">민감도 / 보관</dt><dd className="text-ink-2">{ent.sensitivity} · {ent.retention}</dd></div>
            <div><dt className="text-muted">AI 사용</dt><dd className="text-ink-2">{ent.ai}</dd></div>
          </dl>
          <table className="mt-3 w-full text-xs">
            <thead className="text-left text-muted">
              <tr><th className="py-1 pr-3 font-medium">필드</th><th className="py-1 pr-3 font-medium">형식</th><th className="py-1 font-medium">설명</th></tr>
            </thead>
            <tbody>
              {ent.fields.map((f) => (
                <tr key={f.key} className="border-t border-line align-top">
                  <td className="py-1.5 pr-3 font-mono text-[0.6875rem] font-semibold text-ink">{f.key}</td>
                  <td className="py-1.5 pr-3 text-muted">{f.type}</td>
                  <td className="py-1.5 text-ink-2">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 이벤트 로그 — Event Tracking Ready */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-2">
            행동 이벤트 <span className="font-normal text-muted">— 최근 {events.length}건 · Primary Conversion 관련만 기록</span>
          </p>
          {events.length > 0 && (
            <button onClick={() => { clearEvents(); toast("이벤트 로그를 비웠습니다"); }} className="tap text-[0.6875rem] font-semibold text-muted hover:text-ink">
              비우기
            </button>
          )}
        </div>
        <ul className="mt-2 max-h-48 divide-y divide-line overflow-y-auto rounded-xl border border-line scrollbar-thin">
          {events.length === 0 && <li className="p-3 text-xs text-muted">아직 기록된 이벤트가 없습니다. 고객 사이트에서 문의를 접수해 보세요.</li>}
          {events.slice(0, 40).map((e, i) => (
            <li key={i} className="flex items-center justify-between gap-3 px-3 py-1.5 text-xs">
              <span className="min-w-0 truncate">
                <b className="text-ink">{EVENT_LABELS[e.name] ?? e.name}</b>
                {e.props && Object.keys(e.props).length > 0 && (
                  <span className="ml-1.5 text-muted">{Object.entries(e.props).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${v}`).join(" · ")}</span>
                )}
              </span>
              <span className="shrink-0 tabular-nums text-muted">{fmtTime(e.at)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[0.6875rem] text-muted">실서비스에서는 GA4 / PostHog / Supabase events 로 같은 이름 그대로 보냅니다.</p>
      </Card>

      {/* --------------------------------- AI ------------------------------- */}
      <Card title="AI" desc="AI가 어디에, 어떤 방식으로, 어느 수준까지 들어가는지입니다.">
        <div className="flex flex-wrap items-center gap-2">
          <AiReadyBadge />
          <span className="text-xs text-muted">
            엔진 {AI_SUMMARY.total}개 · 규칙 기반 {AI_SUMMARY.rule}개 · LLM 연결 {AI_SUMMARY.llmConnected}개
          </span>
        </div>
        <div className="mt-3 max-w-full overflow-x-auto rounded-xl border border-line scrollbar-thin">
          <table className="w-full min-w-[36rem] text-xs">
            <thead className="bg-canvas text-left text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">엔진</th>
                <th className="px-3 py-2 font-medium">방법</th>
                <th className="px-3 py-2 font-medium">자동화</th>
                <th className="px-3 py-2 font-medium">오류비용</th>
                <th className="px-3 py-2 font-medium">승인</th>
              </tr>
            </thead>
            <tbody>
              {AI_ENGINES.map((e) => (
                <tr key={e.id} className="border-t border-line align-top hover:bg-canvas">
                  <td className="px-3 py-2">
                    <span className="font-semibold text-ink">{e.name}</span>
                    <span className="mt-0.5 block text-[0.6875rem] text-muted">{e.question}</span>
                  </td>
                  <td className="px-3 py-2 text-ink-2">{METHOD_LABELS[e.method]}</td>
                  <td className="px-3 py-2 text-ink-2">{LEVEL_LABELS[e.level]}</td>
                  <td className="px-3 py-2 text-ink-2">{ERROR_COST_LABELS[e.errorCost].split(" ")[0]}</td>
                  <td className="px-3 py-2 text-ink-2">{e.approval}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
          지금 4개 엔진은 모두 조건·수식·기준값으로 돌아갑니다. 규칙으로 충분한 곳에 AI라는 이름을 붙이지 않았고,
          오류비용이 높은 견적 확정은 어떤 단계에서도 사람이 승인합니다. LLM은 사유를 문장으로 쓰거나 공고문을
          읽는 곳에만 붙일 계획입니다.
        </p>
      </Card>

      {/* ------------------------- 기술 · 사업화 자산 ------------------------ */}
      <Card title="기술 · 사업화 자산" desc="실제로 있는 것만 실제 상태로 표시합니다.">
        <p className="text-xs font-semibold text-ink-2">인증 · 등록 ({CREDENTIALS.length}종)</p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {CREDENTIALS.map((c) => (
            <li key={c.label} className="flex items-start justify-between gap-2 rounded-lg bg-canvas px-3 py-2 text-xs">
              <span className="text-ink">{c.label}</span>
              <span className="shrink-0 tabular-nums text-muted">{c.date}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs font-semibold text-ink-2">직접생산확인 등재 품목 (7)</p>
        <p className="mt-1 text-xs text-ink-2">{DIRECT_PRODUCTION.join(" · ")}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Asset label="특허" value="해당없음" note="출원 이력 없음. AX 운영 데이터가 쌓인 뒤 '유사실적 매칭·견적 원가 추정' 구조의 출원 여부를 검토 (재검토: 12개월 운영 후)" />
          <Asset label="벤처기업 확인" value="해당없음" note="현재 미보유. 창업기업(~2027.08)·여성기업(~2027.06) 확인은 보유" />
          <Asset label="연구개발 조직" value="해당없음" note="연구개발전담부서 미설치" />
        </div>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
          출원하지 않은 특허를 출원된 것처럼, 없는 조직을 있는 것처럼 표시하지 않습니다. 이 화면은 정책기관 심사용
          장식이 아니라 회사의 현재 상태표입니다.
        </p>
      </Card>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h2 className="font-bold text-ink">{title}</h2>
      <p className="mt-0.5 text-xs text-muted">{desc}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg bg-canvas px-3.5 py-2.5">
      <span className="text-ink-2">{k}</span>
      <span className="font-semibold text-ink">{v}</span>
    </li>
  );
}

function Asset({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <p className="text-[0.6875rem] font-bold tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
      <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted">{note}</p>
    </div>
  );
}
