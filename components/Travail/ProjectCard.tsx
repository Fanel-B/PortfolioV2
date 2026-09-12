'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import { Project } from '@/data/profile';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const TYPE_LABEL: Record<Project['type'], string> = {
  perso: 'Projet perso',
  academique: 'Projet académique',
  pro: 'Projet pro',
};

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-pro-surface2 dark:bg-pro-surface"
    >
      <PlaceholderImage label="Aperçu à venir" className="aspect-video w-full rounded-none" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="w-fit rounded-full bg-pro-accent/10 px-3 py-1 font-accent text-xs text-pro-accent">
          {TYPE_LABEL[project.type]}
        </span>
        <h3 className="font-semibold text-gray-900 dark:text-pro-text">{project.title}</h3>
        <p className="flex-1 font-sans text-sm text-gray-600 dark:text-pro-text/70">
          {project.description}
        </p>

        <div className="flex gap-4 pt-2 text-sm font-medium text-pro-accent">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <FaGithub /> Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <FaExternalLinkAlt /> Démo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
