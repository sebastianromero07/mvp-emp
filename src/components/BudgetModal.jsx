import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';

export function BudgetModal({ isOpen, onClose, currentBudgets, onSaveBudgets, onResetToDemo }) {
  const [draftBudgets, setDraftBudgets] = useState(currentBudgets);
  const [resetTransactions, setResetTransactions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraftBudgets(currentBudgets);
      setResetTransactions(false);
    }
  }, [isOpen, currentBudgets]);

  if (!isOpen) return null;

  const handleBudgetChange = (catId, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setDraftBudgets((prev) => ({
      ...prev,
      [catId]: num,
    }));
  };

  const totalPlanned = Object.values(draftBudgets).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBudgets(draftBudgets, resetTransactions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl glass-card border border-slate-700/80 shadow-2xl p-6 bg-slate-900/95 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Presupuesto Mensual
            </h2>
            <p className="text-xs text-slate-400">
              Asigna el límite de cada uno de tus 4 espacios estancos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* 4 category inputs */}
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const val = draftBudgets[cat.id] ?? 0;
              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 focus-within:border-indigo-500 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cat.theme.bgLight} ${cat.theme.text}`}>
                      <CategoryIcon iconName={cat.iconName} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {cat.hint}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm font-bold text-slate-400 font-mono">$</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={val || ''}
                      onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                      placeholder="0"
                      className="w-24 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-right font-mono font-bold text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Planned Total Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-300 block">
                Presupuesto Total Planeado
              </span>
              <span className="text-[10px] text-indigo-400/80">
                Suma de los 4 espacios
              </span>
            </div>
            <div className="text-xl font-extrabold font-mono text-white">
              {formatCurrency(totalPlanned)}
            </div>
          </div>

          {/* Reset Month option */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="reset-transactions-chk"
              checked={resetTransactions}
              onChange={(e) => setResetTransactions(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="reset-transactions-chk" className="text-xs text-slate-300 cursor-pointer">
              <span className="font-semibold text-white block">Reiniciar mes (vaciar movimientos)</span>
              Borra el historial de gastos para comenzar un nuevo ciclo mensual en cero.
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{resetTransactions ? 'Guardar y Reiniciar Mes' : 'Guardar Cambios'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onResetToDemo();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold active:scale-98 transition-all flex items-center justify-center gap-1.5 border border-slate-700/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Datos Semilla (Demo)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
