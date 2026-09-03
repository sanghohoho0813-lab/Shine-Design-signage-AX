"use client";

import React, { useState } from "react";
import { FUTURE_MENUS, FuturePreviewSheet, FutureBadge, type FutureMenu } from "./FuturePreview";
import { MenuIcon } from "../ax/icons";

/* ---------------------------------------------------------------------------
   앞으로 확장될 서비스 — 사업분야 페이지 하단.
   현재 사업분야(5개 영역 + 사인 카탈로그 48품목)를 먼저 보여준 뒤에 놓아,
   "지금 되는 것"과 "앞으로 될 것"이 섞이지 않게 한다.
--------------------------------------------------------------------------- */

export default function FutureSection() {
  const [sel, setSel] = useState<FutureMenu | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FUTURE_MENUS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSel(m)}
            className="tap hover-lift flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-4 text-left"
          >
            <MenuIcon name={m.icon} color={m.color} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-bold text-ink">{m.label}</span>
                <FutureBadge tier={m.tier} />
              </span>
              <span className="mt-1 block t-meta">{m.desc}</span>
            </span>
            <span aria-hidden className="mt-1 shrink-0 text-muted">
              ›
            </span>
          </button>
        ))}
      </div>

      <p className="mt-5 t-meta">
        위 항목은 확장 로드맵으로 현재 제공 중인 서비스가 아닙니다. 각 항목을 누르면 예정 기능과
        저희가 이걸 할 수 있는 근거를 확인하실 수 있습니다.
      </p>

      {sel && <FuturePreviewSheet menu={sel} onClose={() => setSel(null)} />}
    </>
  );
}
