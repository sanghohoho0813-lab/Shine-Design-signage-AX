import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center">
      <p className="text-5xl font-black text-accent">404</p>
      <h1 className="mt-3 text-xl font-bold text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-muted">주소가 변경되었거나 준비 중인 페이지입니다.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="tap rounded-lg bg-shell px-5 py-2.5 text-sm font-semibold text-white hover:bg-shell-2">
          고객 사이트 홈
        </Link>
        <Link href="/ax" className="tap rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-2 hover:bg-soft">
          Business AX
        </Link>
      </div>
    </div>
  );
}
