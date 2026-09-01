"use client";

import React, { useEffect, useRef } from "react";

/* Scroll reveal — IntersectionObserver 기반. reduced motion에선 CSS가 무효화. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

/* Count-up 숫자 — 최종값을 먼저 렌더하고(JS/관측 실패해도 값이 보인다)
   화면에 들어올 때만 0에서 애니메이션한다. */
export function CountUp({ value, suffix = "", duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const final = value.toLocaleString() + suffix;
    const reduced =
      document.documentElement.dataset.motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // 이미 최종값이 렌더되어 있다

    let done = false;
    const animate = () => {
      if (done) return;
      done = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(value * eased).toLocaleString() + suffix;
        if (k < 1) requestAnimationFrame(tick);
        else el.textContent = final;
      };
      requestAnimationFrame(tick);
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animate();
      return;
    }
    el.textContent = "0" + suffix;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animate();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 240px 0px" },
    );
    io.observe(el);
    // 관측이 끝내 발생하지 않아도 값이 0으로 남지 않도록 보정
    const guard = setTimeout(() => {
      if (!done) el.textContent = final;
    }, 1500);
    return () => {
      io.disconnect();
      clearTimeout(guard);
    };
  }, [value, suffix, duration]);
  return (
    <span ref={ref} className="tabular">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
