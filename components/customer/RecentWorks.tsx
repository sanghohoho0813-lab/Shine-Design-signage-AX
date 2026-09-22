"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { portfolio } from "@/lib/data";
import { track } from "@/lib/events";

/* ---------------------------------------------------------------------------
   Customer Data Loop (Platform v2.5 §24) — 최소 하나의 고객 행동을 기록한다.
   "최근 본 프로젝트": 상세 페이지를 열면 기록되고, 목록 상단에 다시 뜬다.
   로그인 없이 브라우저 안에서만 동작하는 Demo Store.
--------------------------------------------------------------------------- */

const KEY = "shine-recent-works";
const MAX = 6;

export function RecentTracker({ id }: { id: string }) {
  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
      const next = [id, ...list.filter((x) => x !== id)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    track("view_portfolio_item", { id });
  }, [id]);
  return null;
}

export function RecentWorks({ excludeId }: { excludeId?: string }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
  }, []);
  const items = ids
    .filter((i) => i !== excludeId)
    .map((i) => portfolio.find((p) => p.id === i))
    .filter(Boolean) as typeof portfolio;
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-bold tracking-wide text-muted">최근 본 프로젝트</p>
        <button
          onClick={() => {
            try {
              localStorage.removeItem(KEY);
            } catch {}
            setIds([]);
          }}
          className="tap tap-pad text-[0.6875rem] text-muted hover:text-ink"
        >
          지우기
        </button>
      </div>
      <div className="mt-2 flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/portfolio/${p.id}`}
            className="tap hover-lift flex w-52 shrink-0 items-center gap-2.5 rounded-xl border border-line bg-surface p-2 shadow-sm"
          >
            <img src={p.image} alt="" aria-hidden className="h-12 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold text-ink">{p.title}</span>
              <span className="block truncate text-[0.6875rem] text-muted">{p.client}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
