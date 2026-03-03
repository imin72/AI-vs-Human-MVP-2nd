import { useState, useCallback } from 'react';
import { QuizSet, QuizQuestion, UserAnswer } from '../types';
import { audioHaptic } from '../services/audioHapticService';

export interface AccumulatedBatchData {
  topicLabel: string;
  topicId: string;
  answers: UserAnswer[];
}

export const useQuizEngine = () => {
  const [quizQueue, setQuizQueue] = useState<QuizSet[]>([]);
  const [currentQuizSet, setCurrentQuizSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ total: number, current: number, topics: string[] }>({ total: 0, current: 0, topics: [] });
  const [completedBatches, setCompletedBatches] = useState<AccumulatedBatchData[]>([]);

  // Modified to accept allTopicLabels to setup progress bar even if data isn't ready
  const initQuiz = useCallback((initialQuizSets: QuizSet[], allTopicLabels: string[]) => {
    if (initialQuizSets.length === 0 && allTopicLabels.length === 0) return;
    
    // Set the first topic
    const [first, ...rest] = initialQuizSets;
    
    // If we have at least one set, initialize immediately
    if (first) {
      setCurrentQuizSet(first);
      setQuestions(first.questions);
      setQuizQueue(rest); // Put remaining *loaded* sets in queue
    } else {
       // Should not happen in normal pipeline flow, but safety check
       setQuizQueue([]);
    }

    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCompletedBatches([]);
    
    // Initialize progress based on ALL intended topics, not just loaded ones
    setBatchProgress({
      total: allTopicLabels.length,
      current: 1,
      topics: allTopicLabels
    });
  }, []);

  // New action to add background-loaded quizzes to the queue
  const appendQuizSets = useCallback((newQuizSets: QuizSet[]) => {
    setQuizQueue(prev => [...prev, ...newQuizSets]);
  }, []);

  const selectOption = useCallback((option: string) => {
    if (isSubmitting) return;
    try { audioHaptic.playClick('soft'); } catch {}
    setSelectedOption(option);
  }, [isSubmitting]);

  const resetQuizState = useCallback(() => {
    setQuizQueue([]);
    setCurrentQuizSet(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsSubmitting(false);
    setBatchProgress({ total: 0, current: 0, topics: [] });
    setCompletedBatches([]);
  }, []);

  const handleNextTopic = useCallback((): boolean => {
    if (quizQueue.length > 0) {
       const [next, ...rest] = quizQueue;
       
       setQuizQueue(rest);
       setCurrentQuizSet(next);
       setQuestions(next.questions);
       setCurrentQuestionIndex(0);
       setUserAnswers([]);
       setSelectedOption(null);
       setIsSubmitting(false);

       setBatchProgress(prev => ({
          ...prev,
          current: prev.current + 1
       }));
       return true; // Successfully moved to next
    }
    return false; // Queue empty
  }, [quizQueue]);

  return {
    state: {
      quizQueue,
      currentQuizSet,
      questions,
      currentQuestionIndex,
      userAnswers,
      selectedOption,
      isSubmitting,
      batchProgress,
      completedBatches,
      remainingTopics: quizQueue.length,
      nextTopicName: quizQueue.length > 0 ? quizQueue[0].topic : undefined,
      currentTopicName: currentQuizSet?.topic || (batchProgress.topics.length > 0 ? batchProgress.topics[batchProgress.current - 1] : undefined),
    },
    actions: {
      initQuiz,
      appendQuizSets, // Exported
      selectOption,
      resetQuizState,
      setIsSubmitting,
      setSelectedOption,
      setUserAnswers,
      setCurrentQuestionIndex,
      setCompletedBatches,
      handleNextTopic
    }
  };
};