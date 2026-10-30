export const CATEGORIES = [
  {
    id: 'alimentacion',
    name: 'Alimentación',
    iconName: 'Utensils',
    color: 'orange',
    theme: {
      gradient: 'from-amber-500 to-orange-500',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/30',
      bgLight: 'bg-orange-50 dark:bg-orange-500/15',
      text: 'text-orange-600 dark:text-orange-400',
      textAccent: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-500/25',
      badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
      glow: 'shadow-orange-500/20',
      progress: 'bg-gradient-to-r from-amber-500 to-orange-500',
      dot: 'bg-orange-500 dark:bg-orange-400',
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
      bgLight: 'bg-sky-50 dark:bg-sky-500/15',
      text: 'text-sky-600 dark:text-sky-400',
      textAccent: 'text-sky-800 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-500/25',
      badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
      glow: 'shadow-blue-500/20',
      progress: 'bg-gradient-to-r from-sky-400 to-blue-500',
      dot: 'bg-sky-500 dark:bg-sky-400',
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
      bgLight: 'bg-purple-50 dark:bg-purple-500/15',
      text: 'text-purple-600 dark:text-purple-400',
      textAccent: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-500/25',
      badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
      glow: 'shadow-purple-500/20',
      progress: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      dot: 'bg-purple-500 dark:bg-purple-400',
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
      bgLight: 'bg-emerald-50 dark:bg-emerald-500/15',
      text: 'text-emerald-600 dark:text-emerald-400',
      textAccent: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-500/25',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      progress: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
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
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Hoy
  },
  {
    id: 'tx-seed-2',
    categoryId: 'alimentacion',
    amount: 14.50,
    description: 'Café y desayuno',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Ayer
  },
  {
    id: 'tx-seed-3',
    categoryId: 'transporte',
    amount: 22.00,
    description: 'Recarga tarjeta metro y autobús',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Ayer
  },
  {
    id: 'tx-seed-4',
    categoryId: 'alimentacion',
    amount: 28.50,
    description: 'Almuerzo de trabajo',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Hace 2 días
  },
  {
    id: 'tx-seed-5',
    categoryId: 'entretenimiento',
    amount: 35.00,
    description: 'Boletos de cine + palomitas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // Hace 3 días
  },
  {
    id: 'tx-seed-6',
    categoryId: 'transporte',
    amount: 15.00,
    description: 'Taxi Uber',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // Hace 4 días
  },
  {
    id: 'tx-seed-7',
    categoryId: 'alimentacion',
    amount: 18.20,
    description: 'Frutería y panadería',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // Hace 5 días
  },
];
