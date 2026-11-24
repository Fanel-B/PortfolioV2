'use client';

import type { Project } from '@/data/profile';
import { FaGithub, HiOutlineExternalLink } from '@/lib/icons';
import { statusOf } from '@/lib/projectStatus';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  project: Project;
  number: number;
  open: boolean;
  /** Vrai : ouverture et fermeture sans animation (mouvement réduit, arrivée par une ancre). */
  instant: boolean;
  onToggle: () => void;
  /** Survol de la ligne, pour l'aperçu qui suit la souris (seulement si la ligne est fermée). */
  onTitleHover: (hovering: boolean) => void;
}

// « TechScope : pilotage… » : la ligne n'affiche que « TechScope ».
const shortTitle = (title: string) => title.split(' : ')[0];

// Ouverture en hauteur : environ 500 ms, départ rapide puis freinage doux.
const EASE = [0.16, 1, 0.3, 1];

export default function LigneProjet({
  project,
  number,
  open,
  instant,
  onToggle,
  onTitleHover,
}: Props) {
  const status = statusOf(project);
  const panelId = `projet-${project.slug}-feuille`;
  const transition = instant ? { duration: 0 } : { duration: 0.5, ease: EASE };

  return (
    <li id={project.slug} className="scroll-mt-24 border-b border-white/10">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          // Toute la ligne (numéro, titre, statut) déclenche l'aperçu qui suit la souris.
          onPointerEnter={() => onTitleHover(true)}
          onPointerLeave={() => onTitleHover(false)}
          className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 py-6 text-left md:grid-cols-[3.5rem_1fr_auto_auto] md:gap-x-6 md:py-8"
        >
          <span className="font-mono text-xs tracking-[0.2em] text-nuit-brume">
            {String(number).padStart(2, '0')}
          </span>
          {/* Mobile : titre sur sa propre ligne, sous le numéro et le statut. */}
          <span
            className={`order-last col-span-3 font-heading text-[1.625rem] font-extrabold leading-[1.05] transition-colors sm:text-4xl md:order-none md:col-span-1 md:text-5xl ${
              open ? 'text-pro-accent' : 'text-nuit-creme group-hover:text-pro-accent'
            }`}
          >
            {shortTitle(project.title)}
          </span>
          <span className="justify-self-end text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-nuit-brume md:text-xs">
            {project.categories.join(' · ')}
            <span className="mx-2 text-white/20">/</span>
            <span className={status.color}>
              {status.symbol} {status.label}
            </span>
          </span>
          {/* + qui devient − : la barre verticale s'aplatit à l'ouverture. */}
          <span
            aria-hidden
            className="relative h-9 w-9 shrink-0 rounded-full border border-white/15 transition-colors group-hover:border-pro-accent md:h-11 md:w-11"
          >
            <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-pro-accent" />
            <span
              className={`absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-pro-accent transition-transform duration-300 ${
                open ? 'scale-y-0' : 'scale-y-100'
              }`}
            />
          </span>
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`Détails du projet ${shortTitle(project.title)}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            {/* La feuille : capture à gauche, texte à droite ; sous 768 px, le texte passe dessous.
                data-cursor-surface : le viseur passe en bleu profond pour rester visible. */}
            <div className="pb-8 md:pb-10">
              <article
                data-cursor-surface="papier"
                className="grid gap-8 rounded-2xl bg-papier-fond p-6 text-papier-texte shadow-feuille md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:rounded-3xl md:p-10 lg:p-14"
              >
                {project.image && (
                  <figure className="self-start rounded-2xl bg-papier-encre p-2 md:p-3">
                    <div
                      className={`relative aspect-[16/10] overflow-hidden rounded-lg ${
                        project.imageFit === 'contain' ? 'bg-white' : ''
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={`Aperçu de ${project.title}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className={
                          project.imageFit === 'contain'
                            ? 'object-contain p-3'
                            : 'object-cover object-top'
                        }
                      />
                    </div>
                  </figure>
                )}

                <div>
                  {project.reperes && (
                    <p className="font-mono text-xs leading-relaxed text-papier-texteDoux">
                      {project.reperes}
                    </p>
                  )}
                  <Bloc titre="Le problème" texte={project.probleme} />
                  <Bloc titre="Ce que j'ai fait" texte={project.fait} />
                  <Bloc titre="La suite" texte={project.suite} />

                  {(project.demoUrl || project.githubUrl) && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-papier-encre px-5 py-2.5 font-medium text-papier-fond transition-colors hover:bg-papier-accent"
                        >
                          <HiOutlineExternalLink size={16} /> Démo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-colors ${
                            project.demoUrl
                              ? 'border border-papier-encre text-papier-encre hover:bg-papier-encre hover:text-papier-fond'
                              : 'bg-papier-encre text-papier-fond hover:bg-papier-accent'
                          }`}
                        >
                          <FaGithub size={16} /> GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// Bloc titré de la feuille ; un texte vide n'affiche rien (ex. « La suite » de Biblio-Tech).
function Bloc({ titre, texte }: { titre: string; texte?: string }) {
  if (!texte) return null;
  return (
    <section className="mt-6">
      <h3 className="font-heading text-lg font-bold text-papier-accent">{titre}</h3>
      <p className="mt-2 leading-[1.7]">{texte}</p>
    </section>
  );
}
