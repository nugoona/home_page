'use client';

/**
 * S13_Onboarding — [/content ⑥ 온보딩, 정본 A15]
 *
 * 사장님 승인 시안 = `Draft_CoreSet.tsx`의 D6(2026-07-11 O, "⑥ 온보딩 — 가게 이름 하나로,
 * 여기까지 끝"). 구조·카피는 D6 그대로 옮긴다(글자 추가 금지). 이 파일에서 하는 일은 D6의
 * 정적 목업에 **브랜드 모션**(입력칩 → 직각선 그려짐 → 내역 3행이 위→아래로 하나씩 체크되며
 * 채워지는 진입 애니메이션)만 입히는 것.
 *
 * 정본 A15: 가게 이름 입력 → 네이버 지도 후보 목록(⛔1등 자동확정 금지, 사장님이 고름)
 *   → 상세정보 자동 수집 → Claude가 업종·소개·키워드·톤·썸네일 자동 채움 → '맞아요' 탭.
 *   시안 D6는 후보 선택 화면을 펼치지 않고 "끝난 내역"(결과)에 집중한다 — 섹션의 심장은
 *   그 결과가 3그룹으로 채워지는 순간이지, 후보 목록 UI가 아니다.
 *
 * 디자인(DESIGN §8.7-A~D): 직각선(곡선·화살표 금지, 끝 accent 점) · 카드 나열 대신 판 하나가
 *   주인공 · accent는 사장님이 직접 하는 순간(입력칩 보더)에만 · 각주 한 줄.
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';
const BORDER = '#eaeaea';

const GROUPS = [
  { label: '가게 프로필', body: <>오늘의 브런치, 성수 · 브런치 카페 <span className="text-text-weak">— 소개·메뉴·말투·썸네일까지</span></> },
  { label: '노출 검색어', body: <><b>성수동 브런치</b> 외 목표 3개 · 태그 15개</> },
  { label: '1년치 글감', body: <>아침 오픈 준비 외 <b>52편</b> 미리 준비</> },
] as const;

const ROW_START = 0.75;
const ROW_STAGGER = 0.22;
const CHECK_LAG = 0.16;

/* 내역 행이 "채워지는" 느낌 — 행 등장 뒤 살짝 늦게 체크가 찍힌다 */
function Check({ inView, delay }: { inView: boolean; delay: number }) {
  return (
    <motion.svg
      className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 12 12" fill="none"
      stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
      transition={{ duration: 0.22, ease: EASE, delay }}
    >
      <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
    </motion.svg>
  );
}

/* 입력칩 → 내역 판을 잇는 직각선 — 모바일(세로 배열)=세로선, 데스크(가로 배열)=가로선.
   곡선·화살표 금지, 끝은 accent 점(§8.7-A). 그려진 뒤 점이 찍힌다. */
function Link({ inView }: { inView: boolean }) {
  return (
    <div
      className="shrink-0 flex flex-col md:flex-row items-center justify-center
                 h-8 md:h-auto md:w-12 md:self-center"
      aria-hidden
    >
      <motion.span
        className="block bg-[rgba(0,112,243,0.5)] w-[1.5px] h-8 md:w-10 md:h-[1.5px]"
        style={{ transformOrigin: 'top left' }}
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.35, ease: EASE, delay: 0.35 }}
      />
      <motion.span
        className="block w-1.5 h-1.5 rounded-dot -mt-px md:mt-0 md:-ml-px" style={{ background: ACCENT }}
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.22, ease: EASE, delay: 0.65 }}
      />
    </div>
  );
}

export default function S13_Onboarding() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
  const buttonDelay = ROW_START + GROUPS.length * ROW_STAGGER + 0.15;

  return (
    <div ref={ref} className="w-full">
      <div className="mb-9 max-w-[600px]">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.2]">
          가게 이름 하나로,<br /><span className="text-accent">여기까지</span> 끝.
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-0 max-w-[880px]">
        {/* 입력 — 사장님이 하는 유일한 일 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="shrink-0"
        >
          <div className="flex items-center gap-2 border px-3 h-10" style={{ borderColor: ACCENT }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#9aa0a8" strokeWidth="1.8"><circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" /></svg>
            <span className="text-[13px] max-md:text-[14px] text-text-primary">오늘의 브런치</span>
          </div>
        </motion.div>

        <Link inView={inView} />

        {/* 내역 판 — 주인공. 3그룹 행이 위→아래로 하나씩 채워진다 */}
        <div className="border bg-white flex-1 max-w-[480px] divide-y" style={{ borderColor: BORDER }}>
          {GROUPS.map((g, i) => {
            const delay = ROW_START + i * ROW_STAGGER;
            return (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay }}
                className="flex items-start gap-3 px-4 py-3" style={{ borderColor: '#f2f2f2' }}
              >
                <span className="text-[10px] font-semibold w-16 shrink-0 pt-0.5" style={{ ...EN, color: '#a9aeb5' }}>{g.label}</span>
                <p className="text-[13px] max-md:text-[14px] text-text-primary leading-snug flex-1">{g.body}</p>
                <Check inView={inView} delay={delay + CHECK_LAG} />
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: buttonDelay }}
            className="px-4 py-3 flex justify-end"
          >
            {/* 채워지는 판이 눈앞에서 완성된 뒤 마지막 확인 — hover/tap에 눌리는 느낌 */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: EASE }}
              className="w-[60%] h-9 text-[13px] max-md:text-[14px] font-semibold text-white"
              style={{ background: ACCENT }}
            >
              네, 맞아요
            </motion.button>
          </motion.div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: EASE, delay: buttonDelay + 0.3 }}
        className="mt-6 text-[11px] max-md:text-[12px] max-md:font-medium text-text-weak max-w-[880px]"
      >
        사장님이 한 일은 이름 입력뿐 — 나머지는 AI가 네이버 플레이스·홈페이지를 읽고 채웠습니다.
      </motion.p>
    </div>
  );
}
