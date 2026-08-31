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
