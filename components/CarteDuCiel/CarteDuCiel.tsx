'use client';

import SectionHeader from '@/components/SectionHeader';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProjectPanel, { PANEL_ID, statusOf } from './ProjectPanel';

// Repère du dessin : les positions ci-dessous sont exprimées dans ce cadre.
const VIEW = { width: 300, height: 180 };

// Une étoile par projet, dans l'ordre de data/profile.ts, placées à la main
// pour dessiner un W (forme de Cassiopée). Ajouter un point ici quand un projet est ajouté.
const POSITIONS: { x: number; y: number }[] = [
  { x: 40, y: 70 }, // Biblio-Tech
  { x: 100, y: 140 }, // Insertion des diplômés MIAGE
  { x: 150, y: 95 }, // Qualité des sources d'offres d'alternance
  { x: 210, y: 140 }, // TechScope
  { x: 265, y: 45 }, // JobBot
];

// Traits entre étoiles, par numéro de position.
const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];

const MINT = '#9EE6CF';
const ACCENT = '#8ECDF8';
const STAR = '#EAF4FF';

// Seuls les projets qui ont une position sont dessinés ; la liste mobile les montre tous.
const projects = profile.projects;
const starCount = Math.min(projects.length, POSITIONS.length);

// Vrai au-dessus de 768 px. Faux pendant le rendu serveur : seul le placement du panneau en dépend,
// et il n'apparaît qu'après un clic.
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return desktop;
}

