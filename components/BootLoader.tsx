'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'boot-vu';
const DURATION_MS = 2400;

// Chaque ligne s'affiche quand le compteur atteint son seuil.
const LINES = [
  { at: 0, text: 'FB-OS v2026.09 — démarrage', status: '' },
  { at: 12, text: 'Calibrage du télescope', status: 'OK' },
  { at: 30, text: 'Chargement de 3 600 étoiles', status: 'OK' },
  { at: 48, text: 'Compilation des projets', status: 'OK' },
  { at: 66, text: 'Connexion au profil : Fanel Balemo', status: 'OK' },
  { at: 84, text: 'Mise en orbite', status: '…' },
];

interface Props {
  visible: boolean;
  onDone: () => void;
}

export default function BootLoader({ visible, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      onDone();
    };

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Stockage indisponible : on joue la séquence complète.
    }
    if (alreadySeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // Démarre vite, ralentit vers la fin comme un vrai chargement.
      setProgress(Math.round((1 - Math.pow(1 - t, 2.2)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setTimeout(finish, 250);
    };
    frame = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[radial-gradient(circle_at_center,rgba(10,14,26,0.35),rgba(10,14,26,0.92)_70%)] p-6 font-mono text-xs text-pro-text/70 sm:p-10 sm:text-sm"
        >
          <ul className="space-y-1.5">
            {LINES.filter((line) => progress >= line.at).map((line, i) => (
              <motion.li
                key={line.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex max-w-xl gap-3"
              >
                <span className="text-pro-accent/60">[{(i * 0.117).toFixed(3)}]</span>
                <span className="flex-1 truncate">{line.text}</span>
                {line.status && (
                  <span className={line.status === 'OK' ? 'text-pro-menthe' : 'text-pro-accent'}>
                    {line.status}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="font-heading text-7xl font-extrabold leading-none text-pro-text sm:text-[9rem]">
              {String(progress).padStart(3, '0')}
              <span className="text-pro-accent drop-shadow-[0_0_20px_rgba(142,205,248,0.7)]">
                %
              </span>
            </p>
            <div className="h-px w-full bg-pro-surface2">
              <div
                className="h-full origin-left bg-gradient-to-r from-pro-accent via-pro-lavande to-pro-menthe shadow-glow"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <div className="flex w-full justify-between uppercase tracking-[0.25em] text-pro-text/40">
              <span>Fanel Balemo · Portfolio</span>
              <span className="hidden sm:inline">Cliquer pour passer</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
