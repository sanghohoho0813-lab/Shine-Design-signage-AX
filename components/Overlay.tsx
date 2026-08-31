"use client";

import React, { useEffect } from "react";
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
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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
