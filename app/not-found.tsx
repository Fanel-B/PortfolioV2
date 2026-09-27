import Link from 'next/link';

export const metadata = {
  title: 'Page introuvable',
  description: 'Page non trouvée - Fanel Balemo',
};

export default function FourZeroFour() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top,#16244A_0%,#0A0E1A_60%)] px-4 text-center">
      <h1 className="font-heading text-6xl font-extrabold tracking-tight text-pro-accent drop-shadow-[0_0_30px_rgba(142,205,248,0.45)] md:text-8xl">
        404
      </h1>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal text-pro-text md:text-2xl">
          Cette étoile n&apos;existe pas (encore).
        </p>
        <p className="mb-8 text-pro-text/70">
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
