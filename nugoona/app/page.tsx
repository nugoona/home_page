'use client';

import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
// 벽돌1 당선 = HeroB(빔 캔버스 진화 — 사장님 택1 2026-07-11). 구 HeroAurora는 원작 보존.
import HeroB from '@/components/styles/bricks/HeroB';
// 벽돌2 당선 = 두 제품 "장면"(로고+실사 폰 목업). 옛 ProductBranch(정적 카드)는 원작 보존.
import PhoneScene from '@/components/styles/bricks/PhoneScene';
import AdScene from '@/components/styles/bricks/AdScene';
import S2Concept1 from '@/components/home/s2/S2Concept1';
// S3 당선 = 광고 자동 처리 파이프라인(①②③ + 녹색 ✓ + AdChatMock 문답, 2026-07-14). 구 OurWayFlow는 원작 보존.
import S3GraphicA from '@/components/home/s3/S3GraphicA';
import TwoAppsHeader from '@/components/home/TwoAppsHeader';
// S6 당선 = 두 자산 스택(브라우저 창 글 스택 + 월별 리포트 스택, 2026-07-14). 구 AssetSection은 원작 보존.
import S6AssetStacks from '@/components/home/s6/S6AssetStacks';
// S7 당선 = 변화→대응 페어 타임라인(2026-07-14). 구 UpdateSection은 원작 보존.
import S7UpdatePairs from '@/components/home/s7/S7UpdatePairs';
import BrandPhilosophySection from '@/components/home/BrandPhilosophySection';
// S8 당선 = Clone07 다크 패널 CTA(2026-07-14). 구 CTA는 원작 보존.
import S8CtaDark from '@/components/home/s8/S8CtaDark';

export default function Home() {
  return (
    <main>
      <OuterContainer>
        {/* S1 · 히어로 */}
        <Section noBorder>
          <HeroB />
        </Section>

        {/* S2 · WHY — 복잡한 시작 (시안1 얽힌 연결망 확정 2026-07-13) */}
        <Section noBorder>
          <S2Concept1 />
        </Section>

        {/* S4 · 두 개의 앱 (섹션헤드 + 콘텐츠 장면 + 광고 장면) */}
        <Section noBorder>
          <TwoAppsHeader />
        </Section>
        <Section noBorder>
          <PhoneScene />
        </Section>
        <Section noBorder>
          <AdScene />
        </Section>

        {/* S3 → 광고 장면 아래로 이동(사장님 2026-07-14) · 우리의 방식 — 궤도 자동 처리 + 말풍선 확인 */}
        <Section noBorder>
          <S3GraphicA />
        </Section>

        {/* S5 · 회사 철학 — 좋은 가게는 발견될 기회가 (다크 시안) */}
        <Section noBorder>
          <BrandPhilosophySection />
        </Section>

        {/* S6 · 자산 — 남는 것은 사장님의 것 (두 자산 스택: 계정 글 쌓임 + 리포트 쌓임) */}
        <Section noBorder>
          <S6AssetStacks />
        </Section>

        {/* S7 · 업데이트 — 매체가 바뀌면 앱도 (변화→대응 페어 타임라인, 다크) */}
        <Section noBorder>
          <S7UpdatePairs />
        </Section>

        {/* S8 · CTA (Clone07 다크 패널) */}
        <Section alt noBorder>
          <S8CtaDark />
        </Section>
      </OuterContainer>
    </main>
  );
}
