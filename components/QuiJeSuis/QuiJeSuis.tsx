'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import EpisodeTeaser from './EpisodeTeaser';
import Timeline from './Timeline';

const corner = 'absolute h-5 w-5 border-pro-accent';

interface Props {
  onOpenHuman: () => void;
}

export default function QuiJeSuis({ onOpenHuman }: Props) {
  const facts = [
    ['Formation', profile.formation],
    ['Base', profile.location],
    ['Recherche', profile.availability],
    ['Double profil', 'Développement full stack · Analyse de données'],
  ];

  return (
    <section id="origine" className="scroll-mt-24 py-28 md:py-40">
      <div className={`${container} grid gap-14 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              index="01"
              kicker="Origine"
              title={
                <>
                  Un pied dans le code,{' '}
                  <span className="text-pro-accent">l&apos;autre dans les données.</span>
                </>
              }
            />
          </div>
        </div>

        <div className="space-y-16 lg:col-span-7">
          <Reveal className="grid gap-10 md:grid-cols-[minmax(0,240px)_1fr]">
            {/* Photo dans un viseur, comme le curseur */}
            <div className="relative p-3">
              <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
              <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
              <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
              <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
              <PlaceholderImage
                label="Photo à venir"
                className="aspect-[4/5] w-full rounded-none"
              />
            </div>

            <div className="space-y-5 text-lg leading-relaxed text-pro-text/75 md:text-xl">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <dl className="divide-y divide-white/10 border-y border-white/10">
              {facts.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr]">
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-pro-text/40">
                    {label}
                  </dt>
                  <dd className="text-pro-text">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div>
            <Reveal>
              <p className="mb-10 font-mono text-xs uppercase tracking-[0.25em] text-pro-text/40">
                Trajectoire
              </p>
            </Reveal>
            <Timeline items={profile.timeline} />
          </div>
        </div>
      </div>

      {/* Fin d'Origine : la porte vers le côté humain */}
      <div className={`${container} mt-28 md:mt-36`}>
        <EpisodeTeaser onOpen={onOpenHuman} />
      </div>
    </section>
  );
}
