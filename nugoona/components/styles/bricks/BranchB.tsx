'use client';

/* ═══════════════════════════════════════════════════════════════
   벽돌2 · 홈 분기 카드 — 시안 B "히어로 빔의 착지"

   컨셉: HeroB(벽돌1 당선작)의 두 제품색 빔(콘텐츠 그린 #2fd46b · 광고 블루 #3e8bff)이
   이 섹션까지 시각적으로 이어져, 하나의 줄기(시스템)에서 두 갈래로 갈라져 각 카드
   상단에 "착지"하는 연출. 상단은 히어로와 동일한 다크 배경(격자 크로스헤어·노이즈 계승)
   으로 시작해, 빔이 착지하는 지점에서 다크→라이트로 전환되며 카드가 이어받는다.

   좌표계: 빔 SVG(viewBox 1080×140)와 카드 그리드(max-w-1080, grid-cols-2, gap-6)가
   동일한 `max-w-[1080px] mx-auto px-12` 박스를 공유 — 착지 x좌표(264/816)가
   카드 중심(≈25%/75%)과 시각적으로 정확히 겹친다.

   문법 출처(재사용): S9_ChannelFanout — 줄기→분배→가지 3단 motion.line pathLength 드로잉
   / DataPipeline — 드로잉 완료 후 이어지는 무한 loop animateMotion 도트(핵+글로우 2겹)
   / HeroB — 다크 그라디언트·grid-crosshair·aurora-noise·두 제품색.
   ═══════════════════════════════════════════════════════════════ */

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import { branch } from '@/lib/content/home';
import SearchResultMock from '@/components/content/SearchResultMock';
import DashboardGlimpse from '@/components/home/DashboardGlimpse';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const GREEN = '#2fd46b'; // 콘텐츠
const BLUE = '#3e8bff';  // 광고

/* 데스크톱 빔 좌표(viewBox 1080×140) — 카드 그리드(max-w-1080·gap-6·2열)와 동일 좌표계.
   좌카드 중심 ≈ 264(24.4%), 우카드 중심 ≈ 816(75.6%) — 착지점이 카드 중심과 겹친다. */
const D_W = 1080, D_H = 140, D_BRANCH_Y = 36;
const D_LEFT_X = 264, D_RIGHT_X = 816;
const D_LEFT_PCT = (D_LEFT_X / D_W) * 100;
const D_RIGHT_PCT = (D_RIGHT_X / D_W) * 100;

/* 모바일 빔 — 카드가 세로 스택되므로 카드 폭에 종속시키지 않고, 중앙의 상징적
   "Y분기" 아이콘(너비 160px 고정)으로 압축한다. 착지 후 두 카드는 각자의 상단
   accent 라인(그린/블루)으로 같은 색을 이어받는다. */
const M_W = 200, M_H = 84, M_BRANCH_Y = 24;
const M_LEFT_X = 56, M_RIGHT_X = 144;
const M_LEFT_PCT = (M_LEFT_X / M_W) * 100;
const M_RIGHT_PCT = (M_RIGHT_X / M_W) * 100;

const STEM = { duration: 0.5, ease: EASE } as const;
const LINE_BASE = { strokeWidth: 1.5, vectorEffect: 'non-scaling-stroke' as const, fill: 'none' as const };

