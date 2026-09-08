"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Project, seedProjects, Stage } from "./data";
import { track } from "./events";

/* ---------------------------------------------------------------------------
   Global app state (theme / font / role / motion / data bridge / action
   lifecycle) — demo-only, persisted to localStorage. Demo Reset restores seed.

   저장 형식은 v1 키를 그대로 쓰고 필드만 더한다. 이전 버전이 남긴 값은
   읽을 때 변환하고 절대 버리지 않는다(테마 id 마이그레이션, doneActions →
   actionStates).
--------------------------------------------------------------------------- */

/* -------------------------------- Theme ---------------------------------- */
/* Unified v3.0 Q-1 — Canonical 9 Theme. 01은 브랜드 시드(Onyx Gold를 샤인
   골드로 미세조정)이고 나머지 8종은 표준 팔레트 그대로다. */
export const THEMES = [
  { id: "shine", name: "Shine Graphite Gold", seed: "Onyx Gold 기반 브랜드 시드", shell: "#16181d", accent: "#c4a15f" },
  { id: "navy-blue", name: "Deep Navy Blue", seed: "Canonical 01", shell: "#0b1830", accent: "#17a889" },
  { id: "navy-gold", name: "Navy Gold", seed: "Canonical 02", shell: "#111a2d", accent: "#d0a84b" },
  { id: "emerald-gold", name: "Emerald Gold", seed: "Canonical 03", shell: "#11332b", accent: "#b4862a" },
  { id: "forest-sage", name: "Forest Sage", seed: "Canonical 04", shell: "#17352c", accent: "#a58e4d" },
  { id: "deep-teal", name: "Deep Teal", seed: "Canonical 05", shell: "#08323a", accent: "#d2704c" },
  { id: "burgundy-slate", name: "Burgundy Slate", seed: "Canonical 07", shell: "#3a1724", accent: "#a85c72" },
  { id: "plum-indigo", name: "Plum Indigo", seed: "Canonical 08", shell: "#291a3d", accent: "#8b5aa6" },
  { id: "steel-platinum", name: "Steel Platinum", seed: "Canonical 09", shell: "#24303b", accent: "#4c9aaa" },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];

/** v1~v11에서 저장된 옛 테마 id → 가장 가까운 Canonical id. 저장값을 잃지 않는다. */
const LEGACY_THEME: Record<string, ThemeId> = {
  navy: "navy-gold",
  teal: "deep-teal",
  burgundy: "burgundy-slate",
  indigo: "plum-indigo",
  forest: "forest-sage",
  copper: "steel-platinum",
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

/** 저장 형식 버전 — 앞으로의 마이그레이션 기준점. 키는 바꾸지 않는다. */
export const SCHEMA_VERSION = 2;

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
          schemaVersion: SCHEMA_VERSION,
        }),
      );
    } catch {}
  }, [theme, fontScale, role, reducedMotion, projects, inquiries, actionStates, doneActions, axOwner, updatedAt, deliveryStage, baselines, hydrated]);

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
      exportState: () =>
        JSON.stringify(
          {
            schemaVersion: SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            theme, fontScale, role, reducedMotion, projects, inquiries, actionStates, axOwner, updatedAt, deliveryStage, baselines,
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
        try {
          localStorage.removeItem(LS_KEY);
        } catch {}
        track("demo_reset");
      },
      hydrated,
      isEmbedded,
    }),
    [theme, fontScale, role, reducedMotion, projects, inquiries, actionStates, doneActions, axOwner, updatedAt, deliveryStage, baselines, hydrated, isEmbedded],
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
