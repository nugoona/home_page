'use client';

import FadeUp from '@/components/motion/FadeUp';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { useRevealOnView, RevealHtmlLines } from '@/components/motion/Reveal';
import { homeV2 } from '@/lib/content/home';

/**
 * S7 · 업데이트 "매체가 바뀌면, 앱도 바뀝니다" — 변화→대응 페어 타임라인 (사장님 택1 2026-07-14, 구성①).
 *
 * ▣ 개선(사장님 2026-07-14 2차): 왼쪽 변화 설명·화살표 제거 — **Clone02 FeeRow 문법의 미니멀 로그**
 *   (hairline rows). 인과는 헤드 카피가 담당, 로그는 증거만. 촘촘·짧게.
 *   끝 = NOW 펄스("지금도 계속") → 마무리 문장(accent 둘째 줄).
 * ▣ ★2026-09-18 개편(사장님 낙점 "3번"): 행 = 「날짜 | 기능 | 제품」 → 「제품 | 그 제품이 갖춘 기능들」.
 *   날짜(2026.01·04·05·06)는 **지어낸 값**이라 걷어냈다(구 주석이 "대표 가상 날짜"라 자백). 기능은 진짜라 남겼다.
 *   마무리 문장도 "새로운 기능에도 추가 비용이 없습니다"(모든 미래 기능 공짜로 읽힘) → 요금 페이지와
 *   같은 "지금 가입하신 요금은 쓰시는 동안 그대로입니다"로. 근거·경위 = home.ts homeV2.update 주석.
 * ▣ 계승: PromiseTimeline(확정 자산)의 제품색(NC #4d9fff / NA #29d5ff)·NOW 펄스·마무리 강조.
 *   다크 리듬 유지(S6 라이트 → S7 다크 → S8 라이트). FadeUp = 스크롤 진입 시 순차 등장(유지).
 * ▣ 제품명 = 정식 표기 "누구나 콘텐츠"/"누구나 광고"(임의 축약 금지 — 사장님 2026-07-14).
 * ⛔ 특정사 비난·순위·성과 보장 없음(변화 문구는 일반화). 카피 = home.ts homeV2.update (토씨 유지).
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
/* 제품 점 색 — 라이트 배경용(다크용 밝은 톤 #4d9fff/#29d5ff는 흰 바탕에서 옅음) */
const TAG: Record<string, string> = { '누구나 콘텐츠': '#0070f3', '누구나 광고': '#0aa5c9' };

/* Grid Occupancy 편입(2026-07-15, §8.16): 좌 헤딩 레일 / 우 로그 스택 + 마무리 풀폭.
   ★라이트 전환(사장님 2026-07-15 "위아래 모두 다크라 이상") — 다크는 선언부(히어로·철학·CTA)만,
   업데이트 로그 = 정보라 라이트 hairline 문법(Clone02 FeeRow 원형도 라이트) */
