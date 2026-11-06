import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { CATEGORIES } from './constants/categories';
import { Header } from './components/Header';
import { PocketCard } from './components/PocketCard';
import { PocketGrid } from './components/PocketGrid';
import { PocketDetailView } from './components/PocketDetailView';
import { ReportView } from './components/ReportView';
import { GoalsView } from './components/GoalsView';
import { NavigationFooter } from './components/NavigationFooter';
import { BudgetModal } from './components/BudgetModal';
import { QuickExpenseModal } from './components/QuickExpenseModal';
import { QRScannerModal } from './components/QRScannerModal';
import { CreatePocketModal } from './components/CreatePocketModal';
import { Toast } from './components/Toast';
import { formatCurrency } from './utils/formatters';
import { AlertTriangle, Plus } from 'lucide-react';

export default function App() {
  const {
    categories,
    budgets,
    transactions,
    pocketStats,
    summary,
    goals,
    addGoal,
    depositToGoal,
    deleteGoal,
    reorderGoals,
    addExpense,
    deleteExpense,
    updateBudgets,
    createPocket,
    reorderCategories,
    resetToSeedData,
  } = useWallet();

  const [activeTab, setActiveTab] = useState('billetera'); // 'reporte' | 'billetera' | 'objetivos'
  const [selectedPocketId, setSelectedPocketId] = useState(null); // When user taps a pocket card to view its dedicated space
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isQRPayOpen, setIsQRPayOpen] = useState(false);
  const [qrPocketId, setQrPocketId] = useState(null);
  const [isCreatePocketOpen, setIsCreatePocketOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleOpenExpenseModal = (catId) => {
    setSelectedCategory(catId || categories[0]?.id || CATEGORIES[0].id);
    setIsExpenseModalOpen(true);
  };

  const handleOpenQRPay = (catId) => {
    setQrPocketId(catId || categories[0]?.id || CATEGORIES[0].id);
    setIsQRPayOpen(true);
  };

  const handleCreatePocket = (pocketData) => {
    try {
      const newPocket = createPocket(pocketData);
      showToast(`Bolsillo "${newPocket.name}" creado con éxito ($${pocketData.budget.toFixed(2)}).`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddExpense = ({ categoryId, amount, description }) => {
    try {
      addExpense({ categoryId, amount, description });
      const cat = categories.find((c) => c.id === categoryId);
      showToast(`Gasto de $${amount.toFixed(2)} registrado en ${cat ? cat.name : 'Espacio'}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteExpense = (id) => {
    const deleted = deleteExpense(id);
    if (deleted) {
      const cat = categories.find((c) => c.id === deleted.categoryId);
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
        {/* TAB 1: BILLETERA (Dashboard Bolsillos O Espacio Propio)    */}
        {/* ========================================================= */}
        {activeTab === 'billetera' && (
          selectedPocketId ? (
            <PocketDetailView
              category={categories.find((c) => c.id === selectedPocketId) || categories[0] || CATEGORIES[0]}
              stats={pocketStats[selectedPocketId] || pocketStats.alimentacion || Object.values(pocketStats)[0]}
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
              {/* Prominent Balance Ribbon - Centered without PiggyBank icon */}
              <div className="rounded-3xl glass-card p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/80 shadow-md dark:shadow-none flex flex-col items-center justify-center text-center">
                <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 font-extrabold block mb-1.5">
                  Saldo Total Disponible
                </span>
                <div className="flex items-baseline justify-center gap-2.5">
                  <span className={`text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight leading-none ${
                    summary.totalAvailable < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {formatCurrency(summary.totalAvailable)}
                  </span>
                  <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold font-mono">
                    / {formatCurrency(summary.totalBudget)}
                  </span>
                </div>
              </div>

              {/* 2. Pocket Cards in 2x2 GRID with Drag & Drop */}
              <section aria-label="Bolsillos de Presupuesto">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    TUS BOLSILLOS
                  </h2>
                  
                  <button
                    onClick={handleTriggerTestOverdraft}
                    className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400/90 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 font-bold hover:underline"
                    title="Simula un gasto superior al saldo para verificar alerta"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Probar sobregiro</span>
                  </button>
                </div>

                {/* Interactive Drag & Drop Reorderable Grid */}
                <PocketGrid
                  categories={categories}
                  pocketStats={pocketStats}
                  onReorder={reorderCategories}
                  onSelectPocket={(catId) => {
                    setSelectedPocketId(catId);
                    scrollToTop();
                  }}
                  onOpenQRPay={handleOpenQRPay}
                  onOpenExpenseModal={(catId) => handleOpenExpenseModal(catId)}
                />
              </section>

              {/* Action Button: Crear Bolsillo */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePocketOpen(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>Crear Bolsillo</span>
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
              categories={categories}
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
              onReorderGoals={reorderGoals}
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

      {/* Modal for creating a new pocket */}
      <CreatePocketModal
        isOpen={isCreatePocketOpen}
        onClose={() => setIsCreatePocketOpen(false)}
        onCreatePocket={handleCreatePocket}
      />

      {/* Modal for adding expense directly when tapping a pocket '+' button */}
      <QuickExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        categoryId={selectedCategory}
        onAddExpense={handleAddExpense}
        pocketStats={pocketStats}
      />

      {/* Yape-Style QR Scanner & Payment Flow Modal */}
      <QRScannerModal
        isOpen={isQRPayOpen}
        onClose={() => setIsQRPayOpen(false)}
        categoryId={qrPocketId}
        categories={categories}
        pocketStats={pocketStats}
        onPayExpense={handleAddExpense}
      />

      {/* Budget Configuration / Month Reset Modal */}
      <BudgetModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        currentBudgets={budgets}
        categories={categories}
        onSaveBudgets={handleSaveBudgets}
        onResetToDemo={handleResetDemo}
      />

      {/* Floating Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
