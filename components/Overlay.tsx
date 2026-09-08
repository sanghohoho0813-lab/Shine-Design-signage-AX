"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/* ---------------------------------------------------------------------------
   Overlay base — backdrop + ESC + scroll lock, with guaranteed cleanup
   (v1.1 Overlay Lifecycle: no ghost backdrop / pointer-events / scroll lock)
--------------------------------------------------------------------------- */

export function Overlay({
  onClose,
  children,
  align = "center",
  labelledBy,
}: {
  onClose: () => void;
  children: React.ReactNode;
  align?: "center" | "bottom" | "left" | "right";
  labelledBy?: string;
}) {
  // onClose는 ref로 — 부모가 재렌더되어 함수 참조가 바뀌어도 effect가 다시 돌지 않게 한다.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 열기 전 포커스를 기억했다가 닫힐 때 되돌린다 (v3.0 Q-4 Focus restoration)
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    /* Browser Back safety — 히스토리에 항목을 쌓지 않는다(Next 라우터와 충돌).
       대신 뒤로가기(popstate)가 오면 즉시 닫아 백드롭·스크롤 잠금이 남지 않게 한다. */
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      if (opener && typeof opener.focus === "function") setTimeout(() => opener.focus(), 0);
    };
  }, []);

  const alignCls =
    align === "bottom"
      ? "items-end justify-center"
      : align === "left"
        ? "items-stretch justify-start"
        : align === "right"
          ? "items-stretch justify-end"
          : "items-center justify-center";

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex ${alignCls} anim-fade`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="absolute inset-0 bg-black/55" onClick={onClose} aria-hidden />
      <div className="relative max-h-full overflow-auto">{children}</div>
    </div>,
    document.body,
  );
}
