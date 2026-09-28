'use client';

import { MusicItem } from '@/data/profile';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const TIME_ZONE = 'Europe/Paris';

// Heure de Toulouse, en direct. Rien n'est rendu côté serveur pour éviter un décalage à l'hydratation.
export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now?.toLocaleTimeString('fr-FR', { timeZone: TIME_ZONE }) ?? '--:--:--';
  const date =
    now?.toLocaleDateString('fr-FR', {
      timeZone: TIME_ZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }) ?? '';

  return (
    <div>
      <p className="font-mono text-4xl tabular-nums text-perso-text md:text-5xl">{time}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-perso-text/40">
        Toulouse · {date}
      </p>
    </div>
  );
}

interface Apod {
  title: string;
  url: string;
  date: string;
  media_type: string;
}

const APOD_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const APOD_CACHE = 'apod-cache';

// Photo astronomique du jour (NASA APOD). Mise en cache pour la session ;
// si l'API ne répond pas ou si c'est une vidéo, on montre le Soleil photographié par SDO.
export function NasaPhoto() {
  const [apod, setApod] = useState<Apod | null>(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const cached = sessionStorage.getItem(APOD_CACHE);
      if (cached) {
        setApod(JSON.parse(cached));
        return;
      }
    } catch {
      // Stockage indisponible : on interroge l'API.
    }
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${APOD_KEY}&thumbs=true`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Apod & { thumbnail_url?: string }) => {
        if (cancelled) return;
        const image = data.media_type === 'image' ? data.url : data.thumbnail_url;
        if (!image) return;
        const value = { ...data, url: image };
        // On attend que l'image soit chargée pour changer photo et légende en même temps.
        const preload = new window.Image();
        preload.onload = () => {
          if (cancelled) return;
          setApod(value);
          try {
            sessionStorage.setItem(APOD_CACHE, JSON.stringify(value));
          } catch {
            // Pas de cache : tant pis.
          }
        };
        preload.src = image;
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const src = apod?.url ?? '/static/images/perso/soleil-sdo.jpg';

  return (
    <figure className="relative h-full min-h-[280px] overflow-hidden rounded-2xl bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={apod?.title ?? 'Le Soleil photographié par le satellite SDO de la NASA'}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-5 pt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-perso-accent">
          {apod ? `NASA · photo du jour · ${apod.date}` : 'NASA · SDO · le Soleil'}
        </p>
        <p className="line-clamp-2 mt-1 font-heading text-lg font-bold text-perso-text">
          {apod?.title ?? 'Notre étoile, en ultraviolet'}
        </p>
      </figcaption>
    </figure>
  );
}

// Platine vinyle : le disque tourne, un clic passe au morceau suivant.
export function Vinyl({ tracks }: { tracks: MusicItem[] }) {
  const [index, setIndex] = useState(0);
  const track = tracks.length ? tracks[index % tracks.length] : null;

  return (
    <button
      type="button"
      onClick={() => setIndex((i) => i + 1)}
      disabled={tracks.length < 2}
      className="group flex h-full w-full flex-col items-center justify-between gap-6 text-center"
      aria-label={track ? `Morceau suivant (actuel : ${track.title})` : 'Playlist à venir'}
    >
      <div className="relative aspect-square w-40 animate-[spin_6s_linear_infinite] rounded-full bg-[repeating-radial-gradient(circle,#161018_0_2px,#231a26_2px_4px)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] group-hover:[animation-duration:2s]">
        <div className="absolute inset-[34%] rounded-full bg-gradient-to-br from-perso-accent to-perso-accent2" />
        <div className="absolute inset-[48%] rounded-full bg-perso-bg" />
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgba(255,255,255,0.08)_40deg,transparent_80deg)]" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={track?.title ?? 'vide'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <p className="font-heading text-lg font-bold text-perso-text">
            {track?.title ?? 'Face B'}
          </p>
          <p className="text-sm text-perso-text/50">{track?.artist ?? 'Playlist en préparation'}</p>
          {tracks.length > 1 && (
            <p className="mt-2 font-mono text-[11px] text-perso-accent/70">
              {String((index % tracks.length) + 1).padStart(2, '0')} /{' '}
              {String(tracks.length).padStart(2, '0')} · cliquer pour la suite
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
