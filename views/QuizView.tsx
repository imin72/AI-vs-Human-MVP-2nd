
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Cpu, Terminal, Zap, Lightbulb, Home, Timer, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { QuizQuestion, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { audioHaptic } from '../services/audioHapticService';
import { useAppNavigation } from '../hooks/useAppNavigation';

interface QuizViewProps {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOption: string | null;
  topicLabel: string;
  onSelectOption: (opt: string) => void;
  onConfirm: () => void;
  onHome: () => void;
  onBack?: () => void; 
  language: Language;
  batchProgress?: { total: number; current: number; topics: string[] };
  isSubmitting?: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({ 
  questions, 
  currentIndex, 
  selectedOption, 
  topicLabel, 
  onSelectOption, 
  onConfirm, 
  onHome,
  language,
  batchProgress,
  isSubmitting = false
}) => {
  const { isBackNav } = useAppNavigation();
  const question = questions[currentIndex];
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiComment, setAiComment] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [aiProgress, setAiProgress] = useState(0); 
  
  // Refs for scrolling
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[language].quiz;

  // Scroll to top when question changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, topicLabel]);

  useEffect(() => {
    const logs = [
      "INITIALIZING NEURAL NETWORK...",
      `SCANNING DATABASE: ${topicLabel.toUpperCase()}`,
      "ANALYZING HUMAN COGNITIVE PATTERNS...",
      "AI PREDICTION CONFIDENCE: 98.4%",
      "AI STATUS: READY",
      "WAITING FOR HUMAN INPUT..."
    ];
    
    setAiLogs([]);
    setShowHint(false); 
    setAiProgress(0);

    const thinkingTime = 2000 + (question.question.length * 50);
    const updateInterval = 50;
    const progressStep = 100 / (thinkingTime / updateInterval);

    let progressTimer = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + progressStep;
      });
    }, updateInterval);

    let i = 0;
    const logInterval = setInterval(() => {
      if (i < logs.length) {
        setAiLogs(prev => [...prev, logs[i]].slice(-4));
        i++;
      } else {
        clearInterval(logInterval);
      }
    }, 1200);

    setAiComment(currentIndex === 0 ? 
      (language === 'ko' ? "인간, 당신의 지능을 증명해 보십시오." : "Human, prove your intelligence.") : 
      (language === 'ko' ? "다음 단계는 더 어려울 것입니다." : "The next sequence will be more complex.")
    );

    return () => {
      clearInterval(logInterval);
      clearInterval(progressTimer);
    };
  }, [currentIndex, topicLabel, language, question.question]);

  useEffect(() => {
    if (selectedOption) {
      const taunts = language === 'ko' ? [
        "그것이 최선의 선택입니까?",
        "데이터베이스에는 다른 결과가 있습니다.",
        "인간 특유의 편향이 보이는군요.",
        "흥미롭군요. 계속해 보십시오.",
        "시간은 흐르고 있습니다. 서두르세요."
      ] : [
        "Is that your final logic?",
        "My database suggests otherwise.",
        "Typical human cognitive bias detected.",
        "Intriguing. Continue your attempt.",
        "Time is a finite resource for you."
      ];
      setAiComment(taunts[Math.floor(Math.random() * taunts.length)]);
    }
  }, [selectedOption, language]);

  const handleHintClick = () => {
    if (isSubmitting) return;
    audioHaptic.playClick('soft');
    setShowHint(true);
    setAiComment(language === 'ko' ? 
      "힌트를 구걸하다니... 인간의 한계인가요? 점수 효율이 저하됩니다." : 
      "Begging for hints? Human limitations reached. Efficiency penalty applied."
    );
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [aiLogs]);

  const btnStyle = "w-10 h-10 flex items-center justify-center text-white bg-slate-800/80 backdrop-blur-md rounded-full hover:bg-slate-700 transition-all border border-white/10 shadow-lg p-0 disabled:opacity-50 disabled:cursor-not-allowed";
  const isAiDone = aiProgress >= 100;

  const isLastQuestion = currentIndex === questions.length - 1;
  const isBatchFinished = !batchProgress || batchProgress.current >= batchProgress.total;
  let buttonText = t.btn_next;
  
  if (isLastQuestion) {
    if (!isBatchFinished && batchProgress) {
      // If there are more topics, indicate proceeding to next topic
      const nextTopic = batchProgress.topics[batchProgress.current] || "Next";
      buttonText = `${t.btn_start_next_topic_prefix}${nextTopic}${t.btn_start_next_topic_suffix}`;
    } else {
      // Final Finish
      buttonText = t.btn_finish;
    }
  }

  return (
    // Removed bg-slate-950 to be transparent
    <div className={`flex flex-col w-full h-full relative ${isBackNav ? '' : 'animate-fade-in'}`}>
      
      {/* Top Header Row with Batch Progress & Controls */}
      <div className="flex justify-between items-center mb-2 shrink-0 z-20">
         {/* Batch Progress Indicator (Left Aligned) */}
         <div className="flex items-center gap-1.5 pl-1">
            {batchProgress && batchProgress.total > 1 && Array.from({ length: batchProgress.total }).map((_, idx) => {
              const step = idx + 1;
              const isDone = step < batchProgress.current;
              const isCurrent = step === batchProgress.current;
              return (
                <div key={idx} className={`w-2 h-2 rounded-full border transition-all duration-500 ${
                    isDone ? 'bg-green-500 border-green-400' :
                    isCurrent ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-125' :
                    'bg-slate-800 border-slate-600'
                  }`} 
                />
              );
            })}
         </div>

         {/* Right Controls */}
         <div className="flex gap-2">
           {/* Enable Home button even during submission so user can abort */}
           <button onClick={onHome} className={btnStyle} aria-label="Home">
             <Home size={18} />
           </button>
         </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow flex flex-col min-h-0 gap-3">
        {/* Main Quiz Card */}
        <div className={`glass-panel flex-grow flex flex-col min-h-0 rounded-3xl relative overflow-hidden transition-all duration-700 border ${
          isAiDone ? 'border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.2)] bg-rose-950/20' : 'border-white/10'
        }`}>
          {/* Scrollable Question & Options - Added ref here */}
          <div ref={scrollContainerRef} className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-8">
            
            {/* Header: Topic & Counter */}
            <div className="flex justify-between items-start text-sm text-slate-400 uppercase tracking-wider relative min-h-[40px] mb-2">
              <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold border border-slate-700 text-cyan-400 shrink-0 mt-1">
                  {topicLabel}
              </span>
              <span className="font-mono text-xs shrink-0 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50 mt-1">
                 {currentIndex + 1} / {questions.length}
              </span>
              
              {/* AI Bubble */}
              <div className="absolute left-0 right-0 -top-1 flex justify-center pointer-events-none z-20">
                 <div className="bg-rose-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-rose-400 animate-bounce max-w-[70%] text-center relative">
                    {aiComment}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-600 rotate-45 border-r border-b border-rose-400"></div>
                 </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="py-4">
              <h3 className="text-lg md:text-2xl font-black leading-tight text-white tracking-tight">
                {question.question}
              </h3>
              <div className="mt-4">
                {!showHint ? (
                  <button 
                    onClick={handleHintClick}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Lightbulb size={12} /> {language === 'ko' ? "AI 힌트 요청" : "Request AI Hint"}
                  </button>
                ) : (
                  <div className="flex gap-3 p-3 rounded-xl bg-slate-900/50 border border-amber-500/30 animate-fade-in">
                    <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-xs italic leading-relaxed">{question.context}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 pb-2">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectOption(option)}
                  disabled={isSubmitting} // Disable interactions when submitting
                  onMouseEnter={() => !isSubmitting && audioHaptic.playHover()}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 border relative group overflow-hidden ${
                    selectedOption === option
                      ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_25px_rgba(8,145,178,0.5)] scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                  } ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-black text-xs transition-colors ${
                      selectedOption === option ? 'border-white bg-white text-cyan-600' : 'border-slate-700 text-slate-600'
                    }`}>
                      {['A','B','C','D'][idx]}
                    </div>
                    <span className={`font-bold text-sm ${selectedOption === option ? 'text-white' : 'group-hover:text-slate-200'}`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Area: Button, Status, Log (Shrink-0) */}
        <div className="flex flex-col gap-2 shrink-0">
          <Button 
            onClick={onConfirm} 
            disabled={!selectedOption || isSubmitting}
            fullWidth
            className={`py-4 text-sm font-black uppercase tracking-widest shadow-lg ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
          >
            {isSubmitting ? (language === 'ko' ? '기록 중...' : 'Recording...') : (
                <><span className="mr-2">{buttonText}</span> <ChevronRight size={18} /></>
            )}
          </Button>

          {/* AI Status Panel */}
          <div className="glass-panel p-3 rounded-2xl border-rose-500/20 flex items-center justify-between overflow-hidden shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Cpu size={20} className={`${isAiDone ? 'text-rose-500' : 'text-slate-400'} transition-colors duration-500`} />
                <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full animate-ping ${isAiDone ? 'bg-rose-500' : 'bg-green-500'}`}></div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${isAiDone ? 'text-rose-500' : 'text-slate-400'}`}>
                {t.ai_status}: {isAiDone ? t.ai_answer_found : t.ai_calculating}
              </span>
            </div>
            
            <div className="flex flex-col items-end gap-1 w-24">
               <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                 {isAiDone ? <CheckCircle2 size={10} className="text-rose-500"/> : <Timer size={10} className="animate-spin" />}
                 {Math.floor(aiProgress)}%
               </div>
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div 
                    className={`h-full transition-all duration-100 ease-linear ${isAiDone ? 'bg-rose-500' : 'bg-slate-500'}`}
                    style={{ width: `${aiProgress}%` }}
                 ></div>
               </div>
            </div>
          </div>

          {/* Terminal Log */}
          <div className="glass-panel p-2 rounded-xl bg-black/40 border-slate-800 flex items-start gap-2 opacity-60">
            <Terminal size={12} className="text-cyan-500 mt-0.5" />
            <div className="flex-1 font-mono text-[9px] text-slate-500 leading-tight">
              {aiLogs.slice(-2).map((log, i) => ( // Show less logs to save space
                <div key={i} className={i === aiLogs.slice(-2).length - 1 ? "text-cyan-400/80" : ""}>
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};