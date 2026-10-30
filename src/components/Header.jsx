import React from 'react';
import { Wallet, SlidersHorizontal, RotateCcw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Header({ onOpenConfig, onResetDemo }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 pt-3 pb-3 px-3.5 sm:px-4 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 transition-colors shadow-xs dark:shadow-none">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Bolsillos
            </h1>
            <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              MVP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 active:scale-95 transition-all text-xs flex items-center justify-center"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={onResetDemo}
            title="Restablecer datos demo iniciales"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all text-xs flex items-center gap-1.5 font-medium"
            aria-label="Restablecer datos demo"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden xs:inline text-[11px]">Demo</span>
          </button>

          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            aria-label="Configurar Presupuestos"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Presupuestos</span>
          </button>
        </div>
      </div>
    </header>
  );
}
