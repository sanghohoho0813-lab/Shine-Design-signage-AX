import { IMG } from "@/lib/data";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "@/components/ui";
import { SIGN_CATALOG } from "@/lib/company";

export const metadata = { title: "사업분야 — 샤인디자인" };

const AREAS = [
  {
    img: IMG.service01,
    en: "Signage Design",
    title: "사인 디자인",
    items: ["외부사인", "실내사인", "안내·유도사인"],
    desc: "건축과 브랜드에 맞는 사인 시스템을 디자인합니다. 서체·컬러·소재·조명까지 공간의 인상을 결정하는 요소를 통합 설계합니다.",
    tag: null,
  },
  {
    img: IMG.service02,
    en: "Environmental Design",
    title: "환경디자인",
    items: ["공공공간", "환경그래픽", "공간아이덴티티"],
    desc: "벽면·바닥·유리·조형물을 캔버스로 공간 전체의 아이덴티티를 만듭니다. 사인과 그래픽이 하나의 경험으로 이어집니다.",
    tag: null,
  },
  {
    img: IMG.offer03,
    en: "Wayfinding System",
    title: "웨이파인딩 시스템",
    items: ["동선 분석", "정보체계", "안내체계 설계"],
    desc: "첫 방문자의 눈으로 동선을 분석하고 정보의 위계를 설계합니다. 복잡한 시설일수록 안내체계 설계가 사인의 품질을 결정합니다.",
    tag: null,
  },
  {
    img: IMG.service03,
    en: "Public Project",
    title: "공공 프로젝트",
    items: ["공공기관", "의료·교육", "행정·문화시설"],
    desc: "한국도로교통공단 전국 지부·시험장, 국립소방병원, 여주경찰서 등 공공 현장의 조건을 이해하는 실제 수행 경험이 있습니다. 발주에서 준공 서류까지 전 과정을 관리합니다.",
    tag: "현재 주력",
  },
  {
    img: IMG.offer02,
    en: "Corporate Signage",
    title: "기업 사인",
    items: ["기업 사옥", "브랜드 공간", "상업시설"],
    desc: "공공에서 검증된 역량을 기업 사옥과 브랜드 공간으로 확장하고 있습니다. 리브랜딩·다지점 사인 교체까지 대응합니다.",
    tag: "성장 분야",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section tone="surface" size="sm" className="border-b border-line">
        <p className="t-eyebrow">Business Areas</p>
        <h1 className="t-h1 mt-3 text-ink">사업분야</h1>
        <p className="measure-wide mt-4 t-lead">
          공간을 읽고, 정보를 설계하고, 사인으로 완성합니다. 다섯 개 영역이 하나의 프로젝트 안에서
          이어집니다.
        </p>
      </Section>

      <Section tone="canvas">
        <div className="space-y-6">
          {AREAS.map((a, i) => (
            <Reveal key={a.en}>
              <article className="grid items-stretch overflow-hidden rounded-2xl border border-line bg-surface shadow-sm lg:grid-cols-5">
                <div className={`img-zoom relative overflow-hidden lg:col-span-2 ${i % 2 ? "lg:order-2" : ""}`}>
                  <img src={a.img} alt={a.title} className="aspect-[3/2] h-full w-full object-cover lg:aspect-auto" loading="lazy" />
                </div>
                <div className="p-6 sm:p-8 lg:col-span-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="t-eyebrow">{a.en}</p>
                    {a.tag && (
                      <span className="rounded-full bg-shell px-2.5 py-0.5 text-[0.625rem] font-bold text-accent">{a.tag}</span>
                    )}
                  </div>
                  <h2 className="t-h2 mt-2 text-ink">{a.title}</h2>
                  <p className="measure-wide mt-3 t-body">{a.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {a.items.map((it) => (
                      <span key={it} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink-2">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 사인 품목 카탈로그 — 지명원 WORK SCOPE */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Sign Catalog"
          title="한 건물에 들어가는 사인, 빠짐없이 만듭니다"
          desc="현판 하나만 맡기든 건물 전체를 맡기든, 품목이 빠져 다른 업체를 다시 찾을 일이 없습니다. 장애인 편의시설(BF) 사인까지 자체 품목으로 보유하고 있습니다."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {SIGN_CATALOG.map((c) => {
            const isBf = c.key.startsWith("bf-");
            return (
              <Reveal key={c.key}>
                <section
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    isBf ? "border-accent/40 bg-accent/[0.06]" : "border-line bg-canvas"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.6875rem] font-black tracking-[0.14em] text-accent">{c.en}</p>
                    {isBf && (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.625rem] font-bold text-shell">
                        BF 인증 대응
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 t-h3 text-ink">{c.ko}</h3>
                  <p className="mt-2 t-body">{c.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                    {c.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-line bg-surface px-2.5 py-1 text-[0.75rem] font-medium text-ink-2"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 t-meta">{c.items.length}개 품목</p>
                </section>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tone="canvas" size="sm">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-shell p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="t-h3 text-white">어떤 분야든, 시작은 현장의 조건 정리입니다</h2>
            <p className="mt-1.5 t-meta text-nav-inactive">프로젝트 유형을 선택해 문의를 남겨 주세요.</p>
          </div>
          <Link href="/inquiry" className="tap hover-lift btn btn-accent shrink-0">
            프로젝트 문의 →
          </Link>
        </div>
      </Section>
    </>
  );
}
