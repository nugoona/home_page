'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * S3 · 왜 만들었나 (라이트, 텍스트 전용 — 목업 없음)
 * §8.6-B: 수동 <br> 균형 + accent 스팬, dangerouslySetInnerHTML.
 * §8.7-H: 큰 헤딩 + 본문 2~3줄, 목업 없음(랜딩이지 앱 UI가 아니다).
 */
export default function Philosophy() {
  return (
    <div className="py-[100px] px-12 max-md:py-16 max-md:px-6 flex justify-center">
      <div className="max-w-[640px] text-center">
        <FadeUp>
          <h2
            className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-6"
            dangerouslySetInnerHTML={{ __html: philosophy.heading }}
          />
        </FadeUp>
        <FadeUp delay={0.12}>
          <p className="text-[16px] text-text-body leading-[1.65]">{philosophy.body}</p>
        </FadeUp>
      </div>
    </div>
  );
}
