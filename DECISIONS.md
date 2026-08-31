# DECISIONS

1. **Theme 기본값** — v1.1 라이브러리 6종 중 브랜드 지시(그래파이트+골드)에 맞춰 1번 슬롯을 "Shine Graphite Gold"로 커스텀, 나머지 5종(Navy/Teal/Burgundy/Indigo/Forest)은 라이브러리 그대로. 총 6종 유지(7번째 추가 금지 규칙 준수).
2. **포트폴리오 실명 표기** — Master Prompt §8/§22의 "실기관 프로젝트 날조 금지"에 따라, 신뢰 섹션은 프롬프트가 명시한 카테고리 카드(한국도로교통공단 등)를 사용하되 포트폴리오 상세는 "도로교통 분야 공공기관" 등 중립 표기 + 계약금액 미기재.
3. **AX 데모 데이터** — 참조 시안의 기관명/수치는 DEMO 배지와 함께 사용. 금액·일정은 모두 데모 값임을 화면에 명시.
4. **AI 표기 정직성** — 규칙 기반 인사이트는 모두 "AI READY — 규칙 기반 Demo"로 표시(§8 AI Policy).
5. **상태 관리** — 외부 DB 없이 React Context + localStorage. 교체 지점(CSV/Supabase/API)을 설정 화면에 명시.
6. **Device Preview** — 별도 Route 대신 현재 Route를 same-origin iframe으로 렌더(404 위험 0, 상태 공유). embedded 감지로 재귀 차단.
7. **OEM 표현** — "외주 의존" 대신 "제작 파트너 관리 / 유연한 공급구조"로 일관 표기(Master Prompt §11, §16).
8. **미사용 AX 자산 4종** — v1.4 AX 시각 절제(30~50%) 규칙 준수를 위해 의도적으로 미배치.
9. **styled-jsx** — 문의 위저드 입력 스타일만 사용, 나머지는 Tailwind 토큰 유틸.
