"use client";

import Link from "next/link";
import { IMG } from "@/lib/data";

/* Why AX — BEFORE / AFTER / GROWTH story (12+ sections, company-specific) */

const BEFORE = [
  "지인 소개 중심의 수주 — 다음 프로젝트를 예측하기 어려움",
  "프로젝트 정보가 메신저 / 전화 / 문서로 분산",
  "디자인·견적·제작·설치 진행상태를 대표가 기억에 의존해 관리",
  "OEM 제작 일정을 파트너마다 별도로 확인",
  "완료 실적이 다음 영업·입찰 자료로 자동 연결되지 않음",
];

const AFTER = [
  { t: "통합 파이프라인", d: "문의 → 견적 → 디자인 → 제작 → 설치를 하나의 흐름으로 관리" },
  { t: "제작 파트너 관리", d: "OEM·제작파트너 발주/납기/검수를 설치 일정과 연결" },
  { t: "원가·Margin 가시화", d: "프로젝트별 원가 구성과 예상 Margin을 즉시 파악" },
  { t: "입찰 준비 연결", d: "서류·실적·포트폴리오 준비 상태를 점수로 관리" },
  { t: "실적의 자산화", d: "완료 실적 → Portfolio → Next Bid Evidence 자동 연결" },
];

const GROWTH = [
  { stage: "현재", label: "공공기관 소개·수주", now: true },
  { stage: "Next", label: "공공입찰 파이프라인" },
  { stage: "Next", label: "기업·브랜드 프로젝트" },
  { stage: "Next", label: "전국 제작·시공 Partner Network" },
  { stage: "Long-term", label: "Signage Project Intelligence Platform", vision: true },
];

