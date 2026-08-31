import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Presentation } from "@/components/Presentation";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "샤인디자인 — 공간을 읽고, 사인으로 완성합니다",
  description:
    "공공기관·의료·업무시설·문화공간의 사인 시스템을 기획부터 디자인, 제작, 시공까지 통합하는 전문 사인디자인 기업",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeInit = `try{var s=JSON.parse(localStorage.getItem("shine-ax-state-v1")||"{}");if(s.theme)document.documentElement.dataset.theme=s.theme;var f={sm:.92,md:1,lg:1.1}[s.fontScale];if(f)document.documentElement.style.setProperty("--font-scale",String(f));if(s.reducedMotion)document.documentElement.dataset.motion="reduced";}catch(e){}`;

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
        </AppProvider>
      </body>
    </html>
  );
}
