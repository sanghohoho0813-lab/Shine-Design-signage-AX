"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useApp, THEMES } from "@/lib/store";
import { portfolio } from "@/lib/data";
import { AX_MENU_GROUPS } from "./ax/menu";
import { AX_FUTURE } from "./ax/future";
import { FUTURE_MENUS } from "./customer/FuturePreview";
import { FutureSheet, type FutureMenu } from "./FutureSheet";

/* ---------------------------------------------------------------------------
   ⌘K 전역 검색 — 어느 화면에서든 메뉴·프로젝트·포트폴리오·기능을 바로 찾는다.
   열기: Cmd/Ctrl + K, 또는 window.dispatchEvent(new Event("shine-palette"))
--------------------------------------------------------------------------- */

type Item = {
  id: string;
  group: string;
  title: string;
  sub?: string;
  keywords?: string;
  run: () => void;
};

const CUSTOMER_NAV = [
  ["/", "홈", "회사 첫 화면"],
  ["/about", "회사소개", "연혁 · 자격 · 사업장"],
  ["/services", "사업분야", "사인·환경디자인·웨이파인딩 5개 영역"],
  ["/portfolio", "포트폴리오", "실제 수행 프로젝트 21건"],
  ["/process", "프로젝트 프로세스", "문의부터 준공 증빙까지 9단계"],
  ["/inquiry", "프로젝트 문의", "5단계 문의 양식 · FAQ"],
] as const;


