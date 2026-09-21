import { useState } from 'react';

// تحديد عدة صفوف في الجداول (لحذف أكثر من عنصر دفعة واحدة)
export default function useSelection(items, canSelect = () => true) {
  const [picked, setPicked] = useState(() => new Set());

  const selectable = items.filter(canSelect).map((i) => i.id);
  const selected = selectable.filter((id) => picked.has(id));

  const toggle = (id) => setPicked((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const allSelected = selectable.length > 0 && selected.length === selectable.length;
  const toggleAll = () => setPicked(allSelected ? new Set() : new Set(selectable));
  const clear = () => setPicked(new Set());

  return { selected, isSelected: (id) => picked.has(id), toggle, allSelected, toggleAll, clear };
}
