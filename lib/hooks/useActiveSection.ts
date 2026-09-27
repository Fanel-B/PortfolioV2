'use client';

import { useEffect, useState } from 'react';

// Renvoie l'id de la dernière section dont le haut a passé 40 % de l'écran ('' au-dessus de la première).
// Les sections sont retrouvées à chaque scroll, pour suivre celles qui sont remontées après un changement jour/nuit.
export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState('');
  const idsKey = ids.join(',');

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.4;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return activeId;
}
