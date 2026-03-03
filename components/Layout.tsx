import React from 'react';
import { Language } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
  onHome?: () => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onHome, onTouchStart, onTouchEnd }) => {
  return (
    /* 
      h-[100dvh]: Dynamic Viewport Height
    */
    <div 
      className="relative h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2000&auto=format&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full h-full max-w-2xl mx-auto">
        {/* Header - Padding Reduced by ~50% */}
        <header 
          onClick={onHome}
          className={`shrink-0 w-full flex flex-col items-center pt-8 pb-2 md:pt-12 md:pb-4 select-none z-20 ${onHome ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        >
            <div className="relative flex items-center justify-center gap-3 md:gap-8 scale-75 md:scale-90 origin-top">
              
              {/* AI (Left) */}
              <div className="group relative">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] tracking-widest font-mono transition-transform group-hover:-translate-y-1 duration-500">
                  AI
                </h1>
                <div className="absolute -top-3 -right-3 w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>

              {/* VS Badge */}
              <div className="relative z-10">
                <div className="absolute inset-0 bg-rose-500 blur-lg opacity-20 animate-pulse"></div>
                <div className="bg-slate-900 border border-slate-700 text-slate-300 text-sm md:text-xl font-black italic px-3 py-2 rounded-xl shadow-2xl transform -skew-x-12 hover:skew-x-0 hover:scale-110 hover:text-white hover:border-rose-500 transition-all duration-300 cursor-default">
                   <span className="block transform skew-x-12">VS</span>
                </div>
              </div>

              {/* HUMAN (Right) */}
              <div className="group relative">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400 drop-shadow-lg tracking-tighter transition-transform group-hover:-translate-y-1 duration-500">
                  HUMAN
                </h1>
                <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
              </div>

            </div>
        </header>
          
        {/* Main - Bottom Padding Reduced */}
        <main className="flex-grow w-full relative px-4 pb-6 md:pb-8 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};