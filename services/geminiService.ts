
import { QuizQuestion, EvaluationResult, Difficulty, UserProfile, Language, QuizSet, UserAnswer } from "../types";
import { getStaticQuestions, resolveTopicInfo } from "../data/staticDatabase";

// Import new separated services
import { generateCacheKey, getCacheEntry, updateCacheEntry } from "./cacheManager";
import { generateContentJSON } from "./geminiClient";

// Import AI Persona DB
import { getAiComments, getRandomComment, generateSmartComment } from "../data/aiObserverDB";
import { trackMetric } from "./metricsService";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Adds a small UX floor without forcing long fixed delays.
 * If processing already took long enough, returns immediately.
 */
export const waitForMinimumDelay = async (startedAt: number, minimumMs: number) => {
  const elapsed = Date.now() - startedAt;
  const remaining = minimumMs - elapsed;
  if (remaining > 0) {
    await wait(remaining);
  }
};

// --- Safe Environment Helpers ---
const isDev = () => {
  if (typeof window !== 'undefined') {
     const h = window.location.hostname;
     if (h.includes('vercel.app')) return false;
  }
  try {
    // @ts-ignore
    if (import.meta.env.DEV) return true;
  } catch {}
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h.includes('googleusercontent.com') || h.includes('webcontainer.io') || h.includes('idx.google')) return true;
  }
  return false;
};

// Fallback Quiz Data
const FALLBACK_QUIZ: QuizQuestion[] = [
  { id: 1, question: "Which is not a characteristic of Human Intelligence?", options: ["Emotional Intuition", "Pattern Recognition", "Finite Biological Memory", "Infinite Electricity Consumption"], correctAnswer: "Infinite Electricity Consumption", context: "AI uses vast amounts of electricity compared to the human brain." },
  { id: 2, question: "What is the Turing Test designed to determine?", options: ["CPU Speed", "AI's ability to exhibit human-like behavior", "Battery life", "Internet connectivity"], correctAnswer: "AI's ability to exhibit human-like behavior" },
  { id: 3, question: "Which field is Cognito Protocol measuring?", options: ["Weightlifting", "Battle of Wits vs AI", "Cooking speed", "Running endurance"], correctAnswer: "Battle of Wits vs AI" },
  { id: 4, question: "In AI terminology, what does 'LLM' stand for?", options: ["Light Level Monitor", "Large Language Model", "Long Logic Mode", "Lunar Landing Module"], correctAnswer: "Large Language Model" },
  { id: 5, question: "Who is often called the father of Computer Science?", options: ["Alan Turing", "Steve Jobs", "Elon Musk", "Thomas Edison"], correctAnswer: "Alan Turing" }
];

// Helper: Translate Elo to descriptive level for Gemini
const getAdaptiveLevel = (elo: number): string => {
  if (elo < 800) return "Beginner";
  if (elo < 1200) return "Intermediate";
  if (elo < 1600) return "Advanced";
  return "Expert/PhD Level";
};

// --- CLIENT-SIDE SEEDING FUNCTION ---
export const seedLocalDatabase = async (onProgress: (msg: string) => void) => {
  if (!isDev()) {
    onProgress("Warning: File saving requires Dev Server. Data will be cached in memory only.");
  }
  onProgress("Seeding Complete!");
};

/**
 * Main Orchestrator: Fetch Questions
 * Priority: 1. Static DB -> 2. Local Cache -> 3. Master Data Translation -> 4. AI Generation
 */
