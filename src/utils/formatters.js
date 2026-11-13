export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num));
  return num < 0 ? `-S/ ${formatted}` : `S/ ${formatted}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  
  const isToday = 
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = 
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Hoy, ${timeStr}`;
  }
  if (isYesterday) {
    return `Ayer, ${timeStr}`;
  }

  return `${date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}, ${timeStr}`;
}
