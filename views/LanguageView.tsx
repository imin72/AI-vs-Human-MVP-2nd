
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageViewProps {
  onSelect: (lang: Language) => void;
}

const LANGUAGES: { id: Language; label: string; flag: string; titleText: string }[] = [
  { id: 'en', label: 'English', flag: '🇺🇸', titleText: 'Select Language' },
  { id: 'ko', label: '한국어', flag: '🇰🇷', titleText: '언어를 선택하세요' },
  { id: 'ja', label: '日本語', flag: '🇯🇵', titleText: '言語を選択' },
  { id: 'zh', label: '简体中文', flag: '🇨🇳', titleText: '选择语言' },
  { id: 'es', label: 'Español', flag: '🇪🇸', titleText: 'Seleccionar Idioma' },
  { id: 'fr', label: 'Français', flag: '🇫🇷', titleText: 'Choisir la Langue' },
];

export const LanguageView: React.FC<LanguageViewProps> = ({ onSelect }) => {
  const [headerText, setHeaderText] = useState("Select Language");

  return (
    <div className="glass-panel p-8 rounded-3xl text-center space-y-8 animate-fade-in">
       <div className="flex justify-center mb-4 text-cyan-400">
         <Globe size={48} />
       </div>
       
       <h2 className="text-3xl font-bold text-white min-h-[40px] transition-all duration-300">
         {headerText}
       </h2>
       
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {LANGUAGES.map((lang) => (
            <button 
              key={lang.id}
              onClick={() => onSelect(lang.id)} 
              onMouseEnter={() => setHeaderText(lang.titleText)}
              onMouseLeave={() => setHeaderText("Select Language")}
              onTouchStart={() => setHeaderText(lang.titleText)}
              onTouchEnd={() => setHeaderText("Select Language")}
              className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 transition-all group select-none"
            >
              <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform duration-300">{lang.flag}</span>
              <span className="font-bold text-lg text-slate-300 group-hover:text-white">{lang.label}</span>
            </button>
          ))}
       </div>
    </div>
  );
};
