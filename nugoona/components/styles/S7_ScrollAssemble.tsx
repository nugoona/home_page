'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;

/**
 * 스타일⑦ — 스크롤 스크럽 조립 애니 (Apple형)
 * ────────────────────────────────────────────────────────────
 * 개념: 스크롤을 내리는 만큼 "한 오브젝트가 3단계로 변신"한다.
 *   ① 사진 4장이 등장  →  ② AI가 글로 변신  →  ③ 검색 결과에 노출
 * 스크롤 = 재생 버튼. 정적 다이어그램이 아니라 "움직이는 이야기".
 *
 * 구현:
 *   - framer-motion useScroll + useTransform 으로 sticky + 스크럽.
 *   - 자체 스크롤 영역(overflow-y-auto)이라 갤러리에서 이 컴포넌트만
 *     스크롤해도 동작한다. useScroll({ container }) 로 내부 스크롤을 읽는다.
 *   - 세로로 긴 트랙(300%) + sticky 중앙 스테이지에서 3장면을 크로스페이드.
 *   - 노드-선 다이어그램 없음. accent(#0070f3)·직각·미니멀·모바일 대응.
 *
 * 재사용: <S7_ScrollAssemble /> 단독 배치. 자족적(외부 스크롤 불필요).
 */

// 컨테이너와 sticky 스테이지의 높이를 반드시 동일하게 유지(스크럽 정합).
const STAGE_H = 'h-[480px] md:h-[600px]';

const STEPS = ['사진', '글', '검색 노출'] as const;

