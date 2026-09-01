"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp, Inquiry } from "@/lib/store";
import { IMG } from "@/lib/data";
import { toast } from "@/components/Toast";

const CLIENT_TYPES = ["공공기관", "공기업", "병원", "학교", "일반기업", "상업시설", "기타"];
const PROJECT_TYPES = ["외부 간판", "실내사인", "안내·유도사인", "종합 사인시스템", "환경그래픽", "제작·시공", "디자인만", "기타"];
const STATUSES = ["초기 기획", "예산 검토", "설계 진행 중", "발주 예정", "입찰 예정", "빠른 견적 필요"];
const BUDGETS = ["1천만원 미만", "1천~3천만원", "3천~5천만원", "5천만원~1억", "1억 이상", "미정"];

const STEP_TITLES = ["의뢰 기관 유형", "프로젝트 유형", "진행 단계", "프로젝트 개요", "연락처"];

export default function InquiryPage() {
  const { submitInquiry } = useApp();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Inquiry | null>(null);
  const [form, setForm] = useState({
    clientType: "",
    projectType: "",
    status: "",
    location: "",
    schedule: "",
    budget: "",
    sites: "1",
    name: "",
    org: "",
    phone: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    step === 0 ? !!form.clientType
    : step === 1 ? !!form.projectType
    : step === 2 ? !!form.status
    : step === 3 ? true
    : !!form.name && !!form.phone;

  const submit = () => {
    const q = submitInquiry({
      clientType: form.clientType,
      projectType: form.projectType,
      status: form.status,
      location: form.location,
      schedule: form.schedule,
      budget: form.budget,
      sites: form.sites,
      name: form.name,
      org: form.org,
      phone: form.phone,
    });
    setDone(q);
    toast("문의가 접수되어 Business AX 파이프라인에 등록되었습니다");
  };

  if (done) {
    return (
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-shell">
        <img src={IMG.bookingScene} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-hero" aria-hidden />
        <div className="container-page relative py-20">
          <div className="mx-auto max-w-xl text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl text-shell" aria-hidden>
              ✓
            </span>
            <h1 className="t-h1 mt-6 text-white">문의가 접수되었습니다</h1>
            <p className="mt-4 t-body text-nav-inactive">
              영업일 기준 1일 이내에 담당자가 연락드립니다. 현장조사가 필요한 경우 일정을 함께
              조율합니다.
            </p>
            <p className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-nav-primary">
              접수번호 <b className="text-accent">{done.id.toUpperCase()}</b>
            </p>
            <dl className="mt-8 space-y-2 rounded-xl bg-white/10 p-5 text-left text-sm text-nav-primary backdrop-blur">
              {[
                ["기관 유형", done.clientType],
                ["프로젝트", done.projectType],
                ["진행 단계", done.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-nav-muted">{k}</dt>
                  <dd className="font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/portfolio" className="tap hover-lift btn btn-on-dark">
                포트폴리오 더 보기
              </Link>
              <Link href="/" className="tap hover-lift btn btn-accent">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-sm bg-canvas">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
      <p className="t-eyebrow">Project Inquiry</p>
      <h1 className="t-h1 mt-3 text-ink">프로젝트 문의</h1>
      <p className="measure-wide mt-3 t-lead">
        5단계로 프로젝트 조건을 알려주시면, 조건에 맞는 진행 방식을 제안드립니다. 3분이면 충분합니다.
      </p>

      {/* Progress */}
      <div className="mt-8 flex items-start gap-1.5" aria-label={`5단계 중 ${step + 1}단계`}>
        {STEP_TITLES.map((t, i) => (
          <div key={t} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-line"}`} />
            <p className={`mt-2 hidden text-[0.6875rem] leading-tight sm:block ${i === step ? "font-bold text-ink" : "text-muted"}`}>
              {t}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-xs font-semibold text-muted sm:hidden">
        STEP {step + 1}/5 · {STEP_TITLES[step]}
      </p>

      <div className="anim-reveal mt-6 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8" key={step}>
        {step === 0 && <ChipGrid options={CLIENT_TYPES} value={form.clientType} onChange={(v) => set("clientType", v)} label="어떤 기관·회사의 프로젝트인가요?" />}
        {step === 1 && <ChipGrid options={PROJECT_TYPES} value={form.projectType} onChange={(v) => set("projectType", v)} label="어떤 유형의 프로젝트인가요?" />}
        {step === 2 && <ChipGrid options={STATUSES} value={form.status} onChange={(v) => set("status", v)} label="프로젝트는 어느 단계에 있나요?" />}
        {step === 3 && (
          <div className="space-y-4">
            <p className="font-bold text-ink">프로젝트 개요를 알려주세요 <span className="text-xs font-normal text-muted">(선택)</span></p>
            <Field label="위치 / 지역">
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="예: 성남시 분당구" className="input" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="예상 일정">
                <input value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="예: 2026년 11월 설치 희망" className="input" />
              </Field>
              <Field label="현장 수">
                <input value={form.sites} onChange={(e) => set("sites", e.target.value)} inputMode="numeric" className="input" />
              </Field>
            </div>
            <Field label="예산 범위">
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button key={b} onClick={() => set("budget", b)} className={`tap rounded-full px-3.5 py-1.5 text-sm ${form.budget === b ? "bg-shell font-semibold text-white" : "border border-line text-ink-2 hover:bg-soft"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="참고 자료">
              <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-dashed border-line bg-canvas px-4 py-5 text-sm text-muted">
                📎 도면·현장사진 첨부 <span className="rounded bg-soft px-1.5 py-0.5 text-[0.625rem] font-semibold">데모에서는 비활성</span>
              </div>
            </Field>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            {/* 입력 요약 확인 */}
            <div className="rounded-xl bg-canvas p-4">
              <p className="text-xs font-bold tracking-wide text-muted">문의 내용 확인</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[form.clientType, form.projectType, form.status, form.location, form.schedule, form.budget, form.sites && `현장 ${form.sites}곳`]
                  .filter(Boolean)
                  .map((v) => (
                    <span key={v as string} className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-2">
                      {v}
                    </span>
                  ))}
              </div>
            </div>
            <p className="font-bold text-ink">연락받으실 정보를 입력해 주세요</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="담당자 성함 *">
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="홍길동" className="input" />
              </Field>
              <Field label="기관 / 회사명">
                <input value={form.org} onChange={(e) => set("org", e.target.value)} placeholder="○○기관 / ○○주식회사" className="input" />
              </Field>
            </div>
            <Field label="연락처 *">
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="010-0000-0000" inputMode="tel" className="input" />
            </Field>
            <p className="text-xs leading-relaxed text-muted">
              입력하신 정보는 프로젝트 상담 목적에만 사용됩니다. (데모 환경 — 실제 발송되지 않습니다)
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="tap rounded-lg px-4 py-2.5 text-sm font-medium text-muted enabled:hover:bg-soft enabled:hover:text-ink disabled:opacity-0"
          >
            ← 이전
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="tap hover-lift rounded-lg bg-shell px-6 py-2.5 text-sm font-semibold text-white enabled:hover:bg-shell-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!canNext}
              className="tap hover-lift rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-shell enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              문의 접수하기
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 0.5rem;
          background: var(--surface);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--ink);
          transition: border-color 160ms ease-out, box-shadow 160ms ease-out;
        }
        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
        }
      `}</style>
      </div>
    </section>
  );
}

function ChipGrid({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div>
      <p className="font-bold text-ink">{label}</p>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`tap rounded-xl border px-4 py-3.5 text-sm font-medium ${
              value === o
                ? "border-shell bg-shell text-white shadow"
                : "border-line bg-surface text-ink-2 hover:border-secondary hover:bg-soft"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-2">{label}</span>
      {children}
    </label>
  );
}
