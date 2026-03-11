export type MetricEvent = {
  name: string;
  value?: number;
  tags?: Record<string, string | number | boolean | undefined>;
  timestamp: number;
};

export type SessionMetricsSummary = {
  sessionStartedAt: number;
  durationMs: number;
  totalEvents: number;
  apiCalls: number;
  apiRetries: number;
  apiErrors: number;
  apiDedupedHits: number;
  cacheHitRate: number;
  fallbackRate: number;
  generationLatency: {
    p50: number;
    p95: number;
    count: number;
  };
  evaluationLatency: {
    p50: number;
    p95: number;
    count: number;
  };
};

const MAX_EVENTS = 1000;
const events: MetricEvent[] = [];
let sessionStartedAt = Date.now();

/**
 * Lightweight local metrics collector for soft-launch observability.
 * Stores a bounded in-memory buffer and mirrors compact logs to console.
 */
export const trackMetric = (name: string, value?: number, tags?: MetricEvent['tags']) => {
  const event: MetricEvent = {
    name,
    value,
    tags,
    timestamp: Date.now()
  };

  events.push(event);
  if (events.length > MAX_EVENTS) events.shift();

  try {
    console.info('[Metric]', name, { value, ...tags });
  } catch {
    // no-op
  }
};

export const getMetricSnapshot = () => [...events];

export const resetMetricSession = () => {
  sessionStartedAt = Date.now();
};

const percentile = (values: number[], p: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  const safeIndex = Math.min(sorted.length - 1, Math.max(0, index));
  return sorted[safeIndex];
};

export const getSessionMetricsSummary = (): SessionMetricsSummary => {
  const sessionEvents = events.filter(e => e.timestamp >= sessionStartedAt);

  const generationLatencies = sessionEvents
    .filter(e => e.name === 'quiz.generation.latency_ms' && typeof e.value === 'number')
    .map(e => e.value as number);

  const evaluationLatencies = sessionEvents
    .filter(e => e.name === 'quiz.evaluation.latency_ms' && typeof e.value === 'number')
    .map(e => e.value as number);

  const sourceHits = sessionEvents.filter(e => e.name === 'quiz.source.hit');
  const cacheHits = sourceHits.filter(e => e.tags?.source === 'cache' || e.tags?.source === 'static').length;
  const fallbackCount = sessionEvents.filter(e => e.name === 'quiz.fallback').length;

  const apiCalls = sessionEvents.filter(e => e.name === 'api.request.started').length;
  const apiRetries = sessionEvents.filter(e => e.name === 'api.request.retry').length;
  const apiErrors = sessionEvents.filter(e => e.name === 'api.request.error').length;
  const apiDedupedHits = sessionEvents.filter(e => e.name === 'api.request.deduped').length;

  return {
    sessionStartedAt,
    durationMs: Date.now() - sessionStartedAt,
    totalEvents: sessionEvents.length,
    apiCalls,
    apiRetries,
    apiErrors,
    apiDedupedHits,
    cacheHitRate: sourceHits.length > 0 ? cacheHits / sourceHits.length : 0,
    fallbackRate: sourceHits.length > 0 ? fallbackCount / sourceHits.length : 0,
    generationLatency: {
      p50: percentile(generationLatencies, 50),
      p95: percentile(generationLatencies, 95),
      count: generationLatencies.length
    },
    evaluationLatency: {
      p50: percentile(evaluationLatencies, 50),
      p95: percentile(evaluationLatencies, 95),
      count: evaluationLatencies.length
    }
  };
};
