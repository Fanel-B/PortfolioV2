'use client';

import SectionHeader from '@/components/SectionHeader';
import { profile, ProjectCategory } from '@/data/profile';
import { container } from '@/lib/ui';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from '@/lib/icons';
import ProjectCard from './ProjectCard';

type Filter = 'Tous' | ProjectCategory;
const FILTERS: Filter[] = ['Tous', 'Web', 'Data', 'IA'];

export default function Travail() {
  const [filter, setFilter] = useState<Filter>('Tous');
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Les projets mis en avant ouvrent le carrousel ; l'ordre du fichier fait le reste.
  const projects = profile.projects
    .filter((project) => filter === 'Tous' || project.categories.includes(filter))
    .slice()
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const syncArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft >= max - 8);
  }, []);

  // Au montage et au redimensionnement : sur un écran assez large pour tout afficher,
  // il n'y a rien à faire défiler et les deux flèches doivent être éteintes.
  useEffect(() => {
    syncArrows();
    window.addEventListener('resize', syncArrows);
    return () => window.removeEventListener('resize', syncArrows);
  }, [syncArrows]);

  // Au changement de filtre on revient au début, sinon on reste sur une zone vide.
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    const id = window.setTimeout(syncArrows, 400);
    return () => window.clearTimeout(id);
  }, [filter, syncArrows]);

  const scrollByPage = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section id="lancements" className="scroll-mt-24 py-28 md:py-40">
      <div className={container}>
        <div className="mb-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="03"
            kicker="Lancements"
            title={
              <>
                Les projets que j&apos;ai <span className="text-pro-accent">mis en orbite.</span>
              </>
            }
          />

          <div className="flex flex-wrap items-center gap-4">
            <div
              role="tablist"
              aria-label="Filtrer les projets"
              className="flex w-fit gap-1 rounded-full border border-white/10 bg-pro-bg/60 p-1 font-mono text-sm"
            >
              <LayoutGroup id="filters">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={filter === f}
                    onClick={() => setFilter(f)}
                    className={`relative rounded-full px-5 py-2 transition-colors ${
                      filter === f ? 'text-pro-bg' : 'text-pro-text/60 hover:text-pro-text'
                    }`}
                  >
                    {filter === f && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-pro-accent shadow-glow"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{f}</span>
                  </button>
                ))}
              </LayoutGroup>
            </div>

            {/* Flèches de confort à la souris ; le rail reste utilisable au doigt et au clavier. */}
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Projets précédents"
                className="rounded-full border border-white/10 p-3 text-pro-text/70 transition-colors hover:border-pro-accent/40 hover:text-pro-accent disabled:pointer-events-none disabled:opacity-30"
              >
                <HiOutlineArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Projets suivants"
                className="rounded-full border border-white/10 p-3 text-pro-text/70 transition-colors hover:border-pro-accent/40 hover:text-pro-accent disabled:pointer-events-none disabled:opacity-30"
              >
                <HiOutlineArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Le rail déborde du conteneur : les cartes filent jusqu'aux bords de l'écran. */}
      <div
        ref={railRef}
        onScroll={syncArrows}
        // Une zone qui défile doit être atteignable au clavier (WCAG 2.1.1) :
        // sans tabIndex, les projets au-delà du premier écran sont inaccessibles.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label="Carrousel des projets"
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-6 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pro-accent/40 md:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence>
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              number={profile.projects.indexOf(project) + 1}
              featured={Boolean(project.featured)}
              className="w-[min(80vw,320px)] shrink-0 snap-start"
            />
          ))}
        </AnimatePresence>
      </div>

      <div className={container}>
        <p className="mt-6 font-mono text-xs text-pro-text/45">
          {projects.length} projet{projects.length > 1 ? 's' : ''} · faites défiler horizontalement
        </p>
      </div>
    </section>
  );
}
