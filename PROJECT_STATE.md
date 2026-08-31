# PROJECT_STATE

## v2 커스터마이징 (회사 실자료 반영)
- 회사소개서(48p)·사업자등록증 기반 실데이터 반영 ✅
  - 대표 권유진 · 사업자번호 · 남양주 본사 · 서울사무소 · 화성/남양주 1·2공장
  - 연혁 타임라인(2005 샤이니스 → 2024 재도약 → 자격 6종)
  - 실제 포트폴리오 21건 + 실제 현장 사진 47장 (`public/images/works/`)
  - 신뢰 섹션·입찰 체크리스트·AX 데모 데이터를 실제 발주처 기반으로 교체
- 시연 모드(Presentation Mode, Unified §15) ✅ — 10단계 Guided Product Demo, Customer↔AX 자동 이동
- Why AX 12섹션 확장 ✅ (v1.1 §14 권장 구조)

## BUSINESS AX
- 대시보드 / 파이프라인 / 견적·원가 / 제작·파트너 / 입찰 / AI 브리핑 / 증빙 / Why AX / 설정 — ✅ 구현 완료
- Role 게이팅(대표/직원/고객) ✅ · Tutorial 4-Step ✅ · Theme 6종 ✅

## CUSTOMER FRONT
- 홈 / 회사소개 / 사업분야 / 포트폴리오(+상세 8건) / 프로세스 / 문의 위저드 — ✅ 구현 완료
- Future Expansion 4종 Preview Sheet(헤더·Drawer·푸터) ✅ · 404 없음 ✅

## DATA BRIDGE
- Bridge 1: 문의 위저드 → AX 파이프라인 "문의" 카드 자동 생성 ✅
- Bridge 2: AX 완료 처리 → 증빙 레코드 + 고객 홈 "최근 완료 프로젝트" ✅

## SYSTEM CORE
- Theme/Font/Motion/Role/Demo Reset/Tutorial/Device Preview/Surface Switch/날짜시각 ✅
- 상태: localStorage 유지, Demo Reset으로 복원

## USER ACTION QUEUE
- (선택) Vercel 배포 연결
- (선택) 실제 프로젝트 사진으로 포트폴리오 이미지 교체 — 현재는 생성 이미지 사용 중
- (선택) 실 AI API / Supabase 연동

## KNOWN ISSUES
- 포트폴리오는 회사 실사진 미제공으로 생성 이미지 + 중립 명칭 사용 (실기관명 미기재)
- 문의 첨부파일은 데모에서 비활성
