"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

/* ---------------------------------------------------------------------------
   시연 모드 (Presentation Mode) — Unified §15 Guided Product Demo
   실제 Route를 자동 이동하며 제품 전체를 10단계로 설명한다.
   루트 레이아웃에 마운트되어 Customer ↔ AX 이동에도 유지된다.
   시작: window.dispatchEvent(new Event("shine-presentation"))
--------------------------------------------------------------------------- */

const STEPS: { route: string; tag: string; title: string; body: string }[] = [
  {
    route: "/ax/why-ax",
    tag: "WHY",
    title: "왜 이 시스템인가",
    body: "2005년의 뿌리와 2024년의 재도약, 한국도로교통공단 전국 실적. 샤인디자인의 다음 단계는 '프로젝트가 자산이 되는 구조'입니다.",
  },
  {
    route: "/",
    tag: "CUSTOMER",
    title: "고객이 만나는 첫 화면",
    body: "발주 담당자가 보는 얼굴입니다. 실제 수행 프로젝트와 실제 현장 사진이 신뢰를 만듭니다.",
  },
  {
    route: "/portfolio",
    tag: "CUSTOMER",
    title: "실적이 곧 영업 자료",
    body: "강서·예산·원주 시험장부터 보령 원도심까지 — 분야별 필터로 유사 실적을 바로 보여줍니다.",
  },
  {
    route: "/inquiry",
    tag: "BRIDGE",
    title: "문의가 시작되는 곳",
    body: "5단계 양식으로 기관 유형·프로젝트·일정·예산이 정리되어 접수됩니다. 전화 메모가 아니라 데이터로 도착합니다.",
  },
  {
    route: "/ax/pipeline",
    tag: "BRIDGE",
    title: "문의 → 파이프라인 자동 유입",
    body: "고객 사이트에서 접수된 문의는 '문의' 단계 카드로 자동 생성됩니다. 문의부터 완료까지 8단계 하나의 흐름입니다.",
  },
  {
    route: "/ax",
    tag: "AX",
    title: "대표의 아침 화면",
    body: "진행 프로젝트, 예상 매출과 Margin, 리스크 — 오늘 봐야 할 숫자가 한 줄로 정리됩니다.",
  },
  {
    route: "/ax/briefing",
    tag: "AI",
    title: "AI가 짚어주는 오늘의 판단",
    body: "Project Risk · Margin Guard · Bid Readiness · Next Action. 모든 인사이트는 What → Why → Action 구조로 제시됩니다.",
  },
  {
    route: "/ax/production",
    tag: "AX",
    title: "자체 공장 + 파트너 한 화면",
    body: "화성·남양주 자체 라인과 외부 파트너 발주를 납기·검수·설치 연결까지 함께 추적합니다.",
  },
  {
    route: "/ax/bids",
    tag: "GROWTH",
    title: "입찰 준비도 — 다음 성장 엔진",
    body: "여성기업·산업디자인전문회사 등 보유 자격과 유사실적을 점수로 관리해, 소개 수주를 입찰 수주로 확장합니다.",
  },
  {
    route: "/ax/evidence",
    tag: "GROWTH",
    title: "완료가 자산이 되는 구조",
    body: "완료 프로젝트는 증빙 → 포트폴리오 → 다음 입찰의 신뢰도로 순환합니다. 이것이 Closed Data Loop입니다.",
  },
];

export function Presentation() {
  const [step, setStep] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const open = () => {
      try {
        localStorage.setItem("shine-ax-tutorial-seen", "1"); // 튜토리얼과 중첩 방지
      } catch {}
      setStep(0);
    };
    window.addEventListener("shine-presentation", open);
    return () => window.removeEventListener("shine-presentation", open);
  }, []);

  const finish = useCallback(() => setStep(null), []);

  // 각 단계의 실제 Route로 이동
  useEffect(() => {
    if (step === null) return;
    const s = STEPS[step];
    if (pathname !== s.route) router.push(s.route);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step, pathname, router]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight" && step < STEPS.length - 1) setStep(step + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, finish]);

  if (step === null) return null;
  const s = STEPS[step];

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex justify-center p-4 pb-6" role="dialog" aria-label="시연 모드">
      <div className="anim-sheet pointer-events-auto w-full max-w-xl rounded-2xl bg-shell/97 p-5 text-nav-primary shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="rounded-md bg-accent px-2 py-0.5 text-[0.625rem] font-black text-shell">시연 모드</span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[0.625rem] font-bold text-nav-label">{s.tag}</span>
          </span>
          <span className="text-[0.6875rem] tabular-nums text-nav-muted">
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <h3 className="mt-2.5 font-black text-nav-active">{s.title}</h3>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-nav-inactive">{s.body}</p>
        {/* progress */}
        <div className="mt-3 flex gap-1" aria-hidden>
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-white/15"}`} />
          ))}
        </div>
        <div className="mt-3.5 flex items-center justify-between">
          <button onClick={finish} className="tap rounded-lg px-3 py-2 text-xs font-medium text-nav-muted hover:bg-white/10 hover:text-nav-active">
            ✕ 종료 (ESC)
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="tap rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-nav-primary hover:bg-white/10 disabled:opacity-30"
            >
              ← 이전
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="tap hover-lift rounded-lg bg-accent px-5 py-2 text-xs font-black text-shell hover:brightness-110">
                다음 →
              </button>
            ) : (
              <button onClick={finish} className="tap hover-lift rounded-lg bg-accent px-5 py-2 text-xs font-black text-shell hover:brightness-110">
                시연 마치기 ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
