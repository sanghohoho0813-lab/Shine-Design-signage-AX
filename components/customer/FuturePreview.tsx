"use client";

import { FutureSheet, type FutureMenu } from "../FutureSheet";

/* ---------------------------------------------------------------------------
   고객 플랫폼 향후 확장 메뉴 (v1.4 §4)

   확장 후보는 지명원 2026에 근거가 있는 것만 넣는다.
   "할 수 있을 것 같은 일"이 아니라 "이미 해봤거나 설비·자격이 있는 일"이어야
   발주 담당자에게 설득력이 생긴다. 각 항목의 `basis`가 그 근거다.
--------------------------------------------------------------------------- */

export type { FutureMenu, FutureTier } from "../FutureSheet";
export { FutureBadge, FutureRow } from "../FutureSheet";

export const FUTURE_MENUS: FutureMenu[] = [
  {
    id: "bid",
    label: "공공입찰·기관문의",
    tier: "NEXT",
    icon: "bid",
    color: "var(--ic-crm)",
    desc: "발주 전 사전상담 창구",
    tagline: "발주 전 단계부터 함께 준비하는 공공 프로젝트 사전상담 창구입니다.",
    basis: "직접생산확인 7품목·산업디자인전문회사·여성기업·중소기업 확인을 갖추고 있어 조달 참여 요건이 이미 충족되어 있습니다.",
    features: [
      "입찰·발주 예정 프로젝트 사전상담",
      "규격서 / 과업지시서 검토",
      "현장조건 정리 지원",
      "제출자료 체크리스트",
      "유사실적 증명 자료 발급",
    ],
    growthSignal: { from: "소개 중심 공공 수주", to: "반복 가능한 공공조달 파이프라인" },
  },
  {
    id: "bf",
    label: "BF 인증 사인 컨설팅",
    tier: "NEXT",
    icon: "access",
    color: "var(--ic-evidence)",
    desc: "장애물 없는 생활환경 사전검토",
    tagline:
      "BF(장애물 없는 생활환경) 인증에서 사인이 걸리는 항목을 설계 단계에서 미리 정리합니다.",
    basis:
      "장애인 종합안내 촉지도, 주차구역 표지판·유도표지판, 음성유도 표지판, 장애인화장실 사인, 구조 촉지도, 핸드레일 점자 사인 등 BF 7품목을 자체 품목으로 보유하고 있습니다.",
    features: [
      "BF 인증 지표 중 사인 항목 사전검토",
      "촉지도 · 점자 규격 검토",
      "음성유도기 설치 위치 검토",
      "인증 심사 대응 자료 작성",
      "일반 사인과 BF 사인 규격 통일",
    ],
    growthSignal: { from: "사인 제작 발주", to: "인증 대응까지 맡기는 파트너" },
  },
  {
    id: "ci",
    label: "CI 교체 전국 대응",
    tier: "NEXT",
    icon: "refresh",
    color: "var(--ic-ops)",
    desc: "기관 CI 개편 시 전국 일괄 교체",
    tagline:
      "기관 CI가 바뀌면 전국 지점의 사인을 조사하고 우선순위를 세워 순차 교체합니다.",
    basis:
      "한국도로교통공단 CI 변경에 따른 사인물 현황 조사 용역을 실제로 수행했고, 전국 지부·시험장·교통방송 57건의 사인 이력을 보유하고 있습니다.",
    features: [
      "전국 지점 사인 현황 조사",
      "교체 대상 · 존치 대상 분류",
      "예산 규모별 단계 교체 계획",
      "지점별 시공 일정 관리",
      "교체 전후 증빙 사진 정리",
    ],
    growthSignal: { from: "지점별 개별 발주", to: "본부 단위 다년 교체 사업" },
  },
  {
    id: "care",
    label: "사인 유지관리",
    tier: "NEXT",
    icon: "wrench",
    color: "var(--ic-system)",
    desc: "설치 이후 점검·보수·교체주기",
    tagline: "설치 이후에도 사인의 수명과 브랜드 일관성을 관리합니다.",
    basis:
      "성남시의료원 옥외간판 LED 조명 교체, 은평성모병원·이대서울병원 외부사인 리뉴얼처럼 준공 후 보수·교체 실적이 이미 있습니다.",
    features: [
      "노후 사인 정기 점검",
      "파손 / 조명 이상 접수",
      "교체주기 관리",
      "부서 개편에 따른 실명사인 변경",
      "다지점 사인 유지관리 계약",
    ],
    growthSignal: { from: "일회성 프로젝트 매출", to: "반복형 유지관리 매출" },
  },
  {
    id: "cast",
    label: "주물 현판·조형물",
    tier: "NEXT",
    icon: "plaque",
    color: "var(--ic-partner)",
    desc: "준공표지판·현판·론사인 단독 발주",
    tagline: "준공표지판, 주물·금속 현판, 상징 조형물만 단독으로 발주할 수 있는 창구입니다.",
    basis:
      "한국도로교통공단 전국 시험장·지부 주물현판 20여 건, 서울대 의과대학 론사인(조형물) 등 현판·조형물 단독 실적이 축적되어 있습니다.",
    features: [
      "준공표지판 · 기념 현판",
      "주물 · 청동 · 스테인리스 현판",
      "기관 상징 론사인 · 조형물",
      "각자(刻字) 서체 · 배치 시안",
      "표석 · 기념표지석",
    ],
    growthSignal: { from: "사인 공사의 부속 품목", to: "단독 발주 가능한 제품 라인" },
  },
  {
    id: "exhibition",
    label: "전시·홍보관 사인",
    tier: "Preview",
    icon: "frame",
    color: "var(--ic-ai)",
    desc: "박물관·홍보관 공간 연출",
    tagline: "관람 동선과 전시 목적에 맞춘 전시 그래픽과 공간 연출로 확장합니다.",
    basis:
      "지명원 WORK SCOPE의 EXHIBITION 영역이며, 국립항공박물관·국립농업박물관·서울시립과학관·천연기념물센터 전시 디자인 실적이 있습니다.",
    features: [
      "상설 · 비상설 전시장 기획·설계",
      "박물관 · 홍보관 사인 시스템",
      "전시 Graphic 및 설치물",
      "이미지월 · 연혁벽",
      "관람 동선 안내체계",
    ],
    growthSignal: { from: "건물 안내사인", to: "전시 공간 연출 수주" },
  },
  {
    id: "digital",
    label: "디지털 사이니지 운영",
    tier: "Preview",
    icon: "monitor",
    color: "var(--ic-overview)",
    desc: "전광판·안내 모니터 콘텐츠",
    tagline: "설치한 전광판과 안내 모니터의 콘텐츠를 이어서 운영합니다.",
    basis:
      "FULL COLOR 전광판 사인이 지명원 외부사인 품목에 포함되어 있고, 전시 및 광고용 조명장치 제조업이 직접생산확인에 등재되어 있습니다.",
    features: [
      "전광판 · 안내 모니터 설치",
      "층별안내 화면 콘텐츠 제작",
      "공지 · 행사 화면 교체 운영",
      "원격 콘텐츠 업데이트",
      "장애 발생 시 현장 대응",
    ],
    growthSignal: { from: "하드웨어 납품", to: "콘텐츠 운영 구독" },
  },
  {
    id: "corporate",
    label: "기업·브랜드 프로젝트",
    tier: "Preview",
    icon: "building",
    color: "var(--ic-sales)",
    desc: "사옥·브랜드 공간·다지점",
    tagline: "공공에서 검증된 사인 역량을 기업 사옥과 브랜드 공간으로 확장합니다.",
    basis:
      "삼성전자 SRT-C동, 마곡 오토닉스 R&D센터, 넥센타이어, 쿠팡 부천FC, 기흥 AK플라자 등 민간 실적이 이미 있습니다.",
    features: [
      "기업 사옥 Signage",
      "브랜드 공간 사인",
      "상업시설 사인 패키지",
      "다지점 Sign System",
      "리브랜딩 사인 일괄 교체",
    ],
    growthSignal: { from: "공공 포트폴리오", to: "민간 B2B 시장" },
  },
  {
    id: "partner",
    label: "협력사 등록",
    tier: "Preview",
    icon: "handshake",
    color: "var(--ic-partner)",
    desc: "제작·시공 파트너 상시 모집",
    tagline: "지역 시공과 특수 가공을 함께할 협력사를 상시 등록받는 창구입니다.",
    basis:
      "전국 현장을 수행하는 구조상 지역 시공팀과 금속·조명 특수 가공 파트너가 상시 필요합니다.",
    features: [
      "금속가공 · 조형 파트너",
      "조명 · 채널 파트너",
      "대형 출력 · 시트 파트너",
      "지역 설치·시공팀",
      "보유 설비 · 시공 가능 지역 등록",
    ],
    growthSignal: { from: "아는 업체에 개별 연락", to: "검증된 파트너 풀" },
  },
  {
    id: "takeoff",
    label: "도면 연동 물량 산출",
    tier: "Long-term",
    icon: "ruler",
    color: "var(--ic-risk)",
    desc: "설계 도면에서 사인 물량 자동 집계",
    tagline: "건축 도면에서 실별 사인 물량을 뽑아 견적 초안까지 이어지게 만듭니다.",
    basis:
      "경기도청·고려대 메디사이언스파크·인천국제여객터미널 등 사인 디자인 용역(설계 단계 참여) 실적이 있어 도면 기반 업무 경험이 축적되어 있습니다.",
    features: [
      "도면 실명 리스트 자동 추출",
      "실별 사인 종류 · 수량 집계",
      "층별 물량표 생성",
      "물량표 → 견적 초안 연결",
      "설계 변경분 차이 비교",
    ],
    growthSignal: { from: "손으로 세는 물량 산출", to: "설계사와 함께 일하는 구조" },
  },
];

/** 기존 이름 유지 — 헤더·푸터가 이 이름으로 import한다 */
export const FuturePreviewSheet = FutureSheet;
