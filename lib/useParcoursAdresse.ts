'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseParcours, ParcoursChoice } from './parcours';

// Parcours choisi, lu et écrit dans l'adresse (?parcours=data). Même logique que la constellation
// de l'accueil. Le composant qui l'utilise doit être dans un <Suspense> (useSearchParams).
export function useParcoursAdresse() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fromUrl = parseParcours(searchParams.get('parcours'));

  // Copie locale : le clic change l'affichage tout de suite, sans attendre la navigation.
  const [parcours, setParcours] = useState<ParcoursChoice>(fromUrl);
  useEffect(() => setParcours(fromUrl), [fromUrl]);

  const change = (choice: ParcoursChoice) => {
    setParcours(choice);
    const params = new URLSearchParams(searchParams.toString());
    if (choice === 'tout') params.delete('parcours');
    else params.set('parcours', choice);
    const query = params.toString();
    // replace : changer de parcours n'ajoute pas d'étape au bouton Précédent.
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return [parcours, change] as const;
}
