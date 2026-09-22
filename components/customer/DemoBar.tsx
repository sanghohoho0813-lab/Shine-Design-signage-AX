"use client";

import React from "react";
import Link from "next/link";
import { useApp, ROLE_LABELS } from "@/lib/store";

/* Demo Control Layer — admin/ceo roles discover the Business AX entry point;
   hidden entirely for the customer role (v1.1 Hybrid Demo Control Layer). */
export default function DemoBar() {
  const { role, hydrated, isEmbedded, deliveryStage } = useApp();
  if (!hydrated || role === "customer" || isEmbedded) return null;
  return (
    /* 폰에서는 본문 위에 떠서 버튼을 가리므로 작은 알약로 줄인다(v17). 라벨은 같은 텍스트를 유지해 시연·테스트 셀렉터가 깨지지 않게 */
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-shell/95 p-1 text-xs text-nav-primary shadow-xl backdrop-blur sm:py-1.5 sm:pl-4 sm:pr-1.5">
      <span className="hidden sm:block">
        <b className="text-accent">{deliveryStage}</b> · {ROLE_LABELS[role]} 모드
      </span>
      <Link
        href="/ax"
        className="tap hover-lift inline-flex min-h-9 items-center rounded-full bg-accent px-3 py-1.5 font-semibold text-on-accent hover:brightness-110 sm:px-3.5 sm:py-2"
        data-tutorial="ax-entry"
        aria-label="Business AX 보기"
      >
        <span className="sm:hidden">AX →</span>
        <span className="hidden sm:inline">Business AX 보기 →</span>
      </Link>
    </div>
  );
}
