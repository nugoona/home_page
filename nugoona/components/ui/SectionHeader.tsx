import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  compact?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  compact = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2
        className={cn(
          'text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.02em] leading-[1.15] text-text-primary',
          compact ? 'mb-1.5' : 'mb-4'
        )}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && (
        <p
          className={cn(
            'text-[18px] text-text-primary font-light leading-[1.6]',
            align === 'center' && 'max-w-[520px] mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
