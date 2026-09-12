import Link from 'next/link';

export const metadata = {
  title: '404 - Fanel Balemo',
  description: 'Page non trouvée - Fanel Balemo',
};

export default function FourZeroFour() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-center dark:bg-pro-bg">
      <h1 className="font-display text-6xl font-extrabold tracking-tight text-gray-900 dark:text-pro-text md:text-8xl">
        404
      </h1>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal text-gray-900 dark:text-pro-text md:text-2xl">
          Désolé, nous n&apos;avons pas trouvé cette page.
        </p>
        <p className="mb-8 text-gray-600 dark:text-pro-text/70">
          Mais pas d&apos;inquiétude, vous trouverez plein d&apos;autres choses sur la page
          d&apos;accueil.
        </p>
        <Link href="/" className="font-semibold text-pro-accent hover:underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
