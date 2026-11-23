'use client';

import { profile, Project } from '@/data/profile';
import { HiOutlineArrowLeft, HiOutlineExternalLink } from '@/lib/icons';
import { isVedette, parcoursQuery, ParcoursChoice } from '@/lib/parcours';
import { useParcoursAdresse } from '@/lib/useParcoursAdresse';
import { useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ApercuCurseur from './ApercuCurseur';
import LigneProjet from './LigneProjet';
import SelecteurParcours from './SelecteurParcours';

// Ordre des lignes sur « Tout ». Avec un parcours, ses 2 vedettes passent devant, dans cet ordre.
const ORDRE = ['techscope', 'jobbot', 'miage-insertion-pro', 'biblio-tech'];

// Les projets vedettes d'au moins un parcours ont une ligne ; les autres sont listés en bas.
const vedettes = profile.projects
  .filter((project) => project.parcours?.length)
  .sort((a, b) => rank(a) - rank(b));
const autres = profile.projects.filter((project) => !project.parcours?.length);

function rank(project: Project) {
  const i = ORDRE.indexOf(project.slug);
  return i === -1 ? ORDRE.length : i;
}

function ordered(parcours: ParcoursChoice) {
  return [...vedettes].sort(
    (a, b) => Number(isVedette(b, parcours)) - Number(isVedette(a, parcours))
  );
}

// Slug de l'ancre (#techscope) s'il correspond à une ligne, sinon null.
function slugFromHash() {
  const slug = decodeURIComponent(window.location.hash.slice(1));
  return vedettes.some((project) => project.slug === slug) ? slug : null;
}

export default function ListeProjets() {
  // useSearchParams n'existe pas pendant la génération statique : la page s'affiche d'abord
  // sur « Tout », puis le navigateur lit l'adresse.
  return (
    <Suspense fallback={<Liste parcours="tout" />}>
      <ListeSelonAdresse />
    </Suspense>
  );
}

function ListeSelonAdresse() {
  const [parcours, setParcours] = useParcoursAdresse();
  return <Liste parcours={parcours} onParcoursChange={setParcours} />;
}

interface ListeProps {
  parcours: ParcoursChoice;
  onParcoursChange?: (choice: ParcoursChoice) => void;
}

function Liste({ parcours, onParcoursChange }: ListeProps) {
  const lignes = ordered(parcours);
  const reduceMotion = useReducedMotion();

  // Une seule ligne ouverte à la fois ; la première par défaut.
  const [openSlug, setOpenSlug] = useState<string | null>(lignes[0].slug);
  // Ouverture sans animation : arrivée par une ancre, pour défiler vers la position finale.
  const [instant, setInstant] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const hideTimer = useRef<number>();

  // Ancre dans l'adresse (/projets#jobbot) : la ligne s'ouvre et la page défile jusqu'à elle.
  // Lue après un tour de boucle : lors d'une navigation interne, Next met l'adresse à jour
  // juste après le rendu de la page.
  useEffect(() => {
    const apply = () => {
      const slug = slugFromHash();
      if (!slug) return;
      setInstant(true);
      setOpenSlug(slug);
      setScrollTarget(slug);
    };
    const timer = window.setTimeout(apply, 0);
    window.addEventListener('hashchange', apply);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', apply);
    };
  }, []);

  useEffect(() => {
    if (!scrollTarget) return;
    // Court délai : la feuille qui se ferme (la première ligne) doit avoir quitté la page,
    // sinon la ligne visée remonte après le défilement.
    const timer = window.setTimeout(() => {
      document.getElementById(scrollTarget)?.scrollIntoView({ block: 'start' });
      setScrollTarget(null);
      setInstant(false);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [scrollTarget]);

  // Changer de parcours ouvre la première ligne du nouvel ordre.
  const changeParcours = (choice: ParcoursChoice) => {
    onParcoursChange?.(choice);
    setOpenSlug(ordered(choice)[0].slug);
  };

  const toggle = (slug: string) => {
    setHovered(null);
    setOpenSlug((current) => (current === slug ? null : slug));
  };

  // Aperçu : la fenêtre ne disparaît qu'après un court délai, pour rester affichée quand
  // la souris passe d'un titre au suivant.
  const hover = useCallback((project: Project, hovering: boolean) => {
    window.clearTimeout(hideTimer.current);
    if (hovering) setHovered(project);
    else hideTimer.current = window.setTimeout(() => setHovered(null), 120);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const preview = hovered && hovered.slug !== openSlug ? hovered : null;

  return (
    <>
      <header>
        {/* Retour sur la section Lancements, avec le parcours en cours s'il y en a un. */}
        <Link
          href={`/${parcoursQuery(parcours)}#lancements`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-pro-accent transition-colors hover:text-nuit-creme"
        >
          <HiOutlineArrowLeft size={14} /> Retour à l&apos;accueil
        </Link>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-nuit-brume md:mt-16">
          03 · Lancements
        </p>
        <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="font-heading text-5xl font-extrabold leading-none text-pro-accent [text-shadow:0_0_28px_rgba(142,205,248,0.5)] md:text-7xl">
            Mes projets
          </h1>
          <SelecteurParcours value={parcours} onChange={onParcoursChange && changeParcours} />
        </div>
      </header>

      <ol className="mt-12 border-t border-white/10 md:mt-16">
        {lignes.map((project) => (
          <LigneProjet
            key={project.slug}
            project={project}
            // Numéro fixe, celui de l'ordre « Tout » : il suit le projet quand l'ordre change.
            number={rank(project) + 1}
            open={openSlug === project.slug}
            instant={instant || Boolean(reduceMotion)}
            onToggle={() => toggle(project.slug)}
            onTitleHover={(hovering) => hover(project, hovering)}
          />
        ))}
      </ol>

      {autres.length > 0 && (
        <section className="mt-20">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-nuit-brume">
            Autres projets · détaillés sur GitHub
          </h2>
          <ul className="mt-6 space-y-3">
            {autres.map((project) => (
              <li key={project.slug} id={project.slug} className="scroll-mt-24">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-baseline gap-3 font-heading text-xl font-bold text-nuit-creme transition-colors hover:text-pro-accent md:text-2xl"
                >
                  {project.title}
                  <HiOutlineExternalLink size={16} className="shrink-0 self-center" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ApercuCurseur project={preview} />
    </>
  );
}
