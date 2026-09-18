/* ══════════════════════════════════════════════════════════════════
   /ads2 — 광고 페이지 구간 순서 비교 시안 (2026-09-18) · 원본 /ads 무수정

   【무엇을 바꿨나 — 순서뿐】 개선안 §5.5가 정한 흐름으로 재배치했다:
     누구를 위한 서비스인지 → 광고 제작 → 통합 성과 → 질문
     → 자동 상품 목록·월간 리포트 → 시장 자료·판매 분석 → 시작 지원

   구 순서의 문제: **온보딩(계정 연결)이 3번째**라, 제품이 뭘 해주는지 보기도 전에
   "연결부터 해야 하는구나"가 먼저 왔다. 그리고 **통합 성과(대시보드)가 7번째**라
   광고를 만든 뒤 성과를 보는 흐름이 끊겼다.
   → 온보딩을 "시작 지원"으로 뒤로 보내고, 대시보드를 제작 바로 뒤로 올렸다.

   ⛔ 12구간 수를 줄이지 않았다 · 장면·카피를 바꾸지 않았다 · 가격표를 신설하지 않았다(§5.5 단서).
   블록을 통째로 옮겼을 뿐이라 각 구간 내부는 원본과 동일하다.
   ══════════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import { SpacerRow } from '@/components/layout/OccupancyGrid';
import { Eyebrow } from '@/components/content/ContentSections';
import { BackgroundBeams } from '@/components/lab-sources/aceternity/background-beams';
import AdsHero from '@/components/ads/AdsHero';
import { AdsAnswerScene, AdsTangle, AdsTangleGrid, AdsCanvasFlow, AdsChatScene, AdsChatGrid, AdsDashScene, AdsCatalogScene, AdsReportScene, AdsReportGrid, AdsMarketScene, AdsStoresScene, AdsEvolveScene, AdsEvolveGrid } from '@/components/ads/AdsSections';
import {
  empathy, identity, onboarding, adcanvas, chatbot,
  dashboard, report, market, multiStore, catalog, evolve, closing,
} from '@/lib/content/ads';

/* ══════════════════════════════════════════════════════════════════
   /ads — 리빌딩 1단계: 거친 전체 조립 v0 (2026-07-18, 사장님 승인 플로우)
   목적 = 13블록 확정 카피(ads.ts)를 /content 문법으로 세워 "전체 리듬·순서" 합의.
   ⚠ 목업 = 자리 표시(점선 칸). 실물 목업·히어로 궤도(레퍼런스 샷)는 2단계에서 §8.15 루프.
   구 쇼케이스 4종(AdCanvas·Dashboard·Chatbot·Trend) = 이 페이지에서 제거(순서·카피 불일치)
   — 컴포넌트 파일은 /features가 사용하므로 보존, 2단계에서 시각물만 발췌.
   ══════════════════════════════════════════════════════════════════ */

const WRAP = 'px-12 py-20 max-w-[1200px] mx-auto max-md:px-6 max-md:py-14';

/** 섹션 머리 — /content SectionHead와 동일 규격(통일성) */
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

/** 거친 조립용 목업 자리 표시 — 2단계에서 실물로 교체 */
function MockSlot({ label, h = 260 }: { label: string; h?: number }) {
  return (
    <div
      className="flex w-full max-w-[560px] items-center justify-center border border-dashed border-[#c6cbd4] bg-[#fafbfc] text-[13px] font-semibold text-[#8a919c]"
      style={{ height: h }}
      aria-hidden
    >
      목업 자리 · {label}
    </div>
  );
}

