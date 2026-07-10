import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import { cn } from '@/lib/utils';

const EN = { fontFamily: 'var(--font-en)' } as const;

interface Props {
  num: string;
  title: string; // HTML 허용
  desc: string;
  sub?: string;
  alt?: boolean;
  reverse?: boolean; // true = 목업 우 / 텍스트 좌
  mockSpan?: number; // 목업 칸 컬럼 수(12 중) — 목업 폭에 맞춰 세로선 X가 달라짐
  children: React.ReactNode;
}

/**
 * FeatureRow — 목업/텍스트를 세로선으로 구획한 박스.
 * 목업 폭(mockSpan)에 따라 세로선 X가 섹션마다 다르되, 모든 경계가 공통 12컬럼에 스냅 → 통일감.
 */
export default function ShowcaseRow({
  num, title, desc, sub, alt, reverse, mockSpan = 7, children,
}: Props) {
  const textSpan = 12 - mockSpan;

  return (
    <Section alt={alt} noBorder>
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 border-t border-border-default max-md:block">
        {/* 목업 셀 */}
        <div
          style={{ gridColumn: `span ${mockSpan}` }}
          className={cn(
            'flex items-center justify-center p-16 max-md:p-8 border-border-default',
            reverse ? 'md:order-2 md:border-l' : 'md:border-r',
            'max-md:border-b'
          )}
        >
          <FadeUp className="w-full flex justify-center">{children}</FadeUp>
        </div>

        {/* 텍스트 셀 */}
        <div
          style={{ gridColumn: `span ${textSpan}` }}
          className={cn('flex flex-col justify-center p-16 max-md:p-8', reverse && 'md:order-1')}
        >
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717] shrink-0"
                style={EN}
              >
                {num}
              </span>
              <div className="flex-1 h-px bg-border-default" />
            </div>
            <h3
              className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-4"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-[15px] text-text-body leading-[1.7] mb-5">{desc}</p>
            {sub && <p className="text-[14px] text-text-weak" style={EN}>{sub}</p>}
          </FadeUp>
        </div>
      </div>
    </Section>
  );
}
