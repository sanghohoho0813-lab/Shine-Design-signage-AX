import { IMG } from "@/lib/data";
import {
  COMPANY,
  HISTORY,
  CREDENTIALS,
  DIRECT_PRODUCTION,
  LOCATIONS,
  WORK_SCOPE,
  ONE_STOP,
  ORG,
} from "@/lib/company";
import { RECORD_TOTAL } from "@/lib/records";
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
          <h1 className="t-h1 mt-4 max-w-3xl text-white">{COMPANY.tagline}</h1>
          <p className="measure-wide mt-5 t-body text-nav-inactive">{COMPANY.intro}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {COMPANY.fields.map((f) => (
              <span key={f} className="rounded-full border border-white/25 px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-nav-inactive">
                {f}
              </span>
            ))}
          </div>
          <p className="mt-5 t-meta text-nav-label">
            {COMPANY.name} · 대표이사 {COMPANY.ceo}
          </p>
        </div>
      </PhotoBand>

      {/* One-Stop Service System */}
      <Section tone="surface" size="sm">
        <SectionHeader
          eyebrow="One-Stop Service System"
          title="상담부터 관리까지, 한 회사가 끝까지 책임집니다"
          desc="외부 가공에 맡기지 않고 자체 공장의 생산 시스템을 활용합니다. 중간에 담당이 바뀌지 않으니 책임 소재가 흐려지지 않습니다."
        />
        <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ONE_STOP.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3.5 sm:flex-col sm:items-start sm:gap-1.5"
            >
              <span className="text-[0.6875rem] font-black tabular-nums text-accent">0{i + 1}</span>
              <span className="text-sm font-bold text-ink">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* History */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="t-eyebrow">Corporate History</p>
            <h2 className="t-h2 mt-2 text-ink">2005년의 뿌리, 2024년의 재출발</h2>
            <p className="measure mt-4 t-body">
              2005년 ㈜샤이니스로 옥외광고·환경디자인 사업을 시작해, 2023년 디자인 부문을 분리하고
              2024년 ㈜샤인디자인으로 법인을 새로 세웠습니다. 재출범 첫해에 산업디자인전문회사·여성기업·
              공장등록·직접생산확인까지 갖췄습니다.
            </p>
            <p className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 t-meta">
              업력 20년 · 누적 수행 실적 <b className="text-ink-2 tabular-nums">{RECORD_TOTAL}건</b>
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
              <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                {w.items.map((it) => (
                  <li key={it} className="flex gap-2 t-meta">
                    <span aria-hidden className="mt-[0.42rem] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Organization */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow="Work Organization"
          title="크리에이티브의 원동력은 사람입니다"
          desc="기획·영업·디자인·설계(감리)가 한 프로젝트 안에서 유기적으로 움직이는 TOTAL SERVICE 조직입니다."
        />
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-xl bg-shell px-6 py-2.5 text-sm font-black tracking-wide text-white">{ORG.top}</span>
            <span className="rounded-xl border border-dashed border-line px-4 py-2 text-xs font-semibold text-muted">
              {ORG.audit}
            </span>
          </div>
          <div className="mx-auto mt-3 h-5 w-px bg-line" aria-hidden />
          <div className="flex justify-center">
            <span className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-ink">
              {ORG.lead}
            </span>
          </div>
          {/* 이사 → 5개 팀으로 갈라지는 연결선 */}
          <div aria-hidden className="mx-auto h-4 w-px bg-line" />
          <div aria-hidden className="mx-6 hidden h-px bg-line lg:block" />
          <ul className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            {ORG.teams.map((t) => (
              <li key={t.name} className="rounded-xl border border-line bg-canvas p-4">
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <ul className="mt-2 space-y-1">
                  {t.roles.map((r) => (
                    <li key={r} className="t-meta">
                      · {r}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Credentials + 직접생산 + facility */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="License & Certification"
          title="공공 프로젝트를 수행할 자격을 갖추고 있습니다"
          desc="입찰 서류에 바로 첨부되는 등록·확인서입니다."
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <ul className="space-y-2.5">
            {CREDENTIALS.map((c) => (
              <li key={c.label} className="rounded-xl border border-line bg-canvas px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3 text-sm font-medium text-ink">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[0.6875rem] text-accent" aria-hidden>
                      ✓
                    </span>
                    {c.label}
                  </span>
                  <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted">{c.date}</span>
                </div>
                <p className="mt-1 pl-8 t-meta">{c.issuer}</p>
              </li>
            ))}
          </ul>

          <div>
            <div className="rounded-2xl border border-line bg-canvas p-6">
              <p className="t-eyebrow">Direct Production</p>
              <h3 className="mt-1.5 t-h3 text-ink">직접생산확인 등재 품목</h3>
              <p className="mt-2 t-body">
                조달 계약에서 &lsquo;직접 만들 수 있는가&rsquo;를 증명하는 근거입니다. 아래 7개 품목이
                중소기업유통센터 직접생산확인증명서에 등재되어 있습니다.
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {DIRECT_PRODUCTION.map((d) => (
                  <li key={d} className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-2">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="img-zoom mt-5 overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/images/works/facility-assembly.jpg"
                alt="자체 공장 조립 라인 — 겐트리 크레인과 용접 설비"
                className="aspect-[3/2] w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-4 t-body">
              <b className="text-ink">화성 자체 공장의 가공·조립 라인.</b> 외부 가공에 의존하지 않고 자체
              생산 시스템으로 처리하되, 대형·특수 공정은 검증된 전문 파트너를 결합하는 유연한
              공급구조를 함께 운용합니다.
            </p>
          </div>
        </div>
      </Section>

      {/* Locations + 회사 정보 */}
      <Section tone="canvas" id="contact">
        <SectionHeader
          eyebrow="Locations & Contact"
          title="본사 · 서울사무소 · 화성 공장"
          desc="기획과 설계는 본사와 서울사무소에서, 제작은 화성 공장에서 이뤄집니다."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {LOCATIONS.map((l) => (
            <a
              key={l.name}
              href={`https://map.naver.com/p/search/${encodeURIComponent(l.addr)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tap hover-lift group flex h-full flex-col rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ink">{l.name}</p>
                <span className="rounded bg-soft px-1.5 py-0.5 text-[0.625rem] font-semibold text-ink-2">{l.role}</span>
              </div>
              <p className="mt-1.5 flex-1 t-meta">{l.addr}</p>
              <span className="mt-3 text-[0.6875rem] font-semibold text-accent">지도에서 보기 →</span>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="t-h3 text-ink">회사 정보</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {[
                ["상호", COMPANY.name],
                ["대표이사", COMPANY.ceo],
                ["사업자등록번호", COMPANY.bizNo],
                ["법인등록번호", COMPANY.corpNo],
                ["개업연월일", COMPANY.openedOn],
                ["본점 소재지", COMPANY.address],
                ["업태 / 종목", "제조업 · 전문서비스업 / 간판 및 광고물 제조, 시각·환경 디자인"],
                ["보유 등록", "산업디자인전문회사 · 옥외광고사업 · 공장등록 · 여성기업 · 직접생산확인"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-meta">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium leading-relaxed text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <dl className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
              <div>
                <dt className="t-meta">전화</dt>
                <dd className="mt-0.5">
                  <a href={`tel:${COMPANY.tel.replace(/-/g, "")}`} className="tap text-sm font-bold text-ink hover:text-primary">
                    {COMPANY.tel}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="t-meta">팩스</dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-ink">{COMPANY.fax}</dd>
              </div>
              <div className="min-w-0">
                <dt className="t-meta">이메일</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${COMPANY.email}`} className="tap block truncate text-sm font-bold text-ink hover:text-primary">
                    {COMPANY.email}
                  </a>
                </dd>
              </div>
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
            <a href={`tel:${COMPANY.tel.replace(/-/g, "")}`} className="tap btn btn-on-dark mt-2">
              전화 {COMPANY.tel}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
