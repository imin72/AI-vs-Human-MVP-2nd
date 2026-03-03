
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { AppStage, Language, QuizSet, HistoryItem, EvaluationResult, QuizQuestion } from '../types';
import { generateQuestionsBatch, evaluateBatchAnswers, BatchEvaluationInput, seedLocalDatabase } from '../services/geminiService';
import { audioHaptic } from '../services/audioHapticService';
import { TRANSLATIONS } from '../utils/translations';

// Import split hooks
import { useUserProfile } from '../hooks/useUserProfile';
import { useTopicManager } from '../hooks/useTopicManager';
import { useQuizEngine, AccumulatedBatchData } from '../hooks/useQuizEngine';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

const DEBUG_QUIZ: QuizQuestion[] = [
  { 
    id: 1, 
    question: "Which protocol is used for secure web browsing?", 
    options: ["HTTP", "HTTPS", "FTP", "SMTP"], 
    correctAnswer: "HTTPS", 
    context: "Hypertext Transfer Protocol Secure is the standard." 
  },
  { 
    id: 2, 
    question: "What is the time complexity of binary search?", 
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], 
    correctAnswer: "O(log n)", 
    context: "Binary search divides the search interval in half." 
  },
  {
    id: 3,
    question: "Which React hook is used for side effects?",
    options: ["useState", "useEffect", "useMemo", "useReducer"],
    correctAnswer: "useEffect",
    context: "useEffect handles side effects in function components."
  }
];

// Helper to detect browser language
const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.split('-')[0];
  const supported: Language[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr'];
  return supported.includes(lang as Language) ? (lang as Language) : 'en';
};

