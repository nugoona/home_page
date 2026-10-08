import type { Metadata } from 'next';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import { SpacerRow } from '@/components/layout/OccupancyGrid';
import ContentHero from '@/components/content/ContentHero';
import { ContentChannels } from '@/components/content/S4Flow';
import {
  ContentS2, ContentS3, ContentS5Visual, ContentS7Visual,
  ContentS8Visual, ContentS9Grid, ContentS10Visual, ContentS11Cta, Eyebrow,
} from '@/components/content/ContentSections';

export const metadata: Metadata = {
  title: '누구나, 검색 결과에 내 가게가 바로 보이길 원합니다',
  description:
    '광고는 멈추면 사라지지만, 꾸준히 쌓은 글은 검색에 남아 가게를 계속 보이게 합니다. 그 꾸준함을, 누구나 콘텐츠가 대신합니다.',
};

/* ══════════════════════════════════════════════════════════════════
   /content — 섹션 리듬 통일(사장님 2026-07-18: "홈처럼, 제목 규격 통일")
   ① 전 섹션 경계 = SpacerRow(격자 한 줄) — 홈과 같은 구분 리듬(§8.16-C)
   ② 섹션 머리 = SectionHead 단일 규격 · 전부 좌측 정렬(홈 기준). 중앙은 CTA(S11)만.
   ③ 서브 = 2줄 이내 + text-balance(줄바꿈 너비 균형)
   ④ 배경 = 흰색 통일(alt 연회색 폐기 — 구분은 격자가 담당)
   ══════════════════════════════════════════════════════════════════ */

const WRAP = 'px-12 py-20 max-w-[1200px] mx-auto max-md:px-6 max-md:py-14';

/** 섹션 머리 통일 규격 — Eyebrow(✦) + 헤딩 + (선택) 서브. 좌측 정렬 고정. dark = 다크 밴드용 반전 */
function SectionHead({ eyebrow, heading, sub, dark }: { eyebrow: string; heading: React.ReactNode; sub?: React.ReactNode; dark?: boolean }) {
  return (
    <FadeUp>
      <Eyebrow label={eyebrow} dark={dark} />
      <h2 className={`text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.04em] leading-[1.26] text-balance ${dark ? 'text-white' : 'text-text-primary'}`}>
        {heading}
      </h2>
      {sub && (
        <p className={`mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance md:max-w-[680px] md:leading-[1.35] ${dark ? 'text-white/60' : 'text-[#4f4f4f]'}`}>
          {sub}
        </p>
      )}
    </FadeUp>
  );
}

