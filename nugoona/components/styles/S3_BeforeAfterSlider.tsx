'use client';

/* ================================================================
   S3_BeforeAfterSlider — 랜딩용 개념 그래픽 (스타일③)
   ----------------------------------------------------------------
   "결과를 말 대신 손으로 만져 체험" — Before↔After 드래그 슬라이더.
   좌(Before) = 검색해도 내 가게가 안 보임 / 우(After) = 검색에 노출.
   가운데 손잡이를 좌우로 드래그(마우스·터치)하면 두 화면이 교차한다.

   구현: framer-motion drag + clip-path (신규 라이브러리 없음).
   재사용: 쿼리/가게명/경쟁결과를 props로 주입, 기본값 내장.
   ================================================================ */

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  animate,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ---------------- 타입 ---------------- */
interface ResultRow {
  name: string;
  meta: string;
  rating?: string;
}

export interface S3BeforeAfterSliderProps {
  /** 검색창에 들어갈 질의어 */
  query?: string;
  /** 내 스토어(노출 대상) 이름 */
  storeName?: string;
  /** 내 스토어 한 줄 설명 */
  storeMeta?: string;
  /** 경쟁 검색결과(내 가게가 밀려나 있던 자리) */
  competitors?: ResultRow[];
  /** 슬라이더 초기 위치(0=After 전부, 1=Before 전부). 기본 0.5 */
  initial?: number;
  className?: string;
}

/* ---------------- 기본 데이터 ---------------- */
const DEFAULT_COMPETITORS: ResultRow[] = [
  { name: '성수 감성 브런치', meta: '광고 · 방문자리뷰 1,204', rating: '4.7' },
  { name: '연무장길 베이커리', meta: '카페 · 블로그리뷰 892', rating: '4.5' },
  { name: '서울숲 로스터리', meta: '카페 · 방문자리뷰 640', rating: '4.6' },
];

/* ================================================================
   아이콘 (인라인 SVG — 외부 의존 0)
   ================================================================ */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9L12 2z" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="currentColor" />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M14.5 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M9.5 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ================================================================
   검색 UI — 두 화면이 공유하는 껍데기
   ================================================================ */
function SearchChrome({
  query,
  children,
}: {
  query: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 검색창 */}
      <div className="flex items-center gap-2 border-b border-border-default px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex flex-1 items-center gap-2 border-2 border-text-primary bg-white px-3 py-2">
          <span className="truncate text-[13px] font-medium text-text-primary sm:text-sm">{query}</span>
          <SearchIcon className="ml-auto h-4 w-4 shrink-0 text-text-primary" />
        </div>
      </div>
      {/* 탭 */}
      <div className="flex items-center gap-4 border-b border-border-light px-3 sm:px-4">
        {['통합검색', '플레이스', '블로그'].map((t, i) => (
          <span
            key={t}
            className={cn(
              'py-2 text-[11px] sm:text-xs',
              i === 1 ? 'border-b-2 border-text-primary font-semibold text-text-primary' : 'text-text-disabled',
            )}
          >
            {t}
          </span>
        ))}
      </div>
      {/* 결과 영역 */}
      <div className="flex-1 overflow-hidden px-3 py-2.5 sm:px-4 sm:py-3">{children}</div>
    </div>
  );
}

