"use client";

import React, { useState } from "react";
import { Overlay } from "../Overlay";
import { AI_ENGINES, METHOD_LABELS, LEVEL_LABELS, ERROR_COST_LABELS, type AiEngine } from "@/lib/ai";

/* ---------------------------------------------------------------------------
   AI Ready Marker (v3.0 inherited §16)
   배지를 누르면 "무엇을 보나요 / AI가 무엇을 하나요 / 왜 필요한가요 / 현재 MVP /
   향후" 를 그대로 보여준다. 모든 카드에 붙이지 않는다 — 엔진 5곳 + 설정.
--------------------------------------------------------------------------- */

export function AiReadyBadge({
  engineId,
  dark = false,
  compact = false,
}: {
  engineId?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const engine = AI_ENGINES.find((e) => e.id === engineId);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`tap inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold ${
          dark
            ? "bg-white/10 text-accent hover:bg-white/15"
            : "bg-[var(--ic-ai)]/12 text-[var(--ic-ai)] hover:bg-[var(--ic-ai)]/18"
        }`}
        aria-haspopup="dialog"
        title="이 기능의 AI 연결 상태 보기"
      >
        <span aria-hidden>✦</span>
        {compact ? "AI READY" : engine ? `AI READY · ${METHOD_LABELS[engine.method].split(" ")[0]} 기반` : "AI READY — 규칙 기반 Demo"}
      </button>
      {open && <AiReadyModal engine={engine} onClose={() => setOpen(false)} />}
    </>
  );
}

export function AiReadyModal({ engine, onClose }: { engine?: AiEngine; onClose: () => void }) {
  const list = engine ? [engine] : AI_ENGINES;
  return (
    <Overlay onClose={onClose} align="bottom" labelledBy="ai-ready-title">
      <div className="anim-sheet max-h-[88dvh] w-screen max-w-2xl overflow-y-auto rounded-t-2xl bg-surface p-6 pb-8 shadow-2xl sm:mx-4 sm:rounded-2xl sm:p-8">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="rounded-full bg-[var(--ic-ai)]/12 px-2.5 py-0.5 text-[0.6875rem] font-bold text-[var(--ic-ai)]">
            ✦ AI READY
          </span>
          <button onClick={onClose} className="tap -m-2 rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label="닫기">
            ✕
          </button>
        </div>
        <h3 id="ai-ready-title" className="text-xl font-bold text-ink">
          이 기능에는 AI API가 연결될 예정입니다
        </h3>
        <p className="mt-1.5 text-sm text-ink-2">
          지금은 <b className="text-ink">규칙 기반 계산</b>으로 돌아갑니다. 어떤 데이터를 보고, 무엇을 해주고, 왜
          필요한지는 지금과 같습니다 — 뒤에 붙는 엔진만 달라집니다.
        </p>

        <div className="mt-5 space-y-4">
          {list.map((e) => (
            <section key={e.id} className="rounded-xl border border-line bg-canvas p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-ink">{e.name}</h4>
                <Tag>{METHOD_LABELS[e.method]}</Tag>
                <Tag>{LEVEL_LABELS[e.level]}</Tag>
                <Tag tone={e.errorCost === "HIGH" ? "risk" : e.errorCost === "MID" ? "warn" : "ok"}>
                  오류비용 {ERROR_COST_LABELS[e.errorCost].split(" ")[0]}
                </Tag>
              </div>
              <p className="mt-1.5 text-sm italic text-ink-2">&ldquo;{e.question}&rdquo;</p>

              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <Block label="무엇을 보나요?" items={e.inputs} />
                <Block label="AI가 무엇을 하나요?" items={e.does} />
              </dl>
              <p className="mt-3 text-sm text-ink-2">
                <b className="text-ink">왜 필요한가요?</b> {e.why}
              </p>
              <p className="mt-2 text-xs text-ink-2">
                <b className="text-ink">승인 규칙</b> · {e.approval}
              </p>

              <div className="mt-3 grid gap-2 rounded-lg bg-surface p-3 text-xs sm:grid-cols-2">
                <p>
                  <span className="font-bold text-[var(--ic-evidence)]">현재 MVP</span>
                  <span className="mt-0.5 block text-ink-2">{e.now}</span>
                </p>
                <p>
                  <span className="font-bold text-[var(--ic-ai)]">향후</span>
                  <span className="mt-0.5 block text-ink-2">{e.next}</span>
                </p>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          현재 MVP: 규칙 기반 계산 · 향후: GPT / Claude 등 LLM API 연결 가능. 오류비용이 높은 판단(견적 확정·계약)은
          어떤 단계에서도 사람이 승인합니다.
        </p>
      </div>
    </Overlay>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone?: "risk" | "warn" | "ok" }) {
  const color = tone === "risk" ? "var(--ic-risk)" : tone === "warn" ? "var(--ic-sales)" : tone === "ok" ? "var(--ic-evidence)" : "var(--ink-2)";
  return (
    <span
      className="rounded-md px-1.5 py-0.5 text-[0.625rem] font-semibold"
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      {children}
    </span>
  );
}

function Block({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <dt className="text-[0.6875rem] font-bold tracking-wide text-muted">{label}</dt>
      <dd className="mt-1">
        <ul className="space-y-1">
          {items.map((i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-2">
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}