export default function ContentPage() {
  return (
    <main>
      <OuterContainer>

        {/* ── S1 히어로 ── */}
        <Section noBorder>
          <ContentHero />
        </Section>
        <SpacerRow top />

        {/* ── S2 쌓임(BUILD-UP) ── */}
        <Section noBorder>
          <ContentS2 />
        </Section>
        <SpacerRow top />

        {/* ── S3 브리지(OVERVIEW) ── */}
        <Section noBorder>
          <ContentS3 />
        </Section>
        <SpacerRow top />

        {/* ── S4 채널(CHANNELS) — ★2026-10-09 사장님 확정: 폰 사진첩에서 고른 사진·영상이 블로그·인스타·쇼츠로(처음부터 무한 반복).
             구 회색 밴드 + 01→02→03 나열(ContentS4)은 "설명서 같다"로 교체 — /content2 비교 시안에만 남음 ── */}
        <Section noBorder>
          <ContentChannels />
        </Section>
        <SpacerRow top />

        {/* ── S5 노출 소식 반영(NEWS · 킬러) — 라이트 원복(사장님 2026-07-18 "뉴스는 라이트로".
             다크 네이티브 버전은 dark prop으로 보존 — S4 다크와 교체됨) ── */}
        <Section noBorder>
          <div className={WRAP}>
            {/* 2026-07-20 PC 개편: 좌 헤딩 레일 | 우 흐름도(구 중앙 좁은 흐름도+좌우 텅 해소). 모바일 세로 불변 */}
            <div className="grid grid-cols-[1fr_1.3fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
              <SectionHead
                eyebrow="News"
                heading={<>노출 방식이 바뀌어도<br />알아서 따라갑니다</>}
                sub="검색에 도움 되는 변화를 주 1회 모아 앞으로 쓰는 글에 반영합니다."
              />
              <FadeUp delay={0.1}>
                <ContentS5Visual />
              </FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── S7 순위 추적(TRACKING) ── */}
        <Section noBorder>
          <div className={WRAP}>
            {/* 2026-07-20 PC 개편: 좌 헤딩 레일 | 우 순위표(구 표 좌측+우측 절반 텅 해소 — 홈 S7 구조). 모바일 세로 불변 */}
            <div className="grid grid-cols-[1fr_1.25fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
              <SectionHead
                eyebrow="Tracking"
                heading={<>지금 몇 페이지 몇 위인지<br />정직하게 보여드립니다</>}
                sub="손님이 실제로 검색하는 말을 찾아 지금 어디에 있는지 매일 확인합니다."
              />
              <FadeUp delay={0.1}>
                <ContentS7Visual />
              </FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── S8 시작(START) ── */}
        <Section noBorder>
          <div className={WRAP}>
            {/* 위계 역전(사장님 2026-07-20 PC·모바일 공통): 메인 = "상호명만 넣어주세요"(행동),
                구 헤딩("가게 운영만으로도…")은 서브로 강등 */}
            <SectionHead
              eyebrow="Start"
              heading="상호명만 넣어주세요"
              sub="가게 운영만으로도 하루는 이미 벅찹니다."
            />
            <FadeUp delay={0.1}>
              <div className="mt-12 max-md:mt-8">
                <ContentS8Visual />
              </div>
            </FadeUp>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── S9 기능(FEATURES) — 회색 밴드(편집 리듬 매핑: 부가 기능 카탈로그 묶음 표시.
             페이지 유일의 회색. 내부 흰 목업 창이 회색 위에서 카드로 뜸) ── */}
        <Section noBorder>
          <div className="bg-[#eef0f3]">
            <div className={WRAP}>
              <SectionHead
                eyebrow="Features"
                heading="이 밖에도 필요한 기능을 담았습니다"
              />
              <div className="mt-12 max-md:mt-8">
                <ContentS9Grid />
              </div>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── S10 자산(ASSET) — ★2026-10-08 홈 S6 문법으로 재배치: 제목 위 + 아래 두 칸(블로그 | 유튜브, 가는 선 구분).
             구 [좌 제목 | 우 그림] 2단은 그림이 길어지며 제목 위아래가 비었다(사장님 "빈 여백은 있으면 안 돼") ── */}
        <Section noBorder>
          <div className="mx-auto max-w-[1200px] px-12 pb-12 pt-20 max-md:px-6 max-md:pb-10 max-md:pt-14">
            <SectionHead
              eyebrow="Asset"
              heading={<>서비스 이용이 끝나도<br />쌓인 콘텐츠는 그대로 남습니다</>}
              sub="발행된 글과 영상은 고객님의 계정에 쌓입니다."
            />
          </div>
          <div className="grid grid-cols-2 border-t border-[#ECECEC] max-md:grid-cols-1">
            <FadeUp delay={0.05} className="flex items-start justify-center px-12 py-14 max-md:px-6 max-md:py-10">
              <ContentS10Visual part="blog" />
            </FadeUp>
            <FadeUp delay={0.12} className="flex items-start justify-center border-l border-[#ECECEC] px-12 py-14 max-md:border-l-0 max-md:border-t max-md:px-6 max-md:py-10">
              <ContentS10Visual part="youtube" />
            </FadeUp>
          </div>
        </Section>
        <SpacerRow thin noMobileGrid />

        {/* ── S11 마감 CTA(다크) — 중앙 정렬은 여기만 ── */}
        <Section noBorder>
          <FadeUp>
            <ContentS11Cta />
          </FadeUp>
        </Section>

      </OuterContainer>
    </main>
  );
}
