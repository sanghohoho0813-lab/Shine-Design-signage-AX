import React from "react";

/* Lucide-style outline icons (inline, stroke=currentColor) */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" {...S}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M4 6h16M4 12h10M4 18h6" /><circle cx="19" cy="12" r="2" /><circle cx="14" cy="18" r="2" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" {...S}>
      <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h4" />
    </svg>
  ),
  factory: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M3 21V9l6 4V9l6 4V9l6 4v8H3Z" /><path d="M8 17h.01M13 17h.01M18 17h.01" />
    </svg>
  ),
  bid: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M9 12l2 2 4-4" /><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4Z" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  evidence: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M14 3v6h6M9 15l2 2 4-4" />
    </svg>
  ),
  story: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="12" r="9" /><path d="M10 8.5l5 3.5-5 3.5v-7Z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 4 5.7 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.7-4-9s1.5-6.4 4-9Z" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </svg>
  ),

  /* ---- 향후 확장 메뉴용 ---- */
  ruler: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M3.5 15.5 15.5 3.5a1.4 1.4 0 0 1 2 0l3 3a1.4 1.4 0 0 1 0 2l-12 12a1.4 1.4 0 0 1-2 0l-3-3a1.4 1.4 0 0 1 0-2Z" />
      <path d="M7 12l2 2M10.5 8.5l2 2M14 5l2 2" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" {...S}>
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M8 14h3M8 18h6" />
    </svg>
  ),
  receipt: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M5 3h14v18l-2.3-1.6L14.4 21 12 19.4 9.6 21 7.3 19.4 5 21V3Z" /><path d="M9 8h6M9 12h6" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M14.7 6.3a4 4 0 0 1 5.3 5.3l-8.7 8.7a2.2 2.2 0 0 1-3.1-3.1l8.7-8.7Z" />
      <path d="M9 5 5.5 8.5 3 6l2.5-2.5L8 4l1-1 2 2-2 2Z" />
    </svg>
  ),
  radar: (
    <svg viewBox="0 0 24 24" {...S}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6M11 7.5v3.5h3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M3 3v18h18" /><path d="M7 15v3M12 10v8M17 6v12" />
    </svg>
  ),
  access: (
    <svg viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M7 8h10M12 8v5M12 13l-3 8M12 13l3 8" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M20 11a8 8 0 0 0-13.7-5.3L3 9" /><path d="M3 4v5h5" />
      <path d="M4 13a8 8 0 0 0 13.7 5.3L21 15" /><path d="M21 20v-5h-5" />
    </svg>
  ),
  plaque: (
    <svg viewBox="0 0 24 24" {...S}>
      <rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M7 9h10M7 12.5h6M8 17v3h8v-3" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24" {...S}>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" /><path d="M9 20h6M12 16.5V20" />
    </svg>
  ),
  frame: (
    <svg viewBox="0 0 24 24" {...S}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9.5" r="1.6" />
      <path d="m4 18 5-5 4 4 2.5-2.5L20 18" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="m11 17-3.5-3.5a2 2 0 0 1 0-2.8L11 7l2 2 2-2 3.5 3.5a2 2 0 0 1 0 2.8L15 17" />
      <path d="M2.5 9.5 6 6M21.5 9.5 18 6" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" {...S}>
      <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" /><path d="M14 10h4a2 2 0 0 1 2 2v9" />
      <path d="M3 21h18M7.5 8h3M7.5 12h3M7.5 16h3M17 14h.01M17 17.5h.01" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" {...S}>
      <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4M18 20a6.4 6.4 0 0 0-2-4.6" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof Icons;

export function MenuIcon({ name, color, active }: { name: IconName; color: string; active?: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg [&>svg]:h-[17px] [&>svg]:w-[17px]"
      style={{
        color,
        background: `color-mix(in srgb, ${color} ${active ? 22 : 13}%, transparent)`,
      }}
    >
      {Icons[name]}
    </span>
  );
}
