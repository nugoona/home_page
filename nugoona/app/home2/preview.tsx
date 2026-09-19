'use client';

/* ══════════════════════════════════════════════════════════════════
   /home2 — 메인 비교 시안 (2026-09-18) · 원본 `/` 무수정

   【무엇을 바꿨나 — 세 가지】
   ① OUR WAY "어려운 건 앱이 합니다"를 **두 앱 공통**으로 (개선안 §3.3)
      구 화면은 궤도 칩이 전부 광고 용어(계정 연결·픽셀·캠페인·예산·타깃·소재)였고
      설명도 "**광고를** 시작하기 위한", 선언도 "광고 소재와 성과만 보세요"였다.
      → 콘텐츠 고객에게는 남의 얘기였다. 칩 절반을 콘텐츠 준비로 바꾸고 문장을 공통으로.
      ⛔ 자동화 범위를 넓히지 않았다 — 전부 "준비" 단계이고 결정은 다음 칸이 받는다
         (§3.3 "광고 예산 자동 변경이나 모든 영상의 자동 승인을 약속해서는 안 된다").
      구현 = 기존 컴포넌트에 `both` 선택 인자. 기본 false라 원본 홈은 그대로다.

   ② 콘텐츠 순환을 **기존 제품 블록 안에** 흡수 (개선안 §3.4)
      구 홈은 콘텐츠 3단계가 "올리면 → 글이 되고 → 검색 위치 확인"에서 끝났다.
      §3.4가 "마지막 두 단계(검색 위치 확인 → 다음 콘텐츠 반영)가 단순 글 작성 도구와의
      차이"라 했는데 **'다음 콘텐츠에 반영'이 화면에 없었다.**
      → 별도 구간을 새로 만들지 않고 캐러셀에 04를 붙였다(§3.4 "기존 콘텐츠 소개 가까이에 흡수").

   ③ 업로드 장면에 **영상 칸**(개선안 §3.2) — 왼쪽 카피는 이미 "찍어둔 사진과 영상이"인데
      그림은 사진 4장뿐이었다. 격자 네 번째 칸에 재생 표시. 앱 지도 44번으로 확인:
      "글 쓰는 화면은 권한 없이 영상을 받고, 그 영상은 쇼츠가 아니라 글 본문의 움직이는 사진이 된다."

   ⚠ ②의 구현이 2026-09-19에 바뀌었다 — 처음엔 03 목업 **아래** 한 줄로 붙였는데
      DESIGN §7-9가 "목업 아래 단독 한 줄(캡션·메타·칩) 금지"로 막는다(사장님 반복 지적).
      같은 절이 정한 해법대로 **섹션 카피(TwoAppsRail NC desc)에 흡수**했다.

   🛑 나머지 구간은 원본 그대로 가져다 쓴다. 새 상자·새 설명 문단을 만들지 않았다.
   ══════════════════════════════════════════════════════════════════ */

import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import { SpacerRow } from '@/components/layout/OccupancyGrid';
import HeroB from '@/components/styles/bricks/HeroB';
import TwoAppsRail from '@/components/home/s4/TwoAppsRail';
import BrandPhilosophySection from '@/components/home/BrandPhilosophySection';
import S6AssetStacks from '@/components/home/s6/S6AssetStacks';
import S3GraphicA from '@/components/home/s3/S3GraphicA';
import S7UpdatePairs from '@/components/home/s7/S7UpdatePairs';
import S8CtaDark from '@/components/home/s8/S8CtaDark';
import { homePreview } from '@/lib/content/home';

export default function HomePreview() {
  return (
    <main>
      <OuterContainer>
        {/* 시안 표시 한 줄 — 원본에는 없다 */}
        <div className="flex items-center justify-between gap-4 border-b border-border-default px-8 py-3 text-[12px] text-text-weak max-md:px-5">
          <span>비교 시안 · 메인</span>
          <a href="/" className="underline underline-offset-4">기존 페이지 보기</a>
        </div>

        <Section noBorder><HeroB content={homePreview.hero} /></Section>
        <SpacerRow />

        {/* ② 콘텐츠 순환 — 캐러셀에 04 "다음 콘텐츠에 반영" 추가 */}
        <Section noBorder><TwoAppsRail video refined /></Section>
        <SpacerRow />

        <Section noBorder><BrandPhilosophySection /></Section>
        <SpacerRow />

        <Section noBorder><S6AssetStacks /></Section>
        <SpacerRow />

        {/* ① OUR WAY — 두 앱 공통 흐름 */}
        <Section noBorder><S3GraphicA both /></Section>
        <SpacerRow thin />

        <Section noBorder><S7UpdatePairs /></Section>
        <SpacerRow thin noMobileGrid />

        <Section alt noBorder><S8CtaDark /></Section>
      </OuterContainer>
    </main>
  );
}
