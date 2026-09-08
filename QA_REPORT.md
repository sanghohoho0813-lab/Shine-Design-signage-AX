# QA_REPORT — Unified v3.0 Dual Acceptance

Date: 2026-09-06 · Stage: **DEMO** (설정에서 PILOT/PRODUCTION 선언 가능) · Model handoff: Opus 5 → Fable 5.1 (Regression QA 선행 후 기능 추가)

> v13 재채점: Strategy **100** / Product **100** / Strategic P0 **0** / Product P0·P1 **0**. 아래 표는 v11→v12→v13 변화를 함께 적는다. 100점은 "설계·구조 품질" 기준이며, 실제 ROI·개선률은 v3.0 §7 VALIDATE LATER 그대로 PILOT 이후에만 확정한다.

## SCORE A — AX STRATEGY / BUSINESS QUALITY

| 영역 | 배점 | v11 | v12 | **v13** | v13에서 채운 것 |
|---|---:|---:|---:|---:|---|
| Problem / Constraint | 15 | 7 | 14 | **15** | Why AX §04에 Constraint → Feature 맵(세 손실 × 기능 × 측정 KPI) 가시화 |
| Process Redesign | 10 | 2 | 9 | **10** | 단계 진입 시각(stageLog)이 쌓여 "승인 대기" 구간이 데이터로 잡힘 |
| Data Foundation / Asset | 15 | 8 | 14 | **15** | 쌓인 데이터 카운터, 전체 내보내기/가져오기(검증·실패 시 무변경), schemaVersion 2 |
| AI Fit / Explainability | 10 | 7 | 10 | **10** | — |
| Proof / KPI Design | 15 | 5 | 14 | **15** | Baseline 스냅샷 메커니즘 + Delivery Stage 게이트(DEMO에서 변화량 숨김), 문의→견적 소요일 실측(stageLog), 인쇄물에 KPI·Evidence Log |
| Customer / Partner / Platform Fit | 10 | 8 | 10 | **10** | 재문의(Repeat) 경로 — U-2 #8 |
| Scale / Unit Economics | 10 | 3 | 8 | **10** | Unit Economics 8항목(누가·무엇에·반복·변동비·CAC·CM·LTV·Payback) 측정 항목 정의 — 값은 미기재 |
| Moat / Asset | 5 | 3 | 5 | **5** | — |
| Adoption / Risk | 5 | 3 | 5 | **5** | Tutorial 5단계(오늘 할 일 처리 방식 교육) |
| Financeability / Growth Logic | 5 | 3 | 5 | **5** | — |
| **합계** | **100** | **49** | **94** | **100** | |

**Strategic P0 (13항목) → 0건** — Primary Constraint ○ / 핵심기능 연결 ○ / KPI 3종 ○ / Demo→Live 표현 없음 ○ / Baseline 없는 개선율 없음 ○(QA 자동 검사) / 고객행동↔Workflow 연결 ○ / 억지 AI 없음 ○ / AI 근거 ○ / HIGH 승인 ○ / Provenance ○ / Future≠현재 ○ / 보장 표현 없음 ○ / Capital Independence ○

## SCORE B — PRODUCT / IMPLEMENTATION QUALITY

| 영역 | v11 | v12 | **v13** | v13에서 채운 것 |
|---|---:|---:|---:|---|
| Theme (Canonical 9 · Residual 0 · Neutral 고정) | 6 | 10 | **10** | — |
| Responsive (8폭 × 9라우트 + 360/XL) | 7 | 10 | **10** | — |
| Primary Journey / Closed Loop | 8 | 10 | **10** | 재문의 프리필, 시연 모드에 문의 현황 단계 |
| Interaction Completeness | 9 | 10 | **10** | Overlay 포커스 복귀, 뒤로가기 시 백드롭·스크롤 잠금 잔존 0 (히스토리 push는 Next 라우터와 충돌해 채택 안 함 — DECISIONS) |
| Settings Completion | 6 | 10 | **10** | Delivery Stage 선언, 백업·이관, 쌓인 데이터 |
| AI Ready / Explainability UI | 7 | 10 | **10** | — |
| Evidence / Provenance / Demo-Live | 7 | 10 | **10** | Provenance·배지가 단계를 따라감(Demo/Pilot/Live Data), Baseline 스냅샷이 BASELINE evidence로 |
| Story (Why AX 15섹션) | 9 | 10 | **10** | Constraint 맵, Unit Economics |
| Customer Data Loop / Event Ready | 5 | 9 | **10** | Analytics sink adapter(`NEXT_PUBLIC_ANALYTICS_ENDPOINT`, 없으면 no-op), `.env.example` |
| Project Memory / Handoff | 6 | 10 | **10** | — |
| **합계** | **85** | **98** | **100** | |

