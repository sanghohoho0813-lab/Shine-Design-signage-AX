# PROJECT_SPEC — ㈜샤인디자인 Signage AX + Customer Platform

기준 문서: 미래AI랩 AX+Platform Unified Design & Development System **v3.0 (2026-09-02)** + 회사 Master Prompt + 「(주)샤인디자인 지명원_2026」.
Delivery Stage: **DEMO** (시연 데이터 · 브라우저 저장) — 설정>데모에서 PILOT/PRODUCTION 선언 가능. 단계는 라벨과 KPI 표시 규칙만 바꾸며 데이터를 실데이터로 만들지 않는다. PILOT 전환 조건은 하단 PROOF PLAN 참조.

---

## PASS 1-A — HYBRID STRATEGY LOCK (Unified v3.0 U-6)

### AX VERDICT — **FULL / GO**
- 반복 업무가 충분하다: 지명원 기준 누적 실적 337건, 최근 2년 91건 — 연 40건 안팎의 프로젝트가 같은 8단계를 반복한다.
- 데이터가 계속 생성된다: 문의 → 견적 → 원가 → 납기 → 결과가 매 건 발생한다.
- 개선 여지가 크다: 견적·승인 대기, 원가 누락, 문의 후 미전환 세 곳 모두 지금은 사람 기억과 메신저에 있다.
- 실제 사용자가 있다: 대표 1 + 기획·설계·디자인 담당자, 그리고 공공 발주 담당자(고객).
- 남는 자산: 발주처 유형별 원가·소요일·결과 데이터, 유사실적 매칭 구조, 파트너 네트워크.

### CAPITAL INDEPENDENCE TEST — **YES**
정책자금·보증·투자가 한 푼도 없어도, "견적을 낸 뒤 원가가 드러나 손해 보는 건"과 "문의가 들어왔는데 파이프라인에 안 잡혀 잊히는 건" 두 가지만 줄여도 구축 비용 대비 경제적 이유가 있다. 자금 논리는 §13에서 마지막에 붙인다.

### PRIMARY CONSTRAINT
```
PRIMARY CONSTRAINT (TIME + MONEY LEAK):
전국 8~10개 프로젝트가 동시에 돌아가는 상황에서, 대표가 견적·승인·제작·설치 상태를
기억과 메신저에 의존해 관리하기 때문에 [승인 대기가 길어져 설치일이 밀리고 / 원가 항목이
빠진 채 견적이 나가 마진이 깎이며 / 새 문의가 파이프라인에 잡히지 않아 잊히는] 손실을
겪고 있다. 이번 프로젝트의 핵심은 문의부터 완료까지 한 흐름으로 보이게 하고, 견적 전에
원가·마진을 계산하며, 추천된 행동이 실제로 처리됐는지 남게 만드는 것이다.
```
핵심 기능 10개 중 Constraint 직결: 대시보드(오늘 할 일) · 프로젝트 관리 · 견적·원가(원가 실입력) · 설치 일정(겹침 경고) · 제작·파트너 · 입찰(결과→낙찰률) · AI 브리핑 · 증빙 = **8/10 (80%)**. Why AX·설정은 보조.

### CORE VALUE 3
1. **Cost / Efficiency** — 견적 전 원가·Margin 가시화, 승인·검수 대기 감소
2. **Revenue / Customer** — 문의 → 파이프라인 자동 유입 + 고객이 상태를 확인하는 Closed Loop, 유사실적 337건 즉시 제시
3. **Scale / Capacity** — 같은 인원으로 동시 진행 프로젝트 수 확대(전국 현장·파트너 발주를 한 화면에서)

### MONEY KPI 3 (+2) — `lib/kpi.ts`
| 종류 | KPI | 측정 지점 | Baseline |
|---|---|---|---|
| COST | 문의 → 견적 제출 소요일 | Inquiry.statusLog[접수] ↔ Project.stage=견적 진입 | **UNKNOWN** |
| COST | 목표 Margin(30%) 미달 견적 비율 | 견적·원가 관리 (costs 입력 건) | **UNKNOWN** |
| REVENUE | 문의 → 수주 전환율 | fromInquiry 프로젝트 중 stage ≥ 승인 | **UNKNOWN** |
| REVENUE | 입찰 참여 대비 낙찰률 | 입찰·제안 관리 (결과 필드는 NEXT) | **UNKNOWN** |
| SCALE | 담당자 1인당 동시 관리 프로젝트 수 | 진행 프로젝트 ÷ 담당자 수 | **UNKNOWN** |

`BASELINE STATUS: REQUIRED / UNKNOWN · TARGET: DO NOT INVENT`. 증빙 화면의 **Baseline 스냅샷** 버튼이 현재값을 시각과 함께 고정한다. DEMO 단계 스냅샷은 "실증 아님"으로 남고, Baseline 대비 변화는 PILOT 이상에서만 표시한다. 문의→견적 소요일은 `Project.stageLog`(단계 진입 시각)로 실측한다.

