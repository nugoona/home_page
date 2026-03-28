import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import { cta } from '@/lib/content/home';

export default function CTA() {
  return (
    <div className="relative py-20 px-12 text-center overflow-hidden max-md:py-16 max-md:px-6"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
    >

      <FadeUp>
        <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] mb-10 relative z-[1]">
          {cta.title}
        </h2>
      </FadeUp>
      {cta.sub && (
        <FadeUp delay={0.1}>
          <p className="text-[15px] text-white/80 mb-10 relative z-[1]">{cta.sub}</p>
        </FadeUp>
      )}
      <FadeUp delay={0.2}>
        <div className="flex justify-center gap-3 mb-5 relative z-[1] max-sm:flex-col max-sm:items-center">
          <Link
            href={cta.primaryHref}
            className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] hover:border-[#e0e0e0] transition-all"
          >
            {cta.primaryText}
          </Link>
          <Link
            href={cta.secondaryHref}
            className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold hover:bg-white/10 transition-all max-sm:w-full max-sm:max-w-[320px]"
            style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.7)', backgroundColor: 'transparent' }}
          >
            {cta.secondaryText}
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
