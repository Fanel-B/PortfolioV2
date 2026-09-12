'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import { profile } from '@/data/profile';
import { motion } from 'framer-motion';
import Timeline from './Timeline';

interface Props {
  onOpenPersonality: () => void;
}

export default function QuiJeSuis({ onOpenPersonality }: Props) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="grid gap-10 md:grid-cols-[280px_1fr] md:items-start"
      >
        <PlaceholderImage label="Photo à venir" className="aspect-square w-full" />

        <div>
          <h2 className="mb-6 font-display text-3xl font-bold text-gray-900 dark:text-pro-text">
            Qui je suis ?
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-pro-text/80">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-pro-surface2">
              <span className="block font-accent text-xs uppercase text-gray-400">Formation</span>
              {profile.formation}
            </div>
            <div className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-pro-surface2">
              <span className="block font-accent text-xs uppercase text-gray-400">
                Localisation
              </span>
              {profile.location}
            </div>
          </div>
        </div>
      </motion.div>

      <Timeline items={profile.timeline} />

      <div className="mt-16 flex justify-center">
        <button
          onClick={onOpenPersonality}
          className="rounded-full bg-pro-accent px-8 py-3 font-accent text-lg text-white transition-transform hover:scale-105"
        >
          MA PERSONNALITÉ →
        </button>
      </div>
    </section>
  );
}
