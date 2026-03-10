export type MetricEvent = {
  name: string;
  value?: number;
  tags?: Record<string, string | number | boolean | undefined>;
  timestamp: number;
};

const MAX_EVENTS = 500;
const events: MetricEvent[] = [];

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
