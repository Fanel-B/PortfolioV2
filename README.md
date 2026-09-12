# Portfolio - Fanel Balemo ⚡️

Portfolio one-page (Next.js App Router + Tailwind CSS) : Hero, Qui je suis, Mes Outils, Mon Travail,
et une "trappe" qui bascule vers une page Personnalité via un flip 3D (Framer Motion).

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics), [LogRocket](https://logrocket.com/)

## Running Locally

### Installation

1. Clone this repo

```bash
git clone https://github.com/Fanel-B/PortfolioV2.git
```

2. Change directory

```sh
cd PortfolioV2
```

3. Install packages

```bash
bun install
```

4. Create a `.env.local` file following `.env.example`

```bash
cp .env.example .env.local
```

5. Run the development server

```bash
bun run dev
```

## Contenu à personnaliser

Tout le contenu du site (bio, timeline, outils, projets, section Personnalité) vit dans un seul
fichier : [`data/profile.ts`](./data/profile.ts). Les métadonnées globales (titre, liens sociaux,
email) sont dans [`data/siteMetadata.js`](./data/siteMetadata.js).

## Licence

This project is based on the open-source template by [Dale Larroder](https://www.dalelarroder.com), used and personalized under the [MIT license](./LICENSE).
