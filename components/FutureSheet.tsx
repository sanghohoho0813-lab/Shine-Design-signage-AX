"use client";

import React from "react";
import { Overlay } from "./Overlay";
import { MenuIcon, type IconName } from "./ax/icons";

/* ---------------------------------------------------------------------------
   Future Expansion Layer (v1.4 §4)
   현재 기능과 향후 기능을 분리해 보여준다. 절대 404로 보내지 않는다.
   고객 플랫폼과 Business AX가 같은 시트를 쓴다.
--------------------------------------------------------------------------- */

/** 도입 시점 — 배지 색과 정렬 순서를 결정한다 */
export type FutureTier = "NEXT" | "Preview" | "Long-term";

export interface FutureMenu {
  id: string;
  label: string;
  tier: FutureTier;
  icon: IconName;
  color: string;
  /** 목록에서 한 줄로 보여줄 설명 */
  desc: string;
  tagline: string;
  features: string[];
  growthSignal: { from: string; to: string };
  /** 지명원·실적에서 확인되는 확장 근거 — 왜 이 회사가 이걸 할 수 있는지 */
  basis?: string;
}

const TIER_STYLE: Record<FutureTier, string> = {
  NEXT: "bg-accent/15 text-accent",
  Preview: "border border-current/30 text-muted",
  "Long-term": "border border-current/25 text-muted",
};

const TIER_STYLE_DARK: Record<FutureTier, string> = {
  NEXT: "bg-accent/20 text-accent",
  Preview: "border border-white/25 text-nav-muted",
  "Long-term": "border border-white/20 text-nav-muted",
};

export function FutureBadge({ tier, dark = false }: { tier: FutureTier; dark?: boolean }) {
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-px text-[0.5625rem] font-bold tracking-wide ${
        (dark ? TIER_STYLE_DARK : TIER_STYLE)[tier]
      }`}
    >
      {tier}
    </span>
  );
}

const TIER_WHEN: Record<FutureTier, string> = {
  NEXT: "다음 단계에서 우선 추가",
  Preview: "검토 중 — 수요 확인 후 착수",
  "Long-term": "장기 로드맵",
};

export function FutureSheet({ menu, onClose }: { menu: FutureMenu; onClose: () => void }) {
  return (
    <Overlay onClose={onClose} align="bottom" labelledBy="future-title">
      <div className="anim-sheet max-h-[88dvh] w-screen max-w-2xl overflow-y-auto rounded-t-2xl bg-surface p-6 pb-8 shadow-2xl sm:mx-4 sm:rounded-2xl sm:p-8">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <MenuIcon name={menu.icon} color={menu.color} active />
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <FutureBadge tier={menu.tier} />
                <span className="t-meta">{TIER_WHEN[menu.tier]}</span>
              </span>
            </span>
          </div>
          <button onClick={onClose} className="tap -m-2 rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label="닫기">
            ✕
          </button>
        </div>

        <h3 id="future-title" className="text-xl font-bold text-ink">
          {menu.label}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{menu.tagline}</p>

        {menu.basis && (
          <div className="mt-4 flex gap-3 rounded-xl border border-accent/30 bg-accent/[0.07] p-4">
            <span className="shrink-0 text-[0.6875rem] font-bold tracking-wide text-accent">근거</span>
            <p className="text-sm leading-relaxed text-ink-2">{menu.basis}</p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-line bg-canvas p-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted">예정 기능</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {menu.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-2">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-shell p-4 text-sm">
          <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[0.6875rem] font-semibold text-nav-label">
            Growth
          </span>
          <p className="text-nav-primary">
            {menu.growthSignal.from}
            <span className="mx-2 text-accent" aria-hidden>
              →
            </span>
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

/** 목록 한 줄 — 고객 Drawer·푸터·AX 사이드바가 공유한다 */
export function FutureRow({
  menu,
  onOpen,
  dark = false,
}: {
  menu: FutureMenu;
  onOpen: (m: FutureMenu) => void;
  dark?: boolean;
}) {
  return (
    <button
      onClick={() => onOpen(menu)}
      className={`tap flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${
        dark ? "text-nav-inactive hover:bg-white/7 hover:text-nav-active" : "text-ink-2 hover:bg-soft hover:text-ink"
      }`}
    >
      <MenuIcon name={menu.icon} color={menu.color} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.875rem] font-medium leading-tight">{menu.label}</span>
        <span className={`mt-0.5 block text-[0.6875rem] leading-tight ${dark ? "text-nav-muted" : "text-muted"}`}>
          {menu.desc}
        </span>
      </span>
      <FutureBadge tier={menu.tier} dark={dark} />
    </button>
  );
}
