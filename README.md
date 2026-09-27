# Portfolio — Fanel Balemo

Portfolio d'un étudiant en L3 MIAGE à Toulouse, développeur full stack et data analyst en recherche d'alternance.

Le site a **deux faces** :

- **Le côté pro**, un ciel de nuit en 3D : parcours, compétences, projets.
- **Le côté humain**, sombre et chaleureux, organisé autour d'un Soleil photographié par la NASA.

On passe de l'un à l'autre en retournant la page comme une carte.

|             |                                                                      |
| ----------- | -------------------------------------------------------------------- |
| Framework   | [Next.js 13](https://nextjs.org/) (App Router), React 18, TypeScript |
| Style       | [Tailwind CSS](https://tailwindcss.com/)                             |
| Animation   | [Framer Motion](https://www.framer.com/motion/), CSS                 |
| 3D          | [Three.js](https://threejs.org/) + shaders GLSL                      |
| Polices     | Syne (titres), DM Sans (texte), JetBrains Mono (détails techniques)  |
| Hébergement | [Vercel](https://vercel.com/) (+ Vercel Analytics)                   |

---

## Sommaire

1. [Lancer le projet](#lancer-le-projet)
2. [Organisation du code](#organisation-du-code)
3. [Modifier le contenu](#modifier-le-contenu)
4. [Direction artistique](#direction-artistique)
5. [Les animations en détail](#les-animations-en-détail)
6. [Accessibilité et performance](#accessibilité-et-performance)
7. [SEO](#seo)
8. [Variables d'environnement](#variables-denvironnement)
9. [Branches et déploiement](#branches-et-déploiement)
10. [Crédits](#crédits)

---

## Lancer le projet

Prérequis : [Bun](https://bun.sh/) (ou Node.js 20 et npm).

```bash
git clone https://github.com/Fanel-B/PortfolioV2.git
cd PortfolioV2
bun install
cp .env.example .env.local   # facultatif, voir « Variables d'environnement »
bun dev                      # http://localhost:3000
```

| Commande        | Rôle                                                 |
| --------------- | ---------------------------------------------------- |
| `bun dev`       | Serveur de développement avec rechargement à chaud   |
| `bun run build` | Build de production (lance aussi ESLint et Prettier) |
| `bun run serve` | Sert le build de production                          |
| `bun run lint`  | Corrige ce qui peut l'être avec ESLint               |

### Vitesse du mode dev

En mode dev, Next.js compile chaque page **au premier affichage** : compte environ 10 à 15 s la toute première fois, puis moins de 10 s aux lancements suivants (le cache est dans `.next/`), et moins de 0,5 s pour les rechargements. La version en ligne, elle, est précompilée et s'affiche immédiatement.

- Ne supprime pas `.next/` sans raison : c'est ce cache qui accélère les lancements suivants (polices, compilation).
- Ne lance jamais `bun run build` pendant qu'un `bun dev` tourne : les deux écrivent dans `.next/` et le serveur de dev plante. En cas de souci, arrête tout, supprime `.next/` et relance.
- Sous Windows, exclure le dossier du projet de l'analyse de Microsoft Defender accélère nettement la compilation.
- Pour juger la vitesse réelle du site, teste la version de production : `bun run build` puis `bun run serve`.

---

## Organisation du code

```
app/
  layout.tsx            Polices, métadonnées SEO, fiche JSON-LD
  page.tsx              Assemble la page et gère la bascule pro ↔ humain
  opengraph-image.tsx   Image d'aperçu générée pour les partages
  robots.ts, sitemap.ts
components/
  Sky/SkyBackground.tsx Ciel étoilé Three.js
  TargetCursor.tsx      Curseur-viseur
  Navbar/               Pilule flottante (barre d'onglets en bas sur mobile)
  Hero/                 Hero + constellation « FB »
  QuiJeSuis/            01 Origine, trajectoire, carte « Épisode 02 »
  FloatingSun.tsx       Petit soleil flottant, raccourci vers le côté humain
  Outils/               02 Arsenal (bandes de logos + catégories)
  Travail/              03 Lancements (filtres + grille bento)
  Footer.tsx            04 Transmission (contact)
  Personnalite/         Côté humain : hero Soleil + tableau de bord
  Reveal.tsx, SectionHeader.tsx, ScrollProgress.tsx, CvModal.tsx, CopyEmail.tsx
data/
  profile.ts            TOUT le contenu du site
  siteMetadata.js       Titre, description, URL, liens
lib/
  hooks/                useActiveSection, useRotatingTypewriter
  skillIcons.ts         Nom d'outil → logo
  ui.ts                 Conteneur de page commun
css/tailwind.css        Styles globaux (quadrillage, grain, glitch, défilement)
```

---

## Modifier le contenu

**Tout le texte vient de [`data/profile.ts`](./data/profile.ts)**. Il n'y a presque rien à toucher dans les composants.

| Pour…                         | Modifier dans `profile.ts`                                                                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ajouter un projet             | Un objet dans `projects` : titre, description, `categories` (Web / Data / IA), liens, `image`                                                                              |
| Ajouter une capture de projet | Déposer l'image dans `public/static/images/projects/`, puis `image: '/static/images/projects/xxx.jpg'`. Mettre `imageFit: 'contain'` pour un graphique à montrer en entier |
| Ajouter une compétence        | `outils` ; pour son logo, voir « Ajouter une icône » ci-dessous (sinon, icône générique)                                                                                   |
| Ajouter une étape de parcours | `timeline`, de la plus récente à la plus ancienne                                                                                                                          |
| Activer le CV                 | Déposer le PDF dans `public/cv/`, puis renseigner `cvUrl`                                                                                                                  |
| Remplir le côté humain        | `personality` : photos, passions, citations, musique, lieux, apprentissages                                                                                                |

### Ajouter une icône

Les icônes viennent de [react-icons](https://react-icons.github.io/react-icons/), mais le site n'importe jamais un paquet entier (`react-icons/si` pèse 3,2 Mo et ralentissait fortement le mode dev). Seules les icônes utilisées sont copiées dans [`lib/icons.ts`](./lib/icons.ts), un fichier généré.

1. Dans le composant, importer l'icône normalement : `import { SiDocker } from 'react-icons/si';` (et l'ajouter dans [`lib/skillIcons.ts`](./lib/skillIcons.ts) si c'est un logo de compétence).
2. Lancer `node scripts/gen-icons.cjs .` : le script ajoute l'icône à `lib/icons.ts` et remplace l'import par `@/lib/icons`.

Les valeurs qui finissent par `_ICI` (ex. `'MUSIQUES_ICI'`) sont des emplacements vides : le site affiche « à venir » à la place.

---

## Direction artistique

### Deux faces, deux lumières

|             | Côté pro : ciel de nuit                        | Côté humain : lumière chaude     |
| ----------- | ---------------------------------------------- | -------------------------------- |
| Fond        | `#0A0E1A` (`pro-bg`)                           | `#0F0B12` (`perso-bg`)           |
| Accent      | Bleu ciel scintillant `#8ECDF8` (`pro-accent`) | Ambre `#F2B880` (`perso-accent`) |
| Secondaires | Lavande `#B8A9F5`, menthe `#9EE6CF`            | Rose poudré `#E8A0BF`            |
| Texte       | `#E2E8F0`                                      | Crème `#F3E9DC`                  |
| Texture     | Quadrillage d'observatoire                     | Grain de pellicule               |

Les couleurs sont définies dans [`tailwind.config.js`](./tailwind.config.js) et utilisées sous forme de classes (`text-pro-accent`, `bg-perso-surface`…).

### Principes

- **Mise en page éditoriale** : alignée à gauche, sur toute la largeur (conteneur de 1 400 px max), titres numérotés `01 — Origine`.
- **Thème spatial** : Origine, Arsenal, Lancements, Transmission ; constellation, orbite, viseur de télescope.
- **Typographie** : Syne en très grand pour les titres, JetBrains Mono pour tout ce qui est « technique » (numéros, étiquettes, terminal).

---

## Les animations en détail

### 1. Ciel étoilé 3D — [`Sky/SkyBackground.tsx`](./components/Sky/SkyBackground.tsx)

- **3 600 étoiles** réparties dans un cube de 100 unités, avec une caméra (champ de vision 75°) placée **à l'intérieur**, en `z = 20`. Résultat : les étoiles proches sont grosses et floues, les lointaines minuscules, ce qui donne une vraie profondeur.
- Couleurs : 55 % blanches, 35 % bleu ciel, 10 % lavande. 4 % des étoiles sont bien plus brillantes que les autres.
- **Shaders GLSL** faits main :
  - _vertex shader_ : taille selon la distance et scintillement (`sin` du temps avec une phase propre à chaque étoile) ;
  - _fragment shader_ : halo rond et doux, avec un cœur plus lumineux, en mélange additif.
- **Rotation à la souris**, comme sur DevHQ : tant que la souris est décalée du centre, l'univers continue de tourner dans sa direction (vitesse lissée). Le scroll donne aussi une petite impulsion.
- **Côté humain** : les étoiles glissent vers des tons ambre et rose (`uWarm`), le quadrillage s'efface et le grain de pellicule apparaît (transition de 0,7 s).
- Sans WebGL, un simple dégradé CSS prend le relais.

### 2. Curseur-viseur — [`TargetCursor.tsx`](./components/TargetCursor.tsx)

- Quatre coins en losange autour d'un point, qui suivent la souris avec un ressort (`stiffness 450, damping 35`).
- Au survol d'un lien ou d'un bouton, les coins **se redressent et se verrouillent** autour de l'élément (6 px de marge), comme une cible.
- Bleu côté pro, ambre côté humain. N'apparaît que sur les écrans avec une souris (`pointer: fine`) ; ailleurs, le curseur normal reste.

### 3. Navbar — [`Navbar/Navbar.tsx`](./components/Navbar/Navbar.tsx)

- Pilule flottante qui descend à l'arrivée sur la page (ressort).
- L'indicateur de section active **glisse** d'un lien à l'autre grâce à `layoutId` de Framer Motion.
- La section active est calculée au scroll : c'est la dernière dont le haut a dépassé 40 % de l'écran.
- Sur mobile, elle devient une barre d'onglets en bas de l'écran.

### 4. Hero et constellation — [`Hero/`](./components/Hero)

- Le nom apparaît ligne par ligne (0,9 s, décalage de 0,1 s). « BALEMO » est en contour lumineux, avec un effet glitch au survol.
- Les rôles s'écrivent puis s'effacent en boucle (`useRotatingTypewriter`) : 70 ms par lettre, pause de 1,6 s.
- **Constellation FB** (SVG) : les initiales dessinées en étoiles reliées. Les lignes se tracent une à une (`pathLength`), et chaque étoile scintille et affiche une compétence au survol ou au toucher.

### 5. Apparitions au scroll — [`Reveal.tsx`](./components/Reveal.tsx)

- Chaque bloc monte de 30 px et apparaît en 0,6 s quand 20 % de sa surface entre à l'écran.
- L'animation **se rejoue** quand on remonte (`once: false`), comme sur DevHQ.

### 6. Trajectoire — [`QuiJeSuis/Timeline.tsx`](./components/QuiJeSuis/Timeline.tsx)

- Frise horizontale (verticale sur mobile). La ligne lumineuse se remplit en 1,4 s jusqu'à l'étape actuelle, qui pulse.
- Une dernière étape en pointillés, « Alternance — votre entreprise ? », reste ouverte.

### 7. Carte « Épisode 02 » — [`QuiJeSuis/EpisodeTeaser.tsx`](./components/QuiJeSuis/EpisodeTeaser.tsx)

La porte vers le côté humain, en style carte de fin d'épisode d'anime (次回予告, « prochain épisode »). Comme dans un anime, elle arrive **à la fin** : après les projets, juste avant le contact, précédée de « // Fin de l'épisode 01 ». Elle ne coupe donc pas la lecture du côté pro.

- **Lignes de vitesse** de manga qui rayonnent depuis le Soleil (`repeating-conic-gradient` en rotation lente sur 60 s, et 8 s au survol).
- **Trame manga** en points, ombre décalée pleine, façon BD.
- Au survol : la carte se soulève, un reflet balaie le bouton, et l'onomatopée **ドン!** (« don ! ») surgit.
- Le Soleil tourne sur lui-même (120 s par tour) ; le kanji 人間 (« l'humain ») est en contour.

### 8. Soleil flottant — [`FloatingSun.tsx`](./components/FloatingSun.tsx)

- Un petit soleil (la même photo NASA) apparaît dans le coin inférieur droit une fois le hero dépassé. Il flotte doucement (4 s par oscillation) et tourne sur lui-même.
- À sa première apparition, une bulle « Psst… il y a un humain derrière le code → » s'affiche 4,5 s, puis seulement au survol.
- Un clic retourne la page vers le côté humain. Il se cache quand la grande carte « Épisode 02 » est à l'écran, pour ne pas faire doublon.

### 9. Arsenal — [`Outils/Outils.tsx`](./components/Outils/Outils.tsx)

- Deux bandes de logos défilent en sens opposés, en boucle infinie (40 s, liste doublée pour un raccord invisible, bords estompés par un masque).
- Les catégories apparaissent en cascade (décalage de 0,08 s).

### 10. Lancements — [`Travail/`](./components/Travail)

- **Filtres** Tous / Web / Data / IA : la pastille active glisse (`layoutId`), les cartes se réorganisent en douceur (`layout` + `AnimatePresence`).
- **Grille bento** : le premier projet est mis en avant (7 colonnes sur 12, deux rangées).
- **Inclinaison 3D** au survol (5° max, ressort), avec un reflet lumineux qui suit la souris.
- Les captures sont présentées dans une **fenêtre de navigateur** (trois points + adresse du site).

### 11. Bascule pro ↔ humain — [`app/page.tsx`](./app/page.tsx)

- La page pivote comme une carte : la face actuelle tourne de 0 à 90° (0,45 s), puis la nouvelle arrive de −90 à 0°.
- Le point de vue de la rotation est placé **au milieu de l'écran**, où que l'on soit dans la page, pour que l'effet reste net même tout en bas.
- Entre les deux, on remonte en haut de la page. Au tout premier affichage, il n'y a pas de rotation (`AnimatePresence initial={false}`).

### 12. Côté humain — [`Personnalite/`](./components/Personnalite)

- **Hero** : la phrase « En chacun de nous existe un soleil. », à côté d'une vraie photo du Soleil (satellite SDO de la NASA, ultraviolet 171 Å). Elle tourne très lentement (240 s par tour), avec un halo, et ses bords noirs sont effacés (`mix-blend-mode: screen` + masque radial).
- **Tableau de bord « Mon système solaire »**, en tuiles :
  - _En direct_ : l'heure de Toulouse à la seconde ;
  - _Vu d'ici_ : la **photo astronomique du jour de la NASA** (API APOD). L'image est préchargée avant l'affichage et gardée en cache pour la session ; si l'API ne répond pas, c'est la photo du Soleil qui s'affiche ;
  - _Face B_ : une platine vinyle qui tourne (6 s par tour, 2 s au survol) ; un clic passe au morceau suivant ;
  - _Pellicule_, _Hors de l'écran_, _Carnet de route_, _Entre guillemets_, _En ce moment j'apprends_, _Me trouver_.

### 13. Petits détails

- **Barre de progression** du scroll en haut (dégradé bleu → lavande → menthe, avec un ressort).
- **Copier l'email** : un clic copie l'adresse et affiche « Email copié ✓ » ; si le presse-papiers est bloqué, la messagerie s'ouvre.
- **Fenêtre du CV** : se ferme avec Échap ou un clic à l'extérieur, et bloque le scroll de la page derrière.

---

## Accessibilité et performance

- **Animations réduites** : si le système le demande (`prefers-reduced-motion`), Framer Motion coupe les mouvements (`MotionConfig reducedMotion="user"`), les étoiles s'arrêtent et les bandes de logos se figent.
- Le curseur-viseur n'est activé qu'avec une souris ; au clavier et sur mobile, rien ne change.
- Boutons-icônes avec `aria-label`, filtres en `role="tablist"`, fenêtre du CV en `role="dialog"`.
- Three.js : pixel ratio plafonné à 2, ressources libérées au démontage. Seules `transform` et `opacity` sont animées.
- Images servies par `next/image` (formats modernes, tailles adaptées).

---

## SEO

- Métadonnées complètes dans [`app/layout.tsx`](./app/layout.tsx) : titre, description, mots-clés, Open Graph, Twitter, URL canonique.
- Image d'aperçu générée automatiquement : [`app/opengraph-image.tsx`](./app/opengraph-image.tsx).
- Fiche structurée `Person` (JSON-LD) pour Google.
- `sitemap.xml` et `robots.txt` générés par [`app/sitemap.ts`](./app/sitemap.ts) et [`app/robots.ts`](./app/robots.ts).

---

## Variables d'environnement

Toutes facultatives. À copier depuis [`.env.example`](./.env.example) dans `.env.local` (en local) ou dans les réglages du projet Vercel.

| Variable                   | Rôle                                                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | URL publique du site (aperçus de partage, sitemap). **À renseigner avant la mise en production.**                                                                |
| `NEXT_PUBLIC_NASA_API_KEY` | Clé gratuite sur [api.nasa.gov](https://api.nasa.gov) pour la photo du jour. Sans elle, `DEMO_KEY` est utilisée (limitée à 30 appels par heure et par visiteur). |

---

## Branches et déploiement

| Branche   | Rôle                                                                                 |
| --------- | ------------------------------------------------------------------------------------ |
| `main`    | Version en ligne. Si le projet Vercel est relié au dépôt, chaque push y est déployé. |
| `develop` | Branche de travail : les nouveautés y sont testées avant de passer dans `main`.      |

Cycle habituel :

```bash
git checkout develop
# … modifications, puis vérification locale avec bun dev et bun run build …
git commit -m "feat: …"
git push origin develop          # Vercel peut en faire un aperçu en ligne
# quand le résultat plaît :
git checkout main && git merge develop && git push origin main
```

---

## Crédits

- Image du Soleil : [NASA / SDO et les équipes AIA](https://sdo.gsfc.nasa.gov/) (domaine public).
- Photo du jour : [NASA Astronomy Picture of the Day](https://apod.nasa.gov/).
- Inspirations : [DevHQ](https://github.com/arshbibhaw/DevHQ-Personal-Portfolio-Website) (ciel étoilé, navbar), [Lucas Lima](https://lucas-lima.xyz/) (tableau de bord en tuiles).
- Projet basé à l'origine sur le template open source de [Dale Larroder](https://www.dalelarroder.com), utilisé et personnalisé sous [licence MIT](./LICENSE).
