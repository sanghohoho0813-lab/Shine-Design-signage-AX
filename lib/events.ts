/* ---------------------------------------------------------------------------
   Event Tracking Ready (Platform v2.5 §0-9)

   실제 Analytics를 붙이기 전이라도 "어떤 고객 행동이 중요한가"를 코드로 고정한다.
   지금은 localStorage 링 버퍼(최근 200건)에 쌓고, 뒤에 GA4 / PostHog / Supabase
   이벤트 테이블로 sink만 바꾸면 된다. 모든 클릭을 추적하지 않는다 —
   Primary Conversion(문의)과 그 앞뒤 행동만 이름을 가진다.
--------------------------------------------------------------------------- */

export type EventName =
  | "view_home"
  | "view_portfolio_item"
  | "search_records"
  | "start_inquiry"
  | "submit_inquiry"
  | "view_inquiry_status"
  | "open_future_preview"
  | "ax_inquiry_status"
  | "ax_project_advance"
  | "ax_action_state"
  | "theme_change"
  | "demo_reset";

export interface TrackedEvent {
  name: EventName;
  at: string;
  props?: Record<string, string | number | boolean | undefined>;
}

const KEY = "shine-ax-events-v1";
const MAX = 200;
/** 외부 Analytics sink — 환경변수가 있으면 같은 이벤트를 beacon으로도 보낸다. 없으면 no-op */
const SINK = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

export function track(name: EventName, props?: TrackedEvent["props"]) {
  if (typeof window === "undefined") return;
  try {
    const list: TrackedEvent[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    list.push({ name, at: new Date().toISOString(), props });
    while (list.length > MAX) list.shift();
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("shine-events"));
    if (SINK && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(SINK, JSON.stringify({ name, at: list[list.length - 1].at, props }));
    }
  } catch {}
}

export function readEvents(): TrackedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearEvents() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("shine-events"));
  } catch {}
}

/** 이벤트 이름 → 사람이 읽는 설명 (설정 > 데이터에서 보여준다) */
export const EVENT_LABELS: Record<EventName, string> = {
  view_home: "홈 방문",
  view_portfolio_item: "포트폴리오 상세 열람",
  search_records: "수행 실적 검색",
  start_inquiry: "문의 시작",
  submit_inquiry: "문의 접수 (Primary Conversion)",
  view_inquiry_status: "문의 현황 확인",
  open_future_preview: "향후 확장 미리보기",
  ax_inquiry_status: "AX · 문의 응대 상태 변경",
  ax_project_advance: "AX · 프로젝트 단계 진행",
  ax_action_state: "AX · Action 상태 변경",
  theme_change: "테마 변경",
  demo_reset: "Demo Reset",
};
