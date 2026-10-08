'use client';

import { homeV2 } from '@/lib/content/home';

/**
 * 자산 섹션 모바일 — 안 A "타임라인 이음선"(사장님 택 2026-07-16, /lab/assets에서 확정 후 이식).
 *   헤드라인 → 왼쪽 세로 이음선(spine)에서 두 제품이 accent 노드로 분기.
 *   각 제품 = 텍스트(로고+이름+메시지) 좌 + 미니 목업 우(작게, 라운드·그림자 없음 — 사장님).
 * 결론 배너는 S6 모바일에 기존 그대로 둔다(이 컴포넌트는 헤드+제품까지). PC(OccupancyGrid) 불변.
 * 카피 = home.ts homeV2.asset 정본.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const EN = { fontFamily: 'var(--font-en)' } as const;
const ACCENT = '#0070f3';

const POSTS = [
  { t: '봄 신메뉴 3종 소개', img: '/img/unsplash/webp/photo-1504674900247-0877df9cc836.webp' },
  { t: '주말 디너 코스', img: '/img/unsplash/webp/photo-1414235077428-338989a2e8c0.webp' },
];
const BARS = [10, 16, 9, 19, 13, 22, 17];

/* 미니 콘텐츠 목업 — 작은 브라우저 창 + 글 카드 2장(라운드·그림자 없음) */
function MiniContent() {
  return (
    <div className="w-[132px] shrink-0 overflow-hidden border border-[#e2e2e2] bg-white">
      <div className="flex items-center gap-[3px] border-b border-[#f0f0f0] bg-[#fafafa] px-2 py-1.5">
        <span className="h-[6px] w-[6px] rounded-dot bg-[#ec6a5e]" />
        <span className="h-[6px] w-[6px] rounded-dot bg-[#f4bf4f]" />
        <span className="h-[6px] w-[6px] rounded-dot bg-[#61c454]" />
        <span className="ml-1 truncate text-[8px] text-[#9aa0a6]" style={KR}>고객님의 블로그</span>
      </div>
      <div className="space-y-1.5 p-2">
        {POSTS.map((p) => (
          <div key={p.t} className="overflow-hidden border border-[#f0f0f0] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" className="h-[34px] w-full object-cover" loading="lazy" />
            <p className="truncate px-1.5 py-1 text-[8.5px] font-semibold text-[#171717]" style={KR}>{p.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 미니 광고 목업 — 리포트 카드 축소(라운드·그림자 없음) */
function MiniReport() {
  return (
    <div className="w-[132px] shrink-0 overflow-hidden border border-[#e2e2e2] bg-white">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-2 py-1.5">
        <span className="text-[9px] font-semibold text-[#171717]" style={KR}>4월 리포트</span>
        <svg width="12" height="12" viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="4" y="2.5" width="14" height="17" rx="2.5" stroke="#9a9a9a" strokeWidth="1.6" />
          <path d="M7.5 7.5h7M7.5 11h7M7.5 14.5h4.5" stroke="#9a9a9a" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="px-2.5 py-2">
        <p className="text-[8px] text-[#9aa0a6]" style={KR}>주문</p>
        <p className="text-[14px] font-bold tracking-[-0.01em] text-[#171717] [font-variant-numeric:tabular-nums]" style={EN}>
          47<span className="ml-0.5 text-[9px] font-medium text-[#9aa0a6]" style={KR}>건</span>
        </p>
        <div className="mt-2 flex h-[30px] items-end gap-[2px]" aria-hidden>
          {BARS.map((h, i) => (
            <span key={i} className="w-full" style={{ height: h, background: i === BARS.length - 2 ? '#171717' : '#E6E8EB' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MobileAssetTimeline() {
  const { head, cells } = homeV2.asset;
  const products = [
    { logo: '/img/brand/content/symbol.svg', name: '누구나 콘텐츠', msg: cells[0].msg, mock: <MiniContent /> },
    { logo: '/img/brand/ad/symbol.svg', name: '누구나 광고', msg: cells[1].msg, mock: <MiniReport /> },
  ];

  return (
    <div className="mx-auto max-w-[390px]">
      {/* 헤드라인(좌측 정렬 — 이음선이 왼쪽에서 시작) */}
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a6]" style={EN}>Asset</span>
      <h2 className="mt-2 text-[27px] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary" style={KR} dangerouslySetInnerHTML={{ __html: head }} />

      {/* 이음선(spine) + 두 제품 분기 */}
      <div className="relative mt-9">
        <span aria-hidden className="absolute left-[4px] top-2 bottom-8 w-px bg-[#d9d9d9]" />
        {products.map((p) => (
          <div key={p.name} className="relative py-5 pl-8">
            {/* 노드(accent 점) + 가로 가지 */}
            <span aria-hidden className="absolute left-[4px] top-[26px] h-[9px] w-[9px] -translate-x-1/2 rounded-dot" style={{ background: ACCENT }} />
            <span aria-hidden className="absolute left-[8px] top-[30px] h-px w-5" style={{ background: 'rgba(0,112,243,0.45)' }} />

            {/* 텍스트 좌 + 미니 목업 우 */}
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={`${p.name} 로고`} style={{ height: 34, width: 34, display: 'block' }} />
                  <span className="text-[14px] font-bold tracking-[-0.01em] text-text-primary" style={KR}>{p.name}</span>
                </span>
                <h3 className="mt-2.5 text-[16px] font-bold leading-[1.4] tracking-[-0.02em] text-text-primary" style={KR} dangerouslySetInnerHTML={{ __html: p.msg }} />
              </div>
              {p.mock}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
