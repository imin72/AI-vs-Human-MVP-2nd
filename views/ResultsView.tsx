
import React, { useState, useRef, useCallback } from 'react';
import { EvaluationResult, Language, TOPIC_IDS, UserProfile } from '../types';
import { Button } from '../components/Button';
import { Share2, RefreshCw, Brain, CheckCircle, CheckCircle2, XCircle, Home, ArrowRight, Activity, Terminal, History, FlaskConical, Palette, Zap, Map, Film, Music, Gamepad2, Trophy, Cpu, Scroll, Book, Leaf, Utensils, Orbit, Lightbulb, Link as LinkIcon, Download, Twitter, Instagram, TrendingUp, AlertTriangle, MessageCircle, MessageSquare, Timer, Target, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { toPng } from 'html-to-image';
import { TRANSLATIONS } from '../utils/translations';
import { useAppNavigation } from '../hooks/useAppNavigation';

interface ResultsViewProps {
  data: EvaluationResult;
  sessionResults?: EvaluationResult[];
  userProfile?: UserProfile;
  onRestart: () => void;
  onHome: () => void;
  onNextTopic?: () => void;
  remainingTopics?: number;
  nextTopicName?: string;
  language: Language;
}

const getTopicIcon = (id: string | undefined) => {
  if (!id) return <Zap size={16} />;
  const up = id.toUpperCase();
  if (up.includes(TOPIC_IDS.HISTORY.toUpperCase())) return <History size={16} />;
  if (up.includes(TOPIC_IDS.SCIENCE.toUpperCase())) return <FlaskConical size={16} />;
  if (up.includes(TOPIC_IDS.ARTS.toUpperCase())) return <Palette size={16} />;
  if (up.includes(TOPIC_IDS.GEOGRAPHY.toUpperCase())) return <Map size={16} />;
  if (up.includes(TOPIC_IDS.MOVIES.toUpperCase())) return <Film size={16} />;
  if (up.includes(TOPIC_IDS.MUSIC.toUpperCase())) return <Music size={16} />;
  if (up.includes(TOPIC_IDS.GAMING.toUpperCase())) return <Gamepad2 size={16} />;
  if (up.includes(TOPIC_IDS.SPORTS.toUpperCase())) return <Trophy size={16} />;
  if (up.includes(TOPIC_IDS.TECH.toUpperCase())) return <Cpu size={16} />;
  if (up.includes(TOPIC_IDS.MYTHOLOGY.toUpperCase())) return <Scroll size={16} />;
  if (up.includes(TOPIC_IDS.LITERATURE.toUpperCase())) return <Book size={16} />;
  if (up.includes(TOPIC_IDS.NATURE.toUpperCase())) return <Leaf size={16} />;
  if (up.includes(TOPIC_IDS.FOOD.toUpperCase())) return <Utensils size={16} />;
  if (up.includes(TOPIC_IDS.SPACE.toUpperCase())) return <Orbit size={16} />;
  if (up.includes(TOPIC_IDS.PHILOSOPHY.toUpperCase())) return <Lightbulb size={16} />;
  return <Zap size={16} />;
};

export const ResultsView: React.FC<ResultsViewProps> = ({ 
  data, 
  sessionResults = [], 
  userProfile,
  onRestart, 
  onHome, 
  onNextTopic, 
  remainingTopics = 0, 
  nextTopicName, 
  language 
}) => {
  const { isBackNav } = useAppNavigation();
  // Page 0: Summary, Page 1: Details, Page 2: Trends
  const [currentPage, setCurrentPage] = useState(0); 
  const [selectedResultForPopup, setSelectedResultForPopup] = useState<EvaluationResult | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false); // For "i" button
  
  // Refs for capturing individual slides
  const summaryRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language].results;
  const commonT = TRANSLATIONS[language].common;
  const categoriesT = TRANSLATIONS[language].topics.categories;
  const introT = TRANSLATIONS[language].intro;

  const isFinalSummary = remainingTopics === 0 && sessionResults.length > 0;
  const resultCount = sessionResults.length;
  const isThreeItems = resultCount === 3;

  const swipeStartRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length !== 1) return;
    const touch = e.targetTouches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
    e.stopPropagation();
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!swipeStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    const duration = Date.now() - swipeStartRef.current.t;

    const isFast = duration < 550;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.4;
    const isSignificant = Math.abs(deltaX) > 45;

    if (isFast && isHorizontal && isSignificant) {
      if (deltaX < 0 && currentPage < 2) {
        setCurrentPage(prev => prev + 1);
      } else if (deltaX > 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    }

    swipeStartRef.current = null;
    e.stopPropagation();
  }, [currentPage]);

  if (!data) return null;

  const getGrade = (score: number) => {
    if (score >= 90) return { label: 'SSS', color: 'text-yellow-400 shadow-yellow-500/50' };
    if (score >= 80) return { label: 'A+', color: 'text-cyan-400 shadow-cyan-500/50' };
    if (score >= 70) return { label: 'A', color: 'text-cyan-500 shadow-cyan-500/30' };
    if (score >= 60) return { label: 'B', color: 'text-emerald-400 shadow-emerald-500/30' };
    if (score >= 40) return { label: 'C', color: 'text-amber-400 shadow-amber-500/30' };
    return { label: 'F', color: 'text-rose-500 shadow-rose-500/30' };
  };

  const currentScore = isFinalSummary 
    ? Math.round(sessionResults.reduce((a, b) => a + b.totalScore, 0) / sessionResults.length)
    : data.totalScore;
  
  const gradeInfo = getGrade(currentScore);

  // --- Metrics Calculation ---
  // AI Score Benchmark (Hardcoded simulation based on Difficulty)
  const aiScore = currentScore > 95 ? 99 : (currentScore > 80 ? 95 : 92); 
  const humanPercentile = isFinalSummary
    ? Math.round(sessionResults.reduce((a, b) => a + b.humanPercentile, 0) / sessionResults.length)
    : data.humanPercentile;
  
  // Stats for "Icon + Text"
  const accuracy = currentScore;
  const speed = Math.min(100, currentScore + 10); // Simulated speed metric

  // --- Trends Data ---
  const history = userProfile?.history || [];
  const growthData = history.slice(-10).map((h, i) => ({
    name: i + 1,
    score: h.score,
    ai: h.aiScore
  }));

  const avgUserScore = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length) 
    : 0;
  const avgAiScore = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.aiScore, 0) / history.length) 
    : 0;
  const gap = avgAiScore - avgUserScore;

  // Gap Text Logic
  const gapText = gap <= 5 
    ? (language === 'ko' ? "AI와 대등한 실력입니다!" : "You are matching AI!") 
    : gap <= 20 
      ? (language === 'ko' ? "격차를 좁히고 있습니다." : "Closing the gap.") 
      : (language === 'ko' ? "분발이 필요합니다." : "More practice needed.");

  // Weakness Analysis
  const eloRatings = (userProfile?.eloRatings || {}) as Record<string, number>;
  let weakestTopicId = "";
  let lowestElo = 2000;
  Object.entries(eloRatings).forEach(([id, rating]) => {
     if (rating < lowestElo) {
       lowestElo = rating;
       weakestTopicId = id;
     }
  });
  const hasEnoughData = history.length >= 3;
  const weaknessLabel = weakestTopicId ? (categoriesT[weakestTopicId] || weakestTopicId) : "N/A";

  // --- Share Logic ---
  const shareText = `AI vs Human 🧬\nScore: ${currentScore}/100 [${gradeInfo.label}]\n${isFinalSummary ? 'Aggregate Analysis' : `Topic: ${data.title}`}\n\nProve your humanity:`;
  const hashtags = "AIvsHuman,KnowledgeBattle";
  const shareUrl = window.location.href;

  const captureResultImage = useCallback(async (node: HTMLDivElement) => {
    const width = node.scrollWidth;
    const height = node.scrollHeight;

    return toPng(node, {
      cacheBust: true,
      backgroundColor: '#020617',
      width,
      height,
      pixelRatio: 2,
      style: {
        width: `${width}px`,
        height: `${height}px`
      }
    });
  }, []);

  const performNativeShare = async (platform?: 'twitter' | 'instagram' | 'system') => {
    setIsGeneratingShare(true);
    let targetRef = summaryRef;
    if (currentPage === 1) targetRef = detailsRef;
    if (currentPage === 2) targetRef = trendsRef;
    
    try {
      if (targetRef.current) {
        const blob = await captureResultImage(targetRef.current)
          .then(dataUrl => fetch(dataUrl))
          .then(res => res.blob());
        const file = new File([blob], `ai-vs-human-result-${Date.now()}.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'AI vs Human', text: shareText, files: [file], url: shareUrl });
        } else {
          if (platform === 'twitter') {
            const text = encodeURIComponent(shareText);
            const url = encodeURIComponent(shareUrl);
            window.open(`https://x.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`, '_blank');
          } else if (platform === 'instagram') {
             const link = document.createElement('a');
             link.download = file.name;
             link.href = URL.createObjectURL(blob);
             link.click();
             alert(language === 'ko' ? "이미지가 저장되었습니다. 인스타그램 스토리에 공유하세요!" : "Image saved. Share to Instagram Stories!");
          } else {
            handleCopyLink();
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert("Share failed.");
    } finally {
      setIsGeneratingShare(false);
      setShowShareMenu(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => alert(language === 'ko' ? "링크가 복사되었습니다!" : "Link copied!"));
    setShowShareMenu(false);
  };

  const handleSaveAllImages = async () => {
    setIsGeneratingShare(true);
    const targets = [{ ref: summaryRef, suffix: 'summary' }, { ref: detailsRef, suffix: 'details' }, { ref: trendsRef, suffix: 'trends' }];
    try {
      for (const target of targets) {
        if (target.ref.current) {
          const dataUrl = await captureResultImage(target.ref.current);
          const link = document.createElement('a');
          link.download = `ai-vs-human-${target.suffix}-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          await new Promise(r => setTimeout(r, 500));
        }
      }
    } catch (e) { alert("Save failed."); } finally { setIsGeneratingShare(false); setShowShareMenu(false); }
  };

  const getLocalizedMessenger = () => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    switch (language) {
      case 'ko': return { label: "KakaoTalk", icon: <MessageSquare size={24} className="text-yellow-400 fill-yellow-400" />, action: () => performNativeShare('system') };
      case 'ja': return { label: "LINE", icon: <MessageCircle size={24} className="text-green-400" />, action: () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`, '_blank') };
      case 'zh': return { label: "WeChat", icon: <MessageCircle size={24} className="text-emerald-500" />, action: () => performNativeShare('system') };
      default: return { label: "WhatsApp", icon: <MessageCircle size={24} className="text-green-500" />, action: () => window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank') };
    }
  };
  const localizedMessenger = getLocalizedMessenger();

  // Helper for Item Click
  const handleItemClick = (itemData: any) => {
    if (isFinalSummary) setSelectedResultForPopup(itemData);
    else setSelectedResultForPopup(data);
  };

  const getLocalizedCategory = (id?: string) => (id ? categoriesT[id] || id : "");
  
  const getGridLayoutClass = () => {
    if (!isFinalSummary) return 'space-y-3 overflow-y-auto custom-scrollbar';
    switch (resultCount) {
      case 1: return 'grid grid-cols-1 grid-rows-1 gap-3';
      case 2: return 'grid grid-cols-1 grid-rows-2 gap-3';
      default: return 'grid grid-cols-2 grid-rows-2 gap-3';
    }
  };

  return (
    <div className={`w-full h-full relative flex flex-col ${isBackNav ? '' : 'animate-fade-in'}`}>
      
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-3 shrink-0 z-20 px-4 pt-2">
         <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              {isFinalSummary ? t.header_aggregate : t.badge_complete}
            </span>
         </div>
         <div className="flex gap-2">
           <button onClick={onHome} className="text-white bg-slate-800/80 backdrop-blur-md p-2 rounded-full hover:bg-slate-700 transition-all border border-white/10 shadow-lg" aria-label="Home">
             <Home size={20} />
           </button>
         </div>
      </div>

      {/* Main Slider */}
      <div 
         className="glass-panel flex-grow h-0 rounded-3xl overflow-hidden shadow-2xl relative mx-auto w-full max-w-2xl flex flex-col touch-pan-y"
         onTouchStart={onTouchStart}
         onTouchEnd={onTouchEnd}
      >
        <div className="flex-grow relative overflow-hidden">
           <div 
             className="absolute inset-0 flex transition-transform duration-500 ease-out will-change-transform"
             style={{ transform: `translateX(-${currentPage * 100}%)` }}
           >
              {/* PAGE 1: SUMMARY (RE-DESIGNED) */}
              <div ref={summaryRef} className="w-full h-full flex-shrink-0 p-4 md:p-6 bg-[#020617] flex flex-col"> 
                 
                 {/* 1. Big Grade Header */}
                 <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Score</span>
                       <div className={`text-6xl font-black italic tracking-tighter drop-shadow-2xl ${gradeInfo.color}`}>
                          {gradeInfo.label}
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-3xl font-bold text-white">{currentScore}<span className="text-sm text-slate-500">/100</span></div>
                       <button onClick={() => setShowExplanation(!showExplanation)} className="text-[10px] text-cyan-400 flex items-center gap-1 justify-end mt-1 hover:underline">
                          <Info size={12} /> {language === 'ko' ? "점수 기준 보기" : "How is this calculated?"}
                       </button>
                    </div>
                 </div>

                 {/* Explanation Box (Toggle) */}
                 {showExplanation && (
                    <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-xl mb-4 text-[10px] text-slate-300 leading-relaxed animate-fade-in">
                       {language === 'ko' 
                         ? "AI 점수는 난이도별 벤치마크(92~98점)입니다. 글로벌 랭킹은 시뮬레이션된 백분위입니다." 
                         : "AI score is a benchmark (92-98). Global rank is a simulated percentile."}
                    </div>
                 )}

                 {/* 2. AI vs Human Bar (Replaces Radar) */}
                 <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 mb-4 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                       <Activity size={16} className="text-rose-400" />
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.section_gap}</span>
                    </div>
                    
                    {/* AI Bar */}
                    <div className="mb-3">
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>{introT.ai_label}</span>
                          <span>{aiScore} pts</span>
                       </div>
                       <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                          <div className="h-full bg-rose-500 w-full opacity-80" style={{ width: `${aiScore}%` }}></div>
                       </div>
                    </div>

                    {/* Human Bar */}
                    <div>
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>{introT.human_label}</span>
                          <span className="text-cyan-400">{currentScore} pts</span>
                       </div>
                       <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                          <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" style={{ width: `${currentScore}%` }}></div>
                       </div>
                    </div>
                 </div>

                 {/* 3. Global Rank & Stats Grid */}
                 <div className="grid grid-cols-2 gap-3 flex-grow">
                    {/* Global Rank Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center col-span-2 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-10 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                       <Trophy size={32} className="text-purple-400 mb-2 drop-shadow-lg" />
                       <div className="text-2xl font-black text-white mb-1">Top {100 - humanPercentile}%</div>
                       <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">{t.label_percentile}</div>
                       <div className="text-[9px] text-slate-500 mt-2">
                          {language === 'ko' ? "전 세계 사용자 중 상위권입니다." : "You are among the top global players."}
                       </div>
                    </div>

                    {/* Accuracy Card */}
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                       <Target size={20} className="text-emerald-400 mb-2" />
                       <div className="text-lg font-bold text-white">{accuracy}%</div>
                       <div className="text-[9px] text-slate-500 font-bold uppercase">{t.chart.accuracy}</div>
                    </div>

                    {/* Speed Card */}
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                       <Timer size={20} className="text-amber-400 mb-2" />
                       <div className="text-lg font-bold text-white">{speed}</div>
                       <div className="text-[9px] text-slate-500 font-bold uppercase">{t.chart.speed}</div>
                    </div>
                 </div>

                 <div className="text-center text-[10px] text-slate-600 mt-4 animate-pulse">
                   Swipe for details &gt;
                 </div>
              </div>

              {/* PAGE 2: DETAILS (Unchanged structure) */}
              <div ref={detailsRef} className="w-full h-full flex-shrink-0 p-6 md:p-8 bg-[#020617] flex flex-col">
                 <div className={`h-full ${getGridLayoutClass()}`}>
                    {isFinalSummary ? (
                      sessionResults.map((res, idx) => {
                        const g = getGrade(res.totalScore);
                        const categoryLabel = getLocalizedCategory(res.id);
                        const spanClass = (isThreeItems && idx === 0) ? 'col-span-2' : '';
                        return (
                          <button key={idx} onClick={() => handleItemClick(res)} className={`w-full bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/50 transition-all text-left shadow-lg ${spanClass}`}>
                             <div className="flex justify-between items-start w-full">
                                <div className="flex flex-col gap-1">
                                   <div className="text-cyan-400 bg-slate-950/50 p-1.5 rounded-lg border border-slate-700/50 w-fit">{getTopicIcon(res.id)}</div>
                                   <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[80px]">{categoryLabel}</span>
                                </div>
                                <div className={`text-3xl font-black italic leading-none ${g.color}`}>{g.label}</div>
                             </div>
                             <div className="text-xs font-bold text-white line-clamp-2 my-1">{res.title}</div>
                          </button>
                        );
                      })
                    ) : (
                       data.details.map((item, idx) => (
                         <button key={idx} onClick={() => setSelectedResultForPopup(data)} className={`w-full p-4 rounded-xl border transition-all text-left ${item.isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'} hover:opacity-80 shrink-0`}>
                            <div className="flex gap-3">
                               <div className={`mt-1 shrink-0 ${item.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>{item.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}</div>
                               <div>
                                   <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t.popup_question} {idx + 1}</div>
                                   <div className="text-sm font-medium text-slate-200 line-clamp-2">{item.questionText || item.aiComment}</div>
                               </div>
                            </div>
                         </button>
                       ))
                    )}
                 </div>
              </div>

              {/* PAGE 3: TRENDS (With Explanations) */}
              <div ref={trendsRef} className="w-full h-full flex-shrink-0 p-6 md:p-8 bg-[#020617] flex flex-col overflow-y-auto custom-scrollbar">
                
                {/* 1. Growth Graph */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-cyan-400" />
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.section_growth}</h3>
                    </div>
                    {/* Insight Text */}
                    <span className="text-[10px] text-cyan-500/80 font-bold bg-cyan-900/20 px-2 py-0.5 rounded">
                       {growthData.length > 1 && growthData[growthData.length-1].score > growthData[growthData.length-2].score 
                         ? (language === 'ko' ? "상승세 ▲" : "Rising ▲") 
                         : (language === 'ko' ? "변동 없음 -" : "Stable -")}
                    </span>
                  </div>
                  
                  <div className="w-full h-32 bg-slate-900/50 rounded-xl border border-slate-800 p-2 relative">
                    <div className="absolute top-2 right-2 text-[9px] text-slate-600 pointer-events-none">Last 10 Attempts</div>
                    {growthData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthData}>
                          <Line type="monotone" name={introT.human_label} dataKey="score" stroke="#22d3ee" strokeWidth={2} dot={{r: 2}} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} itemStyle={{ color: '#22d3ee' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-xs text-slate-600">Not enough data</div>}
                  </div>
                </div>

                {/* 2. Gap Insight (Replaces Area Chart) */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-rose-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.section_gap}</h3>
                  </div>
                  
                  {/* Simplified Card */}
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                     <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t.label_gap_avg}</div>
                        <div className="text-xl font-bold text-white flex items-baseline gap-1">
                           {gap > 0 ? `-${gap}` : `+${Math.abs(gap)}`} <span className="text-xs font-normal text-slate-500">pts</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className={`text-xs font-bold ${gap <= 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {gapText}
                        </div>
                     </div>
                  </div>
                </div>

                {/* 3. Weakness Analysis */}
                <div className="mt-auto">
                   <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-amber-400" />
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.section_weakness}</h3>
                   </div>
                   <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 bg-amber-500 blur-2xl rounded-full"></div>
                      <div className="relative z-10 flex gap-4 items-start">
                         <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-amber-500 shrink-0">
                            {hasEnoughData ? getTopicIcon(weakestTopicId) : <Brain size={20} />}
                         </div>
                         <div>
                            {hasEnoughData ? (
                              <>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">{t.msg_weakness}</div>
                                <div className="text-lg font-black text-white mb-2">{weaknessLabel}</div>
                                <p className="text-xs text-slate-400 leading-relaxed italic border-t border-slate-800 pt-2">"{t.msg_advice}"</p>
                              </>
                            ) : <div className="flex h-full items-center text-xs text-slate-500">Play more rounds to unlock personalized weakness analysis.</div>}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0 flex flex-col gap-3 z-20">
           <div className="flex justify-center mb-1">
              <div className="bg-slate-800 p-1 rounded-full flex gap-1">
                 {/* Reused navigation buttons */}
                 {[{id: 0, l: t.page_summary}, {id: 1, l: t.page_details}, {id: 2, l: t.page_trends}].map(page => (
                    <button key={page.id} onClick={() => setCurrentPage(page.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currentPage === page.id ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                       {page.l}
                    </button>
                 ))}
              </div>
           </div>

           {remainingTopics > 0 ? (
             <Button onClick={onNextTopic} fullWidth className="py-3 text-sm shadow-xl shadow-cyan-500/20 animate-pulse">
                {t.btn_next_topic} {nextTopicName} <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">{remainingTopics} Left</span> <ArrowRight size={16} />
             </Button>
           ) : (
             <div className="grid grid-cols-2 gap-3">
                <Button onClick={onRestart} variant="outline" className="text-sm py-3"><RefreshCw size={16} /> {t.btn_retry}</Button>
                <Button onClick={() => setShowShareMenu(true)} variant="primary" className="text-sm py-3 shadow-cyan-500/20"><Share2 size={16} /> {t.btn_share}</Button>
             </div>
           )}
        </div>
      </div>

      {/* SHARE MENU & MODALS (Kept same logic, just re-rendering) */}
      {showShareMenu && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
              <h3 className="text-lg font-bold text-white text-center mb-4">{t.btn_share}</h3>
              {isGeneratingShare ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="animate-spin text-cyan-400 mb-2" />
                  <span className="text-xs text-slate-400">Generating snapshots...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => performNativeShare('instagram')} className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-xl hover:bg-slate-700 gap-2"><Instagram size={24} className="text-rose-500" /><span className="text-xs font-bold text-slate-300">Instagram</span></button>
                   <button onClick={() => performNativeShare('twitter')} className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-xl hover:bg-slate-700 gap-2"><Twitter size={24} className="text-sky-400" /><span className="text-xs font-bold text-slate-300">X / Twitter</span></button>
                   <button onClick={localizedMessenger.action} className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-xl hover:bg-slate-700 gap-2">{localizedMessenger.icon}<span className="text-xs font-bold text-slate-300">{localizedMessenger.label}</span></button>
                   <button onClick={handleSaveAllImages} className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-xl hover:bg-slate-700 gap-2"><Download size={24} className="text-emerald-400" /><span className="text-xs font-bold text-slate-300">{t.btn_save} All</span></button>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-2">
                 <div className="bg-slate-800/50 p-2 rounded text-center">
                    <button onClick={handleCopyLink} className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 w-full"><LinkIcon size={12} /> Copy Link</button>
                 </div>
                 <Button onClick={() => setShowShareMenu(false)} fullWidth variant="secondary" className="py-2 text-sm">{commonT.close}</Button>
              </div>
           </div>
        </div>
      )}

      {/* DETAIL POPUP MODAL (Simplified render) */}
      {selectedResultForPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-lg max-h-[90%] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
              <div className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                       {getTopicIcon(selectedResultForPopup.id)} 
                       <span className="text-xs md:text-sm text-slate-300 font-bold">{selectedResultForPopup.title}</span>
                    </h3>
                 </div>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-4 space-y-4">
                 {selectedResultForPopup.details.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.popup_question} {idx + 1}</span>
                          {item.isCorrect ? <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={12}/> Correct</span> : <span className="text-xs font-bold text-rose-500 flex items-center gap-1"><XCircle size={12}/> Missed</span>}
                       </div>
                       <h4 className="text-sm font-bold text-white mb-2 leading-snug">{item.questionText}</h4>
                       <div className="grid grid-cols-1 gap-2 mb-3">
                           <div className={`text-xs p-2 rounded border ${item.isCorrect ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'}`}><span className="font-bold block opacity-70 mb-0.5">{t.popup_your_answer}:</span>{item.selectedOption}</div>
                           {!item.isCorrect && <div className="text-xs p-2 rounded border bg-cyan-950/30 border-cyan-500/30 text-cyan-300"><span className="font-bold block opacity-70 mb-0.5">{t.popup_correct_answer}:</span>{item.correctAnswer || item.correctFact}</div>}
                       </div>
                       <div className="text-xs pt-3 border-t border-slate-800/50">
                          <span className="text-slate-500 font-bold block mb-1">{t.popup_ai_comment}:</span>
                          <p className="text-slate-400 italic">"{item.aiComment}"</p>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-4 border-t border-slate-700 bg-slate-900 shrink-0">
                 <Button onClick={() => setSelectedResultForPopup(null)} fullWidth variant="secondary" className="py-1.5 text-sm h-8 md:h-10">{commonT.close}</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
