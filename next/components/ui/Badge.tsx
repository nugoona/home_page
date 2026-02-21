import { cn } from '@/lib/utils';

export default function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-accent bg-accent-bg border border-accent-border',
        className
      )}
    >
      {children}
    </span>
  );
}
