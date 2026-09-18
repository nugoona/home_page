'use client';

import Link from 'next/link';
import S41SearchScene from '@/components/home/s4/S41SearchScene';
import S42AdScene from '@/components/home/s4/S42AdScene';
import MobileProductCarousel, { type CarouselProduct } from '@/components/home/s4/MobileProductCarousel';
import { NcMobileMock, NaMobileMock } from '@/components/home/s4/MobileStepMocks';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { useRevealOnView, RevealHtmlLines } from '@/components/motion/Reveal';
import { homeV2 } from '@/lib/content/home';

/**
 * S4 · 두 개의 앱 — Grid Occupancy 좌표계 위 제품별 지그재그 2열(2026-07-15 재구성).
 * ⛔ 좌 레일 통합안 반려(사장님: "누구나 광고/콘텐츠 구분 명확히 + 로고 크게").
 * 구성: 풀폭 헤딩 칸 → 블록1(좌 NC 텍스트 / 우 S41 목업) → 블록2(좌 S42 목업 / 우 NA 텍스트 — 반전).
 * 각 텍스트 칸 = 큰 로고(48px)+정식 제품명 / 확정 헤딩 / 확정 서브 1줄 / 다크 필 버튼.
 * 카피 = 확정 토씨 그대로. 구 TwoAppsHeader·PhoneScene·AdScene 원작 보존.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;

/* 12열 × 30행: 회사 정의 2열(Clone03 문법) 7행 + 블록1 12행(S41 실측 1019px) + 블록2 11행(S42 909px) */
/* 회사 정의 = 풀폭 대형 타이포 선언 칸(Vercel "Security by default." 문법 라이트 버전 —
   목업 2열안 반려 2026-07-15 "어떤 회사인지 나오는 문구라 크게") */
/* 12열 × 34행 — 좌우 레이아웃 원복(사장님 2026-07-15 "일단 예전처럼 좌우 레이아웃으로").
   블록 = 좌 텍스트 칸(내부 sticky) / 우 목업 세로 3단. 두 블록 같은 방향(지그재그 반전 폐기 유지).
   3열 한 줄 시안(텍스트 풀폭+목업 3열)은 시도 후 회귀 — 이력은 세션 파일 2026-07-15 참조. */
const D_AREAS: GridArea[] = [
  { key: 'def-text', c: [1, 13], r: [1, 8] },  // 7행 — 대형 선언 + 분기 플로우(Clone01)
  /* r[8,9] = 회사 정의 ↔ 블록1 사이 여백 줄(checker) */
  { key: 'text1', c: [1, 6], r: [9, 22], className: 'block' },
  { key: 'mock1', c: [6, 13], r: [9, 22], className: 'flex items-center justify-center' },  // 13행 = S41 실측 1005px+py64(간격 축소·구획선 밀착 후 재실측 2026-07-15)
  /* r[22,23] = 블록1 ↔ 블록2 사이 여백 줄(checker) */
  { key: 'text2', c: [1, 6], r: [23, 35], className: 'block' },
  { key: 'mock2', c: [6, 13], r: [23, 35], className: 'flex items-center justify-center' }, // 12행 = S42 실측 895px+py64
];

/* 회사 정의 분기 플로우 — Clone01 "Provider fallback" 재조립 v2(사장님 원본 대조 2026-07-15):
   NGN 워드마크 → 수평 직선(양끝 fade) → 분기점 → S곡선 2개(끝 fade) → 콤팩트 제품 카드 2(같은 위계).
   좌표계 1050×280(패널 폭의 86% — "너비 반밖에 안 써" 교정) */