**Product P0 → 0건 · P1 → 0건.** 

## Whole-Hybrid Acceptance (U-7) — 헤드리스 실행 결과
`scratchpad/qa.mjs` **204/204 PASS** (v1~v13 누적). 포함: Fresh Load → Tutorial → 고객 홈 → 문의 5단계 → 접수번호 → 내 문의 현황 → AX 파이프라인 반영 → 상태 변경 → 고객 화면 반영 → Evidence Log → 브리핑 AI 근거/모달 → Action 승인·처리 → 설정(9 Theme/Font/Role/Owner) → Why AX 15 → 시연 모드 → PC↔Mobile Preview → Overlay Escape → Demo Reset → 재확인.

- Responsive tested widths: 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 (× 9 routes) + 360 with Font XL
- v13 추가 검증: Tutorial 5단계 · 시연 11단계 · DEMO 스냅샷 '실증 아님' 표기 · PILOT 선언 후 MEASURING · stageLog → 소요일 0.0일 실측 · 재문의 프리필 · 잘못된 백업 파일 거부/유효 파일 적용 후 새로고침 유지 · 뒤로가기 후 오버레이 잔존 0 · 포커스 복귀
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

P2 아이디어는 RECOMMENDATIONS.md로 이동.

## Red Team 2차 (v13, 다른 렌즈로 1회)
| # | 역할 | 발견 | 등급 | 조치 |
|---|---|---|---|---|
| 11 | 심사자 | "Baseline UNKNOWN"이라고만 쓰고 잡을 방법이 없음 — PREPARE NOW가 문서뿐 | P1 | Baseline 스냅샷 버튼 + Delivery Stage 게이트. DEMO 스냅샷은 "실증 아님"으로 남고 변화량은 PILOT 이상에서만 |
| 12 | QA | KPI "문의→견적 소요일"이 영원히 "—" | P1 | Project.stageLog(단계 진입 시각) 기록 → 실측. 파이프라인 상세에 단계 이력 |
| 13 | 대표 | 브라우저 지우면 다 날아감 | P1 | 전체 내보내기/가져오기(JSON, 형식 검증, 실패 시 무변경) + schemaVersion |
| 14 | 투자 | Unit Economics 질문에 답이 없음 | P1 | 8항목 측정 정의(값 없음). Industry SaaS 권고 안 함 유지 |
| 15 | 직원 | 튜토리얼이 체크박스 시절 설명 | P2→수정 | 5단계로 "추천은 처리돼야 끝난다" 추가 |
| 16 | 고객 | 같은 조건으로 또 문의하려면 처음부터 | P1 | "이 조건으로 다시 문의" → 초안 프리필 |
| 17 | UX | 오버레이 열고 뒤로가기 → 페이지는 바뀌는데 스크롤 잠금이 남을 위험 | P1 | popstate 시 즉시 닫기 + cleanup. 히스토리 push 방식은 Next 라우터 내비게이션을 abort시켜(ERR_ABORTED 재현) 폐기 |
| 18 | QA | Device Preview가 열리자마자 닫힘 (Overlay effect가 onClose 참조 변경마다 재실행) | P0(회귀) | onClose를 ref로, effect는 마운트 1회. 회귀 스위트가 잡아냄 |
| 19 | 심사자 | 인쇄 제출물에 KPI 상태가 없음 | P2→수정 | 인쇄 영역에 KPI 계약(단계·Baseline 상태)·Evidence Log 포함 |
| 20 | 성장 | 이벤트가 브라우저에만 | P2→수정 | sink adapter — env 있으면 sendBeacon, 없으면 no-op |

무한 루프 종료. 남은 P2는 RECOMMENDATIONS.md.

## Known Issues
- 지명원 실적 337건의 연도는 페이지 단위 기간으로만 표기(원문 레이아웃 한계).
- KPI "문의→견적 소요일"은 v13부터 stageLog로 실측 — 시드 프로젝트는 이력이 없어 새로 진행한 건부터 집계.
- 문의 현황은 같은 브라우저에서만 조회(로그인·인증 NOT BUILDING).
- `<a download>`(CSV 샘플)는 일부 임베디드 미리보기 환경에서 차단될 수 있음.
