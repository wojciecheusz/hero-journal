import { useEffect } from 'react';

/**
 * Automatycznie rozwija i przewija do encji wskazanej przez openEntity.
 * @param {object|null} openEntity - { name: string } lub null
 * @param {Array}       list       - tablica encji z polem .name i .id
 * @param {Function}    setExpanded - setter stanu expanded ({ [id]: bool })
 */
export function useScrollToEntity(openEntity, list, setExpanded) {
  useEffect(() => {
    if (!openEntity?.name) return;
    const found = list.find(item => item.name?.toLowerCase() === openEntity.name.toLowerCase());
    if (!found) return;
    setExpanded(e => ({ ...e, [found.id]: true }));
    setTimeout(() => {
      document.getElementById(`entity-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }, [openEntity, list, setExpanded]);
}
