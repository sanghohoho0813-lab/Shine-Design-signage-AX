import { IMG } from "@/lib/data";
import { COMPANY, HISTORY, CREDENTIALS, LOCATIONS, WORK_SCOPE } from "@/lib/company";
import Link from "next/link";

export const metadata = { title: "회사소개 — 샤인디자인" };

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="relative isolate overflow-hidden">
        <img src={IMG.brandStory} alt="샤인디자인 스튜디오" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-shell/85" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">ABOUT SHINE DESIGN</p>
          <h1 className="mt-3 text-3xl font-black leading-snug text-white sm:text-4xl">
            &ldquo;{COMPANY.belief}&rdquo;
          </h1>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-nav-inactive">{COMPANY.intro}</p>
          <p className="mt-4 text-sm text-nav-label">
            {COMPANY.name} · 대표이사 {COMPANY.ceo}
          </p>
        </div>
      </section>

      {/* History */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.18em] text-accent">HISTORY</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
              2005년의 뿌리,
              <br />
              2024년의 재도약
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              2005년 ㈜샤이니스로 시작한 환경디자인 업력이 2024년 ㈜샤인디자인으로 이어졌습니다. 법인
              재출범 첫해에 산업디자인전문회사·여성기업·공장등록을 갖추고, 한국도로교통공단 전국
              프로젝트를 수행하며 다시 출발선을 넘었습니다.
            </p>
          </div>
          <ol className="relative space-y-3 lg:col-span-3">
            <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
            {HISTORY.map((h) => (
              <li key={h.date + h.event} className="relative flex gap-4">
                <span className="z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent bg-surface" aria-hidden />
                <div className="hover-lift flex-1 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm">
                  <span className="text-xs font-black tabular-nums text-accent">{h.date}</span>
                  <p className="mt-0.5 text-sm font-medium text-ink">{h.event}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work scope */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">WORK SCOPE</p>
          <h2 className="mt-2 text-2xl font-black text-ink">토탈환경디자인 — 우리가 다루는 영역</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {WORK_SCOPE.map((w) => (
              <div key={w.en} className="hover-lift rounded-2xl border border-line bg-canvas p-6">
                <p className="text-xs font-black tracking-[0.15em] text-accent">{w.en}</p>
                <h3 className="mt-1 text-lg font-bold text-ink">{w.ko}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials + facility */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-accent">CREDENTIALS</p>
            <h2 className="mt-2 text-2xl font-black text-ink">공공 프로젝트를 수행할 자격을 갖추고 있습니다</h2>
            <ul className="mt-6 space-y-2.5">
              {CREDENTIALS.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm">
                  <span className="flex items-center gap-3 text-sm font-medium text-ink-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[0.6875rem] text-accent" aria-hidden>✓</span>
                    {c.label}
                  </span>
                  <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="img-zoom overflow-hidden rounded-2xl shadow-lg">
              <img src="/images/works/facility-assembly.jpg" alt="자체 공장 조립 라인 — 겐트리 크레인과 용접 설비" className="aspect-[3/2] w-full object-cover" loading="lazy" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              <b className="text-ink">자체 가공·조립 라인 + 전문 파트너 네트워크.</b> 화성 제1공장과 남양주
              제2공장의 가공·조립·용접 설비를 기반으로, 프로젝트 특성에 맞는 전문 제작·시공 파트너를
              결합하는 유연한 공급구조를 운용합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">LOCATIONS</p>
          <h2 className="mt-2 text-2xl font-black text-ink">본사 · 서울사무소 · 2개 공장</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LOCATIONS.map((l) => (
              <div key={l.name} className="hover-lift rounded-xl border border-line bg-canvas p-4">
                <p className="text-sm font-bold text-ink">{l.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{l.addr}</p>
              </div>
            ))}
          </div>
          <Link href="/inquiry" className="tap hover-lift mt-8 inline-block rounded-lg bg-shell px-6 py-3 text-sm font-semibold text-white hover:bg-shell-2">
            프로젝트 상담 요청
          </Link>
        </div>
      </section>
    </>
  );
}
