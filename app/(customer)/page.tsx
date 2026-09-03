"use client";

import Link from "next/link";
import { IMG, trustCategories } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Reveal, CountUp } from "@/components/Reveal";
import { Section, SectionHeader, PhotoBand, LineIcons } from "@/components/ui";
import { RECORD_TOTAL, KOROAD_COUNT, MEDICAL_COUNT } from "@/lib/records";
import { CREDENTIALS } from "@/lib/company";

const TRUST_BAR = [
  { icon: LineIcons.building, title: "한국도로교통공단 전국 실적", desc: `지부·시험장·교통방송 ${KOROAD_COUNT}건` },
  { icon: LineIcons.pen, title: "상담부터 관리까지 One-Stop", desc: "화성 자체 공장 + 파트너 네트워크" },
  { icon: LineIcons.ruler, title: "산업디자인전문회사", desc: "직접생산확인 · 여성기업 · 옥외광고사업" },
  { icon: LineIcons.map, title: "전국 프로젝트 대응", desc: "원주·울산·마산·보령·제주까지" },
];

const STATS = [
  { v: RECORD_TOTAL, suffix: "건", label: "누적 수행 실적", sub: "2013년 ~ 2025년" },
  { v: KOROAD_COUNT, suffix: "건", label: "한국도로교통공단", sub: "전국 지부·시험장·교통방송" },
  { v: MEDICAL_COUNT, suffix: "건", label: "병원 · 보건 시설", sub: "국립소방병원 · 성모병원 외" },
  { v: CREDENTIALS.length, suffix: "종", label: "보유 자격·등록", sub: "직접생산확인 · 산업디자인전문회사 외" },
];

const HOME_SERVICES = [
  { img: IMG.service01, ko: "사인 디자인", en: "Signage Design", desc: "외부사인 · 실내사인 · 안내·유도사인" },
  { img: IMG.service02, ko: "환경디자인", en: "Environmental Design", desc: "공공공간 · 환경그래픽 · 공간아이덴티티" },
  { img: IMG.service03, ko: "공공 프로젝트", en: "Public Project", desc: "공공기관 · 의료·교육 · 행정·문화시설" },
];

