'use client';

import { HiOutlineArrowLeft } from '@/lib/icons';
import { parcoursQuery, parseParcours } from '@/lib/parcours';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const className =
  'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-pro-text/60 transition-colors hover:text-pro-accent';

// Lien de retour vers la section Lancements, sur le parcours d'où vient le visiteur :
// /projets/techscope?parcours=data ramène à /?parcours=data#lancements.
export function RetourLancementsLink({ parcours = null }: { parcours?: string | null }) {
  return (
    <Link href={`/${parcoursQuery(parseParcours(parcours))}#lancements`} className={className}>
      <HiOutlineArrowLeft size={14} /> Retour aux lancements
    </Link>
  );
}

// La page projet est générée à l'avance, sans adresse : le parcours est lu dans le navigateur.
export default function RetourLancements() {
  const searchParams = useSearchParams();
  return <RetourLancementsLink parcours={searchParams.get('parcours')} />;
}
