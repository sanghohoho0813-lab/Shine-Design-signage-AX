/* ---------------------------------------------------------------------------
   SHINE DESIGN — Demo Data
   실적·거래처는 회사소개서(2024) 기준 실제 자료.
   AX 내부의 금액·일정·진행상태는 시연용 DEMO 값.
--------------------------------------------------------------------------- */

export const IMG = {
  heroMain: "/images/hero_main.jpg",
  heroSecondary: "/images/hero_secondary.jpg",
  service01: "/images/service_01_signage_design.jpg",
  service02: "/images/service_02_environmental_design.jpg",
  service03: "/images/service_03_public_project.jpg",
  offer01: "/images/offer_01_public_signage.jpg",
  offer02: "/images/offer_02_corporate_signage.jpg",
  offer03: "/images/offer_03_wayfinding.jpg",
  brandStory: "/images/brand_story_space.jpg",
  customerExperience: "/images/customer_experience.jpg",
  bookingScene: "/images/booking_or_order_scene.jpg",
  trustBanner: "/images/trust_banner.jpg",
  mobileCard: "/images/mobile_card_vertical.jpg",
  axCover: "/images/ax_cover_main.jpg",
  axOperation: "/images/ax_signature_operation.jpg",
  axOutput: "/images/ax_signature_output.jpg",
  axWorkspace: "/images/ax_workspace_bg.jpg",
  axStaff: "/images/ax_staff_action.jpg",
  axManager: "/images/ax_manager_tablet.jpg",
  axEvidence: "/images/ax_report_evidence.jpg",
  whyAx01: "/images/why_ax_01_current.jpg",
  whyAx02: "/images/why_ax_02_improved.jpg",
  whyAx03: "/images/why_ax_03_growth.jpg",
} as const;

const W = "/images/works";

/* ------------------------------- Pipeline -------------------------------- */

export const STAGES = [
  "문의",
  "현장·요구사항",
  "디자인",
  "견적",
  "승인",
  "제작",
  "설치",
  "완료",
] as const;
export type Stage = (typeof STAGES)[number];

export type Risk = "높음" | "보통" | "낮음";

export interface Project {
  id: string;
  client: string;
  name: string;
  category: string;
  stage: Stage;
  deadline: string; // YYYY-MM-DD
  budget: number; // 견적금액(원) — DEMO
  owner: string;
  risk: Risk;
  riskNote?: string;
  isBid?: boolean;
  fromInquiry?: boolean;
  costs?: CostBreakdown;
}

export interface CostBreakdown {
  design: number;
  material: number;
  oem: number;
  direct: number;
  transport: number;
  install: number;
  etc: number;
}

