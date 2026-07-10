import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN = { fontFamily: 'var(--font-en)' } as const;

interface Props {
  eyebrow: string;
  title: string; // HTML 허용 (<br>·accent 스팬)
  desc: string;
}

/** 서브히어로 — 제품 그룹 도입 헤더 (features 쇼케이스 헤더 골격) */
export default function ShowcaseHeader({ eyebrow, title, desc }: Props) {
  return (
    <Section crossMarks>
      <div className="py-24 px-12 max-md:py-14 max-md:px-6">
        <FadeUp>
          <div className="max-w-[1080px] mx-auto">
            <p className="text-[12px] font-semibold text-accent tracking-[0.12em] uppercase mb-3" style={EN}>
              {eyebrow}
            </p>
            <h2
              className="text-[clamp(30px,4.5vw,46px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.12] mb-5"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-[17px] text-text-body leading-[1.65] max-w-[560px]">{desc}</p>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
