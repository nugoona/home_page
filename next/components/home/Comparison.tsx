import FadeUp from '@/components/motion/FadeUp';
import CounterUp from '@/components/motion/CounterUp';
import Badge from '@/components/ui/Badge';
import { comparison } from '@/lib/content/home';
import { cn } from '@/lib/utils';

export default function Comparison() {
  return (
    <div className="grid grid-cols-[1fr_2fr] min-h-[480px] max-md:grid-cols-1 max-md:min-h-0">
      <div className="py-[72px] px-14 flex flex-col justify-center max-md:py-10 max-md:px-6">
        <FadeUp>
          <p className="text-[clamp(64px,10vw,100px)] font-semibold text-text-primary tracking-[-0.04em] leading-none mb-4 max-sm:text-[56px]" style={{ fontFamily: 'var(--font-en)' }}>
            <CounterUp target={0} suffix="%" />
          </p>
          <p className="text-[18px] text-text-primary font-semibold mb-2">대행사 수수료, 이제 그만.</p>
          <p className="text-[15px] text-text-body leading-[1.6] mb-5" dangerouslySetInnerHTML={{ __html: comparison.sub }} />
          <Badge>{comparison.badgeText}</Badge>
        </FadeUp>
      </div>
      <div className="p-10 flex items-center justify-center max-md:p-6">
        <FadeUp delay={0.1}>
          <table className="w-full border border-border-default border-collapse-separate border-spacing-0 overflow-hidden max-sm:block max-sm:overflow-x-auto max-sm:text-[12px]">
            <thead>
              <tr>
                <th className="bg-bg-alt text-text-body font-semibold text-[12px] tracking-[0.3px] border-b border-border-default py-3.5 px-[18px] text-left">월 광고비</th>
                <th className="bg-bg-alt text-text-body font-semibold text-[12px] tracking-[0.3px] border-b border-border-default py-3.5 px-[18px] text-left">기존 대행사</th>
                <th className="bg-bg-alt text-accent font-semibold text-[12px] tracking-[0.3px] border-b border-border-default py-3.5 px-[18px] text-left">NGN</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-bg-alt">
                  <td className="py-3.5 px-[18px] text-[13px] text-text-primary font-medium border-b border-border-light last:border-b-0">{row.item}</td>
                  <td className={cn(
                    'py-3.5 px-[18px] text-[13px] border-b border-border-light last:border-b-0',
                    row.noStrike ? 'text-text-body' : row.agencyStyle || 'text-text-disabled line-through'
                  )}>
                    {row.agency}
                  </td>
                  <td className="py-3.5 px-[18px] text-[13px] text-accent font-semibold border-b border-border-light last:border-b-0">{row.ngn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeUp>
      </div>
    </div>
  );
}
