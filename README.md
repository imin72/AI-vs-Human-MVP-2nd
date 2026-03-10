<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ht-JZ7b_uqT_spdSGk4lLLEE5bouOll_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Quick Commit Helper

You can commit current changes in one command:

```bash
npm run commit:quick -- "your commit message"
```

- Runs a production build check first (`npm run -s build`).
- Stages all changes and creates a commit.
- To skip the build check:

```bash
npm run commit:quick -- "your commit message" --skip-build
```


## Soft-launch Observability (Phase 2)

Runtime metrics are collected in-memory via `services/metricsService.ts`.

You can inspect a session KPI summary from browser console:

```ts
import { getSessionMetricsSummary } from './services/metricsService';
console.log(getSessionMetricsSummary());
```

Summary includes API call/retry/error/dedupe counts, cache hit rate, fallback rate, and p50/p95 latency for quiz generation/evaluation.

## Core DB Migration (Template B, category-by-category)

네, **카테고리 1개 단위 작업으로도** 아래 2가지를 함께 진행할 수 있습니다.

1. 상위 30%(16개 중 5개 세부분류) 질문을 `data/questions/core/<category>.core.ts`로 이관
2. 같은 범위를 6개 언어(`en/ko/ja/es/fr/zh`) 키로 확장

### Recommended order per category

1. 대상 카테고리의 상위 5개 세부분류를 먼저 확정한다.
2. `MEDIUM_en` 키를 `*.core.ts`로 먼저 이동한다.
3. 동일 세부분류를 `ko/ja/es/fr/zh`로 번역해 같은 키 규칙으로 추가한다.
   - 키 규칙: `<Subtopic>_<Difficulty>_<Language>`
4. legacy 파일에서 core로 옮긴 키를 제거해 중복을 없앤다.
5. 빌드 검증 후 커밋한다.

### Why this works safely

- 현재 로더는 `core -> legacy(full)` 순으로 조회하므로, 이관 중에도 서비스는 fallback 됩니다.
- 그래서 카테고리별로 쪼개어 반복 작업해도 런타임 리스크가 낮습니다.

### Practical note

- 번역은 "가능"하지만, 품질 검수를 위해 1회에 1개 카테고리씩 진행하는 것을 권장합니다.
- 첫 번째 패스는 `MEDIUM`만 우선 적용하고, 이후 필요 시 난이도 확장을 권장합니다.
