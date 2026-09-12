'use client';

import ThemeSwitch from '@/components/ThemeSwitch';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const SECTION_IDS = ['moi', 'outils', 'travail'];

const NAV_ITEMS = [
  { id: 'moi', label: 'MOI' },
  { id: 'outils', label: 'MES OUTILS' },
  { id: 'travail', label: 'MON TRAVAIL' },
];

interface Props {
  onOpenPersonality: () => void;
}

export default function Navbar({ onOpenPersonality }: Props) {
  const activeId = useActiveSection(SECTION_IDS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-md dark:border-pro-surface2/60 dark:bg-pro-bg/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <button
          onClick={() => scrollTo('moi')}
          className="font-accent text-lg text-pro-accent"
          aria-label="Retour en haut"
        >
          FB.
        </button>

        <nav className="hidden items-center gap-6 font-accent text-sm tracking-wide md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`transition-colors hover:text-pro-accent ${
                activeId === item.id ? 'text-pro-accent' : 'text-gray-600 dark:text-pro-text/70'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onOpenPersonality}
            className="text-gray-600 transition-colors hover:text-pro-accent dark:text-pro-text/70"
          >
            MA PERSONNALITÉ
          </button>
          <a
            href="/static/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-pro-accent px-4 py-1.5 text-pro-accent transition-colors hover:bg-pro-accent hover:text-white"
          >
            CV
          </a>
          <ThemeSwitch />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitch />
          <button
            type="button"
            aria-label="Basculer le menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-gray-900 dark:text-pro-text"
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-gray-200/60 px-4 pb-4 font-accent text-sm dark:border-pro-surface2/60 md:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`py-2 text-left ${
                activeId === item.id ? 'text-pro-accent' : 'text-gray-600 dark:text-pro-text/70'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenPersonality();
              setMobileOpen(false);
            }}
            className="py-2 text-left text-gray-600 dark:text-pro-text/70"
          >
            MA PERSONNALITÉ
          </button>
          <a
            href="/static/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="py-2 text-left text-pro-accent"
          >
            CV
          </a>
        </nav>
      )}
    </header>
  );
}
