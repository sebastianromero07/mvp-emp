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

  // Clean up any pending timer
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  // -------------------------------------------------------------
  // DESKTOP: Native HTML5 Drag and Drop
  // -------------------------------------------------------------
  const handleDragStart = (index, e) => {
    // If target was the '+' button, don't start dragging
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
  // MOBILE: Touch Events with Hold/Grip detection
  // -------------------------------------------------------------
  const startDragFromTouch = (index) => {
    touchStateRef.current.isDragging = true;
    setIsTouchDragging(true);
    setDragIndex(index);
    setDropIndex(index);

    // Haptic feedback
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    } catch {}
  };

  const handleTouchStart = (index, e) => {
    if (e.target.closest('button')) return;

    const touch = e.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      fromIndex: index,
      isDragging: false,
    };

    // If user touched the explicit drag handle icon, start immediately
    if (e.target.closest('[data-drag-handle]')) {
      startDragFromTouch(index);
      return;
    }

    // Otherwise, start after 180ms hold
    touchTimerRef.current = setTimeout(() => {
      startDragFromTouch(index);
    }, 180);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - touchStateRef.current.startX;
    const dy = touch.clientY - touchStateRef.current.startY;
    const dist = Math.hypot(dx, dy);

    // If user scrolled before 180ms, cancel drag mode so page can scroll normally
    if (!touchStateRef.current.isDragging) {
      if (dist > 8) {
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
      }
      return;
    }

    // While dragging, prevent page scrolling
    if (e.cancelable) {
      e.preventDefault();
    }

    // Identify card under current touch position
    const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardEl = elUnder?.closest('[data-pocket-index]');
    if (cardEl) {
      const targetIdx = parseInt(cardEl.getAttribute('data-pocket-index'), 10);
      if (!isNaN(targetIdx) && targetIdx !== dropIndex) {
        setDropIndex(targetIdx);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    if (touchStateRef.current.isDragging) {
      if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
        onReorder(displayItems);
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(40);
          }
        } catch {}
      }
    }

    touchStateRef.current.isDragging = false;
    setIsTouchDragging(false);
    setDragIndex(null);
    setDropIndex(null);
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
            className={`relative rounded-2xl transition-all duration-200 cursor-grab active:cursor-grabbing ${
              isBeingDragged
                ? 'opacity-40 scale-95 z-10'
                : isDropTarget
                ? 'scale-[1.03] ring-2 ring-indigo-500 shadow-xl z-20'
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