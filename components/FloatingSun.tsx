'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onOpen: () => void;
}

// Petit soleil qui flotte dans un coin une fois le hero passé : un raccourci discret vers le côté humain.
// Il se cache quand la grande carte « Épisode 02 » est à l'écran, pour ne pas faire doublon.
export default function FloatingSun({ onOpen }: Props) {
  const [show, setShow] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const greeted = useRef(false);

  useEffect(() => {
    let teaserVisible = false;
    const update = () => setShow(window.scrollY > window.innerHeight * 0.8 && !teaserVisible);

    const teaser = document.getElementById('prochain-episode');
    const observer = new IntersectionObserver(([entry]) => {
      teaserVisible = entry.isIntersecting;
      update();
    });
    if (teaser) observer.observe(teaser);

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, []);

  // La bulle se présente une seule fois, à la première apparition.
  useEffect(() => {
    if (!show || greeted.current) return;
    greeted.current = true;
    setGreeting(true);
    const timer = setTimeout(() => setGreeting(false), 4500);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 30 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-24 right-4 z-30 md:bottom-8 md:right-8"
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label="Découvrir l'humain derrière le code"
            className="group relative block"
          >
            <span
              className={`absolute bottom-1/2 right-full mr-3 w-max max-w-[60vw] translate-y-1/2 rounded-2xl border border-perso-accent/30 bg-perso-bg/90 px-4 py-2 text-left font-mono text-xs text-perso-text shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                greeting
                  ? 'translate-x-0 opacity-100'
                  : 'pointer-events-none translate-x-2 opacity-0'
              }`}
            >
              Psst… il y a un humain derrière le code →
            </span>

            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative block h-16 w-16 md:h-[72px] md:w-[72px]"
            >
              <span className="absolute inset-0 rounded-full bg-perso-accent/50 blur-xl transition-transform duration-500 group-hover:scale-150" />
              <Image
                src="/static/images/perso/soleil-sdo.jpg"
                alt=""
                fill
                sizes="72px"
                className="animate-[spin_60s_linear_infinite] rounded-full object-cover mix-blend-screen [mask-image:radial-gradient(circle,black_55%,transparent_71%)]"
              />
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
