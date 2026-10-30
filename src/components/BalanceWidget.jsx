import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, ShieldCheck, HelpCircle, PiggyBank, AlertTriangle } from 'lucide-react';

export function BalanceWidget({ summary }) {
  const [showInfo, setShowInfo] = useState(false);

  const {
    totalBudget,
    totalSpent,
    totalAvailable,
    emergencyAvailable,
    emergencyBudget,
    emergencySpent = 0,
    operationalAvailable,
    isGlobalDeficit,
    hasAnyOverdraft,
  } = summary;

  const isNetPositive = totalAvailable >= 0;
  const spentPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-5 border border-slate-800 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className={`absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isNetPositive ? 'bg-emerald-500/15' : 'bg-rose-500/20'
      }`} />

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <PiggyBank className="w-3.5 h-3.5 text-indigo-400" />
          Saldo Total Disponible
        </span>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-white/5 flex items-center gap-1 text-xs"
          title="Ver explicación del Ahorro Neto"
        >
          <span className="text-[11px] text-slate-400 font-medium">¿Cómo funciona?</span>
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main balance number */}
      <div className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
              totalAvailable < 0 ? 'text-rose-400' : 'text-white'
            }`}>
              {formatCurrency(totalAvailable)}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              de {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Total gastado este mes: <span className="text-slate-200 font-semibold">{formatCurrency(totalSpent)}</span> ({spentPercent.toFixed(1)}%)
          </div>
        </div>

        {/* Net Savings Badge */}
        <div className="flex items-center self-start sm:self-auto">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-colors ${
            isNetPositive
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950'
          }`}>
            {isNetPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>
              Ahorro Neto: {isNetPositive ? '+' : ''}{formatCurrency(totalAvailable)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-breakdown: Emergencias vs Operativo */}
      <div className="relative grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
        <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fondo de Emergencias</span>
          </div>
          <div className="text-base font-bold text-white font-mono leading-tight">
            {formatCurrency(emergencyAvailable)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {emergencySpent === 0 ? (
              <span className="text-emerald-400/90 font-medium">100% blindado intacto</span>
            ) : emergencyAvailable <= 0 ? (
              <span className="text-rose-400 font-semibold">⚠️ Fondo agotado ({formatCurrency(emergencySpent)} gastados)</span>
            ) : (
              <span>Gastado: <strong className="text-slate-200">{formatCurrency(emergencySpent)}</strong> de {formatCurrency(emergencyBudget)}</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span>Margen Operativo</span>
          </div>
          <div className={`text-base font-bold font-mono leading-tight ${
            operationalAvailable < 0 ? 'text-rose-400' : 'text-white'
          }`}>
            {operationalAvailable < 0 ? '-' : ''}{formatCurrency(Math.abs(operationalAvailable))}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {operationalAvailable < 0 ? 'Sobregiro en bolsillos diarios' : 'Sobrante no gastado'}
          </div>
        </div>
      </div>

      {/* Explanatory dropdown when user clicks info */}
      {showInfo && (
        <div className="relative mt-3 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-700/80 text-xs text-slate-300 leading-relaxed transition-all space-y-2">
          <div>
            <p className="font-bold text-white mb-1">
              🛡️ ¿Cuándo varía el Fondo de Emergencias?
            </p>
            <p className="text-slate-300 text-[11px]">
              Al ser un <strong>espacio estanco</strong>, el dinero no se mezcla automáticamente:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] mt-1">
              <li>
                <strong className="text-emerald-400">Varía de forma directa:</strong> Cuando registras un gasto seleccionando el botón verde <strong className="text-white">"Emergencias"</strong> (ej: visita al médico, reparación urgente).
              </li>
              <li>
                <strong className="text-sky-400">Margen Operativo:</strong> Se mueve con los gastos cotidianos de <em>Alimentación</em>, <em>Transporte</em> y <em>Entretenimiento</em>.
              </li>
              <li>
                <strong className="text-amber-400">Impacto en el Ahorro Neto:</strong> Si te sobregiras en un bolsillo operativo, tu colchón de Emergencias sigue registrado, pero la etiqueta de <strong>Ahorro Neto</strong> se reduce o se pone en rojo para advertirte que tu patrimonio global está en riesgo.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Overdraft alert pill if any pocket is negative */}
      {hasAnyOverdraft && (
        <div className="relative mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-medium animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Atención: Tienes al menos un espacio en saldo negativo o sin fondos.</span>
        </div>
      )}
    </div>
  );
}
