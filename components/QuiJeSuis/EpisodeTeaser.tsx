'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiOutlinePlay } from 'react-icons/hi';

interface Props {
  onOpen: () => void;
}

// Carte « prochain épisode » façon anime : lignes de vitesse autour du soleil,
// trame manga et onomatopée au survol. Un clic retourne la page vers le côté humain.
export default function EpisodeTeaser({ onOpen }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 40, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Épisode 02 : découvrir l'humain derrière le code"
      className="group relative block w-full overflow-hidden border-[3px] border-perso-text bg-perso-bg text-left shadow-[10px_10px_0_#F2B880] transition-[transform,box-shadow] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0_#F2B880] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0_#F2B880]"
    >
      {/* Lignes de vitesse qui rayonnent depuis le soleil */}
      <div
        aria-hidden
        className="absolute left-[80%] top-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite] bg-[repeating-conic-gradient(from_0deg,rgba(242,184,128,0.28)_0deg_1.2deg,transparent_1.2deg_6deg)] [mask-image:radial-gradient(circle,transparent_7%,black_22%)] group-hover:[animation-duration:8s]"
      />
      {/* Trame manga */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(rgba(243,233,220,0.18)_1px,transparent_1.6px)] [background-size:9px_9px] [mask-image:linear-gradient(90deg,black,transparent_55%)]"
      />

      <div className="relative grid items-center gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-perso-accent">
            次回予告 · Prochain épisode
          </p>
          <h3 className="mt-5 font-heading text-4xl font-extrabold italic leading-[0.95] text-perso-text md:text-6xl">
            Épisode 02 :<br />
            <span className="text-perso-accent">l&apos;humain</span> derrière le code.
          </h3>
          <p className="mt-5 max-w-md text-perso-text/70">
            Ce qu&apos;on ne voit pas sur un CV. Il se cache quelque part près du soleil.
          </p>
          <span className="relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full bg-perso-accent px-7 py-3.5 font-heading font-bold uppercase tracking-wide text-perso-bg">
            <HiOutlinePlay size={20} />
            Regarder l&apos;épisode
            {/* Reflet qui balaie le bouton au survol */}
            <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/50 transition-transform duration-700 group-hover:translate-x-[500%]" />
          </span>
        </div>

        <div className="relative mx-auto h-44 w-44 md:mr-12 md:h-56 md:w-56">
          <div className="absolute inset-0 rounded-full bg-perso-accent/40 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <Image
            src="/static/images/perso/soleil-sdo.jpg"
            alt=""
            fill
            sizes="224px"
            className="animate-[spin_120s_linear_infinite] rounded-full object-cover mix-blend-screen [mask-image:radial-gradient(circle,black_55%,transparent_70%)]"
          />
          <span
            aria-hidden
            className="absolute -left-14 top-1/2 flex -translate-y-1/2 flex-col font-heading text-5xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_#F3E9DC] md:-left-20 md:text-6xl"
          >
            <span>人</span>
            <span>間</span>
          </span>
        </div>
      </div>

      {/* Onomatopée qui surgit au survol */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-4 rotate-12 scale-0 font-heading text-5xl font-extrabold text-perso-accent opacity-0 transition-all duration-300 [text-shadow:3px_3px_0_#0F0B12] group-hover:scale-100 group-hover:opacity-100 md:right-10 md:top-6 md:text-7xl"
      >
        ドン!
      </span>
    </motion.button>
  );
}
