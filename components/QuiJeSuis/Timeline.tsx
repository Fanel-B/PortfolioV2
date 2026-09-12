'use client';

import { TimelineItem } from '@/data/profile';
import { motion } from 'framer-motion';

interface Props {
  items: TimelineItem[];
}

export default function Timeline({ items }: Props) {
  return (
    <div className="mt-16 space-y-8 border-l border-gray-200 pl-6 dark:border-pro-surface2">
      {items.map((item, i) => (
        <motion.div
          key={item.title + i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative"
        >
          <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-pro-accent" />
          <p className="font-accent text-xs uppercase tracking-wide text-pro-accent">
            {item.period}
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-pro-text">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-pro-text/70">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
