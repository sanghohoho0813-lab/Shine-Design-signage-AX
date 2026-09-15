/* ---------------------------------------------------------------------------
   Evidence Log — 사람이 무엇을 했는지가 시간순으로 남는다 (v3.0 §9).
   화면(증빙 페이지)과 내보내기(CSV)가 같은 함수를 쓴다.
--------------------------------------------------------------------------- */
import type { ActionRecord, BaselineSnapshot, BidRecord, Inquiry } from "./store";
import { ACTION_LABELS } from "./store";

export type EvidenceType = "RESULT" | "ACTION" | "RISK" | "CUSTOMER" | "BASELINE" | "BID";
export interface EvidenceItem {
  type: EvidenceType;
  at: string;
  note: string;
}

export const EVIDENCE_TYPES: EvidenceType[] = ["BASELINE", "ACTION", "RESULT", "CUSTOMER", "BID", "RISK"];

export function buildEvidence(input: {
  actionStates: Record<string, ActionRecord>;
  inquiries: Inquiry[];
  baselines: BaselineSnapshot[];
  bidStates: Record<string, BidRecord>;
  bidName?: (id: string) => string;
}): EvidenceItem[] {
  const out: EvidenceItem[] = [];
  Object.entries(input.actionStates).forEach(([id, r]) => {
    if (r.state === "todo") return;
    out.push({
      type: r.state === "done" ? "RESULT" : r.state === "skip" || r.state === "hold" ? "RISK" : "ACTION",
      at: r.at,
      note: `${id.replace(/^engine-/, "엔진 ").replace(/^risk-/, "리스크 ").replace(/^mg-/, "Margin ").replace(/^qc-/, "검수 ").replace(/^inq-/, "문의 ").replace(/^bid-/, "입찰 ")} → ${ACTION_LABELS[r.state]}${r.reason ? ` (${r.reason})` : ""}`,
    });
  });
  input.inquiries.forEach((q) =>
    (q.statusLog ?? [{ status: q.axStatus, at: q.createdAt }]).forEach((l) =>
      out.push({ type: "CUSTOMER", at: l.at, note: `문의 ${q.id.toUpperCase()} · ${q.clientType} · ${l.status}` }),
    ),
  );
  input.baselines.forEach((b) =>
    out.push({
      type: "BASELINE",
      at: b.at,
      note: `Baseline 스냅샷 (${b.stage})${b.note ? ` — ${b.note}` : ""} · ${Object.entries(b.values).map(([k, v]) => `${k}=${v}`).join(", ")}`,
    }),
  );
  Object.entries(input.bidStates).forEach(([id, b]) =>
    b.log.forEach((l) =>
      out.push({
        type: "BID",
        at: l.at,
        note: `입찰 ${input.bidName ? input.bidName(id) : id} → ${l.status}${l.status === b.result && b.note ? ` (${b.note})` : ""}`,
      }),
    ),
  );
  out.sort((a, b) => (a.at < b.at ? 1 : -1));
  return out;
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

/** Evidence Log + KPI 현재값을 CSV 텍스트로. 엑셀에서 한글이 깨지지 않게 BOM을 붙인다 */
export function evidenceCsv(items: EvidenceItem[], kpi: { name: string; value: string; stage: string }[]): string {
  const lines = ["\ufefftype,at,note"];
  items.forEach((e) => lines.push([e.type, e.at, e.note].map(csvCell).join(",")));
  lines.push("");
  lines.push("kpi,value,stage");
  kpi.forEach((k) => lines.push([k.name, k.value, k.stage].map(csvCell).join(",")));
  return lines.join("\n");
}
