'use client';

import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
// 벽돌1 당선 = HeroB(빔 캔버스 진화 — 사장님 택1 2026-07-11). 구 HeroAurora는 원작 보존.
import HeroB from '@/components/styles/bricks/HeroB';
// 벽돌2 당선 = 두 제품 "장면"(로고+실사 폰 목업). 옛 ProductBranch(정적 카드)는 원작 보존.
import PhoneScene from '@/components/styles/bricks/PhoneScene';
import AdScene from '@/components/styles/bricks/AdScene';
import Philosophy from '@/components/home/Philosophy';
import PromiseTimeline from '@/components/home/PromiseTimeline';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <main>
      <OuterContainer>
        {/* S1 · 히어로 (사장님 작품 — 유지) */}
        <Section noBorder>
          <HeroB />
        </Section>

        {/* S2 · 두 제품 분기 (홈의 심장) = 벽돌2 두 장면(로고+실사 폰 목업) */}
        <Section noBorder>
          <PhoneScene />
        </Section>
        <Section noBorder>
          <AdScene />
        </Section>

        {/* S3 · 왜 만들었나 (라이트, 텍스트 전용) */}
        <Section>
          <Philosophy />
        </Section>

        {/* S4 · 회사 약속 = 변화대응·무료 업데이트 타임라인 */}
        <Section noBorder>
          <PromiseTimeline />
        </Section>

        {/* S5 · CTA */}
        <Section alt noBorder>
          <CTA />
        </Section>
      </OuterContainer>
    </main>
  );
}