/* 결과 행 한 줄 */
function Row({
  row,
  dim = false,
}: {
  row: ResultRow;
  dim?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-3 py-2', dim && 'opacity-45 grayscale')}>
      <div className="h-10 w-10 shrink-0 bg-border-default sm:h-11 sm:w-11" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-text-primary sm:text-sm">{row.name}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-text-disabled sm:text-xs">
          {row.rating && (
            <>
              <StarIcon className="h-3 w-3 text-text-weak" />
              <span style={EN}>{row.rating}</span>
              <span className="text-border-mid">·</span>
            </>
          )}
          <span className="truncate">{row.meta}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------- BEFORE 화면 (안 보임) ---------------- */
function BeforeScreen({
  query,
  competitors,
}: {
  query: string;
  competitors: ResultRow[];
}) {
  return (
    <SearchChrome query={query}>
      <div className="flex h-full flex-col">
        {/* 경쟁 가게만 잡히고, 내 가게는 어디에도 없음 */}
        <div className="divide-y divide-border-light">
          {competitors.map((c) => (
            <Row key={c.name} row={c} dim />
          ))}
        </div>
        {/* 내 가게 = 노출 없음 */}
        <div className="mt-auto flex items-center gap-2 border-2 border-dashed border-border-mid bg-bg-alt px-3 py-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-text-disabled text-xs font-bold text-white">
            ✕
          </span>
          <p className="text-[11px] leading-tight text-text-weak sm:text-xs">
            <span className="font-semibold text-text-secondary">내 스토어</span>
            {' '}· 검색결과 어디에도 안 보임
          </p>
        </div>
      </div>
    </SearchChrome>
  );
}

/* ---------------- AFTER 화면 (검색에 노출) ---------------- */
function AfterScreen({
  query,
  storeName,
  storeMeta,
  competitors,
}: {
  query: string;
  storeName: string;
  storeMeta: string;
  competitors: ResultRow[];
}) {
  return (
    <SearchChrome query={query}>
      <div className="flex h-full flex-col">
        {/* 내 스토어가 검색결과에 accent로 노출 */}
        <div className="relative flex items-center gap-3 border-2 border-accent bg-accent-bg px-3 py-2.5">
          <span className="absolute -top-px right-0 bg-accent px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white sm:text-[10px]">
            검색 노출
          </span>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-white sm:h-11 sm:w-11">
            <PinIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-text-primary sm:text-sm">{storeName}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-text-weak sm:text-xs">
              <StarIcon className="h-3 w-3 text-accent" />
              <span style={EN}>4.9</span>
              <span className="text-border-mid">·</span>
              <span className="truncate">{storeMeta}</span>
            </p>
          </div>
        </div>
        {/* 나머지 경쟁 결과는 그 아래 */}
        <div className="mt-1 divide-y divide-border-light">
          {competitors.slice(0, 2).map((c) => (
            <Row key={c.name} row={c} />
          ))}
        </div>
      </div>
    </SearchChrome>
  );
}

/* ================================================================
   메인 — 드래그 슬라이더
   ================================================================ */
export default function S3_BeforeAfterSlider({
  query = '성수 브런치 카페',
  storeName = '누구나 브런치 · 성수점',
  storeMeta = '방문자리뷰 2,380',
  competitors = DEFAULT_COMPETITORS,
  initial = 0.5,
  className,
}: S3BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [pct, setPct] = useState(initial); // aria/라벨용 위치(0~1). Before가 차지한 비율.

  // 손잡이의 픽셀 위치(= Before 오버레이가 덮는 폭)
  const x = useMotionValue(0);
  // Before 오버레이: 왼쪽에서 x px 만큼만 보이도록 오른쪽을 잘라냄
  const clip = useMotionTemplate`inset(0 calc(100% - ${x}px) 0 0)`;

  /* 컨테이너 폭 측정 + 리사이즈 시 위치 유지(비율 기준) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setWidth(w);
      x.set(pct * w); // 현재 비율 유지
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // pct는 의도적으로 제외(리사이즈 시 최신 pct는 ref 대신 state 최신값 사용) — 아래 effect가 보정
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pct(키보드/클릭으로 변경)와 x 동기화
  useEffect(() => {
    if (width > 0) x.set(pct * width);
  }, [pct, width, x]);

  /* 특정 픽셀 위치로 부드럽게 이동 */
  const moveTo = useCallback(
    (px: number, spring = true) => {
      if (width <= 0) return;
      const clamped = Math.max(0, Math.min(width, px));
      if (spring) {
        animate(x, clamped, { type: 'spring', stiffness: 320, damping: 34 });
      } else {
        x.set(clamped);
      }
      setPct(clamped / width);
    },
    [width, x],
  );

  /* 트랙 클릭(손잡이가 아닌 곳) → 그 지점으로 이동 */
  const handleTrackPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-handle]')) return; // 손잡이 드래그는 제외
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      moveTo(e.clientX - rect.left);
    },
    [moveTo],
  );

  /* 키보드 접근성 — 화살표로 4%씩 */
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      const step = width * 0.04;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        moveTo(x.get() - step);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        moveTo(x.get() + step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        moveTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        moveTo(width);
      }
    },
    [width, x, moveTo],
  );

  /* 최초 진입 시 손잡이가 움직인다는 힌트(살짝 흔들기) */
  useEffect(() => {
    if (width <= 0) return;
    const start = pct * width;
    const controls = animate(x, [start, start + Math.min(28, width * 0.06), start], {
      duration: 1.1,
      delay: 0.5,
      ease: 'easeInOut',
    });
    return () => controls.stop();
    // 최초 1회만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={containerRef}
        onPointerDown={handleTrackPointer}
        role="slider"
        tabIndex={0}
        aria-label="검색 노출 전후 비교 슬라이더. 좌우로 밀어 비교하세요."
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((1 - pct) * 100)}
        aria-valuetext={pct > 0.5 ? '검색에 안 보이는 상태' : '검색에 노출된 상태'}
        onKeyDown={handleKey}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden border-2 border-text-primary bg-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:aspect-[16/10]"
      >
        {/* AFTER — 바닥 레이어(전체) */}
        <div className="absolute inset-0">
          <AfterScreen query={query} storeName={storeName} storeMeta={storeMeta} competitors={competitors} />
        </div>

        {/* BEFORE — 위 레이어(왼쪽만 clip으로 노출) */}
        <motion.div
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: clip, WebkitClipPath: clip }}
        >
          <BeforeScreen query={query} competitors={competitors} />
        </motion.div>

        {/* 코너 라벨 */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 bg-text-primary px-2.5 py-1 text-[10px] font-bold tracking-wide text-white sm:text-xs">
          BEFORE · 안 보임
        </div>
        <div className="pointer-events-none absolute right-0 top-0 z-20 bg-accent px-2.5 py-1 text-[10px] font-bold tracking-wide text-white sm:text-xs">
          AFTER · 검색에 노출
        </div>

        {/* 구분선 + 손잡이 (framer-motion drag) */}
        <motion.div
          data-handle
          drag="x"
          dragConstraints={{ left: 0, right: width }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x }}
          onDrag={() => setPct(width > 0 ? x.get() / width : 0.5)}
          onDragEnd={() => setPct(width > 0 ? x.get() / width : 0.5)}
          className="absolute inset-y-0 left-0 z-30 w-0 touch-none"
        >
          {/* 세로 구분선 */}
          <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
          {/* 원형 그립 */}
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center gap-0.5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.18)] ring-2 ring-accent rounded-dot sm:h-12 sm:w-12">
            <ChevronLeft className="h-4 w-4 text-accent" />
            <ChevronRight className="h-4 w-4 text-accent" />
          </div>
        </motion.div>
      </div>

      {/* 안내 카피 */}
      <p className="mt-3 text-center text-xs text-text-disabled sm:text-sm">
        손잡이를 <span className="font-semibold text-text-secondary">좌우로 밀어보세요</span> — 검색에서 안 보이던 내 가게가 검색에 노출됩니다.
      </p>
    </div>
  );
}
