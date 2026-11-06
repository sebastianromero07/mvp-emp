import React, { useState } from 'react';
import { X, Sprout, PlayCircle, Sparkles, AlertCircle, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function ResetModeModal({
  isOpen,
  onClose,
  onSelectSeedMode,
  onSelectDemoMode,
  currentMode = 'demo',
  seedBalance = 2270,
}) {
  const [customBalance, setCustomBalance] = useState(String(seedBalance || 2270));

  if (!isOpen) return null;

  const handleStartSeed = () => {
    const amount = parseFloat(customBalance);
    onSelectSeedMode(!isNaN(amount) && amount > 0 ? amount : 2270);
    onClose();
  };

  const handleStartDemo = () => {
    onSelectDemoMode();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-white"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
            Configuración de inicio
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Elige el Modo de la App
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Selecciona si deseas empezar en blanco o con datos de demostración
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* OPTION 1: Modo Semilla */}
          <div className="relative rounded-2xl border-2 border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 p-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Modo Semilla (Desde Cero)
                  </h3>
                  {currentMode === 'seed' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Comienza con <strong>0 bolsillos</strong> y solo tu <strong>Saldo Total Disponible</strong>. Al crear bolsillos y asignarles presupuesto, se irá restando de este saldo.
                </p>

                {/* Input for initial seed balance */}
                <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between gap-3">
                  <label htmlFor="seed-amount" className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Saldo Total inicial:
                  </label>
                  <div className="relative w-32">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                      $
                    </span>
                    <input
                      id="seed-amount"
                      type="number"
                      value={customBalance}
                      onChange={(e) => setCustomBalance(e.target.value)}
                      placeholder="2270"
                      className="w-full pl-6 pr-2.5 py-1 text-xs font-mono font-black rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartSeed}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Iniciar Modo Semilla (Desde Cero)</span>
                </button>
              </div>
            </div>
          </div>

          {/* OPTION 2: Modo Demo */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-950 p-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <PlayCircle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Modo Demo (Demostración)
                  </h3>
                  {currentMode === 'demo' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Carga los 5 bolsillos de prueba (Alimentación, Transporte, Entretenimiento, Viajes, Emergencias), movimientos y metas listas para interactuar.
                </p>

                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Cargar Modo Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

