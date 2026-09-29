'use client';

import SectionHeader from '@/components/SectionHeader';
import { profile, ProjectCategory } from '@/data/profile';
import { container } from '@/lib/ui';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import ProjectCard from './ProjectCard';

type Filter = 'Tous' | ProjectCategory;
const FILTERS: Filter[] = ['Tous', 'Web', 'Data', 'IA'];

export default function Travail() {
  const [filter, setFilter] = useState<Filter>('Tous');
  const projects = profile.projects.filter(
    (project) => filter === 'Tous' || project.categories.includes(filter)
  );

  return (
    <section id="lancements" className="scroll-mt-24 py-28 md:py-40">
      <div className={container}>
        <div className="mb-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="03"
            kicker="Lancements"
            title={
              <>
                Les projets que j&apos;ai <span className="text-pro-accent">mis en orbite.</span>
              </>
            }
          />

          <div
            role="tablist"
            aria-label="Filtrer les projets"
            className="flex w-fit gap-1 rounded-full border border-white/10 bg-pro-bg/60 p-1 font-mono text-sm"
          >
            <LayoutGroup id="filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`relative rounded-full px-5 py-2 transition-colors ${
                    filter === f ? 'text-pro-bg' : 'text-pro-text/60 hover:text-pro-text'
                  }`}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-pro-accent shadow-glow"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>
        </div>

        <motion.div layout className="grid gap-6 lg:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                number={profile.projects.indexOf(project) + 1}
                featured={i === 0}
                className={
                  i === 0
                    ? projects.length > 1
                      ? 'lg:col-span-7 lg:row-span-2'
                      : 'lg:col-span-12'
                    : 'lg:col-span-5'
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
