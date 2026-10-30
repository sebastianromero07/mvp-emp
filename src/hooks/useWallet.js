import { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, INITIAL_BUDGETS, INITIAL_TRANSACTIONS } from '../constants/categories';

const STORAGE_KEYS = {
  BUDGETS: 'emp_wallet_budgets_v1',
  TRANSACTIONS: 'emp_wallet_transactions_v1',
  GOALS: 'emp_wallet_goals_v1',
};

const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Comprar un carro',
    targetAmount: 8500,
    currentAmount: 3200,
    icon: 'car',
  },
  {
    id: 'goal-2',
    title: 'Mensualidad Universidad',
    targetAmount: 1200,
    currentAmount: 800,
    icon: 'study',
  },
  {
    id: 'goal-3',
    title: 'Viaje vacaciones',
    targetAmount: 1500,
    currentAmount: 450,
    icon: 'trip',
  },
  {
    id: 'goal-4',
    title: 'Fiesta de Cumpleaños',
    targetAmount: 500,
    currentAmount: 350,
    icon: 'birthday',
  },
];

export function useWallet() {
  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading budgets from localStorage', e);
    }
    return INITIAL_BUDGETS;
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading goals from localStorage', e);
    }
    return INITIAL_GOALS;
  });

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
  const addGoal = ({ title, targetAmount, currentAmount = 0, icon = 'car', targetDate = null }) => {
    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      icon,
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

  // Compute pocket statistics
  const pocketStats = useMemo(() => {
    const stats = {};

    CATEGORIES.forEach((cat) => {
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
  }, [budgets, transactions]);

  // Global calculations
  const summary = useMemo(() => {
    const totalBudget = Object.values(budgets).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const totalSpent = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalAvailable = totalBudget - totalSpent;

    const emergencyBudget = Number(budgets.emergencias) || 0;
    const emergencySpent = transactions
      .filter((t) => t.categoryId === 'emergencias')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const emergencyAvailable = emergencyBudget - emergencySpent;

    const operationalBudget = totalBudget - emergencyBudget;
    const operationalSpent = totalSpent - emergencySpent;
    const operationalAvailable = operationalBudget - operationalSpent;

    const hasAnyOverdraft = Object.values(pocketStats).some((p) => p.isOutOfFunds);
    const isGlobalDeficit = totalAvailable < 0;

    return {
      totalBudget,
      totalSpent,
      totalAvailable,
      emergencyBudget,
      emergencySpent,
      emergencyAvailable,
      operationalBudget,
      operationalSpent,
      operationalAvailable,
      hasAnyOverdraft,
      isGlobalDeficit,
      // Net Savings metric:
      // Initial unspent balance compared to emergency reserve
      netSavings: totalAvailable,
    };
  }, [budgets, transactions, pocketStats]);

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

  // Reset to seed data
  const resetToSeedData = () => {
    setBudgets(INITIAL_BUDGETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
  };

  // Clear all transactions for clean month
  const clearMonthTransactions = () => {
    setTransactions([]);
  };

  return {
    budgets,
    transactions,
    pocketStats,
    summary,
    addExpense,
    deleteExpense,
    updateBudgets,
    resetToSeedData,
    clearMonthTransactions,
    goals,
    addGoal,
    depositToGoal,
    deleteGoal,
  };
}
