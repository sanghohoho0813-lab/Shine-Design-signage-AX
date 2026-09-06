/* ---------------------------------------------------------------------------
   AI METHOD MATRIX (Unified v3.0 §6)

   AI 기능 개수를 목표로 하지 않는다. 각 엔진이 어떤 방법(RULE / LLM …)으로,
   어느 자동화 수준(L1~L4)에서, 어떤 오류비용을 갖고 돌아가는지를 코드로 고정한다.
   화면의 "AI READY" 배지·모달, 설정 > AI, PROJECT_SPEC의 표가 모두 이 파일을 읽는다.
   → 규칙이면 규칙이라고 말한다. 근거 없는 "AI가 추천했습니다"는 없다.
--------------------------------------------------------------------------- */

export type AiMethod = "RULE" | "OPTIMIZATION" | "ML" | "RAG" | "LLM" | "HUMAN";
export type AutomationLevel = "L1" | "L2" | "L3" | "L4";
export type ErrorCost = "LOW" | "MID" | "HIGH";

export const METHOD_LABELS: Record<AiMethod, string> = {
  RULE: "규칙 (조건·수식·기준값)",
  OPTIMIZATION: "최적화 (일정·조합)",
  ML: "통계·예측",
  RAG: "문서 근거 검색 (RAG)",
  LLM: "자연어 요약·작성 (LLM)",
  HUMAN: "사람 판단",
};

export const LEVEL_LABELS: Record<AutomationLevel, string> = {
  L1: "L1 정보·정리",
  L2: "L2 추천",
  L3: "L3 준비 + 사람 승인",
  L4: "L4 자동 실행",
};

export const ERROR_COST_LABELS: Record<ErrorCost, string> = {
  LOW: "낮음 — 잘못돼도 바로 고침",
  MID: "중간 — 비용·고객경험 영향",
  HIGH: "높음 — 금전·계약·신용",
};

export interface AiEngine {
  id: string;
  name: string;
  /** 사업 질문 — 이 엔진이 답하는 한 문장 */
  question: string;
  /** 지금 무엇을 보나요 */
  inputs: string[];
  /** 무엇을 해주나요 */
  does: string[];
  /** 왜 필요한가요 */
  why: string;
  method: AiMethod;
  level: AutomationLevel;
  errorCost: ErrorCost;
  approval: string;
  /** 현재 MVP에서 실제로 돌아가는 계산 */
  now: string;
  /** 향후 LLM/ML을 붙이면 달라지는 것 */
  next: string;
  /** 이 엔진의 결과가 남기는 Evidence */
  evidence: string;
}

export const AI_ENGINES: AiEngine[] = [
  {
    id: "risk",
    name: "Project Risk",
    question: "이번 주 어떤 프로젝트가 설치일을 놓칠 위험이 있는가?",
    inputs: ["프로젝트 단계", "납기일", "승인 지연 일수", "파트너 납기", "검수 상태"],
    does: ["납기까지 남은 일수와 단계 지연을 함께 읽어 위험도를 높음·보통·낮음으로 나눔", "가장 급한 순서로 정렬", "다음 행동(승인 독촉·파트너 확인)을 붙임"],
    why: "대표가 프로젝트 8~10건의 일정을 머릿속으로 비교하다 놓치는 것을 막기 위해.",
    method: "RULE",
    level: "L2",
    errorCost: "MID",
    approval: "추천만 — 일정 변경·발주는 사람이 결정",
    now: "납기 D-day, 단계별 지연, 파트너 납기 임박 여부를 기준값으로 채점",
    next: "LLM이 리스크 사유를 발주처 회신 메일 초안으로 정리",
    evidence: "RISK / ACTION — 어떤 경고가 떴고 무엇을 했는지",
  },
  {
    id: "margin",
    name: "Margin Guard",
    question: "이 견적을 이대로 내면 남는가?",
    inputs: ["견적 금액", "원가 7항목(디자인·자재·OEM·직접제작·운송·설치·기타)", "목표 Margin 30%"],
    does: ["예상 Margin을 계산해 양호·주의·위험으로 표시", "OEM 비중이 50%를 넘으면 파트너 견적 변동 위험을 알림", "설치비 누락 같은 견적 구멍을 잡음"],
    why: "견적서를 낸 뒤에야 원가가 드러나 손해를 보는 일을 없애기 위해.",
    method: "RULE",
    level: "L2",
    errorCost: "HIGH",
    approval: "견적 확정은 대표만 — 화면은 경고만 한다",
    now: "(견적 − 원가합계) ÷ 견적 × 100, 항목별 비중 계산",
    next: "과거 프로젝트 원가 실적으로 항목별 예상 원가를 통계적으로 추정",
    evidence: "EFFICIENCY / REVENUE — 경고 후 견적이 어떻게 바뀌었는지",
  },
  {
    id: "bid",
    name: "Bid Readiness",
    question: "이 입찰에 지금 들어가면 서류가 되는가?",
    inputs: ["보유 자격 8종", "서류 체크리스트", "유사실적 337건", "마감일"],
    does: ["체크리스트 완료율로 준비도 %를 산출", "유사실적 매칭 정도를 높음·보통·낮음으로 표시", "부족한 서류를 먼저 보여줌"],
    why: "마감 직전에 빠진 서류를 발견하는 일을 없애기 위해.",
    method: "RULE",
    level: "L2",
    errorCost: "MID",
    approval: "입찰 참여 결정은 사람 — 준비도는 참고값",
    now: "완료 항목 ÷ 전체 항목, 발주처 유형별 실적 키워드 매칭",
    next: "나라장터 공고문을 읽고(RAG) 요구 서류와 보유 서류를 자동 대조",
    evidence: "ACTION / RESULT — 준비도 변화와 입찰 결과",
  },
  {
    id: "next",
    name: "Next Action",
    question: "오늘 무엇부터 해야 하는가?",
    inputs: ["신규 문의", "검수 대기", "Margin 미달", "입찰 마감", "리스크 프로젝트"],
    does: ["여러 화면에 흩어진 할 일을 한 목록으로 모음", "급한 순서로 정렬", "각 항목을 해당 화면으로 바로 연결"],
    why: "아침에 어느 화면부터 열지 고민하는 시간을 없애기 위해.",
    method: "RULE",
    level: "L2",
    errorCost: "LOW",
    approval: "확인·실행·완료·보류·무시는 사람이 기록",
    now: "조건별 수집 → 우선순위 정렬 → 상태 기록(Action Lifecycle)",
    next: "LLM이 대표 말투로 아침 브리핑 문장을 작성",
    evidence: "ADOPTION — 추천된 Action 중 확인·실행된 비율",
  },
];

/** 규칙 기반 엔진 수 / 총 엔진 수 — 설정 화면 요약용 */
export const AI_SUMMARY = {
  total: AI_ENGINES.length,
  rule: AI_ENGINES.filter((e) => e.method === "RULE").length,
  llmConnected: 0,
};