/* 실제 거래처 기반 시연 파이프라인 — 금액·일정·상태는 DEMO */
export const seedProjects: Project[] = [
  {
    id: "p1",
    client: "한국도로교통공단",
    name: "포항운전면허시험장 사인 개선",
    category: "교통",
    stage: "제작",
    deadline: "2026-09-18",
    budget: 42000000,
    owner: "권유진",
    risk: "높음",
    riskNote: "공단 CI 개정판 최종 승인 지연 D+2 · 제작 착수 일정 압박",
    costs: { design: 6000000, material: 9000000, oem: 12500000, direct: 2000000, transport: 900000, install: 3600000, etc: 500000 },
  },
  {
    id: "p2",
    client: "부천성모병원",
    name: "병동 유도사인 교체 2차",
    category: "의료",
    stage: "제작",
    deadline: "2026-09-10",
    budget: 28500000,
    owner: "박실장",
    risk: "높음",
    riskNote: "제작 파트너 납기 임박 · 야간 설치일 D-6",
    costs: { design: 4200000, material: 6100000, oem: 8300000, direct: 1200000, transport: 600000, install: 2400000, etc: 300000 },
  },
  {
    id: "p3",
    client: "한국도로교통공단",
    name: "CI변경 사인물 현황조사 용역 (2권역)",
    category: "교통",
    stage: "디자인",
    deadline: "2026-10-08",
    budget: 36000000,
    owner: "권유진",
    risk: "보통",
    riskNote: "권역별 현장 실측 데이터 취합 중",
    costs: { design: 5500000, material: 7800000, oem: 10200000, direct: 1500000, transport: 800000, install: 3100000, etc: 400000 },
  },
  {
    id: "p4",
    client: "종로구보건소",
    name: "리모델링 후속 실명사인 2차",
    category: "의료",
    stage: "견적",
    deadline: "2026-10-22",
    budget: 22000000,
    owner: "박실장",
    risk: "보통",
    riskNote: "설치비 항목 미확정",
    costs: { design: 3800000, material: 4600000, oem: 5400000, direct: 800000, transport: 400000, install: 0, etc: 400000 },
  },
  {
    id: "p5",
    client: "국방기술진흥연구소",
    name: "실내사인 증설 (별관)",
    category: "교육·연구",
    stage: "승인",
    deadline: "2026-10-30",
    budget: 31000000,
    owner: "권유진",
    risk: "낮음",
    costs: { design: 5000000, material: 6500000, oem: 8700000, direct: 1000000, transport: 700000, install: 2600000, etc: 300000 },
  },
  {
    id: "p6",
    client: "인천관광공사",
    name: "상상플랫폼 안내사인 보완",
    category: "문화·관광",
    stage: "현장·요구사항",
    deadline: "2026-11-12",
    budget: 18000000,
    owner: "이팀장",
    risk: "낮음",
    costs: { design: 3600000, material: 3400000, oem: 4200000, direct: 900000, transport: 300000, install: 1500000, etc: 200000 },
  },
  {
    id: "p7",
    client: "성수동 브랜드 오피스",
    name: "사옥 로비 사인 패키지",
    category: "상업·민간",
    stage: "문의",
    deadline: "2026-11-20",
    budget: 15000000,
    owner: "이팀장",
    risk: "낮음",
  },
  {
    id: "p8",
    client: "하남시의회",
    name: "청사 안내사인 보수",
    category: "공공·행정",
    stage: "설치",
    deadline: "2026-09-05",
    budget: 26000000,
    owner: "박실장",
    risk: "보통",
    riskNote: "설치 인력 일정 확정 필요",
    costs: { design: 3900000, material: 6200000, oem: 7600000, direct: 1100000, transport: 700000, install: 2500000, etc: 300000 },
  },
  {
    id: "p9",
    client: "서정대학교",
    name: "캠퍼스 유도사인 2차",
    category: "교육·연구",
    stage: "완료",
    deadline: "2026-08-14",
    budget: 19500000,
    owner: "권유진",
    risk: "낮음",
    costs: { design: 3200000, material: 4100000, oem: 5300000, direct: 800000, transport: 400000, install: 1800000, etc: 200000 },
  },
];

export function costTotal(c?: CostBreakdown): number {
  if (!c) return 0;
  return c.design + c.material + c.oem + c.direct + c.transport + c.install + c.etc;
}

/* --------------------------- Production / OEM ---------------------------- */

export const PRODUCTION_STATUSES = ["발주 전", "제작중", "검수대기", "완료", "설치대기"] as const;
export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];

export interface ProductionOrder {
  id: string;
  projectId: string;
  item: string;
  partner: string;
  orderDate: string;
  due: string;
  cost: number;
  status: ProductionStatus;
  qc: "완료" | "대기" | "-";
  installLink: string;
  risk?: string;
}

/* 파트너·발주 데이터는 시연용 DEMO (자체 1·2공장 + 외부 파트너 혼합 구조) */
export const seedProduction: ProductionOrder[] = [
  { id: "m1", projectId: "p1", item: "옥외 파일론 사인 (내후성 도장)", partner: "자체 1공장", orderDate: "2026-08-18", due: "2026-09-08", cost: 8200000, status: "제작중", qc: "대기", installLink: "설치 1차(09-12)", risk: "납기 임박" },
  { id: "m2", projectId: "p1", item: "층별 유도사인 32EA", partner: "디자인하우스", orderDate: "2026-08-20", due: "2026-09-10", cost: 4300000, status: "제작중", qc: "대기", installLink: "설치 1차(09-12)" },
  { id: "m3", projectId: "p2", item: "병동 유도사인 48EA", partner: "빛나라사인", orderDate: "2026-08-12", due: "2026-09-04", cost: 5600000, status: "검수대기", qc: "대기", installLink: "설치(09-08)", risk: "검수 미완료" },
  { id: "m4", projectId: "p2", item: "픽토그램 패널 세트", partner: "코리아광고", orderDate: "2026-08-15", due: "2026-09-05", cost: 2700000, status: "제작중", qc: "-", installLink: "설치(09-08)" },
  { id: "m5", projectId: "p8", item: "청사 외부 게이트 사인 (LED)", partner: "새움특수금속", orderDate: "2026-08-01", due: "2026-08-28", cost: 6900000, status: "설치대기", qc: "완료", installLink: "설치(09-03)" },
  { id: "m6", projectId: "p3", item: "종합안내판 시안 목업", partner: "자체 2공장", orderDate: "-", due: "2026-09-25", cost: 5100000, status: "발주 전", qc: "-", installLink: "미정" },
];

