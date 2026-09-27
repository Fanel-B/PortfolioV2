'use client';

import CopyEmail from '@/components/CopyEmail';
import Reveal from '@/components/Reveal';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { LiveClock, NasaPhoto, Vinyl } from './widgets';

interface Props {
  onClose: () => void;
}

// Les valeurs "…_ICI" de data/profile.ts sont des emplacements à remplir (voir A_FOURNIR.md).
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
      className={`flex flex-col rounded-3xl border border-perso-accent/10 bg-perso-surface/70 p-6 backdrop-blur-md transition-colors hover:border-perso-accent/30 ${className}`}
    >
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-perso-accent">
        {label}
      </p>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

function Soon({ children }: { children: ReactNode }) {
  return <p className="font-mono text-sm text-perso-text/40">{children}</p>;
}

export default function Personnalite({ onClose }: Props) {
  const { personality } = profile;
  const hobbies = personality.hobbies.filter((h) => !isPlaceholder(h.title));
  const quote = personality.quotes.find((q) => !isPlaceholder(q.text));
  const music = personality.music.filter((m) => !isPlaceholder(m.title));
  const travels = personality.travels.filter((t) => !isPlaceholder(t.place));
  const learning = personality.learning.filter((l) => !isPlaceholder(l));

  return (
    <div className="min-h-screen pb-32 text-perso-text">
      {/* Hero : le soleil dans le noir */}
      <section
        className={`${container} grid min-h-screen items-center gap-12 pb-24 pt-28 lg:grid-cols-12 lg:pb-0`}
      >
        <Reveal className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-perso-accent">
            L&apos;humain · 太陽
          </p>
          <h1 className="mt-6 font-heading text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[0.95]">
            Dans le noir de l&apos;univers, il y a toujours{' '}
            <span className="italic text-perso-accent">un soleil.</span>
          </h1>
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
            src="/static/images/perso/soleil-sdo.jpg"
            alt="Le Soleil photographié en ultraviolet par le satellite SDO de la NASA"
            fill
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            className="animate-[spin_240s_linear_infinite] object-cover mix-blend-screen [mask-image:radial-gradient(circle,black_52%,transparent_71%)]"
          />
          <figcaption className="absolute -bottom-2 right-0 font-mono text-[10px] uppercase tracking-[0.2em] text-perso-text/30">
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

        <div className="grid gap-5 md:grid-cols-6 lg:grid-cols-12">
          <Tile label="En direct" className="md:col-span-3 lg:col-span-5 lg:row-span-2">
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-perso-accent to-perso-accent2 font-heading text-xl font-extrabold text-perso-bg">
                  FB
                </span>
                <div>
                  <p className="font-heading text-xl font-bold">{profile.name}</p>
                  <p className="font-mono text-sm text-perso-text/50">@Fanel-B</p>
                </div>
              </div>
              <LiveClock />
              <div className="space-y-2 font-mono text-sm">
                <p className="flex items-center gap-2 text-[#9EE6CF]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#9EE6CF]" />
                  {profile.availability}
                </p>
                <p className="text-perso-text/40">
                  SELECT motivation FROM fanel; <span className="text-perso-accent">-- ∞</span>
                </p>
              </div>
            </div>
          </Tile>

          <Tile label="Vu d'ici" className="md:col-span-3 lg:col-span-4 lg:row-span-2" delay={0.08}>
            <NasaPhoto />
          </Tile>

          <Tile label="Face B" className="md:col-span-6 lg:col-span-3 lg:row-span-2" delay={0.16}>
            <Vinyl tracks={music} />
          </Tile>

          <Tile label="Pellicule" className="md:col-span-6 lg:col-span-7 lg:row-span-2">
            <div className="grid grid-cols-3 gap-4 pt-2">
              {personality.photos.map((photo, i) => (
                <motion.figure
                  key={i}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                  style={{ rotate: [-4, 3, -2][i % 3] }}
                  className="relative bg-[#F3E9DC] p-2 pb-8 shadow-[0_16px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-perso-surface to-[#2A1A2E] font-mono text-[10px] uppercase tracking-[0.2em] text-perso-text/40">
                    Photo {String(i + 1).padStart(2, '0')}
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-2 text-center font-mono text-[10px] text-perso-bg/60">
                    {isPlaceholder(photo.caption) ? 'à développer…' : photo.caption}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </Tile>

          <Tile
            label="En ce moment j'apprends"
            className="md:col-span-3 lg:col-span-5"
            delay={0.08}
          >
            {learning.length ? (
              <ul className="flex flex-wrap gap-2">
                {learning.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-perso-accent/30 px-4 py-1.5 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Carnet d&apos;apprentissage à venir.</Soon>
            )}
          </Tile>

          <Tile label="Entre guillemets" className="md:col-span-3 lg:col-span-5" delay={0.16}>
            {quote ? (
              <blockquote>
                <p className="font-heading text-xl italic leading-snug">
                  &ldquo;{quote.text}&rdquo;
                </p>
                {quote.author && (
                  <p className="mt-3 font-mono text-sm text-perso-accent">— {quote.author}</p>
                )}
              </blockquote>
            ) : (
              <Soon>Une citation arrive bientôt.</Soon>
            )}
          </Tile>

          <Tile label="Hors de l'écran" className="md:col-span-2 lg:col-span-4">
            {hobbies.length ? (
              <ul className="space-y-3">
                {hobbies.map((hobby) => (
                  <li key={hobby.title}>
                    <p className="font-heading font-bold">{hobby.title}</p>
                    <p className="text-sm text-perso-text/60">{hobby.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Passions en cours de développement…</Soon>
            )}
          </Tile>

          <Tile label="Carnet de route" className="md:col-span-2 lg:col-span-4" delay={0.08}>
            {travels.length ? (
              <ul className="space-y-3">
                {travels.map((travel) => (
                  <li key={travel.place}>
                    <p className="font-heading font-bold">{travel.place}</p>
                    <p className="text-sm text-perso-text/60">{travel.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Soon>Carte en préparation.</Soon>
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
                  className="border-perso-accent/15 flex aspect-square items-center justify-center rounded-2xl border text-perso-text/70 transition-colors hover:border-perso-accent hover:text-perso-accent"
                >
                  <Icon size={24} />
                </a>
              ))}
              <CopyEmail className="border-perso-accent/15 flex aspect-square items-center justify-center rounded-2xl border text-perso-text/70 transition-colors hover:border-perso-accent hover:text-perso-accent" />
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
