'use client';

/* ══════════════════════════════════════════════════════════════════════════
   S8 — 실물/사진 은유 (Real Photo Metaphor)
   ──────────────────────────────────────────────────────────────────────────
   랜딩용 개념 그래픽 · 재사용 라이브러리
   ▸ 개념: "내가 찍은 이 사진 4장이 → 그대로 네이버·구글 검색 결과에 노출된다"
   ▸ 스타일⑧: 일러스트/다이어그램 대신 진짜 사진으로 은유. 해석 비용 0, 즉각적 신뢰.
   ▸ 동작: 위에 떠 있던 실물 사진이 검색결과 카드 안 썸네일 슬롯으로 "쏙" 내려앉는다.

   ⚠️ 사진 소스 주의:
     public/img/unsplash/webp/ 폴더에는 음식/카페 사진이 없고 전부 패션 상품샷이다.
     그래서 기본 사진은 감성 상품 플랫레이(니트·데님)로 두고, 검색 맥락도 "매장/스토어"
     범용 톤으로 잡았다. 실제 사용처(음식점 등)에서는 photoSrc·매장 정보 props만 갈아끼우면 된다.
     사진 로드 실패 시 accent 플레이스홀더로 폴백한다.

   재사용: 모든 텍스트/사진은 props. 기본값만으로도 자족적으로 렌더된다.
   ══════════════════════════════════════════════════════════════════════════ */

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, type Variants } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as React.CSSProperties;
const ACCENT = '#0070f3';
const EASE = [0.16, 1, 0.3, 1] as const;

export interface S8RealPhotoProps {
  /** 검색결과 상단에 안착하는 실물 사진 경로 (public 기준 절대경로) */
  photoSrc?: string;
  photoAlt?: string;
  /** 검색창에 입력된 검색어 */
  query?: string;
  /** 내 결과 = 매장/스토어 이름 */
  storeName?: string;
  /** 카테고리 라벨 (예: "니트·가디건 · 편집숍") */
  category?: string;
  /** 별점 (0~5) */
  rating?: number;
  /** 리뷰 수 */
  reviewCount?: number;
  /** 주소/위치 한 줄 */
  address?: string;
  /** 사진 위 손글씨 칩 문구 */
  photoLabel?: string;
  /** 상단 캡션(개념 설명) 노출 여부 */
  showCaption?: boolean;
  className?: string;
}

/* ── 애니메이션 변주 ─────────────────────────────────────────── */
// 검색 화면(브라우저 창)이 먼저 부드럽게 등장
const screenV: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
// 실물 사진: 위에서 살짝 기울어진 채 떠 있다가 → 슬롯 안으로 쏙 내려앉음
const photoV: Variants = {
  hidden: { opacity: 0, y: -54, scale: 1.16, rotate: -5 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.85, ease: EASE, delay: 0.55 },
  },
};
// 촬영 프레임(코너 마크): 진입 중 잠깐 보였다가 안착하면 사라짐 → "직접 찍은 사진"임을 암시
const shutterV: Variants = {
  hidden: { opacity: 0 },
  shown: {
    opacity: [0, 0.9, 0.9, 0],
    transition: { duration: 1.4, times: [0, 0.35, 0.7, 1], delay: 0.45, ease: 'easeInOut' },
  },
};
// accent 강조 링: 사진이 안착한 뒤 한 번 번짐
const ringV: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  shown: {
    opacity: [0, 1, 0.55],
    scale: [0.9, 1.02, 1],
    transition: { duration: 0.7, delay: 1.35, ease: 'easeOut' },
  },
};
// "검색 노출" 뱃지: 톡 튀어나옴
const badgeV: Variants = {
  hidden: { opacity: 0, scale: 0, y: 6 },
  shown: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 520, damping: 22, delay: 1.5 },
  },
};
// "내가 올린 사진" 칩
const chipV: Variants = {
  hidden: { opacity: 0, y: -8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.7 } },
};

