'use client';

/**
 * S14_Generate — [/content ② 목표 키워드 — D2(v3) 구조를 실컴포넌트로 번역]
 *
 * 근거: `Draft_CoreSet.tsx`의 D2(v3) — 사장님 O 통과분(2026-07-11).
 *   신뢰 축 = "네이버 검색광고 실데이터로 확인했다"는 사실 하나(기준 3단 中 2번).
 *   네거티브("뺐어요") 표현·검색량 숫자 노출은 오독으로 폐기(구버전의 "검색량 월 30↑" 배지도 동일 이유로 삭제).
 *
 * 정본 사실(A12): 가게 정보(지역×업종×메뉴)에서 후보를 만들고, 네이버 검색광고 데이터로
 *   실제 검색되는 말인지 확인해 — 채택된 키워드만 글 제목·태그·순위추적에 씀.
 *
 * 디자인(DESIGN §8.7): 카드 나열 금지 → 과정(기준 3단, 작게) → 결과(채택 키워드, 주인공·크게) 위계.
 *   직각선 · 실제 텍스트 · 면칠 금지(강조는 accent 텍스트·굵기·아이콘으로만) · 각주 한 줄.
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';

const CRITERIA = [
  { n: '1', t: '가게 정보에서 후보를 만들고', s: '속초(지역) × 횟집(업종) × 대게(메뉴)' },
  { n: '2', t: '네이버 검색광고 데이터로 확인합니다', s: '손님이 실제로 검색하는 말인지 — 감이 아니라 네이버 공식 검색 데이터로' },
  { n: '3', t: '실제로 검색되는 말만 남깁니다', s: '남긴 검색어가 글 제목·태그가 됩니다' },
] as const;

const KEYWORDS = ['속초 횟집', '속초 대게 맛집'] as const;

export default function S14_Generate() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });

  return (
    <div ref={ref} className="w-full">
      <p className="text-[11px] max-md:text-[12px] font-semibold uppercase tracking-[0.08em] mb-4" style={{ ...EN, color: '#a9aeb5' }}>
        가게 이름: 해도담 횟집 (속초)
      </p>

      <motion.h3
        initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE }}
        className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-9 max-w-[600px]"
      >
        우리 가게가 <span className="text-accent">정답인 검색어</span>만 남깁니다.
      </motion.h3>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-[920px]">
        {/* 좌: 기준 3단 — 과정(작게) */}
        <div className="flex flex-col gap-3 shrink-0 max-w-[340px]">
          {CRITERIA.map((c, i) => (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: EASE, delay: 0.25 + i * 0.15 }}
              className="flex items-start gap-2.5"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white shrink-0" style={{ ...EN, background: '#171717' }}>
                {c.n}
              </span>
              <div>
                <p className={`text-[13px] max-md:text-[14px] text-text-primary leading-tight flex items-center gap-1.5 ${i === 1 ? 'font-extrabold' : 'font-bold'}`}>
                  {c.t}
                  {i === 1 && (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={ACCENT} strokeWidth="1.8" className="shrink-0" aria-hidden>
                      <circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" />
                    </svg>
                  )}
                </p>
                <p className="text-[11px] max-md:text-[12px] max-md:font-medium text-text-weak mt-0.5">{c.s}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 우: 결과 — 채택 키워드(주인공, 크게) */}
        <div className="min-w-0">
          <div className="flex flex-col gap-1">
            {KEYWORDS.map((k, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, ease: EASE, delay: 0.75 + i * 0.14 }}
                className="flex items-center gap-2.5"
              >
                <span className={`text-[clamp(20px,2.6vw,30px)] font-bold tracking-[-0.02em] ${i === 0 ? 'text-accent' : 'text-text-primary'}`}>{k}</span>
                <motion.svg
                  width="14" height="14" viewBox="0 0 12 12" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.3, ease: EASE, delay: 0.9 + i * 0.14 }}
                >
                  <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                </motion.svg>
              </motion.div>
            ))}
            <motion.span
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, ease: EASE, delay: 1.1 }}
              className="text-[10px] mt-1" style={{ ...EN, color: '#a9aeb5' }}
            >
              네이버 검색 데이터 확인됨
            </motion.span>
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 1.3 }}
        className="text-[11px] max-md:text-[12px] max-md:font-medium text-text-weak mt-6 max-w-[920px]"
      >
        남긴 검색어는 글 제목·태그·해시태그에 자동으로 실리고, 매일 순위를 잽니다.
      </motion.p>
    </div>
  );
}
