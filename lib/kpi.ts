/* ---------------------------------------------------------------------------
   MONEY KPI CONTRACT (Unified v3.0 §4)

   Cost / Revenue / Scale 각 1개 이상. 실제 값이 없으면 BASELINE: UNKNOWN 으로 두고
   측정 지점만 정의한다. Demo 시드로 개선률을 지어내지 않는다 — 그것이 P0다.
--------------------------------------------------------------------------- */

export type KpiKind = "COST" | "REVENUE" | "SCALE";

export interface MoneyKpi {
  id: string;
  kind: KpiKind;
  name: string;
  /** 무엇을 재는지 한 문장 */
  definition: string;
  /** 어디에서 어떻게 측정하는지 */
  measurement: string;
  /** 현재 시스템에서 이 값이 나오는 화면 */
  screen: string;
  baseline: "UNKNOWN" | "MEASURING";
  /** Constraint와의 연결 */
  constraint: string;
}

export const MONEY_KPIS: MoneyKpi[] = [
  {
    id: "quote-lead",
    kind: "COST",
    name: "문의 → 견적 제출 소요일",
    definition: "고객 문의가 접수된 날부터 견적서를 보낸 날까지의 일수",
    measurement: "문의 statusLog[접수].at 과 파이프라인 '견적' 단계 진입 시각의 차이 — 파이프라인에서 자동 기록",
    screen: "프로젝트 관리 · 증빙",
    baseline: "UNKNOWN",
    constraint: "TIME LEAK — 견적·승인 대기",
  },
  {
    id: "margin-miss",
    kind: "COST",
    name: "목표 Margin(30%) 미달 견적 비율",
    definition: "제출 견적 중 예상 Margin이 30% 미만인 건의 비율",
    measurement: "견적·원가 관리에서 원가 7항목이 입력된 건 기준 자동 계산",
    screen: "견적·원가 관리",
    baseline: "UNKNOWN",
    constraint: "MONEY LEAK — 원가 누락·낮은 마진",
  },
  {
    id: "inquiry-conv",
    kind: "REVENUE",
    name: "문의 → 수주 전환율",
    definition: "접수된 문의 중 '승인' 단계 이상으로 진행된 비율",
    measurement: "fromInquiry 프로젝트 중 stage ≥ 승인 ÷ 전체 문의 — 파이프라인에서 자동",
    screen: "프로젝트 관리 · 대시보드",
    baseline: "UNKNOWN",
    constraint: "REVENUE LEAK — 문의 후 미전환",
  },
  {
    id: "bid-win",
    kind: "REVENUE",
    name: "입찰 참여 대비 낙찰률",
    definition: "제출한 입찰 중 낙찰된 비율",
    measurement: "입찰·제안 관리에서 상태 '제출' → 결과 입력 시 집계 (결과 입력 필드는 다음 단계)",
    screen: "입찰·제안 관리",
    baseline: "UNKNOWN",
    constraint: "REVENUE LEAK — 준비 부족으로 인한 미참여",
  },
  {
    id: "per-head",
    kind: "SCALE",
    name: "담당자 1인당 동시 관리 프로젝트 수",
    definition: "같은 인원으로 동시에 굴리는 진행 프로젝트 건수",
    measurement: "진행 프로젝트(완료 제외) ÷ 담당자 수 — 대시보드에서 자동",
    screen: "대시보드",
    baseline: "UNKNOWN",
    constraint: "SCALE — 인원을 늘리지 않고 처리량 확대",
  },
];

export const KPI_KIND_LABELS: Record<KpiKind, string> = {
  COST: "비용·시간",
  REVENUE: "매출·전환",
  SCALE: "규모·처리량",
};

/**
 * 현재 데이터에서 계산 가능한 값 — 시연용 현재값이며 Baseline이 아니다.
 * 화면에는 반드시 "현재값 (Demo)" 로 표기한다.
 */
export function kpiNow(
  projects: { stage: string; budget: number; costs?: unknown; fromInquiry?: boolean }[],
  inquiries: { id: string }[],
  marginOf: (p: never) => number | null,
) {
  const quoted = projects.filter((p) => p.costs);
  const low = quoted.filter((p) => {
    const m = marginOf(p as never);
    return m !== null && m < 30;
  }).length;
  const fromInq = projects.filter((p) => p.fromInquiry);
  const STAGE_ORDER = ["문의", "현장·요구사항", "디자인", "견적", "승인", "제작", "설치", "완료"];
  const converted = fromInq.filter((p) => STAGE_ORDER.indexOf(p.stage) >= 4).length;
  const active = projects.filter((p) => p.stage !== "완료").length;
  return {
    "margin-miss": quoted.length ? `${Math.round((low / quoted.length) * 100)}%` : "—",
    "inquiry-conv": inquiries.length ? `${Math.round((converted / Math.max(inquiries.length, 1)) * 100)}%` : "—",
    "per-head": `${(active / 3).toFixed(1)}건`,
    "quote-lead": "—",
    "bid-win": "—",
  } as Record<string, string>;
}
