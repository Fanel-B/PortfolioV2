'use client';

import { Project } from '@/data/profile';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { forwardRef, MouseEvent } from 'react';
import { FaGithub } from '@/lib/icons';
import { HiOutlineExternalLink } from '@/lib/icons';

const TYPE_LABEL: Record<Project['type'], string> = {
  perso: 'Projet perso',
  academique: 'Projet académique',
  pro: 'Projet pro',
};

const MAX_TILT = 5;

interface Props {
  project: Project;
  number: number;
  featured: boolean;
  className?: string;
}

// Visuel de remplacement quand le projet n'a pas encore de capture : son numéro, en grand, dans le ciel.
function ProjectVisual({ number }: { number: number }) {
  return (
    <div className="grid-lines relative flex h-full min-h-[180px] items-center justify-center overflow-hidden bg-gradient-to-br from-pro-surface to-pro-bg">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-pro-accent/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-pro-lavande/15 blur-3xl" />
      <span className="relative font-heading text-[7rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(142,205,248,0.6)]">
        {String(number).padStart(2, '0')}
      </span>
    </div>
  );
}

const ProjectCard = forwardRef<HTMLDivElement, Props>(function ProjectCard(
  { project, number, featured, className = '' },
  ref
) {
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(142,205,248,0.16), transparent 55%)`;
  const isLive = Boolean(project.demoUrl);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateY.set((x - 0.5) * 2 * MAX_TILT);
    rotateX.set((0.5 - y) * 2 * MAX_TILT);
    glareX.set(x * 100);
    glareY.set(y * 100);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className={className}
    >
      <motion.article
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-pro-bg/70 backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-pro-accent/40 hover:shadow-glow"
      >
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity group-hover:opacity-100"
        />

        {project.image ? (
          // Capture présentée dans une fenêtre de navigateur
          <div className="p-3 pb-0">
            <div className="overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-pro-surface">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 truncate font-mono text-[11px] text-pro-text/40">
                  {(project.demoUrl ?? project.githubUrl ?? '').replace(/^https?:\/\//, '')}
                </span>
              </div>
              <div
                className={`relative ${featured ? 'aspect-[16/9]' : 'aspect-[16/7]'} ${
                  project.imageFit === 'contain' ? 'bg-white' : ''
                }`}
              >
                <Image
                  src={project.image}
                  alt={`Aperçu de ${project.title}`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={`transition-transform duration-700 group-hover:scale-[1.03] ${
                    project.imageFit === 'contain'
                      ? 'object-contain p-3'
                      : 'object-cover object-top'
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={featured ? 'aspect-[16/9]' : 'aspect-[16/7]'}>
            <ProjectVisual number={number} />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6 md:p-8" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.15em]">
            <span className="text-pro-text/40">
              L-{String(number).padStart(2, '0')} · {TYPE_LABEL[project.type]}
            </span>
            <span className={isLive ? 'text-pro-menthe' : 'text-pro-text/40'}>
              {isLive ? '● En ligne' : '○ Code source'}
            </span>
          </div>

          <h3
            className={`mt-4 font-heading font-bold text-pro-text ${
              featured ? 'text-3xl md:text-4xl' : 'text-2xl'
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`mt-4 flex-1 text-pro-text/65 ${
              featured ? 'text-base md:text-lg' : 'line-clamp-4 text-sm'
            }`}
          >
            {project.description}
          </p>

          <p className="mt-5 font-mono text-xs text-pro-accent/80">{project.stack.join('  ·  ')}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <ul className="flex gap-2 font-mono text-xs">
              {project.categories.map((category) => (
                <li
                  key={category}
                  className="rounded-full border border-pro-lavande/30 px-3 py-1 text-pro-lavande"
                >
                  {category}
                </li>
              ))}
            </ul>
            <div className="relative z-20 flex gap-5 text-sm font-medium">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-pro-text/70 transition-colors hover:text-pro-accent"
                >
                  <FaGithub /> Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-pro-accent transition-colors hover:text-pro-text"
                >
                  <HiOutlineExternalLink /> Voir en ligne
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
});

export default ProjectCard;
