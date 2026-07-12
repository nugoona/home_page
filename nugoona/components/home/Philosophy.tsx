'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * S3 · 왜 만들었나 (라이트, 롱폼 3막 — 글 주인공 + 실물 지그재그 = 벽돌3 C안 확정)
 * 카피 = home.ts philosophy(축약안 v1). lines[] = 문장 단위 줄바꿈.
 * 2막에 정직 측정 실물, 3막에 앱 실물을 곁들임(§8.7-I: 시각물은 각 막을 거듦).
 */
const SHOTS: Record<number, { src: string; alt: string; side: 'left' | 'right' } | null> = {
  0: null,
  1: { src: '/shots/content/mock-rank-detail.png', alt: '내 가게 노출 현황 — 있는 그대로 측정', side: 'right' },
  2: { src: '/shots/content/app-home-mobile.jpg', alt: '직접 운영하는 앱 화면', side: 'left' },
};

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-[244px] max-md:w-[208px] shrink-0 max-md:mx-auto rounded-[14px] border border-border-default shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)]"
    />
  );
}

function Body({ title, lines, index }: { title: string; lines: string[]; index: number }) {
  return (
    <div className="max-w-[540px]">
      <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.12em] text-[#0070f3]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mb-5 text-[clamp(23px,3vw,31px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25]">
        {title}
      </h3>
      <div className="space-y-2">
        {lines.map((l, i) => (
          <p key={i} className="text-[17px] max-md:text-[15px] text-text-body leading-[1.55]">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Philosophy() {
  return (
    <div className="py-[120px] px-6 max-md:py-16 flex justify-center">
      <div className="w-full max-w-[960px]">
        <FadeUp>
          <p className="text-center text-[15px] max-md:text-[14px] text-text-weak mb-20 max-md:mb-14">
            {philosophy.opening}
          </p>
        </FadeUp>

        <div className="flex flex-col gap-24 max-md:gap-16">
          {philosophy.acts.map((act, i) => {
            const shot = SHOTS[i];
            const body = <Body title={act.title} lines={act.lines} index={i} />;

            if (!shot) {
              return (
                <FadeUp key={i}>
                  <div className="mx-auto max-w-[560px] text-center max-md:text-left [&_.space-y-2]:inline-block">
                    {body}
                  </div>
                </FadeUp>
              );
            }

            return (
              <FadeUp key={i} delay={0.06}>
                <div className="flex items-center justify-center gap-16 max-md:flex-col max-md:gap-8">
                  {shot.side === 'left' ? (
                    <>
                      <Shot src={shot.src} alt={shot.alt} />
                      {body}
                    </>
                  ) : (
                    <>
                      {body}
                      <Shot src={shot.src} alt={shot.alt} />
                    </>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </div>
  );
}
