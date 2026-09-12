import '@/css/tailwind.css';

import Analytics from '@/components/Analytics';
import LogRocket from '@/components/LogRocket';
import ThemeProvider from '@/components/Providers/ThemeProvider';
import { Akronim, DM_Sans, Righteous } from 'next/font/google';

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
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Fanel Balemo',
  description: "J'aime comprendre les données et construire les outils qui les exploitent.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${akronim.variable} ${righteous.variable} ${dmSans.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="h-screen overflow-hidden bg-white font-sans text-black antialiased dark:bg-pro-bg dark:text-pro-text">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <LogRocket />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
