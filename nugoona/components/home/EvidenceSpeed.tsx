'use client';

import { useState, useEffect, useRef } from 'react';
import FadeUp from '@/components/motion/FadeUp';
import GridDivider from '@/components/ui/GridDivider';


const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ── Product data ── */
interface Product {
  brand: string;
  adName: string;
  emoji: string;
  headline: string;
  bullets: string[];
  review: string;
  title: string;
  landingUrl: string;
  image: string;
}

const products: Product[] = [
  {
    brand: '르비앙',
    adName: '[20260216][단일][캐시미어블렌드코트]',
    emoji: '🧥',
    headline: '가을 무드 그대로, 캐시미어 블렌드 코트',
    bullets: ['봄·가을 간절기 필수템', '오버핏이라 레이어드 자유자재', '지금 주문 시 무료 배송'],
    review: '리뷰 2,100개 · 재구매율 34%',
    title: '캐시미어 블렌드 코트',
    landingUrl: 'levian.cafe24.com/product/detail?product_no=12345',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop',
  },
  {
    brand: '모드하우스',
    adName: '[20260216][단일][플리츠미디스커트]',
    emoji: '👗',
    headline: '하루종일 편한 실루엣, 플리츠 미디스커트',
    bullets: ['구김 없는 플리츠 디테일', 'A라인 핏으로 체형 커버', '오피스부터 데이트까지'],
    review: '리뷰 890개 · 재구매율 28%',
    title: '플리츠 미디스커트',
    landingUrl: 'modehouse.cafe24.com/product/detail?product_no=67890',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop',
  },
  {
    brand: '어반시크',
    adName: '[20260216][단일][오버사이즈니트가디건]',
    emoji: '🧶',
    headline: '이 한 장이면 충분해, 오버사이즈 니트 가디건',
    bullets: ['부드러운 울 블렌드 소재', '어깨 드롭으로 여유있는 핏', '아이보리·차콜·카멜 3컬러'],
    review: '리뷰 1,340개 · 재구매율 41%',
    title: '오버사이즈 니트 가디건',
    landingUrl: 'urbanchic.cafe24.com/product/detail?product_no=24680',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
  },
  {
    brand: '블랑코',
    adName: '[20260216][단일][미니크로스백]',
    emoji: '👜',
    headline: '가볍게 들고 나가세요, 미니 크로스백',
    bullets: ['천연 소가죽 100%', '수납력 좋은 3칸 구조', '숄더·크로스 2WAY 스트랩'],
    review: '리뷰 760개 · 재구매율 22%',
    title: '미니 크로스백',
    landingUrl: 'blanco.cafe24.com/product/detail?product_no=13579',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
  },
];

/* ════════════════════════════════════════════════════════════
   Instagram Ad Preview — 좌측
   ════════════════════════════════════════════════════════════ */
