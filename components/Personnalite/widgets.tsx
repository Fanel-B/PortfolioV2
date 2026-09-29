'use client';

import { useEffect, useState } from 'react';

const TIME_ZONE = 'Europe/Paris';

// Heure de Toulouse, en direct. Rien n'est rendu côté serveur pour éviter un décalage à l'hydratation.
export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now?.toLocaleTimeString('fr-FR', { timeZone: TIME_ZONE }) ?? '--:--:--';
  const date =
    now?.toLocaleDateString('fr-FR', {
      timeZone: TIME_ZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }) ?? '';

  return (
    <div>
      <p className="font-mono text-4xl tabular-nums text-perso-text md:text-5xl">{time}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-perso-text/40">
        Toulouse · {date}
      </p>
    </div>
  );
}
