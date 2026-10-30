import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { CATEGORIES } from './constants/categories';
import { Header } from './components/Header';
import { PocketCard } from './components/PocketCard';
import { PocketDetailView } from './components/PocketDetailView';
import { ReportView } from './components/ReportView';
import { GoalsView } from './components/GoalsView';
import { NavigationFooter } from './components/NavigationFooter';
import { BudgetModal } from './components/BudgetModal';
import { QuickExpenseModal } from './components/QuickExpenseModal';
import { Toast } from './components/Toast';
import { formatCurrency } from './utils/formatters';
import { AlertTriangle, TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react';

export default function App() {
  const {
    budgets,
    transactions,
    pocketStats,
    summary,
    goals,
    addGoal,
    depositToGoal,
    deleteGoal,
    addExpense,
    deleteExpense,
    updateBudgets,
    resetToSeedData,
  } = useWallet();

  const [activeTab, setActiveTab] = useState('billetera'); // 'reporte' | 'billetera' | 'objetivos'
  const [selectedPocketId, setSelectedPocketId] = useState(null); // When user taps a pocket card to view its dedicated space
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleOpenExpenseModal = (catId) => {
    setSelectedCategory(catId || CATEGORIES[0].id);
    setIsExpenseModalOpen(true);
  };

  const handleAddExpense = ({ categoryId, amount, description }) => {
    try {
      addExpense({ categoryId, amount, description });
      const cat = CATEGORIES.find((c) => c.id === categoryId);
      showToast(`Gasto de $${amount.toFixed(2)} registrado en ${cat ? cat.name : 'Espacio'}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteExpense = (id) => {
    const deleted = deleteExpense(id);
    if (deleted) {
      const cat = CATEGORIES.find((c) => c.id === deleted.categoryId);
      showToast(`Gasto de $${deleted.amount.toFixed(2)} eliminado y saldo restaurado en ${cat ? cat.name : 'su espacio'}.`, 'info');
    }
  };

  const handleAddGoal = (goalData) => {
    try {
      addGoal(goalData);
      showToast(`Meta "${goalData.title}" creada con éxito.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDepositToGoal = (goalId, amount) => {
    try {
      depositToGoal(goalId, amount);
      showToast(`Se sumaron $${amount.toFixed(2)} a tu meta.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteGoal = (goalId) => {
    deleteGoal(goalId);
    showToast('Objetivo eliminado.', 'info');
  };

  const handleSaveBudgets = (newBudgets, resetTransactions) => {
    updateBudgets(newBudgets, resetTransactions);
    if (resetTransactions) {
      showToast('Presupuestos guardados y mes reiniciado con éxito.', 'success');
    } else {
      showToast('Presupuestos mensuales actualizados.', 'success');
    }
  };

  const handleResetDemo = () => {
    resetToSeedData();
    setSelectedPocketId(null);
    scrollToTop();
    showToast('Datos semilla restaurados para demostración.', 'info');
  };

  // Scroll smoothly to top of current screen
  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (document.body) {
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'billetera') {
      setSelectedPocketId(null);
    }
    scrollToTop();
    requestAnimationFrame(() => {
      scrollToTop();
    });
  };

  // Quick helper to test the critical rule in 1 click
  const handleTriggerTestOverdraft = () => {
    const currentAlim = pocketStats.alimentacion.available;
    addExpense({
      categoryId: 'alimentacion',
      amount: currentAlim + 15,
      description: 'Prueba de sobregiro (Demo MVP)',
    });
    showToast('Sobregiro simulado en Alimentación para verificar alerta roja.', 'error');
  };

  const isNetPositive = summary.totalAvailable >= 0;
  const isMainScreen = activeTab === 'billetera' && !selectedPocketId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200 antialiased overflow-x-hidden">
      {/* Top Header - Solo fijo para la pantalla principal del medio (Billetera) */}
      {isMainScreen && (
        <Header
          onOpenConfig={() => setIsConfigOpen(true)}
          onResetDemo={handleResetDemo}
        />
      )}

      {/* Main Container - Optimized for mobile & desktop with dynamic safe padding */}
      <main className={`flex-1 w-full max-w-lg mx-auto px-3.5 sm:px-4 pb-24 space-y-4 ${
        isMainScreen
          ? 'pt-[calc(max(0.75rem,env(safe-area-inset-top,0.75rem))+4.25rem)]'
          : 'pt-[max(1rem,env(safe-area-inset-top,1rem))]'
      }`}>

        {/* ========================================================= */}
        {/* TAB 1: BILLETERA (Dashboard 4 Bolsillos O Espacio Propio)  */}
        {/* ========================================================= */}
        {activeTab === 'billetera' && (
          selectedPocketId ? (
            <PocketDetailView
              category={CATEGORIES.find((c) => c.id === selectedPocketId) || CATEGORIES[0]}
              stats={pocketStats[selectedPocketId] || pocketStats.alimentacion}
              transactions={transactions}
              onBack={() => {
                setSelectedPocketId(null);
                scrollToTop();
              }}
              onOpenExpenseModal={(catId) => handleOpenExpenseModal(catId)}
              onDeleteExpense={handleDeleteExpense}
            />
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Compact Balance Ribbon */}
              <div className="rounded-2xl glass-card p-3.5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                      Saldo Total Disponible
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xl sm:text-2xl font-extrabold font-mono tracking-tight ${
                        summary.totalAvailable < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {formatCurrency(summary.totalAvailable)}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        / {formatCurrency(summary.totalBudget)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Savings badge */}
                <button
                  onClick={() => handleSelectTab('reporte')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md active:scale-95 transition-all ${
                    isNetPositive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                  }`}
                  title="Ver desglose en Reporte"
                >
                  {isNetPositive ? (
                    <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                  )}
                  <span>
                    Ahorro: {isNetPositive ? '+' : ''}{formatCurrency(summary.totalAvailable)}
                  </span>
                </button>
              </div>

              {/* 2. Pocket Cards in 2x2 GRID */}
              <section aria-label="Bolsillos de Presupuesto">
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Tus Espacios Estancos
                    </h2>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      4 bolsillos
                    </span>
                  </div>
                  
                  <button
                    onClick={handleTriggerTestOverdraft}
                    className="text-[10px] sm:text-[11px] text-amber-600 hover:text-amber-700 dark:text-amber-400/90 dark:hover:text-amber-300 transition-colors flex items-center gap-1 font-medium hover:underline"
                    title="Simula un gasto superior al saldo para verificar alerta"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Probar sobregiro</span>
                  </button>
                </div>

                {/* 2x2 GRID ALWAYS ON MOBILE & DESKTOP */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {CATEGORIES.map((cat) => (
                    <PocketCard
                      key={cat.id}
                      stats={pocketStats[cat.id]}
                      onSelectPocket={(catId) => {
                        setSelectedPocketId(catId);
                        scrollToTop();
                      }}
                      onOpenExpenseModal={(catId) => handleOpenExpenseModal(catId)}
                    />
                  ))}
                </div>
              </section>

              {/* Quick Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => handleOpenExpenseModal('alimentacion')}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar un Gasto en un Bolsillo</span>
                </button>
              </div>
            </div>
          )
        )}

        {/* ========================================================= */}
        {/* TAB 2: REPORTE (En vez de Historial, comparativa y gráficos) */}
        {/* ========================================================= */}
        {activeTab === 'reporte' && (
          <div className="animate-fade-in">
            <ReportView
              summary={summary}
              pocketStats={pocketStats}
              transactions={transactions}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: OBJETIVOS (En vez de Rendimiento, carros, viaje, etc.) */}
        {/* ========================================================= */}
        {activeTab === 'objetivos' && (
          <div className="animate-fade-in">
            <GoalsView
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateSaved={handleDepositToGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        )}

      </main>

      {/* Fixed Bottom Navigation Footer */}
      <NavigationFooter
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        transactionCount={transactions.length}
        goalCount={goals.length}
      />

      {/* Modal for adding expense directly when tapping a pocket '+' button or the action button */}
      <QuickExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        categoryId={selectedCategory}
        onAddExpense={handleAddExpense}
        pocketStats={pocketStats}
      />

      {/* Budget Configuration / Month Reset Modal */}
      <BudgetModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        currentBudgets={budgets}
        onSaveBudgets={handleSaveBudgets}
        onResetToDemo={handleResetDemo}
      />

      {/* Floating Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