function InstagramPreview({ phase, product }: { phase: string; product: Product }) {
  const isLoading = phase === 'loading';
  const showImage = phase === 'done';
  const showCopy = phase === 'done';

  return (
    <div className="bg-white border border-border-default overflow-hidden">
      {/* Profile Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-light">
        <div className="w-8 h-8 rounded-dot bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]" />
        <div>
          <p className="text-[11px] font-semibold text-text-primary" style={EN}>
            {product.brand}
          </p>
          <p className="text-[9px] text-text-weak">광고</p>
        </div>
      </div>

      {/* Product Image */}
      <div
        className="aspect-[4/5] relative overflow-hidden"
        style={{
          background: 'linear-gradient(#f0f0f0, #f0f0f0) padding-box, linear-gradient(135deg, #3b82f6, #a855f7, #ec4899) border-box',
          border: '2.5px solid',
          borderColor: isLoading ? 'transparent' : '#f0f0f0',
          boxShadow: isLoading ? '0 0 20px rgba(168, 85, 247, 0.2), 0 0 6px rgba(139, 92, 246, 0.15)' : 'none',
          transition: 'border-color 0.5s, box-shadow 0.5s',
        }}
      >
        {/* loading spinner */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-500"
          style={{ opacity: isLoading ? 1 : 0, pointerEvents: 'none' }}
        >
          <Spinner />
          <p className="text-[11px] text-text-muted">상세페이지에서 이미지 가져오는 중</p>
        </div>
        {/* actual image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: showImage ? 1 : 0 }}
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-4">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <path d="M12 21s-7-5.5-7-10A5 5 0 0112 6a5 5 0 017 5c0 4.5-7 10-7 10z" strokeLinejoin="round" />
          </svg>
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinejoin="round" />
          </svg>
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Ad Copy — values only */}
      <div className="px-4 pb-4" style={{ opacity: showCopy ? 1 : 0, transition: 'opacity 0.5s' }}>
        <p className="text-[12px] font-normal text-[#1a1a1a] mb-2">
          <span className="mr-1">{product.emoji}</span>
          {product.headline}
        </p>
        <div className="flex flex-col gap-1 mb-2.5">
          {product.bullets.map((txt, i) => (
            <p key={i} className="text-[11px] text-text-body flex items-center gap-1.5">
              <span className="text-[#22c55e]">✓</span>
              {txt}
            </p>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary">
          <span className="text-[#F9AB00] mr-1">★</span>
          {product.review}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Ad Settings Form — 우측
   ════════════════════════════════════════════════════════════ */
/* Spinner component */
function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function AdSettingsForm({ phase, product }: { phase: string; product: Product }) {
  const isLoading = phase === 'loading';
  const isDone = phase === 'done';
  const val: React.CSSProperties = { opacity: isDone ? 1 : 0, transition: 'opacity 0.5s' };

  return (
    <div className="bg-white border border-border-default p-4 max-md:p-3 flex flex-col">
      {/* Ad Name */}
      <div className="mb-3 max-md:mb-2">
        <div className="flex items-baseline gap-3 border-b border-border-light pb-2">
          <p className="text-[12px] text-text-secondary font-medium shrink-0">광고이름</p>
          <span className="text-[12px] text-text-body truncate" style={{ ...EN, ...val }}>
            {product.adName}
          </span>
        </div>
      </div>

      {/* Main Copy */}
      <div className="mb-3 max-md:mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[12px] text-text-secondary font-medium">주요 문구</p>
          <span className="text-[10px] text-accent cursor-pointer" style={{ ...EN, ...val }}>수정</span>
        </div>
        <div
          className="p-2.5 min-h-[100px] max-md:min-h-[70px] max-md:p-2 relative"
          style={{
            background: 'linear-gradient(#fafafa, #fafafa) padding-box, linear-gradient(135deg, #3b82f6, #a855f7, #ec4899) border-box',
            border: '2.5px solid',
            borderColor: isLoading ? 'transparent' : 'var(--color-border-light)',
            boxShadow: isLoading ? '0 0 20px rgba(168, 85, 247, 0.2), 0 0 6px rgba(139, 92, 246, 0.15)' : 'none',
            transition: 'border-color 0.5s, box-shadow 0.5s',
          }}
        >
          {/* loading */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            style={{ opacity: isLoading ? 1 : 0, pointerEvents: 'none' }}
          >
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <p className="text-[11px] text-text-muted">AI가 문구를 분석중</p>
            </div>
          </div>
          {/* done */}
          <div className="w-full transition-opacity duration-500" style={{ opacity: isDone ? 1 : 0 }}>
            <p className="text-[12px] text-text-body mb-2">
              {product.emoji} {product.headline}
            </p>
            <div className="flex flex-col gap-0.5">
              {product.bullets.map((t, i) => (
                <p key={i} className="text-[11px] text-text-secondary">
                  <span className="text-[#22c55e] mr-1">✓</span>{t}
                </p>
              ))}
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              <span className="text-[#F9AB00] mr-1">★</span>{product.review}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-light my-1 mb-2" />

      {/* Title Field */}
      <div className="mb-2.5 max-md:mb-2">
        <div className="flex items-baseline gap-3 mb-1 max-md:mb-1">
          <p className="text-[12px] text-text-secondary font-medium shrink-0">제목</p>
          <div className="flex-1 border border-border-light px-2.5 py-1.5">
            <p className="text-[12px] text-text-primary truncate" style={val}>{product.title}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {['상품명', '가격', '직접입력'].map((tab, i) => (
            <span
              key={i}
              className={`text-[11px] px-2.5 py-1 border ${
                i === 0
                  ? 'bg-[#22c55e] text-white border-[#22c55e] font-semibold'
                  : 'text-text-muted border-border-default'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Description Field */}
      <div className="mb-2.5 max-md:mb-2">
        <div className="flex items-baseline gap-3 mb-1 max-md:mb-1">
          <p className="text-[12px] text-text-secondary font-medium shrink-0">설명</p>
          <div className="flex-1 border border-border-light px-2.5 py-1.5">
            <p className="text-[12px] text-text-primary truncate" style={val}>{product.brand}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {['브랜드', '직접입력'].map((tab, i) => (
            <span
              key={i}
              className={`text-[11px] px-2.5 py-1 border ${
                i === 0
                  ? 'bg-[#22c55e] text-white border-[#22c55e] font-semibold'
                  : 'text-text-muted border-border-default'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Ad Set */}
      <div className="mb-2.5 max-md:mb-2">
        <p className="text-[12px] text-text-secondary font-medium mb-1">광고세트</p>
        <div className="flex gap-1.5">
          {['전환', '유입', '전환+유입'].map((tab, i) => (
            <span
              key={i}
              className={`text-[11px] px-2.5 py-1 border ${
                i === 0
                  ? 'bg-[#22c55e] text-white border-[#22c55e] font-semibold'
                  : 'text-text-muted border-border-default'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Landing URL */}
      <div className="mb-3 max-md:mb-2">
        <div className="flex items-baseline gap-3">
          <p className="text-[12px] text-text-secondary font-medium shrink-0">랜딩 URL</p>
          <div className="flex-1 border border-border-light px-2.5 py-1.5 min-w-0">
            <p className="text-[12px] text-text-muted truncate" style={{ ...EN, ...val }}>
              {product.landingUrl}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <div className={`text-center py-2.5 transition-colors duration-500 ${isDone ? 'bg-[#22c55e]' : 'bg-[#ccc]'}`}>
          <span className="text-[14px] font-semibold text-white">게시하기</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EvidenceSpeed — Main Section (Dark)
   ════════════════════════════════════════════════════════════ */
export default function EvidenceSpeed() {
  /* Phase: loading → done → loading → done (loop) */
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');
  const [productIdx, setProductIdx] = useState(0);
  const isFirstLoad = useRef(true);

  /* Phase transitions */
  useEffect(() => {
    const ms = phase === 'loading' ? 2000 : 2500;
    const t = setTimeout(() => setPhase(phase === 'loading' ? 'done' : 'loading'), ms);
    return () => clearTimeout(t);
  }, [phase]);

  /* Switch product during loading — after fade-out completes (600ms) */
  useEffect(() => {
    if (phase !== 'loading') return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const t = setTimeout(() => {
      setProductIdx((prev) => (prev + 1) % products.length);
    }, 600);
    return () => clearTimeout(t);
  }, [phase]);

  const product = products[productIdx];

  return (
    <div>
      <GridDivider />
      {/* Row 1: Dark — Hero (left) + URL bar & description (right) */}
      <div className="bg-[#0a0a0a]">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr]">
        <div className="pt-[100px] px-12 max-md:pt-16 max-md:px-6 max-md:pb-12 max-md:flex max-md:items-center max-md:justify-center md:py-[100px] md:flex md:items-center md:justify-center">
          <FadeUp>
            <div>
              <p
                className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-4"
                style={EN}
              >
                Speed
              </p>
              <p className="text-[clamp(24px,3.5vw,32px)] font-semibold text-white leading-[1.4] tracking-[-0.02em]">
                대행사 없이는 못 만들던 <span className="font-semibold text-accent">광고</span>,
                <br />
                <span className="font-semibold text-accent">이제 URL 하나</span>면 됩니다.
              </p>
            </div>
          </FadeUp>
        </div>
        <div className="relative md:border-l md:border-[rgba(255,255,255,0.1)] px-12 max-md:px-6 max-md:pt-8 max-md:pb-10 max-md:border-t max-md:border-[rgba(255,255,255,0.1)] md:pt-[120px] md:pb-0">
          <FadeUp delay={0.1} className="w-full">
            <div>
              {/* Title */}
              <p className="text-[15px] font-semibold text-[rgba(255,255,255,0.9)] mb-3">
                URL 하나로 광고 완성.
              </p>

              {/* URL input bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)]">
                <svg className="w-4 h-4 text-[rgba(255,255,255,0.3)] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="6.5" cy="6.5" r="4" />
                  <path d="M14 14l-3.5-3.5" strokeLinecap="round" />
                </svg>
                <span className="text-[13px] text-[rgba(255,255,255,0.4)] truncate" style={EN}>
                  상품 URL을 입력하세요
                </span>
              </div>

              {/* Connector — extends to Row 2 */}
              <div className="flex flex-col items-center pt-5 pb-6">
                <div className="w-[1.5px] h-6 bg-[rgba(255,255,255,0.15)]" />
                <p className="text-[14px] leading-[1.65] text-[rgba(255,255,255,0.7)] text-center my-3">
                  상품 URL만 입력하면<br />AI가 이미지·문구·타겟을 자동 생성합니다.
                </p>
                <div className="w-[1.5px] h-8 bg-[rgba(255,255,255,0.15)]" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-accent" />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
      </div>

      {/* Row 2: White alt — Instagram + Form */}
      <div className="bg-[#fafafa]">
        <div className="grid grid-cols-2 md:grid-cols-[5fr_7fr]">
          <div className="py-10 px-12 max-md:py-6 max-md:px-3 flex justify-center">
            <FadeUp delay={0.18}>
              <div className="w-[280px] max-md:w-full">
                <InstagramPreview phase={phase} product={product} />
              </div>
            </FadeUp>
          </div>
          <div className="relative md:border-l md:border-border-default py-10 px-12 max-md:py-6 max-md:px-3">
            <FadeUp delay={0.22}>
              <AdSettingsForm phase={phase} product={product} />
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
