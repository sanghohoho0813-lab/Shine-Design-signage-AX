import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로젝트 문의",
  description:
    "5단계로 프로젝트 조건을 남기면 조건에 맞는 진행 방식을 제안드립니다. 초기 기획 단계여도 현장조건 정리부터 함께 시작합니다.",
};

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
