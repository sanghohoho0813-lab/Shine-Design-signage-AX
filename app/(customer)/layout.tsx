import CustomerHeader from "@/components/customer/Header";
import CustomerFooter from "@/components/customer/Footer";
import DemoBar from "@/components/customer/DemoBar";
import BackToTop from "@/components/customer/BackToTop";
import { PageTransition } from "@/components/PageTransition";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* 검색엔진용 조직 정보 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "㈜샤인디자인",
            alternateName: "Shinedesign Co., Ltd.",
            description:
              "공공기관·의료·업무시설·문화공간의 사인 시스템을 기획부터 디자인, 제작, 시공까지 통합하는 전문 사인디자인 기업",
            foundingDate: "2024-04-12",
            address: {
              "@type": "PostalAddress",
              streetAddress: "순화궁로 282, 221호 (별내동, 에이스하이엔드타워)",
              addressLocality: "남양주시",
              addressRegion: "경기도",
              addressCountry: "KR",
            },
            knowsAbout: ["사인디자인", "환경그래픽", "웨이파인딩", "옥외광고", "공공기관 안내체계"],
          }),
        }}
      />
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <CustomerHeader />
      <main id="main" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <CustomerFooter />
      <DemoBar />
      <BackToTop />
    </div>
  );
}
