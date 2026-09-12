'use client';

import PlaceholderImage from '@/components/PlaceholderImage';
import { profile } from '@/data/profile';
import { motion } from 'framer-motion';

interface Props {
  onClose: () => void;
}

export default function Personnalite({ onClose }: Props) {
  const { personality } = profile;

  return (
    <div className="min-h-screen bg-perso-bg px-4 py-16 text-perso-text sm:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onClose}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-perso-accent px-5 py-2 font-accent text-sm text-perso-accent transition-colors hover:bg-perso-accent hover:text-white"
        >
          ← Retour
        </button>

        <h1 className="mb-12 font-display text-5xl text-perso-accent sm:text-6xl">
          {personality.title}
        </h1>

        <section className="mb-16">
          <h2 className="mb-6 font-accent text-2xl">Quelques photos</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {personality.photos.map((photo, i) => (
              <motion.div
                key={photo.caption + i}
                initial={{ opacity: 0, rotate: i % 2 === 0 ? -4 : 4, y: 20 }}
                whileInView={{ opacity: 1, rotate: i % 2 === 0 ? -3 : 3, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <PlaceholderImage
                  variant="perso"
                  label={photo.caption}
                  className="aspect-square w-full"
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-4 font-accent text-2xl">Centres d&apos;intérêt</h2>
            <ul className="space-y-3">
              {personality.hobbies.map((hobby) => (
                <li key={hobby.title}>
                  <p className="font-semibold">{hobby.title}</p>
                  <p className="text-sm opacity-80">{hobby.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-accent text-2xl">Citations préférées</h2>
            <ul className="space-y-4">
              {personality.quotes.map((quote) => (
                <li
                  key={quote.text}
                  className="border-l-2 border-perso-accent3 pl-4 italic opacity-90"
                >
                  &ldquo;{quote.text}&rdquo;
                  {quote.author && (
                    <span className="mt-1 block text-sm not-italic">— {quote.author}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 font-accent text-2xl">Musiques du moment</h2>
          <ul className="flex flex-wrap gap-3">
            {personality.music.map((track) => (
              <li key={track.title} className="rounded-full bg-perso-accent2/30 px-4 py-2 text-sm">
                {track.title} {track.artist && <span className="opacity-70">— {track.artist}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-accent text-2xl">Voyages</h2>
          <ul className="space-y-3">
            {personality.travels.map((travel) => (
              <li key={travel.place}>
                <p className="font-semibold">{travel.place}</p>
                <p className="text-sm opacity-80">{travel.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
