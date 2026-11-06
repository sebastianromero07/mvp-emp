import React, { useState, useEffect } from 'react';
import { PRESET_POCKET_CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { X, Plus, Wallet, Sparkles, Check, ArrowDownRight } from 'lucide-react';

export function CreatePocketModal({
  isOpen,
  onClose,
  onCreatePocket,
  availableBalance,
  walletMode = 'demo',
}) {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_POCKET_CATEGORIES[0]);
  const [name, setName] = useState(PRESET_POCKET_CATEGORIES[0].name);
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(PRESET_POCKET_CATEGORIES[0]);
      setName(PRESET_POCKET_CATEGORIES[0].name);
      setBudget('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setName(preset.name);
  };

  const numBudget = parseFloat(budget);
  const isBudgetValid = !isNaN(numBudget) && numBudget > 0;
  const isNameValid = (name || '').trim().length > 0;
  const isCategorySelected = Boolean(selectedPreset);
  const isFormValid = isCategorySelected && isNameValid && isBudgetValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onCreatePocket({
      name: name.trim(),
      iconName: selectedPreset.iconName,
      color: selectedPreset.color,
      budget: numBudget,
      hint: selectedPreset.hint,
    });

    onClose();
  };

  const handleAddBudgetShortcut = (val) => {
    const current = parseFloat(budget) || 0;
    setBudget(String(current + val));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-md my-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Crear Nuevo Bolsillo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Elige la categoría y asigna su presupuesto estanco
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1: Choose category */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              1. Elige la Categoría del Bolsillo
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
              {PRESET_POCKET_CATEGORIES.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative p-2.5 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-semibold ${isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500 scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80'
                      }`}
                  >
                    <CategoryIcon
                      iconName={preset.iconName}
                      className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}
                    />
                    <span className="text-[10px] leading-tight truncate w-full">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pocket Name Input */}
          <div>
            <label
              htmlFor="pocket-name"
              className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5"
            >
              Nombre del Bolsillo
            </label>
            <input
              id="pocket-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Alimentación, Gym, Cursos..."
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* STEP 2: Budget Value */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="pocket-budget"
                className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                2. Valor del Presupuesto ($)
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Límite asignado
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-extrabold font-mono text-slate-400 dark:text-slate-500">
                $
              </span>
              <input
                id="pocket-budget"
                type="number"
                min="0.01"
                step="any"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-extrabold font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Quick Amount Shortcuts */}
            <div className="flex gap-1.5 mt-2">
              {[50, 100, 200, 300].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddBudgetShortcut(val)}
                  className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold font-mono active:scale-95 transition-all"
                >
                  +${val}
                </button>
              ))}
            </div>

            {/* Saldo deduction feedback */}
            {availableBalance !== undefined && (
              <div className="mt-3 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Saldo Total disponible:</span>
                  <span className="font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(availableBalance)}
                  </span>
                </div>
                {isBudgetValid && (
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-indigo-200/40 dark:border-indigo-800/40">
                    <span className="text-indigo-600 dark:text-indigo-300 font-semibold flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      Restará del Saldo Total:
                    </span>
                    <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      quedará {formatCurrency(Math.max(0, availableBalance - numBudget))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form helper note */}
          {!isFormValid && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-xl border border-amber-200 dark:border-amber-500/20">
              ⚠️ Ingresa un valor de presupuesto mayor a $0 para habilitar la creación del bolsillo.
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${isFormValid
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
            >
              <Plus className="w-4 h-4" />
              <span>Crear Bolsillo</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold active:scale-[0.98] transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
