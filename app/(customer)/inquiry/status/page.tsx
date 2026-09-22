"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp, type Inquiry } from "@/lib/store";
import { STAGES } from "@/lib/data";
import { COMPANY } from "@/lib/company";
import { track } from "@/lib/events";
import { Section } from "@/components/ui";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------------------------
   내 문의 현황 — Closed Loop의 마지막 단계 (Unified v3.0 U-1 / U-4)
   고객이 문의를 넣고 → AX에서 담당자가 응대 상태를 바꾸면 → 여기서 그 변화가
   보인다. 같은 브라우저(Demo)에서 재확인하는 구조이며, 로그인·SMS 알림은
   NOT BUILDING(PROJECT_SPEC 참조).
--------------------------------------------------------------------------- */

const STATUS_FLOW: Inquiry["axStatus"][] = ["접수", "검토중", "상담예약"];
const STATUS_DESC: Record<Inquiry["axStatus"], string> = {
  접수: "문의가 접수되어 담당자 배정을 기다리고 있습니다.",
  검토중: "담당자가 현장 조건과 유사 실적을 검토하고 있습니다.",
  상담예약: "상담 일정이 잡혔습니다. 담당자가 연락드립니다.",
};

function fmt(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function InquiryStatusPage() {
  const { inquiries, projects, hydrated } = useApp();
  const [q, setQ] = useState("");
  const router = useRouter();

  /* Repeat / Reorder (U-2 #8) — 같은 조건으로 다시 문의: 초안에 채워 넣고 위저드로 보낸다 */
  const reInquire = (i: Inquiry) => {
    try {
      localStorage.setItem(
        "shine-inquiry-draft",
        JSON.stringify({
          form: { clientType: i.clientType, projectType: i.projectType, status: i.status, location: i.location, schedule: "", budget: i.budget, sites: i.sites, name: i.name, org: i.org, phone: i.phone, notes: "" },
          step: 0,
        }),
      );
    } catch {}
    router.push("/inquiry");
  };

  useEffect(() => {
    track("view_inquiry_status");
  }, []);

  const list = inquiries.filter((i) => !q || i.id.toUpperCase().includes(q.toUpperCase()) || i.org.includes(q) || i.name.includes(q));

  return (
    <>
      <Section tone="surface" size="sm" className="border-b border-line">
        <p className="t-eyebrow">Inquiry Status</p>
        <h1 className="t-h1 mt-3 text-ink">내 문의 현황</h1>
        <p className="measure-wide mt-4 t-lead">
          접수된 문의가 지금 어느 단계에 있는지 확인하실 수 있습니다. 담당자가 상태를 바꾸면 이 화면에
          바로 반영됩니다.
        </p>
      </Section>

      <Section tone="canvas">
        {!hydrated ? (
          <div className="h-40 animate-pulse rounded-2xl bg-soft" aria-hidden />
        ) : inquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="t-h3 text-ink">아직 접수된 문의가 없습니다</p>
            <p className="mx-auto mt-2 max-w-sm t-body">
              5단계 양식으로 프로젝트 조건을 남기시면 접수번호가 발급되고, 이곳에서 진행 상태를 확인하실
              수 있습니다.
            </p>
            <Link href="/inquiry" className="tap hover-lift btn btn-accent mt-6">
              프로젝트 문의하기
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-line bg-surface px-4 shadow-sm focus-within:border-accent">
              <span className="t-meta">접수번호</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="예: Q1ABCDE 또는 기관명"
                aria-label="접수번호 또는 기관명 검색"
                className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>

            <ul className="space-y-4">
              {list.map((i) => {
                const idx = STATUS_FLOW.indexOf(i.axStatus);
                const proj = projects.find((p) => p.id === "pi-" + i.id);
                const stageIdx = proj ? STAGES.indexOf(proj.stage) : -1;
                return (
                  <li key={i.id} className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="t-meta">
                          접수번호 <b className="text-ink">{i.id.toUpperCase()}</b> · {i.createdAt}
                        </p>
                        <h2 className="mt-1 t-h3 text-ink">
                          {i.projectType} <span className="font-normal text-muted">· {i.clientType}</span>
                        </h2>
                        <p className="mt-0.5 text-sm text-ink-2">
                          {i.org || "기관명 미입력"} · {i.name}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">{i.axStatus}</span>
                    </div>

                    {/* 응대 상태 타임라인 */}
                    <ol className="mt-5 grid grid-cols-3 gap-2">
                      {STATUS_FLOW.map((s, k) => {
                        const reached = k <= idx;
                        const log = i.statusLog?.filter((l) => l.status === s).at(-1);
                        return (
                          <li key={s} className="min-w-0">
                            <div className={`h-1.5 rounded-full ${reached ? "bg-accent" : "bg-soft"}`} aria-hidden />
                            <p className={`mt-2 text-xs font-bold ${reached ? "text-ink" : "text-muted"}`}>{s}</p>
                            <p className="t-meta truncate">{log ? fmt(log.at) : reached ? "—" : "예정"}</p>
                          </li>
                        );
                      })}
                    </ol>
                    <p className="mt-3 rounded-xl bg-canvas p-3.5 text-sm text-ink-2">{STATUS_DESC[i.axStatus]}</p>

                    {/* 내부 진행 단계 — 문의가 프로젝트로 넘어가면 여기서도 보인다 */}
                    {proj && (
                      <div className="mt-4">
                        <p className="text-[0.6875rem] font-bold tracking-wide text-muted">
                          프로젝트 진행 단계
                          {/^\d{4}-\d{2}-\d{2}$/.test(proj.deadline) && <span className="ml-2 font-normal normal-case">· 예정 {proj.stage === "완료" ? "완료일" : "납기"} <b className="tabular-nums text-ink">{proj.deadline}</b></span>}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {STAGES.map((st, k) => (
                            <span
                              key={st}
                              className={`rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold ${
                                k < stageIdx ? "bg-soft text-ink-2" : k === stageIdx ? "bg-shell text-white" : "bg-canvas text-muted"
                              }`}
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                      <button onClick={() => reInquire(i)} className="tap btn btn-ghost btn-sm">
                        이 조건으로 다시 문의
                      </button>
                    </div>
                    <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                      {[
                        ["진행 단계(문의 당시)", i.status],
                        ["예산 범위", i.budget || "미정"],
                        ["희망 일정", i.schedule || "미정"],
                        ["위치", i.location || "미입력"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3">
                          <dt className="text-muted">{k}</dt>
                          <dd className="font-medium text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ul>
            {list.length === 0 && (
              <p className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center t-body">
                &lsquo;{q}&rsquo;와 일치하는 문의가 없습니다.
              </p>
            )}
          </>
        )}

        <div className="mt-8 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <p className="t-h3 text-ink">급한 변경이 있으시면</p>
          <p className="mt-1 t-body">
            전화 <a href={`tel:${COMPANY.tel.replace(/-/g, "")}`} className="tap tap-pad font-bold text-ink hover:text-primary">{COMPANY.tel}</a> 또는{" "}
            <a href={`mailto:${COMPANY.email}`} className="tap tap-pad font-bold text-ink hover:text-primary">{COMPANY.email}</a>로 접수번호와 함께
            알려주세요.
          </p>
          <p className="mt-3 t-meta">
            Demo 안내: 이 화면은 같은 브라우저에서 접수한 문의를 보여줍니다. 실서비스에서는 접수번호·연락처
            인증 후 조회하도록 연결합니다.
          </p>
        </div>
      </Section>
    </>
  );
}
