# PROJECT_STATE

기준: Unified v3.0 (2026-09-02). 현재 Stage **DEMO** (설정에서 PILOT/PRODUCTION 선언). Score A **100** / Score B **100** / P0 **0** (QA_REPORT.md). 100점은 설계·구조 품질이며 실제 ROI는 PILOT 이후.

## STRATEGIC GATES (v3.0 §22)
| Gate | 상태 | 근거 |
|---|---|---|
| PRIMARY CONSTRAINT STATUS | **LOCKED** | PROJECT_SPEC — 견적·승인 대기 / 원가 누락 / 문의 누락. 핵심기능 6/9 직결 |
| MONEY KPI / BASELINE STATUS | **DEFINED · BASELINE UNKNOWN · 5/5 측정 가능** | `lib/kpi.ts` 5개 — v14부터 낙찰률(입찰 결과)·Margin 미달(원가 실입력)까지 입력 지점 있음. Baseline 스냅샷, DEMO에서는 변화량 숨김 |
| DATA FOUNDATION | **SSOT 정의됨 · 백업 가능 · 입력 지점 7곳** | `lib/dictionary.ts` 8 Entity · schemaVersion 4 · 문의/원가/입찰 등록·체크·결과/발주 등록·상태/납기 변경 · 내보내기/가져오기 |
| AI / LOGIC STATUS | **RULE ×5 · LLM 0** | `lib/ai.ts` Method Matrix(+Schedule Guard) · L2 · 오류비용 · 승인 · AI Ready 모달 |
| PROOF STATUS | **PREPARE NOW (메커니즘 완료)** | Evidence Log 7 type(+BID·SCHEDULE) · CSV/복사 · Action Lifecycle · Baseline 스냅샷 · 인쇄 Evidence Pack(입찰 결과 표) · Event 18종 + sink |
| ADOPTION READINESS | **준비됨** | AX Owner 필드 · 직원 이익 3 · Adoption KPI 정의 |
| RISK / GOVERNANCE | **정리됨** | Inquiry 민감도 높음/1년 · HIGH 오류비용 사람 승인 · Provenance 전 화면 |
| PLATFORM READINESS | **LOW (2/5)** | Industry SaaS 권고 안 함 · 고객 Portal = 내 문의 현황 수준 |
| EVIDENCE STATUS | **구조 완료 · 값 없음** | 12주 Pack 재료 준비. Demo 값 미사용 |
| RED TEAM FINDINGS | **2회 실행 · 20건 조치** | QA_REPORT.md 표 (1차 10 · 2차 10) |

## 데이터 출처
- 「(주)샤인디자인 지명원_2026」 — `lib/company.ts` / `lib/records.ts` (337건)
- 사업자등록증 · 실제 현장 사진 47장

## v15 — 운영 완결 (최신)
- **입찰 직접 등록** + 발주기관 토큰으로 지명원 실적 매칭(유사실적 n건 · RULE) · **서류 체크 저장** → 준비도 = 확인 ÷ 전체로 재계산(시드도 체크하면 재계산) ✅
- **제작 발주 실입력** 새 발주 등록(프로젝트·파트너·품목·납기·제작비) · 상태 흐름(발주 전→제작중→검수대기→완료→설치대기) · 검수 토글 · 이력 → 설치 일정·오늘 할 일·브리핑에 반영 ✅
- **납기 변경 + 사유** 파이프라인 상세에서 변경, deadlineLog 이력 · Evidence SCHEDULE ✅
- **Schedule Guard** 5번째 규칙 엔진(겹침·지난 납기·제작납기>프로젝트납기) · 설정 AI 매트릭스 5행 ✅
- **오늘 할 일 확장** 입찰 마감 D-7 전부 · 지난 납기(late-) · 원가 미입력(cost-) · 검수대기(실입력 기준) ✅
- 고객 문의 현황에 예정 납기 표시 · 인쇄 Evidence Pack에 입찰 결과 표 ✅
- QA 264/264 · 회귀 0 ✅

## v14 — 실측 확대
- **입찰 결과 기록** 발굴→검토→준비→제출→결과대기 진행 + 낙찰/유찰/미참여(메모) → **낙찰률 KPI 실측**(미참여는 분모 제외) · Evidence BID · 낙찰은 파이프라인 '승인' 프로젝트로(Bridge 4) ✅
- **원가 실입력** 견적·원가 관리에서 7항목+견적금액 입력·수정, "원가 미입력" 목록(문의·낙찰 유입 건) → Margin 미달 KPI가 실입력 기준 ✅
- **설치 일정** `/ax/schedule` 월 캘린더(납기·제작 납기), 겹침 경고, 지난 납기, 30일 목록 — 새 데이터 없이 기존 날짜만 사용 ✅
- Evidence Log **CSV 내보내기 + 복사**(KPI 현재값 포함) · 알림 읽음 상태 저장 · schemaVersion 3(추가 필드만) ✅
- QA 236/236 · 회귀 0 · 신규 P1 1건(설치 일정 360px overflow) 수정 ✅

