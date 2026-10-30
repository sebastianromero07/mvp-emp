import React from 'react';
import { BalanceWidget } from './BalanceWidget';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, ShieldCheck, PieChart, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function PerformanceView({ summary, pocketStats, onNavigateToWallet }) {
  const {
    totalBudget,
    totalSpent,
    totalAvailable,
    emergencyAvailable,
    emergencyBudget,
    operationalAvailable,
    hasAnyOverdraft,
  } = summary;

  const savingsRate = totalBudget > 0 ? ((totalAvailable / totalBudget) * 100) : 0;
  const isNetPositive = totalAvailable >= 0;

  // Count pockets by health
  const pocketsList = Object.values(pocketStats);
  const outOfFundsCount = pocketsList.filter((p) => p.isOutOfFunds).length;
  const lowFundsCount = pocketsList.filter((p) => p.isLowFunds).length;
  const healthyCount = pocketsList.filter((p) => !p.isOutOfFunds && !p.isLowFunds).length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Main Balance and Net Savings Widget */}
      <BalanceWidget summary={summary} />

      {/* 2. Savings Rate & Financial Health Score Card */}
      <div className="rounded-3xl glass-card p-5 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-base text-white tracking-tight">
              Rendimiento y Tasa de Ahorro
            </h2>
          </div>
          <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
            savingsRate >= 30
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : savingsRate > 0
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          }`}>
            {savingsRate.toFixed(1)}% Retenido
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-medium">
            <span>Retención de Capital del Mes</span>
            <span className="text-white font-mono font-semibold">
              {formatCurrency(totalAvailable)} restantes
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isNetPositive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
            />
          </div>
        </div>

        {/* 3 Status Pillars */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="text-lg font-bold font-mono text-emerald-400">
              {healthyCount}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Bolsillos Sanos
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="text-lg font-bold font-mono text-amber-400">
              {lowFundsCount}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              En Alerta (&lt;15%)
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="text-lg font-bold font-mono text-rose-400">
              {outOfFundsCount}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Sin Fondos
            </div>
          </div>
        </div>
      </div>

      {/* 3. Distribution Breakdown across the 4 pockets */}
      <div className="rounded-3xl glass-card p-5 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-white tracking-tight">
            Distribución por Espacio Estanco
          </h3>
        </div>

        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const stats = pocketStats[cat.id];
            return (
              <div key={cat.id} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${cat.theme.bgLight} ${cat.theme.text}`}>
                      <CategoryIcon iconName={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white">
                      {cat.name}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-300">
                    {formatCurrency(stats.available)}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      disponible
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.isOutOfFunds
                        ? 'bg-rose-500'
                        : stats.isLowFunds
                        ? 'bg-amber-400'
                        : cat.theme.progress
                    }`}
                    style={{ width: `${Math.min(stats.spentPercent, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Gastado: {formatCurrency(stats.spent)}</span>
                  <span>{stats.spentPercent.toFixed(0)}% gastado</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Educational Methodology Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-white mb-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Disciplina de Compartimentos Estancos</span>
        </div>
        <p className="text-slate-400 text-[11px]">
          Si un espacio se agota antes de fin de mes, <strong>no traspases fondos de otro bolsillo</strong>. La regla de oro es esperar al próximo ciclo para evitar la ilusión de liquidez y mantener tus <strong>Emergencias</strong> protegidas.
        </p>
      </div>
    </div>
  );
}
