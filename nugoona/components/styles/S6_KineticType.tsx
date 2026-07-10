'use client';

/**
 * S6_KineticType — 랜딩 개념 그래픽 "스타일⑥: 거대 타이포 그래픽(키네틱)"
 *
 * 개념: 그림이 아니라 "글자 자체가 그래픽". 화면 가득 초대형 헤드라인("올리면 끝.")을
 *   글자 단위 stagger로 등장시키고, 그 아래 작은 서브라인의 핵심 단어("검색에 노출")만
 *   accent(#0070f3)로 색전환 + 스케일 pop + 밑줄 draw. 이미지 해석조차 필요 없이 0.5초 각인.
 *   다이어그램의 복잡함과 최대 대비 — 노드/선/도형 0개, 오직 글자 위계와 움직임.
 *
 * 재사용: headline·subline·theme를 props로 받는다(기본값 = "올리면 끝." 콘셉트).
 *   - headline: 초대형. 글자별 stagger 등장. seg.accent=true면 그 단어 전체 accent 색.
 *   - subline:  작게. 인라인 리치텍스트. seg.accent=true인 단어만 색전환/스케일/밑줄 키네틱.
 *   다른 카피로 재사용 예:
 *     headline={[{ text: '광고, 3분.' }]}
 *     subline={[{ text: '사장님은 목표만. ' }, { text: '나머지는 자동', accent: true }, { text: '입니다.' }]}
 *
 * 규칙: 미니밀·직각(전역 border-radius:0). 폰트=Pretendard(var(--font-kr)). accent=#0070f3.
 *   framer-motion만 사용(신규 라이브러리 0). prefers-reduced-motion 존중(useReducedMotion).
 */

import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/** 텍스트 조각. accent=true면 강조(헤드라인=색만, 서브라인=색전환+스케일+밑줄). */
export type S6Seg = { text: string; accent?: boolean };

export interface S6KineticTypeProps {
  /** 초대형 헤드라인. 기본 "올리면 끝." */
  headline?: S6Seg[];
  /** 작은 서브라인. accent 단어만 키네틱 강조. 기본 "사진 4장이 [검색에 노출]됩니다." */
  subline?: S6Seg[];
  /** 배경 테마. 기본 'light'(브랜드 기본 화이트). */
  theme?: 'light' | 'dark';
  className?: string;
}

/* ── 테마 토큰 (accent 실값 정본 = globals.css --color-accent) ── */
const THEME = {
  light: {
    bg: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
    text: '#111111',
    sub: '#666666',
    accent: '#0070f3',
    ghost: 'rgba(17,17,17,0.028)',
  },
  dark: {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #121212 100%)',
    text: '#ffffff',
    sub: 'rgba(255,255,255,0.5)',
    accent: '#3d8bff', // 어두운 배경 대비 보정(라이트=#0070f3)
    ghost: 'rgba(255,255,255,0.03)',
  },
} as const;

const DEFAULT_HEADLINE: S6Seg[] = [{ text: '올리면 끝.' }];
const DEFAULT_SUBLINE: S6Seg[] = [
  { text: '사진 4장이 ' },
  { text: '검색에 노출', accent: true },
  { text: '됩니다.' },
];

/** 헤드라인 세그먼트 → 단어 배열(공백 분리). 각 단어 = 글자 배열 + accent 플래그. */
function buildWords(segs: S6Seg[]): { ch: string; accent: boolean }[][] {
  const words: { ch: string; accent: boolean }[][] = [];
  for (const seg of segs) {
    for (const w of seg.text.split(/\s+/)) {
      if (!w) continue;
      words.push([...w].map((ch) => ({ ch, accent: !!seg.accent })));
    }
  }
  return words;
}

