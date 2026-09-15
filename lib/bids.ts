/* ---------------------------------------------------------------------------
   입찰 해석기 (v15) — 시드 4건 + 직접 등록한 입찰을 한 목록으로 만들고,
   서류 체크·상태·결과 기록을 덮어 씌운다. 준비도는 체크 기록이 있으면
   체크리스트 완료율로 다시 계산한다(규칙). 유사실적은 지명원 337건에서
   발주기관 이름의 토큰이 들어간 실적 수로 센다 — RULE, 근거는 건수다.
--------------------------------------------------------------------------- */
import { seedBids, type Bid, type BidChecklistItem } from "./data";
import { BUSINESS_RECORDS } from "./records";
import type { BidRecord, BidStatus, CustomBid } from "./store";

/** 회사 보유 자격 기준 기본 체크리스트 — 신규 입찰은 여기서 시작한다 */
export const BASE_CHECKLIST: BidChecklistItem[] = [
  { label: "사업자 기본서류 (2024.04 법인)", done: true },
  { label: "직접생산확인증명서 (7개 품목)", done: true },
  { label: "중소기업 확인서 (소기업)", done: true },
  { label: "여성기업 확인서 (~2027.06)", done: true },
  { label: "산업디자인전문회사 신고 (2024.07)", done: true },
  { label: "공장등록증 (2024.08)", done: true },
  { label: "옥외광고사업 등록 (2024.05)", done: true },
  { label: "창업기업 확인서 (~2027.08)", done: true },
  { label: "유사실적 증명 (도로교통공단 외)", done: false },
  { label: "포트폴리오", done: false },
  { label: "견적자료", done: false },
  { label: "제안자료", done: false },
];

const STOP = /^(주식회사|유한회사|재단법인|사단법인|국립|시립|도립|공단|공사|병원|시|군|구|청)$/;
/** 발주기관 이름에서 검색 토큰을 뽑는다 — 2글자 이상, 접미어 제거 */
export function institutionTokens(name: string): string[] {
  const raw = name.replace(/[()\[\]·,]/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  raw.forEach((w) => {
    const t = w.replace(/(공단|공사|병원|의료원|대학교|대학|연구소|연구원|시청|시의회|시|군|구|도)$/, "");
    if (t.length >= 2 && !STOP.test(t)) out.add(t);
    if (w.length >= 3 && !STOP.test(w)) out.add(w);
  });
  return [...out];
}

/** 유사실적 건수 — 지명원 실적 중 기관 토큰이 들어간 항목 수 */
export function similarRecords(institution: string): { count: number; sample: string[] } {
  const tokens = institutionTokens(institution);
  if (!tokens.length) return { count: 0, sample: [] };
  const hits: string[] = [];
  BUSINESS_RECORDS.forEach((g) => g.items.forEach((it) => tokens.some((t) => it.includes(t)) && hits.push(it)));
  return { count: hits.length, sample: hits.slice(0, 3) };
}

export function matchLevel(count: number): Bid["portfolioMatch"] {
  return count >= 5 ? "높음" : count >= 1 ? "보통" : "낮음";
}

export interface ResolvedBid extends Bid {
  custom: boolean;
  similar: number;
  record?: BidRecord;
}

export function resolveBids(customBids: CustomBid[], bidChecks: Record<string, Record<string, boolean>>, bidStates: Record<string, BidRecord>): ResolvedBid[] {
  const applyChecks = (id: string, base: BidChecklistItem[]) => {
    const m = bidChecks[id];
    return m ? base.map((c) => ({ ...c, done: m[c.label] ?? c.done })) : base;
  };
  const seed: ResolvedBid[] = seedBids.map((b) => {
    const checklist = applyChecks(b.id, b.checklist);
    const checked = !!bidChecks[b.id];
    const readiness = checked ? Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100) : b.readiness;
    return { ...b, checklist, readiness, status: bidStates[b.id]?.status ?? b.status, custom: false, similar: similarRecords(b.institution).count, record: bidStates[b.id] };
  });
  const custom: ResolvedBid[] = customBids.map((b) => {
    const checklist = applyChecks(b.id, BASE_CHECKLIST);
    const sim = similarRecords(b.institution);
    const readiness = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);
    const missing = checklist.filter((c) => !c.done).map((c) => c.label.split(" (")[0]);
    return {
      id: b.id,
      institution: b.institution,
      project: b.project,
      deadline: b.deadline,
      amount: b.amount,
      readiness,
      status: (bidStates[b.id]?.status ?? b.status) as BidStatus,
      portfolioMatch: matchLevel(sim.count),
      checklist,
      insight:
        (sim.count ? `지명원 실적 중 '${b.institution}' 관련 ${sim.count}건이 유사실적 후보입니다${sim.sample[0] ? ` (예: ${sim.sample[0]})` : ""}.` : `지명원 실적에서 '${b.institution}' 관련 건을 찾지 못했습니다 — 발주처 유형(의료·교육 등)별 실적으로 대체 매칭하세요.`) +
        (missing.length ? ` 미확인 서류 ${missing.length}건: ${missing.slice(0, 3).join(" · ")}${missing.length > 3 ? " 외" : ""}.` : " 서류가 모두 확인됐습니다."),
      custom: true,
      similar: sim.count,
      record: bidStates[b.id],
    };
  });
  return [...custom, ...seed];
}
