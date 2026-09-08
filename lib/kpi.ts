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

/* ---------------------------------------------------------------------------
   UNIT ECONOMICS GATE (v3.0 §11) — 값이 아니라 측정 항목만 정의한다.
   실제 값은 PILOT 이후. "누가 무엇에 돈을 내는가"가 먼저다.
--------------------------------------------------------------------------- */
export const UNIT_ECONOMICS = [
  { q: "누가 돈을 내는가", a: "공공기관·병원·학교 등 발주처 (프로젝트 단위 계약)" },
  { q: "무엇에 돈을 내는가", a: "사인 설계·제작·설치 일괄 — 유지관리·CI 교체는 향후 반복 계약 후보" },
  { q: "반복매출 가능한가", a: "도로교통공단 57건처럼 같은 발주처의 다지점·다년 발주가 실제로 반복됨. 유지관리 계약(NEXT)이 정기화 경로" },
  { q: "고객 1개 늘 때 변동비", a: "자재·파트너 발주·설치 인건비. 설계·관리 인건비는 AX로 고정비화 — 측정: 프로젝트당 원가 7항목 합계" },
  { q: "CAC (측정 항목)", a: "문의 1건당 영업 소요시간 × 인건비 — 이벤트 start_inquiry→submit_inquiry, 응대 소요시간으로 측정" },
  { q: "Contribution Margin (측정 항목)", a: "(견적 − 원가 7항목) ÷ 견적 — 견적·원가 관리에서 건별 자동 계산" },
  { q: "LTV (측정 항목)", a: "발주처별 누적 프로젝트 수 × 평균 Margin — 실적 337건 + 파이프라인에서 발주처 키로 집계" },
  { q: "Payback (측정 항목)", a: "AX 구축·운영비 ÷ 월 Margin 개선분 — Baseline 확정 후에만 계산" },
] as const;

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
  projects: { stage: string; budget: number; costs?: unknown; fromInquiry?: boolean; stageLog?: { stage: string; at: string }[] }[],
  inquiries: { id: string }[],
  marginOf: (p: never) => number | null,
) {
  // 문의 → 견적 소요일: stageLog에 '문의'와 '견적' 진입 시각이 둘 다 있는 건만
  const leads = projects
    .map((p) => {
      const a = p.stageLog?.find((l) => l.stage === "문의")?.at;
      const b = p.stageLog?.find((l) => l.stage === "견적")?.at;
      return a && b ? (new Date(b).getTime() - new Date(a).getTime()) / 86400000 : null;
    })
    .filter((d): d is number => d !== null);
  const quoteLead = leads.length ? `${(leads.reduce((s, d) => s + d, 0) / leads.length).toFixed(1)}일` : "—";
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
    "quote-lead": quoteLead,
    "bid-win": "—",
  } as Record<string, string>;
}
