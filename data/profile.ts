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
  src: string;
  alt: string;
  /** Dimensions réelles, pour afficher la photo entière sans la recadrer. */
  width: number;
  height: number;
}

export interface PhotoGroup {
  /** Petit libellé au-dessus du titre, ex. « Moi ». */
  kicker: string;
  /** Titre de la catégorie, sur le thème de l'espace. */
  title: string;
  photos: PhotoItem[];
}

export interface HobbyItem {
  title: string;
  /** Ce que l'activité t'apporte ; facultatif. */
  description?: string;
}

export interface MusicItem {
  title: string;
  artist: string;
  album: string;
  cover: string;
  spotify?: string;
  youtube?: string;
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
      items: ['Python', 'JavaScript', 'Java', 'Kotlin', 'PHP', 'HTML', 'CSS'],
    },
    {
      categorie: 'Frameworks & Librairies',
      items: ['React', 'Next.js', 'Node.js / Express', 'Pandas', 'Matplotlib'],
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
    {
      title: "Qualité des sources d'offres d'alternance IT",
      description:
        "Analyse de 276 offres collectées par un pipeline de veille que j'exploite sur un VPS (alertes mail LinkedIn, API France Travail, API La Bonne Alternance). Le sujet n'est pas le marché mais la qualité des sources : couverture, complétude, fiabilité. L'analyse s'ouvre sur cinq contrôles de cohérence, dont deux échouent et corrigent la lecture de la suite. 97 % des offres toulousaines dépendent d'une source unique, et 115 des 120 rejets étiquetés « inéligible » sont en fait un type de contrat jamais fourni par la source.",
      type: 'perso',
      categories: ['Data'],
      stack: ['Python', 'Pandas', 'SciPy', 'Jupyter', 'Matplotlib'],
      githubUrl: 'https://github.com/Fanel-B/eda-alternance-france-2026',
      demoUrl: undefined,
      image: '/static/images/projects/eda-sources-alternance.png',
      imageFit: 'contain',
    },
  ] as Project[],
  // Côté humain : les valeurs « …_ICI » s'affichent comme « à venir »
  personality: {
    avatar: '/static/images/perso/avatar.jpg',
    photoGroups: [
      {
        kicker: 'Moi',
        title: "L'astre principal",
        photos: [
          {
            src: '/static/images/perso/moi-01.jpg',
            alt: 'Fanel de nuit à Paris, sur un pont au-dessus de la Seine',
            width: 750,
            height: 1000,
          },
          {
            src: '/static/images/perso/moi-02.jpg',
            alt: 'Fanel sur une promenade en bord de mer, en Espagne',
            width: 750,
            height: 1000,
          },
        ],
      },
      {
        kicker: 'Mes amis',
        title: 'Mes satellites',
        photos: [
          {
            src: '/static/images/perso/amis-01.jpg',
            alt: 'Un repas entre amis',
            width: 1000,
            height: 563,
          },
          {
            src: '/static/images/perso/amis-02.jpg',
            alt: 'Fanel et un ami en costume, à Bangui',
            width: 750,
            height: 1000,
          },
        ],
      },
      {
        kicker: 'Bangui, mon chez moi',
        title: 'La planète mère',
        photos: [
          {
            src: '/static/images/perso/bangui.jpg',
            alt: 'Bangui : le fleuve Oubangui, des pirogues et les collines',
            width: 1000,
            height: 750,
          },
        ],
      },
    ] as PhotoGroup[],
    // Ce que chaque activité t'apporte : description à ajouter plus tard
    hobbies: [
      { title: 'Lecture' },
      { title: 'Voyages' },
      { title: 'Football' },
      { title: 'Gaming' },
    ] as HobbyItem[],
    music: [
      {
        title: 'Δ. Dieu ne ment jamais',
        artist: 'Damso',
        album: 'Ipséité',
        cover: '/static/images/music/damso-ipseite.jpg',
        spotify: 'https://open.spotify.com/track/6YWjskKykdPsBuiTBOg1VK',
        youtube: 'https://www.youtube.com/watch?v=-WXpT4Ej2No',
      },
      {
        title: 'Through the Wire',
        artist: 'Kanye West',
        album: 'The College Dropout',
        cover: '/static/images/music/kanye-college-dropout.jpg',
        spotify: 'https://open.spotify.com/track/4mmkhcEm1Ljy1U9nwtsxUo',
        youtube: 'https://www.youtube.com/watch?v=AE8y25CcE6s',
      },
      {
        title: 'Devil in a New Dress',
        artist: 'Kanye West',
        album: 'My Beautiful Dark Twisted Fantasy',
        cover: '/static/images/music/kanye-mbdtf.jpg',
        spotify: 'https://open.spotify.com/track/1UGD3lW3tDmgZfAVDh6w7r',
        youtube: 'https://www.youtube.com/watch?v=sk3rpYkiHe8',
      },
      {
        title: 'Praise God',
        artist: 'Kanye West',
        album: 'Donda',
        cover: '/static/images/music/kanye-donda.jpg',
        spotify: 'https://open.spotify.com/track/0WSEq9Ko4kFPt8yo3ICd6T',
        youtube: 'https://www.youtube.com/watch?v=9sJZOGxRxwM',
      },
      {
        title: 'Free Mind',
        artist: 'Tems',
        album: 'For Broken Ears',
        cover: '/static/images/music/tems-for-broken-ears.jpg',
        spotify: 'https://open.spotify.com/track/2mzM4Y0Rnx2BDZqRnhQ5Q6',
        // Pas de vidéo officielle : lien vers la recherche YouTube
        youtube: 'https://www.youtube.com/results?search_query=Tems+Free+Mind',
      },
    ] as MusicItem[],
    // Ce que tu apprends en ce moment (une techno, une langue, un instrument…)
    learning: ['Kotlin'] as string[],
  },
};

export type Profile = typeof profile;
