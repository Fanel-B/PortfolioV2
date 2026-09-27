'use client';

import { profile } from '@/data/profile';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { FaCheck, FaRegEnvelope } from '@/lib/icons';

interface Props {
  className?: string;
  /** Contenu du bouton ; par défaut, une icône d'enveloppe. */
  children?: ReactNode;
}

export default function CopyEmail({ className = '', children }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.contact.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copier mon email (${profile.contact.email})`}
      title={profile.contact.email}
      className={`relative ${className}`}
    >
      {children ?? (copied ? <FaCheck size={18} /> : <FaRegEnvelope size={20} />)}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-pro-menthe px-2 py-1 font-mono text-xs text-pro-bg"
          >
            Email copié ✓
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
