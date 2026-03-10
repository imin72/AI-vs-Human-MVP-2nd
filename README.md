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