export default function S7UpdatePairs() {
  const { head, tracks, small } = homeV2.update; // body는 감량 확정으로 빈 배열(2026-07-14)
  const railRevealRef = useRevealOnView<HTMLDivElement>();
  const smallLines = small.split('<br>'); // 마무리 문장 두 줄 — 둘째 줄만 accent

  const rail = (
    <div className="px-8 py-10 lg:px-12">
      <FadeUp>
        <span className="mb-6 flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
            <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
          </svg>
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#555555]" style={EN}>
            Updates
          </span>
        </span>
        <h2 className="text-[clamp(28px,3.6vw,44px)] font-bold text-text-primary tracking-[-0.04em] leading-[1.22] text-balance">
          <RevealHtmlLines html={head} />
        </h2>
      </FadeUp>
    </div>
  );

  const log = (
    /* max-md:pt-2 = 모바일 헤딩~로그 사이 과대 여백 축소(실기기 교정 2026-07-15) */
    <div className="w-full px-8 py-10 max-md:pt-2 lg:px-12">
      {/* 로그 행 선은 그리드 칸 경계선보다 옅게 — 좌표계와 위계 분리(검수 2026-07-15) */}
      <div className="divide-y divide-[#F0F0F0] border-y border-[#F0F0F0]">
        {/* ★2026-09-18 (사장님 낙점 "3번") 날짜 칸 폐지 → 제품 칸.
            구조 = [제품 점+이름 96px] | [그 제품이 갖춘 기능들]. 근거·경위는 home.ts update.tracks 주석. */}
        {tracks.map((g, gi) => (
          <FadeUp key={g.product} delay={Math.min(0.08 + gi * 0.06, 0.3)}>
            <div className="flex gap-4 py-3.5 max-md:gap-3">
              <span className="flex w-[96px] shrink-0 items-center gap-1.5 pt-[2px] max-md:w-[70px]">
                <span aria-hidden className="rounded-dot h-[6px] w-[6px] shrink-0" style={{ background: TAG[g.product] }} />
                {/* 정식 표기는 "누구나 콘텐츠"지만 이 칸은 폭 96px이라 앞머리를 떼고 쓴다(옆 기능명이 주인공) */}
                <span className="text-[12px] font-semibold tracking-[-0.01em] text-[#6b7280] max-md:text-[11px]">
                  {g.product.replace('누구나 ', '')}
                </span>
              </span>
              <div className="flex-1">
                {g.items.map((t) => (
                  <p key={t} className="text-[15px] font-medium leading-[1.7] tracking-[-0.01em] text-text-primary max-md:text-[14px]">
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
        {/* NOW — accent 1곳 */}
        <FadeUp delay={0.32}>
          <div className="flex items-center gap-4 py-3.5 max-md:gap-3">
            <span className="w-[64px] shrink-0 text-[13px] font-semibold tracking-[0.06em] text-accent" style={EN}>
              NOW
            </span>
            <p className="flex-1 text-[15px] max-md:text-[14px] font-semibold leading-[1.45] text-text-primary">
              고객에게 필요한 기능을 계속 업데이트합니다.
            </p>
            <span
              aria-hidden
              className="rounded-dot h-[8px] w-[8px] shrink-0 animate-pulse bg-accent"
              style={{ boxShadow: '0 0 0 3px rgba(0,112,243,0.18)' }}
            />
          </div>
        </FadeUp>
      </div>
    </div>
  );

  const closing = (
    <FadeUp delay={0.2}>
      {/* §8.9: 대형 문구 밑줄·끝 마침표 없음(accent 색만) */}
      {/* ★2026-09-18 하드코딩 → home.ts update.small 사용. 구 문구가 코드에만 있어 카피 파일과 따로 놀았다.
          문법은 그대로: 첫 줄 검정 / 둘째 줄 accent. small의 <br> 기준으로 두 줄을 가른다. */}
      <p className="inline-block px-8 text-left text-[clamp(20px,5.4vw,25px)] font-bold leading-[1.5] tracking-[-0.02em] text-text-primary md:text-[clamp(23px,2.8vw,33px)]">
        {smallLines[0]}
        {smallLines[1] && <><br /><span className="text-accent">{smallLines[1]}</span></>}
      </p>
    </FadeUp>
  );

  /* 행 실측 축소(로그 ~320px → 4행 — 검수 2026-07-15 "위아래 140px 공백").
     closing = 2행(2026-07-20 사장님 "PC 여백 깨짐" — 1행에 두 줄 문장이 눌려 위아래 숨통 0 → 2행 중앙)
     ★2026-09-18 재실측: 로그가 5행(4+NOW) → **3행**(콘텐츠·광고·NOW)으로 줄어 4행 칸에 265px이 비었다.
       셀은 정사각(OccupancyGrid: aspectRatio cols/rows)이라 rows를 줄이면 섹션 높이가 그만큼 줄어든다.
       → rail·log 4행→3행, rows 6→5. §8.16 "카피가 바뀌면 행 수 재실측" 그대로. */
  const D_AREAS: GridArea[] = [
    { key: 'rail', c: [1, 6], r: [1, 4], className: 'flex items-center' },
    { key: 'log', c: [6, 13], r: [1, 4], className: 'flex items-center' },
    { key: 'closing', c: [1, 13], r: [4, 6], className: 'flex items-center justify-center' },
  ];
  const renderD = (key: string) => (key === 'rail' ? rail : key === 'log' ? log : closing);

  return (
    <section className="relative overflow-hidden bg-bg">
      {/* 모바일 — 풀폭 세로 스택(하단 pb-12 = 2026-07-20 사장님 "문장 주변 허함" — 문장~섹션 끝 80px 과다 축소) */}
      <div className="relative px-6 pb-12 pt-20 md:hidden">
        <div ref={railRevealRef} data-reveal="wait">{rail}</div>
        {log}
        <div className="mt-8 text-center">{closing}</div>
      </div>

      {/* PC — 좌 헤딩 레일 / 우 로그 / 마무리 풀폭(5행 — 로그 3행 + closing 2행) */}
      <OccupancyGrid cols={12} rows={5} areas={D_AREAS} mobile={false} className="z-[1]" render={renderD} />
    </section>
  );
}
