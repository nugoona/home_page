import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import AdCanvasShowcase from '@/components/features/AdCanvasShowcase';
import DashboardShowcase, { PhoneMockup } from '@/components/features/DashboardShowcase';
import ChatbotShowcase from '@/components/features/ChatbotShowcase';
import TrendShowcase from '@/components/features/TrendShowcase';
import { hero, identity } from '@/lib/content/ads';

const EN = { fontFamily: 'var(--font-en)' } as const;

export const metadata: Metadata = {
  title: '누구나 광고 — AI 시대의 온라인 광고',
  description:
    '매출·광고·유입을 한 화면에 모아 사람 말로 읽어 줍니다. 광고 생성부터 성과 분석, 트렌드 추적까지 대행 없이 직접.',
};

/**
 * /ads — 누구나 광고 랜딩.
 * features의 3개 쇼케이스(AdCanvas·Dashboard·Trend)를 그대로 재활용 + '이해' 히어로/CTA.
 */
export default function AdsPage() {
  return (
    <main>
      <OuterContainer>
        {/* ── 히어로 (다크, '이해') ── */}
        <Section dark noBorder>
          <div
            className="relative py-32 px-12 text-center max-md:py-20 max-md:px-6"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a2050 0%, #0a0a0a 62%)' }}
          >
            {/* 필름 노이즈 — 그라데이션 밴딩 완화(§8.6, HeroAurora와 동일 fractalNoise) */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />
            <FadeUp className="relative z-10">
              <p className="text-[13px] max-md:text-[14px] font-semibold text-accent tracking-[0.08em] uppercase mb-5" style={EN}>
                누구나 광고
              </p>
              <h1
                className="text-[clamp(34px,6vw,60px)] font-semibold text-white tracking-[-0.04em] leading-[1.08] mb-6"
                dangerouslySetInnerHTML={{ __html: hero.h1 }}
              />
              <p className="text-[clamp(15px,1.8vw,18px)] max-md:text-[16px] text-white/55 leading-[1.65] max-w-[540px] mx-auto mb-10">
                {hero.sub}
              </p>
              <Link
                href={hero.cta.href}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0a0a0a] text-[15px] font-semibold tracking-[-0.02em] hover:bg-[#eaeaea] transition-colors"
              >
                {hero.cta.text}
                <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </Link>
              {hero.cta.sub && (
                <p className="text-[13px] max-md:text-[14px] text-white/40 mt-4">{hero.cta.sub}</p>
              )}
            </FadeUp>
          </div>
        </Section>

        {/* ── 정체 선언 (콜드 리드 게이트 — 히어로 다음, 첫 쇼케이스 전) ── */}
        <Section>
          <div className="py-20 px-12 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h2
                className="text-[clamp(24px,3.4vw,36px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.2] max-w-[640px] mx-auto mb-4"
                dangerouslySetInnerHTML={{ __html: identity.heading }}
              />
              <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.65] max-w-[560px] mx-auto">
                {identity.body}
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* ── features 쇼케이스 재활용 ── */}
        <AdCanvasShowcase />
        <DashboardShowcase />
        <ChatbotShowcase />
        <TrendShowcase />

        {/* ── 마감 CTA + 폰 목업 (구 모바일 섹션의 iPhone을 여기로 이식 — 주장 텍스트 없이 시각 자산만) ── */}
        <Section alt noBorder>
          <div
            className="px-12 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
          >
            {/* 984 = 표준 텍스트 그리드(세로선 스냅 2026-07-11) */}
            <div className="max-w-[984px] mx-auto grid grid-cols-[6fr_5fr] gap-12 items-center py-20 max-md:grid-cols-1 max-md:py-16 max-md:gap-10">
              <FadeUp>
                <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">
                  한 달, 카드 없이 먼저 써 보세요
                </h2>
                <p className="text-[15px] max-md:text-[16px] text-white/50 mb-10">약정도 카드도 없습니다. 스토어 이름만 입력하면 세팅해 드립니다.</p>
                <div className="flex gap-3 max-sm:flex-col">
                  <Link
                    href="/start"
                    className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#eaeaea] transition-all"
                  >
                    무료로 시작하기
                  </Link>
                  {/* 인라인 색 고정 — text-white 클래스가 이 a에서만 미적용되는 렌더 이슈(감독관 3차 실측 #333) 방어 */}
                  <Link
                    href="/content"
                    className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-transparent hover:bg-white/[0.06] transition-all max-sm:w-full max-sm:max-w-[320px]"
                    style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)' }}
                  >
                    노출이 먼저라면 →
                  </Link>
                </div>
              </FadeUp>
              <FadeUp delay={0.15} className="flex flex-col items-center gap-5 max-md:order-first">
                <PhoneMockup />
                <p className="text-[13px] max-md:text-[14px] text-white/40">외근 중에도, 이동 중에도 — 모바일에서 그대로.</p>
              </FadeUp>
            </div>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
