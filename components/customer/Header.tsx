"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Overlay } from "../Overlay";
import { FUTURE_MENUS, FuturePreviewSheet, FutureMenu } from "./FuturePreview";
import { DevicePreviewButton } from "../DevicePreview";
import { useApp } from "@/lib/store";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/about", label: "회사소개" },
  { href: "/services", label: "사업분야" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/process", label: "프로젝트 프로세스" },
  { href: "/inquiry", label: "프로젝트 문의" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="tap flex items-center gap-2.5" aria-label="샤인디자인 홈">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-shell text-lg font-black text-accent">
        S
      </span>
      <span className="leading-tight">
        <span className={`block text-[15px] font-black tracking-wide ${dark ? "text-nav-active" : "text-ink"}`}>
          SHINE DESIGN
        </span>
        <span className={`block text-[10px] font-medium tracking-[0.2em] ${dark ? "text-nav-muted" : "text-muted"}`}>
          샤인디자인
        </span>
      </span>
    </Link>
  );
}

export default function CustomerHeader() {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [future, setFuture] = useState<FutureMenu | null>(null);
  const featuredFuture = FUTURE_MENUS[0];

  const close = () => setDrawer(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="주 메뉴">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`tap rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === n.href ? "bg-soft text-ink" : "text-ink-2 hover:bg-soft hover:text-ink"
              }`}
              aria-current={pathname === n.href ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => setFuture(featuredFuture)}
            className="tap flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-soft hover:text-ink"
          >
            {featuredFuture.label}
            <sup className="rounded bg-accent/15 px-1 py-px text-[9px] font-bold text-accent">NEXT</sup>
          </button>
        </nav>

        <div className="flex items-center gap-1.5">
          <span className="hidden md:block">
            <DevicePreviewButton />
          </span>
          <Link
            href="/inquiry"
            className="tap hover-lift hidden rounded-lg bg-shell px-4 py-2 text-sm font-semibold text-white hover:bg-shell-2 sm:block"
          >
            문의하기
          </Link>
          <button
            onClick={() => setDrawer(true)}
            className="tap rounded-lg p-2 text-ink-2 hover:bg-soft"
            aria-label="더보기 메뉴 열기"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Drawer — full nav + future expansion group */}
      {drawer && (
        <Overlay onClose={close} align="left">
          <div className="anim-drawer-l flex h-dvh w-[300px] flex-col overflow-y-auto bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line p-4">
              <Logo />
              <button onClick={close} className="tap rounded-lg p-2 text-muted hover:bg-soft" aria-label="메뉴 닫기">
                ✕
              </button>
            </div>
            <nav className="flex-1 p-3" aria-label="전체 메뉴">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold tracking-wider text-muted">MENU</p>
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={close}
                  className={`tap block rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                    pathname === n.href ? "bg-soft text-ink" : "text-ink-2 hover:bg-soft"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <p className="px-3 pb-1 pt-5 text-[11px] font-semibold tracking-wider text-muted">
                향후 확장 <span className="ml-1 rounded bg-accent/15 px-1.5 py-px text-[9px] font-bold text-accent">NEXT</span>
              </p>
              {FUTURE_MENUS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    close();
                    setFuture(m);
                  }}
                  className="tap flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-ink-2 hover:bg-soft"
                >
                  {m.label}
                  <span className="rounded bg-accent/15 px-1.5 py-px text-[9px] font-bold text-accent">{m.badge}</span>
                </button>
              ))}
              <div className="mt-4 border-t border-line pt-4">
                <div className="px-3">
                  <DevicePreviewButton />
                </div>
              </div>
            </nav>
            <div className="border-t border-line p-4">
              <Link
                href="/inquiry"
                onClick={close}
                className="tap block rounded-lg bg-shell px-4 py-3 text-center text-sm font-semibold text-white hover:bg-shell-2"
              >
                프로젝트 문의하기
              </Link>
            </div>
          </div>
        </Overlay>
      )}

      {future && <FuturePreviewSheet menu={future} onClose={() => setFuture(null)} />}
    </header>
  );
}
