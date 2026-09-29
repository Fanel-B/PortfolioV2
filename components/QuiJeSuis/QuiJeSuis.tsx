'use client';

import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Timeline from './Timeline';

const corner = 'absolute h-5 w-5 border-pro-accent';

export default function QuiJeSuis() {
  const facts = [
    ['Formation', profile.formation],
    ['Recherche', profile.search],
    ['Mobilité', profile.mobility],
    ['Double profil', 'Développement full stack · Analyse de données'],
    ['Langues', profile.languages],
  ];

  return (
    <section id="origine" className="scroll-mt-24 py-28 md:py-40">
      <div className={`${container} grid grid-cols-1 gap-14 lg:grid-cols-12`}>
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
            <div className="group relative self-start p-3">
              <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
              <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
              <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
              <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-pro-surface">
                <Image
                  src={profile.portrait}
                  alt="Portrait de Fanel Balemo"
                  fill
                  sizes="(min-width: 768px) 240px, 90vw"
                  className="object-cover grayscale-[35%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
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
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-pro-text/60">
                    {label}
                  </dt>
                  <dd className="text-pro-text">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div>
            <Reveal>
              <p className="mb-10 font-mono text-xs uppercase tracking-[0.25em] text-pro-text/60">
                Trajectoire
              </p>
            </Reveal>
            <Timeline items={profile.timeline} />
          </div>

          <div>
            <Reveal>
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-pro-text/60">
                Sur le terrain
              </p>
            </Reveal>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {profile.experiences.map((job, i) => (
                <motion.li
                  key={job.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-pro-accent">
                    {job.period}
                  </p>
                  <div>
                    <p className="font-heading text-lg font-bold text-pro-text">{job.role}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-pro-text/60">
                      {job.place}
                    </p>
                    <p className="mt-2 text-sm text-pro-text/65">{job.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
