"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IMG } from "@/lib/data";

const SECTIONS = [
  ["01", "현재"],
  ["02", "고객 여정"],
  ["03", "업무 Flow"],
  ["04", "BEFORE"],
  ["05", "왜 지금"],
  ["06", "Customer"],
  ["07", "AFTER"],
  ["08", "Data Bridge"],
  ["09", "AI"],
  ["10", "Growth"],
  ["11", "Data 자산"],
  ["12", "Roadmap"],
] as const;

/** 섹션 바로가기 + 읽기 진행률 — 12개 섹션 긴 글을 헤매지 않게 */
function WhyAxNav() {
  const [active, setActive] = useState("01");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map(([n]) => document.getElementById(`why-${n}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("why-", ""));
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (n: string) => {
    const el = document.getElementById(`why-${n}`);
    if (!el) return;
    const reduced = document.documentElement.dataset.motion === "reduced";
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div
      className="sticky z-20 border-b border-line bg-surface/95 backdrop-blur"
      style={{ top: "var(--ax-topbar-h, 3.5rem)" }}
    >
      <div className="h-0.5 bg-soft">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} aria-hidden />
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5 scrollbar-thin sm:px-6" role="tablist" aria-label="Why AX 섹션 바로가기">
        {SECTIONS.map(([n, label]) => (
          <button
            key={n}
            role="tab"
            aria-selected={active === n}
            onClick={() => go(n)}
            className={`tap flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              active === n ? "bg-shell text-white" : "text-muted hover:bg-soft hover:text-ink"
            }`}
          >
            <span className={active === n ? "text-accent" : ""}>{n}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Why AX — 회사 맞춤 12 Section Story (Unified v1.1 §14 구조 준수)
   사실관계는 회사소개서(2024)·사업자등록증 기준, 성장 시나리오는 로드맵 표기 */

const BEFORE = [
  "지인 소개·기존 관계 중심의 수주 — 다음 분기 일감을 예측하기 어려움",
  "프로젝트 정보가 메신저 / 전화 / 견적서 파일로 분산",
  "디자인·견적·제작·설치 진행상태를 대표가 기억에 의존해 관리",
  "자체 공장 물량과 파트너 발주 일정을 각각 따로 확인",
  "완료한 실적이 다음 영업·입찰 자료로 자동 연결되지 않음",
];

const AFTER = [
  { t: "통합 파이프라인", d: "문의 → 견적 → 디자인 → 제작 → 설치를 하나의 흐름으로" },
  { t: "제작 라인 통합 관리", d: "자체 1·2공장 물량과 파트너 발주를 한 화면에서" },
  { t: "원가·Margin 가시화", d: "프로젝트별 원가 구성과 예상 Margin 즉시 파악" },
  { t: "입찰 준비 연결", d: "서류·실적·포트폴리오 준비 상태를 점수로 관리" },
  { t: "실적의 자산화", d: "완료 실적 → Portfolio → Next Bid Evidence 자동 연결" },
];

const GROWTH = [
  { stage: "현재", label: "한국도로교통공단 등 공공기관 수주 — 전국 60여 건", now: true },
  { stage: "Next", label: "공공입찰 파이프라인 — 준비도 점수 기반 상시 대응" },
  { stage: "Next", label: "기업·브랜드 프로젝트 — 사옥·리브랜딩·다지점" },
  { stage: "Next", label: "전국 제작·시공 Partner Network" },
  { stage: "장기", label: "Signage Project Intelligence Platform", vision: true },
];

export default function WhyAxPage() {
  return (
    <div className="pb-10">
      {/* Intro */}
      <section className="relative overflow-hidden">
        <img src={IMG.axCover} alt="샤인디자인의 실제 업무 현장" className="h-64 w-full object-cover sm:h-80" style={{ objectPosition: "50% 45%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/60 to-shell/20" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">WHY AX — 샤인디자인 이야기</p>
          <h2 className="mt-1 max-w-2xl text-2xl font-black leading-snug text-white sm:text-3xl">
            좋은 사인을 만드는 회사에서,
            <br />
            프로젝트가 자산이 되는 회사로
          </h2>
        </div>
      </section>

      <WhyAxNav />

      <div className="mx-auto max-w-5xl space-y-10 px-4 pt-10 sm:px-6">
        {/* 01 */}
        <Section n="01" title="샤인디자인의 현재">
          <p className="text-sm leading-relaxed text-ink-2">
            2005년 ㈜샤이니스로 시작한 환경디자인 업력이 2024년 <b className="text-ink">㈜샤인디자인(대표
            권유진)</b>으로 이어졌습니다. 재출범 첫해에 한국도로교통공단 전국 지부·운전면허시험장·교통방송
            60여 건을 비롯해 국립소방병원, 부천성모병원, 여주경찰서, 보령시 원도심 재생 시리즈까지
            수행했습니다. 소수 정예 팀과 화성·남양주 2개 자체 공장, 전문 파트너 네트워크가 이 실적을
            만들었습니다.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              ["60+", "도로교통공단 실적"],
              ["2개", "자체 공장 (화성·남양주)"],
              ["6종", "공공 자격 (여성기업 외)"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-2xl font-black text-accent">{v}</p>
                <p className="mt-1 text-xs text-muted">{l}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 02 */}
        <Section n="02" title="고객(발주 담당자)의 여정">
          <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-semibold">
            {["예산 확보", "업체 탐색", "실적 확인", "견적 비교", "발주", "준공 검사", "증빙 서류"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <span className="rounded-full bg-soft px-3 py-1.5 text-ink-2">{s}</span>
                {i < arr.length - 1 && <span className="text-muted" aria-hidden>→</span>}
              </span>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink-2">
            <b className="text-ink">이 회사라면</b> — 공공 담당자는 &lsquo;유사 실적이 있는가&rsquo;와
            &lsquo;서류가 완비되는가&rsquo;를 가장 먼저 봅니다. 강서·예산·원주 시험장 실적 사진이 정리된
            포트폴리오 페이지 하나가 소개 전화 열 통보다 빠릅니다.
          </p>
        </Section>

        {/* 03 */}
        <Section n="03" title="내부 업무 Flow">
          <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-semibold">
            {["문의", "현장 실측", "디자인", "사양·견적", "승인", "자체공장/파트너 제작", "설치", "준공·증빙"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1.5 ${i === 5 ? "bg-accent/15 text-accent" : "bg-soft text-ink-2"}`}>{s}</span>
                {i < arr.length - 1 && <span className="text-muted" aria-hidden>→</span>}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            여덟 단계 중 하나라도 늦어지면 설치일이 밀립니다. 특히 <b className="text-ink">제작 단계는 자체
            공장 물량과 외부 파트너 발주가 섞여</b> 있어, 일정 충돌이 가장 자주 생기는 지점입니다.
          </p>
        </Section>

        {/* 04 BEFORE */}
        <Section n="04" title="BEFORE — 반복되는 실제 문제" img={IMG.whyAx01} imgAlt="수기 문서와 전화로 관리되던 기존 업무 방식">
          <ul className="space-y-2">
            {BEFORE.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                <span className="mt-0.5 text-[var(--ic-risk)]" aria-hidden>✕</span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink-2">
            <b className="text-ink">이 회사라면</b> — 포항 시험장 사인 개선과 부천성모병원 유도사인이 같은
            주에 제작에 들어가면, &lsquo;공단 CI 승인이 언제 났는지&rsquo;, &lsquo;병원 야간 설치 인력이
            확정됐는지&rsquo;를 대표의 기억이 감당해야 합니다. 놓치는 순간이 곧 납기 리스크입니다.
          </p>
        </Section>

        {/* 05 */}
        <Section n="05" title="왜 지금 AX인가">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["전국으로 넓어진 현장", "원주·마산·보령·인천 — 현장이 멀수록 상태 공유가 어렵습니다."],
              ["소수 정예 팀", "관리 인원을 늘리는 대신, 관리 도구가 사람 몫을 대신해야 합니다."],
              ["입찰 확장 준비", "소개 수주에서 입찰 수주로 가려면 실적·서류가 데이터로 정리돼야 합니다."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-sm font-bold text-ink">{t}</p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-2">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 06 */}
        <Section n="06" title="Customer Front가 바꾸는 것">
          <p className="text-sm leading-relaxed text-ink-2">
            도로교통공단부터 보령시까지의 실적이 <b className="text-ink">실제 현장 사진과 함께</b> 정리된
            웹사이트는 그 자체로 영업 자료입니다. 발주 담당자가 유사 실적을 확인하고, 5단계 문의 양식으로
            현장 조건까지 남기면 — 상담 전화가 아니라 <b className="text-ink">정리된 프로젝트 요구사항</b>이
            도착합니다.
          </p>
        </Section>

        {/* 07 AFTER */}
        <Section n="07" title="AFTER — Business AX가 바꾸는 것" img={IMG.whyAx02} imgAlt="통합 대시보드로 관리되는 개선된 업무 방식">
          <div className="grid gap-3 sm:grid-cols-2">
            {AFTER.map((a) => (
              <div key={a.t} className="rounded-xl border border-line bg-surface p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="text-[var(--ic-evidence)]" aria-hidden>✓</span>
                  {a.t}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">{a.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 08 */}
        <Section n="08" title="Data Bridge — 고객 행동이 회사 자산이 되는 구조">
          <div className="rounded-2xl bg-shell p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-semibold">
              {["Customer 문의", "Pipeline", "디자인 · 견적", "공장 · 파트너", "설치", "증빙", "Portfolio 자산", "다음 입찰 · 영업"].map((s, i, arr) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1.5 ${i === 0 || i === arr.length - 1 ? "bg-accent text-shell" : "bg-white/10 text-nav-primary"}`}>{s}</span>
                  {i < arr.length - 1 && <span className="text-nav-muted" aria-hidden>→</span>}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-nav-inactive">
              고객 사이트의 문의가 파이프라인에 자동으로 들어오고, 완료된 프로젝트는 증빙과 포트폴리오
              자산으로 전환되어 다음 입찰의 신뢰도가 됩니다. 화면 두 개가 아니라{" "}
              <b className="text-nav-active">하나의 데이터 루프</b>입니다.
            </p>
          </div>
        </Section>

        {/* 09 */}
        <Section n="09" title="AI Decision Layer — AI가 실제로 하는 일">
          <p className="text-sm leading-relaxed text-ink-2">
            AI는 장식이 아니라 판단이 필요한 곳에만 배치했습니다. <b className="text-ink">Project Risk ·
            Margin Guard · Bid Readiness · Next Action</b> 4개 엔진이 일정·원가·서류 데이터를 함께 비교해
            &lsquo;오늘 무엇을 해야 하는가&rsquo;를 이유와 함께 제시합니다. 현재는 규칙 기반 데모(AI
            READY)로 동작하며, 같은 구조에 LLM API를 연결할 수 있습니다.
          </p>
        </Section>

        {/* 10 */}
        <Section n="10" title="Revenue Growth Loop" img={IMG.whyAx03} imgAlt="성장과 확장을 나타내는 공간">
          <p className="text-sm leading-relaxed text-ink-2">
            공단 실적 60여 건은 이미 <b className="text-ink">교통 분야 입찰의 유사실적 자산</b>입니다. 보령
            원도심 4건은 관광안내체계 사업으로, 부천성모·국립소방병원은 의료 웨이파인딩으로 이어질 수
            있습니다. 완료가 쌓일수록 다음 수주의 확률이 올라가는 구조 — 그것이 이 AX의 매출 루프입니다.
          </p>
        </Section>

        {/* 11 */}
        <Section n="11" title="Data가 회사 자산이 되는 구조">
          <p className="text-sm leading-relaxed text-ink-2">
            프로젝트별 원가·Margin·파트너 납기·실적 사진이 데이터로 쌓이면, 그것은 견적의 정확도와 입찰
            제안서의 설득력이 됩니다. 정책자금·정부지원 심사에서도 &lsquo;수행역량을 데이터로 관리하는
            회사&rsquo;라는 증거가 됩니다. 여성기업·창업기업·산업디자인전문회사 자격과 결합하면 지원사업
            대응력이 한층 올라갑니다.
          </p>
        </Section>

        {/* 12 GROWTH */}
        <Section n="12" title="Roadmap — 어디까지 갈 것인가">
          <ol className="space-y-2.5">
            {GROWTH.map((g, i) => (
              <li key={g.label} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-16 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-black ${
                    g.now ? "bg-accent text-shell" : g.vision ? "bg-shell text-accent" : "bg-soft text-ink-2"
                  }`}
                >
                  {g.stage}
                </span>
                <span className={`text-sm font-semibold ${g.vision ? "text-ink" : "text-ink-2"}`}>{g.label}</span>
                {i === 0 && <span className="rounded bg-[var(--ic-evidence)]/12 px-1.5 py-0.5 text-[0.5625rem] font-bold text-[var(--ic-evidence)]">운영 중</span>}
                {i > 0 && <span className="rounded bg-soft px-1.5 py-0.5 text-[0.5625rem] font-bold text-muted">향후 확장</span>}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            ※ 장기 비전은 로드맵이며 현재 제공 기능이 아닙니다. 현재 범위는 Customer Platform과 Business AX
            MVP입니다.
          </p>
        </Section>

        {/* Return CTA */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
          <p className="font-bold text-ink">이 구조가 실제로 동작하는 모습을 보세요</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new Event("shine-presentation"))}
              className="tap hover-lift rounded-lg bg-accent px-6 py-3 text-sm font-bold text-shell hover:brightness-110"
            >
              ▶ 시연 모드 시작
            </button>
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
    <section id={`why-${n}`} className="anim-reveal scroll-mt-32">
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
