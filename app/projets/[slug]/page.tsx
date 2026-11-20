import ProjetBackdrop from '@/components/Projet/ProjetBackdrop';
import RetourLancements, { RetourLancementsLink } from '@/components/Projet/RetourLancements';
import { profile } from '@/data/profile';
import { FaGithub, HiOutlineExternalLink } from '@/lib/icons';
import { statusOf } from '@/lib/projectStatus';
import { container } from '@/lib/ui';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: { slug: string };
}

const findProject = (slug: string) => profile.projects.find((project) => project.slug === slug);

// Une page HTML est générée au build pour chaque projet de data/profile.ts.
export function generateStaticParams() {
  return profile.projects.map((project) => ({ slug: project.slug }));
}

// Une adresse qui ne correspond à aucun projet renvoie directement la page 404 du site.
export const dynamicParams = false;

export function generateMetadata({ params }: Props): Metadata {
  const project = findProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description.slice(0, 160),
    alternates: { canonical: `/projets/${project.slug}` },
  };
}

export default function ProjetPage({ params }: Props) {
  const project = findProject(params.slug);
  if (!project) notFound();

  const status = statusOf(project);
  const number = profile.projects.indexOf(project) + 1;

  return (
    <>
      <ProjetBackdrop />
      <main className={`${container} pb-28 pt-12 md:pt-20`}>
        {/* Largeur de lecture : environ 70 caractères par ligne pour la description. */}
        <div className="max-w-4xl">
          {/* En attendant que le navigateur lise le parcours, le lien ramène sur « Tout ». */}
          <Suspense fallback={<RetourLancementsLink />}>
            <RetourLancements />
          </Suspense>

          <header className="mt-12">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="text-pro-accent">L-{String(number).padStart(2, '0')}</span>
              <span className="text-pro-text/60">{project.categories.join(' · ')}</span>
              <span className={status.color}>
                {status.symbol} {status.label}
              </span>
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.05] text-pro-text sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </header>

          {project.image && (
            // Capture présentée dans une fenêtre de navigateur, comme sur les cartes de l'accueil.
            <figure className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-pro-surface">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="ml-2 truncate font-mono text-[11px] text-pro-text/50">
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
                  priority
                  sizes="(min-width: 896px) 832px, 100vw"
                  className={
                    project.imageFit === 'contain'
                      ? 'object-contain p-4'
                      : 'object-cover object-top'
                  }
                />
              </div>
            </figure>
          )}

          <p className="mt-12 text-lg leading-relaxed text-pro-text/75 md:text-xl">
            {project.description}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-pro-accent/25 px-3 py-1 text-pro-accent/90"
              >
                {tech}
              </li>
            ))}
          </ul>

          {(project.githubUrl || project.demoUrl) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium text-pro-text transition-colors hover:border-pro-accent hover:text-pro-accent"
                >
                  <FaGithub size={16} /> GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-pro-accent px-6 py-3 font-medium text-pro-bg transition-opacity hover:opacity-85"
                >
                  <HiOutlineExternalLink size={16} /> Démo
                </a>
              )}
            </div>
          )}

          {/* Les rubriques détaillées (contexte, architecture, choix, limites) arrivent à l'étape suivante. */}
          <aside className="mt-16 rounded-2xl border border-dashed border-pro-accent/25 p-7 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-pro-accent">
              Étude de cas en préparation
            </p>
            <p className="mt-3 text-pro-text/65">
              Le contexte, l&apos;architecture, les choix techniques et les limites de ce projet
              seront détaillés ici prochainement.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
