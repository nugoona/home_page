'use client';

/* ══════════════════════════════════════════════════════════════════
   /content2 — 기존 /content 기준 비교 시안 (3차, 2026-09-18)

   【사장님 재지적 — 이전 두 시안 모두 불채택】
     "텍스트가 좋다고 해서 읽히는 게 아니야."
     "홈페이지라는 거는 이렇게 텍스트가 많아버리고 그다음에 정보 전달이 제대로 하나도 안 돼."
     "내가 분명히 텍스트 꾸역꾸역은 지적을 했는데."
   → 코덱스 1차(67b8a20)·클로드 2차(0fe5b69) 둘 다 **설명을 과하게 쌓는 같은 문제**였다.
     2차는 실제 사진을 넣었지만 라벨·캡션·주석을 그대로 남겨 결국 글자가 많았다.

   【이번 방침 — §0 재지시】
     · 출발점 = **기존 /content 실물**. 기존 컴포넌트를 그대로 가져다 쓴다.
     · **더 붙이지 않는다.** 사진·아이콘·선·움직임 추가 금지.
     · 유지할 것은 **의미**이지 문장 전부가 아니다 → 같은 말을 반복하는 문장을 덜어낸다.
     · 승인된 기획 중 **부족한 것만** 기존 장면에 흡수한다.

   【이번에 실제로 한 일 — 전부 "빼기" 또는 "같은 자리에서 바꾸기"】
     ① Start 구간: 같은 말이 **세 번** 반복됐다 —
        제목 "상호명만 넣어주세요" + 서브 "시작은 가게 이름 하나면 충분합니다"
        + 검색창 안 "상호명만 넣어주세요". → 서브를 지우고 제목만 남겼다.
     ② Tracking 구간: 기존 표는 세 줄 모두 "보이는 순위"뿐이라 **다음 콘텐츠로 이어지는 관계**가
        없었다(승인 기획 3). 한 줄을 "아직 보이지 않음"으로 바꾸고 그 줄에만 연결 표시를 붙였다.
        새 상자·새 문단 없이 **표 안에서** 해결.
     ③ Channels 구간: 01 설명 한 줄만 바꿔 "맡기기"를 흡수(승인 기획 1).
        목업·레이아웃은 손대지 않았다.

   🛑 원본 /content·공통 컴포넌트는 한 줄도 바꾸지 않았다. 이 파일 안에서만 대체한다.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import { SpacerRow } from '@/components/layout/OccupancyGrid';
import ContentHero from '@/components/content/ContentHero';
import {
  Eyebrow,
  ContentS2, ContentS3, ContentS4,
  ContentS5Visual, ContentS8Visual, ContentS9Grid, ContentS10Visual, ContentS11Cta,
} from '@/components/content/ContentSections';

const WRAP = 'px-12 py-24 max-w-[1200px] mx-auto max-md:px-6 max-md:py-20';
const BORDER = '#ECECEC';

/** 기존 page.tsx의 SectionHead와 같은 규격(복사) — 원본 파일을 건드리지 않기 위해 */
function SectionHead({ eyebrow, heading, sub }: { eyebrow: string; heading: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <FadeUp>
      <Eyebrow label={eyebrow} />
      <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance text-text-primary max-md:text-[26px]">
        {heading}
      </h2>
      {sub && (
        <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] max-md:text-[15px] md:max-w-[680px] md:leading-[1.35]">
          {sub}
        </p>
      )}
    </FadeUp>
  );
}

/* ── ② Tracking — 기존 표 그대로. 마지막 줄만 "아직 보이지 않음"으로 바꾸고
      그 줄에서 다음 글감으로 이어지는 관계를 표 안에서 보여준다.
      ⛔ 새 상자·새 문단·새 아이콘을 만들지 않았다. 기존 행 문법 그대로 쓴다. ── */
