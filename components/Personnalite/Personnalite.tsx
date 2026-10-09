'use client';

import CopyEmail from '@/components/CopyEmail';
import Reveal from '@/components/Reveal';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';
import { FaGithub, FaLinkedin } from '@/lib/icons';
import { FaSpotify, FaYoutube } from '@/lib/icons';
import { HiOutlineArrowLeft } from '@/lib/icons';
import PhotoMosaic from './PhotoMosaic';
import { LiveClock } from './widgets';

interface Props {
  onClose: () => void;
}

// Les valeurs "…_ICI" de data/profile.ts sont des emplacements encore vides.
const isPlaceholder = (text: string) => /_ICI$/.test(text);

function Tile({
  label,
  className = '',
  delay = 0,
  children,
}: {
  label: string;
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col rounded-3xl border border-perso-accent/10 bg-perso-surface/90 p-6 transition-colors hover:border-perso-accent/30 ${className}`}
    >
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-perso-accent">
        {label}
      </p>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

// Photo du livre si elle existe, sinon une couverture dessinée façon livre de poche.
function BookCover({ book }: { book: { title: string; author: string; cover: string } }) {
  return (
    <span className="relative block h-[136px] w-[88px] shrink-0 overflow-hidden rounded-[3px] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.7)] ring-1 ring-black/25">
      {isPlaceholder(book.cover) ? (
        <span className="flex h-full flex-col justify-between bg-[#ece2cd] px-2 py-2.5 text-center">
          <span className="font-heading text-[11px] font-bold uppercase leading-tight tracking-wide text-[#2b2620]">
            {book.title}
          </span>
          <span className="text-[7px] uppercase leading-tight tracking-[0.12em] text-[#2b2620]/70">
            {book.author}
          </span>
          <span className="block h-1.5 w-full rounded-sm bg-perso-accent/80" />
        </span>
      ) : (
        <Image
          src={book.cover}
          alt={`Couverture de ${book.title}`}
          fill
          sizes="88px"
          className="object-cover"
        />
      )}
      {/* La tranche, pour que ça se lise comme un livre posé de face. */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[6px] bg-gradient-to-r from-black/35 to-transparent" />
    </span>
  );
}

function Soon({ children }: { children: ReactNode }) {
  return <p className="font-mono text-sm text-perso-text/60">{children}</p>;
}

export default function Personnalite({ onClose }: Props) {
  const { personality } = profile;
  const hobbies = personality.hobbies.filter((h) => !isPlaceholder(h.title));
  const music = personality.music.filter((m) => !isPlaceholder(m.title));
  const reading = personality.reading;

  return (
    <div className="min-h-screen pb-32 text-perso-text">
      {/* Hero : le soleil dans le noir */}
      <section
        className={`${container} grid min-h-screen grid-cols-1 items-center gap-12 pb-24 pt-28 lg:grid-cols-12 lg:pb-0`}
      >
        <Reveal className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-perso-accent">
            L&apos;humain · 太陽
          </p>
          <blockquote className="mt-6">
            <h1 className="font-heading text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[0.95]">
              <span className="text-perso-accent">«</span> En chacun de nous existe{' '}
              <span className="italic text-perso-accent">un soleil.</span>{' '}
              <span className="text-perso-accent">»</span>
            </h1>
          </blockquote>
          <p className="mt-8 max-w-md text-lg text-perso-text/60">
            Voici le mien : ce qui m&apos;éclaire quand je ne code pas.
          </p>
        </Reveal>

        <motion.figure
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[560px] lg:col-span-6"
        >
          <div className="absolute inset-[12%] rounded-full bg-perso-accent/30 blur-[80px]" />
          <Image
            src="/static/images/perso/soleil.webp"
            alt="Le Soleil photographié en ultraviolet par le satellite SDO de la NASA"
            fill
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            className="object-contain"
          />
          <figcaption className="absolute -bottom-2 right-0 font-mono text-[10px] uppercase tracking-[0.2em] text-perso-text/60">
            Le Soleil · NASA / SDO · 171 Å
          </figcaption>
        </motion.figure>
      </section>

      {/* Tableau de bord : ce qui gravite autour */}
      <section className={container}>
        <Reveal className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-perso-accent">
            Mon système solaire
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold md:text-5xl">
            Ce qui gravite autour de moi.
          </h2>
        </Reveal>

        <div className="mb-24">
          <PhotoMosaic groups={personality.photoGroups} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12">
          <Tile label="En direct" className="md:col-span-3 lg:col-span-6">
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-perso-accent/60">
                  <Image
                    src={personality.avatar}
                    alt="Fanel Balemo"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <div>
                  <p className="font-heading text-xl font-bold">{profile.name}</p>
                  <p className="font-mono text-sm text-perso-text/60">@Fanel-B</p>
                </div>
              </div>
              <LiveClock />
              <div className="space-y-2 font-mono text-sm">
                <p className="flex items-center gap-2 text-[#9EE6CF]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#9EE6CF]" />
                  {profile.availability}
                </p>
                <p className="text-perso-text/60">
                  SELECT motivation FROM fanel; <span className="text-perso-accent">-- ∞</span>
                </p>
              </div>
            </div>
          </Tile>

          <Tile label="Face B" className="md:col-span-3 lg:col-span-6" delay={0.08}>
            {music.length ? (
              <ol className="space-y-3">
                {music.map((track) => (
                  <li key={track.title} className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={track.cover}
                        alt={`Pochette de l'album ${track.album}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-bold">{track.title}</p>
                      <p className="truncate text-xs text-perso-text/60">{track.artist}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {track.spotify && (
                        <a
                          href={track.spotify}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Écouter ${track.title} sur Spotify`}
                          className="rounded-full p-1.5 text-perso-text/60 transition-colors hover:text-[#1DB954]"
                        >
                          <FaSpotify size={18} />
                        </a>
                      )}
                      {track.youtube && (
                        <a
                          href={track.youtube}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Écouter ${track.title} sur YouTube`}
                          className="rounded-full p-1.5 text-perso-text/60 transition-colors hover:text-[#FF0033]"
                        >
                          <FaYoutube size={18} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <Soon>La playlist arrive bientôt.</Soon>
            )}
          </Tile>

          <Tile label="En ce moment je lis" className="md:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-5">
              <BookCover book={reading} />
              <div className="min-w-0">
                <p className="font-heading text-lg font-bold leading-tight">{reading.title}</p>
                <p className="mt-1 text-sm text-perso-text/60">{reading.author}</p>
                {reading.note && (
                  <p className="mt-3 text-sm italic leading-relaxed text-perso-text/70">
                    {reading.note}
                  </p>
                )}
              </div>
            </div>
          </Tile>

          <Tile label="Hors de l'écran" className="md:col-span-2 lg:col-span-4" delay={0.08}>
            {hobbies.length ? (
              <ul className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <li
                    key={hobby.title}
                    className="rounded-2xl border border-perso-accent/25 px-4 py-2"
                  >
                    <p className="font-heading font-bold">{hobby.title}</p>
                    {hobby.description && (
                      <p className="text-sm text-perso-text/60">{hobby.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Passions en cours de développement…</Soon>
            )}
          </Tile>

          <Tile label="Me trouver" className="md:col-span-2 lg:col-span-4" delay={0.16}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'GitHub', href: profile.contact.github, icon: FaGithub },
                { label: 'LinkedIn', href: profile.contact.linkedin, icon: FaLinkedin },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-perso-accent/15 text-perso-text/70 transition-colors hover:border-perso-accent hover:text-perso-accent"
                >
                  <Icon size={24} />
                </a>
              ))}
              <CopyEmail className="flex aspect-square items-center justify-center rounded-2xl border border-perso-accent/15 text-perso-text/70 transition-colors hover:border-perso-accent hover:text-perso-accent" />
            </div>
          </Tile>
        </div>

        <div className="mt-20 flex justify-center">
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-3 rounded-full border border-perso-accent/40 px-7 py-3.5 text-perso-accent transition-colors hover:bg-perso-accent hover:text-perso-bg"
          >
            <HiOutlineArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Retour côté pro
          </button>
        </div>
      </section>
    </div>
  );
}