/** 착지 도트 — 정지 코어(accent 원) + 착지 후 반복되는 확산 링. xPct는 부모 기준 %. */
function LandingDot({ xPct, color, delay }: { xPct: number; color: string; delay: number }) {
  return (
    <>
      <motion.span
        aria-hidden
        className="absolute rounded-dot pointer-events-none"
        style={{ left: `${xPct}%`, bottom: 0, width: 8, height: 8, marginLeft: -4, marginBottom: -4, background: color }}
        initial={{ scale: 0.8, opacity: 0.55 }}
        animate={{ scale: [0.8, 2.4], opacity: [0.55, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeOut', delay: delay + 0.35 }}
      />
      <motion.span
        aria-hidden
        className="absolute rounded-dot pointer-events-none"
        style={{ left: `${xPct}%`, bottom: 0, width: 6, height: 6, marginLeft: -3, marginBottom: -3, background: color, boxShadow: `0 0 10px 2px ${color}` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE, delay }}
      />
    </>
  );
}

/** 데스크톱 빔: 줄기(중립) → 그린/블루 두 가지로 분기 → 카드로 하강. */
function DesktopBeams({ inView }: { inView: boolean }) {
  const midX = D_W / 2;
  const greenFlow = `M${midX},0 V${D_BRANCH_Y} H${D_LEFT_X} V${D_H}`;
  const blueFlow = `M${midX},0 V${D_BRANCH_Y} H${D_RIGHT_X} V${D_H}`;

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${D_W} ${D_H}`} preserveAspectRatio="none">
      <defs>
        <path id="branchb-flow-g-d" d={greenFlow} />
        <path id="branchb-flow-b-d" d={blueFlow} />
      </defs>

      {/* 줄기 — 하나의 시스템(누구나) */}
      <motion.line x1={midX} y1={0} x2={midX} y2={D_BRANCH_Y} {...LINE_BASE} stroke="rgba(255,255,255,0.35)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.1 }} />

      {/* 그린 가지 — 콘텐츠 */}
      <motion.line x1={midX} y1={D_BRANCH_Y} x2={D_LEFT_X} y2={D_BRANCH_Y} {...LINE_BASE} stroke={GREEN} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.35 }} />
      <motion.line x1={D_LEFT_X} y1={D_BRANCH_Y} x2={D_LEFT_X} y2={D_H} {...LINE_BASE} stroke={GREEN} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.55 }} />

      {/* 블루 가지 — 광고 */}
      <motion.line x1={midX} y1={D_BRANCH_Y} x2={D_RIGHT_X} y2={D_BRANCH_Y} {...LINE_BASE} stroke={BLUE} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.35 }} />
      <motion.line x1={D_RIGHT_X} y1={D_BRANCH_Y} x2={D_RIGHT_X} y2={D_H} {...LINE_BASE} stroke={BLUE} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.55 }} />

      {/* 드로잉 완료 후 — 순환 도트(핵 + 글로우), 시스템이 계속 살아있음을 암시 */}
      {inView && (
        <>
          <circle r="8" fill={GREEN} opacity="0.18">
            <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite"><mpath href="#branchb-flow-g-d" /></animateMotion>
          </circle>
          <circle r="3" fill={GREEN}>
            <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite"><mpath href="#branchb-flow-g-d" /></animateMotion>
          </circle>
          <circle r="8" fill={BLUE} opacity="0.18">
            <animateMotion dur="2.6s" begin="1.15s" repeatCount="indefinite"><mpath href="#branchb-flow-b-d" /></animateMotion>
          </circle>
          <circle r="3" fill={BLUE}>
            <animateMotion dur="2.6s" begin="1.15s" repeatCount="indefinite"><mpath href="#branchb-flow-b-d" /></animateMotion>
          </circle>
        </>
      )}
    </svg>
  );
}

/** 모바일 빔 — 압축된 상징 Y분기(카드 폭과 무관, 중앙 아이콘). */
function MobileBeams({ inView }: { inView: boolean }) {
  const midX = M_W / 2;
  const greenFlow = `M${midX},0 V${M_BRANCH_Y} H${M_LEFT_X} V${M_H}`;
  const blueFlow = `M${midX},0 V${M_BRANCH_Y} H${M_RIGHT_X} V${M_H}`;

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${M_W} ${M_H}`} preserveAspectRatio="none">
      <defs>
        <path id="branchb-flow-g-m" d={greenFlow} />
        <path id="branchb-flow-b-m" d={blueFlow} />
      </defs>

      <motion.line x1={midX} y1={0} x2={midX} y2={M_BRANCH_Y} {...LINE_BASE} stroke="rgba(255,255,255,0.35)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.1 }} />

      <motion.line x1={midX} y1={M_BRANCH_Y} x2={M_LEFT_X} y2={M_BRANCH_Y} {...LINE_BASE} stroke={GREEN} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.32 }} />
      <motion.line x1={M_LEFT_X} y1={M_BRANCH_Y} x2={M_LEFT_X} y2={M_H} {...LINE_BASE} stroke={GREEN} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.5 }} />

      <motion.line x1={midX} y1={M_BRANCH_Y} x2={M_RIGHT_X} y2={M_BRANCH_Y} {...LINE_BASE} stroke={BLUE} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.32 }} />
      <motion.line x1={M_RIGHT_X} y1={M_BRANCH_Y} x2={M_RIGHT_X} y2={M_H} {...LINE_BASE} stroke={BLUE} strokeOpacity={0.6}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...STEM, delay: 0.5 }} />

      {inView && (
        <>
          <circle r="6" fill={GREEN} opacity="0.18">
            <animateMotion dur="2.2s" begin="0.8s" repeatCount="indefinite"><mpath href="#branchb-flow-g-m" /></animateMotion>
          </circle>
          <circle r="2.5" fill={GREEN}>
            <animateMotion dur="2.2s" begin="0.8s" repeatCount="indefinite"><mpath href="#branchb-flow-g-m" /></animateMotion>
          </circle>
          <circle r="6" fill={BLUE} opacity="0.18">
            <animateMotion dur="2.2s" begin="1.0s" repeatCount="indefinite"><mpath href="#branchb-flow-b-m" /></animateMotion>
          </circle>
          <circle r="2.5" fill={BLUE}>
            <animateMotion dur="2.2s" begin="1.0s" repeatCount="indefinite"><mpath href="#branchb-flow-b-m" /></animateMotion>
          </circle>
        </>
      )}
    </svg>
  );
}

