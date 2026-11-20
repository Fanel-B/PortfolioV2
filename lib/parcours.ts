import type { Parcours, Project } from '@/data/profile';

// Choix du sélecteur de la section Lancements. « tout » met en avant les vedettes des deux parcours.
export type ParcoursChoice = 'tout' | Parcours;

export const PARCOURS_CHOICES: { value: ParcoursChoice; label: string }[] = [
  { value: 'tout', label: 'Tout' },
  { value: 'data', label: 'Data' },
  { value: 'dev', label: 'Dev' },
];

// Lit la valeur de ?parcours= : absente ou inconnue, on revient à « tout ».
export function parseParcours(value: string | null | undefined): ParcoursChoice {
  return value === 'data' || value === 'dev' ? value : 'tout';
}

// Vedette du choix courant : vedette du parcours choisi, ou de n'importe quel parcours avec « tout ».
export function isVedette(project: Project, choice: ParcoursChoice) {
  if (!project.parcours?.length) return false;
  return choice === 'tout' || project.parcours.includes(choice);
}

// Partie « ?parcours=… » d'une adresse, vide pour « tout » pour garder des adresses courtes.
export function parcoursQuery(choice: ParcoursChoice) {
  return choice === 'tout' ? '' : `?parcours=${choice}`;
}