function BranchFlow({ uid }: { uid: string }) {
  return (
    <div className="relative mx-auto aspect-[1050/280] w-full max-w-[1050px] max-md:aspect-[1050/460]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1050 280" fill="none" preserveAspectRatio="none" aria-hidden>
        <defs>
          {/* ⚠️ id에 uid 필수 — PC/모바일 중복 렌더 시 defs id 중복 → 숨겨진 쪽 참조로 선 소실(§8.16-D1 실증 2회차) */}
          <linearGradient id={`${uid}-line`} gradientUnits="userSpaceOnUse" x1="216" y1="140" x2="552" y2="140">
            <stop offset="0" stopColor="#171717" stopOpacity="0" />
            <stop offset="0.12" stopColor="#171717" stopOpacity="1" />
            <stop offset="1" stopColor="#171717" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`${uid}-curve-a`} gradientUnits="userSpaceOnUse" x1="560" y1="140" x2="800" y2="62">
            <stop offset="0" stopColor="#171717" stopOpacity="1" />
            <stop offset="0.7" stopColor="#171717" stopOpacity="1" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id={`${uid}-curve-b`} gradientUnits="userSpaceOnUse" x1="560" y1="140" x2="800" y2="218">
            <stop offset="0" stopColor="#171717" stopOpacity="1" />
            <stop offset="0.7" stopColor="#171717" stopOpacity="1" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {/* 한 줄로 가다가 → 분기점(원) → 갈라짐(Clone01 실측 베지어) */}
        <line x1="216" y1="140" x2="552" y2="140" stroke={`url(#${uid}-line)`} strokeWidth="2" />
        <path d="M560 140 C675 140, 685 62, 800 62" stroke={`url(#${uid}-curve-a)`} strokeWidth="1.8" />
        <path d="M560 140 C675 140, 685 218, 800 218" stroke={`url(#${uid}-curve-b)`} strokeWidth="1.8" />
      </svg>
      {/* 분기점 노드 — HTML 원. ⚠️ 전역 직각 리셋(border-radius:0!important)이 인라인까지 덮음 →
          예외 유틸 .rounded-dot 필수(SVG circle은 preserveAspectRatio none에서 타원 — 둘 다 실증) */}
      <span
        aria-hidden
        className="rounded-dot absolute h-[13px] w-[13px] bg-white"
        style={{ left: '53.33%', top: '50%', transform: 'translate(-50%, -50%)', border: '1.8px solid #171717' }}
      />

      {/* 좌: 회사 로고(logo2.webp) — 제품 로고와 동일 84px(모바일 44), 균형 위해 우측 이동(사장님 2026-07-15) */}
      <div className="absolute flex items-center" style={{ left: '11.4%', top: '50%', transform: 'translateY(-50%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/icons/logo2.webp" alt="누구나컴퍼니(NGN) 로고" className="h-[84px] max-md:h-[44px]" style={{ width: 'auto', display: 'block' }} />
      </div>

      {/* 우: 로고(그리드 한 칸 크기) + 정식 제품명 — 박스·서브 없음(사장님 2026-07-15) */}
      {[
        { logo: '/img/logo/nc.svg?v=16', name: '누구나 콘텐츠', top: '22.1%' },
        { logo: '/img/logo/na.svg?v=20', name: '누구나 광고', top: '77.9%' },
      ].map((p) => (
        <div
          key={p.name}
          className="absolute flex items-center gap-5 max-md:flex-col max-md:items-start max-md:gap-1.5"
          style={{ left: '76.2%', top: p.top, transform: 'translateY(-50%)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.logo} alt={`${p.name} 로고`} className="h-[84px] w-[84px] max-md:h-[44px] max-md:w-[44px]" style={{ display: 'block' }} />
          <span className="whitespace-nowrap text-[20px] font-bold tracking-[-0.02em] text-text-primary max-md:text-[14px]" style={KR}>
            {p.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* 신호등 3점(Clone03) */
function TrafficDots() {
  return (
    <span className="flex gap-1">
      <span className="h-[9px] w-[9px] rounded-full bg-[#ec6a5e]" />
      <span className="h-[9px] w-[9px] rounded-full bg-[#f4bf4f]" />
      <span className="h-[9px] w-[9px] rounded-full bg-[#61c454]" />
    </span>
  );
}

/* 회사 정의 목업 — Clone03 재조립: 큰 브라우저 창(앱, 점선 칸 + 중앙 제품 라벨)
   + "사장님" 미니 창 겹침(자연어 지시 카드) = "직접 할 수 있게"의 그림 */
function CompanyDefMock() {
  return (
    <div className="relative w-full max-w-[480px]" style={{ aspectRatio: '660 / 500' }}>
      {/* 큰 브라우저 창(뒤) */}
      <div
        className="absolute right-0 top-0 overflow-hidden rounded-xl border bg-white"
        style={{ width: '85%', height: '88%', borderColor: '#e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <div className="relative flex h-[44px] items-center border-b border-[#ececec] px-4">
          <TrafficDots />
          <span className="absolute inset-0 flex items-center justify-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
              <rect x="2.2" y="5.6" width="8.6" height="6" rx="1.2" stroke="#7d7d7d" strokeWidth="1.1" />
              <path d="M4.1 5.4V4a2.4 2.4 0 0 1 4.8 0v1.4" stroke="#7d7d7d" strokeWidth="1.1" />
            </svg>
            <span className="text-[13px] tracking-[0.01em] text-[#7d7d7d]" style={{ fontFamily: "ui-monospace, 'Menlo', monospace" }}>
              app.nugoona.co.kr
            </span>
          </span>
        </div>
        {/* 3×3 점선 칸 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[44px]" aria-hidden>
          <span className="absolute bottom-0 top-0 border-l border-dashed border-[#ececec]" style={{ left: '33.3%' }} />
          <span className="absolute bottom-0 top-0 border-l border-dashed border-[#ececec]" style={{ left: '66.6%' }} />
          <span className="absolute left-0 right-0 border-t border-dashed border-[#ececec]" style={{ top: '33.3%' }} />
          <span className="absolute left-0 right-0 border-t border-dashed border-[#ececec]" style={{ top: '66.6%' }} />
        </div>
        {/* 중앙 셀: ✦ 아이콘 카드 + 제품 라벨 */}
        <div className="absolute inset-x-0 top-[44px] bottom-0 flex flex-col items-center justify-center gap-3.5">
          <span
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border bg-white"
            style={{ borderColor: '#ececec', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
              <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
            </svg>
          </span>
          <span className="text-[15px] font-medium tracking-[-0.01em] text-text-primary" style={KR}>
            누구나 콘텐츠 · 누구나 광고
          </span>
        </div>
      </div>

      {/* "사장님" 미니 창(앞, 좌하단 겹침) */}
      <div
        className="absolute bottom-0 left-0 z-10 overflow-hidden rounded-xl border bg-white"
        style={{ width: '37%', height: '64%', borderColor: '#e8e8e8', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
      >
        <div className="relative flex h-[40px] items-center border-b border-[#efefef] px-3.5">
          <TrafficDots />
          <span className="absolute inset-0 flex items-center justify-center text-[13.5px] text-[#8b8b8b]" style={KR}>
            사장님
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[40px]" aria-hidden>
          <span className="absolute bottom-0 top-0 border-l border-dashed border-[#ececec]" style={{ left: '33.3%' }} />
          <span className="absolute bottom-0 top-0 border-l border-dashed border-[#ececec]" style={{ left: '66.6%' }} />
        </div>
        {/* 자연어 지시 카드 */}
        <div className="absolute inset-x-0 top-[40px] bottom-0 flex items-center justify-center px-3">
          <span
            className="rounded-lg border bg-white px-3.5 py-3 text-center text-[13px] font-medium leading-[1.45] text-text-primary"
            style={{ borderColor: '#e3e3e3', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', ...KR }}
          >
            오늘 찍은 사진으로
            <br />
            신메뉴 소식 올려줘
          </span>
        </div>
      </div>
    </div>
  );
}

/* 제품 텍스트 칸 — 큰 로고 + 정식 제품명 / 헤딩 / 서브 1줄 / 버튼(좌우 레이아웃 원복 2026-07-15).
   01/02/03 인덱스 레일 = 목업 StepHead와 중복이라 삭제(사장님 2026-07-15, 유지).
   sticky = 긴 목업을 스크롤하는 동안 텍스트 동행(§8.16-C) */
function ProductText({
  logo,
  name,
  headHtml,
  desc,
  href,
  cta,
}: {
  logo: string;
  name: string;
  headHtml: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="sticky top-20 px-8 py-10 lg:px-12">
      <div className="mb-7 flex items-center gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={`${name} 로고`} style={{ height: 48, width: 48, display: 'block' }} />
        <span className="text-[19px] font-bold tracking-[-0.02em] text-text-primary" style={KR}>
          {name}
        </span>
      </div>
      <h2
        className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold leading-[1.28] tracking-[-0.04em] text-text-primary"
        style={KR}
        dangerouslySetInnerHTML={{ __html: headHtml }}
      />
      <p className="mt-5 text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] tracking-[-0.01em] text-[#4f4f4f] md:leading-[1.35]" style={KR}>
        {desc}
      </p>
      <div className="mt-8">
        <Link
          href={href}
          style={{ color: '#ffffff' }}
          className="rounded-pill inline-flex items-center gap-2 bg-[#171717] px-5 py-3 text-[15px] font-semibold tracking-[-0.02em] no-underline transition-colors duration-200 hover:bg-[#333]"
        >
          {cta}
          <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ★2026-09-18 개선안 §3.2 "두 상품을 결과 중심으로 소개" 반영.
   【왜】구 헤드 "검색할 때 우리 가게를 찾을 수 있도록"은 **검색 노출 하나**에 초점이 맞아
     서비스를 좁게 소개한다(개선안 §2 "사진을 블로그 글로 바꾸는 서비스라는 좁은 설명에서
     …운영 과정으로 넓힌다"). 새 헤드는 **결과**를 말한다 — 찍어둔 자료가 꾸준히 발행되는 콘텐츠가 된다.
   【문구 출처】§3.2 제안 문구를 따르되 채널 표기는 현행 판매 범위에 맞췄다.
     §3.2 원문은 "블로그·인스타그램과 짧은 영상"이지만 /content가
     "네이버 블로그 운영을 중심으로 합니다. 연결 가능한 다른 채널은 심사와 계정 상태에 따라
     달라집니다"라고 쓰고 있어, 인스타를 확정처럼 적으면 또 어긋난다(§3.2 자신도
     "실제 제공 범위와 요금 조건을 맞춰 사용한다"는 단서를 달았다).
     영상은 §7 스튜디오 도입으로 상품이 되었으므로 "짧은 영상까지"는 남겼다. */
const NC = {
  logo: '/img/logo/nc.svg?v=16',
  name: '누구나 콘텐츠',
  headHtml: '찍어둔 사진과 영상이<br>가게 콘텐츠가 됩니다',
  desc: '블로그 글과 짧은 영상까지 준비하고, 발행 일정과 검색 노출을 한곳에서 확인합니다',
  href: '/content',
  cta: '노출 살펴보기',
  tint: '#0070f3', // 제품 컬러 코딩(모바일 스티키 바 라인 — S7 점 색과 동일 계열)
};
const NA = {
  logo: '/img/logo/na.svg?v=20',
  name: '누구나 광고',
  headHtml: '광고를 만들고 운영하며<br>매출과 성과를 이해합니다',
  desc: '메타·구글 광고를 만들고, 쇼핑몰 매출과 광고 성과를 한 화면에서 확인합니다',
  href: '/ads',
  cta: '광고 살펴보기',
  tint: '#0aa5c9',
};

/* 모바일 캐러셀 데이터 — 스텝 라벨 = S41/S42 StepHead 정본(카피 토씨 그대로) */
const NC_MOBILE: CarouselProduct = {
  logo: NC.logo, name: NC.name, headHtml: NC.headHtml, href: NC.href, cta: NC.cta, dot: NC.tint,
  cardBg: '#ffffff', // 흰 카드 — 회색이면 폰 목업 그림자가 아래를 어둡게 해 그라데이션처럼 보임(사장님 지적). 흰색이면 그림자 자연
  holderLine: '#E8EAED', // 하단 홀더 립 경계선
  /* ★2026-09-18 개선안 §4.9 교정표 반영.
     【왜】① "사진 4장만" = 장수를 못박아 실제보다 좁게 들린다. 콘텐츠 페이지는 이미 "사진 몇 장과
       짧은 메모"로 쓰고 있어 같은 사이트가 서로 다른 말을 하고 있었다(lib/content/content.ts).
     ② "글이 자동으로 완성되고" = 글 한 편으로 끝나는 도구처럼 읽힌다 → 채널에 맞는 콘텐츠.
     ③ "검색에서 찾아져요" = **반드시 찾아진다는 보장으로 읽힌다.** 앱이 하는 일은 발행 후
       노출 위치를 확인하는 것이다(⛔ 순위·노출 보장 금지 — CLAUDE.md 금지 게이트).
     ⚠ 문구를 §4.9 원문("사진·영상 몇 개와 짧은 메모를 올리면" 등) 그대로 넣지 않은 이유 =
       옆 그림이 사진 4장·블로그 글 하나를 그리고 있어 글과 그림이 또 따로 놀게 된다.
       그림까지 바꾸는 개편은 §3.2 몫 — 여기서는 그림과 어긋나지 않는 선까지만 고쳤다. */
  steps: [
    { n: '01', label: '사진 몇 장만 올리면' },
    { n: '02', label: '채널에 맞는 글이 되고' },
    { n: '03', label: '검색 위치까지 확인합니다' },
  ],
};
const NA_MOBILE: CarouselProduct = {
  logo: NA.logo, name: NA.name, headHtml: NA.headHtml, href: NA.href, cta: NA.cta, dot: NA.tint,
  cardBg: '#ffffff', // 흰 카드 — 회색이면 폰 목업 그림자가 아래를 어둡게 해 그라데이션처럼 보임(사장님 지적). 흰색이면 그림자 자연
  holderLine: '#E8EAED', // 하단 홀더 립 경계선
  steps: [
    { n: '01', label: '광고를 만들고' },
    { n: '02', label: '성과를 한 화면에서 보고' },
    { n: '03', label: '궁금한 건 바로 물어봐요' },
  ],
};

export default function TwoAppsRail() {
  const defRevealRef = useRevealOnView<HTMLDivElement>();
  const renderD = (key: string) => {
    if (key === 'def-text')
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          {/* 배경 도트 그리드(옅게, edge mask §8.14-6) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              WebkitMaskImage: 'radial-gradient(ellipse 82% 84% at 50% 50%, #000 45%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 82% 84% at 50% 50%, #000 45%, transparent 100%)',
            }}
          />
          {/* 십자 마커 제거(⛔ 십자는 그리드 교차점에만 — 칸 안쪽 인셋 = "볼트마냥" 반려 2026-07-15) */}
          <div className="relative w-full px-8 text-center">
            <span className="mb-7 flex items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
                <path d="M7.2 3.4c.32 1.5 1.14 2.34 2.65 2.66-1.51.32-2.33 1.15-2.65 2.66-.32-1.51-1.14-2.34-2.65-2.66 1.51-.32 2.33-1.16 2.65-2.66Z" fill="#333333" />
              </svg>
              <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#555555]" style={{ fontFamily: 'var(--font-en)' }}>
                Nugoona Company
              </span>
            </span>
            <h2
              className="text-[clamp(2.2rem,4.6vw,3.7rem)] font-bold leading-[1.26] tracking-[-0.045em] text-text-primary"
              style={KR}
              dangerouslySetInnerHTML={{ __html: homeV2.twoAppsHead }}
            />
            {/* 분기 플로우(Clone01) — 회사 → 두 서비스 */}
            <div className="mt-12">
              <BranchFlow uid="s4d" />
            </div>
          </div>
        </div>
      );
    if (key === 'text1') return <ProductText {...NC} />;
    if (key === 'text2') return <ProductText {...NA} />;
    if (key === 'mock1') return <div className="w-full max-w-[620px] px-6 py-8"><S41SearchScene /></div>;
    return <div className="w-full max-w-[620px] px-6 py-8"><S42AdScene /></div>;
  };

  return (
    <section className="w-full bg-bg">
      {/* 모바일 — 제품 = 가로 스냅 캐러셀(peek+스텝 도트, 사장님 2026-07-15 확정). PC 무영향 */}
      <div className="md:hidden">
        {/* 모바일 리듬 표준 py-20(사장님 2026-07-15 "따닥따닥 조잡" — 여백도 디자인) */}
        <div ref={defRevealRef} data-reveal="wait" className="border-b border-[#ECECEC] px-4 py-20">
          <h2
            className="text-center text-[clamp(1.5rem,6vw,2.2rem)] font-bold leading-[1.3] tracking-[-0.04em] text-text-primary"
            style={KR}
          >
            <RevealHtmlLines html={homeV2.twoAppsHead} />
          </h2>
          <div className="mt-10">
            <BranchFlow uid="s4m" />
          </div>
        </div>
        <MobileProductCarousel p={NC_MOBILE} Mock={NcMobileMock} />
        <MobileProductCarousel p={NA_MOBILE} Mock={NaMobileMock} />
      </div>

      {/* PC — 풀폭 헤딩 칸 + 제품별 좌 텍스트/우 목업 2열(원복 2026-07-15) */}
      <OccupancyGrid cols={12} rows={34} areas={D_AREAS} checker mobile={false} render={renderD} />
    </section>
  );
}
