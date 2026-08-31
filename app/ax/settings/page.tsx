"use client";

import { useState } from "react";
import { useApp, THEMES, ROLE_LABELS, Role, FontScale } from "@/lib/store";
import { toast } from "@/components/Toast";

export default function SettingsPage() {
  const app = useApp();
  const [resetDone, setResetDone] = useState(false);
  if (!app.hydrated) return <div className="p-6 text-sm text-muted">불러오는 중…</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      {/* 화면 */}
      <Card title="화면" desc="Theme · Font Scale · Motion — PC와 모바일에 동일하게 적용됩니다.">
        <p className="text-xs font-semibold text-ink-2">
          Theme ({THEMES.length}종) <span className="font-normal text-muted">— 각 테마는 6개 핵심 토큰으로 구성됩니다</span>
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => app.setTheme(t.id)}
              aria-pressed={app.theme === t.id}
              className={`tap hover-lift rounded-xl border-2 p-3 text-left ${app.theme === t.id ? "border-accent bg-accent/5" : "border-line hover:border-secondary"}`}
            >
              {/* 해당 테마의 6개 토큰 실시간 스와치 */}
              <span data-theme={t.id} className="flex gap-1" aria-hidden>
                {["--shell", "--primary", "--accent", "--secondary", "--soft", "--canvas"].map((v) => (
                  <span key={v} className="h-5 w-5 rounded-md border border-black/8" style={{ background: `var(${v})` }} />
                ))}
              </span>
              <span className="mt-1.5 block text-[0.6875rem] font-bold text-ink">{t.name}</span>
              {app.theme === t.id ? (
                <span className="text-[0.625rem] font-semibold text-accent">사용 중 ✓</span>
              ) : (
                <span className="text-[0.625rem] text-muted">{t.id === "shine" ? "브랜드 기본" : "라이브러리"}</span>
              )}
            </button>
          ))}
        </div>

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
        {/* 현재 크기 미리보기 — 화면 전체가 이 비율로 함께 커집니다 */}
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

      {/* 권한 */}
      <Card title="권한 · Role Preview" desc="역할에 따라 메뉴 · 금액 지표 · AX 진입점이 달라집니다.">
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
      </Card>

      {/* 데모 */}
      <Card title="데모" desc="시연을 위한 초기화 · 튜토리얼 재생 기능입니다.">
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
            <span className="text-xs text-muted">문의·진행 상태·테마를 초기 데모 상태로 복원</span>
          </button>
        </div>
      </Card>

      {/* 데이터 / AI */}
      <Card title="데이터 · AI" desc="현재 데이터 소스와 AI 연결 상태입니다.">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-lg bg-canvas px-3.5 py-2.5">
            <span className="text-ink-2">데이터 소스</span>
            <span className="font-semibold text-ink">Demo Repository (로컬)</span>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-canvas px-3.5 py-2.5">
            <span className="text-ink-2">데이터 신선도</span>
            <span className="font-semibold text-ink">실시간 (브라우저 저장)</span>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-canvas px-3.5 py-2.5">
            <span className="text-ink-2">교체 지점</span>
            <span className="font-semibold text-ink">CSV / Supabase / API</span>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-canvas px-3.5 py-2.5">
            <span className="text-ink-2">AI 상태</span>
            <span className="rounded-full bg-[var(--ic-ai)]/12 px-2.5 py-0.5 text-xs font-bold text-[var(--ic-ai)]">
              AI READY — 규칙 기반 Demo
            </span>
          </li>
        </ul>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
          현재 인사이트는 규칙 기반으로 산출됩니다. 향후 GPT / Claude 등 LLM API를 같은 구조에 연결할 수
          있습니다.
        </p>
      </Card>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h2 className="font-bold text-ink">{title}</h2>
      <p className="mt-0.5 text-xs text-muted">{desc}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
