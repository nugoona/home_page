'use client';

/**
 * BuildUpStone — /content 2번 구간 "검색에 보이려면 꾸준히 올려야 합니다" · 원리 모션 1단계(2026-10-09, 직원 PC · 사장님 승인 "한번 해봐").
 *
 * 원리 한 문장: "하나는 묻히고, 쌓이면 떠오른다."  (DESIGN §8.19 D-2 — 원리 구간은 실물 모형이 아니라 비유로)
 * 이 파일 = **3초 조각**: 돌(게시물) 하나가 떨어져 수면(검색에 보이는 선) 아래로 가라앉는 장면만.
 *   이 조각이 "대기업 수준"으로 통과해야 쌓이는 장면(2단계)을 잇는다(사장님 2026-10-09 — 어설프면 여기서 멈춤).
 * 구현: GSAP 타임라인(맨손 계산 금지 — 지난 모션 반려 원인). 돌 = 직각 네모 하나(그림 금지), 수면 = 가는 선 하나,
 *   색 = 흰·검정(돌)·파랑(수면선 하나). 그림자·흐림·회전 없음. 처음부터 무한 반복.
 * 박자(2판 — 1판은 돌이 바닥에 놓여 '묻힌다'가 안 읽힘): 낙하 0.5s(power2.in = 중력) → 착수 순간 수면선 출렁(elastic 짧게) + 파문 한 줄
 *   → 가라앉음 1.0s(power1.inOut, 물속 저항) + 깊어질수록 옅어져 끝에 완전히 사라짐(= 묻힘) → 0.8s 머묾 → 반복. 한 바퀴 ≈ 3초.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ACCENT = '#0070f3';
const INK = '#171717';
const LINE = '#ECECEC';

export function BuildUpStone() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stone = '[data-stone]';
      const water = '[data-water]';
      const ripple = '[data-ripple]';
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        gsap.set(stone, { y: 120, opacity: 0 });
        return;
      }
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, defaults: { ease: 'none' } });
      tl.set(stone, { y: -80, opacity: 1 })
        .set(ripple, { scaleX: 0, opacity: 0 })
        // 낙하(중력)
        .to(stone, { y: 0, duration: 0.5, ease: 'power2.in' })
        // 착수: 수면선 출렁 + 파문 한 줄 + 돌 멈칫
        .to(water, { y: 3, duration: 0.09, ease: 'power1.out' }, '>')
        .to(water, { y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' }, '>')
        .fromTo(ripple, { scaleX: 0.2, opacity: 0.7 }, { scaleX: 1, opacity: 0, duration: 0.6, ease: 'power2.out' }, '<-0.45')
        // 가라앉음(물속 저항)
        .to(stone, { y: 120, duration: 1.0, ease: 'power1.inOut' }, '<-0.38')
        .to(stone, { opacity: 0, duration: 1.0, ease: 'power2.in' }, '<');
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative px-8 py-10 max-md:px-4 max-md:py-7" style={{ background: '#FAFAFA', backgroundImage: 'radial-gradient(#dcdcdc 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="relative mx-auto h-[360px] w-full max-w-[560px] overflow-hidden bg-white max-md:h-[300px]" style={{ border: `1px solid ${LINE}` }}>
        {/* 물속 = 수면 아래를 아주 옅은 면으로 구분(파스텔 아님 — #FAFAFA 한 단계). 돌보다 뒤에 깔린다 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2" style={{ background: '#FAFAFA' }} />
        {/* 수면 = 검색에 보이는 선. 가로 전체, 파랑 하나 */}
        <div data-water className="absolute left-0 right-0 top-1/2 h-px" style={{ background: ACCENT }} />
        <span className="absolute right-4 top-1/2 -translate-y-[calc(100%+6px)] text-[11px] font-semibold tracking-[0.02em]" style={{ color: ACCENT }}>검색에 보이는 선</span>
        {/* 파문: 착수 지점에서 가로로 퍼지는 가는 선 하나 */}
        <div data-ripple className="absolute left-1/2 top-1/2 h-px w-[160px] origin-center -translate-x-1/2" style={{ background: ACCENT, opacity: 0 }} />
        {/* 돌 = 게시물 하나. 직각 네모, 수면선 위 끝이 y=0 */}
        <div
          data-stone
          className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-full"
          style={{ background: INK, willChange: 'transform, opacity' }}
        />
      </div>
    </div>
  );
}
