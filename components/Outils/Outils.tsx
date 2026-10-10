'use client';

import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { profile } from '@/data/profile';
import { skillIcon } from '@/lib/skillIcons';
import { container } from '@/lib/ui';
import { motion } from 'framer-motion';

const allTools = profile.outils.flatMap((category) => category.items);
const half = Math.ceil(allTools.length / 2);
const BANDS = [allTools.slice(0, half), allTools.slice(half)];

function Band({ tools, reverse }: { tools: string[]; reverse?: boolean }) {
  // Liste doublée pour que la boucle soit continue.
  const loop = [...tools, ...tools];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <ul className={`flex shrink-0 gap-4 pr-4 ${reverse ? 'marquee-reverse' : 'marquee'}`}>
        {loop.map((tool, i) => {
          const Icon = skillIcon(tool);
          return (
            <li
              key={tool + i}
              aria-hidden={i >= tools.length}
              className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-pro-surface/40 px-5 py-3 font-heading text-lg text-pro-text/80"
            >
              <Icon className="text-pro-accent" size={20} />
              {tool}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Outils() {
  return (
    <section id="arsenal" className="scroll-mt-24 py-28 md:py-40">
      <div className={container}>
        <SectionHeader
          index="02"
          kicker="Arsenal"
          title={
            <>
              De quoi construire <span className="text-pro-accent">et</span> comprendre.
            </>
          }
        />
      </div>

      <Reveal className="my-16 space-y-4 md:my-20">
        {BANDS.map((tools, i) => (
          <Band key={i} tools={tools} reverse={i % 2 === 1} />
        ))}
      </Reveal>

      <div className={container}>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {profile.outils.map((category, i) => (
            <motion.div
              key={category.categorie}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group bg-pro-bg/80 p-6 transition-colors hover:bg-pro-surface/80"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-pro-text/60">
                {String(i + 1).padStart(2, '0')} · {category.items.length} outils
              </p>
              <h3 className="mt-3 font-heading text-xl font-bold text-pro-text transition-colors group-hover:text-pro-accent">
                {category.categorie}
              </h3>
              <ul className="mt-5 space-y-2.5">
                {category.items.map((tool) => {
                  const Icon = skillIcon(tool);
                  return (
                    <li key={tool} className="flex items-center gap-3 text-sm text-pro-text/70">
                      <Icon size={15} className="shrink-0 text-pro-text/60" />
                      {tool}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {profile.apprentissages.length > 0 && (
          <Reveal className="mt-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-pro-accent/20 bg-pro-surface/30 px-6 py-5 sm:flex-row sm:items-center sm:gap-6">
              <p className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-pro-accent">
                En cours d&apos;apprentissage
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {profile.apprentissages.map((item) => {
                  const Icon = skillIcon(item);
                  return (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-full border border-pro-accent/30 px-4 py-1.5 text-sm text-pro-text/80"
                    >
                      <Icon size={15} className="shrink-0 text-pro-accent" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
