'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import { branch } from '@/lib/content/home';
import SearchResultMock from '@/components/content/SearchResultMock';
import DashboardGlimpse from '@/components/home/DashboardGlimpse';

/* ═══════════════════════════════════════════════════════════════
   벽돌2 · 홈 분기 카드 — C안 "정밀 카드 개선" (안전한 대조군)
   현행 ProductBranch(2열 카드)를 유지하되 정밀화한다. 새 컴포넌트를 발명하지 않고
     ① 헤딩·카드를 같은 1080 컨테이너에 묶어 좌우 에지를 정렬(기존엔 헤딩만 별도 폭이었음)
     ② 카드 그리드에 스크롤 진입 stagger(컨테이너→카드→목업 3단 지연) 적용
     ③ 두 제품색(콘텐츠 그린 #2fd46b · 광고 블루 #3e8bff)을 상단 아이라인·eyebrow 닷·
       hover 글로우·코너 틱(HeroB 코너 브래킷 문법의 축소판)으로 절제되게 포인트
     ④ 여백·패딩을 4px 배수로 통일(§8.9)해 리듬을 정돈
   목업(SearchResultMock·DashboardGlimpse)은 원본 그대로 재활용 — 소비자 이해 문법
   (실제 화면)을 훼손하지 않는다.
   ═══════════════════════════════════════════════════════════════ */

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* 두 제품색 — 벽돌1(HeroB) 당선 문법 그대로 계승 */
const PRODUCT_COLOR: Record<string, string> = {
  search: '#2fd46b', // 콘텐츠
  dashboard: '#3e8bff', // 광고
};
const PRODUCT_RGB: Record<string, string> = {
  search: '47,212,107',
  dashboard: '62,139,255',
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const mockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.12 } },
};

/** 코너 틱 — 목업 상단 모서리에 얹는 정밀 시스템 표식(HeroB 코너 브래킷 문법의 라이트·축소판).
 *  평소엔 숨어 있다가 hover 시에만 드러나 "정밀함"을 과장 없이 암시한다. */
function CornerTick({ color, side }: { color: string; side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-3 ${side === 'left' ? 'left-3 border-l' : 'right-3 border-r'} border-t w-2.5 h-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-80`}
      style={{ borderColor: color }}
    />
  );
}

export default function BranchC() {
  return (
    <div className="py-24 px-6 max-md:py-14 max-md:px-5">
      {/* 헤딩·카드가 같은 1080 컨테이너를 공유 — 좌우 에지 정렬(그리드 정밀 규칙) */}
      <div className="max-w-[1080px] mx-auto">
        <FadeUp>
          <div className="text-center mb-16 max-md:mb-10">
            <h2
              className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-4"
              dangerouslySetInnerHTML={{ __html: branch.title }}
            />
            <p className="text-[16px] max-md:font-medium text-text-body">{branch.sub}</p>
          </div>
        </FadeUp>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={gridVariants}
          className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-4"
        >
          {branch.cards.map((c) => {
            const color = PRODUCT_COLOR[c.mock] ?? '#171717';
            const rgb = PRODUCT_RGB[c.mock] ?? '23,23,23';
            return (
              <motion.div key={c.href} variants={cardVariants}>
                <Link
                  href={c.href}
                  className="group relative flex flex-col h-full border border-border-default bg-white overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-border-hover"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 24px 60px rgba(${rgb},0.16), 0 4px 16px rgba(0,0,0,0.06)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* 상단 아이라인 — 제품색 절제 포인트(항상 은은히, hover 시 또렷) */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-55 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: color }}
                  />

                  {/* 미니 목업 (상단 크롭, 실물 화면 재활용) */}
                  <div className="relative h-[256px] overflow-hidden bg-bg-alt border-b border-border-default max-md:h-[224px]">
                    <CornerTick color={color} side="left" />
                    <CornerTick color={color} side="right" />
                    <motion.div
                      variants={mockVariants}
                      className="absolute left-6 right-6 top-7 transition-transform duration-300 ease-out group-hover:-translate-y-2"
                    >
                      {c.mock === 'search' ? (
                        <SearchResultMock />
                      ) : (
                        <div className="origin-top scale-[0.78] -mt-2 max-md:scale-[0.8] max-md:-mt-1">
                          <DashboardGlimpse />
                        </div>
                      )}
                    </motion.div>
                    {/* 하단 페이드 */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-alt to-transparent" />
                  </div>

                  {/* 텍스트 */}
                  <div className="p-7 flex flex-col flex-1 max-md:p-6">
                    <p
                      className="flex items-center gap-2 text-[11px] max-md:text-[12px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3"
                      style={EN}
                    >
                      <span className="rounded-dot w-1.5 h-1.5" style={{ background: color }} aria-hidden />
                      {c.eyebrow}
                    </p>
                    <h3
                      className="text-[clamp(20px,2.4vw,26px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3"
                      dangerouslySetInnerHTML={{ __html: c.title }}
                    />
                    <p className="text-[14px] max-md:font-medium text-text-body leading-[1.65] mb-6 flex-1">{c.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[14px] text-accent font-medium group-hover:gap-2.5 transition-[gap] duration-150">
                      {c.cta}
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 4l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
