import React from 'react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { QrCode, ChevronRight } from 'lucide-react';

export function PocketCard({ stats, onSelectPocket, onOpenQRPay }) {
  const {
    category,
    budget,
    spent,
    available,
    spentPercent,
    isOutOfFunds,
    isLowFunds,
  } = stats;

  const { theme } = category;

  // Visual styling rules:
  // 1. isOutOfFunds (<= 0): Tarjeta roja con advertencia clara "Espacio sin fondos"
  // 2. isLowFunds (< 15%): Borde y fondo ámbar de aviso
  // 3. Normal: Borde sutil y fondo limpio
  let cardBorder = 'border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-slate-600 shadow-xs dark:shadow-none';
  let cardBg = 'bg-white dark:bg-slate-900/80';

  if (isOutOfFunds) {
    cardBorder = 'border-rose-300 dark:border-rose-500/80 ring-1 ring-rose-400/40 dark:ring-rose-500/50 shadow-md shadow-rose-500/10 dark:shadow-rose-950/60';
    cardBg = 'bg-rose-50/70 dark:bg-gradient-to-br dark:from-rose-950/70 dark:via-slate-900/90 dark:to-rose-950/50';
  } else if (isLowFunds) {
    cardBorder = 'border-amber-300/80 dark:border-amber-500/50 ring-1 ring-amber-400/30 dark:ring-amber-500/30 shadow-xs dark:shadow-amber-950/40';
    cardBg = 'bg-amber-50/50 dark:bg-gradient-to-br dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/90';
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
      className={`group relative rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left active:scale-[0.98] border backdrop-blur-xl flex flex-col justify-between min-h-[160px] sm:min-h-[175px] ${cardBorder} ${cardBg}`}
    >
      {/* Top row: Icon on left, dedicated QR Payment button on right */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
          isOutOfFunds ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' : `${theme.bgLight} ${theme.text}`
        }`}>
          <CategoryIcon iconName={category.iconName} className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </div>

        {/* Top-Right: dedicated QR Payment button (como en Yape) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenQRPay && onOpenQRPay(category.id);
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-500/15 dark:hover:bg-indigo-600 dark:text-indigo-400 dark:hover:text-white flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm border border-indigo-200/80 dark:border-indigo-500/30 shrink-0 group/qr"
          title={`Escanear QR y pagar con ${category.name}`}
          aria-label={`Escanear QR y pagar con ${category.name}`}
        >
          <QrCode className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform group-hover/qr:scale-110 duration-200" />
        </button>
      </div>

      {/* Pocket Name - Spans full width so long names are completely visible */}
      <div className="mb-2">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>
      </div>

      {/* Center: Available Balance */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
          <span>Saldo Disponible</span>
          {isOutOfFunds ? (
            <span className="text-rose-600 dark:text-rose-400 font-extrabold normal-case tracking-normal">Sin fondos</span>
          ) : isLowFunds ? (
            <span className="text-amber-600 dark:text-amber-400 font-extrabold normal-case tracking-normal">&lt;15%</span>
          ) : null}
        </div>

        <div className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-1">
          <span className={`text-xl sm:text-2xl font-black tracking-tight font-mono truncate leading-none ${
            isOutOfFunds ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
          }`}>
            {formatCurrency(available)}
          </span>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate font-semibold">
            Gasto: <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{formatCurrency(spent)}</span>
          </span>
        </div>

        {isOutOfFunds && available < 0 && (
          <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1 truncate">
            ⚠️ Sobregiro: -{formatCurrency(Math.abs(available))}
          </div>
        )}
      </div>

      {/* Tap hint to enter dedicated space */}
      <div className="mt-1 flex items-center justify-end gap-1 text-right">
        <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-semibold">
          Ver detalle y gráfico
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
      </div>
    </div>
  );
}
