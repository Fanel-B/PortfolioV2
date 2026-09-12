import { profile } from '@/data/profile';
import ProjectCard from './ProjectCard';

export default function Travail() {
  return (
    <section id="travail" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-gray-900 dark:text-pro-text">
          Ce que j&apos;ai construit
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {profile.projects.map((project, i) => (
            <ProjectCard key={project.title + i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
