import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto transition-all animate-bounce-in">
      <div className={`flex items-center gap-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
          : isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/50'
          : 'bg-slate-900/90 border-slate-700/60 text-slate-100 shadow-black/60'
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
