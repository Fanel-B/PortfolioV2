'use client';

import { profile } from '@/data/profile';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaFilePdf, FaLinkedin } from '@/lib/icons';
import { HiDownload, HiX } from '@/lib/icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CvModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mon CV"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-pro-accent/20 bg-pro-surface/90 shadow-glow-lg backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <h2 className="font-heading text-lg text-pro-text">Mon CV</h2>
              <div className="flex items-center gap-3">
                {profile.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-full bg-pro-accent px-4 py-1.5 font-heading text-sm text-pro-bg transition-shadow hover:shadow-glow"
                  >
                    <HiDownload /> Télécharger
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer"
                  className="rounded-full p-1.5 text-pro-text/70 transition-colors hover:bg-white/10 hover:text-pro-text"
                >
                  <HiX size={20} />
                </button>
              </div>
            </div>

            {profile.cvUrl ? (
              <iframe src={profile.cvUrl} title="CV de Fanel Balemo" className="flex-1 bg-white" />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <FaFilePdf size={48} className="text-pro-accent/60" />
                <p className="font-heading text-xl text-pro-text">Mon CV arrive très bientôt</p>
                <p className="max-w-sm text-sm text-pro-text/70">
                  En attendant, mon parcours et mes projets sont sur cette page, et vous pouvez me
                  retrouver sur LinkedIn.
                </p>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-pro-accent px-5 py-2 font-heading text-sm text-pro-accent transition-colors hover:bg-pro-accent hover:text-pro-bg"
                >
                  <FaLinkedin /> Voir mon LinkedIn
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