export const generateQuestionsBatch = async (
  topics: string[], 
  difficulty: Difficulty, 
  lang: Language,
  userProfile?: UserProfile
): Promise<QuizSet[]> => {
  const results: QuizSet[] = [];
  const generationStartedAt = Date.now();
  
  const resolvedRequests = topics.map(topicLabel => {
    const info = resolveTopicInfo(topicLabel, lang);
    return {
      originalLabel: topicLabel,
      stableId: info ? info.englishName : topicLabel, 
      catId: info ? info.catId : "GENERAL"
    };
  });

  const missingRequests: typeof resolvedRequests = [];
  const translationRequests: { req: typeof resolvedRequests[0], sourceData: QuizQuestion[] }[] = [];
  const seenIds = new Set(userProfile?.seenQuestionIds || []);

  for (const req of resolvedRequests) {
    const cacheKey = generateCacheKey(req.stableId, difficulty, lang);

    // 1. Static DB Check
    const staticQuestions = await getStaticQuestions(req.originalLabel, difficulty, lang);
    if (staticQuestions) {
      const unseen = staticQuestions.filter(q => !seenIds.has(q.id));
      if (unseen.length >= 5) {
        results.push({ topic: req.originalLabel, questions: unseen.sort(() => 0.5 - Math.random()).slice(0, 5), categoryId: req.catId });
        console.log(`[Source: StaticDB] ${req.stableId}`);
        trackMetric("quiz.source.hit", 1, { source: "static", topic: req.stableId, lang, difficulty });
        continue;
      }
    }

    // 2. Cache Check (Async IndexedDB)
    const cached = await getCacheEntry(cacheKey);
    if (cached) {
       const unseen = cached.filter((q: QuizQuestion) => !seenIds.has(q.id));
       if (unseen.length >= 5) {
           results.push({ topic: req.originalLabel, questions: unseen.sort(() => 0.5 - Math.random()).slice(0, 5), categoryId: req.catId });
           console.log(`[Source: Cache] ${req.stableId}`);
           trackMetric("quiz.source.hit", 1, { source: "cache", topic: req.stableId, lang, difficulty });
           continue;
       }
    }

    // 3. Master Data Translation Check (English -> Target Lang)
    if (lang !== 'en') {
      const masterData = await getStaticQuestions(req.stableId, difficulty, 'en');
      if (masterData && masterData.length > 0) {
        translationRequests.push({ req, sourceData: masterData });
        continue;
      }
    }

    // 4. Queue for Generation
    missingRequests.push(req);
  }

  // PROCESS TRANSLATIONS
  if (translationRequests.length > 0) {
    const prepared = translationRequests
      .map(item => ({
        req: item.req,
        sourceSelection: item.sourceData.filter(q => !seenIds.has(q.id)).slice(0, 5)
      }));

    prepared.forEach(item => {
      if (item.sourceSelection.length === 0) {
        missingRequests.push(item.req);
      }
    });

    const translatable = prepared.filter(item => item.sourceSelection.length > 0);

    if (translatable.length > 0) {
      try {
        const payload = translatable.reduce((acc, item) => {
          acc[item.req.stableId] = item.sourceSelection;
          return acc;
        }, {} as Record<string, QuizQuestion[]>);

        const prompt = `Translate quiz questions from English to ${lang}. Return valid JSON only.\n\nRULES:\n1) Keep the same top-level keys (topic ids).\n2) Each key must map to an array of translated question objects.\n3) Preserve id values.\n4) Keep options count and correctAnswer aligned with translated options.\n\nINPUT: ${JSON.stringify(payload)}`;
        const translatedByTopic = await generateContentJSON(prompt);

        const updatePromises: Promise<void>[] = [];

        translatable.forEach(item => {
          const key = Object.keys(translatedByTopic || {}).find(k => k.toLowerCase() === item.req.stableId.toLowerCase());
          const translatedQs = key ? translatedByTopic[key] : null;

          if (Array.isArray(translatedQs) && translatedQs.length > 0) {
            updatePromises.push(updateCacheEntry(generateCacheKey(item.req.stableId, difficulty, lang), translatedQs));
            results.push({ topic: item.req.originalLabel, questions: translatedQs, categoryId: item.req.catId });
            console.log(`[Source: TranslationBatch] ${item.req.stableId}`);
            trackMetric("quiz.source.hit", 1, { source: "translation", topic: item.req.stableId, lang, difficulty });
          } else {
            missingRequests.push(item.req);
          }
        });

        await Promise.all(updatePromises);
      } catch (e) {
        console.error("Translation Batch Failed, falling back to gen", e);
        trackMetric("quiz.translation.error", 1, { lang, difficulty, count: translatable.length });
        translatable.forEach(item => missingRequests.push(item.req));
      }
    }
  }

  // PROCESS AI GENERATION (Batch)
  if (missingRequests.length > 0) {
      const targetIds = missingRequests.map(r => r.stableId);
      const adaptiveContext = missingRequests.map(r => {
         const elo = userProfile?.eloRatings?.[r.catId] || 1000;
         return `${r.stableId}: User Level ${getAdaptiveLevel(elo)} (Elo ${elo})`;
      }).join("; ");

      // SIMPLIFIED PROMPT - NO STRICT SCHEMA
      // Using strict schemas with gemini-flash often causes 400s or fallback issues.
      // We rely on text parsing for better reliability with this model.
      const prompt = `
        You are a Trivia API. Generate 5 multiple-choice questions for EACH of the following topics: ${JSON.stringify(targetIds)}.
        
        DIFFICULTY: ${difficulty}.
        LANGUAGE: ${lang}.
        CONTEXT: ${adaptiveContext}.

        RULES:
        1. Output valid JSON only.
        2. The JSON must be an OBJECT where the KEYS are the exact topic names provided above.
        3. The VALUES must be arrays of question objects.
        4. Each question object must have: id (number), question (string), options (array of 4 strings), correctAnswer (string matching one option), context (string explanation).
        5. STRICTLY OBJECTIVE FACTS ONLY. No opinion-based questions.

        Example Structure:
        {
          "TopicName": [
            { "id": 123, "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "context": "..." }
          ]
        }
      `;

      try {
        // Call API without strict schema to avoid validation errors with Flash model
        const generatedData = await generateContentJSON(prompt);
        
        const updatePromises: Promise<void>[] = [];

        missingRequests.forEach(req => {
          // Robust case-insensitive key matching
          const key = Object.keys(generatedData).find(k => k.toLowerCase() === req.stableId.toLowerCase());
          
          if (key && Array.isArray(generatedData[key])) {
            const raw = generatedData[key];
            const formatted = raw.map((q: any) => ({
               id: q.id || Math.floor(Math.random() * 100000) + Date.now(),
               question: q.question,
               options: q.options,
               correctAnswer: q.correctAnswer,
               context: q.context
            }));
            
            updatePromises.push(updateCacheEntry(generateCacheKey(req.stableId, difficulty, lang), formatted));
            results.push({ topic: req.originalLabel, questions: formatted, categoryId: req.catId });
            trackMetric("quiz.source.hit", 1, { source: "generation", topic: req.stableId, lang, difficulty });
          } else {
             // Fallback ONLY for this specific topic if missing
             console.warn(`[Gen] Missing data for ${req.stableId}, using fallback.`);
             trackMetric("quiz.fallback", 1, { reason: "missing_topic_payload", topic: req.stableId, lang, difficulty });
             results.push({ topic: req.originalLabel, questions: FALLBACK_QUIZ, categoryId: req.catId });
          }
        });
        
        await Promise.all(updatePromises);

      } catch (e) {
        console.error("Batch Gen Failed completely", e);
        trackMetric("quiz.generation.error", 1, { lang, difficulty, count: missingRequests.length });
        // Fallback for ALL missing requests if the API call itself failed
        missingRequests.forEach(req => {
           results.push({ topic: req.originalLabel, questions: FALLBACK_QUIZ, categoryId: req.catId });
           trackMetric("quiz.fallback", 1, { reason: "generation_failure", topic: req.stableId, lang, difficulty });
        });
      }
  }

  // Ensure results are sorted in the requested order
  const ordered = topics.map(t => results.find(r => r.topic === t)!).filter(Boolean);
  trackMetric("quiz.generation.latency_ms", Date.now() - generationStartedAt, {
    topics: topics.length,
    lang,
    difficulty
  });
  return ordered;
};