### CUSTOMER PRIMARY CONVERSION
**프로젝트 문의 접수** (`/inquiry` 5단계 위저드 → 접수번호 발급). 보조 전환: 전화·이메일 직접 연락, 수행 실적 검색 후 문의.

### PROCESS REDESIGN (ELIMINATE → STANDARDIZE → DIGITIZE → AUTOMATE → AI)
| 현재 단계 | 문제 | 제거 | 표준화 | 디지털화 | 자동화 | AI 필요 | 최종 상태 |
|---|---|---|---|---|---|---|---|
| 문의 접수 (전화·메일·소개) | 어디에도 안 남음 | 이중 기록 제거 | 7유형×8종류 양식 | 문의 = 파이프라인 카드 | 접수 즉시 '문의' 단계 생성 | 아니오 | **DIGITIZE+AUTOMATE (완료)** |
| 견적 산출 | 원가 항목 누락 | — | 원가 7항목 고정 | 원가 입력 = 견적 | Margin·누락 경고 자동 | 아니오(규칙) | **RULE (완료)** |
| 진행 상태 확인 | 대표 기억·카톡 | 상태 묻는 전화 제거 | 8단계 고정 | 단계 = 데이터 | 리스크 채점 | 아니오(규칙) | **RULE (완료)** |
| 파트너 발주·검수 | 따로 확인 | — | 상태 5종 | 발주 테이블 | 검수대기 → 오늘 할 일 | 아니오 | **DIGITIZE (완료)** |
| 입찰 서류 준비 | 마감 직전 누락 | — | 체크리스트 12항목 | 준비도 % | 부족 서류 우선 표시 | 나중(RAG) | **RULE (완료) → RAG (NEXT)** |
| 완료 → 실적 정리 | 손으로 다시 정리 | 재입력 제거 | 증빙 4종 | 완료 = 증빙 레코드 | 포트폴리오·유사실적 연결 | 아니오 | **AUTOMATE (완료)** |
| 아침 우선순위 | 어느 화면부터? | — | 5조건 | 오늘 할 일 | 자동 수집·정렬 | 나중(LLM 문장화) | **RULE (완료) → LLM (NEXT)** |
| 고객에게 상태 알림 | 전화로만 | 상태 묻는 전화 제거 | 3단계 | 내 문의 현황 | 담당자 변경 → 즉시 반영 | 아니오 | **DIGITIZE (완료)**, SMS는 NOT BUILDING |

### CUSTOMER CURRENT JOB-TO-BE-DONE
공공·기관 발주 담당자가 "우리 같은 기관을 해본 업체인지" 30초 안에 확인하고, 서류가 되는 업체인지 보고, 예산이 확정되기 전이라도 조건을 남겨 상담을 시작하려 한다.

### SHARED DATA ASSET / SSOT — `lib/dictionary.ts`, DATA_DICTIONARY.md
| Entity | System of Record (Demo → Next) | 입력 주체 | 민감도 | AI |
|---|---|---|---|---|
| Inquiry | localStorage → Supabase | 고객 | 높음 | 집계만 |
| Project | localStorage(시드+유입) → Supabase | AX 담당자·브릿지 | 보통 | 가능 |
| ProductionOrder | 코드 시드 → Supabase | AX 담당자 | 보통 | 가능 |
| Bid | 코드 시드 + localStorage customBids·bidChecks·bidStates(등록·서류 체크·상태·결과) → Supabase + 나라장터(NEXT) | AX 담당자 | 보통 | 가능 |
| Action | localStorage → Supabase | 시스템·사람 | 낮음 | 가능 |
| Evidence | 파생(append-only) → Supabase | 시스템 | 보통 | 가능 |
| Record | lib/records.ts (337) → Supabase | 회사 | 낮음 | 가능 |
| Event | localStorage(200) → GA4/PostHog | 시스템 | 낮음 | 집계만 |

**DATA MOAT SCORE (현재 / 12개월 후 예상)**: 독점성 1/2 · 시간축 0/2 · Outcome 연결 1/2 · 반복성 2/2 · 권리 2/2 · AI 활용 0/1 = **6/12 (중간)** → 12개월 운영 시 9~10 (강함). 12-MONTH DATA QUESTION: "발주처 유형별 표준 원가·소요일 예측이 가능해진다" — 그전엔 자산이라 부르지 않는다.

