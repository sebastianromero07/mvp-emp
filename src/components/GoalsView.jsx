import React, { useState } from 'react';
import {
  Target,
  Plus,
  Car,
  GraduationCap,
  Plane,
  Gift,
  Home,
  Laptop,
  Heart,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  X,
  Compass
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// Predefined Goal Templates with representative background images (matching the user's reference)
export const PREDEFINED_GOALS = [
  {
    id: 'car',
    title: 'Comprar Auto',
    subtitle: 'Ahorro para vehículo nuevo',
    term: 'Mediano plazo',
    defaultTarget: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    iconName: 'Car',
    badge: 'META ACTIVA',
  },
  {
    id: 'trip',
    title: 'Viaje / Vacaciones',
    subtitle: 'Vuelo y estadía soñada',
    term: 'Corto plazo',
    defaultTarget: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    iconName: 'Plane',
    badge: 'EN CURSO',
  },
  {
    id: 'study',
    title: 'Universidad / Maestría',
    subtitle: 'MBA y desarrollo profesional',
    term: 'Mediano plazo',
    defaultTarget: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    iconName: 'GraduationCap',
    badge: 'PLANIFICACIÓN',
  },
  {
    id: 'emergency',
    title: 'Fondo de Emergencia',
    subtitle: 'Colchón financiero seguro',
    term: 'Corto plazo',
    defaultTarget: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    iconName: 'ShieldCheck',
    badge: 'PRIORITARIO',
  },
  {
    id: 'home',
    title: 'Hogar / Casa Propia',
    subtitle: 'Inicial o remodelación',
    term: 'Largo plazo',
    defaultTarget: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    iconName: 'Home',
    badge: 'PLANIFICACIÓN',
  },
  {
    id: 'tech',
    title: 'Laptop / Tecnología Pro',
    subtitle: 'Equipo de trabajo o setup',
    term: 'Corto plazo',
    defaultTarget: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    iconName: 'Laptop',
    badge: 'EN CURSO',
  },
  {
    id: 'birthday',
    title: 'Cumpleaños / Celebración',
    subtitle: 'Fiesta especial con amigos y familia',
    term: 'Corto plazo',
    defaultTarget: 600,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    iconName: 'Gift',
    badge: 'EN CURSO',
  },
  {
    id: 'custom',
    title: 'Meta Personalizada',
    subtitle: 'Define tu propio objetivo a medida',
    term: 'Personalizado',
    defaultTarget: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    iconName: 'Target',
    badge: 'NUEVO',
  },
];

const ICONS_MAP = {
  Car,
  Plane,
  GraduationCap,
  ShieldCheck,
  Home,
  Laptop,
  Gift,
  Target,
  car: Car,
  trip: Plane,
  study: GraduationCap,
  emergency: ShieldCheck,
  home: Home,
  tech: Laptop,
  birthday: Gift,
};

export function GoalsView({ goals = [], onAddGoal, onUpdateSaved, onDeleteGoal }) {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(PREDEFINED_GOALS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Todas'); // 'Todas' | 'Corto plazo' | 'Mediano plazo' | 'Largo plazo'

  // Deposit modal state
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const totalSaved = goals.reduce((acc, g) => acc + (Number(g.currentAmount) || 0), 0);
  const totalTarget = goals.reduce((acc, g) => acc + (Number(g.targetAmount) || 0), 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Filter goals by horizon
  const filteredGoals = goals.filter((g) => {
    if (selectedTerm === 'Todas') return true;
    return (g.term || 'Mediano plazo') === selectedTerm;
  });

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCustomTitle(template.title);
    if (!targetAmount) {
      setTargetAmount(template.defaultTarget.toString());
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!target || target <= 0) return;

    const titleToUse = (customTitle || selectedTemplate.title).trim();

    onAddGoal({
      title: titleToUse,
      subtitle: selectedTemplate.subtitle,
      targetAmount: target,
      currentAmount: parseFloat(initialAmount) || 0,
      icon: selectedTemplate.iconName || 'Target',
      term: selectedTemplate.term,
      imageUrl: selectedTemplate.imageUrl,
      badge: selectedTemplate.badge,
    });

    setTargetAmount('');
    setInitialAmount('');
    setCustomTitle('');
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

  const getGoalImage = (goal) => {
    if (goal.imageUrl) return goal.imageUrl;
    // Fallback based on icon
    const match = PREDEFINED_GOALS.find((p) => p.id === goal.icon || p.iconName === goal.icon);
    return match ? match.imageUrl : PREDEFINED_GOALS[0].imageUrl;
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Top Vision Header (Inspired by reference design) */}
      <div className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
              VISIÓN GENERAL
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tu camino financiero
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
              Visualiza y gestiona tus objetivos de ahorro con metas reales y progreso continuo.
            </p>
          </div>

          <button
            onClick={() => {
              setIsCreating(!isCreating);
              if (!isCreating) {
                handleSelectTemplate(PREDEFINED_GOALS[0]);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Meta</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>Ahorro Acumulado Total</span>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalSaved)} <span className="text-slate-400 font-normal">/ {formatCurrency(totalTarget)}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, totalProgress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Horizon Tabs (Corto plazo, Mediano plazo, etc.) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['Todas', 'Corto plazo', 'Mediano plazo', 'Largo plazo'].map((term) => (
          <button
            key={term}
            onClick={() => setSelectedTerm(term)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${
              selectedTerm === term
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {term}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-slate-400 font-mono font-semibold">
          {filteredGoals.length} {filteredGoals.length === 1 ? 'meta' : 'metas'}
        </span>
      </div>

      {/* ========================================================= */}
      {/* CREATION MODAL CON BLUR Y PANTALLA COMPLETA EN MÓVIL      */}
      {/* ========================================================= */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto safe-area-bottom"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Elige tu Objetivo Predefinido
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Selecciona la opción predefinida y solo ingresa el monto meta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preset templates carousel / grid */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-2">
                1. Selecciona el Tipo de Meta
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PREDEFINED_GOALS.map((template) => {
                  const isSelected = selectedTemplate.id === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className={`relative rounded-2xl overflow-hidden text-left border p-2.5 transition-all flex flex-col justify-end h-24 sm:h-28 group ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Background image preview */}
                      <img
                        src={template.imageUrl}
                        alt={template.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                      {/* Content over image */}
                      <div className="relative z-10">
                        <span className="text-[9px] font-bold text-emerald-300 uppercase block leading-tight">
                          {template.term}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-tight truncate">
                          {template.title}
                        </h4>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Preview Banner & Amount Input */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Nombre de la Meta (editable)
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Ej. Comprar Auto, Viaje a Japón..."
                    className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    * ¿Cuál es tu Monto Objetivo? ($)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    autoFocus
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Ej. 10000"
                    className="w-full bg-slate-100 dark:bg-slate-950/80 border border-emerald-500/80 rounded-2xl px-3.5 py-2.5 text-sm font-mono font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Ahorro Inicial que ya tienes ($ - opcional)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-2xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Meta</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* LISTA DE METAS CON FONDOS REPRESENTATIVOS (TIPO REFERENCIA) */}
      {/* ========================================================= */}
      <section aria-label="Objetivos de ahorro">
        {filteredGoals.length === 0 ? (
          <div className="rounded-3xl glass-card p-8 text-center border border-dashed border-slate-300 dark:border-slate-800">
            <Target className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              No tienes metas en este horizonte temporal.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Crea tu primer objetivo eligiendo una plantilla predefinida.
            </p>
            <button
              onClick={() => {
                setIsCreating(true);
                handleSelectTemplate(PREDEFINED_GOALS[0]);
              }}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              Crear objetivo ahora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredGoals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const isCompleted = goal.currentAmount >= goal.targetAmount;
              const bgImage = getGoalImage(goal);
              const IconComp = ICONS_MAP[goal.icon] || Target;

              return (
                <div
                  key={goal.id}
                  className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group transition-all duration-200 flex flex-col justify-between min-h-[190px] sm:min-h-[210px]"
                >
                  {/* Background Image with Dark Vignette Gradient */}
                  <img
                    src={bgImage}
                    alt={goal.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

                  {/* Card Content Top: Badge and Delete */}
                  <div className="relative z-10 p-4 flex items-start justify-between">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-500/90 text-white border-emerald-400'
                        : 'bg-slate-900/80 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completado</span>
                        </>
                      ) : (
                        <span>{progress.toFixed(0)}% Completado</span>
                      )}
                    </span>

                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      title="Eliminar meta"
                      className="p-1.5 rounded-full bg-slate-900/60 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-white/10 transition-colors backdrop-blur-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content Bottom: Title, Progress Bar, Numbers & Deposit Action */}
                  <div className="relative z-10 p-4 pt-0 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300/80 block">
                        {goal.term || 'Mediano plazo'}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight drop-shadow-md truncate">
                        {goal.title}
                      </h3>
                      {goal.subtitle && (
                        <p className="text-[11px] text-slate-300 truncate">
                          {goal.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-black/50 backdrop-blur-md overflow-hidden p-0.5 border border-white/20">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isCompleted
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>

                    {/* Numbers and Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-base sm:text-lg font-mono font-extrabold text-white block leading-tight">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          objetivo: {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ¡Meta lograda!
                        </span>
                      ) : (
                        <button
                          onClick={() => setDepositGoalId(goal.id)}
                          className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-xs shadow-md active:scale-95 transition-all"
                        >
                          + Aportar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Aportar a este Objetivo
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Suma dinero ahorrado para acercarte a tu meta.
              </p>
            </div>

            <div className="relative rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold font-mono text-slate-400">
                $
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                autoFocus
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent pl-8 pr-3 py-2.5 text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Quick chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[20, 50, 100, 200].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    const cur = parseFloat(depositAmount) || 0;
                    setDepositAmount((cur + v).toString());
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono active:scale-95 border border-slate-200 dark:border-slate-700"
                >
                  +${v}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDepositGoalId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDepositSubmit}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
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
