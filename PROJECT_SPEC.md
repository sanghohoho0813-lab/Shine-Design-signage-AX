# PROJECT_SPEC — SHINE DESIGN Signage AX + Customer Platform

기준 문서: 미래AI랩 AX+Platform Unified Design & Development System **v1.4** + 회사 Master Prompt.

## Hybrid Final Objective

```
Customer Front(기업 사이트/포트폴리오/문의)
  → 프로젝트 문의(5-Step Wizard)
  → Business AX Pipeline "문의" 단계 자동 생성   ← Data Bridge 1 (Customer → AX)
  → 디자인/견적/제작 파트너/설치
  → 완료 → 증빙·리포트 + 고객 홈 "최근 완료 프로젝트" 노출  ← Data Bridge 2 (AX → Customer)
  → Portfolio 자산 → 입찰 준비도/유사실적
```

## Surfaces & IA

### Customer Platform (`/`)
- `/` 홈: Hero(hero_main) → 신뢰 지표 4 → 공공 경험 6카드 → 사업분야 3 → 브랜드 스토리(brand_story) → 최근 완료(Bridge 2) → CTA(booking_scene)
- `/about` 회사소개 · `/services` 사업분야 5 · `/portfolio` 필터 그리드 8건 + `/portfolio/[id]` 상세 · `/process` 9단계 · `/inquiry` 5-Step 위저드(Bridge 1)
- Future Expansion (75:25 규칙, 클릭 시 Preview Sheet — 404 없음): 공공입찰·기관문의(NEXT) / 기업·브랜드(확장) / 협력사·제작 파트너(Preview) / 사인 유지관리(NEXT) — 각각 태그라인 + 예정기능 5 + Growth Signal

### Business AX (`/ax`)
1. 대시보드 — KPI 8 + AI 브리핑 + 파이프라인/파트너/입찰 요약
2. 프로젝트 관리 — 8단계 칸반 + 상세 Drawer + 단계 진행(Bridge)
3. 견적·원가 관리 — 7개 비용항목, Margin, 규칙 기반 인사이트 (대표 전용)
4. 제작·파트너 관리 — 파트너 4사 + 발주 테이블 + QC/설치 연결
5. 입찰·제안 관리 — 준비도 %, 체크리스트 9종, AI 인사이트
6. AI 브리핑 — 4 엔진(Project Risk / Margin Guard / Bid Readiness / Next Action), What→Why→Action
7. 증빙·리포트 — Closed Loop + 완료 프로젝트 증빙 레코드
8. Why AX — BEFORE/AFTER/GROWTH 스토리 (why_ax_01~03)
9. 설정 — Theme 6종 / Font / Motion / Role / Demo Reset / Tutorial replay / AI READY

## System Core
- Theme 6종 (Shine Graphite Gold 기본 + Navy/Teal/Burgundy/Indigo/Forest) — CSS 변수, PC/모바일 공유
- Role: 대표(전체) / 직원(금액 제한) / 고객(AX 차단 + 진입점 숨김)
- Surface Switch: AX 사이드바 "고객 사이트 보기" ↔ Customer DemoBar "Business AX 보기"(관리자 Role 전용)
- Device Preview: 데스크톱→모바일(390px iframe), 모바일→PC(1280px scaled) · 재귀 방지(embedded 감지) · ESC/백드롭/X 닫기
- Tutorial: 4-Step, 실제 Route 자동 이동 + Spotlight
- 날짜+시각: 데스크톱 풀 포맷 / 모바일 압축(08.31 일 + 시각)
- Demo Reset: 시드 데이터 복원
- 상태 저장: localStorage (`shine-ax-state-v1`)

## Feature Parity Matrix

| 기능 | Desktop | Mobile | Preview | Discoverable |
|---|---|---|---|---|
| 전체 Navigation | 헤더/사이드바 | Drawer+하단탭 | ✓(iframe) | ✓ |
| 날짜+현재시각 | 풀 포맷 | 압축 2줄 | ✓ | AX 탑바 |
| Theme 6종 | ✓ | ✓(상태 공유) | ✓ | 설정 |
| Font Scale | ✓ | ✓ | ✓ | 설정 |
| Role Preview | ✓ | ✓ | ✓ | 설정 |
| Tutorial | ✓ | ✓ | — | 최초 진입+설정 |
| Why AX | ✓ | ✓ | ✓ | 사이드바/Drawer |
| Demo Reset | ✓ | ✓ | ✓ | 설정 |
| Surface Switch | ✓ | ✓ | ✓ | 사이드바+DemoBar |

## Asset Mapping (22종, Google Drive 폴더 기준)
Customer(60~80% 활용): hero_main(홈 Hero) · hero_secondary(프로세스 CTA/포트폴리오) · service_01~03(사업분야/신뢰카드) · offer_01~03(포트폴리오/사업분야) · brand_story(스토리/어바웃) · customer_experience(어바웃) · booking_scene(문의 CTA/완료) · trust_banner(포트폴리오 Hero)
AX(30~50% 절제 활용): ax_cover(Why AX 상단) · ax_operation(제작 배너) · ax_evidence(증빙 배너) · ax_manager(AI 카드 배경 14% 투명) · why_ax_01~03(Why AX 스토리)
미사용(의도적 절제): ax_signature_output · ax_workspace_bg · ax_staff_action · mobile_card_vertical — AX 시각 우선순위(KPI→AI→Action) 유지 목적

## Non-Goals (범위 제외)
실 PG/SMS/카카오/입찰 API/ERP/회계/네이티브 앱 — Master Prompt §27.

## Acceptance
- 고객 여정: 홈→포트폴리오→문의 5단계→접수 확인
- AX 여정: 튜토리얼→대시보드→파이프라인 단계 진행→견적→파트너→입찰→AI→증빙→Why AX→설정(테마 6종)
- 왕복: Customer↔AX 양방향 (Desktop/Mobile)
- Bridge: 문의→파이프라인 유입, 완료→증빙+고객 홈 노출
- 404 없음(미래 메뉴 = Preview Sheet)
