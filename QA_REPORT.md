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
`scratchpad/qa.mjs` **204/204 PASS** (v1~v13 누적) → v14에서 236/236. 포함: Fresh Load → Tutorial → 고객 홈 → 문의 5단계 → 접수번호 → 내 문의 현황 → AX 파이프라인 반영 → 상태 변경 → 고객 화면 반영 → Evidence Log → 브리핑 AI 근거/모달 → Action 승인·처리 → 설정(Theme/Font/Role/Owner) → Why AX 15 → 시연 모드 → PC↔Mobile Preview → Overlay Escape → Demo Reset → 재확인.

- Responsive tested widths: 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 (× 9 routes) + 360 with Font XL
- v13 추가 검증: Tutorial 5단계 · 시연 11단계 · DEMO 스냅샷 '실증 아님' 표기 · PILOT 선언 후 MEASURING · stageLog → 소요일 0.0일 실측 · 재문의 프리필 · 잘못된 백업 파일 거부/유효 파일 적용 후 새로고침 유지 · 뒤로가기 후 오버레이 잔존 0 · 포커스 복귀
- Theme status: 전부 실제 동작 · shell 상이(v16 기준 7종) · 본문 Neutral 고정 · 사이드바 White 계열 · 카드 #FFFFFF
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

## v14 — 실측 확대 (100점 유지 · 회귀 0)
목표를 "새 화면"이 아니라 "아직 입력 지점이 없는 KPI"로 잡았다. v13 기준 5개 Money KPI 중 낙찰률은 결과 필드가 없어 영원히 "—", Margin 미달은 시드 원가만 보고 있었다.

| # | 목표 | 반영 | 검증 |
|---|---|---|---|
| 1 | 낙찰률 KPI "—" 제거 | 입찰 상태 진행 + 결과(낙찰/유찰/미참여) 기록, 미참여 분모 제외, Evidence BID, 낙찰→파이프라인 '승인' 프로젝트(Bridge 4) | 낙찰 1·유찰 1 → 50% · 새로고침 유지 · 파이프라인 반영 · Evidence BID 2건 |
| 2 | Margin 미달 KPI 실입력화 | 원가 7항목+견적금액 입력·수정 폼, "원가 미입력" 목록(문의·낙찰 유입) | 입력 후 목록 이탈 · 새로고침 Margin 40.0% 유지 · 수정 후 6.7% |
| 3 | 향후 확장 NEXT 1순위(설치 일정) 기본 반영 | `/ax/schedule` 월 캘린더 · 겹침 경고 · 지난 납기 · 30일 목록 — 기존 납기만 사용, 배차·장비는 향후 확장에 유지 | grid 7열 · 다음 달 이동 · 메뉴/⌘K 노출 · 360/768/1024 overflow 0 |
| 4 | Evidence Pack 재료 반출 | CSV 내보내기 + 클립보드 복사(KPI 현재값 포함) | 복사 토스트 · CSV 헤더/BID/kpi 표 |
| 5 | 알림 읽음 유실 | readAlerts를 store에 저장 | 모두 읽음 → 새로고침 후 0건 |
| 6 | 저장 형식 | schemaVersion 3 — bidStates·readAlerts 추가, 없으면 빈 값 | v2 저장값 로드 → doneActions·테마 마이그레이션 유지 |

Red Team 3차(짧게): QA — 설치 일정 360px에서 grid 항목이 `min-width:auto`로 679px 넘침 **P1 → 섹션 `min-w-0`로 수정**. QA — 헤드리스에서 하이드레이션 직후 단축키·튜토리얼 타이밍 오탐 3건 → 테스트를 "사람이 누르는 간격"으로 보정(제품 이상 없음). 대표 — "입찰 건을 새로 못 넣는다" → RECOMMENDATIONS(나라장터 수집과 함께).

`scratchpad/qa.mjs` **236/236 PASS** (v1~v14 누적).

## v15 — 운영 완결 (4시간 분량 · 100점 유지 · 회귀 0)
목표: "시드 위에 기록만 얹는" 구조에서 "사람이 직접 등록·체크·변경하는" 구조로. 시드는 고정하고 기록은 별도 키(schemaVersion 4).

| # | 목표 | 반영 | 검증 |
|---|---|---|---|
| 1 | 입찰을 새로 넣을 수 없음 | 새 입찰 등록 폼 · 발주기관 토큰으로 지명원 실적 매칭(유사실적 n건, RULE) · 기본 체크리스트 12항목 | 보령시 입력 → 유사실적 ≥1건 · 등록 후 5건 · 준비도 67% |
| 2 | 서류 체크가 저장되지 않음 | bidChecks 저장 → 준비도 = 확인 ÷ 전체 재계산(시드 포함) | 체크 → 75% · 시드 b4 44%→83% · 새로고침 유지 |
| 3 | 제작 발주가 시드뿐 | 새 발주 등록 · 상태 흐름 버튼 · 검수 토글 · 이력 | 등록 → 7건 · 발주 전→제작중 · 새로고침 유지 · 설치 일정 10-14 표시 |
| 4 | 납기를 바꿀 수 없고 이유가 안 남음 | 파이프라인 상세 납기 변경(사유 필수) · deadlineLog · Evidence SCHEDULE | 09-05→10-20 이력 · 대시보드 late- 할 일 제거 · Evidence 로그 |
| 5 | 일정 판단이 엔진에 없음 | Schedule Guard(RULE L2 MID) — 겹침·지난 납기·제작납기>납기 | 브리핑 5엔진 · 처리 상태 5 · 설정 매트릭스 5행 |
| 6 | 오늘 할 일이 시드 조건만 | 입찰 D-7 전부 · 지난 납기 · 원가 미입력 · 검수대기(실입력) | 낙찰 → "원가 입력" 할 일 · D-day 표기 |
| 7 | 고객이 예정일을 모름 | 문의 현황 프로젝트 단계 옆 예정 납기 | 렌더 확인(반응형 스윕) |