## v13 — 100점 마감
- **Delivery Stage** DEMO/PILOT/PRODUCTION 선언 (설정>데모, confirm) — 상단 배지·DemoBar·Provenance가 따라감 ✅
- **Baseline 스냅샷** (증빙) — DEMO 스냅샷은 "실증 아님", PILOT 이상에서만 Baseline 대비 라벨 ✅
- **stageLog** — 단계 진입 시각 → 문의→견적 소요일 실측, 파이프라인 상세 단계 이력 ✅
- **백업·이관** — 전체 JSON 내보내기/가져오기(검증, 실패 시 무변경), schemaVersion 2, 쌓인 데이터 카운터 ✅
- Why AX §04 Constraint→Feature 맵, §15 Unit Economics 8항목 ✅
- 재문의 프리필 · Tutorial 5단계 · 시연 11단계(문의 현황) · 인쇄물에 KPI·Evidence Log ✅
- Overlay 포커스 복귀 + 뒤로가기 cleanup · Analytics sink adapter + `.env.example` ✅

## v12 — Unified v3.0 반영
- **Canonical 9 Theme** (`lib/store.tsx`, `app/globals.css`) — 6토큰 + highlight/on-accent, neutral·semantic 별칭. 구버전 id 자동 마이그레이션(store + 초기 스크립트). 9×5 잔존색 스윕 통과 ✅
- **Action Lifecycle** — 추천됨→확인→실행중→완료 / 보류 / 무시(사유). `doneActions` → `actionStates` 마이그레이션, 새로고침 유지 ✅
- **Closed Loop 완성** — `/inquiry/status` 내 문의 현황: AX 상태 변경 → 고객 화면 즉시 반영, statusLog 타임라인 ✅
- **Settings 6섹션** — 화면(9테마×6도트) · 사용자/권한(매트릭스·AX Owner) · 데모(Stage) · 데이터(SSOT·CSV·이벤트) · AI(Matrix) · 기술자산(정직) ✅
- **AI Ready 모달**(16.3) + 엔진별 Method·Level·승인 표기 ✅ · **Provenance 칩** 전 AX 화면 ✅
- **증빙** — Money KPI 계약(BASELINE UNKNOWN) + Evidence Log ✅ · **Why AX 15섹션**(정책환경·기술자산·KPI) ✅
- **Event 레이어** 12종 · **최근 본 프로젝트** ✅
- 반응형 8폭×9라우트 + 360/XL overflow 0 (P0 1건·P1 2건 수정) ✅
- Handoff: PROJECT_SPEC(U-6 잠금) · QA_REPORT · RECOMMENDATIONS · EVIDENCE_PLAN · DATA_DICTIONARY ✅

## v11 향후 확장 · v10 지명원 · v9 메뉴 분류 · v8 전환 연출 — 유지 (DECISIONS.md)

## BUSINESS AX
- 10 모듈 + 향후 확장 9(접힘) · 메뉴 4그룹 · Role 3 · Tutorial 5 · Presentation 11 · Theme 9 · 규칙 엔진 5 ✅

## CUSTOMER FRONT
- 홈 / 회사소개 / 사업분야(+카탈로그 48 +확장 10) / 포트폴리오(21 + 실적 337 + 최근 본) / 프로세스 / 문의(5단계) / **문의 현황** ✅ · 404 없음 ✅

## DATA BRIDGE
- Bridge 1: 문의 → 파이프라인 '문의' + 오늘 할 일 + 알림 ✅
- Bridge 2: 완료 → 증빙 + 고객 홈 ✅
- **Bridge 3 (v12)**: AX 응대 상태 → 고객 '내 문의 현황' ✅
- **Bridge 4 (v14)**: 입찰 낙찰 → 파이프라인 '승인' 프로젝트 → 원가 미입력 목록 ✅

## QA
- 헤드리스 인수 테스트 **264/264 PASS** (`scratchpad/qa.mjs`, v1~v15)

## USER ACTION QUEUE
- (선택) Vercel 재배포
- (선택) PILOT 진입: 실제 진행 프로젝트 5건 · 진행 중 입찰 등록 · 발주 등록 · 원가 실입력 → 4주 Baseline 측정
- (선택) Supabase 연결 — SSOT 표 그대로 · RLS = 권한 매트릭스
- (선택) 지명원 현장 사진 추출 → 포트폴리오 확대

## KNOWN ISSUES
- 지명원 실적 연도는 페이지 단위 기간 표기 (원문 레이아웃 한계)
- 시드 프로젝트에는 stageLog가 없어 '문의→견적 소요일'은 새로 진행한 건부터 집계
- 문의 현황은 같은 브라우저 조회(로그인 NOT BUILDING)
