"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Project, seedProjects, Stage, ProductionOrder, ProductionStatus } from "./data";
import { track } from "./events";

/* ---------------------------------------------------------------------------
   Global app state (theme / font / role / motion / data bridge / action
   lifecycle) — demo-only, persisted to localStorage. Demo Reset restores seed.

   저장 형식은 v1 키를 그대로 쓰고 필드만 더한다. 이전 버전이 남긴 값은
   읽을 때 변환하고 절대 버리지 않는다(테마 id 마이그레이션, doneActions →
   actionStates).
--------------------------------------------------------------------------- */

/* -------------------------------- Theme ---------------------------------- */
/* Unified v3.0 Q-1 — Canonical 팔레트에서 고른 7종. 01은 브랜드 시드(Onyx Gold를
   샤인 골드로 미세조정)이고 나머지 6종은 표준 팔레트 그대로다.
   v16에서 Burgundy Slate·Plum Indigo를 뺐다 — 공공 발주처 화면에서 와인·자주 계열이
   사인 시안 색과 부딪혀 실제로 고르지 않는 색이었다. 저장값은 아래 맵으로 살린다. */
export const THEMES = [
  { id: "shine", name: "Shine Graphite Gold", seed: "Onyx Gold 기반 브랜드 시드", shell: "#16181d", accent: "#c4a15f" },
  { id: "navy-blue", name: "Deep Navy Blue", seed: "Canonical 01", shell: "#0b1830", accent: "#17a889" },
  { id: "navy-gold", name: "Navy Gold", seed: "Canonical 02", shell: "#111a2d", accent: "#d0a84b" },
  { id: "emerald-gold", name: "Emerald Gold", seed: "Canonical 03", shell: "#11332b", accent: "#b4862a" },
  { id: "forest-sage", name: "Forest Sage", seed: "Canonical 04", shell: "#17352c", accent: "#a58e4d" },
  { id: "deep-teal", name: "Deep Teal", seed: "Canonical 05", shell: "#08323a", accent: "#d2704c" },
  { id: "steel-platinum", name: "Steel Platinum", seed: "Canonical 09", shell: "#24303b", accent: "#4c9aaa" },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];

/** 삭제·개명된 테마 id → 가장 가까운 현재 id. 저장값을 잃지 않는다.
    v1~v11 짧은 id와 v16에서 뺀 2종을 함께 받는다. */
const LEGACY_THEME: Record<string, ThemeId> = {
  navy: "navy-gold",
  teal: "deep-teal",
  forest: "forest-sage",
  copper: "steel-platinum",
  // v16 제거 — 어두운 셸 + 따뜻한 강조는 shine, 어두운 셸 + 차가운 강조는 navy-blue로
  burgundy: "shine",
  "burgundy-slate": "shine",
  indigo: "navy-blue",
  "plum-indigo": "navy-blue",
};
export function normalizeTheme(id: unknown): ThemeId {
  if (typeof id !== "string") return "shine";
  if ((THEMES as readonly { id: string }[]).some((t) => t.id === id)) return id as ThemeId;
  return LEGACY_THEME[id] ?? "shine";
}

/* --------------------------------- Role ---------------------------------- */
export type Role = "ceo" | "staff" | "customer";
export const ROLE_LABELS: Record<Role, string> = { ceo: "대표", staff: "직원", customer: "고객" };

/* 기본 크기를 다시 1.1배 상향(1.1 → 1.22). 단계 간 차이도 뚜렷하게 벌린다. */
export type FontScale = "md" | "lg" | "xl";
const FONT_SCALES: Record<FontScale, number> = { md: 1.22, lg: 1.45, xl: 1.7 };

/* -------------------------------- Inquiry -------------------------------- */
export interface Inquiry {
  id: string;
  clientType: string;
  projectType: string;
  status: string;
  location: string;
  schedule: string;
  budget: string;
  sites: string;
  name: string;
  org: string;
  phone: string;
  createdAt: string;
  axStatus: "접수" | "검토중" | "상담예약";
  /** 상태가 바뀐 시각 — 고객 문의 현황 타임라인에 쓴다 */
  statusLog?: { status: Inquiry["axStatus"]; at: string }[];
}