const ROWS = [
  { keyword: '연남동 미용실', volume: '월 3,410회 검색', page: '1페이지', rank: 7, accent: true },
  { keyword: '홍대 미용실', volume: '월 18,630회 검색', page: '3페이지', rank: 27, accent: false },
  { keyword: '합정 두피 관리', volume: '월 2,180회 검색', page: null, rank: 0, accent: false },
];

function RankNum({ n, accent }: { n: number; accent: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 900, 1);
        setV(Math.round(n * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { rootMargin: '-60px' });
    io.observe(el);
    return () => io.disconnect();
  }, [n]);
  return (
    <span ref={ref} className={`w-[30px] text-right text-[19px] font-bold tabular-nums ${accent ? 'text-accent' : 'text-text-primary'}`} style={{ fontFamily: 'var(--font-en)' }}>
      {v}
    </span>
  );
}

function TrackingVisual() {
  return (
    <div className="w-full max-w-[640px]" role="img" aria-label="검색어별 노출 위치와 다음 글감 연결">
      <div className="flex items-center gap-2 border-b-2 pb-2.5" style={{ borderColor: '#171717' }}>
        <span className="flex h-[16px] w-[16px] items-center justify-center bg-[#03c75a]" aria-hidden>
          <svg width="8" height="8" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
        </span>
        <span className="text-[12px] font-bold tracking-[-0.01em] text-text-primary">네이버 검색 API</span>
        {/* ★2026-09-19 "데모 화면" 표시 — 아래 검색량·순위는 고정값이라 실제 자료로 읽혔다(§0.6).
            ⛔ 목업 **아래**에 주석 줄을 달지 않는다(DESIGN §7-9 "목업 아래 단독 한 줄 금지").
            광고 쪽이 이미 쓰는 문법 그대로 **목업 머리 안**에 넣는다(AdsSections "데모 화면" 배지). */}
        <span className="ml-auto text-[11px] font-medium text-text-muted">매일 확인 · 데모 화면</span>
      </div>

      {ROWS.map((row) => (
        <div key={row.keyword} className="flex items-center justify-between gap-3 border-b py-4" style={{ borderColor: BORDER }}>
          <div className="min-w-0">
            <p className="text-[14.5px] font-bold tracking-[-0.01em] text-text-primary">{row.keyword}</p>
            <p className="mt-1 text-[12px] font-medium text-text-muted">{row.volume}</p>
          </div>
          {row.page ? (
            <div className="flex shrink-0 items-baseline">
              <span className={`w-[52px] text-right text-[12px] font-medium ${row.accent ? 'text-accent' : 'text-text-weak'}`}>{row.page}</span>
              <RankNum n={row.rank} accent={row.accent} />
              <span className={`ml-0.5 text-[13px] font-bold ${row.accent ? 'text-accent' : 'text-text-primary'}`}>위</span>
            </div>
          ) : (
            /* 아직 안 보이는 검색어 = 다음에 쓸 글감. 이 줄 하나가 승인 기획 3을 담는다 */
            <span className="shrink-0 text-[12.5px] font-bold text-text-weak">아직 보이지 않음</span>
          )}
        </div>
      ))}

      {/* 관계 한 줄 — 위 표의 마지막 줄을 그대로 받는다. 새 상자를 만들지 않았다 */}
      <p className="mt-3.5 flex items-center gap-2 text-[13.5px] font-semibold text-text-primary">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="1.8" strokeLinecap="square" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
        아직 보이지 않는 검색어가 다음에 쓸 글감이 됩니다
      </p>
    </div>
  );
}

