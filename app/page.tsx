'use client';

import CvModal from '@/components/CvModal';
import FloatingSun from '@/components/FloatingSun';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero/Hero';
import Navbar from '@/components/Navbar/Navbar';
import Outils from '@/components/Outils/Outils';
import Personnalite from '@/components/Personnalite/Personnalite';
import EpisodeTeaser from '@/components/QuiJeSuis/EpisodeTeaser';
import QuiJeSuis from '@/components/QuiJeSuis/QuiJeSuis';
import ScrollProgress from '@/components/ScrollProgress';
import type { Side } from '@/components/Sky/SkyBackground';
import TargetCursor from '@/components/TargetCursor';
import Travail from '@/components/Travail/Travail';
import { container } from '@/lib/ui';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

// Three.js (≈ 1,3 Mo) est chargé à part, pour que la page s'affiche sans l'attendre.
const SkyBackground = dynamic(() => import('@/components/Sky/SkyBackground'), { ssr: false });

const SWAP = { duration: 0.22, ease: 'easeOut' };

export default function Page() {
  const [side, setSide] = useState<Side>('pro');
  const [cvOpen, setCvOpen] = useState(false);

  const openCv = useCallback(() => setCvOpen(true), []);
  const closeCv = useCallback(() => setCvOpen(false), []);
  const flip = useCallback(() => setSide((s) => (s === 'pro' ? 'perso' : 'pro')), []);

  return (
    <MotionConfig reducedMotion="user">
      <SkyBackground side={side} />
      <TargetCursor side={side} />
      <ScrollProgress />
      <Navbar side={side} onFlip={flip} onOpenCv={openCv} />
      {side === 'pro' && <FloatingSun onOpen={flip} />}

      {/* Bascule pro ↔ humain : fondu rapide (une rotation 3D de toute la page était trop lourde). */}
      {/* initial={false} : pas d'animation au premier affichage, seulement lors d'une bascule. */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={side}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: SWAP }}
          exit={{ opacity: 0, transition: SWAP }}
        >
          {side === 'pro' ? (
            <>
              <Hero onOpenCv={openCv} />
              <QuiJeSuis />
              <Outils />
              <Travail />
              {/* Comme dans un anime : l'aperçu du prochain épisode arrive à la fin de celui-ci. */}
              <section id="prochain-episode" className={`${container} pb-28 pt-8 md:pb-40`}>
                <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-pro-text/40">
                  {"// Fin de l'épisode 01"}
                </p>
                <EpisodeTeaser onOpen={flip} />
              </section>
              <Footer />
            </>
          ) : (
            <Personnalite onClose={flip} />
          )}
        </motion.main>
      </AnimatePresence>

      <CvModal open={cvOpen} onClose={closeCv} />
    </MotionConfig>
  );
}
