import { useEffect, useState } from 'react';

/**
 * prefers-reduced-motion apto para hidratación: el primer render da false, igual que el HTML
 * prerenderizado, y el valor real llega en un effect. `useReducedMotion` de framer-motion lee la
 * preferencia en el primer render del cliente y provoca un mismatch cuando está activa.
 */
export const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduceMotion;
};
