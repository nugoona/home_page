import { cn } from '@/lib/utils';

const positions = {
  'top-left': 'top-[-11px] left-[-11px]',
  'top-right': 'top-[-11px] right-[-11.5px]',
  'bottom-left': 'bottom-[-11px] left-[-11px]',
  'bottom-right': 'bottom-[-11px] right-[-11.5px]',
} as const;

export default function CrossMark({
  position,
  stroke,
  className,
}: {
  position?: keyof typeof positions;
  stroke?: string;
  className?: string;
}) {
  const color = stroke ?? '#000';
  return (
    <svg
      className={cn(
        'absolute pointer-events-none z-[2] hidden md:block',
        position && positions[position],
        className
      )}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      shapeRendering="crispEdges"
    >
      <line x1="0" y1="11" x2="22" y2="11" style={{ stroke: color, strokeWidth: 0.5 }} />
      <line x1="11" y1="0" x2="11" y2="22" style={{ stroke: color, strokeWidth: 0.5 }} />
    </svg>
  );
}
