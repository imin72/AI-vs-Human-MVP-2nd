
import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'ko', label: '한국어', flag: '🇰🇷' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
  { id: 'zh', label: '简体中文', flag: '🇨🇳' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative z-30 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-slate-800/80 backdrop-blur-md p-2 rounded-full hover:bg-slate-700 transition-all border border-white/10 shadow-lg group"
        aria-label="Change Language"
      >
        <Globe size={20} className="group-hover:text-cyan-400 transition-colors" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in flex flex-col z-50">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onLanguageChange(lang.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-slate-800 transition-colors ${
                  currentLanguage === lang.id ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </span>
                {currentLanguage === lang.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
