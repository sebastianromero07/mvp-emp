import React, { useState, useMemo } from 'react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import {
  ArrowLeft,
  Plus,
  Trash2,
  TrendingDown,
  Calendar,
  AlertOctagon,
  AlertTriangle,
  Receipt,
  Layers,
  Sparkles,
  BarChart3,
  Clock
} from 'lucide-react';

export function PocketDetailView({
  category,
  stats,
  transactions = [],
  onBack,
  onOpenExpenseModal,
  onDeleteExpense,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const {
    budget,
    spent,
    available,
    spentPercent,
    isOutOfFunds,
    isLowFunds,
  } = stats;

  const { theme } = category;

  // Filter transactions belonging to this category
  const pocketTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.categoryId === category.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, category.id]);

  // Build daily timeline (last 7 days)
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

      // Sum transactions for this day
      const dayTotal = pocketTransactions.reduce((sum, tx) => {
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
  }, [pocketTransactions]);

  const maxDaily = Math.max(...dailyTimeline.map((d) => d.total), 1);
  const totalInPeriod = dailyTimeline.reduce((sum, d) => sum + d.total, 0);
  const activeDaysCount = dailyTimeline.filter((d) => d.total > 0).length;
  const avgDaily = activeDaysCount > 0 ? totalInPeriod / activeDaysCount : 0;
  const highestDay = [...dailyTimeline].sort((a, b) => b.total - a.total)[0];

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Top Navigation Bar with Back button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Bolsillos</span>
        </button>

        <button
          onClick={() => onOpenExpenseModal(category.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar gasto</span>
        </button>
      </div>

      {/* Hero Pocket Header Card */}
      <div className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.text}`}>
              <CategoryIcon iconName={category.iconName} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Espacio {category.name}
                </h2>
                {isOutOfFunds ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                    Agotado
                  </span>
                ) : isLowFunds ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    &lt; 15% restante
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {category.hint}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Metrics Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Disponible
            </span>
            <span className={`text-sm sm:text-base font-extrabold font-mono ${
              isOutOfFunds ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
            }`}>
              {formatCurrency(available)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Presupuesto
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
              {formatCurrency(budget)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Consumo
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {spentPercent.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Uso del presupuesto asignado</span>
            <span className="font-mono">{formatCurrency(spent)} de {formatCurrency(budget)}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOutOfFunds ? 'bg-rose-500' : isLowFunds ? 'bg-amber-500' : theme.progress
              }`}
              style={{ width: `${Math.min(100, Math.max(0, spentPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. GRÁFICO EVOLUTIVO DE LOS DÍAS                          */}
      {/* ========================================================= */}
      <section className="rounded-3xl glass-card p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Evolución de Gasto Diario
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Últimos 7 días en {category.name}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {formatCurrency(totalInPeriod)} total
          </span>
        </div>

        {/* Visual Evolutionary Chart */}
        <div className="pt-2">
          {totalInPeriod === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800">
              <Clock className="w-7 h-7 text-slate-400 mx-auto mb-1.5 opacity-60" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Aún no hay gastos registrados en los últimos 7 días.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Daily bars with amount labels */}
              <div className="h-40 sm:h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-1 pb-1 pt-6">
                {dailyTimeline.map((item, index) => {
                  const barHeight = maxDaily > 0 ? (item.total / maxDaily) * 100 : 0;
                  const isHighest = item.total > 0 && item.total === highestDay.total;
                  const isSelected = selectedDayIndex === index;

                  return (
                    <div
                      key={item.dateKey}
                      onClick={() => setSelectedDayIndex(isSelected ? null : index)}
                      className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
                    >
                      {/* Floating tooltip/value over bar */}
                      <span className={`text-[10px] font-mono font-bold transition-all mb-1 truncate ${
                        item.total > 0
                          ? isSelected || isHighest
                            ? 'text-indigo-600 dark:text-indigo-400 scale-105'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                          : 'opacity-0'
                      }`}>
                        ${item.total.toFixed(0)}
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 border border-slate-200 dark:border-slate-800 transition-all group-hover:border-indigo-400">
                        <div
                          className={`w-full rounded-lg transition-all duration-500 ${
                            item.total === 0
                              ? 'h-1.5 bg-slate-200 dark:bg-slate-800'
                              : isHighest
                              ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-sm shadow-indigo-500/30'
                              : theme.progress
                          }`}
                          style={{ height: `${Math.max(6, barHeight)}%` }}
                        />
                      </div>

                      {/* X-axis Day Label */}
                      <div className="text-center mt-2">
                        <span className={`text-[10px] font-semibold block transition-colors ${
                          item.dayName === 'Hoy'
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                        }`}>
                          {item.dayName}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono hidden xs:block">
                          {item.dayFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Insights summary row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/60">
                  <span className="text-[9px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
                    Pico de Gasto
                  </span>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {highestDay?.dayName || '-'}
                    </span>
                    <span className="text-xs font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(highestDay?.total || 0)}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/60">
                  <span className="text-[9px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
                    Promedio Diario Activo
                  </span>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {activeDaysCount} días
                    </span>
                    <span className="text-xs font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(avgDaily)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. HISTORIAL DE GASTOS ESPECÍFICO DEL BOLSILLO            */}
      {/* ========================================================= */}
      <section className="rounded-3xl glass-card p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Historial de Gastos
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Registros en {category.name}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {pocketTransactions.length} registros
          </span>
        </div>

        {pocketTransactions.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800">
            <Layers className="w-7 h-7 text-slate-400 mx-auto mb-1.5 opacity-60" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
              No hay movimientos registrados en este espacio.
            </p>
            <button
              onClick={() => onOpenExpenseModal(category.id)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
            >
              + Registrar primer gasto
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {pocketTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-950/50 dark:hover:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.text}`}>
                    <CategoryIcon iconName={category.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                      {tx.description || category.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {formatDateTime(tx.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold font-mono text-rose-600 dark:text-rose-400">
                    -{formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(tx.id)}
                    title="Eliminar gasto y restaurar saldo"
                    className="p-1.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

