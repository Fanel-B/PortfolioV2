'use client';

import Reveal from '@/components/Reveal';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';

interface Props {
  onClose: () => void;
}

// Les valeurs "…_ICI" de data/profile.ts sont des emplacements à remplir (voir A_FOURNIR.md).
const isPlaceholder = (text: string) => /_ICI$/.test(text);

function Chapter({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-perso-accent/15 grid gap-8 border-t py-16 lg:grid-cols-12 lg:py-24">
      <Reveal className="lg:col-span-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-perso-accent">{index}</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-perso-text md:text-4xl">
          {title}
        </h2>
      </Reveal>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

function Soon({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-perso-accent/25 px-6 py-8 font-mono text-sm text-perso-text/50">
      {children}
    </p>
  );
}

export default function Personnalite({ onClose }: Props) {
  const { personality } = profile;
  const hobbies = personality.hobbies.filter((h) => !isPlaceholder(h.title));
  const quotes = personality.quotes.filter((q) => !isPlaceholder(q.text));
  const music = personality.music.filter((m) => !isPlaceholder(m.title));
  const travels = personality.travels.filter((t) => !isPlaceholder(t.place));

  return (
    <div className="min-h-screen pb-32 pt-32 text-perso-text md:pt-40">
      <div className={container}>
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-perso-accent">
            Hors-champ · côté perso
          </p>
          <h1 className="mt-6 max-w-5xl font-heading text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold leading-[0.95]">
            Ce qu&apos;on ne voit pas <span className="italic text-perso-accent">sur un CV.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-perso-text/60">
            Les photos, les sons, les lieux et les idées qui font qui je suis quand je ne code pas.
          </p>
        </Reveal>

        <div className="mt-20">
          <Chapter index="01 — Pellicule" title="Quelques images">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {personality.photos.map((photo, i) => (
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: [-3, 2, -1.5][i % 3] }}
                  whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative bg-[#F3E9DC] p-2.5 pb-10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-perso-surface to-[#2A1A2E] font-mono text-xs uppercase tracking-[0.2em] text-perso-text/40">
                    Photo {String(i + 1).padStart(2, '0')}
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-3 text-center font-mono text-[11px] text-perso-bg/60">
                    {isPlaceholder(photo.caption) ? 'à développer…' : photo.caption}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </Chapter>

          <Chapter index="02 — Hors de l'écran" title="Ce qui m'occupe">
            {hobbies.length ? (
              <ul className="grid gap-6 sm:grid-cols-2">
                {hobbies.map((hobby) => (
                  <li key={hobby.title} className="rounded-2xl bg-perso-surface/70 p-6">
                    <p className="font-heading text-xl font-bold">{hobby.title}</p>
                    <p className="mt-2 text-perso-text/60">{hobby.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Passions en cours de développement…</Soon>
            )}
          </Chapter>

          <Chapter index="03 — Face B" title="Ce qui tourne en boucle">
            {music.length ? (
              <ol className="divide-y divide-perso-accent/10">
                {music.map((track, i) => (
                  <li key={track.title} className="flex items-baseline gap-6 py-4">
                    <span className="font-mono text-sm text-perso-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-heading text-xl">{track.title}</span>
                    {track.artist && <span className="text-perso-text/50">{track.artist}</span>}
                  </li>
                ))}
              </ol>
            ) : (
              <Soon>La playlist arrive bientôt.</Soon>
            )}
          </Chapter>

          <Chapter index="04 — Carnet de route" title="Les lieux qui comptent">
            {travels.length ? (
              <ul className="grid gap-6 sm:grid-cols-2">
                {travels.map((travel) => (
                  <li key={travel.place} className="rounded-2xl bg-perso-surface/70 p-6">
                    <p className="font-heading text-xl font-bold">{travel.place}</p>
                    <p className="mt-2 text-perso-text/60">{travel.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Carte en préparation.</Soon>
            )}
          </Chapter>

          <Chapter index="05 — Entre guillemets" title="Des phrases qui me suivent">
            {quotes.length ? (
              <ul className="space-y-10">
                {quotes.map((quote) => (
                  <li key={quote.text}>
                    <blockquote className="font-heading text-2xl italic leading-snug md:text-3xl">
                      &ldquo;{quote.text}&rdquo;
                    </blockquote>
                    {quote.author && (
                      <p className="mt-3 font-mono text-sm text-perso-accent">— {quote.author}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Citations à venir.</Soon>
            )}
          </Chapter>
        </div>

        <div className="border-perso-accent/15 border-t pt-16">
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-3 rounded-full border border-perso-accent/40 px-7 py-3.5 text-perso-accent transition-colors hover:bg-perso-accent hover:text-perso-bg"
          >
            <HiOutlineArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Retour côté pro
          </button>
        </div>
      </div>
    </div>
  );
}
