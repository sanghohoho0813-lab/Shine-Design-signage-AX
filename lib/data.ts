/* ---------------------------------------------------------------------------
   SHINE DESIGN — Demo Data (Source: 회사 마스터 프롬프트. 금액/일정은 DEMO 값)
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
  budget: number; // 견적금액(원)
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

export const seedProjects: Project[] = [
  {
    id: "p1",
    client: "성남시청",
    name: "청사 안내 사인시스템 개선",
    category: "행정",
    stage: "제작",
    deadline: "2026-09-18",
    budget: 42000000,
    owner: "김대표",
    risk: "높음",
    riskNote: "디자인 최종 승인 지연 D+2 · 제작 착수 일정 압박",
    costs: { design: 6000000, material: 9000000, oem: 12500000, direct: 2000000, transport: 900000, install: 3600000, etc: 500000 },
  },
  {
    id: "p2",
    client: "국립중앙도서관",
    name: "실내 유도사인 교체",
    category: "문화·관광",
    stage: "제작",
    deadline: "2026-09-10",
    budget: 28500000,
    owner: "박실장",
    risk: "높음",
    riskNote: "제작 파트너 납기 임박 · 설치일 D-6",
    costs: { design: 4200000, material: 6100000, oem: 8300000, direct: 1200000, transport: 600000, install: 2400000, etc: 300000 },
  },
  {
    id: "p3",
    client: "도로교통 공공기관",
    name: "민원동 안내체계 개선",
    category: "교통",
    stage: "디자인",
    deadline: "2026-10-08",
    budget: 36000000,
    owner: "김대표",
    risk: "보통",
    riskNote: "현장 실측 데이터 보완 필요",
    costs: { design: 5500000, material: 7800000, oem: 10200000, direct: 1500000, transport: 800000, install: 3100000, etc: 400000 },
  },
  {
    id: "p4",
    client: "인천 공공의료원",
    name: "외래동 웨이파인딩 시스템",
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
    client: "경기북부 연구기관",
    name: "본관 통합 사인 리뉴얼",
    category: "교육·연구",
    stage: "승인",
    deadline: "2026-10-30",
    budget: 31000000,
    owner: "김대표",
    risk: "낮음",
    costs: { design: 5000000, material: 6500000, oem: 8700000, direct: 1000000, transport: 700000, install: 2600000, etc: 300000 },
  },
  {
    id: "p6",
    client: "수도권 문화재단",
    name: "전시공간 환경그래픽",
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
    client: "남부권 지방청사",
    name: "청사 외부 안내사인",
    category: "행정",
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
    client: "동부 교육시설",
    name: "캠퍼스 유도사인 1차",
    category: "교육·연구",
    stage: "완료",
    deadline: "2026-08-14",
    budget: 19500000,
    owner: "김대표",
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

export const seedProduction: ProductionOrder[] = [
  { id: "m1", projectId: "p1", item: "메인 안내데스크 사인(스테인리스)", partner: "새움특수금속", orderDate: "2026-08-18", due: "2026-09-08", cost: 8200000, status: "제작중", qc: "대기", installLink: "설치 1차(09-12)", risk: "납기 임박" },
  { id: "m2", projectId: "p1", item: "층별 유도사인 32EA", partner: "디자인하우스", orderDate: "2026-08-20", due: "2026-09-10", cost: 4300000, status: "제작중", qc: "대기", installLink: "설치 1차(09-12)" },
  { id: "m3", projectId: "p2", item: "서가 유도사인 48EA", partner: "빛나라사인", orderDate: "2026-08-12", due: "2026-09-04", cost: 5600000, status: "검수대기", qc: "대기", installLink: "설치(09-08)", risk: "검수 미완료" },
  { id: "m4", projectId: "p2", item: "픽토그램 패널 세트", partner: "코리아광고", orderDate: "2026-08-15", due: "2026-09-05", cost: 2700000, status: "제작중", qc: "-", installLink: "설치(09-08)" },
  { id: "m5", projectId: "p8", item: "외부 게이트 사인(LED 조명)", partner: "새움특수금속", orderDate: "2026-08-01", due: "2026-08-28", cost: 6900000, status: "설치대기", qc: "완료", installLink: "설치(09-03)" },
  { id: "m6", projectId: "p3", item: "민원동 종합안내판", partner: "디자인하우스", orderDate: "-", due: "2026-09-25", cost: 5100000, status: "발주 전", qc: "-", installLink: "미정" },
];

export const partners = [
  { name: "새움특수금속", field: "금속가공·조형", activeOrders: 2, onTime: 96, load: "높음" },
  { name: "디자인하우스", field: "패널·아크릴", activeOrders: 2, onTime: 89, load: "보통" },
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

const baseChecklist = (overrides: Record<string, boolean>): BidChecklistItem[] =>
  [
    { label: "사업자 기본서류", done: true },
    { label: "여성기업 확인서", done: true },
    { label: "산업디자인전문회사 신고", done: true },
    { label: "공장등록증", done: true },
    { label: "옥외광고사업 등록", done: true },
    { label: "유사실적 증명", done: false },
    { label: "포트폴리오", done: true },
    { label: "견적자료", done: false },
    { label: "제안자료", done: false, demo: true },
  ].map((c) => ({ ...c, done: overrides[c.label] ?? c.done }));

export const seedBids: Bid[] = [
  {
    id: "b1",
    institution: "도로교통 공공기관",
    project: "안내사인 개선사업",
    deadline: "2026-09-26",
    amount: 58000000,
    readiness: 78,
    status: "준비",
    portfolioMatch: "높음",
    checklist: baseChecklist({ "유사실적 증명": true, 견적자료: false }),
    insight:
      "유사 공공기관 실적이 충분해 Portfolio Match는 높습니다. 다만 견적자료·제안자료 2종이 아직 미확인 상태입니다.",
  },
  {
    id: "b2",
    institution: "수도권 경찰관서",
    project: "청사 사인시스템 정비",
    deadline: "2026-10-05",
    amount: 41000000,
    readiness: 65,
    status: "검토",
    portfolioMatch: "높음",
    checklist: baseChecklist({}),
    insight:
      "행정·청사 카테고리 실적과 매칭됩니다. 과업지시서의 조명 사양 검토가 선행돼야 견적 정확도가 확보됩니다.",
  },
  {
    id: "b3",
    institution: "남부권 지자체",
    project: "관광안내체계 구축",
    deadline: "2026-10-18",
    amount: 73000000,
    readiness: 52,
    status: "발굴",
    portfolioMatch: "보통",
    checklist: baseChecklist({ 포트폴리오: false }),
    insight:
      "관광 분야 실적 정리가 필요합니다. 문화·관광 완료 프로젝트를 Evidence로 연결하면 준비도가 상승합니다.",
  },
  {
    id: "b4",
    institution: "중부권 의료기관",
    project: "병동 웨이파인딩 개선",
    deadline: "2026-11-02",
    amount: 39000000,
    readiness: 44,
    status: "발굴",
    portfolioMatch: "보통",
    checklist: baseChecklist({ "유사실적 증명": false, 포트폴리오: false }),
    insight: "의료 실적 증빙과 포트폴리오 매핑이 우선 과제입니다.",
  },
];

/* ------------------------------- Portfolio ------------------------------- */

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  scope: string[];
  year: string;
  image: string;
  summary: string;
  challenge: string;
  approach: string;
  production: string;
}