export const partners = [
  { name: "자체 1·2공장", field: "가공·조립·용접", activeOrders: 2, onTime: 98, load: "보통" },
  { name: "새움특수금속", field: "금속가공·조형", activeOrders: 1, onTime: 96, load: "높음" },
  { name: "디자인하우스", field: "패널·아크릴", activeOrders: 1, onTime: 89, load: "보통" },
  { name: "빛나라사인", field: "조명·채널", activeOrders: 1, onTime: 82, load: "보통" },
  { name: "코리아광고", field: "출력·시트", activeOrders: 1, onTime: 75, load: "낮음" },
];

/* --------------------------------- Bids ---------------------------------- */

export interface BidChecklistItem {
  label: string;
  done: boolean;
  demo?: boolean;
}

export interface Bid {
  id: string;
  institution: string;
  project: string;
  deadline: string;
  amount: number;
  readiness: number; // %
  status: "발굴" | "검토" | "준비" | "제출" | "결과대기";
  portfolioMatch: "높음" | "보통" | "낮음";
  checklist: BidChecklistItem[];
  insight: string;
}

/* 서류 항목은 실제 보유 자격 기준(회사소개서) · 입찰 건 자체는 시연용 DEMO */
const baseChecklist = (overrides: Record<string, boolean>): BidChecklistItem[] =>
  [
    { label: "사업자 기본서류 (2024.04 법인)", done: true },
    { label: "여성기업 확인서 (~2027.06)", done: true },
    { label: "산업디자인전문회사 신고 (2024.07)", done: true },
    { label: "공장등록증 (2024.08)", done: true },
    { label: "옥외광고사업 등록 (2024.05)", done: true },
    { label: "창업기업 확인서 (~2027.08)", done: true },
    { label: "유사실적 증명 (도로교통공단 외)", done: false },
    { label: "포트폴리오", done: true },
    { label: "견적자료", done: false },
    { label: "제안자료", done: false, demo: true },
  ].map((c) => ({ ...c, done: overrides[c.label] ?? c.done }));

export const seedBids: Bid[] = [
  {
    id: "b1",
    institution: "한국도로교통공단",
    project: "지부 안내사인 개선사업 (3권역)",
    deadline: "2026-09-26",
    amount: 58000000,
    readiness: 78,
    status: "준비",
    portfolioMatch: "높음",
    checklist: baseChecklist({ "유사실적 증명 (도로교통공단 외)": true }),
    insight:
      "전국 지부·시험장·교통방송 수행 실적이 있어 Portfolio Match가 매우 높습니다. 견적자료·제안자료 2종만 확정하면 준비 완료입니다.",
  },
  {
    id: "b2",
    institution: "남양주시",
    project: "관내 공공시설 안내체계 정비",
    deadline: "2026-10-05",
    amount: 41000000,
    readiness: 65,
    status: "검토",
    portfolioMatch: "높음",
    checklist: baseChecklist({}),
    insight:
      "본사 소재 지자체 사업으로 지역 가점 여지가 있습니다. 보건소·의회 등 행정시설 실적과 매칭됩니다. 과업지시서의 조명 사양 검토가 선행돼야 견적 정확도가 확보됩니다.",
  },
  {
    id: "b3",
    institution: "보령시",
    project: "원도심 관광안내체계 확장",
    deadline: "2026-10-18",
    amount: 73000000,
    readiness: 52,
    status: "발굴",
    portfolioMatch: "높음",
    checklist: baseChecklist({ 포트폴리오: false }),
    insight:
      "어울림센터·시립도서관·김시장 아치 등 보령 원도심 실적 4건이 직접 연결됩니다. 실적 증빙을 포트폴리오 카드로 정리하면 준비도가 크게 상승합니다.",
  },
  {
    id: "b4",
    institution: "경기북부 의료기관",
    project: "병동 웨이파인딩 개선",
    deadline: "2026-11-02",
    amount: 39000000,
    readiness: 44,
    status: "발굴",
    portfolioMatch: "보통",
    checklist: baseChecklist({ "유사실적 증명 (도로교통공단 외)": false, 포트폴리오: false }),
    insight: "부천성모병원·국립소방병원·종로구보건소 실적을 의료 유사실적으로 정리하는 것이 우선 과제입니다.",
  },
];

