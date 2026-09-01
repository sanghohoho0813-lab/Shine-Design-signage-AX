"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Overlay } from "./Overlay";
import { useApp } from "@/lib/store";

/* ---------------------------------------------------------------------------
   Device Preview (v1.1 Device Preview Safety Contract)
   - Desktop shows only "모바일 보기"; mobile shows only "PC 보기"
   - Same route / same data (same-origin iframe shares localStorage state)
   - No preview inside preview (hidden when embedded); clear escape path
--------------------------------------------------------------------------- */

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export function DevicePreviewButton({ dark = false }: { dark?: boolean }) {
  const { isEmbedded } = useApp();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (isEmbedded || isDesktop === null) return null;

  const label = isDesktop ? "모바일 보기" : "PC 보기";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`tap whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium ${
          dark
            ? "text-nav-inactive hover:bg-white/10 hover:text-nav-active"
            : "text-muted hover:bg-soft hover:text-ink"
        }`}
        aria-label={`${label} — 현재 화면을 다른 기기 크기로 미리보기`}
      >
        <span aria-hidden className="mr-1">{isDesktop ? "📱" : "🖥"}</span>
        {label}
      </button>
      {open && <PreviewModal desktop={!isDesktop} path={pathname} onClose={() => setOpen(false)} />}
    </>
  );
}

function PreviewModal({ desktop, path, onClose }: { desktop: boolean; path: string; onClose: () => void }) {
  // desktop=true → previewing PC layout from a mobile device
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!desktop) return;
    const update = () => setScale(Math.min((window.innerWidth - 24) / 1280, (window.innerHeight - 120) / 800, 1));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desktop]);

  const frameW = desktop ? 1280 : 390;
  const frameH = desktop ? 800 : 720;

  return (
    <Overlay onClose={onClose}>
      <div className="anim-sheet flex flex-col items-center gap-3 p-3">
        <div className="flex w-full items-center justify-between rounded-full bg-shell px-4 py-2 text-sm text-nav-primary">
          <span className="font-medium">{desktop ? "PC 미리보기" : "모바일 미리보기"} · 현재 화면 기준</span>
          <button
            onClick={onClose}
            className="tap rounded-full bg-white/10 px-3 py-1 text-xs text-nav-active hover:bg-white/20"
          >
            ✕ 닫기
          </button>
        </div>
        <div
          className="overflow-hidden rounded-[28px] border-[6px] border-shell bg-white shadow-2xl"
          style={
            desktop
              ? { width: frameW * scale, height: frameH * scale }
              : { width: frameW + 12, maxHeight: "78vh" }
          }
        >
          <iframe
            src={path}
            title="기기 미리보기"
            style={
              desktop
                ? { width: frameW, height: frameH, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }
                : { width: frameW, height: Math.min(frameH, typeof window !== "undefined" ? window.innerHeight * 0.78 : frameH), border: 0 }
            }
          />
        </div>
      </div>
    </Overlay>
  );
}
