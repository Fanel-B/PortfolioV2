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

const FLIP = { duration: 0.45, ease: [0.65, 0, 0.35, 1] };

export default function Page() {
  const [side, setSide] = useState<Side>('pro');
  const [cvOpen, setCvOpen] = useState(false);
  // Point de vue de la rotation : le milieu de l'écran, où que l'on soit dans la page.
  const [flipOrigin, setFlipOrigin] = useState(400);

  const openCv = useCallback(() => setCvOpen(true), []);
  const closeCv = useCallback(() => setCvOpen(false), []);
  const flip = useCallback(() => {
    setFlipOrigin(window.scrollY + window.innerHeight / 2);
    setSide((s) => (s === 'pro' ? 'perso' : 'pro'));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <SkyBackground side={side} />
      <TargetCursor side={side} />
      <ScrollProgress />
      <Navbar side={side} onFlip={flip} onOpenCv={openCv} />
      {side === 'pro' && <FloatingSun onOpen={flip} />}

      {/* On retourne la page comme une carte : l'ancienne face pivote, puis la nouvelle arrive. */}
      <div style={{ perspective: 1800, perspectiveOrigin: `50% ${flipOrigin}px` }}>
        {/* initial={false} : pas de rotation au premier affichage, seulement lors d'une bascule. */}
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => {
            window.scrollTo(0, 0);
            setFlipOrigin(window.innerHeight / 2);
          }}
        >
          <motion.main
            key={side}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1, transition: FLIP }}
            exit={{ rotateY: 90, opacity: 0, transition: FLIP }}
            style={{ transformOrigin: `50% ${flipOrigin}px` }}
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
      </div>

      <CvModal open={cvOpen} onClose={closeCv} />
    </MotionConfig>
  );
}
