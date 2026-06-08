import { useState, useRef, useCallback, useEffect } from 'react';

const findIdAtPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  const row = el?.closest?.('[data-drag-id]');
  if (!row) return null;
  const raw = row.getAttribute('data-drag-id');
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
};

// Reorder via natywne HTML5 DnD (desktop) lub dotyk (mobile, drag-handle + elementFromPoint)
export function useDragReorder(setList) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverIdState] = useState(null);
  const dragIdRef = useRef(null);
  const overIdRef = useRef(null);

  const setOverId = id => { overIdRef.current = id; setOverIdState(id); };

  const reorder = useCallback((fromId, toId) => {
    setList(list => {
      const next = [...list];
      const fromIdx = next.findIndex(i => i.id === fromId);
      const toIdx   = next.findIndex(i => i.id === toId);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return list;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, [setList]);

  const endDrag = useCallback(targetId => {
    const fromId = dragIdRef.current;
    const toId   = targetId ?? overIdRef.current;
    if (fromId != null && toId != null && toId !== fromId) reorder(fromId, toId);
    dragIdRef.current = null;
    overIdRef.current = null;
    setDragId(null);
    setOverIdState(null);
  }, [reorder]);

  const startDrag = useCallback(id => {
    dragIdRef.current = id;
    overIdRef.current = id;
    setDragId(id);
    setOverIdState(id);
  }, []);

  useEffect(() => {
    if (dragId == null) return;
    const onMove = e => {
      const t = e.touches?.[0];
      if (!t) return;
      e.preventDefault();
      const id = findIdAtPoint(t.clientX, t.clientY);
      if (id != null) setOverId(id);
    };
    const onEnd = e => {
      const t = e.changedTouches?.[0];
      endDrag(t ? findIdAtPoint(t.clientX, t.clientY) : null);
    };
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
    return () => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    };
  }, [dragId, endDrag]);

  const bindRow = id => ({
    'data-drag-id': id,
    draggable: true,
    onDragStart: () => startDrag(id),
    onDragOver: e => { e.preventDefault(); if (dragIdRef.current != null) setOverId(id); },
    onDrop: () => endDrag(id),
    onDragEnd: () => endDrag(null),
  });

  const bindHandle = id => ({
    onTouchStart: e => { e.stopPropagation(); startDrag(id); },
  });

  return { dragId, overId, bindRow, bindHandle };
}
