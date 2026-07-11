'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   목업 — "채워지는 채널" (콘텐츠 카드용, DESIGN §8.7-I 3차교정 준수)
   "검색에 보인다"를 순위 없이: 블로그·플레이스·인스타 세 채널에 내 가게 콘텐츠가
   하나씩 채워지며 그린 체크가 점등한다 = "여러 곳에 내 가게가 존재하게 된다".
   ⛔ 금지 게이트 준수: 순위/1위/노출 텍스트 없음 · 그린틴트 배경 없음 ·
      회색 스켈레톤 없음 · 짝퉁 네이버/인스타 UI 없음(우리 톤: 직각·라벨·그린 포인트).
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GREEN = '#2fd46b';

const CHANNELS = [
  { ch: '블로그', title: '성수동 브런치 카페, 주말 신메뉴 후기', meta: '방문 리뷰 · 사진 12장' },
  { ch: '플레이스', title: '오늘의 브런치, 성수', meta: '성수동 · 매일 09–21시 · 리뷰 214' },
  { ch: '인스타', title: '이번 주 시즌 메뉴 업로드', meta: '@today_brunch_seongsu' },
];

export default function ExposureFill() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-center gap-2.5 px-3 max-md:px-2">
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c.ch}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.5 }}
          className="flex items-center gap-3 border px-4 py-3 max-md:py-3.5"
          style={{ borderColor: '#eaeaea', background: '#fff' }}
        >
          {/* 채널 라벨 */}
          <span className="text-[12px] font-semibold text-text-body shrink-0 w-11 max-md:w-12">{c.ch}</span>
          <span className="w-px self-stretch shrink-0" style={{ background: '#eaeaea' }} />
          {/* 내 가게 콘텐츠 항목 */}
          <div className="min-w-0 flex-1">
            <p className="text-[14px] max-md:text-[14px] font-medium text-text-primary truncate leading-snug">{c.title}</p>
            <p className="text-[11px] max-md:text-[12px] text-text-weak truncate mt-1">{c.meta}</p>
          </div>
          {/* 채워짐 체크(그린 포인트 — 배경 틴트 없이 점 하나) */}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.5 + 0.35 }}
            className="shrink-0 flex items-center justify-center"
            style={{ width: 18, height: 18, background: GREEN, borderRadius: '50%' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 5l2 2 4-5" />
            </svg>
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
