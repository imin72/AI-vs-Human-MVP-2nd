
import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Activity, Binary, Wifi } from 'lucide-react';

interface LoadingViewProps {
  text: string;
  logs?: string[];
  syncText?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ text, logs, syncText = "SYNCHRONIZING..." }) => {
  const [progress, setProgress] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  
  // Default logs if none provided
  const DEFAULT_LOGS = [
    "INITIALIZING_NEURAL_NET...",
    "HANDSHAKE_PROTOCOL: [SECURE]",
    "ACCESSING_GLOBAL_DATABASE...",
    "LOADING_TOPIC_VECTORS...",
    "CALIBRATING_DIFFICULTY_MATRIX...",
    "SYNCHRONIZING_WAVEFORMS...",
    "ALLOCATING_VIRTUAL_NEURONS...",
    "READY_TO_ENGAGE."
  ];

  const targetLogs = logs && logs.length > 0 ? logs : DEFAULT_LOGS;

  useEffect(() => {
    // 1. Progress Bar Simulation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Random increment for realistic "loading" feel
        const inc = Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + inc, 99);
      });
    }, 50);

    // 2. Terminal Log Simulation
    let logIndex = 0;
    const logTimer = setInterval(() => {
      if (logIndex < targetLogs.length) {
        setDisplayedLogs(prev => [...prev, targetLogs[logIndex]].slice(-6)); // Keep last 6 logs
        logIndex++;
      }
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, [targetLogs]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80 z-0"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-8">
        
        {/* Central AI Core Animation */}
        <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
          {/* Rotating Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-slate-800 border-b-cyan-400 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 rounded-full border border-slate-800 border-l-rose-500 animate-pulse"></div>
          
          {/* Inner Core */}
          <div className="relative z-10 bg-slate-950 p-4 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
             <Cpu size={48} className="text-cyan-400 animate-pulse" />
          </div>

          {/* Glitch Particles */}
          <div className="absolute top-0 right-0 text-cyan-500/50 animate-ping">
            <Binary size={12} />
          </div>
          <div className="absolute bottom-2 left-2 text-rose-500/50 animate-bounce">
            <Activity size={12} />
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase drop-shadow-lg flex items-center justify-center gap-2">
            <Zap size={20} className="text-yellow-400 fill-yellow-400" />
            {text}
          </h2>
          <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-sm">
             <Wifi size={14} className="animate-pulse" />
             <span>{syncText} {progress}%</span>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6 border border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Terminal Logs - Increased Height and Font Size */}
        <div className="w-full bg-black/50 border border-slate-800 rounded-lg p-4 font-mono text-xs md:text-sm h-40 flex flex-col justify-end shadow-inner">
           {displayedLogs.map((log, idx) => (
             <div key={idx} className="text-green-500/80 leading-snug truncate">
               <span className="opacity-50 mr-2">{`>`}</span>
               {log}
             </div>
           ))}
           <div className="text-green-400 animate-pulse mt-1">_</div>
        </div>

      </div>
    </div>
  );
};