/* ---------------------------- Action Lifecycle --------------------------- */
/* v3.0 §22 — 추천은 보여주고 끝나지 않는다. 확인 → 실행중 → 완료 / 보류 / 무시(사유) */
export type ActionState = "todo" | "confirmed" | "doing" | "done" | "hold" | "skip";
export const ACTION_LABELS: Record<ActionState, string> = {
  todo: "추천됨",
  confirmed: "확인",
  doing: "실행중",
  done: "완료",
  hold: "보류",
  skip: "무시",
};
export interface ActionRecord {
  state: ActionState;
  reason?: string;
  at: string; // ISO
}

/* ------------------------- Delivery Stage / Baseline ---------------------- */
/* v3.0 §15 — DEMO → PILOT → PRODUCTION. 단계는 '선언'이며 화면 라벨과 KPI 표시 규칙을 바꾼다.
   Demo 값으로 개선율을 계산하지 않도록 DEMO 단계에서는 Baseline 대비 변화를 숨긴다. */
export type DeliveryStage = "DEMO" | "PILOT" | "PRODUCTION";
export const STAGE_LABELS: Record<DeliveryStage, string> = {
  DEMO: "DEMO — 시연 데이터",
  PILOT: "PILOT — 실데이터 일부 · 현장 실증",
  PRODUCTION: "PRODUCTION — 실제 업무 사용",
};
export interface BaselineSnapshot {
  at: string;
  stage: DeliveryStage;
  values: Record<string, string>;
  note?: string;
}

/* ------------------------------- Bid Record ------------------------------ */
/* v14 — 입찰은 시드(seedBids)가 고정 자료이고, 상태·결과만 여기 쌓인다.
   결과(낙찰/유찰/미참여)가 입력돼야 '낙찰률' KPI가 "—"에서 숫자가 된다. */
export type BidStatus = "발굴" | "검토" | "준비" | "제출" | "결과대기";
export const BID_STATUSES: BidStatus[] = ["발굴", "검토", "준비", "제출", "결과대기"];
export type BidResult = "낙찰" | "유찰" | "미참여";
export interface BidRecord {
  status: BidStatus;
  result?: BidResult;
  resultAt?: string;
  note?: string;
  log: { status: BidStatus | BidResult; at: string }[];
}

/* v15 — 사람이 직접 등록하는 입찰. 시드와 같은 모양이되 체크리스트는 bidChecks로 따로 둔다 */
export interface CustomBid {
  id: string;
  institution: string;
  project: string;
  deadline: string;
  amount: number;
  status: BidStatus;
  createdAt: string;
}
/* v15 — 제작 발주 상태·검수 기록 (시드 발주 6건 + 신규 발주) */
export interface OrderRecord {
  status: ProductionStatus;
  qc: "완료" | "대기" | "-";
  at: string;
  log: { status: string; at: string }[];
}

/** 저장 형식 버전 — 앞으로의 마이그레이션 기준점. 키는 바꾸지 않는다.
    v3: bidStates · readAlerts / v4: customBids · bidChecks · customOrders · orderStates (없으면 빈 값) */
export const SCHEMA_VERSION = 4;

