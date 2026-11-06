import React, { useState, useEffect } from 'react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import {
  X,
  QrCode,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Store,
  ShieldCheck,
  Share2
} from 'lucide-react';

export function QRScannerModal({
  isOpen,
  onClose,
  categoryId,
  categories = [],
  pocketStats,
  onPayExpense,
}) {
  const [viewState, setViewState] = useState('SCANNER'); // 'SCANNER' | 'CONFIRM' | 'SUCCESS'
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [amount, setAmount] = useState('');
  const [merchantName, setMerchantName] = useState('Comercio QR - Don Pepe');
  const [concept, setConcept] = useState('Pago con QR');
  const [transactionReceipt, setTransactionReceipt] = useState(null);

  const category = categories.find((c) => c.id === categoryId) || categories[0];
  const stats = pocketStats && category ? pocketStats[category.id] : null;
  const availableBalance = stats ? stats.available : 0;

  useEffect(() => {
    if (isOpen) {
      setViewState('SCANNER');
      setFlashlightOn(false);
      setAmount('');
      setConcept('Pago con QR');
      setTransactionReceipt(null);
      // Pre-select a realistic merchant
      const merchants = [
        'Restaurante Don Pepe',
        'Cafetería y Pastelería Central',
        'Supermercado La Esquina',
        'Taxi Seguro VIP',
        'Farmacia Salud & Vida',
        'Tienda Minimarket Express',
      ];
      setMerchantName(merchants[Math.floor(Math.random() * merchants.length)]);
    }
  }, [isOpen, categoryId]);

  if (!isOpen) return null;

  const handleSimulateScan = (customAmount = 24.50) => {
    setAmount(customAmount.toString());
    setViewState('CONFIRM');
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    // Trigger payment in the pocket
    onPayExpense({
      categoryId: category.id,
      amount: numAmount,
      description: `${merchantName} (${concept || 'Pago QR'})`,
    });

    // Create receipt
    const receipt = {
      operationNumber: Math.floor(100000 + Math.random() * 900000),
      merchant: merchantName,
      amount: numAmount,
      pocketName: category.name,
      pocketIcon: category.iconName,
      pocketColor: category.color,
      date: new Date().toISOString(),
      remainingBalance: availableBalance - numAmount,
    };

    setTransactionReceipt(receipt);
    setViewState('SUCCESS');
  };

  const handleQuickAdd = (val) => {
    const curr = parseFloat(amount) || 0;
    setAmount((curr + val).toFixed(2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fade-in p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden text-white">

        {/* ======================================================== */}
        {/* VIEW 1: YAPE-STYLE CAMERA QR SCANNER                    */}
        {/* ======================================================== */}
        {viewState === 'SCANNER' && (
          <div className="flex-1 flex flex-col justify-between p-5 pt-8 sm:p-6 relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between z-20">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-md"
                aria-label="Cerrar escáner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Source Pocket Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${category?.theme?.bgLight || 'bg-indigo-500/20'} ${category?.theme?.text || 'text-indigo-400'}`}>
                  <CategoryIcon iconName={category?.iconName} className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block leading-tight font-medium">
                    Pagando desde
                  </span>
                  <span className="text-xs font-bold text-white leading-tight block">
                    {category?.name}
                  </span>
                </div>
              </div>

              {/* Flashlight button */}
              <button
                type="button"
                onClick={() => setFlashlightOn(!flashlightOn)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all backdrop-blur-md active:scale-95 ${
                  flashlightOn
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Linterna"
              >
                <Zap className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Camera Viewfinder with Scanner Animation */}
            <div className="my-auto flex flex-col items-center justify-center z-10 py-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Escanear código QR
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Apunta la cámara al QR del comercio o persona
                </p>
              </div>

              {/* Viewfinder Box */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-indigo-500/50 bg-black/40 backdrop-blur-xs flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-950/80">
                {/* 4 Corner Accents (Yape style) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl" />

                {/* Animated Laser Scanning Line */}
                <div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />

                {/* QR Background Watermark */}
                <QrCode className="w-32 h-32 text-indigo-400/15" />

                {/* Balance display badge */}
                <div className="absolute bottom-3 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-slate-300 font-mono">
                    Disponible: <strong className="text-emerald-400 font-bold">{formatCurrency(availableBalance)}</strong>
                  </span>
                </div>
              </div>

              {/* Bottom Quick Triggers */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => handleSimulateScan(18.50)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Simular Escaneo QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewState('CONFIRM')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 active:scale-95 transition-all"
                >
                  <span>Ingresar Monto</span>
                </button>
              </div>
            </div>

            {/* Bottom info */}
            <div className="text-center z-10 pt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-400">
                Acepta pagos con QR de cualquier billetera o comercio
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: CONFIRM PAYMENT SCREEN (Enter / confirm amount) */}
        {/* ======================================================== */}
        {viewState === 'CONFIRM' && (
          <form onSubmit={handleConfirmPayment} className="flex-1 flex flex-col justify-between p-5 pt-7 sm:p-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewState('SCANNER')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al escáner</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Merchant Card */}
              <div className="mt-5 p-4 rounded-3xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Pagar a comercio
                  </span>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="font-extrabold text-base text-white bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none w-full truncate"
                  />
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Código QR verificado
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mt-6 text-center">
                <label htmlFor="qr-amount" className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  ¿Cuánto deseas pagar?
                </label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-black font-mono text-slate-400">
                    $
                  </span>
                  <input
                    id="qr-amount"
                    type="number"
                    step="any"
                    min="0.01"
                    autoFocus
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-indigo-500 rounded-3xl text-3xl sm:text-4xl font-black font-mono text-white text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-xl"
                  />
                </div>

                {/* Quick Add Chips */}
                <div className="flex justify-center gap-2 mt-3">
                  {[5, 10, 20, 50].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleQuickAdd(v)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold font-mono text-slate-200 active:scale-95 transition-all"
                    >
                      +${v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concept Input */}
              <div className="mt-5">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Mensaje o concepto (opcional)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Source Pocket Summary */}
              <div className="mt-4 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${category?.theme?.bgLight} ${category?.theme?.text}`}>
                    <CategoryIcon iconName={category?.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Debitar de</span>
                    <span className="text-xs font-bold text-white leading-tight">{category?.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block leading-tight">Disponible</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 leading-tight">
                    {formatCurrency(availableBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-extrabold text-base tracking-wide shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Confirmar Pago de ${parseFloat(amount || 0).toFixed(2)}</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: YAPE-STYLE SUCCESS CELEBRATION RECEIPT          */}
        {/* ======================================================== */}
        {viewState === 'SUCCESS' && transactionReceipt && (
          <div className="flex-1 flex flex-col justify-between p-6 text-center animate-fade-in">
            <div className="pt-4">
              {/* Animated Success Badge */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-2xl shadow-emerald-500/40 flex items-center justify-center animate-bounce">
                <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-4 tracking-tight">
                ¡Pago Realizado con Éxito!
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprobante de pago QR
              </p>

              {/* Big Amount Display */}
              <div className="my-5 p-4 rounded-3xl bg-slate-950/80 border border-slate-800">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight block">
                  {formatCurrency(transactionReceipt.amount)}
                </span>
                <span className="text-sm font-bold text-white block mt-1">
                  {transactionReceipt.merchant}
                </span>
              </div>

              {/* Receipt Details Box */}
              <div className="rounded-2xl bg-slate-950/50 border border-slate-800/80 p-4 space-y-2.5 text-left text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Bolsillo debitado:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CategoryIcon iconName={transactionReceipt.pocketIcon} className="w-3.5 h-3.5 text-indigo-400" />
                    {transactionReceipt.pocketName}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Saldo restante:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {formatCurrency(transactionReceipt.remainingBalance)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">N° de operación:</span>
                  <span className="font-mono font-bold text-indigo-400">
                    #{transactionReceipt.operationNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Fecha y hora:</span>
                  <span className="text-[11px] text-slate-300">
                    {formatDateTime(transactionReceipt.date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-auto flex flex-col gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-600/30 active:scale-[0.98] transition-all cursor-pointer"
              >
                Volver a Mis Bolsillos
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
