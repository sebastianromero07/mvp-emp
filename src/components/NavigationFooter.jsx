import React from 'react';
import { Wallet, BarChart3, Target } from 'lucide-react';

export function NavigationFooter({ activeTab, onSelectTab, transactionCount, goalCount }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200/90 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-2xl safe-area-bottom transition-colors"
    >
      <div className="max-w-lg mx-auto px-6 h-16 sm:h-18 flex items-center justify-between relative">
        
        {/* Left Section: Reporte */}
        <button
          onClick={() => onSelectTab('reporte')}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 ${
            activeTab === 'reporte'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
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
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 absolute -bottom-1" />
          )}
        </button>

        {/* Center Section: Circular Floating Icon (SIN TEXTO BILLETERA) */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => onSelectTab('billetera')}
            className={`-top-5 sm:-top-6 absolute w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-600/35 ring-4 ring-slate-100 dark:ring-[#070a12] active:scale-95 transition-all flex items-center justify-center group ${
              activeTab === 'billetera' ? 'ring-indigo-500/50 scale-105' : 'hover:scale-105'
            }`}
            aria-label="Ir a Inicio"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white">
              <Wallet className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110" />
            </div>
          </button>
        </div>

        {/* Right Section: Objetivos */}
        <button
          onClick={() => onSelectTab('objetivos')}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 ${
            activeTab === 'objetivos'
              ? 'text-violet-600 dark:text-violet-400 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-label="Ir a Objetivos"
        >
          <div className="relative">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            {goalCount > 0 && (
              <span className="w-2 h-2 rounded-full absolute -top-0.5 -right-1 ring-2 ring-white dark:ring-slate-950 bg-violet-500 dark:bg-violet-400" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">
            Objetivos
          </span>
          {activeTab === 'objetivos' && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 absolute -bottom-1" />
          )}
        </button>

      </div>
    </nav>
  );
}
