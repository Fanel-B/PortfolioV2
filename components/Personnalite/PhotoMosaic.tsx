'use client';

import { PhotoGroup, PhotoItem } from '@/data/profile';
import { HiArrowRight, HiOutlineArrowLeft, HiX } from '@/lib/icons';
import Image from 'next/image';
import { CSSProperties, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  /** Dans l'ordre : moi (2 photos), mes amis (2 photos), Bangui (1 photo). */
  groups: PhotoGroup[];
}

interface Tile {
  photo: PhotoItem;
  label: string;
}

const ratio = (photo: PhotoItem) => photo.width / photo.height;

// Mosaïque « Tetris » pensée pour 5 photos :
//
//   ┌──────┬─────────────┬──────┐
//   │      │    amis 1   │      │
//   │ moi  ├──────┬──────┤ moi  │
//   │  1   │amis 2│Bangui│  2   │
//   └──────┴──────┴──────┴──────┘
//
// Les largeurs de colonnes et hauteurs de rangées sont calculées à partir du format de chaque photo,
// pour que tout s'emboîte sans trou et (presque) sans recadrage.
function layout(a: PhotoItem, b: PhotoItem, c: PhotoItem, d: PhotoItem, e: PhotoItem) {
  const bottomRow = 1; // hauteur de la rangée du bas, prise comme unité
  const col2 = ratio(c) * bottomRow;
  const col3 = ratio(d) * bottomRow;
  const topRow = (col2 + col3) / ratio(b);
  const total = topRow + bottomRow;
  const col1 = ratio(a) * total;
  const col4 = ratio(e) * total;
  return {
    gridTemplateColumns: `${col1}fr ${col2}fr ${col3}fr ${col4}fr`,
    gridTemplateRows: `${topRow}fr ${bottomRow}fr`,
    aspectRatio: `${col1 + col2 + col3 + col4} / ${total}`,
  } as CSSProperties;
}

export default function PhotoMosaic({ groups }: Props) {
  const [moi, amis, bangui] = groups;
  const tiles: Tile[] = [
    { photo: moi.photos[0], label: moi.title },
    { photo: amis.photos[0], label: amis.title },
    { photo: amis.photos[1], label: amis.title },
    { photo: bangui.photos[0], label: bangui.title },
    { photo: moi.photos[1], label: moi.title },
  ];
  // Emplacement de chaque photo dans la grille (ordinateur)
  const areas = [
    'md:col-start-1 md:row-span-2',
    'md:col-start-2 md:col-span-2 md:row-start-1',
    'md:col-start-2 md:row-start-2',
    'md:col-start-3 md:row-start-2',
    'md:col-start-4 md:row-span-2 md:row-start-1',
  ];
  // Sur mobile : rangées de photos à hauteur égale (portraits ensemble, puis le repas, puis le reste)
  const mobileRows = [[0, 4], [1], [2, 3]];

  const [open, setOpen] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Visionneuse : Échap pour fermer, flèches pour naviguer, page bloquée derrière.
  useEffect(() => {
    if (open === null) return;
    const count = tiles.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % count));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + count) % count));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, tiles.length]);

  const go = (step: number) =>
    setOpen((i) => (i === null ? i : (i + step + tiles.length) % tiles.length));

  const tile = (index: number, className: string, style?: CSSProperties) => {
    const { photo, label } = tiles[index];
    return (
      <button
        key={photo.src}
        type="button"
        onClick={() => setOpen(index)}
        aria-label={`Agrandir : ${photo.alt}`}
        className={`relative overflow-hidden rounded-xl bg-perso-surface ${className}`}
        style={style}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 768px) 400px, 50vw"
          className="object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-md bg-perso-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-perso-accent">
          {label}
        </span>
      </button>
    );
  };

  const shown = open === null ? null : tiles[open].photo;

  return (
    <>
      {desktop ? (
        <div
          className="grid max-w-[1000px] gap-2"
          style={layout(
            ...(tiles.map((t) => t.photo) as [
              PhotoItem,
              PhotoItem,
              PhotoItem,
              PhotoItem,
              PhotoItem
            ])
          )}
        >
          {tiles.map((_, i) => tile(i, areas[i]))}
        </div>
      ) : (
        <div className="space-y-2">
          {mobileRows.map((row) => (
            <div key={row.join('-')} className="flex gap-2">
              {row.map((i) =>
                tile(i, '', {
                  flex: `${ratio(tiles[i].photo)} 1 0%`,
                  aspectRatio: `${ratio(tiles[i].photo)}`,
                })
              )}
            </div>
          ))}
        </div>
      )}

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
              {String(open + 1).padStart(2, '0')} / {String(tiles.length).padStart(2, '0')}
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
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-3 text-perso-text/70 hover:bg-white/10 hover:text-perso-text md:left-6"
            >
              <HiOutlineArrowLeft size={24} />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-3 text-perso-text/70 hover:bg-white/10 hover:text-perso-text md:right-6"
            >
              <HiArrowRight size={24} />
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
