import ProjetBackdrop from '@/components/Projet/ProjetBackdrop';
import RetourLancements, { RetourLancementsLink } from '@/components/Projet/RetourLancements';
import { profile } from '@/data/profile';
import { FaGithub, HiOutlineExternalLink } from '@/lib/icons';
import { statusOf } from '@/lib/projectStatus';
import { container } from '@/lib/ui';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CSSProperties, Fragment, Suspense } from 'react';

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

// Taille du grand titre sur ordinateur, en capitales : 80 px, réduite si le mot le plus long
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

// Mobile : titre en casse normale, bien plus étroit qu'en capitales. Largeur de chaque caractère
// en Syne 800, en em, mesurée dans le navigateur. Absent de la table : 1 em (minuscule) ou 1,2 em.
const SYNE_800: Record<string, number> = {
  a: 1.063,
  b: 1.098,
  c: 0.994,
  d: 1.098,
  e: 0.994,
  f: 0.674,
  g: 0.969,
  h: 1.008,
  i: 0.364,
  j: 0.364,
  k: 0.942,
  l: 0.36,
  m: 1.654,
  n: 0.998,
  o: 1.016,
  p: 1.063,
  q: 1.098,
  r: 0.563,
  s: 0.842,
  t: 0.628,
  u: 0.998,
  v: 0.918,
  w: 1.462,
  x: 0.98,
  y: 0.93,
  z: 0.896,
  A: 1.16,
  B: 1.14,
  C: 1.316,
  D: 1.302,
  E: 1.14,
  F: 1.128,
  G: 1.34,
  H: 1.28,
  I: 0.42,
  J: 1.004,
  K: 1.215,
  L: 0.943,
  M: 1.58,
  N: 1.3,
  O: 1.33,
  P: 1.177,
  Q: 1.33,
  R: 1.232,
  S: 1.056,
  T: 1.1,
  U: 1.289,
  V: 1.16,
  W: 1.882,
  X: 1.14,
  Y: 1.07,
  Z: 1.2,
  '-': 0.59,
  "'": 0.3,
  '’': 0.303,
  '.': 0.354,
  ':': 0.354,
  ',': 0.303,
};

function widthEm(word: string) {
  return [...word].reduce((sum, char) => {
    const base = char.normalize('NFD')[0]; // é a la largeur de e
    return sum + (SYNE_800[base] ?? (base === base.toLowerCase() ? 1 : 1.2));
  }, 0);
}

// Plus grande taille, plafonnée à 48 px, à laquelle le mot le plus long tient sur une ligne
// de l'écran (moins les 2 × 24 px de marge). 2 % de marge pour les arrondis de rendu.
function mobileTitleSize(title: string) {
  const widest = Math.max(...title.split(' ').map(widthEm));
  return `min(3rem, calc((100vw - 3rem) / ${(widest * 1.02).toFixed(2)}))`;
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
              // Deux tailles calculées : en casse normale sous 768 px, en capitales au-dessus.
              style={
                {
                  '--titre-mobile': mobileTitleSize(main),
                  '--titre-ordi': titleSize(main),
                } as CSSProperties
              }
              className="mt-5 font-heading font-extrabold leading-[0.95] text-pro-accent [font-size:var(--titre-mobile)] [text-shadow:0_0_28px_rgba(142,205,248,0.5)] md:uppercase md:[--marge:6rem] md:[--titre-max:5rem] md:[font-size:var(--titre-ordi)] lg:[--marge:10rem]"
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