/* ------------------------------- Portfolio ------------------------------- */
/* 실제 수행 프로젝트 · 실제 현장 사진 (회사소개서 2024) */

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  scope: string[];
  year: string;
  image: string;
  gallery?: string[];
  summary: string;
  detail: string;
}

export const CATEGORIES = ["전체", "교통", "공공·행정", "의료", "문화·관광", "교육·연구", "상업·민간"] as const;

export const portfolio: PortfolioItem[] = [
  {
    id: "koroad-gangseo",
    title: "한국도로교통공단 강서운전면허시험장",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-gangseo.jpg`,
    gallery: [`${W}/koroad-gangseo-2.jpg`, `${W}/koroad-gangseo-3.jpg`],
    summary: "시험장 본관 파사드 사인과 안내체계를 설계부터 시공까지 수행.",
    detail:
      "이용 민원이 많은 시험장 특성에 맞춰 건물 명판과 외부 안내사인의 시인성을 확보하고, 공단 CI 기준에 맞는 컬러·서체 체계로 제작·설치했습니다.",
  },
  {
    id: "koroad-yesan",
    title: "한국도로교통공단 예산운전면허시험장",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-yesan.jpg`,
    gallery: [`${W}/koroad-yesan-2.jpg`],
    summary: "시험장 건물 전면 사인 교체 및 외부 안내사인 정비.",
    detail:
      "고소 작업 차량을 투입해 본관 전면 사인을 교체하고, 부지 진입부의 안내사인까지 함께 정비해 방문 동선의 혼선을 줄였습니다.",
  },
  {
    id: "koroad-wonju-test",
    title: "한국도로교통공단 원주운전면허시험장",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-wonju-test.jpg`,
    gallery: [`${W}/koroad-wonju-test-2.jpg`],
    summary: "진입로 파일론 사인 신설로 원거리 시인성 확보.",
    detail:
      "도로변에서 시험장 위치를 인지하기 어려웠던 문제를 해결하기 위해 진입로에 세로형 파일론 사인을 설계·제작해 설치했습니다.",
  },
  {
    id: "koroad-chungbuk",
    title: "한국도로교통공단 충북지부",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-chungbuk.jpg`,
    gallery: [`${W}/koroad-chungbuk-2.jpg`],
    summary: "지부 청사 옥상 사인 및 전면 명판 교체.",
    detail: "청사 규모에 맞는 옥상 채널 사인을 제작하고, 크레인 작업으로 안전하게 교체 설치했습니다.",
  },
  {
    id: "koroad-gimpo",
    title: "한국도로교통공단 김포운전면허센터",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-gimpo.jpg`,
    gallery: [`${W}/koroad-gimpo-2.jpg`],
    summary: "상가 복합건물 내 센터의 파사드 채널 사인 설치.",
    detail:
      "유리 커튼월 입면에 맞는 채널 레터 사인을 제작하고, 운영 중인 상가 환경에서 고소 작업으로 설치를 완료했습니다.",
  },
  {
    id: "koroad-uijeongbu",
    title: "한국도로교통공단 의정부운전면허시험장",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-uijeongbu.jpg`,
    gallery: [`${W}/koroad-uijeongbu-2.jpg`],
    summary: "본관 전면 사인 교체 및 민원 안내사인 정비.",
    detail: "본관 파사드 사인을 공단 CI 기준으로 교체하고 1층 민원 공간의 안내사인을 함께 정비했습니다.",
  },
  {
    id: "koroad-wonju-hq",
    title: "한국도로교통공단 원주 본부",
    client: "한국도로교통공단",
    category: "교통",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/koroad-wonju-hq.jpg`,
    gallery: [`${W}/koroad-wonju-hq-2.jpg`],
    summary: "본부 사옥 실내외 사인 통합 정비 — 접견실·복도까지.",
    detail:
      "본부 사옥의 외부 사인과 접견실 명판, 복도 유도사인을 하나의 체계로 정비했습니다. 전국 지부·시험장·교통방송으로 이어진 공단 실적의 중심 프로젝트입니다.",
  },
  {
    id: "jeonbuk-tbn",
    title: "전북교통방송(TBN) 사옥",
    client: "한국도로교통공단 전북교통방송",
    category: "교통",
    scope: ["디자인 설계", "제작", "시공"],
    year: "2024",
    image: `${W}/jeonbuk-tbn.jpg`,
    summary: "방송국 사옥 외부 사인과 진입 안내체계 정비.",
    detail: "사옥 옥상 사인과 주차 진입 안내까지, 방송국 방문자의 동선에 맞춰 사인을 배치했습니다.",
  },
  {
    id: "yeoju-police",
    title: "여주경찰서",
    client: "경찰청 (여주경찰서)",
    category: "공공·행정",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/yeoju-police.jpg`,
    gallery: [`${W}/yeoju-police-2.jpg`],
    summary: "신청사 내외부 사인물 디자인·제작·설치.",
    detail:
      "청사 옥상의 대형 채널 사인부터 내부 실명사인까지, 치안 기관의 상징성과 야간 시인성을 함께 고려해 수행했습니다.",
  },
  {
    id: "yeongdeungpo",
    title: "영등포동 공공복합시설",
    client: "서울 영등포구",
    category: "공공·행정",
    scope: ["사인설계", "시공"],
    year: "2024",
    image: `${W}/yeongdeungpo.jpg`,
    gallery: [`${W}/yeongdeungpo-2.jpg`],
    summary: "공영주차장 포함 복합시설의 통합 안내체계.",
    detail:
      "주차장 진입부터 엘리베이터 층별 안내, 장애인 주차구역 그래픽까지 시설 전체의 정보체계를 하나로 연결했습니다.",
  },
  {
    id: "fire-hospital",
    title: "국립소방병원",
    client: "소방청 (국립소방병원)",
    category: "의료",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/fire-hospital.jpg`,
    summary: "신축 병원의 사인 시스템 설계·제작·시공.",
    detail:
      "헬리포트를 갖춘 신축 국립병원의 외부 명판과 안내체계를 수행했습니다. 의료시설 특유의 긴급 동선과 방문자 동선을 구분해 설계했습니다.",
  },
  {
    id: "bucheon-stmary",
    title: "부천성모병원",
    client: "가톨릭대학교 부천성모병원",
    category: "의료",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/bucheon-stmary.jpg`,
    summary: "대학병원 사인설계 및 제작·시공.",
    detail:
      "대형 의료 캠퍼스의 옥상 사인과 외부 안내체계를 수행했습니다. 인천성모병원 진료실 사인 등 가톨릭 의료원 계열 실적으로 이어졌습니다.",
  },
  {
    id: "jongno-health",
    title: "종로구보건소",
    client: "서울 종로구",
    category: "의료",
    scope: ["디자인 설계", "제작", "시공"],
    year: "2024",
    image: `${W}/jongno-health.jpg`,
    gallery: [`${W}/jongno-health-2.jpg`],
    summary: "리모델링 준공에 맞춘 보건소 사인물 일체 정비.",
    detail:
      "리모델링 공사 준공 일정에 맞춰 외부 명판과 부속 시설 안내사인을 제작·설치했습니다. 이천시보건소 실명사인 등 보건시설 실적이 이어지고 있습니다.",
  },
  {
    id: "incheon-tourism",
    title: "인천관광공사 상상플랫폼",
    client: "인천관광공사",
    category: "문화·관광",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/incheon-tourism.jpg`,
    gallery: [`${W}/incheon-tourism-2.jpg`, `${W}/incheon-tourism-3.jpg`],
    summary: "복합문화공간의 게이트·에스컬레이터·실내 안내사인.",
    detail:
      "코르텐 강판 입면과 조화되는 게이트 사인, 수직 동선의 유도사인, 실내 종합안내 사인을 하나의 디자인 언어로 수행했습니다.",
  },
  {
    id: "boryeong-eoullim",
    title: "보령 원도심 어울림센터",
    client: "보령시",
    category: "문화·관광",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/boryeong-eoullim.jpg`,
    gallery: [`${W}/boryeong-eoullim-2.jpg`, `${W}/boryeong-eoullim-3.jpg`],
    summary: "도시재생 거점시설의 입면 사인과 복합 기능 안내체계.",
    detail:
      "하나의 건물에 담긴 여러 지원시설(도시재생지원센터·마을공방 등)을 층별 컬러 사인으로 구분해 입면에 담았습니다. 보령 원도심 재생사업 실적의 중심입니다.",
  },
  {
    id: "boryeong-lib",
    title: "보령시립도서관",
    client: "보령시",
    category: "문화·관광",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/boryeong-lib.jpg`,
    gallery: [`${W}/boryeong-lib-2.jpg`],
    summary: "도서관 건물 명판·가로등형 배너·실내 안내데스크 사인.",
    detail:
      "외부 명판과 가로 조명 배너, 곡면 안내데스크 사인까지 도서관의 정적인 분위기에 맞는 절제된 사인 체계를 적용했습니다.",
  },
  {
    id: "boryeong-arch",
    title: "보령 김시장 아치",
    client: "보령시",
    category: "문화·관광",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/boryeong-arch.jpg`,
    gallery: [`${W}/boryeong-arch-2.jpg`],
    summary: "전통시장 진입부 아치 사인 — 상권의 얼굴을 만드는 작업.",
    detail:
      "도로 위를 가로지르는 아치형 게이트 사인으로 시장 진입부의 인지성을 높였습니다. 교통 통제 하의 야간 설치로 시공했습니다.",
  },
  {
    id: "boryeong-ga",
    title: "보령가 한옥 사인",
    client: "보령시",
    category: "문화·관광",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/boryeong-ga.jpg`,
    gallery: [`${W}/boryeong-ga-2.jpg`],
    summary: "한옥 건축에 어울리는 전통 서체·목재 질감의 사인.",
    detail: "한옥의 목구조와 기와에 맞춰 소재와 서체를 절제한 현판형 사인을 제작·설치했습니다.",
  },
  {
    id: "snu-medlib",
    title: "서울대의대 의학도서관",
    client: "서울대학교 의과대학",
    category: "교육·연구",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/snu-medlib.jpg`,
    summary: "의학도서관 외부 사인 및 광장 안내체계.",
    detail: "루버 입면의 현대적 건축과 조화되는 절제된 사인 체계를 적용했습니다.",
  },
  {
    id: "dtaq",
    title: "국방기술진흥연구소",
    client: "국방기술진흥연구소(KRIT)",
    category: "교육·연구",
    scope: ["디자인 설계", "제작", "시공"],
    year: "2024",
    image: `${W}/dtaq.jpg`,
    gallery: [`${W}/dtaq-2.jpg`],
    summary: "연구기관 로비 사인월과 실명사인 체계.",
    detail:
      "석재 벽면에 입체 로고 사인월을 설치하고, 보안 구역 특성에 맞는 실명사인 체계를 구축했습니다.",
  },
  {
    id: "nh-feed",
    title: "농협우리사료",
    client: "농협사료",
    category: "상업·민간",
    scope: ["사인설계", "제작", "시공"],
    year: "2024",
    image: `${W}/nh-feed.jpg`,
    gallery: [`${W}/nh-feed-2.jpg`],
    summary: "생산시설 대형 옥상 사인 — 크레인 고소 설치.",
    detail:
      "사일로급 높이의 생산시설 옥상에 대형 채널 사인을 크레인으로 설치했습니다. 산업시설 사인의 구조 안전 검토까지 수행했습니다.",
  },
];

