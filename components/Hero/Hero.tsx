'use client';

import CopyEmail from '@/components/CopyEmail';
import { profile } from '@/data/profile';
import { useRotatingTypewriter } from '@/lib/hooks/useRotatingTypewriter';
import { container } from '@/lib/ui';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from '@/lib/icons';
import { HiArrowRight } from '@/lib/icons';
import Constellation from './Constellation';

interface Props {
  onOpenCv: () => void;
}

const socialClass = 'text-pro-text/60 transition-colors hover:text-pro-accent';

export default function Hero({ onOpenCv }: Props) {
  const role = useRotatingTypewriter(profile.roles);
  const liveProjects = profile.projects.filter((p) => p.demoUrl).length;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="accueil" className="relative flex min-h-screen flex-col pt-24 md:pt-32">
      <div className={`${container} grid flex-1 grid-cols-1 items-center gap-16 lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <motion.p
            {...rise(0)}
            className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-pro-text/60"
          >
            <span>
              {'// Portfolio — '}
              {profile.location}
            </span>
            <span className="flex items-center gap-2 text-pro-menthe">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pro-menthe opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pro-menthe" />
              </span>
              {profile.availability}
            </span>
          </motion.p>

          <h1 className="font-heading text-[clamp(2.25rem,6.4vw,6.25rem)] font-extrabold uppercase leading-[0.85] tracking-tight">
            <motion.span {...rise(0.1)} className="block text-pro-text">
              Fanel
            </motion.span>
            <motion.span
              {...rise(0.2)}
              data-text="Balemo"
              className="glitch-name block text-transparent [-webkit-text-stroke:2px_#8ECDF8] [filter:drop-shadow(0_0_18px_rgba(142,205,248,0.45))]"
            >
              Balemo
            </motion.span>
          </h1>

          <motion.p {...rise(0.3)} className="mt-8 min-h-[1.5em] font-mono text-lg sm:text-xl">
            <span className="text-pro-accent">&gt; </span>
            <span className="text-pro-text">{role}</span>
            <span className="ml-0.5 inline-block h-5 w-2.5 translate-y-0.5 animate-pulse bg-pro-accent" />
          </motion.p>

          <motion.p {...rise(0.4)} className="mt-6 max-w-xl text-lg text-pro-text/60">
            {profile.tagline}
          </motion.p>

          <motion.div {...rise(0.5)} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#lancements"
              className="group inline-flex items-center gap-3 rounded-full bg-pro-accent px-7 py-3.5 font-medium text-pro-bg shadow-glow transition-shadow hover:shadow-glow-lg"
            >
              Voir mes projets
              <HiArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={onOpenCv}
              className="rounded-full border border-white/15 px-7 py-3.5 font-medium text-pro-text transition-colors hover:border-pro-accent hover:text-pro-accent"
            >
              Ouvrir mon CV
            </button>
            <div className="flex items-center gap-5 px-3">
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={socialClass}
              >
                <FaGithub size={20} />
              </a>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={socialClass}
              >
                <FaLinkedin size={20} />
              </a>
              <CopyEmail className={socialClass} />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
        >
          <Constellation />
        </motion.div>
      </div>

      {/* Bandeau d'infos sur toute la largeur */}
      <motion.div {...rise(0.7)} className="mt-16 border-t border-white/10">
        <dl
          className={`${container} grid grid-cols-2 gap-6 py-6 font-mono text-xs uppercase tracking-[0.15em] md:grid-cols-4`}
        >
          {[
            ['Formation', 'L3 MIAGE'],
            ['Double profil', 'Dev ⟷ Data'],
            ['En ligne', `${liveProjects} projets déployés`],
            ['Base', profile.location],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-pro-text/60">{label}</dt>
              <dd className="mt-1 text-pro-text">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
