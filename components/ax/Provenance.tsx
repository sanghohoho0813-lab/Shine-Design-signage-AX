"use client";

import React from "react";
import { useApp, fmtTime } from "@/lib/store";

/* ---------------------------------------------------------------------------
   Data Freshness / Provenance (v3.0 inherited §24, §25)
   "이 숫자가 어디서 왔는가"를 모든 AX 화면에서 보여준다.
   지금은 Demo Data + 브라우저 저장. Supabase를 붙이면 이 한 줄만 바뀐다.
--------------------------------------------------------------------------- */

export function Provenance({ dark = false }: { dark?: boolean }) {
  const { updatedAt, hydrated } = useApp();
  const t = fmtTime(updatedAt);
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold leading-tight ${
        dark ? "bg-white/10 text-nav-label" : "bg-soft text-muted"
      }`}
      title="데이터 출처와 마지막 갱신 시각"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ic-sales)]" aria-hidden />
      <span className="hidden sm:inline">Demo Data · 브라우저 저장</span>
      <span className="sm:hidden">Demo</span>
      {hydrated && t ? <span className="whitespace-nowrap"> · 변경 {t}</span> : <span className="whitespace-nowrap"> · 시드 상태</span>}
    </span>
  );
}
