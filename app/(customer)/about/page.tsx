import { IMG } from "@/lib/data";
import Link from "next/link";

export const metadata = { title: "회사소개 — 샤인디자인" };

const VALUES = [
  {
    title: "공간을 읽는 기획",
    desc: "사인은 마지막에 붙이는 장식이 아니라, 공간 이용자의 동선과 정보 경험을 설계하는 일에서 시작합니다.",
  },
  {
    title: "공공에서 검증된 신뢰",
    desc: "다수의 공공기관 프로젝트를 수행하며 행정 절차, 보안 규정, 운영 중 시공까지 공공 현장의 조건을 이해하고 있습니다.",
  },
  {
    title: "통합 프로젝트 관리",
    desc: "기획·디자인부터 제작·시공·검수까지 하나의 프로젝트로 관리해 발주처의 조율 부담을 줄입니다.",
  },
  {
    title: "유연한 제작 네트워크",
    desc: "금속·조명·출력·시공 등 프로젝트 특성에 맞는 전문 제작 파트너를 운용하는 유연한 공급구조를 갖추고 있습니다.",
  },
];

const CREDENTIALS = [
  "산업디자인전문회사",
  "옥외광고사업 등록",
  "공장등록",
  "여성기업",
  "다수 공공기관 프로젝트 수행",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={IMG.brandStory}
          alt="샤인디자인 스튜디오"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-shell/85" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">ABOUT SHINE DESIGN</p>
          <h1 className="mt-3 text-3xl font-black leading-snug text-white sm:text-4xl">
            공공·공간 사인 프로젝트를 기획·디자인하고,
            <br className="hidden sm:block" />
            제작·시공까지 통합 관리하는 전문 사인디자인 기업
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-nav-inactive">
            ㈜샤인디자인은 공공기관·의료·업무시설·문화공간의 사인 시스템을 다뤄온 사인디자인 전문
            회사입니다. 공간과 정보를 읽는 산업디자인 역량 위에, 프로젝트별 최적의 제작·시공 네트워크를
            결합해 하나의 완성된 결과물을 전달합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="text-2xl font-black text-ink sm:text-3xl">우리가 일하는 방식</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <div key={v.title} className="hover-lift rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <span className="text-xs font-black text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="img-zoom overflow-hidden rounded-2xl shadow-lg">
            <img src={IMG.customerExperience} alt="완성된 사인 공간을 이용하는 방문객" className="aspect-[3/2] w-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-accent">CREDENTIALS</p>
            <h2 className="mt-2 text-2xl font-black text-ink">공공 프로젝트를 수행할 준비가 되어 있습니다</h2>
            <ul className="mt-6 space-y-3">
              {CREDENTIALS.map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-ink-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[11px] text-accent" aria-hidden>✓</span>
                  {c}
                </li>
              ))}
            </ul>
            <Link href="/inquiry" className="tap hover-lift mt-8 inline-block rounded-lg bg-shell px-6 py-3 text-sm font-semibold text-white hover:bg-shell-2">
              프로젝트 상담 요청
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
