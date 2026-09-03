"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FUTURE_MENUS, FuturePreviewSheet, FutureBadge, type FutureMenu } from "./FuturePreview";
import { Logo } from "./Header";
import { COMPANY } from "@/lib/company";

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
          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <div>
              <dt className="text-[0.625rem] font-semibold tracking-wider text-muted">TEL</dt>
              <dd>
                <a href={`tel:${COMPANY.tel.replace(/-/g, "")}`} className="tap text-sm font-bold tabular-nums text-ink hover:text-primary">
                  {COMPANY.tel}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] font-semibold tracking-wider text-muted">FAX</dt>
              <dd className="text-sm font-medium tabular-nums text-ink-2">{COMPANY.fax}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.625rem] font-semibold tracking-wider text-muted">E-MAIL</dt>
              <dd>
                <a href={`mailto:${COMPANY.email}`} className="tap block truncate text-sm font-bold text-ink hover:text-primary">
                  {COMPANY.email}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {COMPANY.name} · 대표이사 {COMPANY.ceo} · 사업자등록번호 {COMPANY.bizNo}
            <br />
            본사 {COMPANY.address}
            <br />
            공장 경기도 화성시 마도면 송정로 239-21
            <br />
            산업디자인전문회사 · 여성기업 · 옥외광고사업 등록 · 공장등록 · 직접생산확인
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
            향후 확장 <span className="ml-1 text-[0.625rem] font-normal">{FUTURE_MENUS.length}개</span>
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {FUTURE_MENUS.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => setFuture(m)}
                  className="tap flex w-full items-center gap-1.5 text-left text-ink-2 hover:text-ink"
                >
                  <span className="min-w-0 truncate">{m.label}</span>
                  <FutureBadge tier={m.tier} />
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
