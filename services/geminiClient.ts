import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { trackMetric } from "./metricsService";

const MODEL_NAME = 'gemini-3-flash-preview';
let aiClient: GoogleGenAI | null = null;
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Helper to retrieve API Key safely.
 */
export const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch {
    console.warn("API Key environment variable not accessible.");
    return "";
  }
};

/**
 * Lazy initialization of the Gemini Client.
 */
export const getAiClient = () => {
  if (!aiClient) {
    const apiKey = getApiKey();
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Utility to extract clean JSON string from Markdown code blocks.
 */
export const cleanJson = (text: string | undefined): string => {
  if (!text) return "";
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/); // Match object or array
  return match ? match[0] : text.trim();
};

/**
 * Generic Retry Wrapper for API calls.
 */
export async function withRetry<T>(fn: () => Promise<T>, context: string, retries = 1, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message?.toLowerCase() || "";
    // Retry on rate limits (429) or fetch failures
    if (retries > 0 && (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("failed to fetch"))) {
      trackMetric("api.request.retry", 1, { context, retriesLeft: retries });
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, context, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Facade for generating JSON content from Gemini.
 */
export const generateContentJSON = async (prompt: string, schema?: any): Promise<any> => {
  const ai = getAiClient();
  const requestKey = `${MODEL_NAME}::${prompt}::${schema ? JSON.stringify(schema) : "no-schema"}`;
  const existingRequest = inFlightRequests.get(requestKey);

  if (existingRequest) {
    trackMetric("api.request.deduped", 1, { model: MODEL_NAME });
    return existingRequest;
  }
  
  const config: any = {
    responseMimeType: "application/json"
  };
  
  if (schema) {
    config.responseSchema = schema;
  }

  const requestStartedAt = Date.now();
  trackMetric("api.request.started", 1, { model: MODEL_NAME });

  const request = withRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
      config
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return JSON.parse(cleanJson(text));
  }, "generateContentJSON");

  inFlightRequests.set(requestKey, request);

  try {
    const result = await request;
    trackMetric("api.request.success", 1, { model: MODEL_NAME });
    trackMetric("api.request.latency_ms", Date.now() - requestStartedAt, { model: MODEL_NAME });
    return result;
  } catch (error: any) {
    trackMetric("api.request.error", 1, { model: MODEL_NAME, message: error?.message || "unknown" });
    throw error;
  } finally {
    inFlightRequests.delete(requestKey);
  }
};
