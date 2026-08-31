import { IMG } from "@/lib/data";
import Link from "next/link";

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
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">BUSINESS AREAS</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">사업분야</h1>
          <p className="mt-3 max-w-xl text-[15px] text-ink-2">
            공간을 읽고, 정보를 설계하고, 사인으로 완성합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-14 sm:px-6">
        {AREAS.map((a, i) => (
          <div
            key={a.en}
            className={`grid items-stretch overflow-hidden rounded-2xl border border-line bg-surface shadow-sm lg:grid-cols-5 ${
              i % 2 ? "lg:[direction:rtl]" : ""
            }`}
          >
            <div className="img-zoom relative overflow-hidden lg:col-span-2 [direction:ltr]">
              <img src={a.img} alt={a.title} className="aspect-[3/2] h-full w-full object-cover lg:aspect-auto" loading="lazy" />
            </div>
            <div className="p-6 sm:p-8 lg:col-span-3 [direction:ltr]">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold tracking-[0.15em] text-accent">{a.en.toUpperCase()}</p>
                {a.tag && (
                  <span className="rounded-full bg-shell px-2 py-0.5 text-[10px] font-bold text-accent">{a.tag}</span>
                )}
              </div>
              <h2 className="mt-1.5 text-xl font-black text-ink sm:text-2xl">{a.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">{a.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.items.map((it) => (
                  <span key={it} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink-2">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-shell p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">어떤 분야든, 시작은 현장의 조건 정리입니다</h2>
            <p className="mt-1 text-sm text-nav-inactive">프로젝트 유형을 선택해 문의를 남겨 주세요.</p>
          </div>
          <Link href="/inquiry" className="tap hover-lift shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-shell hover:brightness-110">
            프로젝트 문의 →
          </Link>
        </div>
      </section>
    </>
  );
}
