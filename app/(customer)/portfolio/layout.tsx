import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오",
  description:
    "한국도로교통공단 전국 지부·운전면허시험장부터 국립소방병원·여주경찰서·보령 원도심까지, 샤인디자인이 실제 수행한 사인 프로젝트와 시공 현장 사진.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