export default function AdsPreview() {
  return (
    <main>
      <OuterContainer>

        {/* ── 1 · 히어로 — 정본 좌표계(OccupancyGrid) 재구축(사장님 2026-07-18 "홈·콘텐츠 히어로 법칙대로") ── */}
        <Section dark noBorder>
          <AdsHero />
        </Section>
        <SpacerRow top />

        {/* ── 2 · 제품의 답(1-4-1) — 히어로 바로 밑(사장님 2026-07-18: 히어로가 연 궁금증에 제품 지도가 즉답) ── */}
        <Section noBorder>
          <div className={WRAP}>
            <SectionHead eyebrow="One place" heading={<span dangerouslySetInnerHTML={{ __html: identity.heading }} />} sub={identity.body} />
            <FadeUp delay={0.1}><div className="mt-10"><AdsAnswerScene /></div></FadeUp>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 5 · 광고 만들기 (애드캔버스) — 회색 밴드. 안1 "변환 파이프라인"(사장님 택1 2026-07-18):
             URL이 광고가 되는 원리를 단계별로 — 01 URL → 02 이미지 자동 수집 → 03 AI가 광고로 → 04 완성·게시
             + 하단 보조 = 구글도 같은 원리(Ad Strength). §8.15 아이디어 기준 1호 적용 ── */}
        <Section noBorder>
          <div className="bg-[#eef0f3]">
            <div className={WRAP}>
              {/* 처방3(2026-07-19): 모바일 = 첫 문장만. PC 정본(ads.ts adcanvas.body) 불변 */}
              <SectionHead eyebrow="AdCanvas" heading={adcanvas.heading} sub={<>상품 URL만 입력하면 메타 광고를 만들고 구글 광고도 상품에 맞게 준비합니다.<span className="max-md:hidden"> 확인과 게시는 직접 결정합니다.</span></>} />
              <FadeUp delay={0.1}>
                {/* 대주제 서브 ↔ 첫 매체 헤드 사이 여백 확대(사장님 2026-07-19 — 위계는 여백으로) */}
                <div className="mt-16 flex justify-center max-md:mt-12">
                  <AdsCanvasFlow />
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 7 · 한 화면 + 관리 ── */}
        <Section noBorder>
          <div className={WRAP}>
            {/* 처방3(2026-07-19): 모바일 = 첫 문장만. PC 정본(ads.ts dashboard.body) 불변 */}
            {/* manage 문장 = PC 서브 흡수(2026-07-20 ⑥) + 문장당 한 줄 3줄(사장님 지정 카피·줄바꿈 2026-07-20).
                모바일 = 기존 첫 문장만(처방3) */}
            {/* ★2026-09-18 "광고가 실제 매출로 이어졌는지도 확인" → 교체(개선안 §5.4 "광고와 매출의 관계").
                서로 다른 자료를 나란히 보여주는 것과 광고 효과의 인과관계를 입증하는 것은 다르다.
                앱이 하는 일 = 같은 기간의 쇼핑몰 매출과 Meta·Google 성과를 한 화면에 모아 보여주는 것. */}
            <SectionHead eyebrow="Dashboard" heading={dashboard.heading} sub={<>매출과 광고, 방문 데이터를 한 화면에서 함께 확인합니다.<span className="max-md:hidden"><br />쇼핑몰 매출과 광고 매체의 성과를 함께 살펴보세요.<br />{dashboard.manage}</span></>} />
            <FadeUp delay={0.1}>
              {/* 기존 파이프라인 목업 원작 그대로(사장님 2026-07-18) = DashboardShowcase.DataPipelineVisual */}
              <div className="mt-10"><AdsDashScene /></div>
              <p className="mt-5 max-w-[460px] text-[14px] font-medium leading-[1.6] text-text-body md:hidden">{dashboard.manage}</p>
            </FadeUp>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 6 · AI 챗봇 — PC = §8.16 2단(좌 레일 | 우 다크 챗, 2026-07-20 ⑤). 모바일 = 기존 불변 ── */}
        <Section noBorder>
          <AdsChatGrid />
          <div className="md:hidden">
            <div className={WRAP}>
              <SectionHead eyebrow="AI Chat" heading={chatbot.heading} sub={chatbot.body} />
              <FadeUp delay={0.1}>
                {/* 다크 챗 원작 그대로(사장님 2026-07-18) = ChatbotShowcase.ChatMock.
                    아래 보조 2줄(control·always)은 삭제(사장님 2026-07-18 — 목업이 이미 말함) */}
                <div className="mt-10"><AdsChatScene /></div>
              </FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 6.5 · 메타 카탈로그 자동 광고 — 챗봇 아래 신설(사장님 2026-07-19, 시안1 v8 확정).
             PC = 위 텍스트 + 아래 목업 전폭(대시보드 문법 — 사장님 2026-07-20 "2단에 꾸역꾸역 넣지 말고".
             구 좌 레일 2단(AdsCatalogGrid)은 폐기). 모바일 = 기존 세로 스택 그대로 ── */}
        <Section noBorder>
          <div className={WRAP}>
            {/* 라벨 = Meta Catalog(사장님 2026-07-20 — 메타에서만 적용되는 기능임을 명시) */}
            <SectionHead eyebrow="Meta Catalog" heading={catalog.heading} sub={catalog.body} />
            <FadeUp delay={0.1}>
              <div className="mt-10"><AdsCatalogScene uid="ctm" /></div>
            </FadeUp>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 8 · 월간 리포트 — PC = §8.16 2단(좌 레일+칩 세로 | 우 목업 확대, 2026-07-20 ②).
             모바일 = 기존 원형 그대로(md:hidden 분기) ── */}
        <Section noBorder>
          <div className="md:hidden">
            <div className={WRAP}>
              <SectionHead eyebrow="Report" heading={report.heading} sub={report.body} />
              {/* "또렷한 한 장(액션 플랜) + 페이지 스택" — 사장님 승인 2026-07-19 */}
              <FadeUp delay={0.1}><div className="mt-10 flex justify-center"><AdsReportScene /></div></FadeUp>
            </div>
          </div>
          <AdsReportGrid />
        </Section>
        <SpacerRow top />

        {/* ── 9 · 시장 흐름 — 회색 밴드(부가 카탈로그 묶음, /content S9 문법) ── */}
        <Section noBorder>
          <div className="bg-[#eef0f3]">
            <div className={WRAP}>
              <SectionHead eyebrow="Market" heading={market.heading} sub={market.body} />
              {/* "시장 무드보드" — 좌 리스트 + 우 상품 이미지 마퀴 2열(사장님 총력 지시 2026-07-19) */}
              <FadeUp delay={0.1}>
                <div className="mt-10"><AdsMarketScene /></div>
              </FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 10 · 여러 쇼핑몰 ── */}
        <Section noBorder>
          <div className={WRAP}>
            <SectionHead eyebrow="Stores" heading={<span dangerouslySetInnerHTML={{ __html: multiStore.heading }} />} sub={multiStore.body} />
            {/* "시트 → 대시보드" 변환 장면(A안, 사장님 2026-07-19) */}
            <FadeUp delay={0.1}><div className="mt-10 flex justify-center"><AdsStoresScene /></div></FadeUp>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── 3 · 걱정 마세요 + 온보딩(2+4 통합 — 사장님 2026-07-18: 문제→해결 한 쌍.
             그림 = 얽힌 연결망 리마스터(AdsTangle: 홈 보존 목업의 /ads 버전 — 칩 라벨·선 감축·Clone01 무대)
             카피 = 긍정 프레임 헤딩 + 매니지드 온보딩 확정 문구) ── */}
        <Section noBorder>
          {/* PC = §8.16 2단(좌 레일 헤딩+캡션 흡수 | 우 탱글, 2026-07-20 ④). 모바일 = 기존 불변 */}
          <AdsTangleGrid />
          <div className="md:hidden">
            <div className={WRAP}>
              <SectionHead eyebrow="Onboarding" heading={empathy.heading} sub={onboarding.body} />
              <FadeUp delay={0.1}>
                {/* (캡션 "시작을 어렵게 만든 건…" = 삭제 — 사장님 2026-07-20, PC·모바일 공통) */}
                <div className="relative mx-auto mt-8 aspect-[680/560] w-full max-w-[640px]">
                  {/* pc = 강화 애니 프리셋(등장 그리기+팝인+잔물결 2겹+태그 고정) — 모바일도 적용(사장님 2026-07-20) */}
                  <AdsTangle uid="ads-tangle" pc />
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ── (구 11 · 가격) ⛔ 폐지(사장님 2026-07-19) — 요금은 별도 페이지로 ── */}

        {/* ── 12 · 진화 선언 — PC = §8.16 2단(좌 헤딩+로그 레일 | 우 반원 460, 2026-07-20 ③).
             모바일 = 기존 세로 흐름 그대로(md:hidden 분기) ── */}
        <Section noBorder>
          <AdsEvolveGrid />
          <div className="md:hidden px-12 py-28 max-w-[1200px] mx-auto max-md:px-6 max-md:py-20">
            <SectionHead eyebrow="Evolve" heading={evolve.heading} sub={evolve.body} />
            {/* 세로 흐름(사장님 2026-07-19): "새로운 매체" 텍스트 바로 아래 목업(반폭·위성 확대) → 요청 항목 */}
            <FadeUp delay={0.1}>
              <div className="mt-10 max-w-[760px]">
                {/* 업데이트 로그 문법(홈 S7 리듬 + 다크 필 태그 — 사장님 승인 2026-07-19) */}
                <div className="pb-5">
                  <p className="flex items-center gap-2.5">
                    <span className="flex h-[20px] shrink-0 items-center bg-[#171717] px-1.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-white" style={{ fontFamily: 'var(--font-en)' }}>New Media</span>
                    <span className="text-[15px] font-bold tracking-[-0.01em] text-text-primary">{evolve.cards[0].title}</span>
                  </p>
                  <p className="mt-1.5 text-[13.5px] font-medium leading-[1.6] text-text-weak">{evolve.cards[0].body}</p>
                </div>
                <div className="w-[400px] max-w-full"><AdsEvolveScene /></div>
                <div className="mt-6 border-t border-[#ECECEC] pt-5">
                  <p className="flex items-center gap-2.5">
                    <span className="flex h-[20px] shrink-0 items-center bg-[#171717] px-1.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-white" style={{ fontFamily: 'var(--font-en)' }}>Update</span>
                    <span className="text-[15px] font-bold tracking-[-0.01em] text-text-primary">{evolve.cards[1].title}</span>
                  </p>
                  <p className="mt-1.5 text-[13.5px] font-medium leading-[1.6] text-text-weak">{evolve.cards[1].body}</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>
        <SpacerRow thin noMobileGrid />

        {/* ── 13 · 데모 + 마감 CTA (다크 — /content S11 문법. 중앙 정렬은 여기만) ── */}
        <Section noBorder>
          <FadeUp>
            <div className="relative overflow-hidden px-6 pb-36 pt-24 text-center max-md:px-5 max-md:pb-28 max-md:pt-16" style={{ backgroundColor: '#0a0a0a' }}>
              <BackgroundBeams className="opacity-70" />
              <div className="relative z-10">
              <h2 className="text-[clamp(28px,3.8vw,44px)] font-semibold leading-[1.18] tracking-[-0.035em] text-white">
                {closing.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-[420px] text-[15px] font-medium leading-[1.6] text-white/60">{closing.body}</p>
              {/* 버튼 = 히어로 CtaPair와 동일 규격(min-w 통일 — 사장님 2026-07-19 "/content와 동일하게, 너비도") */}
              <div className="mt-9 flex items-center justify-center gap-3 max-sm:flex-col">
                <Link href={closing.cta.href} className="rounded-pill inline-flex min-w-[196px] items-center justify-center gap-2 bg-white px-8 py-4 text-[15px] font-semibold text-[#0a0a0a] transition-colors hover:bg-[#eaeaea]">
                  {closing.cta.text}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M6 4l4 4-4 4" /></svg>
                </Link>
                <Link
                  href={closing.ctaSecondary.href}
                  className="rounded-pill inline-flex min-w-[196px] items-center justify-center px-8 py-4 text-[15px] font-semibold transition-all hover:bg-white/[0.06]"
                  style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)' }}
                >
                  {closing.ctaSecondary.text}
                </Link>
              </div>
              <p className="mt-10 text-[14px] font-medium text-white/55">
                {closing.crossSell.text}{' '}
                <Link href={closing.crossSell.cta.href} className="font-bold text-white underline underline-offset-4">
                  {closing.crossSell.cta.text}
                </Link>
              </p>
              </div>
            </div>
          </FadeUp>
        </Section>

      </OuterContainer>
    </main>
  );
}
