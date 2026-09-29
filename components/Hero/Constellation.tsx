'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Les initiales FB dessinées en constellation ; chaque étoile porte une compétence.
const STARS: Record<string, { x: number; y: number; skill: string; bright?: boolean }> = {
  a: { x: 25, y: 20, skill: 'Python', bright: true },
  b: { x: 85, y: 18, skill: 'React' },
  c: { x: 24, y: 82, skill: 'SQL', bright: true },
  d: { x: 70, y: 80, skill: 'Next.js' },
  e: { x: 22, y: 150, skill: 'Java' },
  g: { x: 120, y: 20, skill: 'Power BI', bright: true },
  h: { x: 170, y: 26, skill: 'Pandas' },
  i: { x: 186, y: 50, skill: 'Figma' },
  j: { x: 166, y: 79, skill: 'Git' },
  k: { x: 121, y: 82, skill: 'Excel' },
  l: { x: 191, y: 111, skill: 'Kotlin' },
  m: { x: 178, y: 141, skill: 'Tailwind', bright: true },
  n: { x: 118, y: 150, skill: 'PHP' },
};

const LINKS: [string, string][] = [
  ['a', 'b'],
  ['a', 'c'],
  ['c', 'd'],
  ['c', 'e'],
  ['g', 'h'],
  ['h', 'i'],
  ['i', 'j'],
  ['j', 'k'],
  ['g', 'k'],
  ['k', 'n'],
  ['j', 'l'],
  ['l', 'm'],
  ['m', 'n'],
];

export default function Constellation() {
  const [active, setActive] = useState<string | null>(null);
  const activeStar = active ? STARS[active] : null;

  return (
    <figure className="relative w-full select-none">
      <svg viewBox="0 0 215 170" className="w-full overflow-visible" role="img">
        <title>Constellation formant les initiales FB, chaque étoile est une compétence</title>
        {LINKS.map(([from, to], i) => {
          const lit = active === from || active === to;
          return (
            <motion.line
              key={from + to}
              x1={STARS[from].x}
              y1={STARS[from].y}
              x2={STARS[to].x}
              y2={STARS[to].y}
              stroke="#8ECDF8"
              strokeWidth={lit ? 0.9 : 0.5}
              strokeOpacity={lit ? 0.9 : 0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.09, ease: 'easeInOut' }}
            />
          );
        })}

        {Object.entries(STARS).map(([id, star], i) => (
          <motion.g
            key={id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 300, damping: 15 }}
            style={{ transformOrigin: `${star.x}px ${star.y}px` }}
            onMouseEnter={() => setActive(id)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(active === id ? null : id)}
            data-cursor
          >
            {/* Zone de survol plus large que l'étoile */}
            <circle cx={star.x} cy={star.y} r={9} fill="transparent" />
            {/* Halo : un simple cercle translucide, moins coûteux qu'un filtre de flou */}
            <circle
              cx={star.x}
              cy={star.y}
              r={active === id ? 8 : star.bright ? 6.5 : 4.5}
              fill={active === id ? '#9EE6CF' : '#8ECDF8'}
              fillOpacity={0.18}
            />
            <circle
              cx={star.x}
              cy={star.y}
              r={active === id ? 3.6 : star.bright ? 2.8 : 1.9}
              fill={active === id ? '#9EE6CF' : '#EAF4FF'}
              className="transition-all duration-300"
            >
              <animate
                attributeName="opacity"
                values="1;0.55;1"
                dur={`${2.5 + (i % 5) * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>
          </motion.g>
        ))}

        {activeStar && (
          <g pointerEvents="none">
            <line
              x1={activeStar.x + 5}
              y1={activeStar.y - 5}
              x2={activeStar.x + 14}
              y2={activeStar.y - 14}
              stroke="#9EE6CF"
              strokeWidth={0.5}
            />
            <text
              x={activeStar.x + 16}
              y={activeStar.y - 16}
              fill="#9EE6CF"
              fontSize={8}
              className="font-mono"
            >
              {activeStar.skill}
            </text>
          </g>
        )}
      </svg>

      <figcaption className="mt-6 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-pro-text/60">
        <span>Constellation FB</span>
        <span className="hidden xl:inline">43°36′N · 1°26′E</span>
        <span className="text-pro-accent/70">Survolez les étoiles</span>
      </figcaption>
    </figure>
  );
}