export default function Home() {
  const { projects, hydrated } = useApp();
  const completed = hydrated ? projects.filter((p) => p.stage === "완료") : [];

  return (
    <>
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-shell lg:min-h-[38rem]">
        <img
          src={IMG.heroMain}
          alt="공공기관 건물에 설치된 통합 안내 사인"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "72% 45%" }}
        />
        <div className="scrim-hero" aria-hidden />
        <div className="container-page relative py-20 lg:py-24">
          <p className="t-eyebrow">SHINE DESIGN · 사인디자인</p>
          <h1 className="t-display mt-4 max-w-2xl text-white">
            공간을 읽고, <span className="text-accent">사인</span>으로 완성합니다.
          </h1>
          <p className="measure mt-5 t-lead text-nav-primary">
            공공기관·의료·업무시설·문화공간의 사인 시스템을 기획부터 디자인, 제작, 시공까지 통합합니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/portfolio" className="tap hover-lift btn btn-accent shadow-lg">
              프로젝트 보기
            </Link>
            <Link href="/inquiry" className="tap hover-lift btn btn-on-dark">
              프로젝트 문의
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------- TRUST BAR ----------------------------- */}
      <section className="border-b border-line bg-surface">
        <div className="container-page grid grid-cols-1 gap-x-6 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {TRUST_BAR.map((t) => (
            <div key={t.title} className="flex items-start gap-3 py-5 lg:py-6">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent [&>svg]:h-[1.15rem] [&>svg]:w-[1.15rem]" aria-hidden>
                {t.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-ink">{t.title}</p>
                <p className="mt-0.5 t-meta">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ STATS ------------------------------- */}
      <Section tone="canvas" size="sm">
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className={`px-2 text-center ${i > 0 ? "lg:border-l lg:border-line" : ""}`}>
              <p className="text-4xl font-black leading-none text-accent sm:text-5xl">
                <CountUp value={s.v} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm font-bold text-ink">{s.label}</p>
              <p className="mt-1 t-meta">{s.sub}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------- PUBLIC RECORD --------------------------- */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Public Track Record"
          title="공공 프로젝트에서 쌓은 경험"
          desc="2024년 한 해에 수행한 실제 프로젝트입니다. 발주 기관의 성격에 맞춰 안내체계를 설계하고 제작·시공까지 책임집니다."
          action={{ href: "/portfolio", label: "포트폴리오 전체" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trustCategories.map((c, i) => (
            <Reveal key={c.label} delay={(i % 3) * 70}>
              <Link
                href="/portfolio"
                className="img-zoom tap hover-lift group block overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={c.image} alt={c.label} className="h-full w-full object-cover" loading="lazy" />
                  <div className="scrim-card" aria-hidden />
                  <h3 className="absolute inset-x-4 bottom-3 t-h3 text-white">{c.label}</h3>
                </div>
                <p className="px-4 py-3.5 t-meta">{c.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------- BUSINESS AREAS --------------------------- */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow="Business Areas"
          title="사인을 만드는 것이 아니라, 공간의 정보를 설계합니다"
          desc="동선을 분석하고 정보의 위계를 세운 뒤, 공간에 맞는 소재와 시공 방식으로 완성합니다."
          action={{ href: "/services", label: "사업분야 전체" }}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {HOME_SERVICES.map((s, i) => (
            <Reveal key={s.ko} delay={i * 80}>
              <Link
                href="/services"
                className="img-zoom tap hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
              >
                <div className="aspect-[3/2] w-full shrink-0 overflow-hidden">
                  <img src={s.img} alt={s.ko} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-accent">{s.en.toUpperCase()}</p>
                  <h3 className="mt-1 t-h3 text-ink">{s.ko}</h3>
                  <p className="mt-1.5 t-meta">{s.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --------------------------- BRAND STORY ---------------------------- */}
      <PhotoBand image={IMG.brandStory} alt="사인 디자인 스튜디오 작업 공간" position="60% 50%">
        <div className="section">
          <p className="t-eyebrow">Our Approach</p>
          <h2 className="t-h2 mt-3 max-w-2xl text-white">
            공공기관에서 검증된 경험을 바탕으로, 기획부터 시공까지 하나의 프로젝트로 관리합니다
          </h2>
          <p className="measure mt-4 t-body text-nav-inactive">
            프로젝트 특성에 맞는 전문 제작·시공 네트워크를 활용하는 유연한 공급구조로 규모와 일정에
            대응합니다.
          </p>
          <Link href="/process" className="tap hover-lift btn btn-accent mt-8">
            프로젝트 프로세스 보기
          </Link>
        </div>
      </PhotoBand>

      {/* ------------- Data Bridge: 최근 완료 (AX → Customer) ---------------- */}
      {completed.length > 0 && (
        <Section tone="surface" size="sm">
          <SectionHeader eyebrow="Recently Completed" title="최근 완료된 프로젝트" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {completed.map((p) => (
              <div key={p.id} className="rounded-xl border border-line bg-canvas p-4">
                <p className="text-[0.6875rem] font-bold text-accent">{p.category} · 완료</p>
                <p className="mt-1.5 text-sm font-bold leading-snug text-ink">{p.name}</p>
                <p className="mt-1 t-meta">{p.client}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ------------------------------ CTA --------------------------------- */}
      <PhotoBand image={IMG.bookingScene} alt="프로젝트 상담 미팅" position="50% 35%">
        <div className="section flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="t-h2 text-white">사인 프로젝트를 계획하고 계신가요?</h2>
            <p className="mt-3 t-body text-nav-inactive">
              초기 기획 단계여도 좋습니다. 현장조건 정리부터 함께 시작합니다.
            </p>
          </div>
          <Link href="/inquiry" className="tap hover-lift btn shrink-0 bg-white text-shell shadow-xl hover:bg-soft">
            프로젝트 문의하기 →
          </Link>
        </div>
      </PhotoBand>
    </>
  );
}
