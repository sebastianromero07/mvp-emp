import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import {
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_COLORS = {
  alimentacion: '#f97316', // Orange
  transporte: '#0284c7',   // Sky
  entretenimiento: '#a855f7', // Purple
  emergencias: '#10b981',  // Emerald
};

export function ReportView({ summary, pocketStats, transactions = [] }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const {
    totalBudget,
    totalSpent,
    totalAvailable,
    emergencyAvailable,
    emergencyBudget,
  } = summary;

  const savingsRate = totalBudget > 0 ? (totalAvailable / totalBudget) * 100 : 0;
  const isNetPositive = totalAvailable >= 0;

  // Enriched categories with stats
  const categoriesWithStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const stats = pocketStats[cat.id] || { spent: 0, budget: 0, available: 0, spentPercent: 0 };
      const percentOfTotal = totalSpent > 0 ? (stats.spent / totalSpent) * 100 : 0;
      const percentOfBudget = stats.budget > 0 ? (stats.spent / stats.budget) * 100 : 0;
      const isOutOfFunds = stats.available <= 0;
      const isLowFunds = !isOutOfFunds && stats.available / stats.budget < 0.15;

      return {
        ...cat,
        spent: stats.spent,
        budget: stats.budget,
        available: stats.available,
        percentOfTotal,
        percentOfBudget,
        isOutOfFunds,
        isLowFunds,
        colorHex: CATEGORY_COLORS[cat.id] || '#6366f1',
      };
    });
  }, [pocketStats, totalSpent]);

  // Selected category stats for active highlight in donut
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categoriesWithStats.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId, categoriesWithStats]);

  // SVG Donut slices calculation
  const donutData = useMemo(() => {
    const radius = 56;
    const circumference = 2 * Math.PI * radius; // ~351.858
    let accumulatedOffset = 0;

    const slices = categoriesWithStats.map((cat) => {
      const proportion = totalSpent > 0 ? cat.spent / totalSpent : 0;
      const strokeLength = proportion * circumference;
      const strokeOffset = -accumulatedOffset;
      accumulatedOffset += strokeLength;

      return {
        ...cat,
        strokeLength,
        strokeOffset,
        circumference,
      };
    });

    return { radius, circumference, slices };
  }, [categoriesWithStats, totalSpent]);

  // Daily evolution for the last 7 days across ALL categories
  const dailyTimeline = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayFormatted = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

      const dayTotal = transactions.reduce((sum, tx) => {
        const txDate = new Date(tx.timestamp);
        const txYear = txDate.getFullYear();
        const txMonth = String(txDate.getMonth() + 1).padStart(2, '0');
        const txDay = String(txDate.getDate()).padStart(2, '0');
        const txKey = `${txYear}-${txMonth}-${txDay}`;
        return txKey === dateKey ? sum + (Number(tx.amount) || 0) : sum;
      }, 0);

      days.push({
        dateKey,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayFormatted,
        total: dayTotal,
      });
    }

    return days;
  }, [transactions]);

  const maxDaily = Math.max(...dailyTimeline.map((d) => d.total), 1);
  const highestCategory = [...categoriesWithStats].sort((a, b) => b.spent - a.spent)[0];

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* 1. TOP OVERVIEW METRICS */}
      <div className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 block mb-0.5">
              REPORTE GENERAL
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Análisis y Distribución
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desglose visual del presupuesto mensual y consumo real
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Tasa de Retención
            </span>
            <span className={`text-base font-extrabold font-mono ${
              savingsRate >= 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {Math.max(0, savingsRate).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* 3 Overview KPIs */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Gastado
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Disponible
            </span>
            <span className={`text-sm sm:text-base font-extrabold font-mono ${
              totalAvailable < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {formatCurrency(totalAvailable)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Ppto Total
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-slate-700 dark:text-slate-300">
              {formatCurrency(totalBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRÁFICO CIRCULAR INTERACTIVO (DONUT CHART) */}
      <section className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Distribución por Bolsillo
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Toca una categoría para ver su participación
              </span>
            </div>
          </div>

          {selectedCategoryId && (
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Ver total
            </button>
          )}
        </div>

        {/* Circular Donut & Interactive Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
          {/* SVG Donut */}
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 160 160"
            >
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={donutData.radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="18"
                fill="none"
              />

              {/* Category Slices */}
              {totalSpent > 0 &&
                donutData.slices.map((slice) => {
                  if (slice.spent <= 0) return null;
                  const isSelected = selectedCategoryId === slice.id;
                  return (
                    <circle
                      key={slice.id}
                      cx="80"
                      cy="80"
                      r={donutData.radius}
                      stroke={slice.colorHex}
                      strokeWidth={isSelected ? '24' : '18'}
                      strokeDasharray={`${slice.strokeLength} ${slice.circumference - slice.strokeLength}`}
                      strokeDashoffset={slice.strokeOffset}
                      fill="none"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      onClick={() =>
                        setSelectedCategoryId(selectedCategoryId === slice.id ? null : slice.id)
                      }
                    />
                  );
                })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[100px]">
                {activeCategory ? activeCategory.name : 'Total Gastado'}
              </span>
              <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900 dark:text-white leading-tight">
                {formatCurrency(activeCategory ? activeCategory.spent : totalSpent)}
              </span>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
                {activeCategory
                  ? `${activeCategory.percentOfTotal.toFixed(0)}% del total`
                  : totalBudget > 0
                  ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% del cupo`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Donut Legend Cards */}
          <div className="w-full space-y-2 flex-1">
            {categoriesWithStats.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                  className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 active:scale-98 ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.colorHex }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cat.percentOfBudget.toFixed(0)}% de cupo
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white block">
                      {formatCurrency(cat.spent)}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400">
                      {cat.percentOfTotal.toFixed(0)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EVOLUCIÓN CRONOLÓGICA SEMANAL (DÓNDE Y CUÁNDO SE GASTÓ) */}
      <section className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Evolución de Gasto Semanal
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Gasto consolidado de todos los espacios
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {transactions.length} registros
          </span>
        </div>

        {/* Visual Daily Column Chart */}
        <div className="pt-2">
          <div className="h-36 sm:h-40 flex items-end justify-between gap-1.5 sm:gap-2 px-1 pb-1 pt-6">
            {dailyTimeline.map((item) => {
              const barHeight = maxDaily > 0 ? (item.total / maxDaily) * 100 : 0;
              const hasExpense = item.total > 0;

              return (
                <div
                  key={item.dateKey}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                >
                  {/* Tooltip amount over bar */}
                  <span className={`text-[10px] font-mono font-bold transition-all mb-1 ${
                    hasExpense ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-0'
                  }`}>
                    ${item.total.toFixed(0)}
                  </span>

                  {/* Column Bar */}
                  <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 border border-slate-200 dark:border-slate-800 group-hover:border-indigo-400 transition-colors">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        item.total === 0
                          ? 'h-1.5 bg-slate-200 dark:bg-slate-800'
                          : 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                      }`}
                      style={{ height: `${Math.max(6, barHeight)}%` }}
                    />
                  </div>

                  {/* X Axis Label */}
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2 block">
                    {item.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COMPARATIVA POR ESPACIOS CON ESTADO DE SALUD */}
      <section className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Estado y Capacidad de cada Bolsillo
        </h3>

        <div className="space-y-2.5">
          {categoriesWithStats.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.theme.bgLight} ${cat.theme.text}`}>
                    <CategoryIcon iconName={cat.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Ppto: {formatCurrency(cat.budget)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white block">
                    {formatCurrency(cat.spent)}
                  </span>
                  <span className={`text-[10px] font-bold font-mono ${
                    cat.isOutOfFunds
                      ? 'text-rose-600 dark:text-rose-400'
                      : cat.isLowFunds
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {cat.isOutOfFunds ? 'Sin fondos' : `${cat.percentOfBudget.toFixed(0)}% usado`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.isOutOfFunds
                      ? 'bg-rose-500'
                      : cat.isLowFunds
                      ? 'bg-amber-500'
                      : cat.theme.progress
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, cat.percentOfBudget))}%` }}
                />
              </div>

              {/* Footer info row */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span>Disponible: <strong className={cat.isOutOfFunds ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}>{formatCurrency(cat.available)}</strong></span>
                <span>{cat.percentOfTotal.toFixed(0)}% del gasto global</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
