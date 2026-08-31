"use client";

import React from "react";
import { Overlay } from "../Overlay";

/* ---------------------------------------------------------------------------
   Future Expansion Navigation Layer (v1.4 §4)
   Current vs Future capability separation — preview sheet, never a 404
--------------------------------------------------------------------------- */

export interface FutureMenu {
  id: string;
  label: string;
  badge: "NEXT" | "확장" | "Preview";
  tagline: string;
  features: string[];
  growthSignal: { from: string; to: string };
}

export const FUTURE_MENUS: FutureMenu[] = [
  {
    id: "bid",
    label: "공공입찰·기관문의",
    badge: "NEXT",
    tagline: "발주 전 단계부터 함께 준비하는 공공 프로젝트 사전상담 창구입니다.",
    features: [
      "입찰·발주 예정 프로젝트 사전상담",
      "규격서 / 과업지시서 검토",
      "현장조건 정리 지원",
      "제출자료 체크리스트",
      "유사실적 기반 프로젝트 상담",
    ],
    growthSignal: { from: "소개 중심 공공 수주", to: "반복 가능한 공공조달 파이프라인" },
  },
  {
    id: "corporate",
    label: "기업·브랜드 프로젝트",
    badge: "확장",
    tagline: "공공에서 검증된 사인 역량을 기업 사옥과 브랜드 공간으로 확장합니다.",
    features: [
      "기업 사옥 Signage",
      "브랜드 공간 사인",
      "상업시설 사인 패키지",
      "다지점 Sign System",
      "리브랜딩 사인 교체",
    ],
    growthSignal: { from: "공공 포트폴리오", to: "민간 B2B 시장" },
  },
  {
    id: "partner",
    label: "협력사·제작 파트너",
    badge: "Preview",
    tagline: "프로젝트 특성에 맞는 전문 제작·시공 네트워크를 활용하는 유연한 공급구조입니다.",
    features: ["금속가공 파트너", "조명·채널 파트너", "대형 출력·시트", "설치·시공팀", "지역 시공 파트너"],
    growthSignal: { from: "소수 정예 내부 팀", to: "확장 가능한 파트너 생산 네트워크" },
  },
  {
    id: "care",
    label: "사인 유지관리",
    badge: "NEXT",
    tagline: "설치 이후에도 사인의 수명과 브랜드 일관성을 관리합니다.",
    features: [
      "노후 사인 점검",
      "파손 / 조명 이상 접수",
      "교체주기 관리",
      "CI 변경 대응",
      "다지점 사인 유지관리",
    ],
    growthSignal: { from: "일회성 프로젝트 매출", to: "반복형 유지관리 매출" },
  },
];

export function FuturePreviewSheet({ menu, onClose }: { menu: FutureMenu; onClose: () => void }) {
  return (
    <Overlay onClose={onClose} align="bottom" labelledBy="future-title">
      <div className="anim-sheet w-screen max-w-2xl rounded-t-2xl bg-surface p-6 pb-8 shadow-2xl sm:mx-4 sm:rounded-2xl sm:p-8">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-accent">
            {menu.badge} · 향후 확장
          </span>
          <button onClick={onClose} className="tap -m-2 rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label="닫기">
            ✕
          </button>
        </div>
        <h3 id="future-title" className="text-xl font-bold text-ink">{menu.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{menu.tagline}</p>

        <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted">예정 기능</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {menu.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-shell p-4 text-sm">
          <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-nav-label">
            Growth
          </span>
          <p className="text-nav-primary">
            {menu.growthSignal.from}
            <span className="mx-2 text-accent" aria-hidden>→</span>
            <span className="font-semibold text-nav-active">{menu.growthSignal.to}</span>
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          본 메뉴는 서비스 확장 로드맵의 일부로, 현재 계약 범위에 포함된 기능이 아닙니다. 관련 프로젝트가
          필요하시면 <span className="font-medium text-ink-2">프로젝트 문의</span>를 이용해 주세요.
        </p>
      </div>
    </Overlay>
  );
}
