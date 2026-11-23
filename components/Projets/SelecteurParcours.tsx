'use client';

import { PARCOURS_CHOICES, ParcoursChoice } from '@/lib/parcours';
import { LayoutGroup, motion } from 'framer-motion';

interface Props {
  value: ParcoursChoice;
  /** Absent pendant le chargement : les boutons s'affichent mais ne font rien. */
  onChange?: (choice: ParcoursChoice) => void;
}

// Sélecteur Tout / Data / Dev, dans le style des filtres de la constellation.
export default function SelecteurParcours({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Choisir un parcours"
      className="flex w-fit gap-1 rounded-full border border-white/10 bg-pro-bg/60 p-1 font-mono text-sm"
    >
      <LayoutGroup id="parcours-projets">
        {PARCOURS_CHOICES.map((choice) => (
          <button
            key={choice.value}
            type="button"
            aria-pressed={value === choice.value}
            onClick={() => onChange?.(choice.value)}
            className={`relative rounded-full px-5 py-2 transition-colors ${
              value === choice.value ? 'text-pro-bg' : 'text-pro-text/60 hover:text-pro-text'
            }`}
          >
            {value === choice.value && (
              <motion.span
                layoutId="parcours-projets-pill"
                className="absolute inset-0 rounded-full bg-pro-accent shadow-glow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{choice.label}</span>
          </button>
        ))}
      </LayoutGroup>
    </div>
  );
}
