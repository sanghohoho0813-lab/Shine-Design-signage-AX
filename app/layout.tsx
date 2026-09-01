import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Presentation } from "@/components/Presentation";
import { Toaster } from "@/components/Toast";
import { CommandPalette } from "@/components/CommandPalette";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shine-design-signage-ax.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "샤인디자인 — 공간을 읽고, 사인으로 완성합니다",
    template: "%s | 샤인디자인",
  },
  description:
    "공공기관·의료·업무시설·문화공간의 사인 시스템을 기획부터 디자인, 제작, 시공까지 통합하는 전문 사인디자인 기업. 한국도로교통공단 전국 지부·시험장 등 공공 프로젝트 수행.",
  keywords: [
    "사인디자인", "간판", "안내사인", "유도사인", "웨이파인딩", "환경그래픽",
    "공공기관 사인", "옥외광고", "샤인디자인", "산업디자인전문회사",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "㈜샤인디자인",
    title: "샤인디자인 — 공간을 읽고, 사인으로 완성합니다",
    description:
      "공공기관·의료·업무시설의 사인 시스템을 기획부터 제작·시공까지 통합합니다. 한국도로교통공단 전국 실적 60여 건.",
    url: SITE,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeInit = `try{var s=JSON.parse(localStorage.getItem("shine-ax-state-v1")||"{}");if(s.theme)document.documentElement.dataset.theme=s.theme;var f={md:1.22,lg:1.45,xl:1.7}[s.fontScale];document.documentElement.style.setProperty("--font-scale",String(f||1.22));document.documentElement.dataset.font=s.fontScale||"md";if(s.reducedMotion)document.documentElement.dataset.motion="reduced";}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="shine" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${noto.variable} antialiased`}>
        <AppProvider>
          {children}
          <Presentation />
          <Toaster />
          <CommandPalette />
        </AppProvider>
      </body>
    </html>
  );
}
