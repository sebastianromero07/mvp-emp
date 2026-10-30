import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { BarChart3, TrendingDown, PieChart, Layers, Calendar, Filter } from 'lucide-react';

export function ReportView({ summary, pocketStats, transactions }) {
  const [filterPeriod, setFilterPeriod] = useState('month'); // 'month' | 'all'

  const {
    totalBudget,
    totalSpent,
    totalAvailable,
  } = summary;

  const categoriesWithStats = CATEGORIES.map((cat) => {
    const stats = pocketStats[cat.id] || { spent: 0, budget: 0, available: 0 };
    const spentPercentOfTotal = totalSpent > 0 ? (stats.spent / totalSpent) * 100 : 0;
    const spentPercentOfBudget = stats.budget > 0 ? (stats.spent / stats.budget) * 100 : 0;
    return {
      ...cat,
      spent: stats.spent,
      budget: stats.budget,
      available: stats.available,
      spentPercentOfTotal,
      spentPercentOfBudget,
    };
  });

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Top Summary Card */}
      <div className="rounded-2xl glass-card p-4 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                Reporte General de Gastos
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(totalSpent)}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  gastados de {formatCurrency(totalBudget)}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% Consumido
          </span>
        </div>

        {/* Global Distribution Stacked Bar */}
        <div className="mt-3">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1.5 flex justify-between">
            <span>Distribución de consumo</span>
            <span>{transactions.length} registros</span>
          </div>

          <div className="w-full h-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-800/80">
            {totalSpent === 0 ? (
              <div className="w-full h-full bg-slate-200/50 dark:bg-slate-800/40 rounded-lg flex items-center justify-center text-[9px] text-slate-400 dark:text-slate-500">
                Sin gastos registrados
              </div>
            ) : (
              categoriesWithStats.map((cat) => {
                if (cat.spent <= 0) return null;
                return (
                  <div
                    key={cat.id}
                    title={`${cat.name}: ${formatCurrency(cat.spent)} (${cat.spentPercentOfTotal.toFixed(1)}%)`}
                    style={{ width: `${cat.spentPercentOfTotal}%` }}
                    className={`h-full ${cat.theme.progress} transition-all first:rounded-l-lg last:rounded-r-lg`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Comparison Grid per Pocket (Transporte, Alimentación, etc.) */}
      <section aria-label="Desglose por Espacio">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 px-1">
          Comparativa por Espacios
        </h3>

        <div className="space-y-2.5">
          {categoriesWithStats.map((cat) => {
            return (
              <div
                key={cat.id}
                className="rounded-2xl glass-card p-3.5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${cat.theme.bgLight} ${cat.theme.text}`}>
                      <CategoryIcon iconName={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {cat.hint}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white block">
                      {formatCurrency(cat.spent)}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                      de {formatCurrency(cat.budget)}
                    </span>
                  </div>
                </div>

                {/* Progress bar and metrics */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      Restante: <strong className={cat.available <= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}>{formatCurrency(cat.available)}</strong>
                    </span>
                    <span className={`font-mono font-bold ${
                      cat.spentPercentOfBudget >= 100 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {cat.spentPercentOfBudget.toFixed(0)}% del cupo
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.available <= 0 ? 'bg-rose-500' : cat.theme.progress
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, cat.spentPercentOfBudget))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Financial Health Summary */}
      <div className="rounded-2xl glass-card p-3.5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none">
        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Resumen de Eficiencia
        </h4>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Fondo Total Disponible</span>
            <span className={`text-base font-extrabold font-mono ${totalAvailable < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatCurrency(totalAvailable)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Bolsillos Preservados</span>
            <span className="text-base font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
              {categoriesWithStats.filter((c) => c.available > 0).length} / {categoriesWithStats.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

