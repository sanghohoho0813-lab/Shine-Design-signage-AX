"use client";

import React, { useMemo, useState } from "react";
import { BUSINESS_RECORDS, RECORD_TOTAL } from "@/lib/records";

/* ---------------------------------------------------------------------------
   수행 실적 전체 — 지명원 기업실적 페이지를 그대로 검색 가능하게 옮긴 것.
   발주 담당자가 "우리 같은 기관을 해봤나"를 30초 안에 확인하는 화면이다.
--------------------------------------------------------------------------- */

const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");

/** 검색어 위치를 표시해 왜 걸렸는지 보이게 한다 */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const nt = norm(text);
  const nq = norm(q);
  const at = nt.indexOf(nq);
  if (at < 0) return <>{text}</>;
  // 공백 제거 인덱스를 원문 인덱스로 되돌린다
  let seen = 0;
  let start = -1;
  let end = text.length;
  for (let i = 0; i < text.length; i++) {
    if (!/\s/.test(text[i])) {
      if (seen === at) start = i;
      if (seen === at + nq.length - 1) {
        end = i + 1;
        break;
      }
      seen++;
    }
  }
  if (start < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded bg-accent/25 px-0.5 text-ink">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

export default function RecordsList() {
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<string>("전체");

  const groups = useMemo(() => {
    return BUSINESS_RECORDS.map((g) => ({
      period: g.period,
      items: g.items.filter((i) => !q || norm(i).includes(norm(q))),
    })).filter((g) => (period === "전체" || g.period === period) && g.items.length > 0);
  }, [q, period]);

  const hits = groups.reduce((n, g) => n + g.items.length, 0);

  const QUICK = ["도로교통공단", "병원", "법원", "경찰", "도서관", "대학", "장애인"];

  return (
    <div>
      {/* 검색 */}
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 shadow-sm focus-within:border-accent">
        <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="기관명으로 검색 (예: 도로교통공단, 병원, 법원)"
          aria-label="수행 실적 검색"
          className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted"
        />
        {q && (
          <button onClick={() => setQ("")} className="tap shrink-0 rounded-full p-1 text-muted hover:bg-soft hover:text-ink" aria-label="검색어 지우기">
            ✕
          </button>
        )}
      </div>

      {/* 자주 찾는 키워드 */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="t-meta mr-1">자주 찾는 검색</span>
        {QUICK.map((k) => (
          <button
            key={k}
            onClick={() => setQ(q === k ? "" : k)}
            className={`tap rounded-full px-3 py-1 text-xs font-medium ${
              q === k ? "bg-shell text-white" : "border border-line bg-surface text-ink-2 hover:bg-soft"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* 기간 필터 */}
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="기간 필터">
        {["전체", ...BUSINESS_RECORDS.map((g) => g.period)].map((p) => {
          const n = p === "전체" ? RECORD_TOTAL : BUSINESS_RECORDS.find((g) => g.period === p)!.items.length;
          return (
            <button
              key={p}
              role="tab"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              className={`tap flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                period === p ? "bg-shell text-white shadow" : "border border-line bg-surface text-ink-2 hover:bg-soft"
              }`}
            >
              {p}
              <span className={`text-[0.6875rem] tabular-nums ${period === p ? "text-accent" : "text-muted"}`}>{n}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 t-meta">
        {q ? `'${q}' 검색 결과` : "표시 중"} <b className="text-ink-2">{hits}건</b>
        {q && <span> · 전체 {RECORD_TOTAL}건 중</span>}
      </p>

      {/* 목록 */}
      <div className="mt-4 space-y-6">
        {groups.map((g) => (
          <div key={g.period}>
            <div className="sticky top-16 z-10 -mx-1 flex items-baseline gap-2 bg-canvas/95 px-1 py-2 backdrop-blur">
              <h3 className="text-sm font-black tabular-nums text-accent">{g.period}</h3>
              <span className="t-meta">{g.items.length}건</span>
            </div>
            <ul className="grid gap-x-6 gap-y-0 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((it) => (
                <li key={it} className="flex gap-2.5 border-b border-line/70 py-2.5 text-[0.875rem] leading-snug text-ink-2">
                  <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span className="min-w-0">
                    <Highlight text={it} q={q} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {hits === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface py-14 text-center">
          <p className="t-h3 text-ink">검색 결과가 없습니다</p>
          <p className="mx-auto mt-2 max-w-sm t-body">
            &lsquo;{q}&rsquo;와 일치하는 실적을 찾지 못했습니다. 기관 종류(병원·법원·도서관)로 넓혀 검색해 보세요.
          </p>
          <button
            onClick={() => {
              setQ("");
              setPeriod("전체");
            }}
            className="tap btn btn-ghost btn-sm mt-5"
          >
            검색 초기화
          </button>
        </div>
      )}
    </div>
  );
}
