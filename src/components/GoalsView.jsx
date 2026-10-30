import React, { useState } from 'react';
import { Target, Plus, Car, GraduationCap, Plane, Gift, Home, Laptop, Heart, Trash2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const PRESET_ICONS = [
  { id: 'car', icon: Car, label: 'Carro' },
  { id: 'study', icon: GraduationCap, label: 'Universidad' },
  { id: 'trip', icon: Plane, label: 'Viaje' },
  { id: 'birthday', icon: Gift, label: 'Cumpleaños' },
  { id: 'home', icon: Home, label: 'Hogar' },
  { id: 'tech', icon: Laptop, label: 'Tecnología' },
  { id: 'lifestyle', icon: Heart, label: 'Sueño' },
];

export function GoalsView({ goals = [], onAddGoal, onUpdateSaved, onDeleteGoal }) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('car');
  const [targetDate, setTargetDate] = useState('');

  // Deposit modal state
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const totalSaved = goals.reduce((acc, g) => acc + (Number(g.currentAmount) || 0), 0);
  const totalTarget = goals.reduce((acc, g) => acc + (Number(g.targetAmount) || 0), 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleCreate = (e) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!title.trim() || !target || target <= 0) return;

    onAddGoal({
      title: title.trim(),
      targetAmount: target,
      currentAmount: parseFloat(currentAmount) || 0,
      icon: selectedIcon,
      targetDate: targetDate || null,
    });

    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setIsCreating(false);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0 || !depositGoalId) return;

    onUpdateSaved(depositGoalId, amount);
    setDepositAmount('');
    setDepositGoalId(null);
  };

  const getIconComponent = (iconId) => {
    const item = PRESET_ICONS.find((p) => p.id === iconId);
    const IconComp = item ? item.icon : Target;
    return IconComp;
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Overview Card */}
      <div className="rounded-2xl glass-card p-4 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Tus Metas y Objetivos
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
                  {formatCurrency(totalSaved)}
                </span>
                <span className="text-[10px] text-slate-400">
                  / {formatCurrency(totalTarget)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mb-1">
            <span>Progreso Total</span>
            <span className="font-mono font-bold text-violet-400">{totalProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 dark:bg-slate-950 light:bg-slate-100 overflow-hidden p-0.5 border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, totalProgress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Creation Form Modal/Card */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl glass-card p-4 border border-violet-500/40 shadow-xl space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-violet-400" />
              Crear Nuevo Objetivo
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Nombre de la Meta (ej. Comprar un carro, Viaje a Cancún)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Comprar carro, Universidad..."
              className="w-full bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 rounded-xl px-3 py-2 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Monto Meta ($)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="5000"
                className="w-full bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Ahorro Inicial ($)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">
              Icono de referencia
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRESET_ICONS.map((p) => {
                const IconComponent = p.icon;
                const isSelected = selectedIcon === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedIcon(p.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                        : 'bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 text-slate-400 border-slate-800 dark:border-slate-800 light:border-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 active:scale-[0.98] transition-all"
          >
            Guardar Objetivo
          </button>
        </form>
      )}

      {/* Grid of Goals: like pocket cards (2x2) */}
      <section aria-label="Lista de Objetivos">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
            Tus Espacios de Metas
          </h2>
          <span className="text-[10px] font-semibold text-slate-400">
            {goals.length} activos
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="rounded-2xl glass-card p-8 text-center border border-dashed border-slate-800 dark:border-slate-800 light:border-slate-200">
            <Target className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
            <p className="text-xs text-slate-400 font-medium mb-3">
              Aún no tienes objetivos creados.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md shadow-violet-600/30"
            >
              Crear mi primer objetivo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {goals.map((goal) => {
              const IconComp = getIconComponent(goal.icon);
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className={`rounded-2xl p-3 sm:p-3.5 border transition-all flex flex-col justify-between glass-card relative group ${
                    isCompleted
                      ? 'border-emerald-500/50 dark:border-emerald-500/50 bg-emerald-950/20'
                      : 'border-slate-800/80 dark:border-slate-800/80 light:border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header: Icon + Title + Delete */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/15 text-violet-400'
                        }`}>
                          <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white dark:text-white light:text-slate-900 truncate leading-tight">
                            {goal.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 truncate block">
                            Meta: {formatCurrency(goal.targetAmount)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        title="Eliminar objetivo"
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Progress details */}
                    <div className="mb-2">
                      <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                        Ahorrado
                      </div>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-sm sm:text-base font-extrabold font-mono text-white dark:text-white light:text-slate-900">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                        <span className={`text-[10px] font-bold font-mono ${
                          isCompleted ? 'text-emerald-400' : 'text-violet-400'
                        }`}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-900 dark:bg-slate-950 light:bg-slate-200 overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-r from-violet-500 to-indigo-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  </div>

                  {/* Action button: add funds */}
                  <div className="pt-2 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 flex items-center justify-between">
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ¡Completado!
                      </span>
                    ) : (
                      <button
                        onClick={() => setDepositGoalId(goal.id)}
                        className="w-full py-1 px-2 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-[10px] font-bold transition-all text-center border border-violet-500/30"
                      >
                        + Aportar ahorro
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xs rounded-2xl glass-card p-4 border border-slate-700 space-y-3 animate-fade-in shadow-2xl">
            <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
              Aportar a este Objetivo
            </h4>
            <input
              type="number"
              step="any"
              min="0.01"
              autoFocus
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Monto a sumar ($)"
              className="w-full bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-violet-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDepositGoalId(null)}
                className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDepositSubmit}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-violet-600 text-white shadow-md shadow-violet-600/30"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

