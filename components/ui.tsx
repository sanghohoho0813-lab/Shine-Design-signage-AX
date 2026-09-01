import React from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------------
   공통 레이아웃 프리미티브 — 모든 고객 페이지가 같은 구조를 쓴다
--------------------------------------------------------------------------- */

type Tone = "canvas" | "surface" | "shell";

const TONE_BG: Record<Tone, string> = {
  canvas: "bg-canvas",
  surface: "bg-surface",
  shell: "bg-shell",
};

export function Section({
  tone = "canvas",
  size = "base",
  className = "",
  children,
  id,
}: {
  tone?: Tone;
  size?: "base" | "sm";
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`${TONE_BG[tone]} ${size === "sm" ? "section-sm" : "section"} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/** 섹션 머리 — eyebrow / 제목 / 설명 / 우측 액션이 항상 같은 배치 */
export function SectionHeader({
  eyebrow,
  title,
  desc,
  action,
  onDark = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  action?: { href: string; label: string };
  onDark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${
        align === "center" ? "flex-col items-center text-center" : ""
      }`}
    >
      <div className={align === "center" ? "" : "min-w-0"}>
        {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
        <h2 className={`t-h2 ${eyebrow ? "mt-2" : ""} ${onDark ? "text-white" : "text-ink"}`}>{title}</h2>
        {desc && (
          <p className={`measure-wide mt-3 t-body ${onDark ? "text-nav-inactive" : ""}`}>{desc}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`tap shrink-0 text-sm font-semibold ${onDark ? "text-nav-inactive hover:text-white" : "text-muted hover:text-ink"}`}
        >
          {action.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

/** 사진 위에 텍스트를 올리는 풀블리드 밴드 — 스크림이 항상 적용된다 */
export function PhotoBand({
  image,
  alt,
  position = "50% 50%",
  children,
  className = "",
  scrim = "band",
}: {
  image: string;
  alt: string;
  position?: string;
  children: React.ReactNode;
  className?: string;
  scrim?: "band" | "hero";
}) {
  return (
    <section className={`relative isolate overflow-hidden bg-shell ${className}`}>
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
        loading="lazy"
      />
      <div className={scrim === "hero" ? "scrim-hero" : "scrim-band"} aria-hidden />
      <div className="container-page relative">{children}</div>
    </section>
  );
}

/* 선 아이콘 — 이모지 대신 사용 (톤 일관성) */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const LineIcons = {
  building: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M3 21h18M5 21V6l7-3 7 3v15" /><path d="M9 21v-5h6v5M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  ruler: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M3 15 15 3l6 6L9 21Z" /><path d="M7 11l2 2M11 7l2 2M9.5 16.5l1.5 1.5" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3Z" /><path d="M9 3v15M15 6v15" />
    </svg>
  ),
} as const;
