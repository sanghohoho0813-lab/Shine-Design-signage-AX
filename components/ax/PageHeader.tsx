import React from "react";
import { Provenance } from "./Provenance";

/** AX 모듈 공통 헤더 — 이 화면이 무엇을 위한 곳인지 한 줄로 알려주고, 데이터 출처를 함께 보여준다 */
export function PageHeader({
  title,
  purpose,
  stat,
  provenance = true,
  children,
}: {
  title: string;
  purpose: string;
  stat?: string;
  /** Data Freshness 칩 — 기본 표시 */
  provenance?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h2 className="text-lg font-black text-ink">{title}</h2>
        <p className="mt-1 max-w-2xl t-meta">{purpose}</p>
      </div>
      <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
        {provenance && <Provenance />}
        {stat && <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-ink-2">{stat}</span>}
        {children}
      </div>
    </div>
  );
}
