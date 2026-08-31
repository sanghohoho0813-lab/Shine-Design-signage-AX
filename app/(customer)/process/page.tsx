import { IMG } from "@/lib/data";
import Link from "next/link";

export const metadata = { title: "프로젝트 프로세스 — 샤인디자인" };

const STEPS = [
  { en: "Inquiry", ko: "프로젝트 문의", desc: "프로젝트 유형·일정·현장 조건을 접수합니다. 초기 기획 단계여도 괜찮습니다." },
  { en: "Requirement", ko: "요구사항 정리", desc: "발주 목적, 이용자, 예산 범위, 행정 조건을 함께 정리합니다." },
  { en: "Site Review", ko: "현장·환경 조사", desc: "현장을 실측하고 동선·시야·조도·설치 조건을 분석합니다." },
  { en: "Concept", ko: "컨셉 설계", desc: "공간 아이덴티티와 정보체계의 방향을 제안하고 합의합니다." },
  { en: "Design", ko: "디자인", desc: "사인 타입별 디자인과 그래픽 시스템을 설계하고 승인 받습니다." },
  { en: "Specification", ko: "사양·견적", desc: "소재·가공·조명 사양을 확정하고 항목별 견적을 산출합니다." },
  { en: "Production", ko: "제작", desc: "프로젝트 특성에 맞는 전문 제작 파트너와 함께 제작하고 검수합니다." },
  { en: "Installation", ko: "시공·설치", desc: "운영 일정에 맞춘 시공 계획으로 안전하게 설치합니다." },
  { en: "Completion", ko: "준공·증빙", desc: "준공 검사와 증빙 자료까지 정리해 프로젝트를 완결합니다." },
];

export default function ProcessPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-xs font-bold tracking-[0.18em] text-accent">PROJECT PROCESS</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">프로젝트 프로세스</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            샤인디자인은 &lsquo;간판을 만드는 일&rsquo;이 아니라 <b className="text-ink">프로젝트 전체를 관리</b>합니다.
            문의부터 준공 증빙까지, 발주 담당자가 챙겨야 할 일을 하나의 흐름으로 대신 관리합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <ol className="relative space-y-4">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-line sm:left-[23px]" />
          {STEPS.map((s, i) => (
            <li key={s.en} className="relative flex gap-4 sm:gap-6">
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shell text-sm font-black text-accent shadow sm:h-12 sm:w-12">
                {i + 1}
              </span>
              <div className="hover-lift flex-1 rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h2 className="font-bold text-ink">{s.ko}</h2>
                  <span className="text-[11px] font-semibold tracking-wider text-accent">{s.en.toUpperCase()}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative isolate overflow-hidden">
        <img src={IMG.heroSecondary} alt="완성된 사인 프로젝트" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-shell/80" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-2xl font-black text-white">프로세스의 시작은 문의입니다</h2>
            <p className="mt-2 text-sm text-nav-inactive">5단계 문의 양식으로 3분이면 충분합니다.</p>
          </div>
          <Link href="/inquiry" className="tap hover-lift shrink-0 rounded-lg bg-accent px-7 py-3.5 text-sm font-bold text-shell hover:brightness-110">
            프로젝트 문의 시작 →
          </Link>
        </div>
      </section>
    </>
  );
}
