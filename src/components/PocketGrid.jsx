import React, { useState, useRef, useMemo, useEffect } from 'react';
import { PocketCard } from './PocketCard';
import { GripVertical, Wallet } from 'lucide-react';

export function PocketGrid({
  categories,
  pocketStats,
  onReorder,
  onSelectPocket,
  onOpenQRPay,
  onOpenExpenseModal,
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  const touchTimerRef = useRef(null);
  const touchCleanupRef = useRef(null);
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    fromIndex: null,
    isDragging: false,
  });

  // Compute live preview of reordered items while dragging
  const displayItems = useMemo(() => {
    if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) {
      return categories;
    }
    const result = [...categories];
    const [moved] = result.splice(dragIndex, 1);
    result.splice(dropIndex, 0, moved);
    return result;
  }, [categories, dragIndex, dropIndex]);

  // Keep a ref of live drag info so window-level touch listeners always see fresh values
  const dragInfoRef = useRef({ dragIndex, dropIndex, displayItems });
  useEffect(() => {
    dragInfoRef.current = { dragIndex, dropIndex, displayItems };
  }, [dragIndex, dropIndex, displayItems]);

  // Clean up any pending timer and listeners on unmount
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      if (touchCleanupRef.current) touchCleanupRef.current();
    };
  }, []);

  // -------------------------------------------------------------
  // DESKTOP: Native HTML5 Drag and Drop
  // -------------------------------------------------------------
  const handleDragStart = (index, e) => {
    if (e.target.closest('button')) {
      e.preventDefault();
      return;
    }
    setDragIndex(index);
    setDropIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnter = (targetIndex, e) => {
    e.preventDefault();
    if (dragIndex !== null && targetIndex !== dropIndex) {
      setDropIndex(targetIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      const updated = [...categories];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      onReorder(updated);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  // -------------------------------------------------------------
  // MOBILE: Touch Drag and Drop with 450ms Long Press
  // -------------------------------------------------------------
  const handleTouchStart = (index, e) => {
    if (e.target.closest('button')) {
      return;
    }

    const touch = e.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      fromIndex: index,
      isDragging: false,
    };

    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }

    touchTimerRef.current = setTimeout(() => {
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      } catch {}

      touchStateRef.current.isDragging = true;
      setIsTouchDragging(true);
      setDragIndex(index);
      setDropIndex(index);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleGlobalTouchMove = (moveEvent) => {
        if (!touchStateRef.current.isDragging) return;
        if (moveEvent.cancelable) {
          moveEvent.preventDefault();
        }

        const currentTouch = moveEvent.touches[0];
        const elemUnderFinger = document.elementFromPoint(currentTouch.clientX, currentTouch.clientY);
        if (!elemUnderFinger) return;

        const targetCard = elemUnderFinger.closest('[data-pocket-index]');
        if (targetCard) {
          const newIdx = parseInt(targetCard.getAttribute('data-pocket-index'), 10);
          if (!isNaN(newIdx) && newIdx !== dragInfoRef.current.dropIndex) {
            setDropIndex(newIdx);
          }
        }
      };

      const handleGlobalTouchEnd = () => {
        document.body.style.overflow = originalOverflow;

        window.removeEventListener('touchmove', handleGlobalTouchMove, { capture: true });
        window.removeEventListener('touchend', handleGlobalTouchEnd, { capture: true });
        window.removeEventListener('touchcancel', handleGlobalTouchEnd, { capture: true });
        touchCleanupRef.current = null;

        const { dragIndex: dIdx, dropIndex: dpIdx, displayItems: dItems } = dragInfoRef.current;
        if (dIdx !== null && dpIdx !== null && dIdx !== dpIdx) {
          onReorder(dItems);
        }

        touchStateRef.current.isDragging = false;
        setIsTouchDragging(false);
        setDragIndex(null);
        setDropIndex(null);
      };

      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false, capture: true });
      window.addEventListener('touchend', handleGlobalTouchEnd, { capture: true });
      window.addEventListener('touchcancel', handleGlobalTouchEnd, { capture: true });

      touchCleanupRef.current = () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('touchmove', handleGlobalTouchMove, { capture: true });
        window.removeEventListener('touchend', handleGlobalTouchEnd, { capture: true });
        window.removeEventListener('touchcancel', handleGlobalTouchEnd, { capture: true });
      };
    }, 450);
  };

  const handleTouchMove = (e) => {
    if (!touchStateRef.current.isDragging && touchTimerRef.current) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStateRef.current.startX);
      const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);
      if (deltaX > 8 || deltaY > 8) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center gap-3 bg-white/40 dark:bg-slate-900/30">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
          <Wallet className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            Aún no tienes bolsillos creados
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Pulsa en el botón <strong>+ Crear Bolsillo</strong> abajo para empezar a repartir tu saldo disponible en categorías estancas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:gap-3 select-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {displayItems.map((cat, index) => {
        const isBeingDragged = dragIndex !== null && categories[dragIndex]?.id === cat.id;
        const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={cat.id}
            data-pocket-index={index}
            data-tour={index === 0 ? "pocket-card" : undefined}
            draggable
            onDragStart={(e) => handleDragStart(index, e)}
            onDragEnter={(e) => handleDragEnter(index, e)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onTouchStart={(e) => handleTouchStart(index, e)}
            style={{ touchAction: isTouchDragging ? 'none' : 'pan-y' }}
            className={`relative rounded-3xl transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
              isBeingDragged
                ? 'opacity-80 scale-105 shadow-2xl ring-2 ring-indigo-500 z-30'
                : isDropTarget
                ? 'scale-[1.02] ring-2 ring-indigo-400/80 shadow-lg z-20'
                : 'hover:scale-[1.01]'
            }`}
          >
            {/* Pocket Card */}
            <PocketCard
              stats={pocketStats[cat.id] || {
                category: cat,
                budget: cat.defaultBudget || 0,
                spent: 0,
                available: cat.defaultBudget || 0,
                spentPercent: 0,
                isOutOfFunds: false,
                isLowFunds: false,
              }}
              onSelectPocket={(catId) => {
                if (!touchStateRef.current.isDragging && dragIndex === null) {
                  onSelectPocket(catId);
                }
              }}
              onOpenQRPay={onOpenQRPay || onOpenExpenseModal}
            />

            {/* Subtle Drag Grip Handle Indicator */}
            <div
              data-drag-handle="true"
              title="Arrastrar para mover posición"
              className="absolute bottom-2.5 left-3 text-slate-300 dark:text-slate-700 hover:text-indigo-500 dark:hover:text-indigo-400 p-1 rounded-lg transition-colors cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