interface AppState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  fontScale: FontScale;
  setFontScale: (f: FontScale) => void;
  role: Role;
  setRole: (r: Role) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  projects: Project[];
  advanceProject: (id: string) => void;
  /** 원가·견적금액 등 필드 수정 — 견적·원가 관리에서 실입력 */
  updateProject: (id: string, patch: Partial<Project>) => void;
  inquiries: Inquiry[];
  submitInquiry: (i: Omit<Inquiry, "id" | "createdAt" | "axStatus">) => Inquiry;
  markInquiry: (id: string, s: Inquiry["axStatus"]) => void;
  /** 완료 상태인 action id 목록 — 이전 API 호환 */
  doneActions: string[];
  toggleAction: (id: string) => void;
  actionStates: Record<string, ActionRecord>;
  setActionState: (id: string, state: ActionState, reason?: string) => void;
  /** v3.0 §10 — KPI·데이터 품질·사용교육을 책임지는 사람 */
  axOwner: string;
  setAxOwner: (v: string) => void;
  /** 마지막으로 데이터가 바뀐 시각 — Data Freshness 표시용 */
  updatedAt: string | null;
  deliveryStage: DeliveryStage;
  setDeliveryStage: (s: DeliveryStage) => void;
  baselines: BaselineSnapshot[];
  captureBaseline: (values: Record<string, string>, note?: string) => void;
  /** 입찰 상태·결과 (id → 기록). 시드 status는 기록이 없을 때만 쓴다 */
  bidStates: Record<string, BidRecord>;
  setBidStatus: (id: string, status: BidStatus, seedStatus: BidStatus) => void;
  /** 결과 입력. 낙찰이면 파이프라인에 '승인' 단계 프로젝트를 만든다 */
  setBidResult: (id: string, result: BidResult, seed: { status: BidStatus; institution: string; project: string; amount: number; deadline: string }, note?: string) => void;
  /** 읽은 알림 키 — 새로고침해도 유지 */
  readAlerts: string[];
  markAlertsRead: (keys: string[]) => void;
  /** v15 — 신규 입찰 등록 */
  customBids: CustomBid[];
  addBid: (b: Omit<CustomBid, "id" | "createdAt" | "status">) => CustomBid;
  /** v15 — 입찰별 서류 체크 (bidId → label → done). 시드 값은 기록이 없을 때만 쓴다 */
  bidChecks: Record<string, Record<string, boolean>>;
  setBidCheck: (bidId: string, label: string, done: boolean) => void;
  /** v15 — 제작 발주 */
  customOrders: ProductionOrder[];
  addOrder: (o: Omit<ProductionOrder, "id" | "status" | "qc" | "orderDate">) => ProductionOrder;
  orderStates: Record<string, OrderRecord>;
  setOrderState: (id: string, patch: { status?: ProductionStatus; qc?: OrderRecord["qc"] }, seed: { status: ProductionStatus; qc: OrderRecord["qc"] }) => void;
  /** v15 — 납기 변경 + 사유 (deadlineLog) */
  changeDeadline: (id: string, to: string, reason: string) => void;
  /** 전체 상태를 JSON 문자열로 — 백업·이관용 */
  exportState: () => string;
  /** JSON을 검증해 들여온다. 실패하면 false, 기존 데이터는 그대로 */
  importState: (json: string) => boolean;
  resetDemo: () => void;
  hydrated: boolean;
  isEmbedded: boolean; // rendered inside a device-preview iframe
}

const Ctx = createContext<AppState | null>(null);

const LS_KEY = "shine-ax-state-v1";

