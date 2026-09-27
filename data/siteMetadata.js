const siteMetadata = {
  title: 'Fanel Balemo',
  author: 'Fanel Balemo',
  description:
    "Portfolio de Fanel Balemo, étudiant en L3 MIAGE à Toulouse : développeur full stack et data analyst, en recherche d'alternance.",
  language: 'fr-fr',
  theme: 'dark', // system, dark or light
  // Adresse publique du site (la variable NEXT_PUBLIC_SITE_URL, si définie, a la priorité)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-v2-fanel-65.vercel.app',
  email: 'fanel.balemo@gmail.com',
  github: 'https://github.com/Fanel-B',
  linkedin: 'https://www.linkedin.com/in/fanel-balemo-4479372aa',
  locale: 'fr-FR',
};

module.exports = siteMetadata;
