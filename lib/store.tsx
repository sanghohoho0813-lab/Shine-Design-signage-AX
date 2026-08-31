"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Project, seedProjects, Stage } from "./data";

/* ---------------------------------------------------------------------------
   Global app state (theme / font / role / motion / data bridge) — demo-only,
   persisted to localStorage. Demo Reset restores the seed.
--------------------------------------------------------------------------- */

export const THEMES = [
  { id: "shine", name: "Shine Graphite Gold", shell: "#16181d", accent: "#c4a15f" },
  { id: "navy", name: "Executive Navy", shell: "#0f2747", accent: "#d4a94f" },
  { id: "teal", name: "Teal Champagne", shell: "#073b3f", accent: "#c9a76a" },
  { id: "burgundy", name: "Burgundy Gold", shell: "#3a1523", accent: "#c5a15a" },
  { id: "indigo", name: "Indigo Lavender", shell: "#25265b", accent: "#b59ae7" },
  { id: "forest", name: "Forest Sand", shell: "#173d32", accent: "#c9a66b" },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];

export type Role = "ceo" | "staff" | "customer";
export const ROLE_LABELS: Record<Role, string> = { ceo: "대표", staff: "직원", customer: "고객" };

export type FontScale = "sm" | "md" | "lg";
const FONT_SCALES: Record<FontScale, number> = { sm: 0.92, md: 1, lg: 1.1 };

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
}

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
  resetDemo: () => void;
  hydrated: boolean;
  isEmbedded: boolean; // rendered inside a device-preview iframe
}

const Ctx = createContext<AppState | null>(null);

const LS_KEY = "shine-ax-state-v1";

import { STAGES } from "./data";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("shine");
  const [fontScale, setFontScale] = useState<FontScale>("md");
  const [role, setRole] = useState<Role>("ceo");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.theme) setTheme(s.theme);
        if (s.fontScale) setFontScale(s.fontScale);
        if (s.role) setRole(s.role);
        if (typeof s.reducedMotion === "boolean") setReducedMotion(s.reducedMotion);
        if (Array.isArray(s.projects)) setProjects(s.projects);
        if (Array.isArray(s.inquiries)) setInquiries(s.inquiries);
      }
    } catch {}
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ theme, fontScale, role, reducedMotion, projects, inquiries }),
      );
    } catch {}
  }, [theme, fontScale, role, reducedMotion, projects, inquiries, hydrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--font-scale", String(FONT_SCALES[fontScale]));
    document.documentElement.dataset.motion = reducedMotion ? "reduced" : "full";
  }, [theme, fontScale, reducedMotion]);

  const value = useMemo<AppState>(
    () => ({
      theme,
      setTheme,
      fontScale,
      setFontScale,
      role,
      setRole,
      reducedMotion,
      setReducedMotion,
      projects,
      advanceProject: (id) =>
        setProjects((ps) =>
          ps.map((p) => {
            if (p.id !== id) return p;
            const i = STAGES.indexOf(p.stage);
            return i < STAGES.length - 1 ? { ...p, stage: STAGES[i + 1], risk: i + 1 >= 6 ? "낮음" : p.risk } : p;
          }),
        ),
      inquiries,
      submitInquiry: (i) => {
        const inquiry: Inquiry = {
          ...i,
          id: "q" + Date.now().toString(36),
          createdAt: new Date().toISOString().slice(0, 10),
          axStatus: "접수",
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
          },
          ...ps,
        ]);
        return inquiry;
      },
      markInquiry: (id, s) => setInquiries((qs) => qs.map((q) => (q.id === id ? { ...q, axStatus: s } : q))),
      resetDemo: () => {
        setProjects(seedProjects);
        setInquiries([]);
        setTheme("shine");
        setFontScale("md");
        setRole("ceo");
        setReducedMotion(false);
        try {
          localStorage.removeItem(LS_KEY);
        } catch {}
      },
      hydrated,
      isEmbedded,
    }),
    [theme, fontScale, role, reducedMotion, projects, inquiries, hydrated, isEmbedded],
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
