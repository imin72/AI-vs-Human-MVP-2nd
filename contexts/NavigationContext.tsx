import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { AppStage } from '../types';
import { audioHaptic } from '../services/audioHapticService';

interface NavigationContextType {
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  goHome: (confirmMsg: string, onConfirmAction?: () => void) => void;
  resetHistoryToIntro: () => void;
  isNavigatingBackRef: React.MutableRefObject<boolean>;
  isBackNav: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<AppStage>(AppStage.INTRO);
  const [isBackNav, setIsBackNav] = useState(false);
  const isNavigatingBackRef = useRef(false);

  const resetHistoryToIntro = useCallback(() => {
    window.history.replaceState({ type: 'EXIT_GUARD' }, '', window.location.pathname);
    window.history.pushState({ stage: AppStage.INTRO }, '', window.location.pathname);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // App starts with a clean intro root regardless of previous in-app navigation.
    resetHistoryToIntro();
  }, [resetHistoryToIntro]);

  useEffect(() => {
    if (isNavigatingBackRef.current) {
      setIsBackNav(true);
      isNavigatingBackRef.current = false;
      setTimeout(() => setIsBackNav(false), 500);
      return;
    }

    setIsBackNav(false);

    const TRANSIENT_STAGES = [AppStage.LOADING_QUIZ, AppStage.ANALYZING];

    if (stage === AppStage.INTRO) {
      // Intro should always be a fresh root point in app history.
      resetHistoryToIntro();
      return;
    }

    if (TRANSIENT_STAGES.includes(stage)) {
      window.history.replaceState({ stage }, '');
      return;
    }

    if (window.history.state?.stage !== stage) {
      window.history.pushState({ stage }, '');
    }
  }, [stage, resetHistoryToIntro]);

  const goHome = useCallback((confirmMsg: string, onConfirmAction?: () => void) => {
    try { audioHaptic.playClick(); } catch {}

    const needsConfirmation = stage === AppStage.QUIZ || stage === AppStage.LOADING_QUIZ || stage === AppStage.ANALYZING;

    if (needsConfirmation && !window.confirm(confirmMsg)) {
      return;
    }

    onConfirmAction?.();
    setStage(AppStage.INTRO);
  }, [stage]);

  return (
    <NavigationContext.Provider value={{ stage, setStage, goHome, resetHistoryToIntro, isNavigatingBackRef, isBackNav }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};
