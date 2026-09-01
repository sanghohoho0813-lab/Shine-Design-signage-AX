import type { IconName } from "./icons";

/* ---------------------------------------------------------------------------
   AX 메뉴 — 업무 흐름대로 묶는다.
   오늘 볼 것 → 지금 굴리는 프로젝트 → 다음 수주로 잇는 것 → 시스템
   사이드바 · 모바일 Drawer · 전역 검색(⌘K)이 모두 이 구조를 공유한다.
--------------------------------------------------------------------------- */

export interface AxMenuItem {
  href: string;
  label: string;
  icon: IconName;
  color: string;
  /** 전역 검색에서 보여줄 한 줄 설명 */
  desc: string;
  /** 대표 역할에서만 노출 */
  ceoOnly?: boolean;
}

export interface AxMenuGroup {
  label: string;
  hint: string;
  items: AxMenuItem[];
}

export const AX_MENU_GROUPS: AxMenuGroup[] = [
  {
    label: "오늘",
    hint: "지금 확인할 것",
    items: [
      {
        href: "/ax",
        label: "대시보드",
        icon: "dashboard",
        color: "var(--ic-overview)",
        desc: "KPI · 오늘 할 일 · AI 브리핑 요약",
      },
      {
        href: "/ax/briefing",
        label: "AI 브리핑",
        icon: "ai",
        color: "var(--ic-ai)",
        desc: "리스크 · Margin · 입찰 준비도 · 다음 행동",
      },
    ],
  },
  {
    label: "프로젝트 운영",
    hint: "진행 중인 일",
    items: [
      {
        href: "/ax/pipeline",
        label: "프로젝트 관리",
        icon: "pipeline",
        color: "var(--ic-ops)",
        desc: "문의부터 완료까지 8단계 파이프라인",
      },
      {
        href: "/ax/quotes",
        label: "견적·원가 관리",
        icon: "quote",
        color: "var(--ic-sales)",
        desc: "원가 구성과 예상 Margin",
        ceoOnly: true,
      },
      {
        href: "/ax/production",
        label: "제작·파트너 관리",
        icon: "factory",
        color: "var(--ic-partner)",
        desc: "자체 공장 · 파트너 발주 · 검수 · 설치 연결",
      },
    ],
  },
  {
    label: "성장·자산",
    hint: "다음 수주로 잇기",
    items: [
      {
        href: "/ax/bids",
        label: "입찰·제안 관리",
        icon: "bid",
        color: "var(--ic-crm)",
        desc: "입찰 준비도 · 서류 체크리스트",
      },
      {
        href: "/ax/evidence",
        label: "증빙·리포트",
        icon: "evidence",
        color: "var(--ic-evidence)",
        desc: "완료 실적 증빙 · 실적 요약 인쇄",
      },
    ],
  },
  {
    label: "시스템",
    hint: "설명과 설정",
    items: [
      {
        href: "/ax/why-ax",
        label: "Why AX",
        icon: "story",
        color: "var(--ic-risk)",
        desc: "샤인디자인 이야기 12섹션",
      },
      {
        href: "/ax/settings",
        label: "설정",
        icon: "settings",
        color: "var(--ic-system)",
        desc: "테마 · 글자 크기 · 역할 · 데모",
      },
    ],
  },
];

export const AX_MENU_FLAT: AxMenuItem[] = AX_MENU_GROUPS.flatMap((g) => g.items);
