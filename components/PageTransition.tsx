"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ---------------------------------------------------------------------------
   화면 전환 — 경로가 바뀌면 새 내용이 짧은 텀 뒤 부드럽게 나타난다.
   Motion 줄이기 / prefers-reduced-motion 에서는 애니메이션 없이 즉시 표시.
--------------------------------------------------------------------------- */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   상단 진행 바 — 링크를 누른 순간부터 새 화면이 그려질 때까지의 짧은 공백을
   시각적으로 메운다.
--------------------------------------------------------------------------- */
export function NavProgress() {
  const pathname = usePathname();
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // 내부 링크 클릭을 감지해 진행 바를 띄운다
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || a.target === "_blank") return;
      // 같은 경로면 전환이 없다
      if (href.split("#")[0] === pathname) return;

      clear();
      setShow(true);
      setP(12);
      timers.current.push(setTimeout(() => setP(48), 90));
      timers.current.push(setTimeout(() => setP(76), 260));
      timers.current.push(setTimeout(() => setP(88), 620));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  // 경로가 실제로 바뀌면 마무리
  useEffect(() => {
    if (!show) return;
    clear();
    setP(100);
    const t = setTimeout(() => {
      setShow(false);
      setP(0);
    }, 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clear, []);

  if (!show) return null;
  return (
    <div className="nav-progress" aria-hidden>
      <span style={{ ["--p" as string]: `${p}%`, opacity: p >= 100 ? 0 : 1 }} />
    </div>
  );
}
