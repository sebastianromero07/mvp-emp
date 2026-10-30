import React from 'react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { AlertOctagon, AlertTriangle } from 'lucide-react';

export function PocketCard({ stats, onSelectForExpense }) {
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
  let cardBorder = 'border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 hover:border-slate-700';
  let cardBg = 'bg-slate-900/60 dark:bg-slate-900/60 light:bg-white';
  let progressColor = theme.progress;
  let glowEffect = '';

  if (isOutOfFunds) {
    cardBorder = 'border-rose-500/80 ring-1 ring-rose-500/50 shadow-lg shadow-rose-950/60';
    cardBg = 'bg-gradient-to-br from-rose-950/70 via-slate-900/90 to-rose-950/50 dark:from-rose-950/70 dark:via-slate-900/90 dark:to-rose-950/50 light:from-rose-50 light:via-white light:to-rose-50';
    progressColor = 'bg-rose-500';
    glowEffect = 'animate-pulse';
  } else if (isLowFunds) {
    cardBorder = 'border-amber-500/50 ring-1 ring-amber-500/30 shadow-md shadow-amber-950/40';
    cardBg = 'bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-900/90 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/90 light:from-amber-50 light:via-white light:to-white';
    progressColor = 'bg-amber-400';
  }

  return (
    <div
      onClick={() => onSelectForExpense && onSelectForExpense(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelectForExpense && onSelectForExpense(category.id);
        }
      }}
      className={`group relative rounded-2xl p-3 sm:p-4 transition-all duration-200 cursor-pointer text-left active:scale-[0.98] border backdrop-blur-xl flex flex-col justify-between ${cardBorder} ${cardBg}`}
    >
      {/* Top row: Icon, Category Name, Status Badge */}
      <div className="flex items-start justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${isOutOfFunds ? 'bg-rose-500/20 text-rose-400' : `${theme.bgLight} ${theme.text}`
            }`}>
            <CategoryIcon iconName={category.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-white dark:text-white light:text-slate-900 tracking-tight truncate leading-tight group-hover:text-indigo-400 transition-colors">
              {category.name}
            </h3>
            <span className="text-[10px] text-slate-400 truncate block">
              Ppto: {formatCurrency(budget)}
            </span>
          </div>
        </div>

        {/* Status badges */}
        <div className="shrink-0">
          {isOutOfFunds ? (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-tight bg-rose-600 text-white shadow-sm shadow-rose-950 ${glowEffect}`}>
              <AlertOctagon className="w-2.5 h-2.5" />
              <span className="hidden xs:inline">Sin fondos</span>
              <span className="xs:hidden">Agotado</span>
            </span>
          ) : isLowFunds ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
              <span>&lt;15%</span>
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${theme.badge}`}>
              <span className={`w-1 h-1 rounded-full ${theme.dot}`} />
              <span>{remainingPercent.toFixed(0)}%</span>
            </span>
          )}
        </div>
      </div>

      {/* Center: Available Balance */}
      <div className="mb-2.5">
        <div className="text-[9px] sm:text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Saldo Disponible
        </div>
        <div className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-0.5 mt-0.5">
          <span className={`text-base sm:text-xl font-extrabold tracking-tight font-mono truncate ${isOutOfFunds ? 'text-rose-400' : 'text-white dark:text-white light:text-slate-900'
            }`}>
            {formatCurrency(available)}
          </span>
          <span className="text-[10px] text-slate-400 truncate">
            Gasto: <span className="text-slate-200 dark:text-slate-200 light:text-slate-700 font-mono font-semibold">{formatCurrency(spent)}</span>
          </span>
        </div>

        {isOutOfFunds && available < 0 && (
          <div className="text-[9px] font-semibold text-rose-400 mt-0.5 truncate">
            ⚠️ Sobregiro: -{formatCurrency(Math.abs(available))}
          </div>
        )}
      </div>

      {/* Bottom: Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-[9px] text-slate-400 mb-1 font-medium">
          <span>Uso</span>
          <span className={isOutOfFunds ? 'text-rose-400 font-bold' : isLowFunds ? 'text-amber-400 font-bold' : 'text-slate-300'}>
            {spentPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Tap hint */}
      <div className="mt-2 text-right">
        <span className="text-[9px] text-slate-400 group-hover:text-slate-300 transition-colors">
          Toca para gastar →
        </span>
      </div>
    </div>
  );
}
