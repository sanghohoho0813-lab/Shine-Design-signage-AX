# DATA_DICTIONARY — SSOT (Unified v3.0 §5.1)

소스: `lib/dictionary.ts` (설정 > 데이터 화면과 동일). 필드 상세는 코드가 기준이며 이 문서는 요약이다.

| Entity | System of Record (Demo → Next) | 입력 주체 | 업데이트 | 민감도 | 보관 | AI |
|---|---|---|---|---|---|---|
| Inquiry 고객 문의 | localStorage `shine-ax-state-v1.inquiries` → Supabase `inquiries` | 고객(양식) | AX 담당자 axStatus | 높음 | 상담 종료 후 1년 | 집계만 |
| Project 프로젝트 | localStorage `projects` → Supabase `projects` | AX 담당자 · 브릿지 | 단계 진행 · 원가 | 보통 | 영구 | 가능 |
| ProductionOrder 제작 발주 | `lib/data.ts` 시드 → Supabase `production_orders` | AX 담당자 | 상태 5종 | 보통 | 프로젝트와 동일 | 가능 |
| Bid 입찰 | `lib/data.ts` 시드 → Supabase `bids` + 나라장터(NEXT) | AX 담당자 | 체크리스트·상태 | 보통 | 영구 | 가능 |
| Action 추천 Action | localStorage `actionStates` → Supabase `actions` | 시스템(생성)·사람(상태) | todo→confirmed→doing→done / hold / skip(reason) | 낮음 | 영구 | 가능 |
| Evidence 증빙 | 파생(Project 완료 + Action + Inquiry) → Supabase `evidence` (append-only) | 시스템 | 추가만 | 보통 | 영구 | 가능 |
| Record 수행 실적 | `lib/records.ts` (337건) → Supabase `records` | 회사 | 연 1회 | 낮음 | 영구 | 가능 |
| Event 행동 이벤트 | localStorage `shine-ax-events-v1` (200) → GA4/PostHog/Supabase | 시스템 | 추가만 | 낮음 | 90일 | 집계만 |

## 저장 키 (브라우저)
- `shine-ax-state-v1` — theme / fontScale / role / reducedMotion / projects / inquiries / actionStates / doneActions(호환) / axOwner / updatedAt
- `shine-ax-events-v1` — 행동 이벤트 링 버퍼
- `shine-recent-works` — 최근 본 포트폴리오 id
- `shine-ax-tutorial-seen`, `shine-inquiry-draft` — 튜토리얼·문의 초안

## 마이그레이션 규칙
- 저장 키는 바꾸지 않는다. 필드는 더하기만 한다.
- 테마 id: `navy→navy-gold`, `teal→deep-teal`, `burgundy→burgundy-slate`, `indigo→plum-indigo`, `forest→forest-sage`, `copper→steel-platinum` (store + pre-hydration script 동시 적용)
- `doneActions[]` → `actionStates{id: done}` 자동 변환, `doneActions`는 파생값으로 계속 저장

## CSV 형식
설정 > 데이터 > CSV 샘플 (`projects.csv`, `inquiries.csv`, `production.csv`) — 헤더가 곧 필드명.
