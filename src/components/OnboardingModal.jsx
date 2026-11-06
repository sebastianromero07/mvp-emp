import React, { useState } from 'react';
import {
  Wallet,
  QrCode,
  Target,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

const ONBOARDING_SLIDES = [
  {
    id: 'bolsillos-estancos',
    badge: 'TRANQUILIDAD MENSUAL',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    title: 'Tu dinero en su lugar. Llega a fin de mes sin sorpresas.',
    tagline: 'Separa lo que puedes gastar en bolsillos independientes. Nunca mezcles tus salidas con tu comida.',
    pill: 'Bolsillos 100% blindados',
    icon: Wallet,
    iconColor: 'from-indigo-500 to-purple-600',
    glowColor: 'bg-indigo-600/30',
  },
  {
    id: 'pagos-qr',
    badge: 'GASTO CONSCIENTE',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    title: 'Paga con QR sabiendo exactamente de dónde sale.',
    tagline: 'Escanea en segundos estilo Yape con la cámara de tu celular. El cobro descuenta solo del bolsillo elegido.',
    pill: 'Cero compras impulsivas',
    icon: QrCode,
    iconColor: 'from-cyan-500 to-blue-600',
    glowColor: 'bg-cyan-600/30',
  },
  {
    id: 'metas-claras',
    badge: 'AHORRO CON PROPÓSITO',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    title: 'Ahorrar no es guardar sobras, es cumplir tus metas.',
    tagline: 'Ponle rostro a tus sueños con imágenes reales y aportes inmediatos a tu auto, viaje o emergencias.',
    pill: 'Progreso visual de tus metas',
    icon: Target,
    iconColor: 'from-emerald-500 to-teal-600',
    glowColor: 'bg-emerald-600/30',
  },
  {
    id: 'rentabilidad',
    badge: 'CRECIMIENTO REAL',
    badgeColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    title: 'No dejes tu dinero quieto. Ponlo a rentar.',
    tagline: 'Elige la estrategia ideal para cada objetivo: cuentas de alto rendimiento, renta fija, bonos o ETFs.',
    pill: '6 alternativas de rentabilidad',
    icon: TrendingUp,
    iconColor: 'from-violet-500 to-indigo-600',
    glowColor: 'bg-violet-600/30',
  }
];

export function OnboardingModal({ isOpen, onClose, onStartTour }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const slide = ONBOARDING_SLIDES[currentStep];
  const isLast = currentStep === ONBOARDING_SLIDES.length - 1;
  const IconComponent = slide.icon;

  const handleNext = () => {
    if (isLast) {
      if (onStartTour) onStartTour();
      else onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/85 backdrop-blur-2xl animate-fade-in select-none">
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden text-white min-h-[500px]">
        {/* Background Ambient Glow */}
        <div className={`absolute top-0 right-0 w-72 h-72 rounded-full ${slide.glowColor} blur-[90px] pointer-events-none transition-colors duration-500`} />

        {/* Top Bar: Progress Indicator & Skip */}
        <div className="flex items-center justify-between p-5 pb-2 z-10">
          <div className="flex items-center gap-1.5">
            {ONBOARDING_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-7 bg-indigo-500'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Ir al paso ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            Saltar
          </button>
        </div>

        {/* Content Body - Minimal, Direct & High Impact */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 my-auto">
          {/* Main Floating Icon */}
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${slide.iconColor} p-0.5 shadow-2xl shadow-indigo-500/30 mb-5 flex items-center justify-center animate-scale-up`}>
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-white">
              <IconComponent className="w-9 h-9" />
            </div>
          </div>

          {/* Badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border mb-3 ${slide.badgeColor}`}>
            {slide.badge}
          </span>

          {/* Main Headline */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3 max-w-xs sm:max-w-sm">
            {slide.title}
          </h2>

          {/* Short tagline */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mb-5">
            {slide.tagline}
          </p>

          {/* Micro value pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{slide.pill}</span>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center gap-3 z-10 bg-slate-900/90">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
              title="Anterior"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>¡Empezar a Usar!</span>
              </>
            ) : (
              <>
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
