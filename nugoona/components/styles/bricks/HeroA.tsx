'use client';

/**
 * HeroA — 히어로 경쟁 시안 A · "타이포 지배 (Typography as Graphic)"
 * 장치를 최소로 줄이고 초대형 한글 헤드라인의 무게·리듬·자간이 화면을 지배한다.
 * 배경 = 화이트(초절제). 모노크롬 + 블루(#0070f3) 단 하나의 액센트.
 * 살아있는 이벤트 1개 = 헤드라인 줄 단위 마스크 리빌 + '누구나' 밑줄 드로잉(연쇄 1회).
 * 마이크로 디테일 = 버셀식 수직 컬럼 가이드 + 크로스마크(+) + 우측 메타 레일 + 스크롤 유도.
 */

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const ACCENT = '#0070f3';

/* 헤드라인 — 토씨 변경 절대 금지. '누구나'만 액센트 + 밑줄 드로잉. */
const LINES = [
  { text: '누구나', accent: true },
  { text: '마케팅하는', accent: false },
  { text: '시대', accent: false },
] as const;

/* 작은 크로스마크(+) — 그리드 교차점 마이크로 디테일 */
function Cross({ style }: { style: React.CSSProperties }) {
  return (
    <span aria-hidden className="absolute z-[2] block" style={{ width: 9, height: 9, ...style }}>
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: '#d4d4d4' }} />
      <span className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2" style={{ background: '#d4d4d4' }} />
    </span>
  );
}

