'use client';

import type { Project } from '@/data/profile';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const WIDTH = 280;
const HEIGHT = 180;
// Décalage par rapport à la souris : la fenêtre ne cache pas le titre qu'on survole.
const OFFSET = 28;
const MAX_TILT = 6;

interface Props {
  /** Projet dont le titre est survolé, ou null : la fenêtre disparaît. */
  project: Project | null;
}

// Vrai seulement avec une souris, sans demande de mouvement réduit.
function useApercuActif() {
  const [actif, setActif] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    const update = () => setActif(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return actif;
}

// Fenêtre de capture qui suit la souris au survol des titres de projets fermés.
export default function ApercuCurseur({ project }: Props) {
  const actif = useApercuActif();

  // Position visée : mise à jour à chaque mouvement de souris, sans rendu React.
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  // Position affichée : un ressort tire la fenêtre vers la position visée.
  const x = useSpring(mouseX, { stiffness: 260, damping: 26, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 260, damping: 26, mass: 0.6 });
  // Inclinaison : proportionnelle à la vitesse horizontale, bornée à 6 degrés, et adoucie.
  const velocityX = useVelocity(x);
  const tilt = useTransform(velocityX, [-1200, 0, 1200], [-MAX_TILT, 0, MAX_TILT], {
    clamp: true,
  });
  const rotate = useSpring(tilt, { stiffness: 200, damping: 20 });

  // Dernier projet survolé : gardé pendant le fondu de sortie, pour ne pas vider la fenêtre.
  const [shown, setShown] = useState<Project | null>(null);
  useEffect(() => {
    if (project) setShown(project);
  }, [project]);

  useEffect(() => {
    if (!actif) return;
    let first = true;
    const onMove = (event: PointerEvent) => {
      // Près du bord droit, la fenêtre passe à gauche de la souris.
      const right = event.clientX + OFFSET + WIDTH > window.innerWidth - 16;
      const left = right ? event.clientX - OFFSET - WIDTH : event.clientX + OFFSET;
      const top = Math.min(
        Math.max(event.clientY - HEIGHT / 2, 16),
        window.innerHeight - HEIGHT - 16
      );
      if (first) {
        // Premier mouvement : la fenêtre se place sans traverser l'écran depuis le coin.
        x.jump(left);
        y.jump(top);
        first = false;
      }
      mouseX.set(left);
      mouseY.set(top);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [actif, mouseX, mouseY, x, y]);

  if (!actif) return null;

  const visible = project !== null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, rotate, width: WIDTH, height: HEIGHT }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pointer-events-none fixed left-0 top-0 z-[150] overflow-hidden rounded-xl bg-papier-encre p-1.5 shadow-feuille"
    >
      {/* Seule l'image change d'un titre à l'autre : fondu croisé rapide. */}
      <AnimatePresence initial={false}>
        {shown?.image && (
          <motion.div
            key={shown.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`absolute inset-1.5 overflow-hidden rounded-lg ${
              shown.imageFit === 'contain' ? 'bg-white' : ''
            }`}
          >
            <Image
              src={shown.image}
              alt=""
              fill
              sizes={`${WIDTH}px`}
              className={
                shown.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover object-top'
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
