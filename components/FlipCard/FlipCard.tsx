'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
}

export default function FlipCard({ front, back, isFlipped }: Props) {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ perspective: '2000px' }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: isFlipped ? -180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div
          className={`absolute inset-0 overflow-y-auto ${isFlipped ? 'pointer-events-none' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
          aria-hidden={isFlipped}
        >
          {front}
        </div>
        <div
          className={`absolute inset-0 overflow-y-auto ${isFlipped ? '' : 'pointer-events-none'}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          aria-hidden={!isFlipped}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
