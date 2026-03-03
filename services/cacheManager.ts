import { Difficulty, Language, QuizQuestion } from '../types';

const DB_NAME = 'AiVsHumanDB';
const STORE_NAME = 'quiz_cache';
const DB_VERSION = 1;

/**
 * Generates a unique cache key for a quiz set.
 */
export const generateCacheKey = (stableTopicId: string, difficulty: Difficulty, lang: Language) => {
  return `${stableTopicId}_${difficulty}_${lang}`.toLowerCase();
};

/**
 * Helper to open the IndexedDB database.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Retrieves a specific entry from the IndexedDB cache.
 * Replaces the synchronous localStorage access.
 */
export const getCacheEntry = async (key: string): Promise<QuizQuestion[] | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("[CacheManager] Read failed", error);
    return null;
  }
};

/**
 * Updates a specific entry in the IndexedDB cache.
 */
export const updateCacheEntry = async (key: string, questions: QuizQuestion[]) => {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(questions, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn("[CacheManager] Write failed", error);
  }
};

/**
 * Legacy support / Debugging helper
 * Fetches all keys from the cache.
 */
export const getAllCacheKeys = async (): Promise<string[]> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAllKeys();
            req.onsuccess = () => resolve(req.result as string[]);
            req.onerror = () => reject(req.error);
        });
    } catch {
        return [];
    }
}