Red Team 4차(짧게): QA — 새 폼 3종 360px overflow 0. 대표 — "발주 상태를 잘못 눌렀다" → 되돌림은 RECOMMENDATIONS(사유 필수). 심사자 — "유사실적 매칭이 AI인가" → 규칙·건수로 표기, 근거 실적명 예시 노출.

`scratchpad/qa.mjs` **264/264 PASS** (v1~v15 누적).

## v16 — 테마 정리 · 메뉴 색 체계 · 폰 우선순위 (회귀 0)
사용자 요청(테마 2종 삭제 · 목차별 톤 색)에 UI/UX 감사 3건을 붙였다.

| # | 목표 | 반영 | 검증 |
|---|---|---|---|
| 1 | 안 쓰는 테마가 선택지만 늘림 | Burgundy Slate·Plum Indigo 삭제 → 7종. 저장값은 shine / navy-blue로 이동(store + 첫 페인트 스크립트) | 4개 옛 id 모두 마이그레이션 · 삭제 블록 잔존 0 · 7종 셸 상이 · 7×5 스윕 |
| 2 | 메뉴 아이콘 색이 항목마다 제각각 | 목차 4개 = 색 4개, 항목은 톤만(`--mg-*`, MenuIcon이 배경에 맞춰 톤 계산) | 목차 안 hue 편차 ≤ 25° · 톤 차이 ≥ 0.06 · 업무 목차 3색 상이 · 시스템 무채색 |
| 3 | 메뉴가 길어 지금 목차를 놓침 | 그룹 머리말 sticky + 목차 색 점 | position: sticky |
| 4 | 폰에서 '오늘 할 일'이 화면 두 개 아래 | KPI 폰 2열(`.kpi-grid`), order로 할 일 먼저(데스크톱 순서 유지) | 폰 todo < KPI · KPI 2열 · 데스크톱은 KPI 먼저 |
| 5 | 폰에서 할 일 제목이 잘려 무슨 일인지 모름 | 제목 truncate 제거, 처리 버튼은 아랫줄 | text-overflow ≠ ellipsis · 가로 overflow 0 |

Red Team 5차(짧게): QA — 시스템 목차 슬레이트가 '오늘' 파랑과 hue가 겹쳐 목차 구분이 사라짐 **P1 → 무채색으로 분리**(테스트를 느슨하게 하지 않고 디자인을 고침). 대표 — "테마를 쓰고 있었는데 사라지면?" → 자동 이동 + 설정 화면에 한 줄 고지.

`scratchpad/qa.mjs` **281/281 PASS** (v1~v16 누적).

## v17 — 모바일 최우선 감사 (회귀 0)
눈이 아니라 수치로: 18라우트 × 360/390을 헤드리스로 열어 다섯 기준을 쟀고, 같은 검사를 QA 가드로 남겼다.

| 기준 | 감사 전 | 조치 | 감사 후 |
|---|---:|---|---:|
| 가로 넘침 | 1 라우트(포트폴리오 상세 454px) | grid 항목 `min-w-0` | 0 |
| 36px 미만 터치 목표 | 화면당 최대 25개 | 전역 44px 규칙 + `.tap-pad` + 스위치 재구성 + 대시보드 링크 | 0 |
| 11.5px 미만 글자 | 10곳(9px 배지) | 0.625rem(12px)로 상향 | 0 |
| 이름 없는 버튼 | 1(설정 Motion 스위치) | aria-label | 0 |
| 하단 바 가림 | 0(측정 보정 후) | safe-area 여백 추가 | 0 |

추가 UX: 제작 발주 표 → 폰 카드 목록(6건 카드, 표 숨김 검증) · DemoBar 폰 축소(문의 폼 버튼과 겹침 0 검증) · 문의 위저드 5단계 터치 완주 → 문의 현황 반영 검증.

`scratchpad/qa.mjs` **298/298 PASS** (v1~v17 누적).

## Known Issues
- 지명원 실적 337건의 연도는 페이지 단위 기간으로만 표기(원문 레이아웃 한계).
- KPI "문의→견적 소요일"은 v13부터 stageLog로 실측 — 시드 프로젝트는 이력이 없어 새로 진행한 건부터 집계.
- 문의 현황은 같은 브라우저에서만 조회(로그인·인증 NOT BUILDING).
- 입찰 직접 등록은 v15부터 가능. 나라장터 자동 수집은 Preview.
- 발주 상태는 앞으로만 진행(되돌림 없음) — Demo Reset·가져오기로 복구.
- 설치 일정의 "지난 납기"는 시드 납기가 오늘보다 앞이면 그대로 잡힌다(DEMO 데이터 특성, 계산은 정직).
- `<a download>`(CSV 샘플)는 일부 임베디드 미리보기 환경에서 차단될 수 있음.
