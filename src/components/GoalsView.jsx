import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Compass,
  GripVertical,
  Check
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// Available investment strategies requested by the user (including 'Ahorro natural')
export const INVESTMENT_STRATEGIES = [
  'Ahorro natural',
  'Cuenta de alto rendimiento',
  'Renta fija',
  'Bonos soberanos',
  'Acciones',
  'ETFs',
];

export const STRATEGY_DETAILS = {
  'Ahorro natural': {
    desc: 'Separar dinero mes a mes sin instrumentos de inversión',
    badge: 'Sin riesgo',
  },
  'Cuenta de alto rendimiento': {
    desc: 'Cuentas remuneradas con disponibilidad y tasa preferencial',
    badge: 'Liquidez alta',
  },
  'Renta fija': {
    desc: 'Plazos fijos y rendimientos predecibles garantizados',
    badge: 'Bajo riesgo',
  },
  'Bonos soberanos': {
    desc: 'Títulos públicos de deuda y respaldo estatal',
    badge: 'Seguridad estatal',
  },
  'Acciones': {
    desc: 'Inversión en empresas con potencial de crecimiento de capital',
    badge: 'Mayor rentabilidad',
  },
  'ETFs': {
    desc: 'Fondos cotizados con diversificación automática por índices',
    badge: 'Diversificado',
  },
};

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

