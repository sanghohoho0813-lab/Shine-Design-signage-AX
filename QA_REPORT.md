# QA_REPORT — Unified v3.0 Dual Acceptance

Date: 2026-09-06 · Stage: **DEMO** · Model handoff: Opus 5 → Fable 5.1 (Regression QA 선행 후 기능 추가)

## SCORE A — AX STRATEGY / BUSINESS QUALITY

| 영역 | 배점 | Before (v11) | After (v12) | 근거 |
|---|---:|---:|---:|---|
| Problem / Constraint | 15 | 7 | 14 | PRIMARY CONSTRAINT 문장 잠금, 핵심기능 6/9 직결 (PROJECT_SPEC) |
| Process Redesign | 10 | 2 | 9 | 8단계 ELIMINATE→AI 표, "중복입력 제거"가 자동화보다 먼저 |
| Data Foundation / Asset | 15 | 8 | 14 | SSOT 8 Entity(`lib/dictionary.ts`), Data Moat 6/12 정직 산정, 12개월 질문, 이벤트 레이어 |
| AI Fit / Explainability | 10 | 7 | 10 | AI Method Matrix 4엔진 RULE·L2·오류비용·승인 명시, AI Ready 모달 16.3 형식, 억지 AI 0 |
| Proof / KPI Design | 15 | 5 | 14 | Money KPI 5(Cost2/Rev2/Scale1) 측정지점 코드화, BASELINE UNKNOWN 표기, Evidence Type 9, Evidence Log·Pack 구조 |
| Customer / Partner / Platform Fit | 10 | 8 | 10 | Closed Loop 마지막 단계(내 문의 현황) 완성, Platform Readiness LOW 판정으로 과장 없음 |
| Scale / Unit Economics | 10 | 3 | 8 | Scale KPI(1인당 동시 프로젝트), Unit Economics는 측정항목만 정의(값 미기재) |
| Moat / Asset | 5 | 3 | 5 | Proprietary Data·Workflow·Know-how(BF/주물)·Network, 기술스택 제외 |
| Adoption / Risk | 5 | 3 | 5 | AX Owner 필드, 직원 이익 3개 명시, HIGH 오류비용 사람 승인 |
| Financeability / Growth Logic | 5 | 3 | 5 | Capital Independence YES, 보유 확인서 기반 접점만, 보장 표현 0 |
| **합계** | **100** | **49** | **94** | 90~94 "좋은 전략". 남은 6점은 실운영 Baseline·Unit Economics 실값(VALIDATE LATER) |

**Strategic P0 (13항목) → 0건** — Primary Constraint ○ / 핵심기능 연결 ○ / KPI 3종 ○ / Demo→Live 표현 없음 ○ / Baseline 없는 개선율 없음 ○(QA 자동 검사) / 고객행동↔Workflow 연결 ○ / 억지 AI 없음 ○ / AI 근거 ○ / HIGH 승인 ○ / Provenance ○ / Future≠현재 ○ / 보장 표현 없음 ○ / Capital Independence ○

## SCORE B — PRODUCT / IMPLEMENTATION QUALITY

| 영역 | Before | After | 근거 |
|---|---:|---:|---|
| Theme (Canonical 9 · Residual 0 · Neutral 고정) | 6/10 | 10 | 9테마 × 5라우트 스윕: 본문 Neutral·사이드바 White·카드 Pure White 통과, 잔존 색 유틸리티 0, 구버전 id 마이그레이션 검증 |
| Responsive (8폭 × 9라우트 + 360/XL) | 7/10 | 10 | 72 조합 overflow 0, 360px + 매우 크게 overflow 0 |
| Primary Journey / Closed Loop | 8/10 | 10 | 문의 → AX 상태 변경 → 고객 화면 반영, 타임라인 시각 기록 |
| Interaction Completeness | 9/10 | 10 | Action Lifecycle(추천→확인→실행중→완료/보류/무시+사유) 새로고침 유지, 모달 ESC·스크롤 복구 |
| Settings Completion | 6/10 | 10 | 6 섹션 · 9테마×6도트 · 권한 매트릭스 · AX Owner · SSOT/CSV/이벤트 · AI Matrix · 기술자산 정직 |
| AI Ready / Explainability UI | 7/10 | 10 | 엔진별 Method·Level·승인 표기 + 16.3 모달 |
| Evidence / Provenance / Demo-Live | 7/10 | 10 | Evidence Log 9타입, KPI 계약 카드, 모든 AX 화면 Provenance 칩, 설정에 DELIVERY STAGE |
| Story (Why AX 15섹션) | 9/10 | 10 | 13 정책환경(보장 금지) · 14 기술자산(특허 없음 명시) · 15 KPI 계약 |
| Customer Data Loop / Event Ready | 5/10 | 9 | 최근 본 프로젝트, 이벤트 12종 링 버퍼, 설정에서 열람. GA4 연결은 NEXT |
| Project Memory / Handoff | 6/10 | 10 | SPEC(U-6 잠금)·STATE(Strategic Gates)·DECISIONS(WHY NOT)·QA_REPORT·RECOMMENDATIONS·EVIDENCE_PLAN·DATA_DICTIONARY |
| **합계** | **85** | **98** | Delivery Recommended(98+ · P0 0) 도달 |

