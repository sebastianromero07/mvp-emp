import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  MousePointerClick,
  HelpCircle,
  TrendingUp,
  QrCode,
  Wallet,
  Target
} from 'lucide-react';

export function AppWalkthrough({ isOpen, onClose, onNavigateToTab, hasPockets = true }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const resizeObserverRef = useRef(null);

  const steps = hasPockets
    ? [
        {
          id: 'balance',
          selector: '[data-tour="balance"]',
          title: '1. Saldo Total Disponible',
          subtitle: 'Tu capital del mes',
          content: 'Cada bolsillo que crees se restará de este saldo.',
          hint: 'Revísalo antes de repartir tu dinero.',
          icon: Wallet,
          color: 'indigo',
          actionText: 'Siguiente'
        },
        {
          id: 'pocket-card',
          selector: '[data-tour="pocket-card"]',
          title: '2. Tus Bolsillos',
          subtitle: 'Dinero separado por categoría',
          content: 'Toca cualquier tarjeta para ver su historial y gráfico diario.',
          hint: 'Cada bolsillo es independiente y no se mezcla.',
          icon: Target,
          color: 'purple',
          actionText: 'Siguiente'
        },
        {
          id: 'qr-button',
          selector: '[data-tour="qr-button"]',
          title: '3. Pagar con QR',
          subtitle: 'Pago directo desde tu bolsillo',
          content: 'Escanea un QR y descuenta el gasto solo de este bolsillo.',
          hint: 'Toca el ícono QR para pagar al instante.',
          icon: QrCode,
          color: 'cyan',
          actionText: 'Siguiente'
        },
        {
          id: 'create-pocket',
          selector: '[data-tour="create-pocket"]',
          title: '4. Crear Bolsillo',
          subtitle: 'Nuevas categorías a tu medida',
          content: 'Crea un bolsillo con su presupuesto y se restará de tu Saldo Total.',
          hint: 'Pulsa aquí para añadir un bolsillo.',
          icon: Sparkles,
          color: 'indigo',
          actionText: 'Siguiente'
        },
        {
          id: 'nav-goals',
          selector: '[data-tour="nav-goals"]',
          title: '5. Objetivos',
          subtitle: 'Ahorra e invierte con metas claras',
          content: 'Fija tus metas y elige cómo hacer crecer tu dinero.',
          hint: 'Toca Objetivos para empezar.',
          icon: TrendingUp,
          color: 'emerald',
          actionText: '¡Empezar!'
        }
      ]
    : [
        {
          id: 'balance',
          selector: '[data-tour="balance"]',
          title: '1. Saldo Total Disponible',
          subtitle: 'Tu capital inicial',
          content: 'Cada bolsillo que crees se restará de este monto.',
          hint: 'Este es tu pozo disponible para repartir.',
          icon: Wallet,
          color: 'indigo',
          actionText: 'Siguiente'
        },
        {
          id: 'create-pocket',
          selector: '[data-tour="create-pocket"]',
          title: '2. Crea tu Primer Bolsillo',
          subtitle: 'Organiza tu dinero por categoría',
          content: 'Asigna un presupuesto y se descontará de tu Saldo Total.',
          hint: 'Pulsa aquí para empezar.',
          icon: Sparkles,
          color: 'indigo',
          actionText: 'Siguiente'
        },
        {
          id: 'nav-goals',
          selector: '[data-tour="nav-goals"]',
          title: '3. Objetivos',
          subtitle: 'Haz crecer tus ahorros',
          content: 'Crea metas y elige el instrumento financiero ideal para ti.',
          hint: 'Toca Objetivos para ver tus opciones.',
          icon: TrendingUp,
          color: 'emerald',
          actionText: '¡Empezar!'
        }
      ];

  const step = steps[currentStepIndex] || steps[0];
  const isLast = currentStepIndex === steps.length - 1;

  // Update target element coordinates
  const updateTargetPosition = () => {
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      });
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setTargetRect(null);
      return;
    }

    if (step?.id === 'nav-goals') {
      if (onNavigateToTab) onNavigateToTab('billetera');
    }

    const timer = setTimeout(() => {
      updateTargetPosition();
    }, 180);

    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen, currentStepIndex, step?.id]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const IconComp = step.icon || Sparkles;
  const isTargetInLowerHalf =
    targetRect &&
    typeof window !== 'undefined' &&
    targetRect.top + targetRect.height / 2 > window.innerHeight * 0.5;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto animate-fade-in select-none">
      {/* Dark overlay with cut-out / spotlight effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300">
        <defs>
          <mask id="spotlight-mask">
            {/* White background means fully opaque / dark mask */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black rectangle punches a hole around the target element */}
            {targetRect && (
              <rect
                x={Math.max(4, targetRect.left - 8)}
                y={Math.max(4, targetRect.top - 8)}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="24"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* Shaded backdrop with mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(5, 7, 15, 0.88)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Animated Glowing Ring around target element */}
      {targetRect && (
        <div
          style={{
            top: `${Math.max(4, targetRect.top - 8)}px`,
            left: `${Math.max(4, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
          className="absolute rounded-[24px] pointer-events-none ring-4 ring-indigo-500 ring-offset-2 ring-offset-transparent shadow-[0_0_35px_rgba(99,102,241,0.6)] animate-pulse transition-all duration-300 z-10"
        />
      )}

      {/* Tour Step Card - Positioned away from the highlighted element */}
      <div
        className={`absolute inset-x-3 ${
          isTargetInLowerHalf ? 'top-6 sm:top-10' : 'bottom-6 sm:bottom-10'
        } sm:max-w-md sm:mx-auto z-20 transition-all duration-300`}
      >
        <div className="rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 text-white backdrop-blur-xl relative overflow-hidden">
          {/* Subtle neon glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header row: Step pill & Close */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Paso {currentStepIndex + 1} de {steps.length}
              </span>
              <span className="text-[11px] text-slate-400 font-bold">Guía interactiva</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Cerrar guía"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Title & Subtitle */}
          <div className="flex items-start gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                {step.title}
              </h3>
              <p className="text-xs font-semibold text-indigo-300">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Content Description */}
          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-3">
            {step.content}
          </p>

          {/* Action Hint: ¿Cuál aplastar primero? */}
          <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-2 mb-4">
            <MousePointerClick className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <p className="text-[11px] text-amber-200/90 font-medium leading-tight">
              {step.hint}
            </p>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex ? 'w-5 bg-indigo-500' : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atrás</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{step.actionText || (isLast ? 'Entendido' : 'Siguiente')}</span>
                {isLast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
