'use client';

import { profile } from '@/data/profile';
import { motion } from 'framer-motion';

export default function Outils() {
  return (
    <section id="outils" className="bg-gray-50 py-24 dark:bg-pro-surface/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-gray-900 dark:text-pro-text">
          Ce que j&apos;utilise
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {profile.outils.map((category, categoryIndex) => (
            <div key={category.categorie}>
              <h3 className="mb-4 font-accent text-sm uppercase tracking-wide text-pro-accent">
                {category.categorie}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((tool, i) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: (categoryIndex * category.items.length + i) * 0.03,
                    }}
                    whileHover={{ scale: 1.08 }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-accent text-sm text-gray-700 shadow-sm dark:border-pro-surface2 dark:bg-pro-surface dark:text-pro-text"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
