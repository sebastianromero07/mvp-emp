import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { X, Check, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function QuickExpenseModal({ isOpen, onClose, categoryId, onAddExpense, pocketStats }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const stats = pocketStats ? pocketStats[category.id] : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    onAddExpense({
      categoryId: category.id,
      amount: val,
      description: description.trim(),
    });

    setAmount('');
    setDescription('');
    onClose();
  };

  const handleQuickChip = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl glass-card p-5 border border-slate-700/80 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${category.theme.bgLight} ${category.theme.text}`}>
              <CategoryIcon iconName={category.iconName} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white dark:text-white light:text-slate-900 leading-tight">
                Gasto en {category.name}
              </h3>
              {stats && (
                <span className="text-[10px] text-slate-400">
                  Disponible: <strong className="text-white dark:text-white light:text-slate-800 font-mono">{formatCurrency(stats.available)}</strong>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Monto a deducir ($)
            </label>
            <div className="relative rounded-2xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold font-mono text-slate-400">
                $
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                autoFocus
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent pl-9 pr-3 py-3 text-2xl font-mono font-extrabold text-white dark:text-white light:text-slate-900 focus:outline-none"
              />
            </div>

            {/* Quick chips */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              {[5, 10, 20, 50].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleQuickChip(v)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-semibold font-mono active:scale-95 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200"
                >
                  +${v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Nota / Concepto (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Almuerzo, Uber, Factura..."
              className="w-full bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all"
            >
              Confirmar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

