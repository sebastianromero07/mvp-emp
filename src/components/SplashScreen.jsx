import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRight, Sparkles } from 'lucide-react';

export function SplashScreen({ onComplete }) {
  // 'INTRO' (Netflix Ta-dum sequence) -> 'BLUR_PROMPT' (Blurred screen with "Continuar" button)
  const [phase, setPhase] = useState('INTRO');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Synthesize iconic cinematic "Ta-dum" sound
    const playTaDum = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // 1st note: Low impact cinematic bass "Ta"
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(85, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.38);

        gain1.gain.setValueAtTime(0.65, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.45);

        // 2nd note: Resonant chord swell "DUM"
        setTimeout(() => {
          try {
            const chordFreqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
            chordFreqs.forEach((freq) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, ctx.currentTime);

              gain.gain.setValueAtTime(0.18, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.25);

              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 1.3);
            });
          } catch {}
        }, 110);
      } catch {
        // Silently ignore if browser policies restrict unprompted audio
      }
    };

    playTaDum();

    // 2. Advance from Netflix Intro to the Blurred Prompt Screen after 2.4s
    const timer = setTimeout(() => {
      setPhase('BLUR_PROMPT');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-400 select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ======================================================== */}
      {/* STAGE 1: NETFLIX-STYLE CINEMATIC INTRO ("BOLSILLO")      */}
      {/* ======================================================== */}
      {phase === 'INTRO' && (
        <div className="absolute inset-0 bg-[#030611] flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle Skip button in corner */}
          <button
            type="button"
            onClick={() => setPhase('BLUR_PROMPT')}
            className="absolute top-5 right-5 text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 z-30 transition-colors"
          >
            Saltar
          </button>

          {/* Deep radial background ambient glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-600/25 blur-[100px] pointer-events-none animate-pulse" />

          {/* Animated Spectrum Vertical Ribbons (Netflix signature lines) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div
              className="w-1.5 h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent mx-3"
              style={{ animation: 'netflixLightRay 2.1s ease-out forwards' }}
            />
            <div
              className="w-1.5 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent mx-2"
              style={{ animation: 'netflixLightRay 2.1s ease-out 0.15s forwards' }}
            />
            <div
              className="w-1.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent mx-4"
              style={{ animation: 'netflixLightRay 2.1s ease-out 0.08s forwards' }}
            />
          </div>

          {/* Center Title: "BOLSILLO" zooming in with luminous glow */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            <div
              className="relative"
              style={{ animation: 'netflixZoomIn 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-[0_0_45px_rgba(99,102,241,0.9)]"
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  letterSpacing: '0.3em',
                  animation: 'netflixPulseGlow 2s ease-in-out infinite',
                }}
              >
                BOLSILLO
              </h1>

              {/* Horizontal lens sweep streak */}
              <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse" />
            </div>

            <span className="text-xs uppercase tracking-[0.4em] text-indigo-300/80 font-bold mt-4 opacity-80 animate-fade-in">
              Estancos Financieros
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: BLURRED FROSTED SCREEN WITH "CONTINUAR" BUTTON  */}
      {/* ======================================================== */}
      {phase === 'BLUR_PROMPT' && (
        <div className="absolute inset-0 backdrop-blur-2xl bg-slate-950/75 flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
          {/* Subtle ambient lighting */}
          <div className="absolute w-80 h-80 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />

          {/* Center Card */}
          <div className="relative z-10 max-w-sm w-full flex flex-col items-center">
            {/* Wallet Brand Icon with glowing ring */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-2xl shadow-indigo-500/40 mb-5 animate-scale-up">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-indigo-400">
                <Wallet className="w-9 h-9 text-indigo-400" />
              </div>
            </div>

            {/* Brand Title & Description */}
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Bolsillo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs leading-relaxed mb-8">
              Tu billetera inteligente con control por espacios estancos y metas financieras.
            </p>

            {/* Center "Continuar" Button requested by user */}
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-indigo-600/40 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Continuar</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <span className="text-[11px] text-slate-400 font-medium mt-4">
              Toca para ingresar a tu billetera
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

