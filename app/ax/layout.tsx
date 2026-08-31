import AxShell from "@/components/ax/Shell";

export const metadata = { title: "Business AX — 샤인디자인" };

export default function AxLayout({ children }: { children: React.ReactNode }) {
  return <AxShell>{children}</AxShell>;
}
