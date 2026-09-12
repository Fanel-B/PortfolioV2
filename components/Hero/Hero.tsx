'use client';

import MouseTrail from '@/components/MouseTrail';
import { profile } from '@/data/profile';
import { useTypewriter } from '@/lib/hooks/useTypewriter';
import { FaGithub, FaLinkedin, FaRegEnvelope } from 'react-icons/fa';

export default function Hero() {
  const typedTagline = useTypewriter(profile.tagline, 45);

  return (
    <section
      id="moi"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-white px-4 text-center dark:bg-pro-bg"
    >
      <MouseTrail />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 font-accent text-sm text-green-600 dark:text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {profile.availability}
        </span>

        <h1
          data-text={profile.name}
          className="glitch-name font-display text-5xl tracking-tight text-gray-900 dark:text-pro-text sm:text-7xl md:text-8xl"
        >
          {profile.name}
        </h1>

        <p className="min-h-[1.75em] max-w-xl text-lg text-gray-600 dark:text-pro-text/80 sm:text-xl">
          {typedTagline}
          <span className="animate-pulse">|</span>
        </p>

        <div className="mt-4 flex items-center gap-5 rounded-full border border-gray-200 bg-white/80 px-6 py-3 shadow-sm dark:border-pro-surface2 dark:bg-pro-surface/80">
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-gray-600 transition-colors hover:text-pro-accent dark:text-pro-text/80"
          >
            <FaGithub size={20} />
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-gray-600 transition-colors hover:text-pro-accent dark:text-pro-text/80"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href={`mailto:${profile.contact.email}`}
            aria-label="Email"
            className="text-gray-600 transition-colors hover:text-pro-accent dark:text-pro-text/80"
          >
            <FaRegEnvelope size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