export default function S7_ScrollAssemble() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // 내부 스크롤 컨테이너의 진행률(0=최상단, 1=최하단)을 재생 헤드로 사용.
  const { scrollYProgress: p } = useScroll({ container: containerRef });

  useMotionValueEvent(p, 'change', (v) => {
    setStep(v < 0.34 ? 0 : v < 0.66 ? 1 : 2);
  });

  // ── 장면① 사진: 등장 후 다음 장면에 자리 내주며 살짝 축소·페이드아웃
  const s1Opacity = useTransform(p, [0, 0.18, 0.3, 0.38], [0, 1, 1, 0]);
  const s1Y = useTransform(p, [0, 0.14], [28, 0]);
  const s1Scale = useTransform(p, [0.28, 0.4], [1, 0.94]);

  // ── 장면② 글: 사진이 글로 변신 → 스켈레톤이 "쓰이며" 채워짐
  const s2Opacity = useTransform(p, [0.32, 0.42, 0.6, 0.68], [0, 1, 1, 0]);
  const s2Y = useTransform(p, [0.32, 0.44], [28, 0]);
  const barW1 = useTransform(p, [0.42, 0.52], ['12%', '100%']);
  const barW2 = useTransform(p, [0.45, 0.55], ['12%', '92%']);
  const barW3 = useTransform(p, [0.48, 0.58], ['12%', '78%']);

  // ── 장면③ 검색 노출: 글이 검색 결과가 되어 노출됨
  const s3Opacity = useTransform(p, [0.64, 0.74], [0, 1]);
  const riseY = useTransform(p, [0.66, 0.9], [52, 0]);
  const rankBg = useTransform(p, [0.78, 0.92], ['rgba(0,112,243,0)', 'rgba(0,112,243,0.08)']);

  // ── 상단 진행 게이지 + 스크롤 힌트
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

  return (
    <div className="relative w-full">
      {/* 자체 스크롤 영역 — 갤러리에서 이 위젯만 스크롤해도 재생됨 */}
      <div
        ref={containerRef}
        className={`${STAGE_H} overflow-y-auto overscroll-contain border border-border-default bg-white [scrollbar-width:thin]`}
      >
        {/* 세로로 긴 트랙(스크롤 길이 = 재생 길이) */}
        <div className="relative h-[300%]">
          {/* sticky 중앙 스테이지 */}
          <div className={`sticky top-0 ${STAGE_H} overflow-hidden`}>
            <div className="mx-auto flex h-full max-w-[420px] flex-col px-6 py-6 max-md:px-4">
              {/* ── 상단: 3단계 스텝 인디케이터 + 진행 게이지 ── */}
              <div className="mb-5 shrink-0">
                <div className="flex items-center gap-1.5">
                  {STEPS.map((label, i) => {
                    const active = step >= i;
                    const current = step === i;
                    return (
                      <div
                        key={label}
                        className={`flex flex-1 items-center gap-1.5 px-2 py-1.5 transition-colors duration-300 ${
                          active ? 'bg-accent-bg' : 'bg-[#f7f7f7]'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center text-[9px] font-bold transition-colors duration-300 ${
                            active ? 'bg-accent text-white' : 'bg-[#dcdcdc] text-white'
                          }`}
                          style={EN}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`truncate text-[11px] font-semibold transition-colors duration-300 max-md:text-[10px] ${
                            current ? 'text-accent' : active ? 'text-text-primary' : 'text-text-weak'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* 진행 게이지 */}
                <div className="mt-2 h-[3px] w-full overflow-hidden bg-[#eee]">
                  <motion.div className="h-full w-full origin-left bg-accent" style={{ scaleX: p }} />
                </div>
              </div>

              {/* ── 모프 캔버스: 3장면 크로스페이드 ── */}
              <div className="relative flex-1">
                {/* 장면① 사진 */}
                <motion.div
                  style={{ opacity: s1Opacity, y: s1Y, scale: s1Scale }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-[260px] max-md:w-[220px]">
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-border-default bg-gradient-to-br from-[#f2f2f2] to-[#e0e0e0]">
                      <PhotoGlyph />
                      <span
                        className="absolute left-2.5 top-2.5 bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-text-weak"
                        style={EN}
                      >
                        JPG
                      </span>
                    </div>
                  </div>
                  <Caption index="01">사진 4장을 올립니다</Caption>
                </motion.div>

                {/* 장면② 글 */}
                <motion.div
                  style={{ opacity: s2Opacity, y: s2Y }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-[300px] border border-border-default bg-white p-4 max-md:w-[248px]">
                    {/* 같은 사진이 썸네일로 이어짐 = 오브젝트 연속성 */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-10 shrink-0 items-center justify-center border border-border-default bg-gradient-to-br from-[#f2f2f2] to-[#e0e0e0]">
                        <PhotoGlyph small />
                      </span>
                      <span className="text-[10px] text-text-weak" style={EN}>
                        blog.naver.com
                      </span>
                      <span
                        className="ml-auto bg-accent-bg px-1.5 py-0.5 text-[9px] font-semibold text-accent"
                        style={EN}
                      >
                        AI
                      </span>
                    </div>
                    <p className="mb-3 text-[14px] font-bold leading-[1.35] text-text-primary max-md:text-[13px]">
                      성수동 감성 브런치,
                      <br />
                      오늘의 신메뉴 나왔어요
                    </p>
                    {/* 스켈레톤이 "쓰이며" 채워짐 */}
                    <div className="flex flex-col gap-2">
                      <motion.span className="block h-2 bg-[#ededed]" style={{ width: barW1 }} />
                      <motion.span className="block h-2 bg-[#ededed]" style={{ width: barW2 }} />
                      <motion.span className="block h-2 bg-[#ededed]" style={{ width: barW3 }} />
                    </div>
                  </div>
                  <Caption index="02">AI가 글로 바꿔 씁니다</Caption>
                </motion.div>

                {/* 장면③ 검색 노출 */}
                <motion.div
                  style={{ opacity: s3Opacity }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-[300px] max-md:w-[248px]">
                    {/* 검색창 */}
                    <div className="mb-2.5 flex items-center gap-2 border-2 border-[#03c75a] px-3 py-2">
                      <span className="flex-1 text-[12px] text-text-primary" style={EN}>
                        성수동 브런치 카페
                      </span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#03c75a" strokeWidth="1.75">
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M11 11l3 3" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* 우리 가게 결과 — 아래에서 위로 상승 */}
                    <motion.div
                      style={{ y: riseY, backgroundColor: rankBg }}
                      className="relative mb-2 flex items-center gap-2.5 border border-accent px-3 py-2.5"
                    >
                      <span className="flex h-9 w-11 shrink-0 items-center justify-center border border-border-default bg-gradient-to-br from-[#f2f2f2] to-[#e0e0e0]">
                        <PhotoGlyph small />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-text-primary">
                          오늘의 브런치, 성수
                        </span>
                        <span className="block text-[10px] text-text-body">성수동 · 리뷰 214</span>
                      </div>
                      <span
                        className="absolute right-2.5 top-2.5 bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white"
                        style={EN}
                      >
                        검색 노출
                      </span>
                    </motion.div>

                    {/* 경쟁 결과 (흐림) */}
                    {['○○ 카페', '△△ 브런치하우스'].map((name) => (
                      <div key={name} className="mb-2 flex items-center gap-2.5 border border-border-light px-3 py-2.5 opacity-55">
                        <span className="h-9 w-11 shrink-0 bg-[#f0f0f0]" />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium text-text-muted">{name}</span>
                          <span className="mt-1 block h-1.5 w-3/4 bg-[#ededed]" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Caption index="03">검색에 노출됩니다</Caption>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 힌트 (시작하면 사라짐) */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 bg-text-primary px-2 py-1 text-[10px] font-semibold text-white"
      >
        <span style={EN}>SCROLL</span>
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M6 2v8M2.5 6.5L6 10l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/** 하단 캡션 — 장면마다 번호 칩 + 한 줄 설명 */
function Caption({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center bg-text-primary text-[10px] font-bold text-white" style={EN}>
        {index}
      </span>
      <span className="text-[14px] font-semibold text-text-primary max-md:text-[13px]">{children}</span>
    </div>
  );
}

/** 사진 자리표시 글리프 (미니멀 모노크롬) */
function PhotoGlyph({ small = false }: { small?: boolean }) {
  const s = small ? 16 : 40;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="4" y="7" width="32" height="26" stroke="#b8b8b8" strokeWidth="2" />
      <circle cx="14" cy="16" r="3" fill="#b8b8b8" />
      <path d="M4 28l9-8 7 6 6-5 10 9v3H4z" fill="#c8c8c8" />
    </svg>
  );
}
