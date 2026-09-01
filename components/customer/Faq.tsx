"use client";

import { useState } from "react";

/* 공공·기업 발주 담당자가 실제로 먼저 묻는 질문들 */
export const FAQS = [
  {
    q: "디자인만 의뢰할 수도 있나요?",
    a: "가능합니다. 사인 계획·디자인만 수행하고 제작·시공은 발주처가 별도로 진행하는 방식도 자주 있습니다. 반대로 이미 확정된 디자인의 제작·시공만 맡는 것도 가능합니다. 문의 시 '디자인만' 항목을 선택해 주세요.",
  },
  {
    q: "전국 어디든 시공이 가능한가요?",
    a: "가능합니다. 2024년에도 원주·마산·예산·보령·인천 등 전국 현장을 수행했습니다. 화성 제1공장과 남양주 제2공장에서 제작하고, 현장 조건에 맞는 시공팀을 구성해 진행합니다.",
  },
  {
    q: "기관 운영 중에도 교체 작업이 가능한가요?",
    a: "가능합니다. 청사·병원·도서관처럼 상시 운영되는 시설은 야간·주말 시공이나 구역별 단계 시공으로 운영 중단 없이 진행한 사례가 많습니다. 현장 조사 단계에서 운영 일정을 함께 확인합니다.",
  },
  {
    q: "보유하신 자격·등록 사항은 무엇인가요?",
    a: "산업디자인전문회사 신고, 옥외광고사업 등록, 공장등록, 여성기업 확인, 창업기업 확인을 보유하고 있습니다. 입찰 제출용 서류는 요청 시 준비해 드립니다.",
  },
  {
    q: "기간은 보통 얼마나 걸리나요?",
    a: "규모에 따라 다르지만, 현장 조사와 디자인에 2~4주, 제작에 2~4주, 설치에 수일~2주가 일반적입니다. 정확한 일정은 현장 조건과 사양이 확정된 뒤 산출해 안내드립니다.",
  },
  {
    q: "예산이 아직 확정되지 않았는데 상담이 되나요?",
    a: "됩니다. 오히려 예산 검토 단계에서 상담하시면 사양별 개략 금액을 정리해 드릴 수 있어 예산 수립에 도움이 됩니다. 문의 시 진행 단계를 '초기 기획' 또는 '예산 검토'로 선택해 주세요.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="tap flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-canvas sm:px-6"
            >
              <span className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 shrink-0 font-black text-accent" aria-hidden>
                  Q
                </span>
                <span className="t-h3 text-ink">{f.q}</span>
              </span>
              <span
                className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                ＋
              </span>
            </button>
            {isOpen && (
              <div className="anim-reveal px-5 pb-5 sm:px-6">
                <p className="measure-wide pl-7 t-body">{f.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