export default function ContentPreview() {
  return (
    <main>
      <OuterContainer>
        {/* 이 페이지가 시안임을 알리는 한 줄 — 원본에는 없다 */}
        <div className="flex items-center justify-between gap-4 border-b px-8 py-3 text-[12px] text-text-weak max-md:px-5" style={{ borderColor: BORDER }}>
          <span>비교 시안 · 기존 디자인 기준</span>
          <a href="/content" className="underline underline-offset-4">기존 페이지 보기</a>
        </div>

        {/* S1 히어로 — 기존 그대로 */}
        <Section noBorder><ContentHero flow /></Section>
        <SpacerRow top />

        {/* S2 쌓임 — 기존 그대로 */}
        <Section noBorder><ContentS2 /></Section>
        <SpacerRow top />

        {/* S3 브리지 — 기존 그대로 */}
        <Section noBorder><ContentS3 /></Section>
        <SpacerRow top />

        {/* S4 채널 — 승인 기획 1(지금 올리기 / 갖고 있던 사진 맡기기의 차이).
            기존 업로드 장면을 확장했다: 01 스텝 위 전환을 누르면 업로드 화면 자체가 바뀐다
            (사진 장수 2→4+38 · 제목 "새 글"→"사진 보관함" · 하단 "메모 받아쓰기"→"추천 글감에 나누어 담는 중 6편").
            ⛔ 새 구간·새 상자·설명 문단을 만들지 않았다 — 같은 화면 안에서 상태만 바뀐다.
            `choice`는 기본 false라 원본 /content에는 나타나지 않는다(회귀 확인 완료). */}
        <Section noBorder>
          <div className="bg-[#eef0f3]"><ContentS4 choice shorts /></div>
        </Section>
        <SpacerRow top />

        {/* S5 노출 소식 — 기존 그대로 */}
        <Section noBorder>
          <div className={WRAP}>
            <div className="grid grid-cols-[1fr_1.3fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
              <SectionHead
                eyebrow="News"
                heading={<>노출 방식이 바뀌어도<br />알아서 따라갑니다</>}
                sub="검색에 도움 되는 변화를 주 1회 모아 앞으로 쓰는 글에 반영합니다."
              />
              <FadeUp delay={0.1}><ContentS5Visual /></FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ② Tracking — 표 안에서 "다음 글감" 관계를 보여준다.
            sub도 덜어냈다: 기존 "손님이 실제로 검색하는 말을 찾아 지금 어디에 있는지 매일 확인합니다"는
            제목(지금 몇 페이지 몇 위인지 정직하게)과 목업 머리(매일 확인)가 이미 말하고 있다 */}
        <Section noBorder>
          <div className={WRAP}>
            <div className="grid grid-cols-[1fr_1.25fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
              <SectionHead
                eyebrow="Tracking"
                heading={<>지금 몇 페이지 몇 위인지<br />정직하게 보여드립니다</>}
              />
              <FadeUp delay={0.1}><TrackingVisual /></FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* ① Start — 서브 삭제. 같은 말이 세 번 나오던 것을 한 번으로 */}
        <Section noBorder>
          <div className={WRAP}>
            <SectionHead eyebrow="Start" heading="상호명만 알려주세요" />
            <FadeUp delay={0.1}>
              <div className="mt-12 max-md:mt-8"><ContentS8Visual enrich /></div>
            </FadeUp>
          </div>
        </Section>
        <SpacerRow top />

        {/* S9 기능 — 기존 그대로 */}
        <Section noBorder>
          <div className="bg-[#eef0f3]">
            <div className={WRAP}>
              <SectionHead eyebrow="Features" heading="이 밖에도 필요한 기능을 담았습니다" />
              <FadeUp delay={0.1}><div className="mt-12 max-md:mt-8"><ContentS9Grid /></div></FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* S10 자산 — 기존 그대로 */}
        <Section noBorder>
          <div className={WRAP}>
            <div className="grid grid-cols-[1fr_1.2fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
              <SectionHead
                eyebrow="Asset"
                heading={<>서비스 이용이 끝나도<br />쌓인 글은 그대로 남습니다</>}
                sub="발행된 글은 고객님의 계정에 쌓입니다. 이용을 멈춰도 콘텐츠는 고객님의 자산으로 남습니다."
              />
              <FadeUp delay={0.1}><ContentS10Visual /></FadeUp>
            </div>
          </div>
        </Section>
        <SpacerRow top />

        {/* S11 마감 — 기존 그대로 */}
        <Section noBorder><ContentS11Cta cta /></Section>
      </OuterContainer>
    </main>
  );
}
