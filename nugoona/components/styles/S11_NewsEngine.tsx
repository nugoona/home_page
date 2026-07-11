'use client';

/**
 * S11_NewsEngine — [/content ⑤ 노출 소식 엔진, 정본 A14]
 *
 * 사장님 승인 시안 = `Draft_CoreSet.tsx`의 D3 (2026-07-11 1차 제출 "③ 통과").
 * 구조·카피는 D3 그대로 옮긴다(글자 추가 금지). 이 파일에서 하는 일은 D3의 정적 목업에
 * **브랜드 모션**(직각선이 그려지며 소식→인용을 잇는 진입 애니메이션)만 입히는 것.
 *
 * 사장님 메모(1차 제출, D3 통과 조건): "구현 시 '앞으로 쓰는 글에 자동 반영' 연결을
 * 시각적으로 강조할 것" → 그 연결선(직각 꺾임선)이 그려지는 순서 자체를 디자인의 중심으로 삼는다.
 * 시선 순서: 매체 라벨 → 소식(주인공) → 꺾임선(그려짐) → 인용문 → "자동 반영"(accent, 또렷) → 각주.
 *
 * 정본 사실: 주 1회(일 23:00) 매체 5종 수집 / adopt만 앞으로 쓰는 글에 반영(기존 글 재작성 안 함)
 *            / 거짓·기만(리뷰 구매·체험단) 명시적 폐기.
 * ⛔ 순위·상위노출 보장 금지. ※ 소식 문구는 화면 예시(실제 매체 정책 발표 인용 아님).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const QUOTE = { fontFamily: 'var(--font-quote)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';

/* 소식 → 인용을 잇는 직각 꺾임선 (곡선·화살표 금지, 끝은 accent 점) */
function Elbow({ inView, delay }: { inView: boolean; delay: number }) {
  const S = { stroke: ACCENT, strokeWidth: 1.75, strokeOpacity: 0.55, vectorEffect: 'non-scaling-stroke' as const };
  return (
    <span aria-hidden className="relative block w-4 h-7 shrink-0">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 16 28" preserveAspectRatio="none" fill="none">
        <motion.line x1="1" y1="0" x2="1" y2="20" {...S}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.32, ease: EASE, delay }} />
        <motion.line x1="1" y1="20" x2="16" y2="20" {...S}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.28, ease: EASE, delay: delay + 0.24 }} />
      </svg>
      <motion.span
        className="absolute w-1.5 h-1.5 rounded-dot" style={{ background: ACCENT, right: 0, top: '20px', transform: 'translate(50%,-50%)' }}
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.2, ease: EASE, delay: delay + 0.48 }}
      />
    </span>
  );
}

/* 우측 미니 목업 — 네이버 플레이스 소식 카드(§M-6: 좌 텍스트만 있던 우측 공백 채움).
   새 카피 창작 금지 — 위 소식/인용/캡션 문구를 그대로 카드 형태로 재배치. */
function NewsCard({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
      className="border bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
      style={{ borderColor: '#eaeaea' }}
    >
      <div className="flex items-center gap-1.5 mb-4">
        <span className="rounded-dot w-1.5 h-1.5 shrink-0" style={{ background: '#03c75a' }} />
        <span className="text-[11px] font-semibold text-text-primary">&laquo; 플레이스 소식 &raquo;</span>
      </div>
      <p className="text-[15px] leading-[1.65] text-text-body" style={QUOTE}>
        &ldquo;성수역 3번 출구에서 걸어서 5분입니다.&rdquo;
      </p>
      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#f2f2f2' }}>
        <span className="text-[13px] font-semibold" style={{ ...EN, color: ACCENT }}>
          — 앞으로 쓰는 글에 자동 반영
        </span>
      </div>
    </motion.div>
  );
}

export default function S11_NewsEngine() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });

  return (
    <div ref={ref} className="w-full max-w-[980px] md:grid md:grid-cols-2 md:gap-14 md:items-center">
      {/* 좌: 소식→글 서사 */}
      <div className="max-w-[560px]">
        <div className="mb-9">
          <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.2]">
            노출 방식이 바뀌어도,<br />알아서 <span className="text-accent">따라갑니다</span>.
          </h3>
        </div>

        {/* ① 매체 라벨 (정보 — 작게) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex items-center gap-1.5 mb-2"
        >
          <span className="rounded-dot w-1.5 h-1.5 shrink-0" style={{ background: '#03c75a' }} />
          <span className="text-[11px] max-md:text-[12px] font-semibold text-text-primary">네이버 플레이스</span>
          <span className="text-[10px]" style={{ ...EN, color: '#a9aeb5' }}>이번 주 노출 소식</span>
        </motion.div>

        {/* ② 소식 = 주인공 (어필 — 크게, 2줄) */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          className="text-[clamp(18px,2.2vw,24px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.35] mb-4"
        >
          찾아오는 길이 적힌 글을<br />더 오래 보여주기 시작했습니다.
        </motion.p>

        {/* ③ 소식 → 글, 직각선으로 연결(그려지는 모션이 중심) → 명조 인용 + accent "자동 반영" */}
        <div className="flex items-start gap-2 pl-1">
          <Elbow inView={inView} delay={0.42} />
          <div className="pt-2.5">
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.45, ease: EASE, delay: 0.78 }}
              // §8.9: 모바일에서 13px로 줄어들던 버그 수정 — 데스크(14px)보다 얇아지지 않도록 15px로
              className="text-[14px] leading-[1.65] text-text-body max-md:text-[15px]" style={QUOTE}
            >
              &ldquo;성수역 3번 출구에서 걸어서 5분입니다.&rdquo;
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 4 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, ease: EASE, delay: 1.15 }}
              className="text-[13px] max-md:text-[14px] font-semibold mt-1.5" style={{ ...EN, color: ACCENT }}
            >
              — 앞으로 쓰는 글에 자동 반영
            </motion.p>
          </div>
        </div>

        {/* 각주 1줄 */}
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 1.4 }}
          className="mt-5 text-[11px] max-md:text-[12px] max-md:font-medium text-text-weak"
        >
          매주 일요일 밤 매체 5곳을 대신 확인합니다 — 거짓 수법은 버립니다.
        </motion.p>
      </div>

      {/* 우: 미니 목업 카드 — 데스크톱 전용(모바일은 좌측 서사로 충분) */}
      <div className="hidden md:block">
        <NewsCard inView={inView} />
      </div>
    </div>
  );
}
