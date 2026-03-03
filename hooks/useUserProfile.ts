
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { audioHaptic } from '../services/audioHapticService';

const PROFILE_KEY = 'ai_vs_human_profile_v1';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    gender: '', 
    ageGroup: '', 
    nationality: '',
    eloRatings: {},
    seenQuestionIds: [],
    history: []
  });

  // Load Profile on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile({
          ...parsed,
          eloRatings: parsed.eloRatings || {},
          seenQuestionIds: parsed.seenQuestionIds || [],
          history: parsed.history || []
        });
      }
    } catch (e) {
      console.warn("Failed to load profile");
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    try { audioHaptic.playClick('soft'); } catch {}
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const resetProfile = useCallback(() => {
    try { audioHaptic.playClick(); } catch {}
    localStorage.removeItem(PROFILE_KEY);
    setUserProfile({ gender: '', ageGroup: '', nationality: '' });
  }, []);

  const saveProfile = useCallback(() => {
    try { audioHaptic.playClick('hard'); } catch {}
    localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  const persistProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, []);

  return {
    userProfile,
    actions: {
      updateProfile,
      resetProfile,
      saveProfile,
      persistProfile // Used for saving stats/elo without UI sound feedback
    }
  };
};