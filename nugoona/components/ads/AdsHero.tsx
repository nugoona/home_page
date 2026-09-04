'use client';

/* /ads S1 히어로 — ContentHero(정본) 문법 복제(사장님 2026-07-18 "홈·콘텐츠 히어로 법칙을 봐라"):
   ① 좌표계 = OccupancyGrid(§8.16) — PC 12×8(텍스트 c[3,11] r[2,6] / 궤도 c[2,12] r[6,9]) ·
     모바일 6×9(head/sub/cta 행 점유 + 궤도 r[7,10]). checker + 십자 2개(궤도 칸 상단 모서리).
   ② 배경 = 플랫 #0a0a0a(radial 네이비 폐기 — 구 페이지 잔재였음).
   ③ 타이포 = ContentHero 실측: 배지(로고 h-10 + 제품명 15px semibold) / h1 clamp(30,4.4vw,52)
     semibold·1.12·-0.04em·딥섀도·accent #4d9fff / sub 16px white/55 / 모바일 h1 24px·sub 14px.
   ④ 비주얼 = 궤도 장면(OrbitScene — 칸 높이에 맞춘 파라미터, 하단 잘림 구도). */

import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { OrbitScene } from '@/components/ads/AdsHeroOrbit';
import { hero } from '@/lib/content/ads';

/* PC 12열 × 8행 — ContentHero D_AREAS와 동일 골격(텍스트 4행 + 비주얼 10칸×3행, 좌우 1칸 checker) */
/* 텍스트 1칸 축소 → 궤도 4행(사장님 2026-07-19 "칸 한 칸 줄이고 궤적 크게") */
const D_AREAS: GridArea[] = [
  { key: 'text', c: [3, 11], r: [2, 5], className: 'flex flex-col items-center justify-center text-center px-6' },
  { key: 'orbit', c: [2, 12], r: [5, 9], className: 'relative overflow-hidden' },
];
/* 모바일 6열 × 9행 — head/sub/cta 밀착(간격 축소, 사장님 2026-07-19) + 궤도 4행 */
const M_AREAS: GridArea[] = [
  { key: 'm-head', c: [2, 6], r: [2, 3], className: 'flex flex-col items-center justify-end pb-3 text-center' },
  { key: 'm-sub', c: [2, 6], r: [3, 4], className: 'flex items-start justify-center pt-1 text-center' },
  { key: 'm-cta', c: [2, 6], r: [4, 6], className: 'flex flex-col items-center justify-center' },
  { key: 'orbit-m', c: [1, 7], r: [6, 10], className: 'relative overflow-hidden' },
];

/* (제품 배지 = 삭제 확정 — 사장님 2026-07-18 "헤드라인 위 로고+제품명 지워라", 양 히어로 공통) */

/** CTA 쌍 — 주(흰+잉크, ContentHero Cta 문법) + 보조(아웃라인 "데모 확인하기"), 너비 동일 */
function CtaPair({ mobile = false }: { mobile?: boolean }) {
  /* PC도 pill(사장님 승인 2026-07-20 — 히어로 버튼 = pill 확정 문법, 3페이지 통일 완성) */
  const base = mobile
    ? 'rounded-pill inline-flex w-[210px] items-center justify-center gap-2 px-7 py-3 text-[14px] font-semibold'
    : 'rounded-pill inline-flex min-w-[196px] items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold';
  return (
    <div className={`flex items-center justify-center gap-3 ${mobile ? 'flex-col' : ''}`}>
      <Link href={hero.cta.href} className={`${base} bg-white text-[#0a0a0a] transition-colors hover:bg-[#eaeaea]`}>
        {hero.cta.text}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M6 4l4 4-4 4" /></svg>
      </Link>
      <Link href={hero.ctaSecondary.href} className={`${base} transition-all hover:bg-white/[0.06]`} style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>
        {hero.ctaSecondary.text}
      </Link>
    </div>
  );
}

/* h1 — ads.ts 원문(text-accent 스팬) 그대로, 다크 위 밝은 파랑으로 렌더(#4d9fff — ContentHero 동일) */
const H1_CLS =
  'font-semibold leading-[1.12] tracking-[-0.04em] text-white [text-shadow:0_1px_0_rgba(0,0,0,0.45),0_3px_8px_rgba(0,0,0,0.35)] [&_.text-accent]:text-[#4d9fff]';

function renderCell(key: string) {
  switch (key) {
    case 'text': /* PC — 배지 + h1 + sub + CTA쌍 + 보조문구(ContentHero 'text' 칸 위계) */
      return (
        <FadeUp>
          <h1 className={`mb-5 text-[clamp(30px,4.4vw,52px)] ${H1_CLS}`} dangerouslySetInnerHTML={{ __html: hero.h1 }} />
          <p className="mx-auto mb-7 text-[16px] font-medium leading-[1.5] text-white/70">{hero.sub}</p>
          <CtaPair />
        </FadeUp>
      );
    case 'm-head':
      return (
        <FadeUp>
          <h1 className={`text-[24px] leading-[1.2] tracking-[-0.02em] ${H1_CLS}`} dangerouslySetInnerHTML={{ __html: hero.h1 }} />
        </FadeUp>
      );
    case 'm-sub':
      return <p className="text-[14px] font-medium leading-[1.5] text-white/70">{hero.sub}</p>;
    case 'm-cta':
      return (
        <CtaPair mobile />
      );
    case 'orbit': /* PC 궤도 — 칸 4행 확대판(사장님 2026-07-19), 하단 잘림 구도 */
      return <OrbitScene box={560} rings={[120, 190, 258]} icon={46} core={54} idp="adsh-pc" top={14} />;
    case 'orbit-m': /* 모바일 궤도 — 확대판(사장님 2026-07-19 "궤도 작다"): box 320 + 넓은 화면(≤767)에서
        vw 비례 스케일(390 기준 1.0 → 상한 1.5). radius px 고정이라 scale이 유일한 안전 확대 수단 */
      return (
        <div className="absolute inset-0" style={{ transform: 'scale(clamp(1, calc(100vw / 420), 1.5))', transformOrigin: 'top center' }}>
          <OrbitScene box={360} rings={[78, 124, 168]} icon={40} core={48} idp="adsh-mo" top={10} />
        </div>
      );
    default:
      return null;
  }
}

/** 십자(+) 마커 — 궤도 칸 상단 모서리 2개(ContentHero Cross 동일: line2·line12 × line6) */
function Cross({ left, top }: { left: string; top: string }) {
  return (
    <svg
      className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{ left, top }}
      width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" aria-hidden
    >
      <path d="M5.5 0v11M0 5.5h11" />
    </svg>
  );
}

export default function AdsHero() {
  return (
    <div className="relative bg-[#0a0a0a]">
      <OccupancyGrid cols={12} rows={8} areas={D_AREAS} tone="dark" checker mobile={false} render={renderCell} />
      <OccupancyGrid cols={6} rows={9} areas={M_AREAS} tone="darkFaint" checker mobile render={renderCell} />
      {/* 궤도 칸 상단 라인 = row5(8행 그리드의 50%) — 칸 재배분에 맞춰 이동 */}
      <Cross left="8.3333%" top="50%" />
      <Cross left="91.6667%" top="50%" />
    </div>
  );
}