export default function CarteDuCiel() {
  // hovered : étoile survolée ou ciblée au clavier. selected : étoile dont la fiche est ouverte.
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const isDesktop = useIsDesktop();

  // Le serveur ne connaît pas la préférence du visiteur. On la lit seulement après le chargement,
  // sinon le HTML du serveur et celui du navigateur diffèrent (erreur d'hydratation).
  // La section est plus bas dans la page : elle est lue bien avant que ses animations démarrent.
  const prefersReduced = useReducedMotion();
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => setReduceMotion(Boolean(prefersReduced)), [prefersReduced]);

  const panelRef = useRef<HTMLDivElement>(null);
  // Le bouton qui a ouvert la fiche, pour lui rendre le focus à la fermeture.
  const triggerRef = useRef<HTMLElement | null>(null);

  const lit = hovered ?? selected;
  const legendProject = lit !== null ? projects[lit] : null;

  const open = (index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setSelected((current) => (current === index ? null : index));
  };

  const close = useCallback((restoreFocus: boolean) => {
    setSelected(null);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Fermeture par Échap, ou par un clic en dehors de la fiche et des étoiles.
  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (panelRef.current?.contains(target) || target.closest('[data-carte-trigger]')) return;
      close(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [selected, close]);

  const panel = (index: number) => (
    <div ref={panelRef}>
      <ProjectPanel project={projects[index]} number={index + 1} onClose={() => close(true)} />
    </div>
  );

  return (
    <section id="carte-du-ciel" className="scroll-mt-24 py-20 md:py-28">
      <div className={container}>
        <SectionHeader
          index="03 bis"
          kicker="Carte du ciel"
          title={
            <>
              Tous mes projets, <br className="hidden md:block" />
              <span className="text-pro-accent">reliés dans le même ciel.</span>
            </>
          }
        >
          Chaque étoile est un projet. Les plus brillantes sont ceux que je mets en avant.
        </SectionHeader>

        <div className="mt-14 grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-12">
          <figure className="relative mx-auto w-full max-w-sm select-none md:col-span-7 md:max-w-none">
            <div className="relative">
              <svg
                viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
                className="block w-full overflow-visible"
                aria-hidden
              >
                {LINKS.filter(([from, to]) => from < starCount && to < starCount).map(
                  ([from, to], i) => {
                    const on = lit === from || lit === to;
                    const a = POSITIONS[from];
                    const b = POSITIONS[to];
                    return (
                      <motion.line
                        key={`${from}-${to}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={ACCENT}
                        strokeWidth={on ? 0.9 : 0.5}
                        strokeOpacity={on ? 0.9 : 0.35}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.6, delay: 0.4 + i * 0.12, ease: 'easeInOut' }
                        }
                      />
                    );
                  }
                )}

                {projects.slice(0, starCount).map((project, i) => {
                  const { x, y } = POSITIONS[i];
                  const big = Boolean(project.featured);
                  const on = lit === i;
                  return (
                    <motion.g
                      key={project.title}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300, damping: 15 }
                      }
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                      {/* Halo : un simple cercle translucide, moins coûteux qu'un filtre de flou */}
                      <circle
                        cx={x}
                        cy={y}
                        r={on ? (big ? 10 : 7.5) : big ? 8 : 5}
                        fill={on ? MINT : ACCENT}
                        fillOpacity={big ? 0.22 : 0.16}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={on ? (big ? 4.2 : 3.2) : big ? 3.4 : 2}
                        fill={on ? MINT : STAR}
                      >
                        {/* Scintillement : coupé quand l'utilisateur demande moins d'animations. */}
                        {!reduceMotion && (
                          <animate
                            attributeName="opacity"
                            values="1;0.55;1"
                            dur={`${2.5 + (i % 5) * 0.7}s`}
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    </motion.g>
                  );
                })}
              </svg>

              {/* Les étoiles cliquables sont de vrais boutons HTML posés sur le dessin :
                  focus clavier, Entrée et Espace fonctionnent sans code en plus. */}
              {projects.slice(0, starCount).map((project, i) => (
                <button
                  key={project.title}
                  type="button"
                  data-cursor
                  data-carte-trigger
                  aria-label={project.title}
                  aria-expanded={selected === i}
                  aria-controls={selected === i ? PANEL_ID : undefined}
                  onClick={(event) => open(i, event.currentTarget)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  style={{
                    left: `${(POSITIONS[i].x / VIEW.width) * 100}%`,
                    top: `${(POSITIONS[i].y / VIEW.height) * 100}%`,
                  }}
                  className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pro-menthe/70"
                />
              ))}
            </div>

            {/* Légende : hauteur réservée pour que la page ne bouge pas au survol. */}
            <figcaption className="mt-6 min-h-[3.25rem] font-mono text-[10px] uppercase tracking-[0.2em]">
              {legendProject ? (
                <>
                  <span className="block text-[11px] normal-case tracking-normal text-pro-menthe">
                    {legendProject.title}
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-pro-text/60">{legendProject.categories.join(' · ')}</span>
                    <span className={statusOf(legendProject).color}>
                      {statusOf(legendProject).symbol} {statusOf(legendProject).label}
                    </span>
                  </span>
                </>
              ) : (
                <span className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-pro-text/60">
                  <span>
                    Carte du ciel · {projects.length} projet{projects.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-pro-accent/70">
                    <span className="hidden md:inline">Survolez ou cliquez une étoile</span>
                    <span className="md:hidden">Touchez une étoile ou un projet</span>
                  </span>
                </span>
              )}
            </figcaption>
          </figure>

          {/* Grand écran : la fiche s'ouvre à côté de la constellation. */}
          <div className="hidden md:col-span-5 md:block">
            <AnimatePresence mode="wait">
              {isDesktop && selected !== null ? (
                <motion.div key={selected}>{panel(selected)}</motion.div>
              ) : (
                <motion.p
                  key="indice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-white/10 p-7 font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-pro-text/45"
                >
                  Cliquez sur une étoile pour ouvrir la fiche du projet.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile : au doigt, le survol n'existe pas. Une liste simple, avec la fiche sous le projet choisi. */}
          <ol className="divide-y divide-white/10 border-y border-white/10 md:hidden">
            {projects.map((project, i) => {
              const status = statusOf(project);
              return (
                <li key={project.title}>
                  <button
                    type="button"
                    data-carte-trigger
                    aria-expanded={selected === i}
                    aria-controls={selected === i ? PANEL_ID : undefined}
                    onClick={(event) => open(i, event.currentTarget)}
                    className="flex w-full items-baseline gap-3 py-4 text-left"
                  >
                    <span className="font-mono text-[10px] tracking-[0.15em] text-pro-text/55">
                      L-{String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-heading font-bold leading-snug ${
                        selected === i ? 'text-pro-menthe' : 'text-pro-text'
                      }`}
                    >
                      {project.title}
                    </span>
                    <span className={`shrink-0 font-mono text-[10px] ${status.color}`}>
                      {status.symbol}
                      <span className="sr-only"> {status.label}</span>
                    </span>
                  </button>
                  {!isDesktop && selected === i && <div className="pb-5">{panel(i)}</div>}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
