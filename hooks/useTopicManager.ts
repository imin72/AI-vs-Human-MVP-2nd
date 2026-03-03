import { useState, useEffect, useCallback, useMemo } from 'react';
import { Difficulty, Language } from '../types';
import { audioHaptic } from '../services/audioHapticService';
import { TRANSLATIONS } from '../utils/translations';

// Fisher-Yates Shuffle Helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const useTopicManager = (language: Language) => {
  const [selectionPhase, setSelectionPhase] = useState<'CATEGORY' | 'SUBTOPIC'>('CATEGORY');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [displayedTopics, setDisplayedTopics] = useState<{id: string, label: string}[]>([]);

  const t = useMemo(() => TRANSLATIONS[language], [language]);

  // Initialize and Shuffle Topics when Language Changes
  useEffect(() => {
    const topics = Object.entries(t.topics.categories)
      .map(([id, label]) => ({ id, label }));
    setDisplayedTopics(shuffleArray(topics));
  }, [t]);

  // Reset selections when language changes to avoid mismatch
  useEffect(() => {
    setSelectedCategories([]);
    setSelectedSubTopics([]);
    setSelectionPhase('CATEGORY');
  }, [language]);

  const shuffleTopics = useCallback(() => {
    try { audioHaptic.playClick(); } catch {}
    setDisplayedTopics(prev => shuffleArray(prev));
  }, []);

  const selectCategory = useCallback((id: string) => {
    try { audioHaptic.playClick('soft'); } catch {}
    setSelectedCategories(prev => {
      if (prev.includes(id)) {
        return prev.filter(cat => cat !== id);
      } else {
        if (prev.length >= 4) return prev; 
        return [...prev, id];
      }
    });
  }, []);

  const proceedToSubTopics = useCallback(() => {
    try { audioHaptic.playClick(); } catch {}
    if (selectedCategories.length > 0) {
      setSelectionPhase('SUBTOPIC');
    }
  }, [selectedCategories]);

  const selectSubTopic = useCallback((sub: string) => {
    try { audioHaptic.playClick('soft'); } catch {}
    setSelectedSubTopics(prev => {
      if (prev.includes(sub)) {
        return prev.filter(p => p !== sub);
      } else {
        if (prev.length >= 4) return prev; 
        return [...prev, sub];
      }
    });
  }, []);

  const setDifficultyWithSound = useCallback((diff: Difficulty) => {
    try { audioHaptic.playClick('soft'); } catch {}
    setDifficulty(diff);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectionPhase('CATEGORY');
    setSelectedCategories([]);
    setSelectedSubTopics([]);
  }, []);

  const backToCategories = useCallback(() => {
    setSelectionPhase('CATEGORY');
    setSelectedSubTopics([]);
  }, []);

  return {
    state: {
      selectionPhase,
      selectedCategories,
      selectedSubTopics,
      difficulty,
      displayedTopics
    },
    actions: {
      shuffleTopics,
      selectCategory,
      proceedToSubTopics,
      selectSubTopic,
      setDifficulty: setDifficultyWithSound,
      resetSelection,
      backToCategories,
      // Helper setter for raw state access if needed
      setSelectionPhase 
    }
  };
};