'use client';

import { TimelineItem } from '@/data/profile';
import { motion } from 'framer-motion';

interface Props {
  items: TimelineItem[];
}

// L'étape suivante, laissée ouverte : c'est là que le recruteur entre en scène.
const NEXT_STEP: TimelineItem = {
  period: 'Prochaine étape',
  title: 'Alternance — votre entreprise ?',
  description: 'Je cherche une équipe où construire et analyser, au quotidien.',
};

export default function Timeline({ items }: Props) {
  // Les données sont de la plus récente à la plus ancienne ; la trajectoire se lit dans l'autre sens.
  const steps = [...items].reverse();

  return (
    <div className="relative">
      {/* Trajet : horizontal sur grand écran, vertical sur mobile */}
      <span className="absolute left-[5px] top-2 h-full w-px bg-white/10 md:left-0 md:top-[5px] md:h-px md:w-full" />
      <motion.span
        initial={{ scaleX: 0, scaleY: 0 }}
        whileInView={{ scaleX: 1, scaleY: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        className="absolute left-[5px] top-2 h-[45%] w-px origin-top bg-gradient-to-b from-pro-accent to-pro-lavande shadow-glow md:left-0 md:top-[5px] md:h-px md:w-1/3 md:origin-left md:bg-gradient-to-r"
      />

      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {[...steps, NEXT_STEP].map((item, i) => {
          const isNext = item === NEXT_STEP;
          const isNow = i === steps.length - 1;
          return (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.25 }}
              className="relative pl-8 md:pl-0 md:pt-10"
            >
              <span
                className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full md:top-0 ${
                  isNext
                    ? 'border border-dashed border-pro-menthe bg-pro-bg'
                    : isNow
                    ? 'bg-pro-accent shadow-glow-lg'
                    : 'bg-pro-accent/60'
                }`}
              />
              {isNow && (
                <span className="absolute left-0 top-1 h-[11px] w-[11px] animate-ping rounded-full bg-pro-accent/60 md:top-0" />
              )}
              <p
                className={`font-mono text-xs uppercase tracking-[0.2em] ${
                  isNext ? 'text-pro-menthe' : 'text-pro-accent'
                }`}
              >
                {item.period}
              </p>
              <h3
                className={`mt-2 font-heading text-xl font-bold ${
                  isNext ? 'text-pro-text/80' : 'text-pro-text'
                }`}
              >
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-pro-text/60">{item.description}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
