// Extrait des paquets react-icons uniquement les icônes utilisées par le site.
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const files = ['app', 'components', 'lib'].flatMap(function walk(dir) {
  return fs
    .readdirSync(path.join(root, dir), { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : /\.tsx?$/.test(e.name)
        ? [path.join(dir, e.name)]
        : []
    );
});
const used = new Set();
for (const f of files.filter((f) => path.basename(f) !== 'icons.ts')) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  // Icônes déjà importées depuis '@/lib/icons', ou nouvelles importées depuis 'react-icons/xx'.
  // Le paquet se déduit du préfixe du nom : FaGithub → fa, SiPython → si, HiX → hi.
  for (const m of src.matchAll(
    /import\s*\{([^}]*)\}\s*from\s*'(?:react-icons\/(?!lib')\w+|@\/lib\/icons)'/g
  )) {
    m[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((n) => used.add(n.match(/^[A-Z][a-z]+/)[0].toLowerCase() + ':' + n));
  }
}
const out = [];
for (const key of [...used].sort()) {
  const [pack, name] = key.split(':');
  const src = fs.readFileSync(
    path.join(root, 'node_modules/react-icons', pack, 'index.esm.js'),
    'utf8'
  );
  // Chaque icône est écrite : export function Nom (props) {\n  return GenIcon({...})(props);
  const head = `export function ${name} (props) {\n  return GenIcon(`;
  const start = src.indexOf(head);
  if (start === -1) throw new Error('introuvable : ' + key);
  const end = src.indexOf(')(props);', start);
  // Complète les nœuds sans enfants pour respecter le type IconTree de react-icons.
  const withChildren = (node) => ({ ...node, child: (node.child || []).map(withChildren) });
  const tree = withChildren(JSON.parse(src.slice(start + head.length, end)));
  out.push(`export const ${name}: IconType = GenIcon(${JSON.stringify(tree)});`);
}
fs.writeFileSync(
  path.join(root, 'lib/icons.ts'),
  `// Fichier généré à partir de react-icons : seules les icônes utilisées par le site y figurent.\n// Importer un paquet entier (ex. 'react-icons/si', 3,2 Mo) ralentissait fortement le mode dev.\n// Pour ajouter une icône : l'importer depuis 'react-icons/xx' dans un composant, puis relancer\n// \`node scripts/gen-icons.cjs .\` qui régénère ce fichier et remplace les imports.\n/* eslint-disable */\nimport { GenIcon, IconType } from 'react-icons/lib';\n\n${out.join(
    '\n'
  )}\n`
);
// Remplace les imports dans les fichiers sources
for (const f of files) {
  const p = path.join(root, f);
  let src = fs.readFileSync(p, 'utf8');
  const before = src;
  src = src.replace(
    /import\s*\{([^}]*)\}\s*from\s*'react-icons\/(?!lib')\w+';/g,
    "import {$1} from '@/lib/icons';"
  );
  src = src.replace(
    /import\s*\{\s*IconType\s*\}\s*from\s*'react-icons';/g,
    "import { IconType } from 'react-icons/lib';"
  );
  if (src !== before) fs.writeFileSync(p, src);
}
console.log(out.length, 'icônes');
