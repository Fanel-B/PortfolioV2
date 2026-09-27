'use client';

import CopyEmail from '@/components/CopyEmail';
import SectionHeader from '@/components/SectionHeader';
import { profile } from '@/data/profile';
import { container } from '@/lib/ui';
import { HiArrowRight } from '@/lib/icons';

const links = [
  { label: 'GitHub', href: profile.contact.github },
  { label: 'LinkedIn', href: profile.contact.linkedin },
];

export default function Footer() {
  return (
    <footer
      id="transmission"
      className="relative border-t border-white/10 pb-28 pt-28 md:pb-10 md:pt-40"
    >
      <div className={container}>
        <SectionHeader
          index="04"
          kicker="Transmission"
          title="Une alternance, un projet, une question ?"
        />

        <CopyEmail className="group mt-12 block w-full text-left">
          <span className="block font-mono text-xs uppercase tracking-[0.25em] text-pro-text/40">
            Cliquer pour copier mon email
          </span>
          <span className="mt-4 flex items-center gap-4 font-heading text-[clamp(1.1rem,3.8vw,3.75rem)] font-extrabold leading-none text-pro-text transition-colors group-hover:text-pro-accent">
            {profile.contact.email}
            <HiArrowRight className="hidden shrink-0 transition-transform group-hover:translate-x-3 md:block" />
          </span>
        </CopyEmail>

        <div className="mt-24 flex flex-col gap-6 border-t border-white/10 pt-8 font-mono text-xs uppercase tracking-[0.2em] text-pro-text/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {profile.name} · Construit sous un ciel étoilé
          </span>
          <ul className="flex gap-8">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-pro-accent"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
