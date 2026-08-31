"use client";

import Link from "next/link";
import { IMG, trustCategories, portfolio } from "@/lib/data";
import { useApp } from "@/lib/store";

const HERO_TRUST = [
  { icon: "🏛", title: "한국도로교통공단 전국 실적", desc: "지부·시험장·교통방송 60여 건" },
  { icon: "✏️", title: "사인 디자인·제작·시공", desc: "자체 1·2공장 + 파트너 네트워크" },
  { icon: "📐", title: "산업디자인전문회사", desc: "여성기업 · 옥외광고사업 등록" },
  { icon: "🗺", title: "전국 프로젝트 대응", desc: "원주·마산·보령·인천까지" },
];

const HOME_SERVICES = [
  { img: IMG.service01, title: "Signage Design", desc: "외부사인 · 실내사인 · 안내·유도사인" },
  { img: IMG.service02, title: "Environmental Design", desc: "공공공간 · 환경그래픽 · 공간아이덴티티" },
  { img: IMG.service03, title: "Public Project", desc: "공공기관 · 의료·교육 · 행정·문화시설" },
];

export default function Home() {
  const { projects, hydrated } = useApp();
  const completed = hydrated ? projects.filter((p) => p.stage === "완료") : [];

  return (
    <>
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative isolate min-h-[560px] overflow-hidden lg:min-h-[640px]">
        <img
          src={IMG.heroMain}
          alt="공공기관 건물 앞에 설치된 통합 안내 사인"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "70% 40%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:py-28">
          <h1 className="anim-reveal max-w-xl text-4xl font-black leading-[1.2] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            공간을 읽고,
            <br />
            <span className="text-accent">사인</span>으로 완성합니다.
          </h1>
          <p className="anim-reveal mt-5 max-w-md text-[15px] leading-relaxed text-ink-2 sm:text-base">
            공공기관·의료·업무시설·문화공간의 사인 시스템을
            <br className="hidden sm:block" />
            기획부터 디자인, 제작, 시공까지 통합합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className="tap hover-lift rounded-lg bg-shell px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-shell-2"
            >
              프로젝트 보기
            </Link>
            <Link
              href="/inquiry"
              className="tap hover-lift rounded-lg border border-accent bg-accent/95 px-6 py-3 text-sm font-semibold text-shell hover:brightness-105"
            >
              프로젝트 문의
            </Link>
          </div>
        </div>
      </section>

      {/* Trust indicator strip */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-line px-4 sm:px-6 lg:grid-cols-4 lg:divide-x">
          {HERO_TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3 px-2 py-5 lg:px-6">
              <span aria-hidden className="text-xl">{t.icon}</span>
              <div>
                <p className="text-[13px] font-bold text-ink">{t.title}</p>
                <p className="text-xs text-muted">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- TRUST SECTION --------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-accent">PUBLIC TRACK RECORD · 2024 실제 수행</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">공공 프로젝트에서 쌓은 경험</h2>
          </div>
          <Link href="/portfolio" className="tap shrink-0 text-sm font-medium text-muted hover:text-ink">
            더보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {trustCategories.map((c) => (
            <Link
              key={c.label}
              href="/portfolio"
              className="img-zoom tap hover-lift group overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.image} alt={c.label} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <p className="absolute bottom-2 left-2.5 right-2 text-[13px] font-bold leading-tight text-white">
                  {c.label}
                </p>
              </div>
              <p className="px-2.5 py-2 text-[11px] text-muted">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* -------------------------- BUSINESS AREAS --------------------------- */}
      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-accent">BUSINESS AREAS</p>
              <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
                사인을 만드는 것이 아니라, 공간의 정보를 설계합니다
              </h2>
            </div>
            <Link href="/services" className="tap shrink-0 text-sm font-medium text-muted hover:text-ink">
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {HOME_SERVICES.map((s) => (
              <Link
                key={s.title}
                href="/services"
                className="img-zoom tap hover-lift group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={s.img} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- BRAND STORY ---------------------------- */}
      <section className="relative isolate overflow-hidden">
        <img
          src={IMG.brandStory}
          alt="사인 디자인 스튜디오 작업 공간"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-shell/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">OUR APPROACH</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-black leading-snug text-white sm:text-3xl">
            공공기관에서 검증된 사인디자인 경험을 바탕으로
            <br />
            기획·디자인·제작·시공까지 하나의 프로젝트로 관리합니다.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-nav-inactive">
            동선을 분석하고 정보의 위계를 설계한 뒤, 공간에 맞는 소재와 시공 방식으로 완성합니다. 프로젝트
            특성에 맞는 전문 제작·시공 네트워크를 활용하는 유연한 공급구조로 규모와 일정에 대응합니다.
          </p>
          <Link
            href="/process"
            className="tap hover-lift mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-shell hover:brightness-110"
          >
            프로젝트 프로세스 보기
          </Link>
        </div>
      </section>

      {/* ---------------- Data Bridge: 최근 완료 프로젝트 (AX → Customer) ---------------- */}
      {completed.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">RECENTLY COMPLETED</p>
          <h2 className="mt-2 text-2xl font-black text-ink">최근 완료된 프로젝트</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {completed.map((p) => (
              <div key={p.id} className="w-64 shrink-0 rounded-xl border border-line bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold text-accent">{p.category} · 완료</p>
                <p className="mt-1 font-bold text-ink">{p.name}</p>
                <p className="mt-0.5 text-sm text-muted">{p.client}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------ CTA BAND ------------------------------ */}
      <section className="relative isolate overflow-hidden">
        <img
          src={IMG.bookingScene}
          alt="프로젝트 상담 미팅"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 35%" }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/35" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">사인 프로젝트를 계획하고 계신가요?</h2>
            <p className="mt-2 text-sm text-nav-inactive">
              초기 기획 단계여도 좋습니다. 현장조건 정리부터 함께 시작합니다.
            </p>
          </div>
          <Link
            href="/inquiry"
            className="tap hover-lift shrink-0 rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-shell shadow-xl hover:bg-soft"
          >
            프로젝트 문의하기 →
          </Link>
        </div>
      </section>
    </>
  );
}
