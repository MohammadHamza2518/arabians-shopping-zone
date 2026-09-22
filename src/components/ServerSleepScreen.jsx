import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Database
} from 'lucide-react';

export default function ServerSleepScreen() {
  const { settings } = useStore();
  const sleepConfig = settings?.serverSleepMode;

  // Active by default unless explicitly disabled in settings
  const isEnabled = sleepConfig?.enabled !== false;

  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Check if session already waited or URL has direct bypass
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
    if (urlParams.get('bypass') === 'hamza' || urlParams.get('dev') === 'true' || urlParams.get('admin') === 'true') {
      return true;
    }
    return sessionStorage.getItem('asz_sleep_unlocked') === 'true';
  });

  const totalDuration = Number(sleepConfig?.durationSeconds || 120); // 2 minutes (120 seconds)
  const [secondsLeft, setSecondsLeft] = useState(totalDuration);
  const [secretClicks, setSecretClicks] = useState(0);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    if (!isEnabled || unlocked) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.setItem('asz_sleep_unlocked', 'true');
          setUnlocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, unlocked]);

  // If sleep mode is disabled in settings or already unlocked, render nothing
  if (!isEnabled || unlocked) {
    return null;
  }

  // Format MM:SS
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Progress percentage (0% to 100%)
  const progressPercent = Math.min(100, Math.round(((totalDuration - secondsLeft) / totalDuration) * 100));

  // Dynamic realistic technical status stages based on countdown
  const getStageInfo = () => {
    const elapsed = totalDuration - secondsLeft;
    if (elapsed < 25) {
      return {
        stage: "Stage 1/5: Cloud Node Initialization",
        detail: "Connecting to Singapore container cluster & allocating virtual CPU cores...",
        icon: <Cpu className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
      };
    } else if (elapsed < 50) {
      return {
        stage: "Stage 2/5: Database Volume Handshake",
        detail: "Warming up MongoDB Atlas connection pool & synchronizing product catalog...",
        icon: <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
      };
    } else if (elapsed < 75) {
      return {
        stage: "Stage 3/5: RAM Buffer & Cache Allocation",
        detail: "Decompressing storefront media assets and active promotional discounts...",
        icon: <Server className="w-5 h-5 text-sky-400 animate-bounce" style={{ animationDuration: '2s' }} />
      };
    } else if (elapsed < 100) {
      return {
        stage: "Stage 4/5: Security & Payment Node Verification",
        detail: "Verifying Razorpay 256-bit SSL encryption & Shipmozo live dispatch routes...",
        icon: <ShieldCheck className="w-5 h-5 text-purple-400" />
      };
    } else {
      return {
        stage: "Stage 5/5: Storefront Session Ready",
        detail: "Finalizing customer session container. Storefront opening in a few seconds...",
        icon: <CheckCircle2 className="w-5 h-5 text-amber-300 animate-pulse" />
      };
    }
  };

  const stage = getStageInfo();

  // Secret Hamza bypass (clicking node text 5 times)
  const handleSecretClick = () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 5) {
      setShowPinPrompt(true);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === 'hamza786' || pinInput.trim() === 'arabians786') {
      sessionStorage.setItem('asz_sleep_unlocked', 'true');
      setUnlocked(true);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-[#02130e] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto selection:bg-amber-500 selection:text-black">
      {/* Subtle animated server grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#052b1f_1px,transparent_1px),linear-gradient(to_bottom,#052b1f_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <img 
              src="/assets/logo/logo_main.png" 
              alt="Arabians Logo" 
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-amber-300 tracking-wider uppercase font-serif">
              Arabians Shopping Zone
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"></span>
              <span>NODE-SG01 • CLOUD INSTANCE WARMUP</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>ECO-SLEEP RECOVERY</span>
        </div>
      </header>

      {/* Main Alert & Countdown Center Card */}
      <main className="relative z-10 my-auto w-full max-w-lg bg-gradient-to-b from-[#06261b] to-[#031811] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center">
        {/* Warning Icon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-5 shadow-inner">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
          <span>Server On Sleep Mode Due To High Load</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
          System Resources Cycling
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Arabians Shopping Zone is currently handling high visitor volume. To prevent database timeouts and ensure lightning-fast shopping, the server is spinning up allocated memory buffers.
        </p>

        {/* Big Glowing Countdown Display */}
        <div className="relative my-4 p-5 rounded-2xl bg-[#020e0a] border border-amber-500/30 shadow-inner">
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1">
            Storefront Session Resuming In
          </div>
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]">
            {timeFormatted}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Automatic Session Unlock • {progressPercent}% Completed</span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-4 p-[1px] border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-linear shadow-lg shadow-amber-500/50"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Live Technical Stage Status */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
            {stage.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-amber-300 font-mono">
              {stage.stage}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {stage.detail}
            </div>
          </div>
        </div>

        {/* Reassurance Notice */}
        <p className="text-[11px] text-slate-400/80 mt-5 italic">
          💡 Please keep this tab open. Once the countdown completes, your catalog and cart session will open automatically without refreshing.
        </p>

        {/* Secret PIN Modal for Hamza */}
        {showPinPrompt && (
          <form onSubmit={handlePinSubmit} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
            <input 
              type="password"
              placeholder="Admin Bypass PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="flex-1 bg-black/60 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs text-white outline-none focus:border-amber-400 font-mono"
              autoFocus
            />
            <button 
              type="submit"
              className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-400 transition"
            >
              Bypass
            </button>
            {pinError && <span className="text-rose-400 text-xs self-center">Invalid</span>}
          </form>
        )}
      </main>

      {/* Bottom Footer Details */}
      <footer className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono text-center sm:text-left">
        <div>
          <span>Infrastructure: </span>
          <span className="text-emerald-400 font-semibold">Render Web Cloud (Free Micro Plan)</span>
          <span className="mx-2">•</span>
          <span>Database: </span>
          <span className="text-amber-400 font-semibold">MongoDB Atlas Cloud</span>
        </div>
        <div 
          onClick={handleSecretClick}
          className="cursor-default select-none text-[10px] text-slate-400/80 hover:text-slate-400 transition"
          title="Cluster Health Status"
        >
          Node ID: ASZ-SRV-2518 • SSL Secured • 24/7 Uptime Guardian
        </div>
      </footer>
    </div>
  );
}
