'use client';

import BootLoader from '@/components/BootLoader';
import CvModal from '@/components/CvModal';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero/Hero';
import Navbar from '@/components/Navbar/Navbar';
import Outils from '@/components/Outils/Outils';
import Personnalite from '@/components/Personnalite/Personnalite';
import QuiJeSuis from '@/components/QuiJeSuis/QuiJeSuis';
import ScrollProgress from '@/components/ScrollProgress';
import SkyBackground, { Side } from '@/components/Sky/SkyBackground';
import TargetCursor from '@/components/TargetCursor';
import Travail from '@/components/Travail/Travail';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useCallback, useState } from 'react';

const FLIP = { duration: 0.45, ease: [0.65, 0, 0.35, 1] };

export default function Page() {
  const [booted, setBooted] = useState(false);
  const [side, setSide] = useState<Side>('pro');
  const [cvOpen, setCvOpen] = useState(false);
  // Point de vue de la rotation : le milieu de l'écran, où que l'on soit dans la page.
  const [flipOrigin, setFlipOrigin] = useState(400);

  const onBooted = useCallback(() => setBooted(true), []);
  const openCv = useCallback(() => setCvOpen(true), []);
  const closeCv = useCallback(() => setCvOpen(false), []);
  const flip = useCallback(() => {
    setFlipOrigin(window.scrollY + window.innerHeight / 2);
    setSide((s) => (s === 'pro' ? 'perso' : 'pro'));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <BootLoader visible={!booted} onDone={onBooted} />
      <SkyBackground side={side} warp={!booted} />
      <TargetCursor side={side} />
      <ScrollProgress />
      <Navbar side={side} visible={booted} onFlip={flip} onOpenCv={openCv} />

      {/* On retourne la page comme une carte : l'ancienne face pivote, puis la nouvelle arrive. */}
      <div style={{ perspective: 1800, perspectiveOrigin: `50% ${flipOrigin}px` }}>
        <AnimatePresence
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
                <Hero ready={booted} onOpenCv={openCv} />
                <QuiJeSuis onOpenHuman={flip} />
                <Outils />
                <Travail />
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