/* ── 서브라인 accent 단어: 색전환 + 스케일 pop + 밑줄 draw ── */
function AccentWord({
  text,
  color,
  inView,
  delay,
  reduce,
}: {
  text: string;
  color: string;
  inView: boolean;
  delay: number;
  reduce: boolean;
}) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      <motion.span
        initial={reduce ? false : { color: 'currentColor' }}
        animate={inView ? { color } : {}}
        transition={{ duration: 0.5, ease: EASE, delay }}
        style={{ display: 'inline-block', fontWeight: 700 }}
      >
        <motion.span
          style={{ display: 'inline-block' }}
          initial={false}
          animate={inView && !reduce ? { scale: [1, 1.14, 1] } : {}}
          transition={{ duration: 0.6, ease: EASE, delay, times: [0, 0.5, 1] }}
        >
          {text}
        </motion.span>
      </motion.span>
      {/* 밑줄 (도형 아님 — 텍스트 강조 라인) */}
      <motion.span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '-0.14em',
          height: 2,
          background: color,
          transformOrigin: 'left center',
        }}
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.45, ease: EASE, delay: delay + 0.08 }}
      />
    </span>
  );
}

export default function S6KineticType({
  headline = DEFAULT_HEADLINE,
  subline = DEFAULT_SUBLINE,
  theme = 'light',
  className,
}: S6KineticTypeProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reduce = useReducedMotion() ?? false;
  const c = THEME[theme];

  const words = useMemo(() => buildWords(headline), [headline]);

  // 헤드라인 총 글자 수 → 서브라인/accent 타이밍을 자동으로 헤드라인 뒤에 배치
  const charCount = useMemo(() => words.reduce((n, w) => n + w.length, 0), [words]);
  const headlineDone = 0.12 + charCount * 0.05 + 0.35; // delayChildren + stagger*n + charDuration
  const subDelay = reduce ? 0 : headlineDone;
  const accentDelay = reduce ? 0 : headlineDone + 0.35;

  // 글자 stagger variants
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: reduce ? 0 : 0.12 } },
  };
  const charV: Variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: '0.42em', filter: 'blur(6px)' },
        visible: {
          opacity: 1,
          y: '0em',
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: EASE },
        },
      };

  // 헤드라인 텍스트(접근성용 sr 라벨)
  const headlineText = headline.map((s) => s.text).join(' ');

  return (
    <section
      ref={ref}
      className={className}
      aria-label={headlineText}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 'clamp(420px, 78vh, 820px)',
        padding: 'clamp(48px, 8vw, 120px) clamp(20px, 5vw, 64px)',
        background: c.bg,
        color: c.text,
      }}
    >
      {/* 배경 고스트 워터마크 — 헤드라인 첫 글자를 초거대로(깊이감, 장식 최소) */}
      <span
        aria-hidden
        className="select-none"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-kr)',
          fontSize: 'clamp(240px, 46vw, 720px)',
          fontWeight: 900,
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          color: c.ghost,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        {words[0]?.[0]?.ch ?? ''}
      </span>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1100 }}>
        {/* ── 거대 헤드라인: 글자별 stagger ── */}
        <motion.h2
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          aria-hidden
          style={{
            margin: 0,
            fontFamily: 'var(--font-kr)',
            fontSize: 'clamp(56px, 13vw, 168px)',
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: '-0.045em',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '0.24em',
            rowGap: '0.02em',
          }}
        >
          {words.map((word, wi) => (
            <span key={wi} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
              {word.map((glyph, gi) => (
                <motion.span
                  key={gi}
                  variants={charV}
                  style={{
                    display: 'inline-block',
                    color: glyph.accent ? c.accent : 'inherit',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {glyph.ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h2>

        {/* ── 서브라인: accent 단어만 키네틱 강조 ── */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: subDelay }}
          style={{
            margin: 'clamp(22px, 4vw, 40px) auto 0',
            maxWidth: 640,
            fontFamily: 'var(--font-kr)',
            fontSize: 'clamp(15px, 2.4vw, 22px)',
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            color: c.sub,
            wordBreak: 'keep-all',
          }}
        >
          {subline.map((seg, i) =>
            seg.accent ? (
              <AccentWord
                key={i}
                text={seg.text}
                color={c.accent}
                inView={inView}
                delay={accentDelay}
                reduce={reduce}
              />
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </motion.p>
      </div>
    </section>
  );
}

export { S6KineticType };