export interface BatchEvaluationInput {
  topic: string;
  score: number;
  performance: UserAnswer[]; 
}

/**
 * Main Orchestrator: Evaluate Answers (OFFLINE MODE)
 * Replaces expensive LLM calls with local heuristic analysis using Static Persona DB.
 */
export const evaluateBatchAnswers = async (
  batches: BatchEvaluationInput[],
  _userProfile: UserProfile,
  lang: Language
): Promise<EvaluationResult[]> => {
  const startedAt = Date.now();

  const commentsDB = getAiComments(lang);

  const evaluated = batches.map(batch => {
    // 1. Determine Score Tier
    let mainComment = "";
    if (batch.score === 100) mainComment = getRandomComment(commentsDB.perfect);
    else if (batch.score >= 80) mainComment = getRandomComment(commentsDB.high);
    else if (batch.score >= 40) mainComment = getRandomComment(commentsDB.mid);
    else mainComment = getRandomComment(commentsDB.low);

    // 2. Determine Percentiles (Heuristic based on Elo/Score)
    // In a real app, this would query a global stat DB. Here we simulate it.
    const humanPercentile = Math.min(99, Math.round(batch.score * 0.9 + Math.random() * 10));
    const demographicPercentile = Math.min(99, Math.round(batch.score * 0.85 + Math.random() * 15));
    
    // Resolve Category ID from the topic label to use correct flavor
    // (We iterate to find which category this topic belongs to)
    // Note: This is a loose lookup, ideally we pass ID through, but label works for flavor
    const topicId = "GENERAL"; 

    // 3. Process Details (Question Level Analysis)
    const details = batch.performance.map(p => {
       // --- NEW: USE SMART TEMPLATE ENGINE INSTEAD OF RANDOM STATIC STRINGS ---
       // This injects the Question's "Context" (Fact) directly into the AI Comment.
       // It makes the result feel highly specific and "generated" without calling an API.
       const smartComment = generateSmartComment(p, lang, topicId);
       
       // Use stored context as "AI Fact" if available, otherwise generic
       const correctFact = p.context || p.correctAnswer; 

       return {
         questionId: p.questionId,
         isCorrect: p.isCorrect,
         questionText: p.questionText,
         selectedOption: p.selectedOption,
         correctAnswer: p.correctAnswer,
         aiComment: smartComment, // <--- REPLACED
         correctFact: correctFact
       };
    });

    return {
      title: batch.topic,
      totalScore: batch.score,
      humanPercentile,
      demographicPercentile,
      aiComparison: mainComment,
      demographicComment: getRandomComment(commentsDB.demographic),
      details
    };
  });

  // Keep brief analysis feedback, but avoid unnecessary fixed waits.
  await waitForMinimumDelay(startedAt, 250);
  trackMetric("quiz.evaluation.latency_ms", Date.now() - startedAt, {
    batches: batches.length,
    lang
  });

  return evaluated;
};
