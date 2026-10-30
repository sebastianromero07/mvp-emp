export const CATEGORIES = [
  {
    id: 'alimentacion',
    name: 'Alimentación',
    iconName: 'Utensils',
    color: 'orange',
    theme: {
      gradient: 'from-amber-500 to-orange-500',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/30',
      bgLight: 'bg-orange-500/10',
      text: 'text-orange-400',
      textAccent: 'text-orange-300',
      border: 'border-orange-500/20',
      badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      glow: 'shadow-orange-500/20',
      progress: 'bg-gradient-to-r from-amber-400 to-orange-500',
      dot: 'bg-orange-400',
    },
    defaultBudget: 400,
    hint: 'Mercado, restaurantes, delivery'
  },
  {
    id: 'transporte',
    name: 'Transporte',
    iconName: 'Car',
    color: 'blue',
    theme: {
      gradient: 'from-sky-500 to-blue-600',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/30',
      bgLight: 'bg-blue-500/10',
      text: 'text-blue-400',
      textAccent: 'text-blue-300',
      border: 'border-blue-500/20',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      glow: 'shadow-blue-500/20',
      progress: 'bg-gradient-to-r from-sky-400 to-blue-500',
      dot: 'bg-blue-400',
    },
    defaultBudget: 150,
    hint: 'Gasolina, metro, taxi, pasajes'
  },
  {
    id: 'entretenimiento',
    name: 'Entretenimiento',
    iconName: 'Film',
    color: 'purple',
    theme: {
      gradient: 'from-purple-500 to-indigo-600',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/30',
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-400',
      textAccent: 'text-purple-300',
      border: 'border-purple-500/20',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      glow: 'shadow-purple-500/20',
      progress: 'bg-gradient-to-r from-purple-400 to-indigo-500',
      dot: 'bg-purple-400',
    },
    defaultBudget: 120,
    hint: 'Cine, streaming, salidas, ocio'
  },
  {
    id: 'emergencias',
    name: 'Emergencias',
    iconName: 'ShieldAlert',
    color: 'green',
    theme: {
      gradient: 'from-emerald-500 to-teal-600',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      bgLight: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      textAccent: 'text-emerald-300',
      border: 'border-emerald-500/20',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      progress: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      dot: 'bg-emerald-400',
    },
    defaultBudget: 350,
    hint: 'Salud, imprevistos, reparaciones'
  }
];

export const INITIAL_BUDGETS = {
  alimentacion: 400,
  transporte: 150,
  entretenimiento: 120,
  emergencias: 350,
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-seed-1',
    categoryId: 'alimentacion',
    amount: 54.20,
    description: 'Supermercado quincenal',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: 'tx-seed-2',
    categoryId: 'transporte',
    amount: 22.00,
    description: 'Recarga tarjeta metro y autobús',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
  },
  {
    id: 'tx-seed-3',
    categoryId: 'alimentacion',
    amount: 28.50,
    description: 'Almuerzo de trabajo',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: 'tx-seed-4',
    categoryId: 'entretenimiento',
    amount: 35.00,
    description: 'Boletos de cine + palomitas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  }
];
