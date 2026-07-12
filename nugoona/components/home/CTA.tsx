import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import { cta } from '@/lib/content/home';

export default function CTA() {
  return (
    <div className="relative pt-24 pb-20 px-12 overflow-hidden max-md:pt-20 max-md:pb-16 max-md:px-6 border-t border-border-default"
      style={{ background: '#fafafa' }}
    >
     <div className="max-w-[720px] mx-auto">
      <FadeUp>
        <h2
          className="max-w-[600px] text-[clamp(28px,4vw,44px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-8 relative z-[1]"
          dangerouslySetInnerHTML={{ __html: cta.title }}
        />
      </FadeUp>
      {cta.sub && (
        <FadeUp delay={0.1}>
          <p className="max-w-[480px] text-[15px] max-md:text-[16px] text-text-weak mb-10 relative z-[1]">{cta.sub}</p>
        </FadeUp>
      )}
      <FadeUp delay={0.2}>
        <div className="flex justify-start gap-3 mb-5 relative z-[1] max-sm:flex-col max-sm:items-stretch">
          <Link
            href={cta.primaryHref}
            className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-[#171717] text-white border border-[#171717] hover:bg-[#333] hover:border-[#333] transition-all"
          >
            {cta.primaryText}
          </Link>
          <Link
            href={cta.secondaryHref}
            className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold hover:bg-black/[0.04] transition-all max-sm:w-full max-sm:max-w-[320px]"
            style={{ color: '#171717', border: '1px solid #d0d0d0', backgroundColor: 'transparent' }}
          >
            {cta.secondaryText}
          </Link>
        </div>
      </FadeUp>
     </div>
    </div>
  );
}
