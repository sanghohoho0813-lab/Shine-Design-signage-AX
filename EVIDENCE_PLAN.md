# EVIDENCE_PLAN — 12주 실증 준비 (Unified v3.0 §7~§9)

현재 단계 **DEMO**. 아래는 PILOT 진입 시 그대로 켜지는 측정 구조이며, 지금 숫자를 채우지 않는다.

## Evidence Type (코드: `lib/evidence.ts` — 화면과 CSV 내보내기가 같은 목록)
| Type | 지금 생성되는 곳 | PILOT에서 |
|---|---|---|
| BASELINE | Baseline 스냅샷 버튼(DEMO는 '실증 아님') | 첫 4주 값을 고정 |
| BID | 입찰 상태 진행 · 결과(낙찰/유찰/미참여) | 동일 → 낙찰률 |
| SCHEDULE | 납기 변경(사유 필수) | 동일 → 납기 지연 원인 분포 |
| ACTION | Action Lifecycle 확인·실행중 | 동일 |
| RESULT | Action 완료 · 프로젝트 완료 | 동일 + 결과 필드 |
| ADOPTION | Action 확인·실행률 | WAU · 핵심 업무 AX 처리비율 |
| CUSTOMER | 문의 접수 · 상태 변경 | 동일 |
| EFFICIENCY | — | 문의→견적 소요일, Margin 미달률 |
| REVENUE | — (KPI 현재값으로 계산: 전환율·낙찰률) | 전환율, 낙찰률 |
| SCALE | — | 1인당 동시 프로젝트 |
| RISK / EXCEPTION | 보류·무시(사유) | 동일 |

## Evidence Pack (12주 종료 시)
```
Before / Baseline (4주 측정값)
→ Trigger / Problem (오늘 할 일·브리핑 경고 로그)
→ Recommendation / Decision (Action Lifecycle 기록)
→ Human Approval (견적 확정·입찰 참여는 사람)
→ Action (파이프라인 단계 진행)
→ Result (완료 · 증빙 4종)
→ KPI Delta (5개 KPI, Baseline 대비)
→ Data Source / Provenance (Provenance 칩 · Supabase 전환 시각)
→ User / Time Log (Event 레이어)
→ Screenshot / Report (증빙·리포트 인쇄)
```

## Adoption KPI
- Weekly Active User (AX Owner 포함 3인 기준)
- 오늘 할 일 Action 확인률 / 완료률
- 문의 응대 상태 변경까지 소요시간
- 고객 '내 문의 현황' 재방문 비율 (Portal Self-Service)

## PILOT 진입 조건 · Kill / Redesign 기준
- 진입: 실제 진행 프로젝트 5건 이상 입력, 4주 연속 사용.
- Redesign 검토: 4주 동안 Action 확인률 30% 미만, 또는 직원 입력 시간이 기존보다 증가.
- 기준값은 회사와 합의해 정하며 Demo에서 단정하지 않는다.

## AX Owner
설정 > 사용자·권한 > AX Owner (기본 권유진). KPI·데이터 품질·사용 교육·Issue 책임.
