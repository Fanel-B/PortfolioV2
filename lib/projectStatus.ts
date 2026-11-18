import type { Project } from '@/data/profile';

// Statut affiché d'un projet, partagé par la constellation, son panneau et la page projet.
// Un projet en amélioration n'est pas affiché « en ligne », même s'il a une démo,
// pour ne pas laisser croire qu'il est pleinement fonctionnel.
export function statusOf(project: Project) {
  if (project.status === 'amelioration') {
    return { label: 'en amélioration', symbol: '◐', color: 'text-pro-lavande' };
  }
  if (project.demoUrl) {
    return { label: 'en ligne', symbol: '●', color: 'text-pro-menthe' };
  }
  return { label: 'code source', symbol: '○', color: 'text-pro-text/55' };
}
