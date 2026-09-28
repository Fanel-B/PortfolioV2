export type ProjectType = 'perso' | 'academique' | 'pro';
export type ProjectCategory = 'Web' | 'Data' | 'IA';

export interface Project {
  title: string;
  description: string;
  type: ProjectType;
  categories: ProjectCategory[];
  /** Technologies principales, affichées sur la carte du projet. */
  stack: string[];
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

export interface ExperienceItem {
  period: string;
  role: string;
  place: string;
  description: string;
}

export interface ToolCategory {
  categorie: string;
  items: string[];
}

export interface PhotoItem {
  /** Vignette carrée affichée sur l'orbite. */
  thumb: string;
  /** Photo entière, affichée au clic. */
  src: string;
  alt: string;
  /** Légende courte ; vide tant qu'elle n'est pas écrite. */
  caption: string;
}

export interface HobbyItem {
  title: string;
  /** Ce que l'activité t'apporte ; facultatif. */
  description?: string;
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
  cvUrl: '/cv/fanel-balemo-cv.pdf' as string | undefined,
  portrait: '/static/images/fanel-portrait.jpg',
  availability: 'Disponible pour une alternance ou un stage',
  location: 'Toulouse, France',
  mobility: 'Toulouse · mobile à Paris / Île-de-France',
  formation: 'L3 MIAGE · Université de Toulouse',
  languages: 'Français (langue maternelle) · Anglais (professionnel)',
  search:
    'Alternance dès que possible, ou stage de 4 à 6 mois (au plus tard à partir de mars 2027)',
  contact: {
    github: 'https://github.com/Fanel-B',
    linkedin: 'https://www.linkedin.com/in/fanel-balemo-4479372aa',
    email: 'fanel.balemo@gmail.com',
  },
  bio: [
    "Bienvenue — vous êtes sur mon coin d'internet.",
    "Je suis Fanel Balemo, étudiant en L3 MIAGE à l'Université de Toulouse, une formation qui allie compréhension des besoins métier et développement de solutions techniques. J'aime autant comprendre les données que construire les outils qui les exploitent : plusieurs de mes projets (API, bases de données, tableaux de bord) sont déployés en ligne.",
    'En ce moment : je recherche une alternance dès que possible — ou, à défaut, un stage de 4 à 6 mois — comme Développeur Full Stack ou Data Analyst, à Toulouse ou en Île-de-France.',
  ],
  timeline: [
    {
      period: '2026 — 2027',
      title: 'L3 MIAGE · Université de Toulouse',
      description:
        'Cahiers des charges et adéquation solution / besoin métier, bases de données, architecture logicielle, gestion de projet.',
    },
    {
      period: '2023 — 2026',
      title: 'L1 — L2 MIASHS · Réseau MIAGE',
      description:
        "Université de Toulouse. Développement d'applications (POO : Python, JavaScript, C), bases de données, data science, méthodes Agile.",
    },
  ] as TimelineItem[],
  experiences: [
    {
      period: 'Étés 2025 & 2026',
      role: 'Employé polyvalent réception',
      place: 'Résidence Montempô · Paris',
      description:
        '15 à 20 arrivées et départs par jour, facturation et caisse, 25 à 30 appels et e-mails clients par jour, en autonomie complète sur le desk.',
    },
    {
      period: '2023 — 2025',
      role: 'Agent logistique',
      place: 'Chronopost · Iziship · Geodis · Toulouse',
      description:
        'Traitement de flux importants et adaptation rapide à des environnements et des équipes variés, en parallèle des études.',
    },
  ] as ExperienceItem[],
  outils: [
    {
      categorie: 'Langages',
      items: ['Python', 'JavaScript', 'Java', 'Kotlin', 'C', 'PHP', 'HTML', 'CSS'],
    },
    {
      categorie: 'Frameworks & Librairies',
      items: ['React', 'Next.js', 'Node.js / Express', 'Bootstrap', 'Pandas', 'Matplotlib'],
    },
    {
      categorie: 'Bases de données',
      items: ['SQL', 'PostgreSQL', 'MySQL'],
    },
    {
      categorie: 'Data & Visualisation',
      items: ['Power BI', 'Excel'],
    },
    {
      categorie: 'Outils & Méthodes',
      items: [
        'Git / GitHub',
        'VS Code',
        'Figma',
        'Android Studio',
        'JIRA',
        'Google Suite',
        'Tailwind CSS',
        'Agile / Scrum',
      ],
    },
  ] as ToolCategory[],
  projects: [
    {
      title: 'Biblio-Tech — Smart Library Platform',
      description:
        "Plateforme de bibliothèque complète, développée à partir d'un cahier des charges fonctionnel : catalogue, emprunts, réservations de salles, recommandations et tableaux de bord analytiques en SQL natif. API REST Express et base PostgreSQL en architecture en couches, authentification JWT / bcrypt avec gestion des rôles, et une couche IoT simulée (capteurs, alertes, automatisations SI → ALORS) pilotable en temps réel.",
      type: 'academique',
      categories: ['Web'],
      stack: ['Next.js', 'Node.js / Express', 'PostgreSQL', 'JWT', 'Vercel / Render'],
      githubUrl: 'https://github.com/Fanel-B/bibliotheque1',
      demoUrl: 'https://bibliotheque1.vercel.app',
      image: '/static/images/projects/biblio-tech.jpg',
    },
    {
      title: 'JobBot Alternance',
      description:
        "Assistant de recherche d'alternance propulsé par l'API Claude (Anthropic) : génère des offres réalistes, note chaque offre sur 100 selon l'adéquation avec mon profil, adapte un CV en un clic, et centralise le suivi des candidatures avec export CSV. Intégration complète frontend → API → traitement du JSON.",
      type: 'perso',
      categories: ['Web', 'IA'],
      stack: ['React', 'JavaScript', 'API Anthropic', 'Vite'],
      githubUrl: 'https://github.com/Fanel-B/jobbot',
      demoUrl: 'https://jobbot-orcin.vercel.app',
      image: '/static/images/projects/jobbot.jpg',
    },
    {
      title: 'Insertion professionnelle des diplômés MIAGE',
      description:
        "Analyse de l'insertion professionnelle des diplômés MIAGE en France à partir des données officielles du ministère (~1 million de lignes, data.esr.gouv.fr) : nettoyage, structuration, puis statistiques et visualisations comparatives. Résultat : la ville de formation influence surtout le salaire, et la filière performe mieux que la moyenne des diplômes en informatique.",
      type: 'perso',
      categories: ['Data'],
      stack: ['Python', 'Pandas', 'SQL', 'Matplotlib'],
      githubUrl: 'https://github.com/Fanel-B/miage-insertion-pro',
      demoUrl: undefined,
      image: '/static/images/projects/miage-insertion-pro.png',
      imageFit: 'contain',
    },
  ] as Project[],
  // Côté humain : les valeurs « …_ICI » s'affichent comme « à venir »
  personality: {
    avatar: '/static/images/perso/orbite-01.jpg',
    // Photos en orbite autour du soleil. Légendes (caption) à écrire.
    photos: [
      {
        thumb: '/static/images/perso/orbite-01.jpg',
        src: '/static/images/perso/photo-01.jpg',
        alt: 'Fanel de nuit à Paris, sur un pont au-dessus de la Seine',
        caption: '',
      },
      {
        thumb: '/static/images/perso/orbite-02.jpg',
        src: '/static/images/perso/photo-02.jpg',
        alt: 'Fanel sur une promenade en bord de mer, en Espagne',
        caption: '',
      },
      {
        thumb: '/static/images/perso/orbite-03.jpg',
        src: '/static/images/perso/photo-03.jpg',
        alt: 'Un repas entre amis',
        caption: '',
      },
      {
        thumb: '/static/images/perso/orbite-04.jpg',
        src: '/static/images/perso/photo-04.jpg',
        alt: 'Fanel et un ami en costume, à Bangui',
        caption: '',
      },
      {
        thumb: '/static/images/perso/orbite-05.jpg',
        src: '/static/images/perso/photo-05.jpg',
        alt: 'Entre amis au bord de la mer, en Espagne',
        caption: '',
      },
      {
        thumb: '/static/images/perso/orbite-06.jpg',
        src: '/static/images/perso/photo-06.jpg',
        alt: 'Bangui, chez moi : le fleuve et les collines',
        caption: '',
      },
      {
        thumb: '/static/images/perso/orbite-07.jpg',
        src: '/static/images/perso/photo-07.jpg',
        alt: 'Un mur de post-it en Espagne : « Look mom, I can fly and discover the world »',
        caption: '',
      },
    ] as PhotoItem[],
    // Ce que chaque activité t'apporte : description à ajouter plus tard
    hobbies: [
      { title: 'Lecture' },
      { title: 'Voyages' },
      { title: 'Football' },
      { title: 'Gaming' },
    ] as HobbyItem[],
    // CITATIONS_ICI
    quotes: [{ text: 'CITATIONS_ICI', author: undefined }] as QuoteItem[],
    music: [
      { title: 'Dieu ne ment jamais', artist: 'Damso' },
      { title: 'Through the Wire', artist: 'Kanye West' },
      { title: 'Devil in a New Dress', artist: 'Kanye West' },
      { title: 'Praise God', artist: 'Kanye West' },
      { title: 'Free Mind', artist: 'Tems' },
    ] as MusicItem[],
    // VOYAGES_ICI
    travels: [
      { place: 'VOYAGES_ICI', description: 'Raconte ce voyage en quelques mots.' },
    ] as TravelItem[],
    // APPRENDS_ICI — ce que tu apprends en ce moment (une techno, une langue, un instrument…)
    learning: ['APPRENDS_ICI'] as string[],
  },
};

export type Profile = typeof profile;