/** 한글 초성 포함 느슨한 매칭 */
function match(text: string, q: string) {
  if (!q) return true;
  const t = text.toLowerCase().replace(/\s/g, "");
  const query = q.toLowerCase().replace(/\s/g, "");
  return t.includes(query);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  /* 검색 결과에서 향후 확장을 고르면 팔레트가 닫힌 뒤 이 시트가 열린다 */
  const [future, setFuture] = useState<FutureMenu | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { projects, role, setTheme, theme, hydrated } = useApp();

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setActive(0);
  }, []);

  // 열기 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onEvt = () => setOpen(true);
    const onFuture = (e: Event) => setFuture((e as CustomEvent<FutureMenu>).detail);
    window.addEventListener("keydown", onKey);
    window.addEventListener("shine-palette", onEvt);
    window.addEventListener("shine-future", onFuture);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("shine-palette", onEvt);
      window.removeEventListener("shine-future", onFuture);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const canSeeAx = !hydrated || role !== "customer";

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      router.push(href);
    };
    const out: Item[] = [];

    CUSTOMER_NAV.forEach(([href, label, desc]) =>
      out.push({ id: "c" + href, group: "고객 사이트", title: label, sub: desc, run: go(href) }),
    );
    if (canSeeAx) {
      // 사이드바와 같은 분류를 그대로 사용한다
      AX_MENU_GROUPS.forEach((g) =>
        g.items
          .filter((m) => !m.ceoOnly || role !== "staff")
          .forEach((m) =>
            out.push({ id: "a" + m.href, group: `AX · ${g.label}`, title: m.label, sub: m.desc, run: go(m.href) }),
          ),
      );
      projects.forEach((p) =>
        out.push({
          id: "p" + p.id,
          group: "진행 프로젝트",
          title: `${p.client} · ${p.name}`,
          sub: `${p.stage} · 납기 ${p.deadline}`,
          keywords: p.category + p.owner,
          run: go("/ax/pipeline"),
        }),
      );
    }
    portfolio.forEach((w) =>
      out.push({
        id: "w" + w.id,
        group: "포트폴리오",
        title: w.title,
        sub: `${w.client} · ${w.year}`,
        keywords: w.category + w.scope.join(""),
        run: go(`/portfolio/${w.id}`),
      }),
    );

    // 향후 확장 — 클릭하면 미리보기 시트가 열린다 (404로 보내지 않는다)
    const openFuture = (m: FutureMenu) => () =>
      window.dispatchEvent(new CustomEvent("shine-future", { detail: m }));
    FUTURE_MENUS.forEach((m) =>
      out.push({
        id: "f" + m.id,
        group: "향후 확장 · 고객",
        title: m.label,
        sub: `${m.tier} · ${m.desc}`,
        keywords: "future 확장 " + m.features.join(""),
        run: openFuture(m),
      }),
    );
    if (canSeeAx) {
      AX_FUTURE.forEach((m) =>
        out.push({
          id: "af" + m.id,
          group: "향후 확장 · AX",
          title: m.label,
          sub: `${m.tier} · ${m.desc}`,
          keywords: "future 확장 " + m.features.join(""),
          run: openFuture(m),
        }),
      );
    }

    // 실행 액션
    out.push({
      id: "act-demo",
      group: "실행",
      title: "시연 모드 시작",
      sub: "10단계 Guided Product Demo",
      keywords: "presentation demo 발표",
      run: () => window.dispatchEvent(new Event("shine-presentation")),
    });
    if (canSeeAx) {
      out.push({
        id: "act-tutorial",
        group: "실행",
        title: "튜토리얼 다시 보기",
        sub: "AX 4단계 가이드",
        keywords: "tutorial 가이드",
        run: () => {
          router.push("/ax");
          setTimeout(() => window.dispatchEvent(new Event("shine-tutorial")), 350);
        },
      });
      THEMES.forEach((t) =>
        out.push({
          id: "theme-" + t.id,
          group: "테마 변경",
          title: t.name,
          sub: theme === t.id ? "사용 중" : "적용하기",
          keywords: "theme 색상 " + t.id,
          run: () => setTheme(t.id),
        }),
      );
    }
    return out;
  }, [projects, canSeeAx, router, setTheme, theme]);

  const filtered = useMemo(() => {
    const list = items.filter((it) => match(it.title + (it.sub ?? "") + (it.keywords ?? ""), q));
    return list.slice(0, 40);
  }, [items, q]);

  useEffect(() => setActive(0), [q]);

  // 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const choose = (i: number) => {
    const it = filtered[i];
    if (!it) return;
    close();
    setTimeout(it.run, 10);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  };

  // 선택 항목이 보이도록 스크롤
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // 팔레트가 닫혀 있어도 향후 확장 시트는 떠 있어야 한다
  if (!open) return future ? <FutureSheet menu={future} onClose={() => setFuture(null)} /> : null;

  let lastGroup = "";

  return createPortal(
    <div className="fixed inset-0 z-[140] flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="전역 검색">
      <div className="absolute inset-0 bg-black/55" onClick={close} aria-hidden />
      <div className="anim-sheet relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="메뉴, 프로젝트, 포트폴리오 검색…"
            aria-label="검색어"
            className="w-full bg-transparent py-4 text-[0.9375rem] text-ink outline-none placeholder:text-muted"
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-[0.6875rem] text-muted sm:block">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2 scrollbar-thin">
          {filtered.length === 0 && (
            <p className="px-3 py-10 text-center t-body">
              &lsquo;{q}&rsquo;에 대한 결과가 없습니다.
              <br />
              <span className="t-meta">기관명·프로젝트명·메뉴 이름으로 찾아보세요.</span>
            </p>
          )}
          {filtered.map((it, i) => {
            const showGroup = it.group !== lastGroup;
            lastGroup = it.group;
            return (
              <React.Fragment key={it.id}>
                {showGroup && (
                  <p className="px-3 pb-1 pt-3 text-[0.6875rem] font-bold tracking-wide text-muted">{it.group}</p>
                )}
                <button
                  data-idx={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left ${
                    i === active ? "bg-soft" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{it.title}</span>
                    {it.sub && <span className="block truncate t-meta">{it.sub}</span>}
                  </span>
                  {i === active && <span className="shrink-0 text-[0.6875rem] font-bold text-accent">Enter ↵</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 t-meta">
          <span>↑↓ 이동 · Enter 열기</span>
          <span className="hidden sm:block">⌘K / Ctrl+K 로 언제든 열기</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** 헤더에 놓는 검색 트리거 버튼 */
export function PaletteButton({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("shine-palette"))}
      aria-label="검색 열기 (Ctrl+K)"
      className={`tap flex items-center gap-2 rounded-lg ${compact ? "p-2" : "px-3 py-2"} ${
        dark ? "text-nav-inactive hover:bg-white/10 hover:text-nav-active" : "text-muted hover:bg-soft hover:text-ink"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      {!compact && (
        <>
          <span className="hidden text-sm md:block">검색</span>
          <kbd className={`hidden rounded border px-1.5 py-0.5 text-[0.625rem] lg:block ${dark ? "border-white/25" : "border-line"}`}>
            ⌘K
          </kbd>
        </>
      )}
    </button>
  );
}
