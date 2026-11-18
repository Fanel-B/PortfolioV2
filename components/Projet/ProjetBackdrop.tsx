'use client';

import TargetCursor from '@/components/TargetCursor';
import dynamic from 'next/dynamic';

// Même ciel que l'accueil, chargé à part comme sur l'accueil pour que la page s'affiche sans l'attendre.
// Fichier client à part : une page serveur ne peut pas charger un composant avec ssr: false.
const SkyBackground = dynamic(() => import('@/components/Sky/SkyBackground'), { ssr: false });

export default function ProjetBackdrop() {
  return (
    <>
      <SkyBackground side="pro" />
      <TargetCursor side="pro" />
    </>
  );
}
