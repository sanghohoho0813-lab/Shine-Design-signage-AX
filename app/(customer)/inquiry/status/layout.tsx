import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 문의 현황",
  description: "접수번호로 프로젝트 문의의 진행 상태(접수 · 검토중 · 상담예약)를 확인합니다.",
  robots: { index: false, follow: true },
};

export default function InquiryStatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
