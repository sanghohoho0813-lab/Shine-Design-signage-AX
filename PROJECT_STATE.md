# PROJECT_STATE

기준: Unified v3.0 (2026-09-02). 현재 Stage **DEMO** (설정에서 PILOT/PRODUCTION 선언). Score A **100** / Score B **100** / P0 **0** (QA_REPORT.md). 100점은 설계·구조 품질이며 실제 ROI는 PILOT 이후.

## STRATEGIC GATES (v3.0 §22)
| Gate | 상태 | 근거 |
|---|---|---|
| PRIMARY CONSTRAINT STATUS | **LOCKED** | PROJECT_SPEC — 견적·승인 대기 / 원가 누락 / 문의 누락. 핵심기능 6/9 직결 |
| MONEY KPI / BASELINE STATUS | **DEFINED · BASELINE UNKNOWN · 스냅샷 메커니즘 준비** | `lib/kpi.ts` 5개, stageLog로 소요일 실측, Baseline 스냅샷 버튼, DEMO에서는 변화량 숨김 |
| DATA FOUNDATION | **SSOT 정의됨 · 백업 가능** | `lib/dictionary.ts` 8 Entity · Data Moat 6/12 · schemaVersion 2 · 내보내기/가져오기 |
| AI / LOGIC STATUS | **RULE ×4 · LLM 0** | `lib/ai.ts` Method Matrix · L2 · 오류비용 · 승인 · AI Ready 모달 |
| PROOF STATUS | **PREPARE NOW (메커니즘 완료)** | Evidence Log 9 type · Action Lifecycle · Baseline 스냅샷 · 인쇄 Evidence Pack · Event 12종 + sink |
| ADOPTION READINESS | **준비됨** | AX Owner 필드 · 직원 이익 3 · Adoption KPI 정의 |
| RISK / GOVERNANCE | **정리됨** | Inquiry 민감도 높음/1년 · HIGH 오류비용 사람 승인 · Provenance 전 화면 |
| PLATFORM READINESS | **LOW (2/5)** | Industry SaaS 권고 안 함 · 고객 Portal = 내 문의 현황 수준 |
| EVIDENCE STATUS | **구조 완료 · 값 없음** | 12주 Pack 재료 준비. Demo 값 미사용 |
| RED TEAM FINDINGS | **2회 실행 · 20건 조치** | QA_REPORT.md 표 (1차 10 · 2차 10) |

## 데이터 출처
- 「(주)샤인디자인 지명원_2026」 — `lib/company.ts` / `lib/records.ts` (337건)
- 사업자등록증 · 실제 현장 사진 47장

## v13 — 100점 마감 (최신)
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
- 9 모듈 + 향후 확장 9(접힘) · 메뉴 4그룹 · Role 3 · Tutorial 4 · Presentation 10 · Theme 9 ✅

## CUSTOMER FRONT
- 홈 / 회사소개 / 사업분야(+카탈로그 48 +확장 10) / 포트폴리오(21 + 실적 337 + 최근 본) / 프로세스 / 문의(5단계) / **문의 현황** ✅ · 404 없음 ✅

## DATA BRIDGE
- Bridge 1: 문의 → 파이프라인 '문의' + 오늘 할 일 + 알림 ✅
- Bridge 2: 완료 → 증빙 + 고객 홈 ✅
- **Bridge 3 (v12)**: AX 응대 상태 → 고객 '내 문의 현황' ✅

## QA
- 헤드리스 인수 테스트 **204/204 PASS** (`scratchpad/qa.mjs`, v1~v13)

## USER ACTION QUEUE
- (선택) Vercel 재배포
- (선택) PILOT 진입: 실제 진행 프로젝트 5건 입력 → 4주 Baseline 측정
- (선택) Supabase 연결 — SSOT 표 그대로 · RLS = 권한 매트릭스
- (선택) 지명원 현장 사진 추출 → 포트폴리오 확대

## KNOWN ISSUES
- 지명원 실적 연도는 페이지 단위 기간 표기 (원문 레이아웃 한계)
- 시드 프로젝트에는 stageLog가 없어 '문의→견적 소요일'은 새로 진행한 건부터 집계
- 문의 현황은 같은 브라우저 조회(로그인 NOT BUILDING)
