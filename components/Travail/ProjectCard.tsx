'use client';

import { Project } from '@/data/profile';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef } from 'react';
import { FaGithub } from '@/lib/icons';
import { HiOutlineExternalLink } from '@/lib/icons';

const TYPE_LABEL: Record<Project['type'], string> = {
  perso: 'Projet perso',
  academique: 'Projet académique',
  pro: 'Projet pro',
};

interface Props {
  project: Project;
  number: number;
  featured: boolean;
  className?: string;
}

// Visuel de remplacement quand le projet n'a pas encore de capture : son numéro, en grand, dans le ciel.
function ProjectVisual({ number }: { number: number }) {
  return (
    <div className="grid-lines relative flex h-full items-center justify-center overflow-hidden bg-gradient-to-br from-pro-surface to-pro-bg">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pro-accent/20 blur-3xl" />
      <span className="relative font-heading text-[4rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(142,205,248,0.6)]">
        {String(number).padStart(2, '0')}
      </span>
    </div>
  );
}

// Pas d'inclinaison 3D ni de reflet qui suit la souris : sur un rail horizontal,
// ces effets repeignaient toute la carte à chaque mouvement et saccadaient le défilement.
const ProjectCard = forwardRef<HTMLDivElement, Props>(function ProjectCard(
  { project, number, featured, className = '' },
  ref
) {
  const isLive = Boolean(project.demoUrl);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-pro-bg/70 transition-colors duration-300 hover:border-pro-accent/40 ${
          featured ? 'border-pro-accent/25' : 'border-white/10'
        }`}
      >
        {project.image ? (
          // Capture présentée dans une fenêtre de navigateur
          <div className="p-2.5 pb-0">
            <div className="overflow-hidden rounded-t-lg border border-b-0 border-white/10 bg-pro-surface">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                <span className="ml-2 truncate font-mono text-[9px] text-pro-text/50">
                  {(project.demoUrl ?? project.githubUrl ?? '').replace(/^https?:\/\//, '')}
                </span>
              </div>
              <div
                className={`relative aspect-[16/10] ${
                  project.imageFit === 'contain' ? 'bg-white' : ''
                }`}
              >
                <Image
                  src={project.image}
                  alt={`Aperçu de ${project.title}`}
                  fill
                  sizes="(min-width: 768px) 320px, 80vw"
                  className={
                    project.imageFit === 'contain'
                      ? 'object-contain p-2'
                      : 'object-cover object-top'
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-[16/10] p-2.5 pb-0">
            <ProjectVisual number={number} />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
            <span className="truncate text-pro-text/55">
              L-{String(number).padStart(2, '0')} · {TYPE_LABEL[project.type]}
            </span>
            <span className={`shrink-0 ${isLive ? 'text-pro-menthe' : 'text-pro-text/55'}`}>
              {isLive ? '● En ligne' : '○ Code'}
            </span>
          </div>

          <h3 className="mt-2.5 font-heading text-lg font-bold leading-snug text-pro-text">
            {project.title}
          </h3>

          {/* Hauteur fixe : les cartes restent alignées quelle que soit la longueur du texte. */}
          <p className="line-clamp-4 mt-2 min-h-[4.9rem] text-[13px] leading-[1.45] text-pro-text/60">
            {project.description}
          </p>

          <p className="line-clamp-1 mt-3 font-mono text-[11px] text-pro-accent/80">
            {project.stack.join('  ·  ')}
          </p>

          {/* flex-wrap : sur un écran très étroit, les liens passent sous les catégories
              au lieu de déborder de la carte. */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-white/10 pt-3.5">
            <ul className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              {project.categories.map((category) => (
                <li
                  key={category}
                  className="rounded-full border border-pro-lavande/30 px-2 py-0.5 text-pro-lavande"
                >
                  {category}
                </li>
              ))}
            </ul>
            <div className="flex shrink-0 gap-3 text-xs font-medium">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-pro-text/70 transition-colors hover:text-pro-accent"
                >
                  <FaGithub size={13} /> Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-pro-accent transition-colors hover:text-pro-text"
                >
                  <HiOutlineExternalLink size={13} /> Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
});

export default ProjectCard;
