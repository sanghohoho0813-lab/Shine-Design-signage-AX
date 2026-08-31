"use client";

import { useEffect, useState } from "react";
import { Overlay } from "../Overlay";

/* 포트폴리오 상세 갤러리 — 클릭 시 라이트박스, ←/→ 탐색 */
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, images.length]);

  return (
    <>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {images.map((g, i) => (
          <button
            key={g}
            onClick={() => setIdx(i)}
            className="img-zoom tap group relative overflow-hidden rounded-xl border border-line text-left"
            aria-label={`${title} 현장 사진 ${i + 1} 크게 보기`}
          >
            <img src={g} alt={`${title} 현장 사진 ${i + 1}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <span className="absolute bottom-2 right-2 rounded-md bg-black/55 px-2 py-1 text-[0.6875rem] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              ⤢ 크게 보기
            </span>
          </button>
        ))}
      </div>

      {idx !== null && (
        <Overlay onClose={() => setIdx(null)}>
          <div className="anim-fade flex max-h-[90vh] flex-col items-center gap-3 p-4">
            <img
              src={images[idx]}
              alt={`${title} 현장 사진 ${idx + 1}`}
              className="max-h-[76vh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl"
            />
            <div className="flex items-center gap-3 rounded-full bg-shell/90 px-3 py-1.5 text-sm text-nav-primary backdrop-blur">
              <button
                onClick={() => setIdx((idx - 1 + images.length) % images.length)}
                className="tap rounded-full px-2.5 py-1 hover:bg-white/10"
                aria-label="이전 사진"
              >
                ←
              </button>
              <span className="tabular-nums text-xs text-nav-muted">
                {idx + 1} / {images.length}
              </span>
              <button
                onClick={() => setIdx((idx + 1) % images.length)}
                className="tap rounded-full px-2.5 py-1 hover:bg-white/10"
                aria-label="다음 사진"
              >
                →
              </button>
              <button onClick={() => setIdx(null)} className="tap rounded-full px-2.5 py-1 hover:bg-white/10" aria-label="닫기">
                ✕
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}
