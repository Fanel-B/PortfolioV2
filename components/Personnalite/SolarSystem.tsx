'use client';

import { PhotoItem } from '@/data/profile';
import { HiArrowRight, HiOutlineArrowLeft, HiX } from '@/lib/icons';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  photos: PhotoItem[];
}

// Les photos tournent autour du soleil comme des planètes, sur des orbites inclinées.
// Plus une orbite est proche du soleil, plus la planète va vite (3e loi de Kepler).
// Au survol, tout s'arrête ; au clic, la photo s'ouvre en grand.
export default function SolarSystem({ photos }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const paused = useRef(false);
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const mobile = width < 640;
  const planet = mobile ? 56 : 84;
  const sun = mobile ? 96 : 150;
  const tilt = mobile ? 0.62 : 0.36; // aplatissement des orbites : on les voit de biais
  const rMin = sun * 0.7 + planet * 0.6;
  const rMax = Math.max(rMin, width / 2 - planet / 2 - 8);
  const radii = photos.map((_, i) => rMin + (i * (rMax - rMin)) / Math.max(1, photos.length - 1));
  const height = Math.round(2 * rMax * tilt + planet + 48);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!width) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Angles de départ répartis avec l'angle d'or, pour que les planètes ne s'alignent pas.
    const angles = photos.map((_, i) => i * 2.4);
    const cx = width / 2;
    const cy = height / 2;

    const place = () => {
      planetRefs.current.forEach((node, i) => {
        if (!node) return;
        const angle = angles[i];
        const x = cx + radii[i] * Math.cos(angle) - planet / 2;
        const y = cy + radii[i] * tilt * Math.sin(angle) - planet / 2;
        const depth = (Math.sin(angle) + 1) / 2; // 0 = derrière le soleil, 1 = devant
        node.style.transform = `translate(${x}px, ${y}px) scale(${0.7 + 0.3 * depth})`;
        node.style.zIndex = depth > 0.5 ? '20' : '5';
        node.style.opacity = String(0.5 + 0.5 * depth);
      });
    };

    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!paused.current) {
        angles.forEach((_, i) => {
          angles[i] += 0.5 * Math.pow(rMin / radii[i], 1.5) * dt;
        });
      }
      place();
      frame = requestAnimationFrame(tick);
    };

    place();
    if (!reducedMotion) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Les rayons se recalculent avec la largeur : on relance l'animation quand elle change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // Visionneuse : Échap pour fermer, flèches pour naviguer, page bloquée derrière.
  useEffect(() => {
    if (open === null) return;
    const count = photos.length;
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
  }, [open, photos.length]);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);
  const shown = open === null ? null : photos[open];

  return (
    <>
      <div
        ref={boxRef}
        style={{ height: width ? height : 420 }}
        className={`relative w-full select-none transition-opacity duration-700 ${
          width ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Orbites */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
          {radii.map((rx, i) => (
            <ellipse
              key={i}
              cx={width / 2}
              cy={height / 2}
              rx={rx}
              ry={rx * tilt}
              fill="none"
              stroke="rgba(242, 184, 128, 0.16)"
              strokeDasharray={i % 2 ? '2 7' : undefined}
            />
          ))}
        </svg>

        {/* Le soleil */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ width: sun, height: sun }}
        >
          <div className="absolute -inset-6 rounded-full bg-perso-accent/30 blur-2xl" />
          <Image
            src="/static/images/perso/soleil-sdo.jpg"
            alt=""
            fill
            sizes="150px"
            className="animate-[spin_120s_linear_infinite] rounded-full object-cover mix-blend-screen [mask-image:radial-gradient(circle,black_55%,transparent_71%)]"
          />
        </div>

        {/* Les planètes-photos */}
        {photos.map((photo, i) => (
          <button
            key={photo.thumb}
            ref={(node) => {
              planetRefs.current[i] = node;
            }}
            type="button"
            onClick={() => setOpen(i)}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocus={pause}
            onBlur={resume}
            aria-label={`Agrandir la photo : ${photo.alt}`}
            className="group absolute left-0 top-0 will-change-transform"
            style={{ width: planet, height: planet }}
          >
            <span className="relative block h-full w-full overflow-hidden rounded-full border-2 border-perso-accent/50 shadow-[0_0_24px_rgba(242,184,128,0.35)] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125">
              <Image src={photo.thumb} alt="" fill sizes="84px" className="object-cover" />
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-perso-text/35">
        Survolez une planète pour l&apos;arrêter · cliquez pour l&apos;agrandir
      </p>

      {/* Rendue hors de la page qui pivote, pour passer au-dessus de la navbar. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {shown && open !== null && (
              <motion.div
                key="visionneuse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Photo agrandie"
                className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
              >
                <motion.figure
                  key={shown.src}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-w-[92vw] flex-col items-center gap-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shown.src}
                    alt={shown.alt}
                    className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                  />
                  <figcaption className="text-center">
                    {shown.caption && (
                      <p className="font-heading text-lg text-perso-text">{shown.caption}</p>
                    )}
                    <p className="mt-1 font-mono text-xs text-perso-text/40">
                      {String(open + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                    </p>
                  </figcaption>
                </motion.figure>

                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setOpen(null)}
                  className="absolute right-4 top-4 rounded-full p-2 text-perso-text/70 transition-colors hover:bg-white/10 hover:text-perso-text"
                >
                  <HiX size={24} />
                </button>
                <button
                  type="button"
                  aria-label="Photo précédente"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((open - 1 + photos.length) % photos.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-3 text-perso-text/70 transition-colors hover:bg-white/10 hover:text-perso-text md:left-6"
                >
                  <HiOutlineArrowLeft size={24} />
                </button>
                <button
                  type="button"
                  aria-label="Photo suivante"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((open + 1) % photos.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-3 text-perso-text/70 transition-colors hover:bg-white/10 hover:text-perso-text md:right-6"
                >
                  <HiArrowRight size={24} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
