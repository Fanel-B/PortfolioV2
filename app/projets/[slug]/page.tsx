import ProjetBackdrop from '@/components/Projet/ProjetBackdrop';
import RetourLancements, { RetourLancementsLink } from '@/components/Projet/RetourLancements';
import { profile } from '@/data/profile';
import { FaGithub, HiOutlineExternalLink } from '@/lib/icons';
import { statusOf } from '@/lib/projectStatus';
import { container } from '@/lib/ui';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Fragment, Suspense } from 'react';

interface Props {
  params: { slug: string };
}

const findProject = (slug: string) => profile.projects.find((project) => project.slug === slug);

// « TechScope : pilotage et qualité d'un parc IT » donne le titre « TechScope »
// et le sous-titre « Pilotage et qualité d'un parc IT ». Sans « : », pas de sous-titre.
function splitTitle(title: string) {
  const [main, ...rest] = title.split(' : ');
  const sub = rest.join(' : ');
  return { main, sub: sub ? sub.charAt(0).toUpperCase() + sub.slice(1) : null };
}

// Taille du grand titre : 48 px sur mobile, 80 px sur ordinateur, réduite si le mot le plus long
// ne tient pas sur la largeur (Syne en capitales est très large : « TECHSCOPE » à 48 px dépasse
// un écran de 375 px). 1.22 em par lettre : la plus large mesurée dans le navigateur, avec une marge.
const LETTER_WIDTH = 1.22;
// Au-delà, un mot peut être coupé en fin de ligne, sinon tout le titre deviendrait minuscule.
const LONG_WORD = 12;

// Césures possibles entre deux consonnes doubles, règle française (profes-sion-nelle).
// Le navigateur ne coupe pas seul ici : la césure automatique dépend du système.
function hyphenate(title: string) {
  return title
    .split(' ')
    .map((word) =>
      word.length > LONG_WORD ? word.replace(/([bcdfglmnprst])(?=\1)/gi, '$1\u00AD') : word
    )
    .join(' ');
}

function titleSize(title: string) {
  // Longueur du plus long morceau insécable : un mot entier, ou un morceau de mot long, trait inclus.
  const longest = Math.max(
    ...hyphenate(title)
      .split(' ')
      .flatMap((word) => {
        const parts = word.split('\u00AD');
        return parts.map((part, i) => part.length + (i < parts.length - 1 ? 1 : 0));
      })
  );
  const divisor = (longest * LETTER_WIDTH).toFixed(2);
  return `min(var(--titre-max), calc(min(100vw - var(--marge), 60rem) / ${divisor}))`;
}

// Les chiffres de la description ressortent en bleu profond : ce sont les résultats du projet.
function withNumbers(text: string) {
  // Un nombre, avec ses séparateurs de milliers ou décimales, et un « % » éventuel.
  return text.split(/(\d+(?:[ \u00A0,.]\d+)*(?:[ \u00A0]?%)?)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-medium text-papier-accent">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

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
  const { main, sub } = splitTitle(project.title);

  // Le bouton plein va à la démo quand il y en a une, sinon au code.
  const primary = project.demoUrl
    ? { href: project.demoUrl, label: 'Démo', icon: <HiOutlineExternalLink size={16} /> }
    : project.githubUrl
    ? { href: project.githubUrl, label: 'GitHub', icon: <FaGithub size={16} /> }
    : null;
  const secondary =
    project.demoUrl && project.githubUrl
      ? { href: project.githubUrl, label: 'GitHub', icon: <FaGithub size={16} /> }
      : null;

  return (
    <>
      <ProjetBackdrop />
      <main className={`${container} pb-28 pt-12 md:pt-20`}>
        <div className="mx-auto max-w-[60rem]">
          {/* En-tête, posé directement sur le ciel de nuit. */}
          <Suspense fallback={<RetourLancementsLink />}>
            <RetourLancements />
          </Suspense>

          <header className="mt-10 md:mt-14">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-nuit-brume">
              Projet · {project.categories.join(' · ')} · {status.symbol} {status.label}
            </p>
            <h1
              style={{ fontSize: titleSize(main) }}
              className="mt-5 font-heading font-extrabold uppercase leading-[0.95] text-pro-accent [--marge:3rem] [text-shadow:0_0_28px_rgba(142,205,248,0.5)] [--titre-max:3rem] md:[--titre-max:5rem] md:[--marge:6rem] lg:[--marge:10rem]"
            >
              {hyphenate(main)}
            </h1>
            {sub && (
              <p className="mt-4 font-heading text-xl font-bold leading-snug text-nuit-creme md:text-2xl">
                {sub}
              </p>
            )}
          </header>

          {/* La feuille : tout le contenu du projet, sur papier blanc cassé.
              data-cursor-surface : le viseur passe en bleu profond pour rester visible dessus. */}
          <article
            data-cursor-surface="papier"
            className="mt-12 animate-feuille rounded-2xl bg-papier-fond p-6 text-papier-texte shadow-feuille motion-reduce:animate-none md:mt-16 md:rounded-3xl md:p-14"
          >
            {project.image && (
              // Cadre bleu nuit : les captures sombres ressortent sur le papier clair.
              <figure className="overflow-hidden rounded-2xl bg-papier-encre">
                <div className="flex items-center gap-1.5 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-2 truncate font-mono text-[11px] text-nuit-brume">
                    {(project.demoUrl ?? project.githubUrl ?? '').replace(/^https?:\/\//, '')}
                  </span>
                </div>
                <div className="px-2 pb-2 md:px-3 md:pb-3">
                  <div
                    className={`relative aspect-[16/10] overflow-hidden rounded-lg ${
                      project.imageFit === 'contain' ? 'bg-white' : ''
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={`Aperçu de ${project.title}`}
                      fill
                      priority
                      sizes="(min-width: 960px) 848px, 100vw"
                      className={
                        project.imageFit === 'contain'
                          ? 'object-contain p-4'
                          : 'object-cover object-top'
                      }
                    />
                  </div>
                </div>
              </figure>
            )}

            {/* Largeur de lecture : environ 700 px. */}
            <div className="mt-12 max-w-[43.75rem] md:mt-14">
              <h2 className="font-heading text-2xl font-bold text-papier-encre">Le projet</h2>
              <p className="mt-4 text-lg leading-[1.75] md:text-xl">
                {withNumbers(project.description)}
              </p>

              <h2 className="mt-12 font-heading text-2xl font-bold text-papier-encre">Stack</h2>
              <ul className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-papier-puce px-3 py-1.5 text-papier-texte"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              {primary && (
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={primary.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-papier-encre px-6 py-3 font-medium text-papier-fond transition-colors hover:bg-papier-accent"
                  >
                    {primary.icon} {primary.label}
                  </a>
                  {secondary && (
                    <a
                      href={secondary.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-papier-encre px-6 py-3 font-medium text-papier-encre transition-colors hover:bg-papier-encre hover:text-papier-fond"
                    >
                      {secondary.icon} {secondary.label}
                    </a>
                  )}
                </div>
              )}

              {/* Les rubriques détaillées (contexte, architecture, choix, limites) arriveront ici. */}
              <aside className="mt-14 rounded-xl bg-papier-surface p-6 md:p-7">
                <p className="font-heading text-lg font-bold text-papier-encre">
                  Étude de cas en préparation
                </p>
                <p className="mt-2 leading-[1.7] text-papier-texteDoux">
                  Le contexte, l&apos;architecture, les choix techniques et les limites de ce projet
                  seront détaillés ici prochainement.
                </p>
              </aside>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
