'use client';

import { PhotoGroup, PhotoItem } from '@/data/profile';
import { HiArrowRight, HiOutlineArrowLeft, HiX } from '@/lib/icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  groups: PhotoGroup[];
}

// Hauteur maximale d'une rangée de photos, en pixels (sauf pour une photo seule, qui prend toute la largeur).
const ROW_MAX_HEIGHT = 600;

export default function PhotoGroups({ groups }: Props) {
  const all = groups.flatMap((group) => group.photos);
  const [open, setOpen] = useState<number | null>(null);

  // Visionneuse : Échap pour fermer, flèches pour naviguer, page bloquée derrière.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % all.length));
      if (e.key === 'ArrowLeft')
        setOpen((i) => (i === null ? i : (i - 1 + all.length) % all.length));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, all.length]);

  const shown: PhotoItem | null = open === null ? null : all[open];
  const go = (step: number) =>
    setOpen((i) => (i === null ? i : (i + step + all.length) % all.length));

  return (
    <div className="space-y-16">
      {groups.map((group, g) => {
        const ratios = group.photos.map((photo) => photo.width / photo.height);
        const rowRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
        return (
          <section key={group.title}>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-perso-accent">
              {String(g + 1).padStart(2, '0')} · {group.kicker}
            </p>
            <h3 className="mb-6 mt-2 font-heading text-2xl font-bold md:text-3xl">{group.title}</h3>

            {/* Chaque photo occupe une largeur proportionnelle à son format : même hauteur, rien de coupé. */}
            <div
              className="flex flex-col gap-4 sm:flex-row"
              style={{
                maxWidth: group.photos.length > 1 ? rowRatio * ROW_MAX_HEIGHT : undefined,
              }}
            >
              {group.photos.map((photo, i) => {
                const index = all.indexOf(photo);
                return (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setOpen(index)}
                    aria-label={`Agrandir : ${photo.alt}`}
                    className="relative overflow-hidden rounded-2xl bg-perso-surface"
                    style={{ flex: `${ratios[i]} 1 0%`, aspectRatio: `${ratios[i]}` }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {shown &&
        open !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Photo agrandie"
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4"
          >
            {/* Clic sur le fond = fermer */}
            <button
              type="button"
              aria-label="Fermer la photo"
              onClick={() => setOpen(null)}
              className="absolute inset-0 cursor-default"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shown.src}
              alt={shown.alt}
              className="relative max-h-[85vh] max-w-full rounded-xl object-contain"
            />
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-perso-text/50">
              {String(open + 1).padStart(2, '0')} / {String(all.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-perso-text/70 hover:bg-white/10 hover:text-perso-text"
            >
              <HiX size={24} />
            </button>
            <button
              type="button"
              aria-label="Photo précédente"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-3 text-perso-text/70 hover:bg-white/10 hover:text-perso-text md:left-6"
            >
              <HiOutlineArrowLeft size={24} />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-3 text-perso-text/70 hover:bg-white/10 hover:text-perso-text md:right-6"
            >
              <HiArrowRight size={24} />
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