export default function WhyAxPage() {
  return (
    <div className="pb-10">
      {/* Intro */}
      <section className="relative overflow-hidden">
        <img src={IMG.axCover} alt="샤인디자인의 실제 업무 현장" className="h-64 w-full object-cover sm:h-80" style={{ objectPosition: "50% 45%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/60 to-shell/20" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">WHY AX</p>
          <h2 className="mt-1 max-w-2xl text-2xl font-black leading-snug text-white sm:text-3xl">
            좋은 사인을 만드는 회사에서,
            <br />
            프로젝트가 자산이 되는 회사로
          </h2>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-4 pt-10 sm:px-6">
        {/* 01 현재 */}
        <Section n="01" title="샤인디자인의 현재">
          <p className="text-sm leading-relaxed text-ink-2">
            약 3명의 소수 정예 팀이 연 10억원 규모의 사인 프로젝트를 수행합니다. 공공기관 수행 경험이 최대
            자산이며, 매출 대부분이 소개와 기존 기관 관계에서 나옵니다. 제조 등록을 보유하되 상당 부분의
            제작은 전문 파트너와의 협업으로 이뤄지는 <b className="text-ink">유연한 공급구조</b>입니다.
          </p>
        </Section>

        {/* 02 BEFORE */}
        <Section n="02" title="BEFORE — 지금까지의 방식" img={IMG.whyAx01} imgAlt="수기 문서와 전화로 관리되던 기존 업무 방식">
          <ul className="space-y-2">
            {BEFORE.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                <span className="mt-0.5 text-[var(--ic-risk)]" aria-hidden>✕</span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink-2">
            <b className="text-ink">이 회사라면</b> — 프로젝트가 9건만 넘어가도 &lsquo;성남시청 승인이 언제
            났는지&rsquo;, &lsquo;빛나라사인 검수가 끝났는지&rsquo;를 대표의 기억이 감당해야 합니다. 놓치는
            순간이 곧 납기 리스크입니다.
          </p>
        </Section>

        {/* 03 AFTER */}
        <Section n="03" title="AFTER — AX가 바꾸는 것" img={IMG.whyAx02} imgAlt="통합 대시보드로 관리되는 개선된 업무 방식">
          <div className="grid gap-3 sm:grid-cols-2">
            {AFTER.map((a) => (
              <div key={a.t} className="rounded-xl border border-line bg-surface p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="text-[var(--ic-evidence)]" aria-hidden>✓</span>
                  {a.t}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{a.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 04 Closed Loop */}
        <Section n="04" title="Closed Loop — 고객 행동이 회사 자산이 되는 구조">
          <div className="rounded-2xl bg-shell p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold">
              {["Customer 문의", "Pipeline", "디자인 · 견적", "제작 파트너", "설치", "증빙", "Portfolio 자산", "다음 입찰 · 영업"].map((s, i, arr) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1.5 ${i === 0 || i === arr.length - 1 ? "bg-accent text-shell" : "bg-white/10 text-nav-primary"}`}>{s}</span>
                  {i < arr.length - 1 && <span className="text-nav-muted" aria-hidden>→</span>}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-nav-inactive">
              고객 사이트의 문의가 파이프라인에 자동으로 들어오고, 완료된 프로젝트는 증빙과 포트폴리오
              자산으로 전환되어 다음 입찰의 신뢰도가 됩니다. 화면 두 개가 아니라{" "}
              <b className="text-nav-active">하나의 데이터 루프</b>입니다.
            </p>
          </div>
        </Section>

        {/* 05 AI */}
        <Section n="05" title="AI가 실제로 하는 일">
          <p className="text-sm leading-relaxed text-ink-2">
            AI는 장식이 아니라 판단이 필요한 곳에만 배치했습니다. <b className="text-ink">Project Risk ·
            Margin Guard · Bid Readiness · Next Action</b> 4개 엔진이 여러 데이터를 함께 비교해 &lsquo;오늘
            무엇을 해야 하는가&rsquo;를 이유와 함께 제시합니다. 현재는 규칙 기반 데모(AI READY)로 동작하며,
            같은 구조에 LLM API를 연결할 수 있습니다.
          </p>
        </Section>

        {/* 06 GROWTH */}
        <Section n="06" title="GROWTH — 확장 로드맵" img={IMG.whyAx03} imgAlt="성장과 확장을 나타내는 그래프와 공간">
          <ol className="space-y-2.5">
            {GROWTH.map((g, i) => (
              <li key={g.label} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-16 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    g.now ? "bg-accent text-shell" : g.vision ? "bg-shell text-accent" : "bg-soft text-ink-2"
                  }`}
                >
                  {g.stage}
                </span>
                <span className={`text-sm font-semibold ${g.vision ? "text-ink" : "text-ink-2"}`}>{g.label}</span>
                {i === 0 && <span className="rounded bg-[var(--ic-evidence)]/12 px-1.5 py-0.5 text-[9px] font-bold text-[var(--ic-evidence)]">운영 중</span>}
                {i > 0 && <span className="rounded bg-soft px-1.5 py-0.5 text-[9px] font-bold text-muted">향후 확장</span>}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            ※ 장기 비전은 로드맵이며 현재 제공 기능이 아닙니다. 현재 계약 범위는 Customer Platform과 Business
            AX MVP입니다.
          </p>
        </Section>

        {/* Return CTA */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
          <p className="font-bold text-ink">이 구조가 실제로 동작하는 모습을 보세요</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/ax" className="tap hover-lift rounded-lg bg-shell px-6 py-3 text-sm font-semibold text-white hover:bg-shell-2">
              대시보드로 돌아가기
            </Link>
            <Link href="/" className="tap hover-lift rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink-2 hover:bg-soft">
              고객 사이트 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ n, title, img, imgAlt, children }: { n: string; title: string; img?: string; imgAlt?: string; children: React.ReactNode }) {
  return (
    <section className="anim-reveal">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-xl font-black text-accent">{n}</span>
        <h3 className="text-lg font-black text-ink sm:text-xl">{title}</h3>
      </div>
      {img && (
        <div className="mb-4 overflow-hidden rounded-2xl">
          <img src={img} alt={imgAlt ?? ""} className="aspect-[21/9] w-full object-cover" loading="lazy" />
        </div>
      )}
      {children}
    </section>
  );
}
