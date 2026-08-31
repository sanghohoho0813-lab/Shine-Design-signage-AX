"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FUTURE_MENUS, FuturePreviewSheet, FutureMenu } from "./FuturePreview";
import { Logo } from "./Header";

export default function CustomerFooter() {
  const [future, setFuture] = useState<FutureMenu | null>(null);
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            공공·공간 사인 프로젝트를 기획·디자인하고, 제작·시공까지 통합 관리하는 전문 사인디자인
            기업입니다.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            ㈜샤인디자인 · 대표이사 권유진 · 사업자등록번호 519-87-03609
            <br />
            경기도 남양주시 순화궁로 282, 221호 (별내동, 에이스하이엔드타워)
            <br />
            산업디자인전문회사 · 여성기업 · 옥외광고사업 등록 · 공장등록
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted">MENU</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["/about", "회사소개"],
              ["/services", "사업분야"],
              ["/portfolio", "포트폴리오"],
              ["/process", "프로젝트 프로세스"],
              ["/inquiry", "프로젝트 문의"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="tap text-ink-2 hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted">
            향후 확장 <span className="ml-1 rounded bg-accent/15 px-1.5 py-px text-[9px] font-bold text-accent">NEXT</span>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {FUTURE_MENUS.map((m) => (
              <li key={m.id}>
                <button onClick={() => setFuture(m)} className="tap text-ink-2 hover:text-ink">
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} SHINE DESIGN. All rights reserved.
      </div>
      {future && <FuturePreviewSheet menu={future} onClose={() => setFuture(null)} />}
    </footer>
  );
}
