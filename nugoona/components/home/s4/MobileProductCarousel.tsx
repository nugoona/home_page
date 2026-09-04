'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRevealOnView, RevealHtmlLines } from '@/components/motion/Reveal';

/**
 * 모바일 제품 캐러셀(2026-07-15 사장님 확정 — "캐러셀, 단 peek+스텝 도트로 강력하게").
 * PC의 "긴 목업 3단 세로 스크롤 + 좌측 텍스트 동행"을 모바일에선 "목업 3단 가로 스와이프"로 번역.
 * ⛔ 이 컴포넌트는 모바일(md:hidden) 전용 — PC는 TwoAppsRail의 OccupancyGrid 그대로(무영향).
 *
 * 구조: 헤드라인(리빌) → 스텝 도트 ①②③ → 가로 스냅 캐러셀(다음 카드 peek) → 버튼.
 * 각 카드 = 스텝 배지+라벨(정본 StepHead 라벨) + 목업(part, hideHead로 단계 목업만).
 * 과거 캐러셀 반려("다음 장 숨음")를 peek(다음 카드 노출) + 스텝 도트(위치 표시)로 해소.
 */

export interface ProductStep {
  n: string;
  label: string;
}

export interface CarouselProduct {
  logo: string;
  name: string;
  headHtml: string;
  href: string;
  cta: string;
  dot: string; // 제품 컬러(스텝 도트·배지 활성)
  cardBg: string; // 카드 낱장 배경(단색 통일, 제품별 딥톤)
  holderLine: string; // 하단 홀더 립 경계선 색
  steps: ProductStep[];
}

const KR = { fontFamily: 'var(--font-kr)' } as const;

export default function MobileProductCarousel({
  p,
  Mock,
}: {
  p: CarouselProduct;
  Mock: React.ComponentType<{ part?: 1 | 2 | 3; hideHead?: boolean }>;
}) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const headRef = useRevealOnView<HTMLDivElement>();

  /* 현재 카드 = 중심이 뷰포트 중심에 가장 가까운 카드. peek·마지막 카드 오른쪽 정렬에도 정확. */
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    [...el.children].forEach((c, i) => {
      const card = c as HTMLElement;
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best !== active) setActive(best);
  };

  const total = p.steps.length;

  return (
    <div ref={headRef} data-reveal="wait" className="border-b border-[#ECECEC] bg-bg px-6 py-24 last:border-b-0">
      {/* 로고 + 제품명 */}
      <div className="mb-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.logo} alt={`${p.name} 로고`} style={{ height: 40, width: 40, display: 'block' }} />
        <span className="text-[17px] font-bold tracking-[-0.02em] text-text-primary" style={KR}>
          {p.name}
        </span>
      </div>

      {/* 헤드라인(리빌) */}
      <h2
        className="text-[clamp(1.55rem,6.4vw,2.1rem)] font-bold leading-[1.28] tracking-[-0.04em] text-text-primary"
        style={KR}
      >
        <RevealHtmlLines html={p.headHtml} />
      </h2>

      {/* 스텝 진행 바 + 영어 카운터(라벨 중복 제거 — 라벨은 카드 헤더가 담당, 여긴 위치만) */}
      <div className="mt-9 mb-4 flex items-center gap-2.5" aria-hidden>
        {p.steps.map((s, i) => (
          <span
            key={s.n}
            className="h-[6px] rounded-full transition-all duration-300"
            style={{ width: active === i ? 26 : 6, background: active === i ? p.dot : '#cfd2d6' }}
          />
        ))}
        <span className="ml-auto text-[12px] font-bold tracking-[0.06em] text-[#8a8f96] [font-variant-numeric:tabular-nums]" style={{ fontFamily: 'var(--font-en)' }}>
          {String(active + 1).padStart(2, '0')}<span className="mx-0.5 text-[#c4c8cd]">/</span>{String(total).padStart(2, '0')}
        </span>
      </div>

      {/* 가로 스냅 캐러셀 — 다음 카드 peek(basis-80%). -mx-6 px-6 = 카드가 섹션 좌우 끝까지 흐름 */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: 24, scrollPaddingRight: 24 }}
      >
        {p.steps.map((s, i) => (
          <div key={s.n} className="shrink-0 basis-[80%] snap-start">
            {/* 애플 Mac 카드식 — 흰 단색 카드(목업 흰 UI와 이음새 없음) + 큰 라운딩 / 상단 텍스트 / 하단 목업 폭 꽉 */}
            <div
              className="rounded-card relative h-[452px] overflow-hidden border"
              style={{ background: p.cardBg, borderColor: '#D0D4DA', boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 4px 10px rgba(15,23,42,0.08)' }}
            >
              {/* 상단 텍스트(라벨은 여기 한 곳만) — 목업 위 여백을 채우는 디자인 */}
              <div className="absolute inset-x-0 top-0 z-10 px-6 pt-7">
                <span className="text-[12px] font-bold tracking-[0.14em] text-[#8a8f96]" style={{ fontFamily: 'var(--font-en)' }}>
                  STEP {s.n}
                </span>
                <h3 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-text-primary" style={KR}>
                  {s.label}
                </h3>
              </div>
              {/* 하단 목업 — 상단부터 시작, 카드보다 커서 하단이 카드 경계에서 잘림
                 (NC1 폰 카드처럼 "홀더에 카드가 꽂힌" 느낌 — 사장님 기준). 좌우 패딩으로 회색 여백 통일 */}
              <div data-mockarea className="absolute inset-x-0 bottom-0 top-[112px] overflow-hidden px-4">
                {/* 목업 아래로(하단 정렬) + 높이 카드영역 제한: 짧은 목업은 하단 붙고 위 여백,
                   긴 목업(검색·문서)은 상단 보호하고 하단만 잘림(홀더). max-h-full로 상단 안 넘침 */}
                <div data-mock className="absolute inset-x-0 bottom-0 max-h-full overflow-hidden">
                  <Mock part={(i + 1) as 1 | 2 | 3} hideHead />
                </div>
              </div>
              {/* 하단 홀더 립 — 카드 배경 띠가 목업 앞(z-20)에서 하단을 덮어 "꽂혀 들어간" 마감
                 (사장님 "하단 배경 z값이 안의 내용보다 앞에"). 상단 얇은 선으로 홀더 경계 표시 */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 z-20 h-6"
                style={{ background: p.cardBg, boxShadow: `inset 0 1px 0 ${p.holderLine}` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 버튼 — 캐러셀에 붙여 '이 캐러셀에서 본 기능을 체험' 소속감(GPT PM 2026-07-16).
         가운데 정렬 + 캐러셀과 간격 축소(py-5 하단 20px + mt-1 ≈ 24px) + 낮고 길쭉한 보조 CTA */}
      <div className="mt-1 flex justify-center">
        <Link
          href={p.href}
          style={{ color: '#ffffff' }}
          className="rounded-pill inline-flex items-center gap-2 bg-[#171717] px-6 py-2 text-[14px] font-semibold tracking-[-0.02em] no-underline"
        >
          {p.cta}
        </Link>
      </div>
    </div>
  );
}
