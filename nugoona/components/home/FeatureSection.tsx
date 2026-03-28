import Image from 'next/image';
import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import BrowserFrame from '@/components/ui/BrowserFrame';
import { cn } from '@/lib/utils';

interface FeatureSectionProps {
  label: string;
  title: string;
  desc: string;
  bullets: string[];
  link: string;
  frameUrl: string;
  img: string;
  reverse?: boolean;
}

export default function FeatureSection({
  label,
  title,
  desc,
  bullets,
  link,
  frameUrl,
  img,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <div className="py-[100px] px-12 max-md:py-16 max-md:px-6">
      <FadeUp>
        <div
          className={cn(
            'grid gap-14 items-center max-w-[1080px] mx-auto max-md:grid-cols-1 max-md:gap-8',
            reverse ? 'grid-cols-[6fr_5fr]' : 'grid-cols-[5fr_6fr]'
          )}
        >
          <div className={cn(reverse && 'max-md:order-none', 'max-md:order-none')}>
            <p className="text-[11px] font-semibold text-text-weak tracking-[0.1em] uppercase mb-3" style={{ fontFamily: 'var(--font-en)' }}>
              {label}
            </p>
            <h2
              className="text-[clamp(24px,3vw,32px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3.5"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-[15px] text-text-body leading-[1.65] mb-6">{desc}</p>
            <ul className="flex flex-col gap-2.5 mb-6">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#444] leading-[1.5]">
                  <span className="block w-[5px] h-[5px] shrink-0 mt-[7px] bg-[#ccc]" />
                  {b}
                </li>
              ))}
            </ul>
            <Link href={link} className="inline-flex items-center gap-1.5 text-[14px] text-accent font-medium hover:gap-2.5 transition-[gap] duration-150">
              자세히 보기
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
          <div className={cn(reverse && 'order-[-1]', 'max-md:order-[-1]')}>
            <BrowserFrame url={frameUrl}>
              <Image
                src={img}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 55vw"
              />
            </BrowserFrame>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
