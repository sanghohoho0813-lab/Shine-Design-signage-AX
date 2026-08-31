"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* 이벤트 기반 토스트. 사용: toast("문의가 접수되었습니다") */
export function toast(message: string, tone: "ok" | "info" = "ok") {
  window.dispatchEvent(new CustomEvent("shine-toast", { detail: { message, tone } }));
}

interface ToastItem {
  id: number;
  message: string;
  tone: "ok" | "info";
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = (e: Event) => {
      const { message, tone } = (e as CustomEvent).detail;
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs.slice(-2), { id, message, tone }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 2800);
    };
    window.addEventListener("shine-toast", on);
    return () => window.removeEventListener("shine-toast", on);
  }, []);

  if (!mounted || items.length === 0) return null;
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[130] flex flex-col items-center gap-2" role="status" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className="anim-toast pointer-events-auto flex items-center gap-2 rounded-full bg-shell/95 py-2 pl-3 pr-4 text-[13px] font-medium text-nav-primary shadow-xl backdrop-blur"
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: t.tone === "ok" ? "var(--ic-evidence)" : "var(--accent)", color: "#fff" }}
            aria-hidden
          >
            {t.tone === "ok" ? "✓" : "i"}
          </span>
          {t.message}
        </div>
      ))}
    </div>,
    document.body,
  );
}
