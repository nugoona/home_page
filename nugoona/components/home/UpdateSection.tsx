'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S7 · 업데이트 "매체가 바뀌면, 앱도 바뀝니다" — 다크 + 변화 흐름 라인.
 * Vercel 커넥터 fade 문법 차용: 과거 변화 도트(옅음) → 끝은 accent 펄스(지금도 반영).
 * 리듬 = S5 다크 이후 라이트들 사이 다크 전환점. 카피 = home.ts homeV2.update (토씨 유지).
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function UpdateSection() {
  const { head, body, small } = homeV2.update;
  return (
    <section
      className="relative overflow-hidden px-6 py-[140px] max-md:py-24 flex justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 42%, #0d1525 0%, #070b16 48%, #000 100%)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(58%_52%_at_50%_44%,#000_18%,transparent_86%)]"
      />

      <div className="relative w-full max-w-[820px]">
        <FadeUp>
          <h2
            className="mb-11 text-[clamp(28px,4.2vw,46px)] font-bold text-white tracking-[-0.03em] leading-[1.18] text-balance"
            dangerouslySetInnerHTML={{ __html: head }}
          />
        </FadeUp>

        {/* 변화 흐름 라인 — 과거 도트(옅음) → 끝 accent 펄스 */}
        <FadeUp delay={0.08}>
          <div className="relative mb-12 h-8 w-full max-w-[560px]">
            <svg viewBox="0 0 560 32" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="up-line" x1="0" y1="0" x2="560" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="0.14" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="0.82" stopColor="#4d9fff" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#4d9fff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <line x1="0" y1="16" x2="528" y2="16" stroke="url(#up-line)" strokeWidth="1.5" />
            </svg>
            {[78, 178, 278, 378, 458].map((x, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                style={{ left: x, background: `rgba(255,255,255,${0.18 + i * 0.06})` }}
              />
            ))}
            <span
              aria-hidden
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-pulse rounded-full bg-accent"
              style={{ left: 524, boxShadow: '0 0 0 4px rgba(0,112,243,0.25)' }}
            />
            <span className="absolute -top-[2px] text-[12px] tracking-[0.08em] text-accent" style={{ left: 512, ...EN }}>
              NOW
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.14}>
          <div className="mb-11 max-w-[560px] space-y-4">
            {body.map((p, i) => (
              <p
                key={i}
                className="text-[16px] max-md:text-[14px] leading-[1.6] tracking-[-0.01em] text-white/55"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        </FadeUp>

        {/* 강조 마무리 — "추가 비용 없음"(카피 토씨 유지, 강조만) */}
        <FadeUp delay={0.2}>
          <p className="text-[clamp(19px,2.6vw,26px)] font-semibold text-white tracking-[-0.02em] leading-[1.35]">
            기존 고객은{' '}
            <span className="relative whitespace-nowrap text-accent">
              추가 비용이 없습니다
              <span aria-hidden className="absolute left-0 -bottom-1 h-[3px] w-full rounded-full bg-accent/35" />
            </span>
            .
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