export default function HeroA() {
  const reduce = useReducedMotion();

  /* 진입 이벤트(1회) — 줄 마스크가 위로 솟고, 마지막에 '누구나' 밑줄이 좌→우로 드로잉 */
  const lineStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
  };
  const lineRise = {
    hidden: { y: '112%' },
    show: { y: '0%', transition: { duration: 0.82, ease: EASE } },
  };
  const softUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section className="relative overflow-hidden bg-white text-[#171717]">
      {/* ── 버셀식 수직 컬럼 가이드 (초저채도, 타이포 뒤 규율감) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* 데스크톱: 6분할 세로선 */}
        <div className="hidden md:block absolute inset-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${(i / 6) * 100}%`, background: i === 4 ? '#f0f0f0' : '#f4f4f4' }}
            />
          ))}
        </div>
        {/* 좌우 프레임 경계선 */}
        <span className="absolute top-0 bottom-0 left-0 w-px" style={{ background: '#eaeaea' }} />
        <span className="absolute top-0 bottom-0 right-0 w-px" style={{ background: '#eaeaea' }} />
        {/* 상·하단 미세 베이스라인 */}
        <span className="absolute left-0 right-0 top-0 h-px" style={{ background: '#f0f0f0' }} />
        <span className="absolute left-0 right-0 bottom-0 h-px" style={{ background: '#f0f0f0' }} />
        {/* 크로스마크 — 프레임 4모서리 안쪽 */}
        <Cross style={{ top: 22, left: 22 }} />
        <Cross style={{ top: 22, right: 22 }} />
        <Cross style={{ bottom: 22, left: 22 }} />
        <Cross style={{ bottom: 22, right: 22 }} />
        {/* 데스크톱 헤드라인 좌측 라인 교차점 강조 */}
        <Cross style={{ top: '50%', left: `calc(${(4 / 6) * 100}% - 4px)` }} />
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="relative z-[3] mx-auto w-full max-w-[1200px] px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 py-[13vh] max-md:py-[15vh] min-h-[82vh] max-md:min-h-[86vh] content-center">
          {/* 좌: 타이포 지배 블록 */}
          <div className="md:col-span-8 flex flex-col justify-center">
            {/* 아이브로우 — EN 라벨(Inter Tight) + 액센트 정사각 */}
            <motion.div
              variants={softUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="mb-6 flex items-center gap-2.5"
            >
              <span className="block h-[9px] w-[9px]" style={{ background: ACCENT }} />
              <span
                className="text-[12px] font-medium uppercase text-[#666]"
                style={{ ...EN, letterSpacing: '0.18em' }}
              >
                AD&nbsp;&times;&nbsp;CONTENT
              </span>
            </motion.div>

            {/* H1 — 초대형, 줄 단위 마스크 리빌 */}
            <motion.h1
              variants={lineStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="font-extrabold leading-[0.98] text-[clamp(46px,9.2vw,132px)]"
              style={{ letterSpacing: '-0.04em' }}
            >
              {LINES.map((ln) => (
                <span key={ln.text} className="block overflow-hidden">
                  <motion.span
                    variants={reduce ? undefined : lineRise}
                    className="relative inline-block will-change-transform"
                    style={ln.accent ? { color: ACCENT } : undefined}
                  >
                    {ln.text}
                    {/* '누구나' 밑줄 드로잉 — 마스크 리빌 뒤 좌→우 */}
                    {ln.accent && (
                      <motion.span
                        aria-hidden
                        className="absolute left-0 block origin-left"
                        style={{ bottom: '0.02em', height: '0.085em', background: ACCENT }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.62 }}
                      >
                        <span className="block h-full w-full" />
                      </motion.span>
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* 서브 — 미디엄, 얇지 않게 */}
            <motion.p
              variants={softUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: reduce ? 0 : 0.5 }}
              className="mt-7 max-w-[440px] text-[clamp(16px,1.55vw,20px)] font-medium leading-[1.62] tracking-[-0.01em] text-[#333]"
            >
              광고도 노출도, 한 화면에서 이해하고 직접 운영합니다.
            </motion.p>

            {/* CTA — 직각 블루 솔리드(액센트 일관) */}
            <motion.div
              variants={softUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: reduce ? 0 : 0.62 }}
              className="mt-9"
            >
              <Link
                href="/start"
                className="group inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold tracking-[-0.02em] text-white transition-all duration-200"
                style={{ background: ACCENT, boxShadow: '0 8px 28px rgba(0,112,243,0.28)' }}
              >
                무료로 시작하기
                <svg
                  className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:translate-x-[3px]"
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                >
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* 우: 메타 레일 — '한 화면'에 광고·노출이 모인다(서브 시각화, 우측 여백 방지) */}
          <div className="md:col-span-4 md:col-start-9 flex md:flex-col md:items-end md:justify-center">
            <motion.div
              variants={softUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: reduce ? 0 : 0.72 }}
              className="w-full md:max-w-[210px] border border-[#eaeaea] bg-[#fafafa]"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eaeaea]">
                <span className="text-[11px] font-semibold uppercase text-[#999]" style={{ ...EN, letterSpacing: '0.14em' }}>
                  ONE&nbsp;SCREEN
                </span>
                <span className="text-[12px] font-semibold text-[#171717]">한 화면</span>
              </div>
              {[
                { ko: '광고 운영', en: 'AD' },
                { ko: '노출 관리', en: 'CONTENT' },
              ].map((row) => (
                <div key={row.en} className="flex items-center justify-between px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <span className="block h-[7px] w-[7px]" style={{ background: ACCENT }} />
                    <span className="text-[14px] font-medium text-[#333]">{row.ko}</span>
                  </span>
                  <span className="text-[11px] font-medium text-[#bbb]" style={{ ...EN, letterSpacing: '0.1em' }}>
                    {row.en}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── 스크롤 유도 — 우하단, 미세 진행 애니메이션(과하지 않게) ── */}
      <div className="pointer-events-none absolute bottom-5 right-6 md:right-14 z-[3] hidden md:flex items-center gap-2.5">
        <span className="text-[11px] font-medium uppercase text-[#bbb]" style={{ ...EN, letterSpacing: '0.16em' }}>
          Scroll
        </span>
        <span className="relative block h-6 w-px overflow-hidden" style={{ background: '#eaeaea' }}>
          <motion.span
            className="absolute left-0 top-0 block h-2 w-px"
            style={{ background: ACCENT }}
            animate={reduce ? undefined : { y: [-8, 24] }}
            transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
          />
        </span>
      </div>
    </section>
  );
}
