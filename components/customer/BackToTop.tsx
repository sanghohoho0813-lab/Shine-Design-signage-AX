"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로"
      className="tap anim-fade fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/95 text-ink-2 shadow-lg backdrop-blur hover:bg-soft"
    >
      ↑
    </button>
  );
}
