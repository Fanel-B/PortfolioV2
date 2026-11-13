'use client';

import { Project } from '@/data/profile';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { FaGithub, HiOutlineExternalLink, HiX } from '@/lib/icons';

interface Props {
  project: Project;
  number: number;
  onClose: () => void;
}

export const PANEL_ID = 'carte-du-ciel-panneau';

// Même logique que la carte projet : un projet en amélioration n'est pas affiché « en ligne »,
// même s'il a une démo, pour ne pas laisser croire qu'il est pleinement fonctionnel.
export function statusOf(project: Project) {
  if (project.status === 'amelioration') {
    return { label: 'en amélioration', symbol: '◐', color: 'text-pro-lavande' };
  }
  if (project.demoUrl) {
    return { label: 'en ligne', symbol: '●', color: 'text-pro-menthe' };
  }
  return { label: 'code source', symbol: '○', color: 'text-pro-text/55' };
}

// Fiche d'un projet, ouverte au clic sur son étoile.
export default function ProjectPanel({ project, number, onClose }: Props) {
  const status = statusOf(project);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // À l'ouverture, le focus va sur le titre : au clavier, on enchaîne directement sur les liens.
  // Fait ici, au montage, parce qu'en passant d'une fiche à l'autre la nouvelle n'apparaît
  // qu'après la sortie de l'ancienne.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <motion.div
      id={PANEL_ID}
      role="region"
      aria-label={`Fiche du projet ${project.title}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-pro-accent/25 bg-pro-bg/80 p-6 md:p-7"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la fiche"
        className="absolute right-3 top-3 rounded-full p-2 text-pro-text/60 transition-colors hover:bg-white/10 hover:text-pro-text"
      >
        <HiX size={18} />
      </button>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-10 font-mono text-[10px] uppercase tracking-[0.15em]">
        <span className="text-pro-text/55">L-{String(number).padStart(2, '0')}</span>
        <span className="text-pro-text/55">{project.categories.join(' · ')}</span>
        <span className={status.color}>
          {status.symbol} {status.label}
        </span>
      </p>

      {/* tabIndex={-1} : le titre reçoit le focus à l'ouverture, sans entrer dans l'ordre de tabulation. */}
      <h3
        ref={titleRef}
        tabIndex={-1}
        className="mt-3 pr-6 font-heading text-xl font-bold leading-snug text-pro-text focus:outline-none md:text-2xl"
      >
        {project.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-pro-text/70">{project.description}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5 font-mono text-[11px]">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-pro-accent/25 px-2.5 py-0.5 text-pro-accent/90"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-sm font-medium">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-pro-text transition-colors hover:border-pro-accent hover:text-pro-accent"
          >
            <FaGithub size={14} /> GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pro-accent px-4 py-2 text-pro-bg transition-opacity hover:opacity-85"
          >
            <HiOutlineExternalLink size={14} /> Démo
          </a>
        )}
        {/* Les pages projet arrivent à l'étape suivante : le bouton est visible mais inactif. */}
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-white/15 px-4 py-2 text-pro-text/45"
        >
          Voir l&apos;étude de cas
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-pro-lavande/80">
            bientôt
          </span>
        </button>
      </div>
    </motion.div>
  );
}