/* ── 아이콘 ────────────────────────────────────────────────── */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="9" r="6" />
      <path d="M14 14l4 4" />
    </svg>
  );
}
function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[1px] align-middle" aria-label={`별점 ${rating}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block w-[13px] h-[13px]">
            <svg viewBox="0 0 20 20" className="absolute inset-0 w-full h-full" fill="#e2e2e2">
              <path d="M10 1.6l2.6 5.3 5.8.85-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.75l5.8-.85z" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 20 20" className="w-[13px] h-[13px]" fill={ACCENT}>
                <path d="M10 1.6l2.6 5.3 5.8.85-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.75l5.8-.85z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function S8RealPhoto({
  photoSrc = '/img/unsplash/webp/photo-1556905055-8f358a7a47b2.webp',
  photoAlt = '내가 직접 찍어 올린 매장 상품 사진',
  query = '연남동 니트 편집숍',
  storeName = '무드니트 연남점',
  category = '니트·가디건 · 여성의류 편집숍',
  rating = 4.9,
  reviewCount = 328,
  address = '서울 마포구 연남동 · 도보 3분',
  photoLabel = '내가 올린 사진',
  showCaption = true,
  className,
}: S8RealPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-90px' });
  const [imgError, setImgError] = useState(false);

  const run = inView ? 'shown' : 'hidden';

  return (
    <div ref={ref} className={`w-full ${className ?? ''}`}>
      {/* ── 상단 캡션: 중학생도 5초에 이해 ───────────────────── */}
      {showCaption && (
        <motion.div
          variants={screenV}
          initial="hidden"
          animate={run}
          className="mx-auto max-w-[560px] px-6 text-center mb-8 max-md:mb-6"
        >
          <p className="text-[12px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: ACCENT, ...EN }}>
            My Photo → Search
          </p>
          <p className="text-[clamp(19px,2.6vw,26px)] font-semibold leading-[1.35] tracking-[-0.02em] text-[#111]">
            내가 찍은 사진 <span style={{ color: ACCENT }}>4장</span>이
            <br className="max-md:hidden" /> 그대로 <span style={{ color: ACCENT }}>검색에 노출</span>됩니다
          </p>
        </motion.div>
      )}

      {/* ── 검색 화면 (네이버 톤 통합검색) ───────────────────── */}
      <motion.div
        variants={screenV}
        initial="hidden"
        animate={run}
        className="mx-auto w-full max-w-[560px] bg-white border border-[#e5e5e5] overflow-hidden"
        style={{ boxShadow: '0 24px 60px -28px rgba(0,0,0,0.28)' }}
      >
        {/* 브라우저 크롬 */}
        <div className="flex items-center gap-3 px-4 h-11 border-b border-[#eee] bg-[#fafafa]">
          <div className="flex items-center gap-[6px] shrink-0">
            <span className="w-[10px] h-[10px] bg-[#e0e0e0]" />
            <span className="w-[10px] h-[10px] bg-[#e0e0e0]" />
            <span className="w-[10px] h-[10px] bg-[#e0e0e0]" />
          </div>
          <div className="flex-1 h-6 bg-white border border-[#e5e5e5] flex items-center px-3">
            <span className="text-[10px] text-[#aaa] truncate" style={EN}>
              search.naver.com / 통합검색
            </span>
          </div>
        </div>

        {/* 검색 입력줄 */}
        <div className="px-5 pt-5 pb-4 max-md:px-4">
          <div className="flex items-stretch border-2 border-[#111] h-12">
            <div className="flex-1 flex items-center px-4 gap-2 min-w-0">
              <span className="text-[16px] font-semibold text-[#111] truncate">{query}</span>
              <motion.span
                aria-hidden
                className="inline-block w-[2px] h-[18px] shrink-0"
                style={{ background: '#111' }}
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="w-12 shrink-0 flex items-center justify-center text-white"
              style={{ background: ACCENT }}
              aria-label="검색"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 검색 탭 */}
          <div className="flex gap-5 mt-4 text-[13px]">
            {['통합', 'VIEW', '지도', '이미지', '블로그'].map((t, i) => (
              <span
                key={t}
                className="pb-2 font-medium"
                style={
                  i === 0
                    ? { color: ACCENT, borderBottom: `2px solid ${ACCENT}` }
                    : { color: '#aaa' }
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 결과 영역 */}
        <div className="px-5 pb-6 max-md:px-4">
          {/* ▼▼ 내 결과 카드 (accent 강조) ▼▼ */}
          <div className="relative border-l-[3px] pt-3" style={{ borderColor: ACCENT }}>
            <div className="pl-4 pr-1 max-md:pl-3">
              {/* 결과 라벨 */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-[3px] text-[10px] font-bold text-white"
                  style={{ background: ACCENT, ...EN }}
                >
                  <span className="w-[5px] h-[5px] bg-white inline-block" />
                  플레이스 · 내 매장
                </span>
                <span className="text-[11px] text-[#bbb]" style={EN}>ad · 정확도순</span>
              </div>

              {/* ── 사진이 쏙 들어가는 썸네일 슬롯 ── */}
              <div className="relative w-full aspect-[16/10] bg-[#f2f2f2] overflow-hidden">
                {/* accent 강조 링 (안착 후 번짐) */}
                <motion.span
                  aria-hidden
                  variants={ringV}
                  initial="hidden"
                  animate={run}
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 3px ${ACCENT}` }}
                />

                {/* 실물 사진 (위에서 내려앉음) */}
                <motion.div variants={photoV} initial="hidden" animate={run} className="absolute inset-0 z-10">
                  {imgError ? (
                    // 폴백: accent 플레이스홀더
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${ACCENT}, #4a9bff)` }}
                    >
                      <svg className="w-9 h-9 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="6" width="18" height="14" />
                        <circle cx="12" cy="13" r="3.4" />
                        <path d="M8 6l1.4-2h5.2L16 6" />
                      </svg>
                      <span className="text-[11px] text-white/90 font-medium">내가 올린 사진</span>
                    </div>
                  ) : (
                    <Image
                      src={photoSrc}
                      alt={photoAlt}
                      fill
                      sizes="(max-width: 768px) 90vw, 520px"
                      className="object-cover"
                      onError={() => setImgError(true)}
                    />
                  )}
                </motion.div>

                {/* 촬영 프레임 코너 마크 (진입 중 잠깐) */}
                <motion.div
                  aria-hidden
                  variants={shutterV}
                  initial="hidden"
                  animate={run}
                  className="absolute inset-3 z-30 pointer-events-none"
                >
                  {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
                    <span
                      key={c}
                      className="absolute w-5 h-5 border-white"
                      style={{
                        top: c[0] === 't' ? 0 : undefined,
                        bottom: c[0] === 'b' ? 0 : undefined,
                        left: c[1] === 'l' ? 0 : undefined,
                        right: c[1] === 'r' ? 0 : undefined,
                        borderTopWidth: c[0] === 't' ? 2 : 0,
                        borderBottomWidth: c[0] === 'b' ? 2 : 0,
                        borderLeftWidth: c[1] === 'l' ? 2 : 0,
                        borderRightWidth: c[1] === 'r' ? 2 : 0,
                      }}
                    />
                  ))}
                </motion.div>

                {/* "내가 올린 사진" 손글씨 칩 */}
                <motion.span
                  variants={chipV}
                  initial="hidden"
                  animate={run}
                  className="absolute top-2 left-2 z-30 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[#111] bg-white/95"
                  style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.3)' }}
                >
                  📸 {photoLabel}
                </motion.span>

                {/* "검색 노출" 뱃지 */}
                <motion.span
                  variants={badgeV}
                  initial="hidden"
                  animate={run}
                  className="absolute bottom-2 right-2 z-30 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white"
                  style={{ background: '#111', ...EN }}
                >
                  <span style={{ color: ACCENT }}>▲</span> 검색 노출
                </motion.span>
              </div>

              {/* 매장 정보 (네이버 플레이스 톤) */}
              <div className="pt-3 pb-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-[17px] font-bold text-[#111] tracking-[-0.01em]">{storeName}</h3>
                  <span className="text-[12px] text-[#888]">{category.split(' · ')[0]}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <StarRow rating={rating} />
                  <span className="text-[13px] font-bold" style={{ color: ACCENT, ...EN }}>{rating.toFixed(1)}</span>
                  <span className="text-[12px] text-[#999]">
                    리뷰 <b className="text-[#555]" style={EN}>{reviewCount.toLocaleString('ko-KR')}</b>
                  </span>
                </div>
                <p className="text-[12px] text-[#999] mt-1.5">{address}</p>
              </div>
            </div>
          </div>

          {/* ▼ 다른 결과들 (흐릿한 대비) ▼ */}
          <div className="mt-1 space-y-4 opacity-45">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3 pl-4 max-md:pl-3 border-l-[3px] border-transparent">
                <div className="w-[72px] h-[72px] bg-[#ececec] shrink-0" />
                <div className="flex-1 min-w-0 pt-1">
                  <div className="h-3.5 bg-[#e6e6e6] w-2/5 mb-2" />
                  <div className="h-2.5 bg-[#eee] w-3/5 mb-1.5" />
                  <div className="h-2.5 bg-[#eee] w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 하단 한 줄 결론 ─────────────────────────────────── */}
      {showCaption && (
        <motion.p
          variants={screenV}
          initial="hidden"
          animate={run}
          className="mx-auto max-w-[560px] px-6 text-center mt-7 text-[13px] text-[#999] leading-[1.6]"
        >
          블로그 원고 · 지도 등록 · 상품 노출까지, 사진 4장이 검색 곳곳에 자동으로 올라갑니다.
        </motion.p>
      )}
    </div>
  );
}
