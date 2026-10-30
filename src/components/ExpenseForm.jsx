import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { PlusCircle, DollarSign, Tag, Sparkles } from 'lucide-react';

export function ExpenseForm({ onAddExpense, selectedCategory, onSelectCategory }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount);
    if (!cleanAmount || cleanAmount <= 0) {
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      onAddExpense({
        categoryId: selectedCategory,
        amount: cleanAmount,
        description,
      });

      // Clear input fields for next entry
      setAmount('');
      setDescription('');
    } finally {
      setTimeout(() => setIsSubmitting(false), 200);
    }
  };

  const handleQuickAdd = (value) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + value).toString());
  };

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="rounded-3xl glass-card p-5 border border-slate-800 shadow-2xl relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <PlusCircle className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-base text-white tracking-tight">
            Registrar Gasto Rápido
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Deducción automática
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Big Amount Input */}
        <div className="relative">
          <label htmlFor="expense-amount" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Monto a gastar
          </label>
          <div className="relative rounded-2xl bg-slate-950/80 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold font-mono text-slate-400">
              $
            </div>
            <input
              id="expense-amount"
              ref={inputRef}
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-transparent pl-10 pr-4 py-3.5 text-2xl sm:text-3xl font-extrabold font-mono text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* Quick amount chips for quick mobile tap */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
            <span className="text-[10px] text-slate-400 shrink-0 font-medium mr-1">Rápido:</span>
            {[5, 10, 20, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold font-mono active:scale-95 transition-all border border-slate-700/60 shrink-0"
              >
                +${val}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="px-2 py-1 rounded-lg bg-rose-950/60 text-rose-300 text-xs font-semibold active:scale-95 transition-all border border-rose-800/60 shrink-0 ml-auto"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Category Visual Button Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Selecciona el Espacio (Bolsillo)
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border active:scale-95 ${
                    isSelected
                      ? `bg-slate-800/90 ${cat.theme.activeBorder} shadow-lg ${cat.theme.glow}`
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform ${
                    isSelected ? `${cat.theme.bgLight} ${cat.theme.text} scale-110` : 'bg-slate-800 text-slate-400'
                  }`}>
                    <CategoryIcon iconName={cat.iconName} className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}>
                    {cat.name}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 absolute top-2 right-2 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Description Input */}
        <div>
          <label htmlFor="expense-desc" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Descripción breve <span className="text-slate-400 text-[10px] normal-case">(Opcional)</span>
          </label>
          <div className="relative rounded-2xl bg-slate-950/80 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              id="expense-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Ej: ${currentCategoryObj.hint.split(',')[0]}...`}
              maxLength={60}
              className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm font-medium text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Registrar Gasto en {currentCategoryObj.name}</span>
        </button>
      </form>
    </div>
  );
}
