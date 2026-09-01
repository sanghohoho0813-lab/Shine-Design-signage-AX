import { IMG } from "@/lib/data";
import Link from "next/link";
import { Section, PhotoBand } from "@/components/ui";

export const metadata = { title: "프로젝트 프로세스 — 샤인디자인" };

const PHASES = [
  {
    phase: "기획",
    steps: [
      { en: "Inquiry", ko: "프로젝트 문의", desc: "프로젝트 유형·일정·현장 조건을 접수합니다. 초기 기획 단계여도 괜찮습니다." },
      { en: "Requirement", ko: "요구사항 정리", desc: "발주 목적, 이용자, 예산 범위, 행정 조건을 함께 정리합니다." },
      { en: "Site Review", ko: "현장·환경 조사", desc: "현장을 실측하고 동선·시야·조도·설치 조건을 분석합니다." },
    ],
  },
  {
    phase: "설계",
    steps: [
      { en: "Concept", ko: "컨셉 설계", desc: "공간 아이덴티티와 정보체계의 방향을 제안하고 합의합니다." },
      { en: "Design", ko: "디자인", desc: "사인 타입별 디자인과 그래픽 시스템을 설계하고 승인 받습니다." },
      { en: "Specification", ko: "사양·견적", desc: "소재·가공·조명 사양을 확정하고 항목별 견적을 산출합니다." },
    ],
  },
  {
    phase: "실행",
    steps: [
      { en: "Production", ko: "제작", desc: "자체 공장과 전문 제작 파트너가 함께 제작하고 검수합니다." },
      { en: "Installation", ko: "시공·설치", desc: "운영 일정에 맞춘 시공 계획으로 안전하게 설치합니다." },
      { en: "Completion", ko: "준공·증빙", desc: "준공 검사와 증빙 자료까지 정리해 프로젝트를 완결합니다." },
    ],
  },
];

export default function ProcessPage() {
  let n = 0;
  return (
    <>
      <Section tone="surface" size="sm" className="border-b border-line">
        <p className="t-eyebrow">Project Process</p>
        <h1 className="t-h1 mt-3 text-ink">프로젝트 프로세스</h1>
        <p className="measure-wide mt-4 t-lead">
          샤인디자인은 &lsquo;간판을 만드는 일&rsquo;이 아니라 <b className="text-ink">프로젝트 전체를 관리</b>합니다.
          문의부터 준공 증빙까지, 발주 담당자가 챙겨야 할 일을 하나의 흐름으로 대신 관리합니다.
        </p>
      </Section>

      <Section tone="canvas">
        <div className="space-y-10">
          {PHASES.map((ph) => (
            <div key={ph.phase} className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <span className="inline-flex items-center gap-2 rounded-full bg-shell px-4 py-1.5 text-sm font-bold text-accent">
                    {ph.phase}
                  </span>
                </div>
              </div>
              <div className="space-y-3 lg:col-span-3">
                {ph.steps.map((s) => {
                  n += 1;
                  return (
                    <div key={s.en} className="hover-lift flex gap-4 rounded-xl border border-line bg-surface p-5 shadow-sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft text-sm font-black text-ink-2">
                        {String(n).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2.5">
                          <h2 className="t-h3 text-ink">{s.ko}</h2>
                          <span className="text-[0.6875rem] font-bold tracking-[0.14em] text-accent">{s.en.toUpperCase()}</span>
                        </div>
                        <p className="mt-1.5 t-body">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <PhotoBand image={IMG.heroSecondary} alt="완성된 사인 프로젝트" position="50% 45%">
        <div className="section flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="t-h2 text-white">프로세스의 시작은 문의입니다</h2>
            <p className="mt-3 t-body text-nav-inactive">5단계 문의 양식으로 3분이면 충분합니다.</p>
          </div>
          <Link href="/inquiry" className="tap hover-lift btn btn-accent shrink-0">
            프로젝트 문의 시작 →
          </Link>
        </div>
      </PhotoBand>
    </>
  );
}
