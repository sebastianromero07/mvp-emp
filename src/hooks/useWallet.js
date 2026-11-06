import { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, INITIAL_BUDGETS, INITIAL_TRANSACTIONS, getColorTheme } from '../constants/categories';

const STORAGE_KEYS = {
  CATEGORIES: 'emp_wallet_categories_v1',
  BUDGETS: 'emp_wallet_budgets_v1',
  TRANSACTIONS: 'emp_wallet_transactions_v1',
  GOALS: 'emp_wallet_goals_v1',
  MODE: 'emp_wallet_mode_v1',
  SEED_BALANCE: 'emp_wallet_seed_balance_v1',
};

const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Comprar Auto',
    subtitle: 'Ahorro para vehículo nuevo',
    targetAmount: 12500,
    currentAmount: 4200,
    icon: 'car',
    term: 'Mediano plazo',
    strategy: 'Ahorro natural',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    badge: 'META ACTIVA',
  },
  {
    id: 'goal-2',
    title: 'Fondo de Emergencia',
    subtitle: 'Seguridad y respaldo',
    targetAmount: 3000,
    currentAmount: 2250,
    icon: 'emergency',
    term: 'Corto plazo',
    strategy: 'Cuenta de alto rendimiento',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    badge: '75% COMPLETADO',
  },
  {
    id: 'goal-3',
    title: 'Viaje a Japón',
    subtitle: 'Vacaciones soñadas',
    targetAmount: 2500,
    currentAmount: 1000,
    icon: 'trip',
    term: 'Corto plazo',
    strategy: null,
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    badge: '40% COMPLETADO',
  },
  {
    id: 'goal-4',
    title: 'Maestría / Universidad',
    subtitle: 'MBA y desarrollo profesional',
    targetAmount: 6000,
    currentAmount: 1500,
    icon: 'study',
    term: 'Mediano plazo',
    strategy: null,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    badge: 'PLANIFICACIÓN',
  },
];