/* ------------------------------ Trust cards ------------------------------ */
/* 실제 발주처 기준 */

export const trustCategories = [
  { label: "한국도로교통공단", desc: "전국 지부·시험장·교통방송 60여 건", image: `${W}/koroad-gangseo.jpg` },
  { label: "경찰서 / 법원", desc: "여주경찰서 · 서부지방법원", image: `${W}/yeoju-police.jpg` },
  { label: "병원 / 보건시설", desc: "국립소방병원 · 부천성모병원 · 종로구보건소", image: `${W}/fire-hospital.jpg` },
  { label: "지자체 / 청사", desc: "하남시의회 · 영등포동 공공복합시설", image: `${W}/yeongdeungpo.jpg` },
  { label: "문화 / 관광", desc: "인천관광공사 · 보령시 원도심 재생", image: `${W}/incheon-tourism.jpg` },
  { label: "교육 / 연구", desc: "서울대의대 · 국방기술진흥연구소", image: `${W}/snu-medlib.jpg` },
];

/* ---------------------------- Formatting utils --------------------------- */

export const fmtKRW = (n: number) => n.toLocaleString("ko-KR") + "원";
export const fmtKRWshort = (n: number) =>
  n >= 100000000 ? (n / 100000000).toFixed(1).replace(/\.0$/, "") + "억원" : Math.round(n / 10000).toLocaleString("ko-KR") + "만원";

export const marginOf = (p: Project) => {
  const cost = costTotal(p.costs);
  if (!cost || !p.budget) return null;
  return ((p.budget - cost) / p.budget) * 100;
};
