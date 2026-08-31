"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

/* ---------------------------------------------------------------------------
   AX Tutorial — 4-step guided spotlight over REAL routes (v1.1 Tutorial
   Contract). Auto-navigates, waits for the target, cleans up completely.
   Replay: window.dispatchEvent(new Event("shine-tutorial"))
--------------------------------------------------------------------------- */

const STEPS = [
  {
    route: "/ax",
    target: "kpi-row",
    title: "오늘의 핵심 지표",
    body: "대표가 오늘 봐야 할 숫자만 모았습니다. 진행 프로젝트, 견적 예정, 예상 매출과 Margin을 한 줄로 확인합니다.",
  },
  {
    route: "/ax",
    target: "ai-card",
    title: "오늘의 AX 브리핑",
    body: "AI가 이번 주 가장 주의할 프로젝트를 이유와 함께 짚어줍니다. 근거(Why)와 추천 Action이 항상 함께 표시됩니다.",
  },
  {
    route: "/ax/pipeline",
    target: "pipeline-board",
    title: "프로젝트 파이프라인",
    body: "문의부터 완료까지 8단계로 모든 프로젝트를 관리합니다. 고객 사이트에서 접수된 문의도 이곳에 자동으로 들어옵니다.",
  },
  {
    route: "/ax/bids",
    target: "bid-list",
    title: "공공입찰 준비도",
    body: "입찰 기회별 서류·실적·포트폴리오 준비 상태를 점수로 관리합니다. 완료 프로젝트가 다음 입찰의 증빙이 됩니다.",
  },
];

export function Tutorial() {
  const [step, setStep] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Open triggers: first AX visit, or explicit replay event
  useEffect(() => {
    const open = () => setStep(0);
    window.addEventListener("shine-tutorial", open);
    try {
      if (!localStorage.getItem("shine-ax-tutorial-seen")) {
        const t = setTimeout(() => setStep(0), 700);
        return () => {
          clearTimeout(t);
          window.removeEventListener("shine-tutorial", open);
        };
      }
    } catch {}
    return () => window.removeEventListener("shine-tutorial", open);
  }, []);

  const finish = useCallback(() => {
    setStep(null);
    setRect(null);
    try {
      localStorage.setItem("shine-ax-tutorial-seen", "1");
    } catch {}
  }, []);

  // Navigate to the step's route, then measure its target
  useEffect(() => {
    if (step === null) return;
    const s = STEPS[step];
    if (pathname !== s.route) {
      router.push(s.route);
      return;
    }
    let tries = 0;
    setRect(null);
    const find = () => {
      const el = document.querySelector(`[data-tutorial="${s.target}"]`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
        setRect(el.getBoundingClientRect());
      } else if (++tries < 30) {
        setTimeout(find, 100);
      } else {
        setRect(new DOMRect(window.innerWidth / 2 - 1, window.innerHeight / 2 - 1, 2, 2));
      }
    };
    const t = setTimeout(find, 150);
    return () => clearTimeout(t);
  }, [step, pathname, router]);

  if (step === null) return null;
  const s = STEPS[step];

  const pad = 8;
  const cardBelow = rect ? rect.bottom + 180 < window.innerHeight : true;

  return createPortal(
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="AX 튜토리얼">
      {/* Spotlight backdrop */}
      <div
        className="absolute inset-0 transition-all duration-200"
        style={
          rect
            ? {
                background: "rgba(10,12,16,0.62)",
                clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 ${rect.top - pad}px,${rect.left - pad}px ${rect.top - pad}px,${rect.left - pad}px ${rect.bottom + pad}px,${rect.right + pad}px ${rect.bottom + pad}px,${rect.right + pad}px ${rect.top - pad}px,0 ${rect.top - pad}px)`,
              }
            : { background: "rgba(10,12,16,0.62)" }
        }
        onClick={finish}
      />
      {rect && (
        <div
          aria-hidden
          className="absolute rounded-xl border-2 border-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
          style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
        />
      )}
      {/* Step card */}
      <div
        className="anim-sheet absolute left-1/2 w-[min(92vw,380px)] -translate-x-1/2 rounded-2xl bg-surface p-5 shadow-2xl"
        style={
          rect
            ? cardBelow
              ? { top: Math.min(rect.bottom + 16, window.innerHeight - 220) }
              : { top: Math.max(rect.top - 200, 16) }
            : { top: "50%", transform: "translate(-50%,-50%)" }
        }
      >
        <p className="text-[11px] font-bold text-accent">
          STEP {step + 1} / {STEPS.length}
        </p>
        <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.body}</p>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={finish} className="tap rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-soft">
            건너뛰기
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="tap rounded-lg border border-line px-4 py-2 text-xs font-semibold text-ink-2 hover:bg-soft">
                이전
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="tap hover-lift rounded-lg bg-shell px-4 py-2 text-xs font-semibold text-white hover:bg-shell-2">
                다음 →
              </button>
            ) : (
              <button onClick={finish} className="tap hover-lift rounded-lg bg-accent px-4 py-2 text-xs font-bold text-shell hover:brightness-110">
                시작하기 ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