export function GoalsView({
  goals = [],
  onAddGoal,
  onUpdateSaved,
  onDeleteGoal,
  onReorderGoals,
  onUpdateGoalStrategy,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(PREDEFINED_GOALS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [creationStrategy, setCreationStrategy] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('Todas'); // 'Todas' | 'Corto plazo' | 'Mediano plazo' | 'Largo plazo'

  // Selected goal to configure strategy ("¿Cómo cumplir tu objetivo?")
  const [strategyGoal, setStrategyGoal] = useState(null);

  // Transient feedback when a strategy is selected (appears and vanishes almost instantly)
  const [feedbackNotification, setFeedbackNotification] = useState(null); // { goalId, strategy }
  const feedbackTimerRef = useRef(null);

  const handleSelectStrategy = (goalId, strategy) => {
    if (onUpdateGoalStrategy) {
      onUpdateGoalStrategy(goalId, strategy);
    }

    // Haptic feedback
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(35);
      }
    } catch {}

    // Show visual feedback check inside the modal
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedbackNotification({ goalId, strategy });

    // Update strategyGoal so selected checkmark reflects immediately
    setStrategyGoal((prev) => (prev && prev.id === goalId ? { ...prev, strategy } : prev));

    // Closes modal and dismisses feedback after 1.1s
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackNotification(null);
      setStrategyGoal(null);
    }, 1100);
  };

  // Drag and drop state
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  const touchTimerRef = useRef(null);
  const touchCleanupRef = useRef(null);
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    fromIndex: null,
    isDragging: false,
  });

  // Deposit modal state
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Filter goals by horizon
  const filteredGoals = goals.filter((g) => {
    if (selectedTerm === 'Todas') return true;
    return (g.term || 'Mediano plazo') === selectedTerm;
  });

  // Live preview of goals reordering
  const displayGoals = useMemo(() => {
    if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) {
      return filteredGoals;
    }
    const result = [...filteredGoals];
    const [moved] = result.splice(dragIndex, 1);
    result.splice(dropIndex, 0, moved);
    return result;
  }, [filteredGoals, dragIndex, dropIndex]);

  // Keep a ref of live drag info so window-level touch listeners always see fresh values
  const dragInfoRef = useRef({ dragIndex, dropIndex, displayGoals });
  useEffect(() => {
    dragInfoRef.current = { dragIndex, dropIndex, displayGoals };
  }, [dragIndex, dropIndex, displayGoals]);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      if (touchCleanupRef.current) touchCleanupRef.current();
    };
  }, []);

  const commitReorder = (newFilteredList) => {
    if (!onReorderGoals) return;
    if (selectedTerm === 'Todas') {
      onReorderGoals(newFilteredList);
      return;
    }
    const updated = [];
    let fIdx = 0;
    goals.forEach((g) => {
      if ((g.term || 'Mediano plazo') === selectedTerm) {
        if (fIdx < newFilteredList.length) {
          updated.push(newFilteredList[fIdx++]);
        }
      } else {
        updated.push(g);
      }
    });
    onReorderGoals(updated);
  };

  // Desktop Drag & Drop
  const handleDragStart = (index, e) => {
    if (e.target.closest('button')) {
      e.preventDefault();
      return;
    }
    setDragIndex(index);
    setDropIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnter = (targetIndex, e) => {
    e.preventDefault();
    if (dragIndex !== null && targetIndex !== dropIndex) {
      setDropIndex(targetIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      commitReorder(displayGoals);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      commitReorder(displayGoals);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  // -------------------------------------------------------------
  // MOBILE: Long-Press Touch Drag & Drop (450ms hold + page lock)
  // -------------------------------------------------------------
  const startDragFromTouch = (index) => {
    touchStateRef.current.isDragging = true;
    setIsTouchDragging(true);
    setDragIndex(index);
    setDropIndex(index);

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([45, 25, 45]);
      }
    } catch {}

    // Lock page scrolling while dragging so screen does NOT move
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const onNativeWindowTouchMove = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      const touch = e.touches[0];
      if (!touch) return;

      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const cardEl = elUnder?.closest('[data-goal-index]');
      if (cardEl) {
        const targetIdx = parseInt(cardEl.getAttribute('data-goal-index'), 10);
        if (!isNaN(targetIdx) && targetIdx !== dragInfoRef.current.dropIndex) {
          setDropIndex(targetIdx);
        }
      }
    };

    const onNativeWindowTouchEnd = () => {
      if (touchCleanupRef.current) {
        touchCleanupRef.current();
        touchCleanupRef.current = null;
      }

      const { dragIndex: dIdx, dropIndex: dpIdx, displayGoals: items } = dragInfoRef.current;
      if (dIdx !== null && dpIdx !== null && dIdx !== dpIdx) {
        commitReorder(items);
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(40);
          }
        } catch {}
      }

      touchStateRef.current.isDragging = false;
      setIsTouchDragging(false);
      setDragIndex(null);
      setDropIndex(null);
    };

    window.addEventListener('touchmove', onNativeWindowTouchMove, { passive: false });
    window.addEventListener('touchend', onNativeWindowTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onNativeWindowTouchEnd, { passive: false });

    touchCleanupRef.current = () => {
      window.removeEventListener('touchmove', onNativeWindowTouchMove);
      window.removeEventListener('touchend', onNativeWindowTouchEnd);
      window.removeEventListener('touchcancel', onNativeWindowTouchEnd);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  };

  const handleTouchStart = (index, e) => {
    if (e.target.closest('button')) return;

    const touch = e.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      fromIndex: index,
      isDragging: false,
    };

    const isHandle = Boolean(e.target.closest('[data-drag-handle]'));
    touchTimerRef.current = setTimeout(() => {
      startDragFromTouch(index);
    }, isHandle ? 150 : 450);
  };

  const handleTouchMove = (e) => {
    if (!touchStateRef.current.isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStateRef.current.startX;
      const dy = touch.clientY - touchStateRef.current.startY;
      if (Math.hypot(dx, dy) > 8) {
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

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
      strategy: creationStrategy || null,
    });

    setTargetAmount('');
    setInitialAmount('');
    setCustomTitle('');
    setCreationStrategy(null);
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
              Visualiza y gestiona tus objetivos
              .
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
      </div>

      {/* Horizon Tabs (Corto plazo, Mediano plazo, etc.) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['Todas', 'Corto plazo', 'Mediano plazo', 'Largo plazo'].map((term) => (
          <button
            key={term}
            onClick={() => setSelectedTerm(term)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${selectedTerm === term
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            {term}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono font-semibold">
            {filteredGoals.length} {filteredGoals.length === 1 ? 'meta' : 'metas'}
          </span>
        </div>
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
                      className={`relative rounded-2xl overflow-hidden text-left border p-2.5 transition-all flex flex-col justify-end h-24 sm:h-28 group ${isSelected
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
                    * ¿Cuál es tu Monto Objetivo? (S/)
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
                  Ahorro Inicial que ya tienes (S/ - opcional)
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

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>¿Cómo cumplir tu objetivo? (Opcional)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {INVESTMENT_STRATEGIES.map((strat) => {
                    const isSel = creationStrategy === strat;
                    return (
                      <button
                        key={strat}
                        type="button"
                        onClick={() => setCreationStrategy(isSel ? null : strat)}
                        className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSel
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{strat}</span>
                        {isSel && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
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
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 select-none"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {displayGoals.map((goal, index) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const isCompleted = goal.currentAmount >= goal.targetAmount;
              const bgImage = getGoalImage(goal);
              const isBeingDragged = dragIndex !== null && filteredGoals[dragIndex]?.id === goal.id;
              const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index;

              return (
                <div
                  key={goal.id}
                  data-goal-index={index}
                  draggable
                  onDragStart={(e) => handleDragStart(index, e)}
                  onDragEnter={(e) => handleDragEnter(index, e)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  onTouchStart={(e) => handleTouchStart(index, e)}
                  onClick={() => {
                    if (!touchStateRef.current.isDragging && dragIndex === null) {
                      setStrategyGoal(goal);
                    }
                  }}
                  style={{ touchAction: isTouchDragging ? 'none' : 'pan-y' }}
                  className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group transition-all duration-200 flex flex-col justify-between min-h-[190px] sm:min-h-[210px] cursor-grab active:cursor-grabbing select-none ${
                    isBeingDragged
                      ? 'opacity-85 scale-105 shadow-2xl ring-2 ring-emerald-500 z-30'
                      : isDropTarget
                      ? 'scale-[1.02] ring-2 ring-emerald-400/80 shadow-xl z-20'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  {/* Background Image with Dark Vignette Gradient */}
                  <img
                    src={bgImage}
                    alt={goal.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none" />

                  {/* Card Content Top: Grip Handle and Delete (no strategy pill outside) */}
                  <div className="relative z-10 p-4 pb-2 flex items-start justify-between gap-2">
                    <div
                      data-drag-handle="true"
                      title="Arrastrar para mover posición"
                      className="p-1.5 rounded-xl bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-colors cursor-grab active:cursor-grabbing backdrop-blur-md shrink-0"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteGoal(goal.id);
                      }}
                      title="Eliminar meta"
                      className="p-2 rounded-full bg-slate-950/70 hover:bg-rose-950 text-slate-200 hover:text-rose-400 border border-white/15 transition-colors backdrop-blur-md shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content Bottom: Larger Typography, Progress Bar, Saved Amount (no target total outside) & Deposit Button */}
                  <div className="relative z-10 p-4 pt-2 space-y-3">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 drop-shadow block mb-0.5">
                        {goal.term || 'Mediano plazo'}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md truncate leading-snug">
                        {goal.title}
                      </h3>
                      {goal.subtitle && (
                        <p className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow truncate mt-0.5">
                          {goal.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-black/60 backdrop-blur-md overflow-hidden p-0.5 border border-white/25">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${isCompleted
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300'
                          }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>

                    {/* Numbers Row: Only saved amount & percentage outside */}
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xl sm:text-2xl font-mono font-black text-white leading-tight drop-shadow">
                        {formatCurrency(goal.currentAmount)}
                      </span>

                      <span className="text-xs sm:text-sm font-mono font-black text-emerald-300 bg-black/50 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                        {progress.toFixed(0)}%
                      </span>
                    </div>

                    {/* Bottom Position: Botón de Aportar */}
                    <div className="pt-1">
                      {isCompleted ? (
                        <div className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/90 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          <span>¡Meta Completada!</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDepositGoalId(goal.id);
                          }}
                          className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-emerald-50 text-slate-950 font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Aportar</span>
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

      {/* ========================================================= */}
      {/* MODAL: DETALLE DE OBJETIVO (MONTO OBJETIVO ARRIBA + SECCIÓN MÉTODO) */}
      {/* ========================================================= */}
      {strategyGoal && (() => {
        const modalProgress = strategyGoal.targetAmount > 0
          ? (strategyGoal.currentAmount / strategyGoal.targetAmount) * 100
          : 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4 text-white relative animate-scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                    {strategyGoal.term || 'Objetivo Financiero'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                    {strategyGoal.title}
                  </h3>
                  {strategyGoal.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {strategyGoal.subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStrategyGoal(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PRIMER LUGAR: Total Monto Objetivo y Avance */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Monto Objetivo Total
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {formatCurrency(strategyGoal.targetAmount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      Ahorrado
                    </span>
                    <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-400">
                      {formatCurrency(strategyGoal.currentAmount)} ({modalProgress.toFixed(0)}%)
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, modalProgress))}%` }}
                  />
                </div>
              </div>

              {/* SECCIÓN: ¿Cómo cumplir tu objetivo? */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>¿Cómo cumplir tu objetivo?</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Elige el método o instrumento financiero para esta meta.
                  </p>
                </div>

                {/* Choices List */}
                <div className="space-y-2 max-h-[42vh] overflow-y-auto no-scrollbar pr-0.5">
              {INVESTMENT_STRATEGIES.map((strategy) => {
                const isSelected = strategyGoal.strategy === strategy;
                const details = STRATEGY_DETAILS[strategy] || {};

                return (
                  <button
                    key={strategy}
                    type="button"
                    onClick={() => handleSelectStrategy(strategyGoal.id, strategy)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400/50 shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-extrabold text-xs sm:text-sm text-white">
                          {strategy}
                        </span>
                        {details.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-emerald-300">
                            {details.badge}
                          </span>
                        )}
                      </div>
                      {details.desc && (
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {details.desc}
                        </p>
                      )}
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm'
                        : 'border-slate-700 bg-slate-900/80 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
            </div>

            {/* Transient Feedback Banner: Aparece y desaparece casi al instante */}
            {feedbackNotification && feedbackNotification.goalId === strategyGoal.id && (
              <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-xs rounded-3xl flex items-center justify-center p-4 animate-fade-in pointer-events-none">
                <div className="px-5 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-2xl shadow-emerald-500/50 border border-emerald-300 animate-scale-up text-center">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5] shrink-0" />
                  <span>✓ {feedbackNotification.strategy} guardado</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ); })()}

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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-extrabold font-mono text-slate-400">
                S/
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                autoFocus
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent pl-9 pr-3 py-2.5 text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
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
                  +S/{v}
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
