import { IMG } from "@/lib/data";
import { COMPANY, HISTORY, CREDENTIALS, LOCATIONS, WORK_SCOPE } from "@/lib/company";
import Link from "next/link";
import { Section, SectionHeader, PhotoBand } from "@/components/ui";

export const metadata = { title: "회사소개 — 샤인디자인" };

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <PhotoBand image={IMG.brandStory} alt="샤인디자인 스튜디오" position="55% 50%" scrim="hero">
        <div className="py-20 lg:py-24">
          <p className="t-eyebrow">About Shine Design</p>
          <h1 className="t-h1 mt-4 max-w-3xl text-white">&ldquo;{COMPANY.belief}&rdquo;</h1>
          <p className="measure-wide mt-5 t-body text-nav-inactive">{COMPANY.intro}</p>
          <p className="mt-5 t-meta text-nav-label">
            {COMPANY.name} · 대표이사 {COMPANY.ceo}
          </p>
        </div>
      </PhotoBand>

      {/* History */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="t-eyebrow">History</p>
            <h2 className="t-h2 mt-2 text-ink">2005년의 뿌리, 2024년의 재도약</h2>
            <p className="measure mt-4 t-body">
              2005년 ㈜샤이니스로 시작한 환경디자인 업력이 2024년 ㈜샤인디자인으로 이어졌습니다. 법인
              재출범 첫해에 산업디자인전문회사·여성기업·공장등록을 갖추고, 한국도로교통공단 전국
              프로젝트를 수행하며 다시 출발선을 넘었습니다.
            </p>
          </div>
          <ol className="relative space-y-3 lg:col-span-3">
            <span aria-hidden className="absolute bottom-4 left-[0.4rem] top-4 w-px bg-line" />
            {HISTORY.map((h) => (
              <li key={h.date + h.event} className="relative flex gap-4">
                <span className="z-10 mt-2 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent bg-canvas" aria-hidden />
                <div className="hover-lift min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm">
                  <span className="text-xs font-black tabular-nums text-accent">{h.date}</span>
                  <p className="mt-0.5 text-sm font-medium leading-snug text-ink">{h.event}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Work scope */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Work Scope"
          title="토탈환경디자인 — 우리가 다루는 영역"
          desc="사인 하나가 아니라 공간 전체의 정보와 인상을 다룹니다."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {WORK_SCOPE.map((w) => (
            <div key={w.en} className="hover-lift flex h-full flex-col rounded-2xl border border-line bg-canvas p-6">
              <p className="text-[0.6875rem] font-black tracking-[0.14em] text-accent">{w.en}</p>
              <h3 className="mt-1.5 t-h3 text-ink">{w.ko}</h3>
              <p className="mt-2.5 t-body">{w.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Credentials + facility */}
      <Section tone="canvas">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="t-eyebrow">Credentials</p>
            <h2 className="t-h2 mt-2 text-ink">공공 프로젝트를 수행할 자격을 갖추고 있습니다</h2>
            <ul className="mt-6 space-y-2.5">
              {CREDENTIALS.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm"
                >
                  <span className="flex min-w-0 items-center gap-3 text-sm font-medium text-ink-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[0.6875rem] text-accent" aria-hidden>
                      ✓
                    </span>
                    {c.label}
                  </span>
                  <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="img-zoom overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/images/works/facility-assembly.jpg"
                alt="자체 공장 조립 라인 — 겐트리 크레인과 용접 설비"
                className="aspect-[3/2] w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-4 t-body">
              <b className="text-ink">자체 가공·조립 라인 + 전문 파트너 네트워크.</b> 화성 제1공장과 남양주
              제2공장의 가공·조립·용접 설비를 기반으로, 프로젝트 특성에 맞는 전문 제작·시공 파트너를
              결합하는 유연한 공급구조를 운용합니다.
            </p>
          </div>
        </div>
      </Section>

      {/* Locations + 회사 정보 */}
      <Section tone="surface" id="contact">
        <SectionHeader
          eyebrow="Locations & Contact"
          title="본사 · 서울사무소 · 2개 공장"
          desc="설계는 본사와 서울사무소에서, 제작은 화성·남양주 자체 공장에서 이뤄집니다."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((l) => (
            <a
              key={l.name}
              href={`https://map.naver.com/p/search/${encodeURIComponent(l.addr)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tap hover-lift group flex h-full flex-col rounded-xl border border-line bg-canvas p-4"
            >
              <p className="text-sm font-bold text-ink">{l.name}</p>
              <p className="mt-1 flex-1 t-meta">{l.addr}</p>
              <span className="mt-3 text-[0.6875rem] font-semibold text-accent">지도에서 보기 →</span>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-2xl border border-line bg-canvas p-6 sm:p-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="t-h3 text-ink">회사 정보</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {[
                ["상호", COMPANY.name],
                ["대표이사", COMPANY.ceo],
                ["사업자등록번호", COMPANY.bizNo],
                ["본사 소재지", COMPANY.address],
                ["업태 / 종목", "제조업 · 전문서비스업 / 간판 및 광고물 제조, 시각·제품 디자인"],
                ["보유 등록", "산업디자인전문회사 · 옥외광고사업 · 공장등록 · 여성기업"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-meta">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium leading-relaxed text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-shell p-5">
            <p className="t-h3 text-white">프로젝트를 검토 중이신가요?</p>
            <p className="mt-2 t-meta text-nav-inactive">
              초기 기획 단계여도 좋습니다. 5단계 양식으로 3분이면 접수됩니다.
            </p>
            <Link href="/inquiry" className="tap hover-lift btn btn-accent mt-5">
              프로젝트 문의하기
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
