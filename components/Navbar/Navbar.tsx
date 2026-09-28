'use client';

import type { Side } from '@/components/Sky/SkyBackground';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons/lib';
import {
  HiOutlineArrowLeft,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineLightningBolt,
  HiOutlineSun,
  HiOutlineUser,
} from '@/lib/icons';

const NAV_ITEMS: { id: string; label: string; icon: IconType }[] = [
  { id: 'accueil', label: 'Accueil', icon: HiOutlineHome },
  { id: 'origine', label: 'Origine', icon: HiOutlineUser },
  { id: 'arsenal', label: 'Arsenal', icon: HiOutlineCube },
  { id: 'lancements', label: 'Lancements', icon: HiOutlineLightningBolt },
];
const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

interface Props {
  side: Side;
  onFlip: () => void;
  onOpenCv: () => void;
}

const linkBase =
  'relative z-10 flex flex-col items-center gap-1 rounded-full px-2 py-2 text-[10px] transition-colors md:flex-row md:gap-2 md:px-4 md:text-sm';

export default function Navbar({ side, onFlip, onOpenCv }: Props) {
  const activeId = useActiveSection(SECTION_IDS) || 'accueil';
  const isPerso = side === 'perso';

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="fixed inset-x-0 bottom-0 z-40 md:bottom-auto md:top-5 md:flex md:justify-center"
    >
      <nav
        aria-label="Navigation principale"
        className={`flex items-center justify-around gap-1 border-t px-2 pb-3 pt-2 font-mono backdrop-blur-xl md:justify-center md:rounded-full md:border md:px-2 md:py-1.5 ${
          isPerso
            ? 'border-perso-accent/15 bg-perso-bg/75 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'border-white/10 bg-pro-bg/70 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
        }`}
      >
        {isPerso ? (
          <>
            <span className="hidden items-center gap-2 px-4 text-sm text-perso-accent md:flex">
              <HiOutlineSun /> L&apos;humain
            </span>
            <button
              onClick={onFlip}
              className={`${linkBase} bg-perso-accent/10 text-perso-text hover:bg-perso-accent/20`}
            >
              <HiOutlineArrowLeft size={16} />
              Retour côté pro
            </button>
          </>
        ) : (
          <>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  aria-current={active ? 'true' : undefined}
                  className={`${linkBase} ${id === 'accueil' ? 'hidden md:flex' : ''} ${
                    active ? 'text-pro-text' : 'text-pro-text/50 hover:text-pro-text/80'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 -z-10 rounded-full border border-pro-accent/40 bg-pro-accent/15 shadow-[0_0_20px_rgba(142,205,248,0.2)]"
                    />
                  )}
                  <Icon size={16} className="md:hidden lg:block" />
                  {label}
                </button>
              );
            })}
            <span className="mx-1 hidden h-5 w-px bg-white/10 md:block" />
            <button
              onClick={onOpenCv}
              className={`${linkBase} text-pro-accent hover:text-pro-text`}
            >
              <HiOutlineDocumentText size={16} className="md:hidden lg:block" />
              CV
            </button>
            <button
              onClick={onFlip}
              className={`${linkBase} text-perso-accent hover:text-perso-text`}
              title="Découvrir l'humain derrière le code"
            >
              <HiOutlineSun size={16} className="md:hidden lg:block" />
              L&apos;humain
            </button>
          </>
        )}
      </nav>
    </motion.header>
  );
}
