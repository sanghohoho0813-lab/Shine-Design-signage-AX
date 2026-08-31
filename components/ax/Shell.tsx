"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Overlay } from "../Overlay";
import { DevicePreviewButton } from "../DevicePreview";
import { MenuIcon, Icons, IconName } from "./icons";
import { useApp, useClock, ROLE_LABELS } from "@/lib/store";
import { Tutorial } from "./Tutorial";

interface MenuItem {
  href: string;
  label: string;
  icon: IconName;
  color: string;
  ceoOnly?: boolean;
}

export const AX_MENU: MenuItem[] = [
  { href: "/ax", label: "대시보드", icon: "dashboard", color: "var(--ic-overview)" },
  { href: "/ax/pipeline", label: "프로젝트 관리", icon: "pipeline", color: "var(--ic-ops)" },
  { href: "/ax/quotes", label: "견적·원가 관리", icon: "quote", color: "var(--ic-sales)", ceoOnly: true },
  { href: "/ax/production", label: "제작·파트너 관리", icon: "factory", color: "var(--ic-partner)" },
  { href: "/ax/bids", label: "입찰·제안 관리", icon: "bid", color: "var(--ic-crm)" },
  { href: "/ax/briefing", label: "AI 브리핑", icon: "ai", color: "var(--ic-ai)" },
  { href: "/ax/evidence", label: "증빙·리포트", icon: "evidence", color: "var(--ic-evidence)" },
  { href: "/ax/why-ax", label: "Why AX", icon: "story", color: "var(--ic-risk)" },
  { href: "/ax/settings", label: "설정", icon: "settings", color: "var(--ic-system)" },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useApp();
  return (
    <nav className="flex-1 space-y-0.5 px-3 py-3" aria-label="AX 메뉴">
      {AX_MENU.filter((m) => !m.ceoOnly || role !== "staff").map((m) => {
        const active = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={m.href}
            onClick={onNavigate}
            data-tutorial={`menu-${m.href.replace(/\//g, "-")}`}
            className={`tap flex items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] ${
              active
                ? "bg-white/12 font-semibold text-nav-active shadow-[inset_2px_0_0_0_var(--accent)]"
                : "font-medium text-nav-inactive hover:bg-white/7 hover:text-nav-active"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <MenuIcon name={m.icon} color={m.color} active={active} />
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-white/10 p-3">
      <Link
        href="/"
        onClick={onNavigate}
        data-tutorial="customer-view"
        className="tap flex items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] font-medium text-nav-inactive hover:bg-white/7 hover:text-nav-active"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-nav-primary [&>svg]:h-[17px] [&>svg]:w-[17px]" aria-hidden>
          {Icons.globe}
        </span>
        고객 사이트 보기
      </Link>
    </div>
  );
}

export default function AxShell({ children }: { children: React.ReactNode }) {
  const { role, hydrated, projects, inquiries } = useApp();
  const clock = useClock();
  const [drawer, setDrawer] = useState(false);
  const [notif, setNotif] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const alerts = useMemo(() => {
    const a: { title: string; desc: string; href: string }[] = [];
    projects.filter((p) => p.risk === "높음").forEach((p) => a.push({ title: `${p.client} · 리스크 높음`, desc: p.riskNote || p.name, href: "/ax/pipeline" }));
    inquiries.filter((q) => q.axStatus === "접수").forEach((q) => a.push({ title: "신규 고객 문의", desc: `${q.clientType} · ${q.projectType}`, href: "/ax/pipeline" }));
    return a;
  }, [projects, inquiries]);

  // Customer role must not see the Business AX surface
  if (hydrated && role === "customer") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center">
        <span className="text-4xl" aria-hidden>🔒</span>
        <h1 className="mt-4 text-xl font-bold text-ink">Business AX는 관리자 전용 화면입니다</h1>
        <p className="mt-2 text-sm text-muted">현재 역할이 &lsquo;고객&rsquo;으로 설정되어 있습니다. 데모를 계속 보시려면 역할을 변경하세요.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="tap rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-2 hover:bg-soft">
            고객 사이트로
          </Link>
          <RoleUnlockButton />
        </div>
      </div>
    );
  }

  const current = AX_MENU.find((m) => m.href === pathname);

  return (
    <div className="flex min-h-dvh bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col bg-shell lg:flex" data-tutorial="sidebar">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-lg font-black text-shell">S</span>
          <div className="leading-tight">
            <p className="text-[15px] font-black tracking-wide text-nav-active">SHINE DESIGN</p>
            <p className="text-[10px] font-medium tracking-[0.2em] text-nav-muted">사인디자인 AX</p>
          </div>
        </div>
        <NavList />
        <SidebarFooter />
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-[280px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-1.5">
              <button onClick={() => setDrawer(true)} className="tap rounded-lg p-2 text-ink-2 hover:bg-soft lg:hidden" aria-label="AX 메뉴 열기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </button>
              <h1 className="truncate text-[15px] font-bold text-ink">{current?.label ?? "Business AX"}</h1>
              <span className="ml-1 hidden rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent sm:block">DEMO</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="text-right leading-tight" data-tutorial="clock" aria-label="현재 날짜와 시각">
                <span className="hidden text-[13px] font-medium tabular-nums text-ink-2 md:block">{clock.full}</span>
                <span className="block text-[11px] font-medium text-muted md:hidden">
                  {clock.compact}
                  <span className="ml-1 tabular-nums text-ink-2">{clock.time}</span>
                </span>
              </div>
              <button
                onClick={() => setNotif(true)}
                className="tap relative rounded-lg p-2 text-ink-2 hover:bg-soft [&>svg]:h-[18px] [&>svg]:w-[18px]"
                aria-label={`알림 ${alerts.length}건`}
              >
                {Icons.bell}
                {alerts.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ic-risk)] px-1 text-[9px] font-bold text-white">
                    {alerts.length}
                  </span>
                )}
              </button>
              <span className="hidden sm:block">
                <DevicePreviewButton />
              </span>
              <Link
                href="/ax/settings"
                className="tap flex items-center gap-1.5 rounded-full border border-line py-1 pl-1 pr-3 hover:bg-soft"
                aria-label="역할 및 설정"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-shell text-[10px] font-bold text-accent">
                  {hydrated ? ROLE_LABELS[role][0] : "대"}
                </span>
                <span className="text-xs font-semibold text-ink-2">{hydrated ? ROLE_LABELS[role] : "대표"}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-shell pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="AX 하단 메뉴">
        <div className="grid grid-cols-4">
          {[AX_MENU[0], AX_MENU[1], AX_MENU[5]].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`tap flex flex-col items-center gap-0.5 py-2 text-[10px] ${pathname === m.href ? "font-semibold text-nav-active" : "text-nav-muted"}`}
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5" style={{ color: pathname === m.href ? m.color : undefined }} aria-hidden>
                {Icons[m.icon]}
              </span>
              {m.label.split("·")[0].replace(" 관리", "")}
            </Link>
          ))}
          <button onClick={() => setDrawer(true)} className="tap flex flex-col items-center gap-0.5 py-2 text-[10px] text-nav-muted" aria-label="전체 메뉴">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            메뉴
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawer && (
        <Overlay onClose={() => setDrawer(false)} align="left">
          <div className="anim-drawer-l flex h-dvh w-[290px] flex-col overflow-y-auto bg-shell">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-lg font-black text-shell">S</span>
                <div className="leading-tight">
                  <p className="text-[15px] font-black tracking-wide text-nav-active">SHINE DESIGN</p>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-nav-muted">사인디자인 AX</p>
                </div>
              </div>
              <button onClick={() => setDrawer(false)} className="tap rounded-lg p-2 text-nav-inactive hover:bg-white/10" aria-label="메뉴 닫기">✕</button>
            </div>
            <NavList onNavigate={() => setDrawer(false)} />
            <div className="px-5 py-2"><DevicePreviewButton dark /></div>
            <SidebarFooter onNavigate={() => setDrawer(false)} />
          </div>
        </Overlay>
      )}

      {/* Notifications */}
      {notif && (
        <Overlay onClose={() => setNotif(false)} align="right">
          <div className="anim-drawer-r flex h-dvh w-[320px] flex-col bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line p-4">
              <h2 className="font-bold text-ink">알림</h2>
              <button onClick={() => setNotif(false)} className="tap rounded-lg p-2 text-muted hover:bg-soft" aria-label="알림 닫기">✕</button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {alerts.length === 0 && <p className="p-4 text-sm text-muted">새 알림이 없습니다.</p>}
              {alerts.map((a, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setNotif(false);
                    router.push(a.href);
                  }}
                  className="tap block w-full rounded-xl border border-line bg-canvas p-3.5 text-left hover:bg-soft"
                >
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </Overlay>
      )}

      <Tutorial />
    </div>
  );
}

function RoleUnlockButton() {
  const { setRole } = useApp();
  return (
    <button onClick={() => setRole("ceo")} className="tap hover-lift rounded-lg bg-shell px-5 py-2.5 text-sm font-semibold text-white hover:bg-shell-2">
      대표 역할로 전환
    </button>
  );
}
