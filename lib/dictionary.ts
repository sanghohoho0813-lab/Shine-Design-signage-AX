/* ---------------------------------------------------------------------------
   DATA DICTIONARY / SSOT (Unified v3.0 §5.1)
   핵심 Entity마다 기준 데이터 위치·입력 주체·민감도·AI 사용 가능 여부를 한 곳에 둔다.
   설정 > 데이터 화면과 DATA_DICTIONARY.md 가 같은 표를 보여준다.
--------------------------------------------------------------------------- */

export interface EntityDef {
  entity: string;
  ko: string;
  /** System of Record — 지금(Demo)과 다음(실서비스) */
  sor: { now: string; next: string };
  writer: string;
  update: string;
  sensitivity: "낮음" | "보통" | "높음";
  retention: string;
  ai: "가능" | "집계만" | "불가";
  fields: { key: string; type: string; desc: string }[];
}

export const ENTITIES: EntityDef[] = [
  {
    entity: "Inquiry",
    ko: "고객 문의",
    sor: { now: "localStorage · shine-ax-state-v1.inquiries", next: "Supabase inquiries" },
    writer: "고객 (문의 양식)",
    update: "AX 담당자가 axStatus 변경",
    sensitivity: "높음",
    retention: "상담 종료 후 1년 (개인정보 최소 보관)",
    ai: "집계만",
    fields: [
      { key: "id", type: "string", desc: "접수번호 (q + base36 timestamp)" },
      { key: "clientType", type: "enum", desc: "공공기관 / 공기업 / 병원 / 학교 / 일반기업 / 상업시설 / 기타" },
      { key: "projectType", type: "enum", desc: "외부 간판 / 실내사인 / 안내·유도 / 종합 사인시스템 / 환경그래픽 / 제작·시공 / 디자인만" },
      { key: "status", type: "enum", desc: "초기 기획 / 예산 검토 / 설계 진행 중 / 발주 예정 / 입찰 예정 / 빠른 견적" },
      { key: "budget", type: "enum", desc: "예산 범위 (미정 허용)" },
      { key: "schedule", type: "string", desc: "희망 일정" },
      { key: "name / org / phone", type: "string", desc: "담당자 · 기관 · 연락처 — 민감" },
      { key: "axStatus", type: "enum", desc: "접수 → 검토중 → 상담예약" },
      { key: "statusLog[]", type: "{status, at}", desc: "상태 변경 이력 — 고객 문의 현황 타임라인" },
    ],
  },
  {
    entity: "Project",
    ko: "프로젝트",
    sor: { now: "localStorage · projects (시드 + 문의 유입)", next: "Supabase projects" },
    writer: "AX 담당자 · 문의 브릿지(자동)",
    update: "단계 진행(advanceProject) · 원가 입력",
    sensitivity: "보통",
    retention: "영구 (실적 자산)",
    ai: "가능",
    fields: [
      { key: "id", type: "string", desc: "p1… 또는 pi-{inquiryId}" },
      { key: "client / name / category", type: "string", desc: "발주처 · 프로젝트명 · 분야" },
      { key: "stage", type: "enum", desc: "문의 → 현장·요구사항 → 디자인 → 견적 → 승인 → 제작 → 설치 → 완료" },
      { key: "deadline", type: "date", desc: "납기" },
      { key: "budget", type: "number", desc: "견적금액 (원) — 대표만 열람" },
      { key: "costs", type: "CostBreakdown", desc: "design / material / oem / direct / transport / install / etc" },
      { key: "risk / riskNote", type: "enum, string", desc: "높음 / 보통 / 낮음 + 사유" },
      { key: "fromInquiry", type: "boolean", desc: "고객 문의에서 생성된 건" },
    ],
  },
  {
    entity: "ProductionOrder",
    ko: "제작 발주",
    sor: { now: "lib/data.ts seedProduction (Demo 고정)", next: "Supabase production_orders" },
    writer: "AX 담당자",
    update: "상태(발주 전 → 제작중 → 검수대기 → 완료/설치대기)",
    sensitivity: "보통",
    retention: "프로젝트와 동일",
    ai: "가능",
    fields: [
      { key: "projectId", type: "ref", desc: "Project.id" },
      { key: "item / partner", type: "string", desc: "품목 · 자체공장/파트너" },
      { key: "orderDate / due", type: "date", desc: "발주일 · 납기" },
      { key: "cost", type: "number", desc: "발주 금액" },
      { key: "status / qc / installLink", type: "enum", desc: "진행 · 검수 · 설치 연결" },
    ],
  },
  {
    entity: "Bid",
    ko: "입찰",
    sor: { now: "lib/data.ts seedBids (Demo 고정) + localStorage bidStates (상태·결과)", next: "Supabase bids + 나라장터 수집(NEXT)" },
    writer: "AX 담당자",
    update: "상태 진행 · 결과(낙찰/유찰/미참여) 입력",
    sensitivity: "보통",
    retention: "영구",
    ai: "가능",
    fields: [
      { key: "institution / project", type: "string", desc: "발주기관 · 사업명" },
      { key: "deadline / amount", type: "date, number", desc: "마감 · 추정가" },
      { key: "readiness", type: "number", desc: "준비도 % (체크리스트 완료율)" },
      { key: "checklist[]", type: "{label, done}", desc: "서류 항목 — 보유 자격 8종 기준" },
      { key: "portfolioMatch", type: "enum", desc: "유사실적 매칭 높음/보통/낮음" },
      { key: "status / result / resultAt / log[]", type: "enum, ISO", desc: "진행 상태 · 결과 · 이력 — 낙찰률 KPI 근거" },
    ],
  },
  {
    entity: "Action",
    ko: "추천 Action",
    sor: { now: "localStorage · actionStates", next: "Supabase actions" },
    writer: "시스템(생성) · 사람(상태)",
    update: "추천됨 → 확인 → 실행중 → 완료 / 보류 / 무시(사유)",
    sensitivity: "낮음",
    retention: "영구 (Adoption Evidence)",
    ai: "가능",
    fields: [
      { key: "id", type: "string", desc: "risk-{projectId} / qc-{orderId} / inq-{inquiryId} / mg-{projectId} / bid-{bidId} / engine-{engineId}" },
      { key: "state", type: "enum", desc: "todo / confirmed / doing / done / hold / skip" },
      { key: "reason", type: "string?", desc: "보류·무시 사유" },
      { key: "at", type: "ISO", desc: "마지막 변경 시각" },
    ],
  },
  {
    entity: "Evidence",
    ko: "증빙",
    sor: { now: "파생 — Project(완료) + Action + Inquiry 로부터 계산", next: "Supabase evidence (append-only)" },
    writer: "시스템(자동 생성)",
    update: "추가만 (수정 없음)",
    sensitivity: "보통",
    retention: "영구",
    ai: "가능",
    fields: [
      { key: "type", type: "enum", desc: "BASELINE / ACTION / RESULT / ADOPTION / CUSTOMER / EFFICIENCY / REVENUE / SCALE / RISK" },
      { key: "ref", type: "string", desc: "원본 레코드 id" },
      { key: "at", type: "ISO", desc: "발생 시각" },
      { key: "note", type: "string", desc: "사람이 읽는 한 줄" },
    ],
  },
  {
    entity: "Record",
    ko: "수행 실적 (지명원)",
    sor: { now: "lib/records.ts (337건, 코드 고정)", next: "Supabase records + 사진 첨부" },
    writer: "회사 (지명원 갱신 시)",
    update: "연 1회",
    sensitivity: "낮음",
    retention: "영구",
    ai: "가능",
    fields: [
      { key: "period", type: "string", desc: "2024–2025 / 2021–2023 / 2016–2020 / 2013–2015" },
      { key: "items[]", type: "string", desc: "실적명 — 계약금액 없음" },
    ],
  },
  {
    entity: "Event",
    ko: "행동 이벤트",
    sor: { now: "localStorage · shine-ax-events-v1 (최근 200건)", next: "GA4 / PostHog / Supabase events" },
    writer: "시스템",
    update: "추가만",
    sensitivity: "낮음",
    retention: "90일",
    ai: "집계만",
    fields: [
      { key: "name", type: "enum", desc: "view_home / submit_inquiry / ax_action_state … (lib/events.ts)" },
      { key: "at / props", type: "ISO, object", desc: "시각 · 부가 정보 (개인정보 없음)" },
    ],
  },
];

/** 설정 > 데이터 에서 내려받는 CSV 샘플 — 실제 필드명과 같은 헤더 */
export const CSV_SAMPLES: Record<string, string> = {
  projects:
    "id,client,name,category,stage,deadline,budget,owner,risk,design,material,oem,direct,transport,install,etc\n" +
    "p1,한국도로교통공단,포항운전면허시험장 사인 개선,교통,제작,2026-09-18,42000000,권유진,높음,6000000,9000000,12500000,2000000,900000,3600000,500000\n",
  inquiries:
    "id,createdAt,clientType,projectType,status,budget,schedule,org,name,phone,axStatus\n" +
    "q1abc,2026-09-03,공공기관,안내·유도사인,예산 검토,3천~5천만원,2026-11,○○시 보건소,담당자,010-0000-0000,접수\n",
  production:
    "id,projectId,item,partner,orderDate,due,cost,status,qc,installLink\n" +
    "m1,p1,옥외 파일론 사인,화성 공장 (가공 라인),2026-08-18,2026-09-08,8200000,제작중,대기,설치 1차(09-12)\n",
};
