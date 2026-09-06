# SHINE DESIGN — Signage Business AX + Customer Platform

㈜샤인디자인 하이브리드 MVP. 미래AI랩 **AX+Platform Unified Design & Development System v3.0** 기반 — Strategy 94 / Product 98 / P0 0 (QA_REPORT.md).

- **Customer Platform** (`/`) — 기업 사이트 · 포트폴리오 · 프로젝트 문의 위저드 · 향후 확장 Preview
- **Business AX** (`/ax`) — 대시보드 · 파이프라인 · 견적/원가/Margin · 제작 파트너 · 입찰 준비도 · AI 브리핑 · 증빙 · Why AX · 설정

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## 구조

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- 회사 정보(지명원 2026 기준): `lib/company.ts` · 수행 실적 337건: `lib/records.ts`
- 데모 데이터: `lib/data.ts` · 전역 상태(테마/역할/브리지): `lib/store.tsx` (localStorage)
- Canonical 9 테마 CSS 변수: `app/globals.css` · AX 메뉴 분류: `components/ax/menu.ts`
- 전략 잠금·IA: `PROJECT_SPEC.md` / 상태·Gates: `PROJECT_STATE.md` / 결정(WHY NOT): `DECISIONS.md` / 채점·Red Team: `QA_REPORT.md` / P2: `RECOMMENDATIONS.md` / 실증: `EVIDENCE_PLAN.md` / SSOT: `DATA_DICTIONARY.md`
- 전략을 코드로: KPI `lib/kpi.ts` · AI Matrix `lib/ai.ts` · SSOT `lib/dictionary.ts` · 이벤트 `lib/events.ts`

## 빠르게 쓰는 법

- **AX 대시보드 상단 "오늘 할 일"** — 추천된 Action을 확인 → 실행중 → 완료(또는 보류/무시+사유)로 처리하면 증빙 Evidence Log에 남습니다
- **고객이 문의를 넣으면** AX 파이프라인에 뜨고, 담당자가 응대 상태를 바꾸면 고객의 **내 문의 현황**(`/inquiry/status`)에 바로 반영됩니다
- **Why AX** 상단 섹션 바로가기로 12개 섹션을 건너뛰며 읽기

- **⌘K / Ctrl+K** — 어디서든 검색: 메뉴 이동, 프로젝트·포트폴리오 찾기, 시연 모드·테마 변경 실행
- 포트폴리오는 상단 검색창으로 기관명·프로젝트명 검색, 상세에서 이전/다음 프로젝트 이동
- 포트폴리오 하단 **전체 수행 실적 337건** — 기관명으로 검색하면 일치 부분이 하이라이트됨 (`/portfolio#records`)
- 문의 위저드는 자동 저장되어 새로고침해도 이어서 작성 가능
- 증빙·리포트 화면의 **실적 요약 인쇄** 버튼 → 브라우저 인쇄로 제출용 PDF 저장

## 데모 포인트

1. 홈 우하단 **DEMO 바 → Business AX 보기** (관리자 역할일 때)
2. 최초 AX 진입 시 4단계 튜토리얼 자동 시작
3. 고객 **프로젝트 문의** 접수 → AX 파이프라인 "문의" 단계 자동 유입 (Data Bridge)
4. 파이프라인에서 프로젝트 **완료** 처리 → 증빙 레코드 + 고객 홈 "최근 완료" 노출
5. AX 설정 — 테마 9종 / 글자 크기 3단계 / 역할·권한 매트릭스·AX Owner / 데이터 SSOT·CSV / AI Method Matrix / 기술자산 / Demo Reset

Vercel에 바로 배포 가능(빌드 설정 기본값).
