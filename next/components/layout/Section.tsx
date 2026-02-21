import { cn } from '@/lib/utils';
import CrossMark from '@/components/ui/CrossMark';

interface SectionProps {
  children: React.ReactNode;
  alt?: boolean;
  dark?: boolean;
  className?: string;
  noBorder?: boolean;
  crossMarks?: boolean;
  id?: string;
}

export default function Section({
  children,
  alt = false,
  dark = false,
  className,
  noBorder = false,
  crossMarks = false,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative',
        !noBorder && 'border-b border-border-default',
        alt && 'bg-bg-alt',
        dark && 'bg-[#0a0a0a]',
        className
      )}
    >
      {crossMarks && (
        <>
          <CrossMark position="top-left" />
          <CrossMark position="top-right" />
        </>
      )}
      {children}
    </section>
  );
}
