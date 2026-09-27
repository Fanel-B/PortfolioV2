import '@/css/tailwind.css';

import Analytics from '@/components/Analytics';
import LogRocket from '@/components/LogRocket';
import siteMetadata from '@/data/siteMetadata';
import { Metadata } from 'next';
import { Akronim, DM_Sans, JetBrains_Mono, Righteous, Syne } from 'next/font/google';

const akronim = Akronim({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-akronim',
  display: 'swap',
});
const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-righteous',
  display: 'swap',
});
const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: 'Fanel Balemo — Développeur Full Stack & Data Analyst',
    template: '%s · Fanel Balemo',
  },
  description: siteMetadata.description,
  authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
  keywords: [
    'Fanel Balemo',
    'portfolio',
    'développeur full stack',
    'data analyst',
    'alternance',
    'MIAGE',
    'Toulouse',
    'Next.js',
    'Python',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteMetadata.locale,
    url: '/',
    siteName: siteMetadata.title,
    title: 'Fanel Balemo — Développeur Full Stack & Data Analyst',
    description: siteMetadata.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fanel Balemo — Développeur Full Stack & Data Analyst',
    description: siteMetadata.description,
  },
  robots: { index: true, follow: true },
  themeColor: '#0A0E1A',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteMetadata.author,
  url: siteMetadata.siteUrl,
  email: `mailto:${siteMetadata.email}`,
  jobTitle: 'Étudiant en MIAGE — Développeur Full Stack & Data Analyst',
  address: { '@type': 'PostalAddress', addressLocality: 'Toulouse', addressCountry: 'FR' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Université de Toulouse' },
  sameAs: [siteMetadata.github, siteMetadata.linkedin],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fr"
      className={`${akronim.variable} ${righteous.variable} ${dmSans.variable} ${syne.variable} ${mono.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#0A0E1A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-pro-bg font-sans text-pro-text antialiased">
        {children}
        <LogRocket />
        <Analytics />
      </body>
    </html>
  );
}
