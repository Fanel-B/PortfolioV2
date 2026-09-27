export type ProjectType = 'perso' | 'academique' | 'pro';
export type ProjectCategory = 'Web' | 'Data' | 'IA';

export interface Project {
  title: string;
  description: string;
  type: ProjectType;
  categories: ProjectCategory[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  /** 'cover' pour une capture d'écran (défaut), 'contain' pour un graphique à montrer en entier. */
  imageFit?: 'cover' | 'contain';
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

export interface ToolCategory {
  categorie: string;
  items: string[];
}

export interface PhotoItem {
  caption: string;
}

export interface HobbyItem {
  title: string;
  description: string;
}

export interface QuoteItem {
  text: string;
  author?: string;
}

export interface MusicItem {
  title: string;
  artist?: string;
}

export interface TravelItem {
  place: string;
  description: string;
}

export const profile = {
  name: 'Fanel Balemo',
  tagline: 'A student who codes, analyzes, and refuses to stay in one box.',
  roles: ['Développeur Full Stack', 'Data Analyst', 'Étudiant en MIAGE'],
  // CV_ICI — dépose le PDF dans public/cv/ puis renseigne son chemin, ex. '/cv/fanel-balemo-cv.pdf'
  cvUrl: undefined as string | undefined,
  availability: 'Disponible pour une alternance ou un stage',
  location: 'Toulouse, France',
  formation: 'L3 MIAGE · Université de Toulouse',
  contact: {
    github: 'https://github.com/Fanel-B',
    linkedin: 'https://www.linkedin.com/in/fanel-balemo-4479372aa',
    email: 'fanel.balemo@gmail.com',
  },
  bio: [
    "Bienvenue — vous êtes sur mon coin d'internet.",
    "Je suis Fanel Balemo, étudiant en L3 MIAGE à l'Université de Toulouse. J'aime autant comprendre les données que construire les outils qui les exploitent. Chaque projet est pour moi une occasion d'apprendre quelque chose de nouveau.",
    'En ce moment : je prépare mon entrée dans le monde pro en visant des rôles de Développeur Full Stack ou Data Analyst.',
  ],
  timeline: [
    {
      period: "2026 — aujourd'hui",
      title: 'L3 MIAGE · Université de Toulouse',
      description:
        'Méthodes informatiques appliquées à la gestion des entreprises : développement, bases de données, gestion de projet.',
    },
    {
      period: '2023 — 2026',
      title: 'L1 — L2',
      description: 'Deux premières années de licence validées.',
    },
  ] as TimelineItem[],
  outils: [
    {
      categorie: 'Langages',
      items: ['Python', 'JavaScript', 'Java', 'Kotlin', 'PHP', 'HTML', 'CSS', 'SQL'],
    },
    {
      categorie: 'Frameworks & Librairies',
      items: ['React', 'Next.js', 'Bootstrap', 'Pandas', 'Matplotlib'],
    },
    {
      categorie: 'Data & Visualisation',
      items: ['Power BI', 'Excel'],
    },
    {
      categorie: 'Outils',
      items: [
        'Git / GitHub',
        'VS Code',
        'Figma',
        'Android Studio',
        'JIRA',
        'Google Suite',
        'Tailwind CSS',
      ],
    },
    {
      categorie: 'Méthodes',
      items: ['Agile / Scrum'],
    },
  ] as ToolCategory[],
  projects: [
    {
      title: 'Biblio-Tech — Smart Library Platform',
      description:
        "Reconstruction complète d'un projet universitaire de bibliothèque en plateforme full-stack (Next.js, Express, PostgreSQL) : catalogue, prêts, réservations de salles, et une couche domotique simulée (capteurs, automatisations IF→THEN, sécurité des accès) pilotable en temps réel, sans aucun matériel. Recommandations et analytics calculés en SQL pur, sans ML.",
      type: 'perso',
      categories: ['Web'],
      githubUrl: 'https://github.com/Fanel-B/bibliotheque1',
      demoUrl: 'https://bibliotheque1.vercel.app',
      image: '/static/images/projects/biblio-tech.jpg',
    },
    {
      title: 'JobBot Alternance',
      description:
        "Assistant de recherche d'alternance propulsé par l'API Claude (Anthropic) : génère des offres réalistes, note chaque offre sur 100 selon l'adéquation avec mon profil, adapte un CV en un clic, et centralise le suivi des candidatures avec export CSV. React + Vite.",
      type: 'perso',
      categories: ['Web', 'IA'],
      githubUrl: 'https://github.com/Fanel-B/jobbot',
      demoUrl: 'https://jobbot-orcin.vercel.app',
      image: '/static/images/projects/jobbot.jpg',
    },
    {
      title: 'Insertion professionnelle des diplômés MIAGE',
      description:
        "Analyse de l'insertion professionnelle des diplômés MIAGE en France à partir des données officielles du ministère (~1 million de lignes, data.esr.gouv.fr) : la ville de formation influence surtout le salaire, la filière elle-même performe mieux que la moyenne des diplômes en informatique. Python (pandas, matplotlib).",
      type: 'perso',
      categories: ['Data'],
      githubUrl: 'https://github.com/Fanel-B/miage-insertion-pro',
      demoUrl: undefined,
      image: '/static/images/projects/miage-insertion-pro.png',
      imageFit: 'contain',
    },
  ] as Project[],
  // Côté humain : les valeurs « …_ICI » s'affichent comme « à venir » (voir A_FOURNIR.md)
  personality: {
    // PHOTOS_ICI — remplace ces légendes par tes vraies photos (toi, amis, paysages)
    photos: [
      { caption: 'PHOTOS_ICI' },
      { caption: 'PHOTOS_ICI' },
      { caption: 'PHOTOS_ICI' },
    ] as PhotoItem[],
    // HOBBIES_ICI
    hobbies: [
      {
        title: 'HOBBIES_ICI',
        description: "Ajoute ici un centre d'intérêt et ce qu'il représente pour toi.",
      },
    ] as HobbyItem[],
    // CITATIONS_ICI
    quotes: [{ text: 'CITATIONS_ICI', author: undefined }] as QuoteItem[],
    // MUSIQUES_ICI
    music: [{ title: 'MUSIQUES_ICI', artist: undefined }] as MusicItem[],
    // VOYAGES_ICI
    travels: [
      { place: 'VOYAGES_ICI', description: 'Raconte ce voyage en quelques mots.' },
    ] as TravelItem[],
    // APPRENDS_ICI — ce que tu apprends en ce moment (une techno, une langue, un instrument…)
    learning: ['APPRENDS_ICI'] as string[],
  },
};

export type Profile = typeof profile;
