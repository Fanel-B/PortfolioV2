'use client';

import SectionHeader from '@/components/SectionHeader';
import { profile, ProjectCategory } from '@/data/profile';
import { isVedette, parseParcours, PARCOURS_CHOICES, ParcoursChoice } from '@/lib/parcours';
import { statusOf } from '@/lib/projectStatus';
import { container } from '@/lib/ui';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ProjectPanel, { PANEL_ID } from './ProjectPanel';

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

type Filter = 'Tous' | ProjectCategory;
const FILTERS: Filter[] = ['Tous', 'Web', 'Data', 'IA'];

const MINT = '#9EE6CF';
const ACCENT = '#8ECDF8';
const STAR = '#EAF4FF';
// Opacité d'une étoile écartée par le filtre : encore visible, mais en retrait.
const DIMMED = 0.2;
// Passage d'un parcours à l'autre : taille et éclat des étoiles changent en douceur.
const PARCOURS_DURATION = 0.6;

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

// Section Lancements : les projets dessinés en constellation.
// Le parcours choisi vit dans l'adresse (/?parcours=data), pour qu'un lien partagé l'ouvre tel quel.
export default function CarteDuCiel() {
  // Pendant la génération statique de la page, l'adresse n'existe pas encore : Next affiche
  // le contenu de secours (la section sur « Tout »), puis le navigateur lit l'adresse.
  return (
    <Suspense fallback={<Lancements parcours="tout" />}>
      <LancementsSelonAdresse />
    </Suspense>
  );
}

