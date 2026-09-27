'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  index: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
}

// En-tête de section éditorial : numéro + mot-clé en mono, grand titre en dessous.
export default function SectionHeader({ index, kicker, title, children }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-pro-accent">
        <span>{index}</span>
        <span className="h-px w-10 bg-pro-accent/50" />
        <span>{kicker}</span>
      </p>
      <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.05] text-pro-text sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {children && <div className="mt-6 max-w-md text-pro-text/60">{children}</div>}
    </motion.header>
  );
}
