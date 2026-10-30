import React from 'react';
import { Wallet, BarChart3, Target } from 'lucide-react';

export function NavigationFooter({ activeTab, onSelectTab, transactionCount, goalCount }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 dark:bg-slate-950/90 light:bg-white/90 backdrop-blur-2xl border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 shadow-2xl safe-area-bottom"
    >
      <div className="max-w-lg mx-auto px-6 h-16 sm:h-18 flex items-center justify-between relative">
        
        {/* Left Section: Reporte (en vez de Historial) */}
        <button
          onClick={() => onSelectTab('reporte')}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 ${
            activeTab === 'reporte'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-700'
          }`}
          aria-label="Ir a Reporte"
        >
          <div className="relative">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">
            Reporte
          </span>
          {activeTab === 'reporte' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 absolute bottom-0.5" />
          )}
        </button>

        {/* Center Section: Circular Floating Icon (SIN TEXTO BILLETERA) */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => onSelectTab('billetera')}
            className={`-top-5 sm:-top-6 absolute w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-600/40 ring-4 ring-[#070a11] dark:ring-[#070a11] light:ring-white active:scale-95 transition-all flex items-center justify-center group ${
              activeTab === 'billetera' ? 'ring-indigo-500/60 scale-105' : 'hover:scale-105'
            }`}
            aria-label="Ir al inicio"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white">
              <Wallet className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110" />
            </div>
          </button>
        </div>

        {/* Right Section: Objetivos (en vez de Rendimiento) */}
        <button
          onClick={() => onSelectTab('objetivos')}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 ${
            activeTab === 'objetivos'
              ? 'text-violet-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-700'
          }`}
          aria-label="Ir a Objetivos"
        >
          <div className="relative">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            {goalCount > 0 && (
              <span className="w-2 h-2 rounded-full absolute -top-0.5 -right-1 ring-2 ring-slate-950 dark:ring-slate-950 light:ring-white bg-violet-400" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">
            Objetivos
          </span>
          {activeTab === 'objetivos' && (
            <span className="w-1 h-1 rounded-full bg-violet-400 absolute bottom-0.5" />
          )}
        </button>

      </div>
    </nav>
  );
}