export const CATEGORIES = ["전체", "공공기관", "교통", "의료", "행정", "문화·관광", "교육·연구", "상업·민간"] as const;

export const portfolio: PortfolioItem[] = [
  {
    id: "w1",
    title: "교통 공공기관 통합 사인시스템",
    client: "도로교통 분야 공공기관",
    category: "교통",
    scope: ["사인 기획", "디자인", "제작", "시공"],
    year: "2025",
    image: IMG.offer01,
    summary: "민원동·교육동·주차장을 잇는 통합 안내체계를 기획부터 시공까지 수행.",
    challenge: "방문 목적이 다른 이용자 동선이 한 건물에서 교차해 안내 혼선이 잦았습니다.",
    approach: "이용자 유형별 동선을 분석해 정보 위계를 재설계하고, 건축 마감과 조화되는 다크 패널·골드 포인트 체계를 적용했습니다.",
    production: "금속 가공·조명 전문 파트너와 협업해 외부 내후성 사양으로 제작, 야간 시인성까지 검증 후 설치했습니다.",
  },
  {
    id: "w2",
    title: "공공청사 안내·유도사인 개선",
    client: "지방자치단체 청사",
    category: "행정",
    scope: ["안내체계 설계", "디자인", "제작", "시공"],
    year: "2025",
    image: IMG.service03,
    summary: "민원 공간 중심의 층별 안내체계 전면 개선.",
    challenge: "증축을 거치며 부서 배치가 바뀌어 기존 사인이 실제 동선과 맞지 않았습니다.",
    approach: "전수 현장조사로 안내 지점을 재정의하고, 행정 CI와 일관된 서체·컬러 시스템을 수립했습니다.",
    production: "교체 대상을 단계별로 나눠 청사 운영 중단 없이 야간·주말 시공으로 완료했습니다.",
  },
  {
    id: "w3",
    title: "의료시설 외래 웨이파인딩",
    client: "공공 의료기관",
    category: "의료",
    scope: ["동선 분석", "디자인", "제작"],
    year: "2024",
    image: IMG.service01,
    summary: "고령 이용자 비중이 높은 외래 공간의 인지 중심 안내체계.",
    challenge: "진료과 이동 경로가 복잡해 안내데스크 문의가 집중되고 있었습니다.",
    approach: "큰 글자 위계와 고대비 컬러코딩, 바닥 유도 요소를 결합해 인지 부담을 낮췄습니다.",
    production: "항균 마감 사양의 패널로 제작하고 진료 시간 외 설치로 운영 영향을 최소화했습니다.",
  },
  {
    id: "w4",
    title: "경찰·법원 청사 사인 정비",
    client: "사법·치안 기관",
    category: "행정",
    scope: ["디자인", "제작", "시공"],
    year: "2024",
    image: IMG.heroSecondary,
    summary: "보안 구역과 민원 구역을 구분하는 안내체계 정비.",
    challenge: "출입 권한별 공간 구분이 안내에 반영되지 않아 혼선이 있었습니다.",
    approach: "구역별 컬러·픽토그램 체계를 수립하고 제한구역 안내를 표준화했습니다.",
    production: "기관 보안 규정에 맞춘 작업 절차로 제작·설치를 수행했습니다.",
  },
  {
    id: "w5",
    title: "문화·관광시설 환경그래픽",
    client: "지역 문화재단",
    category: "문화·관광",
    scope: ["환경그래픽", "공간 아이덴티티", "제작"],
    year: "2024",
    image: IMG.service02,
    summary: "전시·체험 공간의 브랜드 경험을 완성하는 환경그래픽.",
    challenge: "공간별 성격이 달라 통일된 인상을 만들기 어려웠습니다.",
    approach: "시설 아이덴티티를 재해석한 그래픽 모티프로 공간 전체를 하나의 이야기로 연결했습니다.",
    production: "대형 출력·특수 시트 파트너와 협업해 곡면·대면적 시공을 완성했습니다.",
  },
  {
    id: "w6",
    title: "교육·연구기관 캠퍼스 사인",
    client: "공공 연구기관",
    category: "교육·연구",
    scope: ["사인 기획", "디자인", "제작", "시공"],
    year: "2023",
    image: IMG.brandStory,
    summary: "본관·연구동·부속시설을 아우르는 캠퍼스 통합 사인.",
    challenge: "건물별로 제각각 설치된 사인이 기관 이미지를 분산시키고 있었습니다.",
    approach: "캠퍼스 전체 마스터플랜을 수립하고 외부 유도·건물 명판·실내 안내를 하나의 시스템으로 통합했습니다.",
    production: "3개 제작 파트너를 병행 운영해 6주 내 전체 교체를 완료했습니다.",
  },
  {
    id: "w7",
    title: "기업 사옥 로비 사인 패키지",
    client: "민간 기업 사옥",
    category: "상업·민간",
    scope: ["브랜드 사인", "디자인", "제작"],
    year: "2025",
    image: IMG.offer02,
    summary: "브랜드 공간의 첫인상을 완성하는 로비 사인.",
    challenge: "리브랜딩 이후 공간이 새 아이덴티티를 담지 못하고 있었습니다.",
    approach: "새 CI의 소재 언어를 해석해 백라이트 로고월과 층별 사인을 통합 디자인했습니다.",
    production: "금속·조명 파트너 협업으로 정밀 가공 후 야간 설치를 진행했습니다.",
  },
  {
    id: "w8",
    title: "다중이용시설 웨이파인딩",
    client: "복합 공공시설",
    category: "공공기관",
    scope: ["동선 분석", "정보체계", "디자인", "시공"],
    year: "2023",
    image: IMG.offer03,
    summary: "이용 목적이 다양한 복합시설의 정보체계 설계.",
    challenge: "시설 통합 운영으로 층별 기능이 재배치되며 기존 안내가 무력화됐습니다.",
    approach: "존(Zone) 개념의 정보체계를 도입해 첫 방문자도 3단계 안내로 목적지에 도달하도록 설계했습니다.",
    production: "운영시간을 피한 순차 시공으로 민원 없이 교체를 완료했습니다.",
  },
];

/* ------------------------------ Trust cards ------------------------------ */

export const trustCategories = [
  { label: "한국도로교통공단", desc: "교통 공공기관", image: IMG.offer01 },
  { label: "공공청사 / 관공서", desc: "행정 안내체계", image: IMG.service03 },
  { label: "병원 / 의료시설", desc: "웨이파인딩", image: IMG.service01 },
  { label: "경찰 / 법원", desc: "청사 사인 정비", image: IMG.heroSecondary },
  { label: "관광 / 문화시설", desc: "환경그래픽", image: IMG.service02 },
  { label: "교육 / 연구기관", desc: "캠퍼스 사인", image: IMG.brandStory },
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
