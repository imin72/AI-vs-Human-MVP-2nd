# 2nd MVP 기준 GitHub + Vercel + Codex 운영 검토

## 결론 요약
- 현재 구조(React + Vite + TypeScript)는 GitHub/Vercel 웹 기반 운영에 적합합니다.
- Codex 프롬프트 기반 수정/커밋 흐름도 충분히 운영 가능하며, 핵심은 **작업 단위를 작게 쪼개는 브랜치 전략**과 **자동 검증(빌드/린트/타입체크)** 입니다.
- “line limit”에 걸리지 않도록 하려면 한 번에 대규모 변경 대신 **기능 단위 PR**, **파일 분리**, **점진적 리팩터링**을 원칙으로 관리해야 합니다.

## 권장 리포지토리 전략

### 1) 새 리포지토리 구성
- `questions-db1000-app` (프론트 앱)
- `questions-db1000-data` (질문 데이터 전용, 필요 시 서브모듈/패키지로 연동)
- `questions-db1000-ops` (배포/운영 문서, 이슈 템플릿, 릴리즈 노트)

> 데이터 증가가 큰 프로젝트 특성상 앱 코드와 데이터 버전을 분리하면 PR 가독성과 배포 안정성이 좋아집니다.

### 2) 브랜치/PR 규칙
- `main`: 항상 배포 가능한 상태 유지
- `develop`(선택): 통합 검증 브랜치
- `feature/*`, `fix/*`, `chore/*`: 작업 브랜치
- PR 크기 가이드:
  - 권장: 300~600 LOC 내외
  - 최대: 1,000 LOC 초과 시 분할 권장

### 3) 라인 제한(가독성/리뷰 한계) 대응
- 질문 데이터는 토픽별 파일 유지(`data/questions/*.ts`) + 신규 파일로 분할
- UI/로직 분리: `views` ↔ `hooks/viewmodels` 경계 유지
- 변경이 큰 경우 순서 분리:
  1. 구조 리팩터링 PR
  2. 데이터 추가 PR
  3. 기능 연결 PR

## Codex + GitHub 웹 운영 가이드

### 1) Codex 프롬프트 작성 템플릿
- 목적: "무엇을 바꿀지"
- 범위: "어느 파일까지"
- 제약: "한 PR 최대 LOC", "테스트 필수"
- 산출: "커밋 메시지 형식", "체크리스트"

예시:
```
목표: sports/questions 데이터 200개 추가
제약: 기존 파일 수정 최소화, 신규 파일 2개로 분리, PR 700 LOC 이하
검증: npm run build && npm run lint
산출: feat(data): add sports pack A/B
```

### 2) 커밋/릴리즈 규칙
- Conventional Commits 권장
  - `feat(data): add geography question pack 03`
  - `fix(quiz): handle empty answer edge case`
- Squash merge로 히스토리 단순화
- 태그 배포: `v2.1.0`, `v2.1.1` 형태

## Vercel 운영 최적화

### 1) 프로젝트 연결
- GitHub 리포지토리 연결 후 Preview/Production 자동 배포
- 환경변수 분리
  - Preview: 테스트 키
  - Production: 실서비스 키

### 2) 배포 성능/안정성
- 대용량 DB 파일은 번들 비대화 방지를 위해 분할 유지
- 캐시 전략 검토 (`services/cacheManager.ts` 활용)
- 실패 롤백 대비: 이전 프로덕션 배포 즉시 복원 절차 문서화

### 3) 권장 보호장치
- PR 머지 조건:
  - 타입체크 통과
  - 빌드 통과
  - 린트 통과
- `main` 브랜치 보호(직접 푸시 금지)

## 실행 체크리스트
- [ ] 리포지토리 분리 여부 결정(앱/데이터/운영)
- [ ] 브랜치 보호 규칙 설정
- [ ] PR 템플릿 + 이슈 템플릿 추가
- [ ] Vercel Preview/Production 환경 변수 분리
- [ ] Codex 작업 단위(LOC 상한) 팀 규칙 확정

## 운영 가능성 평가
- **효율성:** 높음 (현재 구조가 모듈 분리에 유리)
- **리스크:** 데이터 증가에 따른 PR 대형화
- **대응:** 데이터 파일 세분화 + PR 분할 + 자동 검증 파이프라인
- **종합:** 2nd MVP 기반으로 GitHub/Vercel/Codex 운영 전환에 무리 없음
