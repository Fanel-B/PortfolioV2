import { profile } from '@/data/profile';
import { parcoursQuery, parseParcours } from '@/lib/parcours';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { slug: string };
  searchParams: { parcours?: string };
}

// Rendue à chaque visite plutôt qu'à l'avance : c'est ce qui permet une vraie redirection HTTP.
// Générée à l'avance, la page ne contiendrait qu'une redirection côté navigateur.
export const dynamic = 'force-dynamic';

// Les anciennes pages projet sont remplacées par la page /projets : chaque ancienne adresse
// renvoie vers la bonne ligne (/projets/techscope → /projets#techscope), pour que les liens
// déjà partagés marchent encore. Le parcours est gardé. Une adresse inconnue renvoie la 404.
export default function AnciennePageProjet({ params, searchParams }: Props) {
  if (!profile.projects.some((project) => project.slug === params.slug)) notFound();
  const query = parcoursQuery(parseParcours(searchParams.parcours));
  redirect(`/projets${query}#${params.slug}`);
}
