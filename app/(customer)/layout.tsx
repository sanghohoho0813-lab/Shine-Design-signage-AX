import CustomerHeader from "@/components/customer/Header";
import CustomerFooter from "@/components/customer/Footer";
import DemoBar from "@/components/customer/DemoBar";
import BackToTop from "@/components/customer/BackToTop";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <CustomerHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <CustomerFooter />
      <DemoBar />
      <BackToTop />
    </div>
  );
}
