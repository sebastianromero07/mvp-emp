import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  Camera,
  CameraOff,
  AlertCircle,
  Loader2
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

  // Live Browser Camera States
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const autoDetectTimerRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const category = categories.find((c) => c.id === categoryId) || categories[0];
  const stats = pocketStats && category ? pocketStats[category.id] : null;
  const availableBalance = stats ? stats.available : 0;

  const stopCamera = () => {
    if (autoDetectTimerRef.current) {
      clearTimeout(autoDetectTimerRef.current);
      autoDetectTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setViewState('SCANNER');
      setFlashlightOn(false);
      setAmount('');
      setConcept('Pago con QR');
      setTransactionReceipt(null);
      setCameraError(null);
      setCameraActive(false);
      setCameraLoading(false);

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
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, categoryId]);

  // Ensure stream attaches to video element when camera becomes active
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  // Clean up camera when leaving SCANNER view
  useEffect(() => {
    if (viewState !== 'SCANNER') {
      stopCamera();
    }
  }, [viewState]);

  if (!isOpen) return null;

  const handleSimulateScan = (customAmount = 24.50) => {
    stopCamera();
    setAmount(customAmount.toString());
    setViewState('CONFIRM');
  };

  // Triggers browser camera permission request: navigator.mediaDevices.getUserMedia
  const handleStartCameraAndScan = async (customAmount = 24.50) => {
    setCameraError(null);
    setCameraLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no tiene soporte directo para cámara web.');
      }

      // Solicitud nativa del navegador para prender la cámara
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setCameraActive(true);
      setCameraLoading(false);

      // Vibración de inicio
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(40);
        }
      } catch {}

      // Mantiene la cámara encendida transmitiendo en vivo durante 2.5s y simula la lectura del QR
      autoDetectTimerRef.current = setTimeout(() => {
        stopCamera();
        handleSimulateScan(customAmount);
      }, 2500);

    } catch (err) {
      console.warn('Error al solicitar cámara:', err);
      setCameraLoading(false);
      setCameraActive(false);

      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setCameraError(
        isDenied
          ? 'Permiso de cámara no concedido en el navegador.'
          : 'No se pudo acceder a la cámara en este dispositivo.'
      );

      // Si se denegó el permiso, permitimos continuar al flujo de pago tras un breve aviso
      setTimeout(() => {
        handleSimulateScan(customAmount);
      }, 1800);
    }
  };

  const handleToggleFlashlight = async () => {
    const nextState = !flashlightOn;
    setFlashlightOn(nextState);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && typeof track.applyConstraints === 'function') {
        try {
          const capabilities = track.getCapabilities ? track.getCapabilities() : {};
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: nextState }],
            });
          }
        } catch (e) {
          console.warn('Torch constraint warning:', e);
        }
      }
    }
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
                onClick={handleToggleFlashlight}
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
            <div className="my-auto flex flex-col items-center justify-center z-10 py-3">
              <div className="text-center mb-3">
                <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                  <span>Escanear código QR</span>
                  {cameraActive && (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cameraActive
                    ? 'Cámara activa: Apunta al QR para cobrar'
                    : 'Apunta la cámara al QR del comercio o persona'}
                </p>
              </div>

              {/* Viewfinder Box */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-indigo-500/60 bg-black/60 backdrop-blur-xs flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-950/80">
                {/* Real Live Video Feed from Browser Camera */}
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : (
                  /* QR Placeholder Watermark when camera is inactive */
                  <QrCode className="w-32 h-32 text-indigo-400/20" />
                )}

                {/* Loading state while browser prompt is open */}
                {cameraLoading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-25 p-4 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
                    <p className="text-xs text-white font-semibold">
                      Solicitando acceso a la cámara...
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Acepta el permiso en tu navegador para continuar
                    </span>
                  </div>
                )}

                {/* Camera error / Denied permission badge */}
                {cameraError && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-25 p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-xs text-slate-200 font-semibold mb-1">
                      {cameraError}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Continuando con detección simulada...
                    </span>
                  </div>
                )}

                {/* 4 Corner Accents (Yape style) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl z-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl z-20 pointer-events-none" />

                {/* Animated Laser Scanning Line */}
                <div
                  className="absolute left-3 right-3 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none"
                  style={{ animation: 'scanLine 2s ease-in-out infinite' }}
                />

                {/* Balance display badge */}
                <div className="absolute bottom-3 px-3 py-1 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-md z-20 pointer-events-none shadow-md">
                  <span className="text-[11px] text-slate-300 font-mono">
                    Disponible: <strong className="text-emerald-400 font-bold">{formatCurrency(availableBalance)}</strong>
                  </span>
                </div>
              </div>

              {/* Bottom Quick Triggers */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => handleStartCameraAndScan(24.50)}
                  disabled={cameraLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/35 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {cameraLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : cameraActive ? (
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  ) : (
                    <Camera className="w-4 h-4 text-cyan-300" />
                  )}
                  <span>
                    {cameraActive
                      ? 'Detectando QR en vivo...'
                      : 'Simular Escaneo QR'}
                  </span>
                </button>

                <div className="flex items-center gap-2 w-full">
                  {cameraActive && (
                    <button
                      type="button"
                      onClick={() => handleSimulateScan(24.50)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Detectar Ya</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setViewState('CONFIRM');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 active:scale-95 transition-all"
                  >
                    <span>Ingresar Monto</span>
                  </button>
                </div>
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
          <form
            onSubmit={handleConfirmPayment}
            className="flex-1 flex flex-col justify-between p-5 sm:p-6 min-h-full overflow-y-auto"
          >
            {/* Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 shrink-0">
              <button
                type="button"
                onClick={() => setViewState('SCANNER')}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al escáner</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Center Content: Centrado y balanceado verticalmente en la pantalla */}
            <div className="my-auto py-4 sm:py-6 space-y-4 sm:space-y-5 flex flex-col justify-center">
              {/* Merchant Card */}
              <div className="p-4 rounded-3xl bg-slate-950/90 border border-slate-800/90 flex items-center gap-3.5 shadow-lg">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs uppercase font-extrabold text-slate-400 tracking-wider block">
                    Pagar a comercio
                  </span>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="font-black text-base sm:text-lg text-white bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none w-full truncate"
                  />
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Código QR verificado
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="text-center space-y-2.5">
                <label
                  htmlFor="qr-amount"
                  className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-400 block"
                >
                  ¿Cuánto deseas pagar?
                </label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-black font-mono text-slate-400">
                    S/
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
                    className="w-full pl-15 pr-5 py-3.5 bg-slate-950 border-2 border-indigo-500 rounded-3xl text-3xl sm:text-4xl font-black font-mono text-white text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-2xl"
                  />
                </div>

                {/* Quick Add Chips */}
                <div className="flex justify-center gap-2 pt-1">
                  {[5, 10, 20, 50].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleQuickAdd(v)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-extrabold font-mono text-slate-200 active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      +S/{v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concept Input */}
              <div>
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Mensaje o concepto (opcional)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Source Pocket Summary */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${category?.theme?.bgLight} ${category?.theme?.text}`}>
                    <CategoryIcon iconName={category?.iconName} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-slate-400 block leading-tight font-medium">Debitar de</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white leading-tight">{category?.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] sm:text-xs text-slate-400 block leading-tight font-medium">Disponible</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 leading-tight">
                    {formatCurrency(availableBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 pb-1 shrink-0">
              <button
                type="submit"
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-indigo-600/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Confirmar Pago de S/ {parseFloat(amount || 0).toFixed(2)}</span>
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
