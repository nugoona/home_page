'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * 벽돌3 · 철학 롱폼 시안 C — 글 + 실물 지그재그 ("내용과 함께 보여주고")
 * 1막 글만 → 2막 [글|순위 측정 실물] → 3막 [앱 실물|글]. 실물은 각 막을 거들 뿐(§8.7-I).
 * 곁들인 실물: mock-rank-detail(정직 측정 "안 보임/3페이지") · app-home-mobile(직접 운영 앱).
 */
const SHOTS: Record<number, { src: string; alt: string; side: 'left' | 'right' } | null> = {
  0: null,
  1: { src: '/shots/content/mock-rank-detail.png', alt: '내 가게 노출 현황 — 있는 그대로 측정', side: 'right' },
  2: { src: '/shots/content/app-home-mobile.jpg', alt: '직접 운영하는 앱 화면', side: 'left' },
};

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="shrink-0 max-md:mx-auto">
      <img
        src={src}
        alt={alt}
        className="w-[248px] max-md:w-[210px] rounded-[14px] border border-border-default shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)]"
      />
    </div>
  );
}

export default function PhilosophyC() {
  return (
    <div className="bg-white py-[120px] px-6 max-md:py-16 flex justify-center">
      <div className="w-full max-w-[960px]">
        <FadeUp>
          <p className="text-[15px] max-md:text-[14px] text-text-weak mb-16 max-md:mb-12">
            {philosophy.opening}
          </p>
        </FadeUp>

        <div className="flex flex-col gap-20 max-md:gap-14">
          {philosophy.acts.map((act, i) => {
            const shot = SHOTS[i];
            const text = (
              <div className="max-w-[560px]">
                <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.1em] text-[#0070f3]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-4 text-[clamp(22px,3vw,30px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.3]">
                  {act.title}
                </h3>
                <p className="text-[17px] max-md:text-[16px] text-text-body leading-[1.85]">{act.body}</p>
              </div>
            );

            if (!shot) {
              return (
                <FadeUp key={i}>
                  <div className="mx-auto max-w-[640px] text-center max-md:text-left">{text}</div>
                </FadeUp>
              );
            }

            return (
              <FadeUp key={i} delay={0.06}>
                <div className="flex items-center gap-14 max-md:flex-col max-md:gap-8">
                  {shot.side === 'left' ? (
                    <>
                      <Shot src={shot.src} alt={shot.alt} />
                      {text}
                    </>
                  ) : (
                    <>
                      {text}
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
