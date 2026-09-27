interface Props {
  label: string;
  className?: string;
  variant?: 'pro' | 'perso';
}

export default function PlaceholderImage({ label, className = '', variant = 'pro' }: Props) {
  const styles =
    variant === 'perso'
      ? 'border-2 border-dashed border-perso-accent3 bg-gradient-to-br from-perso-accent3/30 to-perso-accent2/20 text-perso-text/70'
      : 'border border-dashed border-pro-accent/30 bg-gradient-to-br from-pro-surface to-pro-surface2 text-pro-text/50';

  return (
    <div
      className={`flex items-center justify-center rounded-xl p-4 text-center text-sm font-medium ${styles} ${className}`}
    >
      {label}
    </div>
  );
}
