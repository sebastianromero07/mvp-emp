import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Trash2, History, Filter, ArrowDownRight, Layers } from 'lucide-react';

export function HistoryList({ transactions, onDeleteExpense }) {
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.categoryId === filterCategory;
  });

  const getCategoryDetails = (catId) => {
    return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
  };

  return (
    <div className="rounded-3xl glass-card p-5 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-base text-white tracking-tight">
            Historial de Movimientos
          </h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
          {transactions.length} {transactions.length === 1 ? 'gasto' : 'gastos'}
        </span>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${
            filterCategory === 'all'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-950'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          Todos
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1 active:scale-95 ${
              filterCategory === cat.id
                ? `${cat.theme.bgLight} ${cat.theme.text} ${cat.theme.border} font-bold ring-1 ring-current`
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cat.theme.dot}`} />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Transaction list */}
      {filteredTransactions.length === 0 ? (
        <div className="py-8 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800">
          <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">
            {filterCategory === 'all'
              ? 'No hay movimientos registrados en este período.'
              : 'No hay gastos registrados en esta categoría.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filteredTransactions.map((tx) => {
            const cat = getCategoryDetails(tx.categoryId);
            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 transition-all hover:border-slate-700"
              >
                {/* Left: Icon and details */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.theme.bgLight} ${cat.theme.text}`}>
                    <CategoryIcon iconName={cat.iconName} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white truncate">
                        {tx.description || cat.name}
                      </span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${cat.theme.badge}`}>
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateTime(tx.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Right: Amount deducted & delete button */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-rose-400 flex items-center justify-end">
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                      <span>-{formatCurrency(tx.amount)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteExpense(tx.id)}
                    title="Eliminar gasto y restaurar saldo"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 active:scale-90 transition-all ml-1"
                    aria-label="Eliminar gasto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
