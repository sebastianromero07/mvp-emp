import React from 'react';
import { Wallet, SlidersHorizontal, RotateCcw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Header({ onOpenConfig, onResetDemo }) {
  const { theme, toggleTheme } = useTheme();
  const now = new Date();
  const monthName = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <header className="sticky top-0 z-30 pt-3 pb-3 px-4 glass-panel border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/80 transition-colors">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[14px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-400 dark:text-indigo-400 light:text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white dark:text-white light:text-slate-900">
                Bolsillos
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 dark:text-indigo-300 light:text-indigo-600 border border-indigo-500/30">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
              {formattedMonth} • Presupuesto Estanco
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white active:scale-95 transition-all text-xs"
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
            className="p-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 active:scale-95 transition-all text-xs flex items-center gap-1.5 font-medium"
            aria-label="Restablecer datos demo"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Demo</span>
          </button>

          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            aria-label="Configurar Presupuestos del Mes"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Presupuestos</span>
          </button>
        </div>
      </div>
    </header>
  );
}
