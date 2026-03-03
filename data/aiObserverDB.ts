
import { Language, UserAnswer } from "../types";

// --- TEMPLATE SYSTEM ---
// Placeholders:
// {context} -> The explanation/fact from the question (e.g. "Mars is red due to iron oxide.")
// {answer} -> The correct answer (e.g. "Mars")
// {selection} -> The user's wrong answer (e.g. "Jupiter")

interface CommentTemplates {
  correct: string[];
  wrong: string[];
}

// Default / Generic Templates
const GENERIC_TEMPLATES: Record<Language, CommentTemplates> = {
  en: {
    correct: [
      "Logic verified. {context}",
      "Precisely. {context}",
      "Cognitive match confirmed. Indeed, {context}",
      "Optimal path selected. Note that {context}",
      "Affirmative. {context}"
    ],
    wrong: [
      "Error detected. {context}",
      "Illogical selection. The reality is: {context}",
      "You chose '{selection}', which is incorrect. {context}",
      "Divergence from fact. {context}",
      "Incorrect. {context}"
    ]
  },
  ko: {
    correct: [
      "논리 검증됨. {context}",
      "정확합니다. {context}",
      "인지 패턴 일치. 실제로 {context}",
      "최적의 경로입니다. 참고로, {context}",
      "긍정적 결과. {context}"
    ],
    wrong: [
      "오류 감지됨. {context}",
      "비논리적 선택입니다. 진실은: {context}",
      "'{selection}'을(를) 선택했군요. 틀렸습니다. {context}",
      "팩트와의 괴리 발생. {context}",
      "오답입니다. {context}"
    ]
  },
  // Fallbacks for other languages (using English structure mostly)
  ja: {
    correct: ["論理検証完了。 {context}", "正解です。 {context}", "その通り。 {context}"],
    wrong: ["エラー検出。 {context}", "不正解です。事実は: {context}", "'{selection}'ではありません。 {context}"]
  },
  zh: {
    correct: ["逻辑已验证。 {context}", "正是如此。 {context}"],
    wrong: ["检测到错误。 {context}", "选择不合逻辑。事实是：{context}"]
  },
  es: {
    correct: ["Lógica verificada. {context}", "Exacto. {context}"],
    wrong: ["Error detectado. {context}", "Incorrecto. {context}"]
  },
  fr: {
    correct: ["Logique vérifiée. {context}", "Précisément. {context}"],
    wrong: ["Erreur détectée. {context}", "Incorrect. {context}"]
  }
};

// Topic-Specific Flavors (Optional overrides)
const TOPIC_FLAVORS: Record<string, Record<Language, CommentTemplates>> = {
  "SCIENCE": {
    en: {
      correct: ["Hypothesis confirmed. {context}", "Scientific consensus aligns. {context}"],
      wrong: ["Hypothesis rejected. {context}", "Empirical data suggests otherwise. {context}"]
    },
    ko: {
      correct: ["가설 확인됨. {context}", "과학적 합의와 일치합니다. {context}"],
      wrong: ["가설 기각됨. {context}", "실증 데이터는 다른 것을 시사합니다. {context}"]
    },
    ja: { correct: [], wrong: [] }, zh: { correct: [], wrong: [] }, es: { correct: [], wrong: [] }, fr: { correct: [], wrong: [] }
  },
  "HISTORY": {
    en: {
      correct: ["Historical record matched. {context}", "Timeline synchronized. {context}"],
      wrong: ["Anachronism detected. {context}", "Historical inaccuracy. {context}"]
    },
    ko: {
      correct: ["역사적 기록 일치. {context}", "타임라인 동기화됨. {context}"],
      wrong: ["시대착오적 오류 감지. {context}", "역사적 사실과 다릅니다. {context}"]
    },
    ja: { correct: [], wrong: [] }, zh: { correct: [], wrong: [] }, es: { correct: [], wrong: [] }, fr: { correct: [], wrong: [] }
  }
};

// --- HELPER FUNCTIONS ---

export const getAiComments = (lang: Language) => {
  // Legacy support for other parts of the app using direct list access
  // Returns generic placeholders if templates aren't used
  return {
    perfect: ["Perfect score.", "Flawless."],
    high: ["High proficiency.", "Impressive."],
    mid: ["Average performance.", "Acceptable."],
    low: ["Suboptimal.", "Needs improvement."],
    correct: GENERIC_TEMPLATES[lang]?.correct || GENERIC_TEMPLATES['en'].correct,
    wrong: GENERIC_TEMPLATES[lang]?.wrong || GENERIC_TEMPLATES['en'].wrong,
    demographic: ["Analyzing cohort...", "Comparing data..."]
  };
};

export const getRandomComment = (list: string[]) => {
  if (!list || list.length === 0) return "";
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Generates a context-aware comment without using API.
 */
export const generateSmartComment = (
  answer: UserAnswer, 
  lang: Language, 
  topicId: string
): string => {
  // 1. Select Template Set (Topic specific or Generic)
  const flavor = TOPIC_FLAVORS[topicId]?.[lang];
  const generic = GENERIC_TEMPLATES[lang] || GENERIC_TEMPLATES['en'];
  
  // Merge topic specific with generic to have variety
  const templates = answer.isCorrect 
    ? [...(flavor?.correct || []), ...generic.correct]
    : [...(flavor?.wrong || []), ...generic.wrong];

  // 2. Pick a random template
  const rawTemplate = getRandomComment(templates);

  // 3. Inject Variables
  let comment = rawTemplate;
  
  // {context} - The explanation
  const contextText = answer.context || (lang === 'ko' ? "데이터 없음." : "No data.");
  comment = comment.replace(/{context}/g, contextText);

  // {answer} - The correct answer string
  comment = comment.replace(/{answer}/g, answer.correctAnswer);

  // {selection} - What the user chose (only relevant for wrong answers)
  comment = comment.replace(/{selection}/g, answer.selectedOption);

  return comment;
};
