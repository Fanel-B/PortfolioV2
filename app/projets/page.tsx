import ProjetBackdrop from '@/components/Projet/ProjetBackdrop';
import ListeProjets from '@/components/Projets/ListeProjets';
import { container } from '@/lib/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes projets',
  description:
    'Les projets de Fanel Balemo en data et en développement : le problème, ce qui a été fait et la suite.',
  alternates: { canonical: '/projets' },
};

// Page /projets : les projets vedettes en lignes qui s'ouvrent sur place.
export default function ProjetsPage() {
  return (
    <>
      <ProjetBackdrop />
      <main className={`${container} pb-28 pt-12 md:pt-20`}>
        <ListeProjets />
      </main>
    </>
  );
}
