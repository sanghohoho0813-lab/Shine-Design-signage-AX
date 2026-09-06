"use client";

import React, { useState } from "react";
import { useApp, ACTION_LABELS, type ActionState } from "@/lib/store";
import { toast } from "../Toast";

/* ---------------------------------------------------------------------------
   Action Lifecycle (v3.0 inherited §22)
   추천됨 → 확인 → 실행중 → 완료 / 보류 / 무시(사유)
   추천을 보여주고 끝나지 않고 "무엇을 했는지"가 남아야 Evidence가 된다.
--------------------------------------------------------------------------- */

const FLOW: ActionState[] = ["confirmed", "doing", "done"];

const TONE: Record<ActionState, string> = {
  todo: "var(--muted)",
  confirmed: "var(--ic-overview)",
  doing: "var(--ic-sales)",
  done: "var(--ic-evidence)",
  hold: "var(--ic-system)",
  skip: "var(--muted)",
};

export function ActionStatePill({ state }: { state: ActionState }) {
  return (
    <span
      className="rounded-md px-1.5 py-0.5 text-[0.625rem] font-bold"
      style={{ color: TONE[state], background: `color-mix(in srgb, ${TONE[state]} 12%, transparent)` }}
    >
      {ACTION_LABELS[state]}
    </span>
  );
}

/** 한 Action의 상태를 바꾸는 컨트롤 — 목록 한 줄에 들어갈 만큼 작다 */
export function ActionStateControl({ id, compact = false }: { id: string; compact?: boolean }) {
  const { actionStates, setActionState } = useApp();
  const rec = actionStates[id];
  const state: ActionState = rec?.state ?? "todo";
  const [more, setMore] = useState(false);

  const set = (s: ActionState, reason?: string) => {
    setActionState(id, s, reason);
    setMore(false);
    toast(`${ACTION_LABELS[s]} 처리됨`);
  };

  const skipWithReason = () => {
    const reason = window.prompt("무시하는 이유를 짧게 남겨 주세요 (선택)", rec?.reason ?? "");
    if (reason === null) return;
    set("skip", reason.trim() || undefined);
  };

  const holdWithReason = () => {
    const reason = window.prompt("보류 사유 (선택)", rec?.reason ?? "");
    if (reason === null) return;
    set("hold", reason.trim() || undefined);
  };

  const next: ActionState | null =
    state === "todo" ? "confirmed" : state === "confirmed" ? "doing" : state === "doing" ? "done" : null;

  return (
    <div className="relative flex items-center gap-1">
      <ActionStatePill state={state} />
      {next && (
        <button
          onClick={() => set(next)}
          className="tap rounded-md border border-line px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-2 hover:bg-soft"
          aria-label={`${ACTION_LABELS[next]}(으)로 변경`}
        >
          {compact ? "→" : `→ ${ACTION_LABELS[next]}`}
        </button>
      )}
      {(state === "done" || state === "hold" || state === "skip") && (
        <button
          onClick={() => set("todo")}
          className="tap rounded-md border border-line px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-2 hover:bg-soft"
          aria-label="추천됨으로 되돌리기"
        >
          되돌림
        </button>
      )}
      <button
        onClick={() => setMore((v) => !v)}
        className="tap rounded-md px-1.5 py-0.5 text-[0.75rem] font-black text-muted hover:bg-soft hover:text-ink"
        aria-label="보류 / 무시"
        aria-expanded={more}
      >
        ⋯
      </button>
      {more && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-line bg-surface p-1.5 shadow-xl">
          <p className="px-2 pb-1 pt-0.5 text-[0.625rem] font-bold text-muted">지금 하지 않는다면</p>
          <button onClick={holdWithReason} className="tap block w-full rounded-lg px-2 py-1.5 text-left text-xs text-ink-2 hover:bg-soft">
            보류 <span className="text-muted">— 나중에</span>
          </button>
          <button onClick={skipWithReason} className="tap block w-full rounded-lg px-2 py-1.5 text-left text-xs text-ink-2 hover:bg-soft">
            무시 <span className="text-muted">— 사유 기록</span>
          </button>
          {FLOW.filter((s) => s !== state).length > 0 && (
            <>
              <div className="my-1 h-px bg-line" />
              {FLOW.map((s) => (
                <button key={s} onClick={() => set(s)} className="tap block w-full rounded-lg px-2 py-1.5 text-left text-xs text-ink-2 hover:bg-soft">
                  {ACTION_LABELS[s]}(으)로 표시
                </button>
              ))}
            </>
          )}
        </div>
      )}
      {rec?.reason && (state === "skip" || state === "hold") && (
        <span className="ml-1 hidden max-w-[10rem] truncate text-[0.625rem] text-muted sm:inline" title={rec.reason}>
          · {rec.reason}
        </span>
      )}
    </div>
  );
}
