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

export const PRESET_POCKET_CATEGORIES = [
  { id: 'cat-alimentacion', name: 'Alimentación', iconName: 'Utensils', color: 'orange', defaultBudget: 350, hint: 'Mercado, restaurantes, delivery' },
  { id: 'cat-transporte', name: 'Transporte', iconName: 'Car', color: 'blue', defaultBudget: 150, hint: 'Gasolina, metro, taxi, pasajes' },
  { id: 'cat-entretenimiento', name: 'Entretenimiento', iconName: 'Film', color: 'purple', defaultBudget: 100, hint: 'Cine, salidas, streaming' },
  { id: 'cat-emergencias', name: 'Emergencias', iconName: 'ShieldAlert', color: 'green', defaultBudget: 300, hint: 'Salud, imprevistos urgentes' },
  { id: 'cat-educacion', name: 'Educación', iconName: 'GraduationCap', color: 'indigo', defaultBudget: 200, hint: 'Cursos, libros, universidad' },
  { id: 'cat-salud', name: 'Salud', iconName: 'Heart', color: 'rose', defaultBudget: 150, hint: 'Farmacia, consultas, medicinas' },
  { id: 'cat-hogar', name: 'Hogar y Servicios', iconName: 'Home', color: 'amber', defaultBudget: 250, hint: 'Luz, agua, internet, servicios' },
  { id: 'cat-ropa', name: 'Ropa y Calzado', iconName: 'ShoppingBag', color: 'pink', defaultBudget: 120, hint: 'Vestimenta, calzado, compras' },
  { id: 'cat-tecnologia', name: 'Tecnología', iconName: 'Laptop', color: 'cyan', defaultBudget: 100, hint: 'Gadgets, apps, suscripciones' },
  { id: 'cat-viajes', name: 'Viajes', iconName: 'Plane', color: 'teal', defaultBudget: 300, hint: 'Boletos, paseos, estadías' },
  { id: 'cat-cafe', name: 'Café y Salidas', iconName: 'Coffee', color: 'amber', defaultBudget: 60, hint: 'Cafeterías, antojos, amigos' },
  { id: 'cat-otro', name: 'Personalizado', iconName: 'Sparkles', color: 'indigo', defaultBudget: 100, hint: 'Bolsillo a tu medida' },
];

export function getColorTheme(color) {
  switch (color) {
    case 'orange':
      return {
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
      };
    case 'blue':
      return {
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
      };
    case 'purple':
      return {
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
      };
    case 'green':
      return {
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
      };
    case 'rose':
      return {
        gradient: 'from-rose-500 to-pink-600',
        activeBorder: 'border-rose-500 ring-2 ring-rose-500/30',
        bgLight: 'bg-rose-50 dark:bg-rose-500/15',
        text: 'text-rose-600 dark:text-rose-400',
        textAccent: 'text-rose-800 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-500/25',
        badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
        glow: 'shadow-rose-500/20',
        progress: 'bg-gradient-to-r from-rose-500 to-pink-500',
        dot: 'bg-rose-500 dark:bg-rose-400',
      };
    case 'amber':
      return {
        gradient: 'from-amber-500 to-yellow-600',
        activeBorder: 'border-amber-500 ring-2 ring-amber-500/30',
        bgLight: 'bg-amber-50 dark:bg-amber-500/15',
        text: 'text-amber-600 dark:text-amber-400',
        textAccent: 'text-amber-800 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-500/25',
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
        glow: 'shadow-amber-500/20',
        progress: 'bg-gradient-to-r from-amber-500 to-yellow-500',
        dot: 'bg-amber-500 dark:bg-amber-400',
      };
    case 'pink':
      return {
        gradient: 'from-pink-500 to-rose-600',
        activeBorder: 'border-pink-500 ring-2 ring-pink-500/30',
        bgLight: 'bg-pink-50 dark:bg-pink-500/15',
        text: 'text-pink-600 dark:text-pink-400',
        textAccent: 'text-pink-800 dark:text-pink-300',
        border: 'border-pink-200 dark:border-pink-500/25',
        badge: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30',
        glow: 'shadow-pink-500/20',
        progress: 'bg-gradient-to-r from-pink-500 to-rose-500',
        dot: 'bg-pink-500 dark:bg-pink-400',
      };
    case 'cyan':
      return {
        gradient: 'from-cyan-500 to-blue-500',
        activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/30',
        bgLight: 'bg-cyan-50 dark:bg-cyan-500/15',
        text: 'text-cyan-600 dark:text-cyan-400',
        textAccent: 'text-cyan-800 dark:text-cyan-300',
        border: 'border-cyan-200 dark:border-cyan-500/25',
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30',
        glow: 'shadow-cyan-500/20',
        progress: 'bg-gradient-to-r from-cyan-400 to-blue-500',
        dot: 'bg-cyan-500 dark:bg-cyan-400',
      };
    case 'teal':
      return {
        gradient: 'from-teal-500 to-emerald-600',
        activeBorder: 'border-teal-500 ring-2 ring-teal-500/30',
        bgLight: 'bg-teal-50 dark:bg-teal-500/15',
        text: 'text-teal-600 dark:text-teal-400',
        textAccent: 'text-teal-800 dark:text-teal-300',
        border: 'border-teal-200 dark:border-teal-500/25',
        badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30',
        glow: 'shadow-teal-500/20',
        progress: 'bg-gradient-to-r from-teal-400 to-emerald-500',
        dot: 'bg-teal-500 dark:bg-teal-400',
      };
    case 'indigo':
    default:
      return {
        gradient: 'from-indigo-500 to-violet-600',
        activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30',
        bgLight: 'bg-indigo-50 dark:bg-indigo-500/15',
        text: 'text-indigo-600 dark:text-indigo-400',
        textAccent: 'text-indigo-800 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-500/25',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
        glow: 'shadow-indigo-500/20',
        progress: 'bg-gradient-to-r from-indigo-500 to-violet-500',
        dot: 'bg-indigo-500 dark:bg-indigo-400',
      };
  }
}

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
