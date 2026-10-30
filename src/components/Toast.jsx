import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 sm:bottom-22 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto transition-all">
      <div className={`flex items-center gap-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isSuccess
          ? 'bg-slate-900/95 dark:bg-emerald-950/95 border-emerald-500/50 text-white shadow-emerald-950/40'
          : isError
          ? 'bg-slate-900/95 dark:bg-rose-950/95 border-rose-500/50 text-white shadow-rose-950/40'
          : 'bg-slate-900/95 dark:bg-slate-900/95 border-slate-700/60 text-white shadow-black/40'
      }`}>
        <div className="shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
        </div>
        
        <div className="flex-1 text-sm font-medium leading-tight">
          {toast.message}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-slate-400 hover:text-white"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
