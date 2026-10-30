import React from 'react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { Plus, ChevronRight } from 'lucide-react';

export function PocketCard({ stats, onSelectPocket, onOpenExpenseModal }) {
  const {
    category,
    budget,
    spent,
    available,
    spentPercent,
    remainingPercent,
    isOutOfFunds,
    isLowFunds,
  } = stats;

  const { theme } = category;

  // Visual styling rules:
  // 1. isOutOfFunds (<= 0): Tarjeta roja con advertencia clara "Espacio sin fondos"
  // 2. isLowFunds (< 15%): Barra amarilla y aviso
  // 3. Normal: Color característico de la categoría
  let cardBorder = 'border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-slate-600 shadow-xs dark:shadow-none';
  let cardBg = 'bg-white dark:bg-slate-900/70';
  let progressColor = theme.progress;
  let glowEffect = '';

  if (isOutOfFunds) {
    cardBorder = 'border-rose-300 dark:border-rose-500/80 ring-1 ring-rose-400/40 dark:ring-rose-500/50 shadow-md shadow-rose-500/10 dark:shadow-rose-950/60';
    cardBg = 'bg-rose-50/70 dark:bg-gradient-to-br dark:from-rose-950/70 dark:via-slate-900/90 dark:to-rose-950/50';
    progressColor = 'bg-rose-500';
    glowEffect = 'animate-pulse';
  } else if (isLowFunds) {
    cardBorder = 'border-amber-300/80 dark:border-amber-500/50 ring-1 ring-amber-400/30 dark:ring-amber-500/30 shadow-xs dark:shadow-amber-950/40';
    cardBg = 'bg-amber-50/50 dark:bg-gradient-to-br dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/90';
    progressColor = 'bg-amber-500 dark:bg-amber-400';
  }

  return (
    <div
      onClick={() => onSelectPocket && onSelectPocket(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelectPocket && onSelectPocket(category.id);
        }
      }}
      className={`group relative rounded-2xl p-3 sm:p-4 transition-all duration-200 cursor-pointer text-left active:scale-[0.98] border backdrop-blur-xl flex flex-col justify-between ${cardBorder} ${cardBg}`}
    >
      {/* Top row: Icon, Category Name, and Top-Right '+' button specifically for manual expense */}
      <div className="flex items-start justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
            isOutOfFunds ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' : `${theme.bgLight} ${theme.text}`
          }`}>
            <CategoryIcon iconName={category.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {category.name}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-medium">
              Ppto: {formatCurrency(budget)}
            </span>
          </div>
        </div>

        {/* Top-Right: dedicated '+' button to register expense */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenExpenseModal && onOpenExpenseModal(category.id);
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-all duration-150 active:scale-90 shadow-xs border border-slate-200 dark:border-slate-700 shrink-0 group/plus"
          title={`Registrar gasto en ${category.name}`}
          aria-label={`Registrar gasto en ${category.name}`}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/plus:rotate-90 duration-200" />
        </button>
      </div>

      {/* Center: Available Balance */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>Saldo Disponible</span>
          {isOutOfFunds ? (
            <span className="text-rose-600 dark:text-rose-400 font-bold normal-case tracking-normal">Sin fondos</span>
          ) : isLowFunds ? (
            <span className="text-amber-600 dark:text-amber-400 font-bold normal-case tracking-normal">&lt;15%</span>
          ) : null}
        </div>
        <div className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-0.5 mt-0.5">
          <span className={`text-base sm:text-xl font-extrabold tracking-tight font-mono truncate ${
            isOutOfFunds ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
          }`}>
            {formatCurrency(available)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Gasto: <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{formatCurrency(spent)}</span>
          </span>
        </div>

        {isOutOfFunds && available < 0 && (
          <div className="text-[9px] font-semibold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
            ⚠️ Sobregiro: -{formatCurrency(Math.abs(available))}
          </div>
        )}
      </div>

      {/* Bottom: Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
          <span>Uso</span>
          <span className={isOutOfFunds ? 'text-rose-600 dark:text-rose-400 font-bold' : isLowFunds ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-600 dark:text-slate-300'}>
            {spentPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Tap hint to enter dedicated space */}
      <div className="mt-2 flex items-center justify-end gap-0.5 text-right">
        <span className="text-[9px] text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium">
          Ver detalle y gráfico
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
      </div>
    </div>
  );
}