export const useGameViewModel = () => {
  // 1. Core State
  const [language, setLanguage] = useState<Language>(getBrowserLanguage());
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // New State for Pipeline Loading
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  // Ref to track if we need to auto-advance when background loading finishes
  const waitingForNextTopicRef = useRef(false);
  const isHandlingExitRef = useRef(false);

  // 2. Composed Hooks
  const nav = useAppNavigation();
  const profile = useUserProfile();
  const topicMgr = useTopicManager(language);
  const quiz = useQuizEngine();

  // 3. Result State
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [sessionResults, setSessionResults] = useState<EvaluationResult[]>([]); 

  const t = useMemo(() => TRANSLATIONS[language], [language]);

  // --- Logic: Finish Batch & Calculate Results ---
  const finishBatchQuiz = async (allBatches: AccumulatedBatchData[]) => {
    if (isPending) return;
    setIsPending(true);
    nav.setStage(AppStage.ANALYZING);
    audioHaptic.playClick('hard');

    try {
      const batchInputs: BatchEvaluationInput[] = [];
      const updatedProfile = { ...profile.userProfile };
      const currentScores = { ...(updatedProfile.scores || {}) };
      const currentElos = { ...(updatedProfile.eloRatings || {}) };
      const seenIds = new Set(updatedProfile.seenQuestionIds || []);
      const currentHistory = [...(updatedProfile.history || [])];

      allBatches.forEach(batch => {
        const correctCount = batch.answers.filter(a => a.isCorrect).length;
        const totalCount = batch.answers.length;
        const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        
        if (score >= (currentScores[batch.topicLabel] || 0)) {
           currentScores[batch.topicLabel] = score;
        }

        batch.answers.forEach(a => seenIds.add(a.questionId));

        const currentElo = currentElos[batch.topicId] || 1000;
        let eloChange = 0;
        if (score >= 80) eloChange = 30; 
        else if (score >= 60) eloChange = 10;
        else if (score >= 40) eloChange = -10; 
        else eloChange = -20;

        currentElos[batch.topicId] = Math.max(0, currentElo + eloChange);

        const aiBenchmark = topicMgr.state.difficulty === 'HARD' ? 98 : topicMgr.state.difficulty === 'MEDIUM' ? 95 : 92;
        
        const historyItem: HistoryItem = {
          timestamp: Date.now(),
          topicId: batch.topicId,
          score: score,
          aiScore: aiBenchmark,
          difficulty: topicMgr.state.difficulty
        };
        currentHistory.push(historyItem);

        batchInputs.push({
          topic: batch.topicLabel,
          score: score,
          performance: batch.answers 
        });
      });

      updatedProfile.scores = currentScores;
      updatedProfile.eloRatings = currentElos;
      updatedProfile.seenQuestionIds = Array.from(seenIds);
      updatedProfile.history = currentHistory;
      
      profile.actions.persistProfile(updatedProfile);

      const isDebug = allBatches.some(b => b.topicLabel.startsWith("Debug"));
      if (isDebug) {
         await new Promise(resolve => setTimeout(resolve, 800));
         const mockResults: EvaluationResult[] = allBatches.map(b => ({
            id: b.topicId,
            totalScore: 80,
            humanPercentile: 90,
            aiComparison: "Debug Mode Analysis.",
            demographicPercentile: 50,
            demographicComment: "Simulated Data.",
            title: b.topicLabel,
            details: b.answers.map(a => ({
               questionId: a.questionId,
               isCorrect: a.isCorrect,
               questionText: a.questionText,
               selectedOption: a.selectedOption,
               correctAnswer: a.correctAnswer,
               aiComment: "Debug Comment",
               correctFact: "Debug Fact"
            }))
         }));
         setEvaluation(mockResults[0]);
         setSessionResults(mockResults);
         audioHaptic.playLevelUp();
         nav.setStage(AppStage.RESULTS);
         return;
      }

      const results = await evaluateBatchAnswers(batchInputs, updatedProfile, language);
      
      const resultsWithIds = results.map((res, idx) => ({
        ...res,
        id: allBatches[idx].topicId
      }));

      setEvaluation(resultsWithIds[0]); 
      setSessionResults(resultsWithIds);
      audioHaptic.playLevelUp();
      nav.setStage(AppStage.RESULTS);

    } catch (e: any) {
      console.error("Batch Finish Error", e);
      setErrorMsg(e.message || "Unknown analysis error");
      audioHaptic.playError();
      nav.setStage(AppStage.ERROR);
    } finally {
      setIsPending(false);
    }
  };

  // --- Pipeline: Start Quiz with Lazy Loading ---
  const startQuizPipeline = async () => {
    if (isPending) return;
    const allTopics = topicMgr.state.selectedSubTopics;
    if (allTopics.length === 0) return;

    try {
      audioHaptic.playClick('hard');
      setIsPending(true);
      nav.setStage(AppStage.LOADING_QUIZ);

      // 1. Separate First Topic & Rest
      const [firstTopic, ...restTopics] = allTopics;
      
      // 2. Fetch FIRST Topic immediately
      const firstSet = await generateQuestionsBatch(
        [firstTopic],
        topicMgr.state.difficulty,
        language,
        profile.userProfile
      );

      if (firstSet.length === 0) throw new Error("Failed to generate initial questions");

      // 3. Initialize Quiz with First Topic, but tell engine about ALL topics
      quiz.actions.initQuiz(firstSet, allTopics);
      
      // 4. Start Game
      setIsPending(false);
      nav.setStage(AppStage.QUIZ);

      // 5. Background Fetch for Rest (if any)
      if (restTopics.length > 0) {
        setIsBackgroundLoading(true);
        // Fire and forget (handled by promise chain)
        generateQuestionsBatch(
          restTopics,
          topicMgr.state.difficulty,
          language,
          profile.userProfile
        ).then((backgroundSets) => {
           if (backgroundSets.length > 0) {
             quiz.actions.appendQuizSets(backgroundSets);
           }
        }).catch((err) => {
           console.warn("Background loading failed", err);
        }).finally(() => {
           setIsBackgroundLoading(false);
           // If user was stuck waiting, auto-advance now
           if (waitingForNextTopicRef.current) {
             waitingForNextTopicRef.current = false;
             setTimeout(() => {
                if (quiz.actions.handleNextTopic()) {
                    nav.setStage(AppStage.QUIZ);
                }
             }, 500);
           }
        });
      }

    } catch (e: any) {
      setErrorMsg(e.message || "Failed to initialize protocol");
      nav.setStage(AppStage.ERROR);
      setIsPending(false);
    }
  };

  // --- Pipeline: Handle Next Topic Transition ---
  const handleNextTopicInQueue = () => {
    try { audioHaptic.playClick(); } catch {}
    
    // Attempt to move next
    const success = quiz.actions.handleNextTopic();
    
    if (success) {
      nav.setStage(AppStage.QUIZ);
    } else {
      // If failed to move next (queue empty) but background is still loading
      if (isBackgroundLoading) {
        waitingForNextTopicRef.current = true;
        nav.setStage(AppStage.LOADING_QUIZ); 
      } else {
        console.warn("Queue empty and no background loading.");
      }
    }
  };

  const confirmAnswer = useCallback(() => {
    if (!quiz.state.selectedOption || quiz.state.isSubmitting) return;
    
    quiz.actions.setIsSubmitting(true);
    
    const question = quiz.state.questions[quiz.state.currentQuestionIndex];
    const isCorrect = quiz.state.selectedOption === question.correctAnswer;
    
    if (isCorrect) audioHaptic.playSuccess();
    else audioHaptic.playError();

    const answer = { 
      questionId: question.id, 
      questionText: question.question, 
      selectedOption: quiz.state.selectedOption, 
      correctAnswer: question.correctAnswer, 
      isCorrect,
      context: question.context 
    };
    
    const updatedAnswers = [...quiz.state.userAnswers, answer];
    quiz.actions.setUserAnswers(updatedAnswers);
    
    if (quiz.state.currentQuestionIndex < quiz.state.questions.length - 1) {
      setTimeout(() => {
         quiz.actions.setCurrentQuestionIndex(prev => prev + 1);
         quiz.actions.setSelectedOption(null);
         quiz.actions.setIsSubmitting(false);
      }, 800); 
    } else {
      // Topic Finished
      const currentTopicLabel = quiz.state.currentQuizSet?.topic || "Unknown";
      const currentTopicId = quiz.state.currentQuizSet?.categoryId || "GENERAL";
      
      const batchData: AccumulatedBatchData = {
         topicLabel: currentTopicLabel,
         topicId: currentTopicId,
         answers: updatedAnswers
      };
      
      const newCompletedBatches = [...quiz.state.completedBatches, batchData];
      quiz.actions.setCompletedBatches(newCompletedBatches);

      const isLastTopic = quiz.state.batchProgress.current >= quiz.state.batchProgress.total;

      if (!isLastTopic) {
         setTimeout(() => {
             const hasNext = quiz.state.quizQueue.length > 0;
             if (hasNext) {
                 quiz.actions.handleNextTopic();
                 quiz.actions.setIsSubmitting(false); 
             } else {
                 waitingForNextTopicRef.current = true;
                 nav.setStage(AppStage.LOADING_QUIZ);
             }
         }, 800);
      } else {
         finishBatchQuiz(newCompletedBatches).then(() => {
             quiz.actions.setIsSubmitting(false);
         });
      }
    }
  }, [quiz, nav, profile.userProfile, language, isBackgroundLoading]);

  // --- Browser History Integration ---
  const attemptExitApp = useCallback(() => {
    const inStandalone = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;

    // Try to leave current webview/history stack first.
    window.history.go(-Math.max(1, window.history.length));

    // Fallbacks for mobile installed-webapp contexts.
    setTimeout(() => {
      try { window.close(); } catch {}
      if (inStandalone) {
        window.location.replace('about:blank');
      }
    }, 120);

    // If exit is blocked by the environment/browser, allow retry on next back action.
    setTimeout(() => {
      isHandlingExitRef.current = false;
    }, 1000);
  }, []);

  const performBackNavigation = useCallback((): boolean => {
    const state = window.history.state;

    // Guard/root or Intro root case: ask exit confirmation.
    const atExitBoundary = state?.type === 'EXIT_GUARD' || (!state && nav.stage === AppStage.INTRO);
    if (atExitBoundary) {
      if (isHandlingExitRef.current) return true;

      if (window.confirm(t.common.confirm_exit_app)) {
        isHandlingExitRef.current = true;
        attemptExitApp();
      } else {
        window.history.pushState({ stage: AppStage.INTRO }, '', window.location.pathname);
        nav.setStage(AppStage.INTRO);
      }
      return true;
    }

    // Restore stage from browser history entry.
    if (state?.stage) {
      if (state.stage === AppStage.TOPIC_SELECTION && !state.phase && topicMgr.state.selectionPhase === 'SUBTOPIC') {
        topicMgr.actions.backToCategories();
      }
      nav.setStage(state.stage);
      return true;
    }

    // Fallback safety.
    nav.setStage(AppStage.INTRO);
    nav.resetHistoryToIntro();
    return true;
  }, [attemptExitApp, nav, t.common.confirm_exit_app, topicMgr.actions, topicMgr.state.selectionPhase]);

  const handleResetToHome = useCallback(() => {
    setIsPending(false);
    setIsBackgroundLoading(false);
    waitingForNextTopicRef.current = false;
    quiz.actions.resetQuizState();
    topicMgr.actions.resetSelection();
    setEvaluation(null);
    setSessionResults([]);
    nav.setStage(AppStage.INTRO);
  }, [quiz.actions, topicMgr.actions, nav]);

  useEffect(() => {
    const handlePopState = (_: PopStateEvent) => {
      nav.isNavigatingBackRef.current = true;
      performBackNavigation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [performBackNavigation, nav]);

  const goBack = useCallback(() => {
     if (isPending || quiz.state.isSubmitting) return;
     try { audioHaptic.playClick('soft'); } catch {}
     window.history.back();
  }, [isPending, quiz.state.isSubmitting]);

  const goHomeAction = useCallback(() => {
     nav.goHome(t.common.confirm_home, () => {
        handleResetToHome();
     });
  }, [nav, t, handleResetToHome]);

  const actions = useMemo(() => ({
    setLanguage: (lang: Language) => { 
      try { audioHaptic.playClick('soft'); } catch {}
      setLanguage(lang); 
    },
    startIntro: () => {
      try { audioHaptic.playClick('hard'); } catch {}
      if (profile.userProfile.gender && profile.userProfile.nationality) {
        nav.setStage(AppStage.TOPIC_SELECTION);
      } else {
        nav.setStage(AppStage.PROFILE);
      }
    },
    editProfile: () => {
      try { audioHaptic.playClick(); } catch {}
      nav.setStage(AppStage.PROFILE);
    },
    resetProfile: () => {
      profile.actions.resetProfile();
      nav.setStage(AppStage.PROFILE);
    },
    updateProfile: profile.actions.updateProfile,
    submitProfile: () => {
      profile.actions.saveProfile();
      nav.setStage(AppStage.TOPIC_SELECTION);
    },
    selectCategory: topicMgr.actions.selectCategory,
    proceedToSubTopics: () => {
        topicMgr.actions.proceedToSubTopics();
        window.history.pushState({ stage: AppStage.TOPIC_SELECTION, phase: 'SUBTOPIC' }, '');
    },
    selectSubTopic: topicMgr.actions.selectSubTopic,
    setDifficulty: topicMgr.actions.setDifficulty,
    shuffleTopics: topicMgr.actions.shuffleTopics,
    shuffleSubTopics: () => {}, 
    setCustomTopic: (_topic: string) => {},
    
    goBack,
    goHome: goHomeAction,

    resetApp: () => {
      try { audioHaptic.playClick(); } catch {}
      quiz.actions.resetQuizState();
      setEvaluation(null);
      setSessionResults([]);
      topicMgr.actions.resetSelection();
      nav.setStage(AppStage.TOPIC_SELECTION);
    },

    startQuiz: startQuizPipeline,
    nextTopicInQueue: handleNextTopicInQueue,
    selectOption: quiz.actions.selectOption,
    confirmAnswer,

    startDebugQuiz: async () => { 
       if (isPending) return;
       try { audioHaptic.playClick(); } catch {}
       setIsPending(true);
       nav.setStage(AppStage.LOADING_QUIZ);
       try {
         await new Promise(resolve => setTimeout(resolve, 800));
         const debugTopics = ["Debug Alpha", "Debug Beta"];
         const debugSets: QuizSet[] = debugTopics.map((topic, index) => ({
           topic: topic,
           categoryId: "GENERAL",
           questions: DEBUG_QUIZ.map(q => ({ ...q, id: q.id + (index * 100) }))
         }));
         quiz.actions.initQuiz(debugSets, debugTopics);
         nav.setStage(AppStage.QUIZ);
       } catch (e) {
         nav.setStage(AppStage.ERROR);
       } finally { setIsPending(false); }
    },
    triggerSeeding: async () => { 
       try { await seedLocalDatabase(console.log); alert("Seeding OK"); } catch(e) { alert("Fail"); }
    },
    previewResults: () => {
      const mockResult: EvaluationResult = {
        id: "SCIENCE",
        totalScore: 88, humanPercentile: 92, aiComparison: "Debug Mode.", demographicPercentile: 95, demographicComment: "Outlier.", title: "Quantum Physics", details: []
      };
      setEvaluation(mockResult); setSessionResults([mockResult]); nav.setStage(AppStage.RESULTS);
    },
    previewLoading: () => {
        nav.setStage(AppStage.LOADING_QUIZ);
        setTimeout(() => nav.setStage(AppStage.INTRO), 3000);
    },
  }), [language, nav, profile, topicMgr, quiz, isPending, confirmAnswer, t, goBack, startQuizPipeline, handleNextTopicInQueue, goHomeAction]);

  const swipeHandlers = useSwipeGesture({
    onSwipeRight: goBack,
    edgeOnly: true,
    threshold: 60
  });

  return {
    state: {
      stage: nav.stage,
      language,
      userProfile: profile.userProfile,
      topicState: { 
        ...topicMgr.state, 
        isTopicLoading: isPending,
        errorMsg,
        userProfile: profile.userProfile
      },
      quizState: quiz.state,
      resultState: { evaluation, sessionResults, errorMsg } 
    },
    actions,
    swipeHandlers,
    t
  };
};
