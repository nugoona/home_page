'use client';

import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import { SpacerRow } from '@/components/layout/OccupancyGrid';
// 벽돌1 당선 = HeroB(빔 캔버스 진화 — 사장님 택1 2026-07-11). 구 HeroAurora는 원작 보존.
import HeroB from '@/components/styles/bricks/HeroB';
// S4 = Vercel 좌 레일+우 스택 통합(2026-07-15). 구 PhoneScene·AdScene·TwoAppsHeader는 원작 보존.
import TwoAppsRail from '@/components/home/s4/TwoAppsRail';
// S2Concept1(복잡한 시작)은 홈에서 제외(2026-07-15) — /ads 도입부 이식 대기(컴포넌트 보존)
// S3 당선 = 광고 자동 처리 파이프라인(①②③ + 녹색 ✓ + AdChatMock 문답, 2026-07-14). 구 OurWayFlow는 원작 보존.
import S3GraphicA from '@/components/home/s3/S3GraphicA';
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
        {/* ── 최종 섹션 순서(사장님 확정 2026-07-15): 히어로 → 회사 정의+두 제품 → 철학 → 자산
             → OUR WAY → 복잡한 시작 → 업데이트 → CTA ── */}

        {/* 1 · 히어로 */}
        <Section noBorder>
          <HeroB />
        </Section>

        {/* ── 섹션 경계마다 여백 줄(SpacerRow) — §8.16-C 필수 ── */}
        <SpacerRow />

        {/* 2~4 · 회사 정의 + 누구나 콘텐츠 + 누구나 광고 (한 좌표계) */}
        <Section noBorder>
          <TwoAppsRail />
        </Section>

        <SpacerRow />

        {/* 5 · 회사 철학 — 좋은 가게는 고객을 만날 기회가 (다크) */}
        <Section noBorder>
          <BrandPhilosophySection />
        </Section>

        <SpacerRow />

        {/* 6 · 자산 — 남는 것은 사장님의 것 */}
        <Section noBorder>
          <S6AssetStacks />
        </Section>

        <SpacerRow />

        {/* 7 · OUR WAY — 어려운 건 앱이, 확인은 고객님이 */}
        {/* ★2026-10-08 사장님 승인(B안) — both: 궤도 항목 절반을 콘텐츠로(추천 글감·목표 검색어·자료 정리),
            모바일 선언도 "고객님은 확인하고 결정만 하세요"로. 홈은 두 제품을 함께 파는 자리인데
            설명만 두 제품을 말하고 그림은 광고만 말하던 어긋남을 없앴다(대본 합의안①의 나머지 절반). */}
        <Section noBorder>
          <S3GraphicA both />
        </Section>

        {/* (구 · 복잡한 시작 = 홈에서 제외 — /ads 도입부로 이식 예정, 사장님 2026-07-15 "중복") */}

        {/* thin = 세로선 없는 얇은 무지대(사장님 2026-07-15 "세로선 비우고 폭 낮춰 두 줄처럼") */}
        <SpacerRow thin />

        {/* 8 · 업데이트 — 필요한 기능은 계속 더해집니다 (다크) */}
        <Section noBorder>
          <S7UpdatePairs />
        </Section>

        {/* CTA 위 = 칸칸이 빼고 얇은 줄(사장님 2026-07-16 "공간 차지해 붕 떠") */}
        <SpacerRow thin noMobileGrid />

        {/* 9 · CTA (Clone07 다크 패널) */}
        <Section alt noBorder>
          <S8CtaDark />
        </Section>
      </OuterContainer>
    </main>
  );
}
