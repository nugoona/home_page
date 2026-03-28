import { cn } from '@/lib/utils';

interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  alt?: boolean;
  className?: string;
}

export default function BrowserFrame({
  url = 'nugoona.co.kr',
  children,
  alt = false,
  className,
}: BrowserFrameProps) {
  return (
    <div className={cn('border border-border-default overflow-hidden', alt ? 'bg-white' : 'bg-bg-alt', className)}>
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-default bg-white">
        <span className="w-2 h-2 bg-[#e0e0e0] rounded-dot" />
        <span className="w-2 h-2 bg-[#e0e0e0] rounded-dot" />
        <span className="w-2 h-2 bg-[#e0e0e0] rounded-dot" />
        <span className="flex-1 ml-2.5 text-[11px] text-text-weak" style={{ fontFamily: 'var(--font-en)' }}>
          {url}
        </span>
      </div>
      <div className="w-full aspect-[16/10] overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
