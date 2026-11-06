import React, { useState, useRef, useMemo, useEffect } from 'react';
import { PocketCard } from './PocketCard';
import { GripVertical } from 'lucide-react';

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
    // If target was a button, don't start dragging
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
      onReorder(displayItems);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      onReorder(displayItems);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  // -------------------------------------------------------------
  // MOBILE: Long-Press Touch Drag & Drop (450ms hold + page lock)
  // -------------------------------------------------------------
  const startDragFromTouch = (index) => {
    touchStateRef.current.isDragging = true;
    setIsTouchDragging(true);
    setDragIndex(index);
    setDropIndex(index);

    // Haptic vibration feedback to confirm card is picked up
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([45, 25, 45]);
      }
    } catch {}

    // Lock page scrolling while dragging so screen does NOT move
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const onNativeWindowTouchMove = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      const touch = e.touches[0];
      if (!touch) return;

      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const cardEl = elUnder?.closest('[data-pocket-index]');
      if (cardEl) {
        const targetIdx = parseInt(cardEl.getAttribute('data-pocket-index'), 10);
        if (!isNaN(targetIdx) && targetIdx !== dragInfoRef.current.dropIndex) {
          setDropIndex(targetIdx);
        }
      }
    };

    const onNativeWindowTouchEnd = () => {
      if (touchCleanupRef.current) {
        touchCleanupRef.current();
        touchCleanupRef.current = null;
      }

      const { dragIndex: dIdx, dropIndex: dpIdx, displayItems: items } = dragInfoRef.current;
      if (dIdx !== null && dpIdx !== null && dIdx !== dpIdx) {
        onReorder(items);
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(40);
          }
        } catch {}
      }

      touchStateRef.current.isDragging = false;
      setIsTouchDragging(false);
      setDragIndex(null);
      setDropIndex(null);
    };

    window.addEventListener('touchmove', onNativeWindowTouchMove, { passive: false });
    window.addEventListener('touchend', onNativeWindowTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onNativeWindowTouchEnd, { passive: false });

    touchCleanupRef.current = () => {
      window.removeEventListener('touchmove', onNativeWindowTouchMove);
      window.removeEventListener('touchend', onNativeWindowTouchEnd);
      window.removeEventListener('touchcancel', onNativeWindowTouchEnd);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  };

  const handleTouchStart = (index, e) => {
    // If user tapped a button (like QR), ignore drag
    if (e.target.closest('button')) return;

    const touch = e.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      fromIndex: index,
      isDragging: false,
    };

    // If touching the explicit grip handle, start slightly faster (150ms), otherwise hold 450ms
    const isHandle = Boolean(e.target.closest('[data-drag-handle]'));
    touchTimerRef.current = setTimeout(() => {
      startDragFromTouch(index);
    }, isHandle ? 150 : 450);
  };

  const handleTouchMove = (e) => {
    // If not dragging yet, check if finger moved > 8px (scrolling the page)
    if (!touchStateRef.current.isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStateRef.current.startX;
      const dy = touch.clientY - touchStateRef.current.startY;
      if (Math.hypot(dx, dy) > 8) {
        // User is scrolling the page, cancel long-press drag
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    // If finger lifted before 450ms, cancel the hold timer
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

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
                // Only select if not dragging
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