interface Props {
  label: string;
  className?: string;
  variant?: 'pro' | 'perso';
}

export default function PlaceholderImage({ label, className = '', variant = 'pro' }: Props) {
  const styles =
    variant === 'perso'
      ? 'border-2 border-dashed border-perso-accent2 bg-gradient-to-br from-perso-accent2/20 to-perso-accent3/20 text-perso-text/70'
      : 'border border-dashed border-pro-accent/30 bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400 dark:from-pro-surface dark:to-pro-surface2 dark:text-pro-text/50';

  return (
    <div
      className={`flex items-center justify-center rounded-xl p-4 text-center text-sm font-medium ${styles} ${className}`}
    >
      {label}
    </div>
  );
}