import { STAGES } from "./data";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<ThemeId>("shine");
  const [fontScale, setFontScale] = useState<FontScale>("md");
  const [role, setRole] = useState<Role>("ceo");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [actionStates, setActionStates] = useState<Record<string, ActionRecord>>({});
  const [axOwner, setAxOwner] = useState("권유진");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [deliveryStage, setDeliveryStage] = useState<DeliveryStage>("DEMO");
  const [baselines, setBaselines] = useState<BaselineSnapshot[]>([]);
  const [bidStates, setBidStates] = useState<Record<string, BidRecord>>({});
  const [readAlerts, setReadAlerts] = useState<string[]>([]);
  const [customBids, setCustomBids] = useState<CustomBid[]>([]);
  const [bidChecks, setBidChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [customOrders, setCustomOrders] = useState<ProductionOrder[]>([]);
  const [orderStates, setOrderStates] = useState<Record<string, OrderRecord>>({});
  const [hydrated, setHydrated] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.theme) setThemeRaw(normalizeTheme(s.theme));
        if (s.fontScale && s.fontScale in FONT_SCALES) setFontScale(s.fontScale);
        if (s.role) setRole(s.role);
        if (typeof s.reducedMotion === "boolean") setReducedMotion(s.reducedMotion);
        if (Array.isArray(s.projects)) setProjects(s.projects);
        if (Array.isArray(s.inquiries)) setInquiries(s.inquiries);
        if (typeof s.axOwner === "string" && s.axOwner.trim()) setAxOwner(s.axOwner);
        if (typeof s.updatedAt === "string") setUpdatedAt(s.updatedAt);
        if (s.deliveryStage === "DEMO" || s.deliveryStage === "PILOT" || s.deliveryStage === "PRODUCTION") setDeliveryStage(s.deliveryStage);
        if (Array.isArray(s.baselines)) setBaselines(s.baselines);
        if (s.bidStates && typeof s.bidStates === "object") setBidStates(s.bidStates);
        if (Array.isArray(s.readAlerts)) setReadAlerts(s.readAlerts.filter((k: unknown) => typeof k === "string"));
        if (Array.isArray(s.customBids)) setCustomBids(s.customBids);
        if (s.bidChecks && typeof s.bidChecks === "object") setBidChecks(s.bidChecks);
        if (Array.isArray(s.customOrders)) setCustomOrders(s.customOrders);
        if (s.orderStates && typeof s.orderStates === "object") setOrderStates(s.orderStates);
        // actionStates가 있으면 그대로, 없고 옛 doneActions만 있으면 완료 상태로 변환
        if (s.actionStates && typeof s.actionStates === "object") {
          setActionStates(s.actionStates);
        } else if (Array.isArray(s.doneActions)) {
          const migrated: Record<string, ActionRecord> = {};
          const at = new Date().toISOString();
          s.doneActions.forEach((id: string) => (migrated[id] = { state: "done", at }));
          setActionStates(migrated);
        }
      }
    } catch {}
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
    setHydrated(true);
  }, []);

  const doneActions = useMemo(
    () => Object.entries(actionStates).filter(([, r]) => r.state === "done").map(([id]) => id),
    [actionStates],
  );

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          theme,
          fontScale,
          role,
          reducedMotion,
          projects,
          inquiries,
          actionStates,
          doneActions, // 구버전 호환용으로 함께 남긴다
          axOwner,
          updatedAt,
          deliveryStage,
          baselines,
          bidStates,
          readAlerts,
          customBids,
          bidChecks,
          customOrders,
          orderStates,
          schemaVersion: SCHEMA_VERSION,
        }),
      );
    } catch {}
  }, [theme, fontScale, role, reducedMotion, projects, inquiries, actionStates, doneActions, axOwner, updatedAt, deliveryStage, baselines, bidStates, readAlerts, customBids, bidChecks, customOrders, orderStates, hydrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--font-scale", String(FONT_SCALES[fontScale]));
    document.documentElement.dataset.font = fontScale;
    document.documentElement.dataset.motion = reducedMotion ? "reduced" : "full";
  }, [theme, fontScale, reducedMotion]);

  const touch = () => setUpdatedAt(new Date().toISOString());

  const value = useMemo<AppState>(
    () => ({
      theme,
      setTheme: (t) => {
        setThemeRaw(t);
        track("theme_change", { theme: t });
      },
      fontScale,
      setFontScale,
      role,
      setRole,
      reducedMotion,
      setReducedMotion,
      projects,
      advanceProject: (id) => {
        setProjects((ps) =>
          ps.map((p) => {
            if (p.id !== id) return p;
            const i = STAGES.indexOf(p.stage);
            if (i >= STAGES.length - 1) return p;
            const next = STAGES[i + 1];
            // 단계 진입 시각을 남긴다 — 문의→견적 소요일 같은 KPI의 측정 근거
            const stageLog = [...(p.stageLog ?? []), { stage: next, at: new Date().toISOString() }];
            return { ...p, stage: next, risk: i + 1 >= 6 ? "낮음" : p.risk, stageLog };
          }),
        );
        touch();
        track("ax_project_advance", { id });
      },
      updateProject: (id, patch) => {
        setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
        touch();
        track("ax_project_update", { id, fields: Object.keys(patch).join(",") });
      },
      inquiries,
      submitInquiry: (i) => {
        const now = new Date().toISOString();
        const inquiry: Inquiry = {
          ...i,
          id: "q" + Date.now().toString(36),
          createdAt: now.slice(0, 10),
          axStatus: "접수",
          statusLog: [{ status: "접수", at: now }],
        };
        setInquiries((qs) => [inquiry, ...qs]);
        setProjects((ps) => [
          {
            id: "pi-" + inquiry.id,
            client: i.org || "신규 고객",
            name: `${i.projectType} 문의`,
            category: i.clientType,
            stage: "문의" as Stage,
            deadline: i.schedule || "미정",
            budget: 0,
            owner: "미배정",
            risk: "낮음" as const,
            fromInquiry: true,
            stageLog: [{ stage: "문의" as Stage, at: now }],
          },
          ...ps,
        ]);
        touch();
        track("submit_inquiry", { id: inquiry.id, clientType: i.clientType, projectType: i.projectType });
        return inquiry;
      },
      markInquiry: (id, s) => {
        setInquiries((qs) =>
          qs.map((q) =>
            q.id === id
              ? { ...q, axStatus: s, statusLog: [...(q.statusLog ?? []), { status: s, at: new Date().toISOString() }] }
              : q,
          ),
        );
        touch();
        track("ax_inquiry_status", { id, status: s });
      },
      doneActions,
      toggleAction: (id) => {
        const cur = actionStates[id]?.state;
        const next: ActionState = cur === "done" ? "todo" : "done";
        setActionStates((m) => ({ ...m, [id]: { state: next, at: new Date().toISOString() } }));
        touch();
        track("ax_action_state", { id, state: next });
      },
      actionStates,
      setActionState: (id, state, reason) => {
        setActionStates((m) => ({ ...m, [id]: { state, reason, at: new Date().toISOString() } }));
        touch();
        track("ax_action_state", { id, state, reason });
      },
      axOwner,
      setAxOwner: (v) => {
        setAxOwner(v);
        touch();
      },
      updatedAt,
      deliveryStage,
      setDeliveryStage: (st) => {
        setDeliveryStage(st);
        touch();
      },
      baselines,
      captureBaseline: (values, note) => {
        setBaselines((b) => [...b, { at: new Date().toISOString(), stage: deliveryStage, values, note }]);
        touch();
      },
      bidStates,
      setBidStatus: (id, status, seedStatus) => {
        const at = new Date().toISOString();
        setBidStates((m) => {
          const cur = m[id] ?? { status: seedStatus, log: [] };
          return { ...m, [id]: { ...cur, status, log: [...cur.log, { status, at }] } };
        });
        touch();
        track("ax_bid_update", { id, status });
      },
      setBidResult: (id, result, seed, note) => {
        const at = new Date().toISOString();
        setBidStates((m) => {
          const cur = m[id] ?? { status: seed.status, log: [] };
          return { ...m, [id]: { ...cur, status: "결과대기", result, resultAt: at, note, log: [...cur.log, { status: result, at }] } };
        });
        if (result === "낙찰") {
          // Bridge 4 — 낙찰은 곧 프로젝트. 같은 입찰로 두 번 만들지 않는다
          setProjects((ps) =>
            ps.some((p) => p.id === "pb-" + id)
              ? ps
              : [
                  {
                    id: "pb-" + id,
                    client: seed.institution,
                    name: seed.project,
                    category: "입찰 수주",
                    stage: "승인" as Stage,
                    deadline: seed.deadline,
                    budget: seed.amount,
                    owner: "미배정",
                    risk: "보통" as const,
                    riskNote: "낙찰 직후 — 원가 7항목 입력 필요",
                    isBid: true,
                    stageLog: [{ stage: "승인" as Stage, at }],
                  },
                  ...ps,
                ],
          );
        }
        touch();
        track("ax_bid_update", { id, result });
      },
      readAlerts,
      markAlertsRead: (keys) => {
        setReadAlerts((r) => Array.from(new Set([...r, ...keys])));
      },
      customBids,
      addBid: (b) => {
        const bid: CustomBid = { ...b, id: "bc-" + Date.now().toString(36), status: "발굴", createdAt: new Date().toISOString() };
        setCustomBids((xs) => [bid, ...xs]);
        touch();
        track("ax_bid_create", { id: bid.id });
        return bid;
      },
      bidChecks,
      setBidCheck: (bidId, label, done) => {
        setBidChecks((m) => ({ ...m, [bidId]: { ...(m[bidId] ?? {}), [label]: done } }));
        touch();
        track("ax_bid_update", { id: bidId, check: label, done });
      },
      customOrders,
      addOrder: (o) => {
        const order: ProductionOrder = { ...o, id: "mc-" + Date.now().toString(36), status: "발주 전", qc: "-", orderDate: new Date().toISOString().slice(0, 10) };
        setCustomOrders((xs) => [order, ...xs]);
        touch();
        track("ax_order_update", { id: order.id, status: "발주 전" });
        return order;
      },
      orderStates,
      setOrderState: (id, patch, seed) => {
        const at = new Date().toISOString();
        setOrderStates((m) => {
          const cur = m[id] ?? { status: seed.status, qc: seed.qc, at, log: [] };
          const next = { ...cur, ...patch, at };
          const label = patch.status ? patch.status : `QC ${patch.qc}`;
          return { ...m, [id]: { ...next, log: [...cur.log, { status: label, at }] } };
        });
        touch();
        track("ax_order_update", { id, ...patch });
      },
      changeDeadline: (id, to, reason) => {
        const at = new Date().toISOString();
        setProjects((ps) =>
          ps.map((p) => (p.id === id && p.deadline !== to ? { ...p, deadline: to, deadlineLog: [...(p.deadlineLog ?? []), { from: p.deadline, to, reason, at }] } : p)),
        );
        touch();
        track("ax_deadline_change", { id, to, reason });
      },
      exportState: () =>
        JSON.stringify(
          {
            schemaVersion: SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            theme, fontScale, role, reducedMotion, projects, inquiries, actionStates, axOwner, updatedAt, deliveryStage, baselines, bidStates, readAlerts,
            customBids, bidChecks, customOrders, orderStates,
          },
          null,
          2,
        ),
      importState: (json) => {
        try {
          const s = JSON.parse(json);
          if (!s || typeof s !== "object" || !Array.isArray(s.projects)) return false;
          // 필수 형태만 검증 — 들여온 뒤에도 옛 필드는 같은 마이그레이션을 탄다
          setThemeRaw(normalizeTheme(s.theme));
          if (s.fontScale && s.fontScale in FONT_SCALES) setFontScale(s.fontScale);
          if (s.role === "ceo" || s.role === "staff" || s.role === "customer") setRole(s.role);
          setReducedMotion(!!s.reducedMotion);
          setProjects(s.projects);
          setInquiries(Array.isArray(s.inquiries) ? s.inquiries : []);
          if (s.actionStates && typeof s.actionStates === "object") setActionStates(s.actionStates);
          else if (Array.isArray(s.doneActions)) {
            const m: Record<string, ActionRecord> = {};
            const at = new Date().toISOString();
            s.doneActions.forEach((id: string) => (m[id] = { state: "done", at }));
            setActionStates(m);
          } else setActionStates({});
          if (typeof s.axOwner === "string" && s.axOwner.trim()) setAxOwner(s.axOwner);
          if (s.deliveryStage === "DEMO" || s.deliveryStage === "PILOT" || s.deliveryStage === "PRODUCTION") setDeliveryStage(s.deliveryStage);
          setBaselines(Array.isArray(s.baselines) ? s.baselines : []);
          setBidStates(s.bidStates && typeof s.bidStates === "object" ? s.bidStates : {});
          setReadAlerts(Array.isArray(s.readAlerts) ? s.readAlerts.filter((k: unknown) => typeof k === "string") : []);
          setCustomBids(Array.isArray(s.customBids) ? s.customBids : []);
          setBidChecks(s.bidChecks && typeof s.bidChecks === "object" ? s.bidChecks : {});
          setCustomOrders(Array.isArray(s.customOrders) ? s.customOrders : []);
          setOrderStates(s.orderStates && typeof s.orderStates === "object" ? s.orderStates : {});
          touch();
          return true;
        } catch {
          return false;
        }
      },
      resetDemo: () => {
        setProjects(seedProjects);
        setInquiries([]);
        setActionStates({});
        setThemeRaw("shine");
        setFontScale("md");
        setRole("ceo");
        setReducedMotion(false);
        setAxOwner("권유진");
        setUpdatedAt(null);
        setDeliveryStage("DEMO");
        setBaselines([]);
        setBidStates({});
        setReadAlerts([]);
        setCustomBids([]);
        setBidChecks({});
        setCustomOrders([]);
        setOrderStates({});
        try {
          localStorage.removeItem(LS_KEY);
        } catch {}
        track("demo_reset");
      },
      hydrated,
      isEmbedded,
    }),
    [theme, fontScale, role, reducedMotion, projects, inquiries, actionStates, doneActions, axOwner, updatedAt, deliveryStage, baselines, bidStates, readAlerts, customBids, bidChecks, customOrders, orderStates, hydrated, isEmbedded],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

/* Live clock — "2026.08.31 (일) 14:02:11" and compact mobile variant */
export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return { full: "", date: "", time: "", compact: "" };
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const p = (n: number) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}.${p(now.getMonth() + 1)}.${p(now.getDate())} (${days[now.getDay()]})`;
  const time = `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  return { full: `${date} ${time}`, date, time, compact: `${p(now.getMonth() + 1)}.${p(now.getDate())} ${days[now.getDay()]}` };
}

/** "13:52" 같은 짧은 시각 — Data Freshness 표시용 */
export function fmtTime(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
