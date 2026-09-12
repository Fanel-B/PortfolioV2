import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-pro-surface2 dark:text-pro-text/60">
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