export default function BranchB() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // hidden(display:none) 요소는 IntersectionObserver가 절대 감지하지 못하므로,
  // md:hidden/hidden md:block로 갈라지는 두 빔 자식이 아니라 "항상 렌더되는" 이 래퍼에 건다.
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <div className="relative bg-white overflow-hidden">
      {/* ── 다크 밴드: 히어로 연장(격자 크로스헤어·노이즈 계승) + 빔 분기 ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 15%, #0d1525 0%, #060a15 45%, #05070d 100%)' }}
      >
        <div className="aurora-noise" />
        {/* 히어로 문법 계승 — 옅은 코너 크로스헤어 2개(데스크톱만) */}
        <div className="grid-crosshair hidden md:block" style={{ top: '20%', left: '3%' }} />
        <div className="grid-crosshair hidden md:block" style={{ top: '20%', left: '97%' }} />

        <div ref={sectionRef} className="relative z-10 max-w-[1080px] mx-auto px-12 max-md:px-6">
          <FadeUp>
            <div className="text-center pt-20 pb-3 max-md:pt-14 max-md:pb-2">
              <h2
                className="text-[clamp(28px,4vw,40px)] font-semibold text-white tracking-[-0.03em] leading-[1.15] mb-4"
                dangerouslySetInnerHTML={{ __html: branch.title }}
              />
              <p className="text-[16px] max-md:font-medium text-white/55">{branch.sub}</p>
            </div>
          </FadeUp>

          {/* 데스크톱 빔 — 카드 그리드와 동일 좌표계, 착지점이 카드 중심에 겹친다 */}
          <div className="hidden md:block relative" style={{ height: D_H }}>
            <DesktopBeams inView={inView} />
            <LandingDot xPct={D_LEFT_PCT} color={GREEN} delay={0.85} />
            <LandingDot xPct={D_RIGHT_PCT} color={BLUE} delay={1.1} />
          </div>

          {/* 모바일 빔 — 상징적 Y분기 아이콘(중앙 고정폭) */}
          <div className="md:hidden flex justify-center pt-2 pb-7">
            <div className="relative" style={{ width: M_W - 40, height: M_H }}>
              <MobileBeams inView={inView} />
              <LandingDot xPct={M_LEFT_PCT} color={GREEN} delay={0.75} />
              <LandingDot xPct={M_RIGHT_PCT} color={BLUE} delay={0.95} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 카드 — 라이트, 빔 착지를 상단 accent 라인으로 이어받는다 ── */}
      <div className="max-w-[1080px] mx-auto px-12 max-md:px-6">
        <div className="grid grid-cols-2 gap-6 pt-0 pb-24 max-md:grid-cols-1 max-md:gap-5 max-md:pt-0 max-md:pb-16">
          {branch.cards.map((c, i) => {
            const color = i === 0 ? GREEN : BLUE;
            return (
              <FadeUp key={c.href} delay={i * 0.1}>
                <Link
                  href={c.href}
                  className="group flex flex-col h-full border border-border-default bg-white overflow-hidden transition-all duration-300 hover:border-border-hover hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                  style={{ borderTop: `2px solid ${color}` }}
                >
                  {/* 미니 목업 (상단 크롭) — SearchResultMock/DashboardGlimpse 재활용 */}
                  <div className="relative h-[248px] overflow-hidden bg-bg-alt border-b border-border-default max-md:h-[220px]">
                    <div className="absolute left-6 right-6 top-7 transition-transform duration-300 ease-out group-hover:-translate-y-2">
                      {c.mock === 'search' ? (
                        <SearchResultMock />
                      ) : (
                        <div className="origin-top scale-[0.78] -mt-2 max-md:scale-[0.8] max-md:-mt-1">
                          <DashboardGlimpse />
                        </div>
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-alt to-transparent" />
                  </div>

                  {/* 텍스트 */}
                  <div className="p-7 flex flex-col flex-1 max-md:p-6">
                    <p className="flex items-center gap-1.5 text-[11px] max-md:text-[12px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3" style={EN}>
                      <span className="rounded-dot inline-block shrink-0" style={{ width: 5, height: 5, background: color }} />
                      {c.eyebrow}
                    </p>
                    <h3
                      className="text-[clamp(20px,2.4vw,26px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3"
                      dangerouslySetInnerHTML={{ __html: c.title }}
                    />
                    <p className="text-[14px] max-md:font-medium text-text-body leading-[1.65] mb-6 flex-1">{c.desc}</p>
                    <span
                      className="inline-flex items-center gap-1.5 text-[14px] font-medium group-hover:gap-2.5 transition-[gap] duration-150"
                      style={{ color }}
                    >
                      {c.cta}
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 4l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </div>
  );
}
