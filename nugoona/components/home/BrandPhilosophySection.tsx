'use client';

import { useEffect, useRef } from 'react';
import FadeUp from '@/components/motion/FadeUp';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { homeV2 } from '@/lib/content/home';

/**
 * 회사 철학 — 다크 감성 섹션. Grid Occupancy 편입(2026-07-15, §8.16):
 * Vercel "Security by default." 문법 = 좌 대형 헤딩 칸 / 우 선언 칸(2열, tone=dark).
 * 선언("콘텐츠로 발견되고/광고로 고객을 만납니다")은 텍스트 감량 확정(2026-07-14)의 승격문.
 * 카피 = home.ts homeV2.brandPhilosophy (토씨 변경 금지).
 *
 * ★모바일 전용 등장 = 라인 마스크 리빌(이노션 이식 테스트 2026-07-15, 사장님 "모바일에만"):
 * eyebrow→헤딩 줄1→줄2→선언1→선언2가 보이지 않는 줄 밑에서 0.15s 시차로 올라온다.
 * 트리거 = 섹션 루트 IntersectionObserver(once) → data-reveal wait→in (CSS는 globals.css .reveal-line).
 * ⛔ PC는 기존 FadeUp 그대로 — "PC는 완벽, 건드리지 마" (사장님 2026-07-15).
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;

/* 우 칸 = 상/하 2칸 분할(제품 하나씩 — "허허벌판에 도트만" 반려 2026-07-15. 칸 분할 = 콘텐츠 구조) */
const D_AREAS: GridArea[] = [
  { key: 'head', c: [1, 8], r: [1, 5], className: 'flex items-center' },
  { key: 'decl1', c: [8, 13], r: [1, 3], className: 'flex items-center' },
  { key: 'decl2', c: [8, 13], r: [3, 5], className: 'flex items-center' },
];

/* 리빌 한 줄 — .reveal-line > 직계(block 강제)가 delay를 갖고, 그 안에 실제 콘텐츠 */
const RevealLine = ({ delay, className, children }: { delay: number; className?: string; children: React.ReactNode }) => (
  <span className={`reveal-line ${className ?? ''}`}>
    <span style={{ animationDelay: `${delay}s` }}>{children}</span>
  </span>
);

const EyebrowIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
    <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#9ca3af" />
  </svg>
);

export default function BrandPhilosophySection() {
  const { head } = homeV2.brandPhilosophy;
  const headLines = head.split('<br>');
  const sectionRef = useRef<HTMLElement>(null);

  /* 스크롤 진입 1회 감지 → 리빌 재생(이노션 scradar 대응부) */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute('data-reveal', 'in');
          io.disconnect();
        }
      },
      { rootMargin: '-15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* PC = 기존 FadeUp 그대로(불변) */
  const headBlock = (
    <div className="px-8 py-10 lg:px-12">
      <FadeUp>
        <span className="mb-6 flex items-center gap-2">
          <EyebrowIcon size={22} />
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/45" style={{ fontFamily: 'var(--font-en)' }}>
            Philosophy
          </span>
        </span>
        <h2
          className="text-[clamp(1.8rem,3.4vw,2.9rem)] font-bold leading-[1.28] tracking-[-0.04em] text-white [text-wrap:balance]"
          style={KR}
          dangerouslySetInnerHTML={{ __html: head }}
        />
      </FadeUp>
    </div>
  );

  /* 제품 선언 반칸 — 큰 로고(≈1셀) + 우측(제품명 라벨/선언). 사장님 2026-07-15 "로고 너무 작아, 한 칸 꽉 채워도 돼" */
  const declCell = (logo: string, name: string, text: string, delay: number) => (
    <div className="px-8 py-8 lg:px-11">
      <FadeUp delay={delay}>
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={`${name} 로고`} style={{ height: 76, width: 76, display: 'block' }} className="shrink-0" />
          <div className="min-w-0">
            <span className="mb-2 block text-[14px] font-semibold tracking-[-0.01em] text-white/55" style={KR}>
              {name}
            </span>
            <p className="text-[clamp(21px,2.2vw,29px)] font-semibold leading-[1.35] tracking-[-0.02em] text-white/95" style={KR}>
              {text}
            </p>
          </div>
        </div>
      </FadeUp>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      data-reveal="wait"
      className="relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 42% 40%, #0d1525 0%, #070b16 48%, #000 100%)' }}
    >
      {/* 도트 그리드 + 발견의 빛(accent 글로우 1곳 — 절제) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(58%_54%_at_45%_45%,#000_18%,transparent_86%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[30%] top-[45%] h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(closest-side,rgba(0,112,243,0.11),transparent)]"
      />

      {/* 모바일 — 풀폭 세로 스택 */}
      <div className="relative px-6 py-20 md:hidden">
        <RevealLine delay={0} className="mb-5">
          <span className="flex items-center gap-2">
            <EyebrowIcon size={20} />
            <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/45" style={{ fontFamily: 'var(--font-en)' }}>
              Philosophy
            </span>
          </span>
        </RevealLine>
        <h2
          className="text-[clamp(1.5rem,6vw,2.1rem)] font-bold leading-[1.3] tracking-[-0.04em] text-white"
          style={KR}
        >
          {headLines.map((line, i) => (
            <RevealLine key={line} delay={0.15 + i * 0.15}>
              <span dangerouslySetInnerHTML={{ __html: line }} />
            </RevealLine>
          ))}
        </h2>
        <div className="mt-10 divide-y divide-white/[0.1] border-y border-white/[0.1]">
          {[
            { logo: '/img/logo/nc.svg?v=16', name: '누구나 콘텐츠', text: '콘텐츠로 발견되고' },
            { logo: '/img/logo/na.svg?v=20', name: '누구나 광고', text: '광고로 고객을 만납니다' },
          ].map((d, i) => (
            <RevealLine key={d.name} delay={0.45 + i * 0.15}>
              <span className="flex items-center gap-4 py-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.logo} alt={`${d.name} 로고`} style={{ height: 52, width: 52, display: 'block' }} className="shrink-0" />
                <span className="block min-w-0">
                  <span className="mb-1.5 block text-[13px] font-semibold tracking-[-0.01em] text-white/55" style={KR}>
                    {d.name}
                  </span>
                  <span className="block text-[clamp(19px,5vw,24px)] font-semibold leading-[1.35] tracking-[-0.02em] text-white/95" style={KR}>
                    {d.text}
                  </span>
                </span>
              </span>
            </RevealLine>
          ))}
        </div>
      </div>

      {/* PC — 좌 헤딩 칸 / 우 선언 칸 (다크 그리드) */}
      <OccupancyGrid
        cols={12}
        rows={4}
        areas={D_AREAS}
        tone="dark"
        mobile={false}
        className="z-[1]"
        render={(key) =>
          key === 'head'
            ? headBlock
            : key === 'decl1'
              ? declCell('/img/logo/nc.svg?v=16', '누구나 콘텐츠', '콘텐츠로 발견되고', 0.08)
              : declCell('/img/logo/na.svg?v=20', '누구나 광고', '광고로 고객을 만납니다', 0.16)
        }
      />
    </section>
  );
}