function LancementsSelonAdresse() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fromUrl = parseParcours(searchParams.get('parcours'));

  // Copie locale : le clic change l'affichage tout de suite, sans attendre la navigation.
  // Elle suit l'adresse quand celle-ci change (bouton Précédent, lien partagé).
  const [parcours, setParcours] = useState<ParcoursChoice>(fromUrl);
  useEffect(() => setParcours(fromUrl), [fromUrl]);

  const change = (choice: ParcoursChoice) => {
    setParcours(choice);
    const params = new URLSearchParams(searchParams.toString());
    if (choice === 'tout') params.delete('parcours');
    else params.set('parcours', choice);
    const query = params.toString();
    // replace et non push : changer de parcours n'ajoute pas d'étape au bouton Précédent.
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  // Arrivée par un lien avec un parcours : on descend jusqu'à la section, une seule fois.
  useEffect(() => {
    if (fromUrl === 'tout') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById('lancements')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Lancements parcours={parcours} onParcoursChange={change} />;
}

interface LancementsProps {
  parcours: ParcoursChoice;
  /** Absent dans le contenu de secours : le sélecteur reste inactif le temps du chargement. */
  onParcoursChange?: (choice: ParcoursChoice) => void;
}

function Lancements({ parcours, onParcoursChange }: LancementsProps) {
  // hovered : étoile survolée ou ciblée au clavier. selected : étoile dont la fiche est ouverte.
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>('Tous');
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

  // Un projet hors filtre reste affiché, en retrait. Survolé ou ouvert, il reprend tout son éclat.
  const matches = (i: number) => filter === 'Tous' || projects[i].categories.includes(filter);
  const dimmed = (i: number) => !matches(i) && lit !== i;
  const visibleCount = projects.filter((_, i) => matches(i)).length;
  const vedette = (i: number) => isVedette(projects[i], parcours);

  // Liste mobile : les vedettes du parcours en tête, puis l'ordre du fichier.
  const mobileOrder = projects
    .map((_, i) => i)
    .sort((a, b) => Number(vedette(b)) - Number(vedette(a)));

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
      <ProjectPanel
        project={projects[index]}
        number={index + 1}
        parcours={parcours}
        onClose={() => close(true)}
      />
    </div>
  );

  return (
    <section id="lancements" className="scroll-mt-24 py-28 md:py-40">
      <div className={container}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="03"
            kicker="Lancements"
            title={
              <>
                Les projets que j&apos;ai <span className="text-pro-accent">mis en orbite.</span>
              </>
            }
          />

          {/* data-carte-trigger : changer de parcours ou de filtre ne ferme pas la fiche ouverte. */}
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-pro-text/45 sm:w-16 lg:text-right">
                Parcours
              </span>
              <div
                role="group"
                aria-label="Choisir un parcours"
                data-carte-trigger
                className="flex w-fit gap-1 rounded-full border border-white/10 bg-pro-bg/60 p-1 font-mono text-sm"
              >
                <LayoutGroup id="parcours">
                  {PARCOURS_CHOICES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={parcours === value}
                      onClick={() => onParcoursChange?.(value)}
                      className={`relative rounded-full px-5 py-2 transition-colors ${
                        parcours === value ? 'text-pro-bg' : 'text-pro-text/60 hover:text-pro-text'
                      }`}
                    >
                      {parcours === value && (
                        <motion.span
                          layoutId="parcours-pill"
                          className="absolute inset-0 rounded-full bg-pro-accent shadow-glow"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  ))}
                </LayoutGroup>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-pro-text/45 sm:w-16 lg:text-right">
                Filtre
              </span>
              <div
                role="group"
                aria-label="Filtrer les projets"
                data-carte-trigger
                className="flex w-fit gap-1 rounded-full border border-white/10 bg-pro-bg/60 p-1 font-mono text-sm"
              >
                <LayoutGroup id="filters">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={filter === f}
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
            </div>
          </div>
        </div>

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
                    // Un trait s'efface dès qu'une de ses deux étoiles est écartée par le filtre.
                    const faded = dimmed(from) || dimmed(to);
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
                        strokeOpacity={on ? 0.9 : faded ? 0.1 : 0.35}
                        style={{ transition: 'stroke-opacity 0.3s ease-out' }}
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
                  const big = vedette(i);
                  const on = lit === i;
                  const grow = reduceMotion
                    ? { duration: 0 }
                    : { duration: PARCOURS_DURATION, ease: [0.22, 1, 0.36, 1] };
                  return (
                    // Groupe extérieur : atténuation par le filtre. Groupe intérieur : apparition.
                    <g
                      key={project.slug}
                      opacity={dimmed(i) ? DIMMED : 1}
                      style={{ transition: 'opacity 0.3s ease-out' }}
                    >
                      <motion.g
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
                        {/* Survol : léger grossissement, plus rapide que le changement de parcours. */}
                        <g
                          style={{
                            transform: `scale(${on ? (big ? 1.2 : 1.5) : 1})`,
                            transformOrigin: `${x}px ${y}px`,
                            transition: reduceMotion ? 'none' : 'transform 0.25s ease-out',
                          }}
                        >
                          {/* Halo : un simple cercle translucide, moins coûteux qu'un filtre de flou.
                            Taille et éclat suivent le parcours : les vedettes grossissent et brillent. */}
                          <motion.circle
                            cx={x}
                            cy={y}
                            fill={on ? MINT : ACCENT}
                            initial={false}
                            animate={{ r: big ? 9 : 5, fillOpacity: big ? 0.28 : 0.14 }}
                            transition={grow}
                          />
                          <motion.circle
                            cx={x}
                            cy={y}
                            fill={on ? MINT : STAR}
                            initial={false}
                            animate={{ r: big ? 3.6 : 2 }}
                            transition={grow}
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
                          </motion.circle>
                        </g>
                      </motion.g>
                    </g>
                  );
                })}
              </svg>

              {/* Les étoiles cliquables sont de vrais boutons HTML posés sur le dessin :
                  focus clavier, Entrée et Espace fonctionnent sans code en plus. */}
              {projects.slice(0, starCount).map((project, i) => (
                <button
                  key={project.slug}
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
                    {visibleCount} projet{visibleCount > 1 ? 's' : ''}
                    {filter !== 'Tous' && ` · ${filter}`}
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

          {/* Mobile : au doigt, le survol n'existe pas. Une liste simple ; la fiche s'ouvre sous
              le projet choisi, avec le lien vers sa page. */}
          <ol className="divide-y divide-white/10 border-y border-white/10 md:hidden">
            {mobileOrder.map((i) => {
              const project = projects[i];
              const status = statusOf(project);
              return (
                // layout="position" : au changement de parcours, les lignes glissent à leur place.
                <motion.li
                  key={project.slug}
                  layout="position"
                  transition={reduceMotion ? { duration: 0 } : { duration: PARCOURS_DURATION }}
                  className={`transition-opacity duration-300 ${
                    matches(i) || selected === i ? '' : 'opacity-40'
                  }`}
                >
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
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
