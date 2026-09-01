"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ic-risk)]/12 text-2xl text-[var(--ic-risk)]" aria-hidden>
        !
      </span>
      <h1 className="t-h2 mt-5 text-ink">화면을 불러오지 못했습니다</h1>
      <p className="measure mt-3 t-body">
        일시적인 문제일 수 있습니다. 다시 시도해 보시고, 계속 같은 화면이 보이면 잠시 후 접속해 주세요.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="tap hover-lift btn btn-primary">
          다시 시도
        </button>
        <Link href="/" className="tap hover-lift btn btn-ghost">
          홈으로
        </Link>
      </div>
    </div>
  );
}
