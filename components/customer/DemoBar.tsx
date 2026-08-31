"use client";

import React from "react";
import Link from "next/link";
import { useApp, ROLE_LABELS } from "@/lib/store";

/* Demo Control Layer — admin/ceo roles discover the Business AX entry point;
   hidden entirely for the customer role (v1.1 Hybrid Demo Control Layer). */
export default function DemoBar() {
  const { role, hydrated, isEmbedded } = useApp();
  if (!hydrated || role === "customer" || isEmbedded) return null;
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-shell/95 py-1.5 pl-4 pr-1.5 text-xs text-nav-primary shadow-xl backdrop-blur">
      <span className="hidden sm:block">
        <b className="text-accent">DEMO</b> · {ROLE_LABELS[role]} 모드
      </span>
      <Link
        href="/ax"
        className="tap hover-lift rounded-full bg-accent px-3.5 py-2 font-semibold text-shell hover:brightness-110"
        data-tutorial="ax-entry"
      >
        Business AX 보기 →
      </Link>
    </div>
  );
}