**Product P0 → 0건 · P1 → 0건.** 

## Whole-Hybrid Acceptance (U-7) — 헤드리스 실행 결과
`scratchpad/qa.mjs` **180/180 PASS** (v1~v12 누적). 포함: Fresh Load → Tutorial → 고객 홈 → 문의 5단계 → 접수번호 → 내 문의 현황 → AX 파이프라인 반영 → 상태 변경 → 고객 화면 반영 → Evidence Log → 브리핑 AI 근거/모달 → Action 승인·처리 → 설정(9 Theme/Font/Role/Owner) → Why AX 15 → 시연 모드 → PC↔Mobile Preview → Overlay Escape → Demo Reset → 재확인.

- Responsive tested widths: 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 (× 9 routes) + 360 with Font XL
- Theme 9 status: 전부 실제 동작 · shell 9종 상이 · 본문 Neutral 고정 · 사이드바 White 계열 · 카드 #FFFFFF
- Primary Journey: PASS (closed loop 왕복)
- Data / AI / Proof: SSOT 8 · AI RULE 4 (LLM 0) · KPI 5 BASELINE UNKNOWN · Evidence 9 type

## Devil Checklist (§20) — 자기 공격 결과
- BUSINESS: 가장 큰 병목(견적·승인·문의 누락)에 6/9 기능이 붙어 있다. 직원 이익 3개(전화 감소·재입력 제거·우선순위 자동) 있음.
- DATA: Outcome은 Action 완료·프로젝트 완료로 남는다. SSOT 정의됨. 12개월 가치 명시. 개인정보 보관 1년.
- AI: 4개 모두 RULE이라고 표기. LLM 미사용. 근거(WHY) 표시. HIGH 오류비용은 사람 승인. Output → Action 연결.
- PLATFORM: 고객이 쓸 이유 = 실적 확인 + 상태 확인. 수기 재입력 없음(브릿지). Primary Conversion 완료경로 있음. Future는 시각 분리 + 근거.
- GROWTH: Industry SaaS 주장 안 함(Readiness LOW). 자금 인과 과장 없음.
- PRODUCT: 상세 템플릿 아님(PROJECT SIGNATURE 4). 모바일 핵심 기능 동일. Overlay 안정. 설정·튜토리얼·Why AX 사이드바 노출.

## Red Team (PASS 3, 1회) — 발견 → 조치
| # | 역할 | 발견 | 등급 | 조치 |
|---|---|---|---|---|
| 1 | QA | `/ax/pipeline` 모바일 가로 overflow 406px (PageHeader `shrink-0` + Provenance nowrap) | P0 | PageHeader 우측 그룹 wrap 허용, Provenance 반응형 축약 |
| 2 | UX | 1024px에서 고객 헤더 인라인 메뉴가 423px 넘침 | P1 | 인라인 메뉴 `xl:`부터, 1024~1279는 Drawer |
| 3 | UX | 360px + 매우 크게: 로고·상단바·Margin 카드·권한 표·버튼 넘침 | P1 | 로고 축소 CSS, 상단바 wrap, 카드 wrap, 표 래퍼 min-w-0, 버튼 줄바꿈 |
| 4 | 회의적 대표 | "AI 브리핑"이 규칙인데 AI처럼 보임 | P1 | 엔진마다 `규칙 · L2 추천 · 승인` 표기 + 모달에서 현재/향후 분리 |
| 5 | 직원 | 추천을 체크만 하면 "무시했는지 못 봤는지" 안 남음 | P1 | Action Lifecycle 보류/무시 + 사유 |
| 6 | 고객 | 문의 넣고 나면 상태를 알 길이 없음 | P0(전략) | `/inquiry/status` + statusLog 타임라인 |
| 7 | 심사자 | 정책환경·특허 언급 없거나 과장 위험 | P1 | Why AX 13·14 — 보유 확인서만, 특허 "없음" 명시, 보장 금지 문구 |
| 8 | 투자 | 개선율 숫자 요구 | — | 거부: BASELINE UNKNOWN 유지 (P0 회피) |
| 9 | QA | 테마 스윕에서 eyebrow가 accent라 오탐 | — | 테스트 셀렉터 수정 (제품 이상 없음) |
| 10 | 직원 | 구버전 테마 id 저장값이 남으면? | P1 | 매그레이션 맵(store + 초기 스크립트) + 테스트 |

P2 아이디어는 RECOMMENDATIONS.md로 이동. 무한 루프 종료.

## Known Issues
- 지명원 실적 337건의 연도는 페이지 단위 기간으로만 표기(원문 레이아웃 한계).
- KPI "문의→견적 소요일"은 Project 단계 진입 시각 기록이 없어 현재값 "—" (RECOMMENDATIONS).
- 문의 현황은 같은 브라우저에서만 조회(로그인·인증 NOT BUILDING).
- `<a download>`(CSV 샘플)는 일부 임베디드 미리보기 환경에서 차단될 수 있음.