export function useWallet() {
  const [walletMode, setWalletMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODE);
      if (saved === 'seed' || saved === 'demo') return saved;
    } catch {}
    return 'demo';
  });

  const [seedBalance, setSeedBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEED_BALANCE);
      if (saved && !isNaN(parseFloat(saved))) return parseFloat(saved);
    } catch {}
    return 2270;
  });

  const [categories, setCategories] = useState(() => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.MODE);
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (mode === 'seed' && parsed.length === 0) return [];
          if (parsed.length > 0) return parsed;
        }
      }
      if (mode === 'seed') return [];
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }
    return CATEGORIES;
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.MODE);
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
      if (mode === 'seed') return {};
    } catch (e) {
      console.error('Error loading budgets from localStorage', e);
    }
    return INITIAL_BUDGETS;
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.MODE);
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
      if (mode === 'seed') return [];
    } catch (e) {
      console.error('Error loading transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState(() => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.MODE);
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (mode === 'seed' && parsed.length === 0) return [];
          if (parsed.length > 0) return parsed;
        }
      }
      if (mode === 'seed') return [];
    } catch (e) {
      console.error('Error loading goals from localStorage', e);
    }
    return INITIAL_GOALS;
  });

  // Persist mode & seed balance
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, walletMode);
    } catch {}
  }, [walletMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEED_BALANCE, String(seedBalance));
    } catch {}
  }, [seedBalance]);

  // Persist categories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to localStorage', e);
    }
  }, [categories]);

  // Persist budgets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Error saving budgets to localStorage', e);
    }
  }, [budgets]);

  // Persist transactions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage', e);
    }
  }, [transactions]);

  // Persist goals
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Error saving goals to localStorage', e);
    }
  }, [goals]);

  // Add goal
  const addGoal = ({
    title,
    subtitle = '',
    targetAmount,
    currentAmount = 0,
    icon = 'car',
    term = 'Mediano plazo',
    imageUrl = '',
    badge = 'EN CURSO',
    targetDate = null,
  }) => {
    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      subtitle: subtitle || 'Objetivo de ahorro personal',
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      icon,
      term: term || 'Mediano plazo',
      imageUrl: imageUrl || '',
      badge: badge || 'EN CURSO',
      targetDate,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  // Add funds to a goal
  const depositToGoal = (goalId, amount) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + Number(amount) } : g))
    );
  };

  // Delete goal
  const deleteGoal = (goalId) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  // Reorder goals (drag and drop)
  const reorderGoals = (newGoals) => {
    if (Array.isArray(newGoals) && newGoals.length > 0) {
      setGoals(newGoals);
    }
  };

  // Update investment strategy for a goal
  const updateGoalStrategy = (goalId, strategy) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, strategy } : g))
    );
  };

  // Compute pocket statistics
  const pocketStats = useMemo(() => {
    const stats = {};

    categories.forEach((cat) => {
      const budget = Number(budgets[cat.id]) || 0;
      const spent = transactions
        .filter((t) => t.categoryId === cat.id)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const available = budget - spent;
      const spentPercent = budget > 0 ? (spent / budget) * 100 : 0;
      const remainingPercent = budget > 0 ? (available / budget) * 100 : 0;

      // Critical rules specified in prompt:
      // - Si llega a $0 o es negativo: tarjeta roja "Espacio sin fondos"
      // - Si disponible < 15%: barra amarilla
      const isOutOfFunds = available <= 0;
      const isLowFunds = !isOutOfFunds && remainingPercent < 15;

      stats[cat.id] = {
        category: cat,
        budget,
        spent,
        available,
        spentPercent: Math.min(Math.max(spentPercent, 0), 100),
        remainingPercent: Math.max(remainingPercent, 0),
        isOutOfFunds,
        isLowFunds,
      };
    });

    return stats;
  }, [categories, budgets, transactions]);

  // Global calculations
  const summary = useMemo(() => {
    const totalAllocatedInPockets = categories.reduce((sum, cat) => sum + (Number(budgets[cat.id]) || 0), 0);
    const totalSpent = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    let totalBudget = 0;
    let totalAvailable = 0;

    if (walletMode === 'seed') {
      totalBudget = seedBalance;
      // En Modo Semilla, el saldo disponible se resta conforme se asigna presupuesto a bolsillos
      totalAvailable = Math.max(0, seedBalance - totalAllocatedInPockets);
    } else {
      totalBudget = totalAllocatedInPockets;
      totalAvailable = totalBudget - totalSpent;
    }

    const emergencyBudget = Number(budgets.emergencias) || 0;
    const emergencySpent = transactions
      .filter((t) => t.categoryId === 'emergencias')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const emergencyAvailable = emergencyBudget - emergencySpent;

    const operationalBudget = totalAllocatedInPockets - emergencyBudget;
    const operationalSpent = totalSpent - emergencySpent;
    const operationalAvailable = operationalBudget - operationalSpent;

    const hasAnyOverdraft = Object.values(pocketStats).some((p) => p.isOutOfFunds);
    const isGlobalDeficit = totalAvailable < 0;

    return {
      totalBudget,
      totalSpent,
      totalAvailable,
      totalAllocatedInPockets,
      unallocatedBalance: walletMode === 'seed' ? Math.max(0, seedBalance - totalAllocatedInPockets) : totalAvailable,
      emergencyBudget,
      emergencySpent,
      emergencyAvailable,
      operationalBudget,
      operationalSpent,
      operationalAvailable,
      hasAnyOverdraft,
      isGlobalDeficit,
      // Net Savings metric:
      netSavings: totalAvailable,
    };
  }, [budgets, transactions, pocketStats, walletMode, seedBalance, categories]);

  // Add new expense
  const addExpense = ({ categoryId, amount, description }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    if (!categoryId) {
      throw new Error('Selecciona un espacio para el gasto');
    }

    const newTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      categoryId,
      amount: numAmount,
      description: (description || '').trim(),
      timestamp: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  };

  // Delete expense and restore funds
  const deleteExpense = (id) => {
    const found = transactions.find((t) => t.id === id);
    if (!found) return null;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return found;
  };

  // Update budget configuration and optionally reset transactions
  const updateBudgets = (newBudgets, resetExpenses = false) => {
    setBudgets(newBudgets);
    if (resetExpenses) {
      setTransactions([]);
    }
  };

  // Create a new pocket
  const createPocket = ({ name, iconName = 'Wallet', color = 'indigo', budget = 0, hint = '' }) => {
    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      throw new Error('El presupuesto del bolsillo debe ser mayor a 0');
    }
    const cleanName = (name || '').trim();
    if (!cleanName) {
      throw new Error('Debes indicar un nombre para el bolsillo');
    }

    if (walletMode === 'seed') {
      const currentAllocated = categories.reduce((sum, cat) => sum + (Number(budgets[cat.id]) || 0), 0);
      const remainingSeed = seedBalance - currentAllocated;
      if (numBudget > remainingSeed) {
        throw new Error(`El presupuesto ($${numBudget.toFixed(2)}) supera tu Saldo Total disponible ($${remainingSeed.toFixed(2)})`);
      }
    }

    const id = `pocket-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const theme = getColorTheme(color);

    const newCategory = {
      id,
      name: cleanName,
      iconName,
      color,
      theme,
      defaultBudget: numBudget,
      hint: hint || `Gastos de ${cleanName}`,
    };

    setCategories((prev) => [...prev, newCategory]);
    setBudgets((prev) => ({
      ...prev,
      [id]: numBudget,
    }));

    return newCategory;
  };

  // Delete an existing pocket and release its budget
  const deletePocket = (pocketId) => {
    setCategories((prev) => prev.filter((c) => c.id !== pocketId));
    setBudgets((prev) => {
      const next = { ...prev };
      delete next[pocketId];
      return next;
    });
    setTransactions((prev) => prev.filter((t) => t.categoryId !== pocketId));
  };

  // Reset to Modo Semilla (Comienza desde 0 con solo el saldo total)
  const resetToSeedMode = (initialAmount = 2270) => {
    const amount = Number(initialAmount) || 2270;
    setWalletMode('seed');
    setSeedBalance(amount);
    setCategories([]);
    setBudgets({});
    setTransactions([]);
    setGoals([]);
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, 'seed');
      localStorage.setItem(STORAGE_KEYS.SEED_BALANCE, String(amount));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify({}));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]));
    } catch {}
  };

  // Reset to Modo Demo (Demostración precargada)
  const resetToDemoMode = () => {
    setWalletMode('demo');
    setSeedBalance(2270);
    setCategories(CATEGORIES);
    setBudgets(INITIAL_BUDGETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, 'demo');
      localStorage.setItem(STORAGE_KEYS.SEED_BALANCE, '2270');
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    } catch {}
  };

  // Legacy reset (defaults to demo)
  const resetToSeedData = () => {
    resetToDemoMode();
  };

  // Clear all transactions for clean month
  const clearMonthTransactions = () => {
    setTransactions([]);
  };

  // Reorder pockets (drag and drop)
  const reorderCategories = (newOrder) => {
    if (Array.isArray(newOrder) && newOrder.length > 0) {
      setCategories(newOrder);
    }
  };

  return {
    walletMode,
    seedBalance,
    setSeedBalance,
    categories,
    budgets,
    transactions,
    pocketStats,
    summary,
    addExpense,
    deleteExpense,
    updateBudgets,
    createPocket,
    deletePocket,
    reorderCategories,
    resetToSeedMode,
    resetToDemoMode,
    resetToSeedData,
    clearMonthTransactions,
    goals,
    addGoal,
    depositToGoal,
    deleteGoal,
    reorderGoals,
    updateGoalStrategy,
  };
}
