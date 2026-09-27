import { IconType } from 'react-icons';
import { HiChartBar, HiCode, HiUsers } from 'react-icons/hi';
import {
  SiAndroidstudio,
  SiBootstrap,
  SiCss3,
  SiFigma,
  SiGit,
  SiGoogle,
  SiHtml5,
  SiJava,
  SiJavascript,
  SiJira,
  SiKotlin,
  SiMicrosoftexcel,
  SiMysql,
  SiNextdotjs,
  SiPandas,
  SiPhp,
  SiPowerbi,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiVisualstudiocode,
} from 'react-icons/si';

// Associe chaque outil de data/profile.ts à son logo. Un outil absent d'ici prend l'icône générique.
const ICONS: Record<string, IconType> = {
  Python: SiPython,
  JavaScript: SiJavascript,
  Java: SiJava,
  Kotlin: SiKotlin,
  PHP: SiPhp,
  HTML: SiHtml5,
  CSS: SiCss3,
  SQL: SiMysql,
  React: SiReact,
  'Next.js': SiNextdotjs,
  Bootstrap: SiBootstrap,
  Pandas: SiPandas,
  Matplotlib: HiChartBar,
  'Power BI': SiPowerbi,
  Excel: SiMicrosoftexcel,
  'Git / GitHub': SiGit,
  'VS Code': SiVisualstudiocode,
  Figma: SiFigma,
  'Android Studio': SiAndroidstudio,
  JIRA: SiJira,
  'Google Suite': SiGoogle,
  'Tailwind CSS': SiTailwindcss,
  'Agile / Scrum': HiUsers,
};

export function skillIcon(name: string): IconType {
  return ICONS[name] ?? HiCode;
}