### CUSTOMER EVENT → AX MAP
| Customer Event | AX 반영 | 사람 Action | 결과 | 고객에게 돌아가는 것 |
|---|---|---|---|---|
| submit_inquiry | 파이프라인 '문의' 카드 + 오늘 할 일 + 알림 | 응대 상태 변경(접수→검토중→상담예약) | Inquiry.statusLog | **내 문의 현황**에 즉시 반영 |
| (AX) 프로젝트 완료 | 증빙 레코드 · 유사실적 | 증빙 확인 | Evidence RESULT | 홈 '최근 완료 프로젝트' |
| view_portfolio_item | (이벤트만) | — | Event | 최근 본 프로젝트 |
| search_records | (이벤트만) | — | Event | — |

### AI METHOD MATRIX — `lib/ai.ts`
| 기능 | Business Question | Input | Method | Output | Why This Method | Error Cost | Approval | Evidence |
|---|---|---|---|---|---|---|---|---|
| Project Risk | 어떤 프로젝트가 설치일을 놓칠 위험인가 | 단계·납기·지연·파트너 납기 | **RULE** L2 | 높음/보통/낮음 + 다음 행동 | 기준값 비교로 충분 | MID | 추천만 | RISK/ACTION |
| Margin Guard | 이 견적 이대로 내면 남는가 | 견적·원가 7항목 | **RULE** L2 | Margin·경고 | 수식 | **HIGH** | 견적 확정은 대표 | EFFICIENCY/REVENUE |
| Bid Readiness | 이 입찰 서류가 되는가 | 자격 8종·체크리스트·실적 | **RULE** L2 | 준비도 %·유사실적 건수 | 완료율·기관 토큰 매칭 | MID | 참여 결정은 사람 | ACTION/RESULT |
| Schedule Guard | 어느 날이 겹치고 무엇이 늦었나 | 프로젝트 납기·제작 납기·발주 상태 | **RULE** L2 | 겹침·지난 납기·제작납기>납기 | 날짜 비교 | MID | 납기 변경은 사람+사유 | SCHEDULE/RISK |
| Next Action | 오늘 무엇부터 | 5조건 | **RULE** L2 | 우선순위 목록 | 조건 수집 | LOW | 상태는 사람이 기록 | ADOPTION |

AI Fit 통과 4개 · LLM 연결 0개 · 억지 AI 포장 없음. LLM은 "사유 문장화 / 공고문 읽기(RAG)"에만 NEXT.

### UNIT ECONOMICS (측정 항목만 — `lib/kpi.ts` UNIT_ECONOMICS)
누가(발주처, 프로젝트 단위) · 무엇에(설계·제작·설치 일괄, 유지관리는 NEXT) · 반복매출(다지점·다년 발주 실재, 유지관리 계약이 정기화 경로) · 변동비(자재·파트너·설치) · CAC(문의당 영업시간×인건비) · Contribution Margin(견적−원가7항목) · LTV(발주처별 누적×평균 Margin) · Payback(구축비÷월 Margin 개선분, Baseline 후). 값은 쓰지 않는다.

### PROOF PLAN
- **Demand Proof (지금 있음)**: 지명원 실적 337건, 도로교통공단 57건, 병원·보건 39건.
- **Efficiency / Scale Proof (PREPARE NOW)**: KPI 5개 측정 지점 코드화, Evidence Log·Action Lifecycle 구조 완료. 실값은 PILOT 12주 후.
- **Adoption Proof (PREPARE NOW)**: AX Owner 필드, Action 확인·실행률(ADOPTION evidence), 행동 이벤트 레이어.
- PILOT 전환 조건: 실제 진행 프로젝트 5건 이상을 파이프라인에 입력하고 4주 운영.

### PORTAL / PLATFORM READINESS — **LOW (Industry Platform 권고 안 함)**
5 TEST: 업계 공통문제 ○ / 표준화 가능 ○ / 고객이 돈 낼 문제 △ / 플랫폼 사업자 신뢰·중립성 × / 네트워크 효과 × → 2/5. 고객 Portal은 '내 문의 현황' 수준이 적정. Industry SaaS는 NOT BUILDING.

### FUTURE EXPANSION (고객 10 · AX 9) — `components/customer/FuturePreview.tsx`, `components/ax/future.ts`
근거(`basis`) 없는 항목 없음. 현재:향후 = 사이드바 접힘으로 70:30 유지.

### MOAT CANDIDATE
Proprietary Data(발주처 유형별 원가·소요일) · Workflow(8단계+원가 7항목 표준) · Industry Know-how(BF 사인 7품목, 주물현판) · Network(전국 시공 파트너). 기술스택은 Moat가 아니다.

### RISK
- 개인정보: Inquiry(연락처) 민감도 높음 → 보관 1년, AI 집계만.
- 오류비용 HIGH: Margin Guard → 견적 확정은 항상 사람.
- Adoption: 직원 이익 = 상태 묻는 전화 감소 · 재입력 제거 · 아침 우선순위 자동.
- Demo/Live 혼동: 모든 AX 화면에 Provenance 칩("Demo Data · 브라우저 저장").

### NOT BUILDING THIS PHASE
실결제 · SMS/카카오 알림 · 로그인/회원 · 나라장터 실API · 자동발주(L4) · 자체 ML 학습 · LLM API 연결 · Native App · Industry SaaS · 특허 출원 표기. 사유·재검토 조건은 DECISIONS.md.

### PROJECT SIGNATURE (Q-2)
1. **수행 실적 337건 검색** — 지명원 기업실적을 그대로 검색 가능하게 옮긴 발주처 확인 화면 (하이라이트·기간·분야).
2. **BF 사인 카탈로그 + 직접생산확인 7품목** — 공공 조달 언어로 쓴 사업분야.
3. **오늘 할 일 → Action Lifecycle → Evidence Log** — 추천이 결정과 결과로 남는 대표 시점 대시보드.
4. **주물현판·CI 교체 전국 대응** 같은 지명원 실적에서 나온 확장 메뉴 (근거 필수).

### STRATEGIC ACCEPTANCE
Strategic P0 13항목 점검 → **0건** (QA_REPORT.md). Score A 목표 95+.

---

## Hybrid Final Objective (U-1 Closed Loop)

```
고객(발주 담당자) 필요
  → 탐색(홈·사업분야·실적 337건 검색) → 문의(5단계 위저드) → 접수번호
  → Event(submit_inquiry) → AX 파이프라인 '문의' + 오늘 할 일 + 알림
  → 담당자 응대 상태 변경 · 단계 진행 · Action 확인/실행/완료(사유)
  → Evidence(CUSTOMER / ACTION / RESULT) · KPI 측정 지점
  → 고객: 내 문의 현황에서 상태 확인 · 완료 시 홈 '최근 완료' 노출
  → 재문의 · 유사실적 · 다음 입찰
```

## Surfaces & IA

### Customer Platform (`/`)
- `/` 홈 · `/about`(연혁·조직도·자격 8종·직접생산 7품목·연락처) · `/services`(5영역 + 사인 카탈로그 48품목 + 확장 10) · `/portfolio`(21건 + 실적 337건 검색 + 최근 본) · `/portfolio/[id]` · `/process` · `/inquiry`(5단계, 초안 저장) · **`/inquiry/status`(내 문의 현황 — Closed Loop)**
- Future Expansion 10: 근거 필수, 티어 3단계, 클릭 시 Preview Sheet (404 없음)

### Business AX (`/ax`) — 메뉴 4그룹 + 향후 확장(접힘)
1. 대시보드 — KPI 8(클릭 → 상세) · 오늘 할 일(Action Lifecycle) · AI 브리핑 · Provenance
2. 프로젝트 관리 — 리스트/보드 · 상세 · 문의 응대 상태
3. 견적·원가 관리(대표) — 7항목 · Margin · 규칙 인사이트
4. 제작·파트너 관리 5. 입찰·제안 관리(서류 12항목) 6. AI 브리핑(엔진 5 · Method/Level 표시 · 처리 상태)
7. 증빙·리포트 — Money KPI 계약 · Evidence Log · 완료 증빙 · 실적 337 인쇄
8. Why AX — **15 섹션**(13 정책환경 · 14 기술자산 · 15 KPI 계약 추가)
9. 설정 — 화면(**Theme 9**) · 사용자/권한(매트릭스·AX Owner) · 데모(단계 표시) · 데이터(SSOT·CSV·이벤트) · AI(Method Matrix) · 기술·사업화 자산(정직)

## System Core
- Theme **Canonical 9** × 6 토큰(shell/primary/secondary/accent/highlight/soft) + neutral/semantic 고정 · 구버전 id 자동 마이그레이션
- Role 3 · Surface Switch · Device Preview · Tutorial 4 · Presentation 10 · 날짜시각 · Demo Reset · ⌘K
- 상태: localStorage `shine-ax-state-v1`(additive, schemaVersion 4 — v14: bidStates·readAlerts / v15: customBids·bidChecks·customOrders·orderStates, Project.deadlineLog) · 이벤트 `shine-ax-events-v1`(+ `NEXT_PUBLIC_ANALYTICS_ENDPOINT` sink) · 최근 본 `shine-recent-works` · **백업**: 설정>데이터 전체 내보내기/가져오기(검증)

## Non-Goals
NOT BUILDING 목록과 동일. 향후 확장 메뉴는 Preview Sheet로만 존재한다.

## Acceptance
QA_REPORT.md — 헤드리스 인수 테스트 + 테마 9 스윕 + 8폭 반응형 + Closed Loop + Red Team 1회.
