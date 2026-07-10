'use client';

/**
 * S2_IconSteps — 랜딩용 개념 그래픽 [스타일②: 아이콘 3~4단계 초단순 스텝]
 *
 * 개념(기본값): "① 사진 올리기 → ② AI 글 자동 발행 → ③ 검색에 노출" (누구나 콘텐츠 앱)
 *
 * 스타일② 규칙(국룰):
 *   - 큼직한 아이콘 + 숫자 배지 + 동사 라벨. 중학생도 5초 안에 이해.
 *   - ⛔ 노드-선 다이어그램 금지. 단계는 "선"이 아니라 "여백"으로만 분리(회로 느낌 제거).
 *   - accent(#0070f3) · 직각(모서리 각짐) · 미니멀 모노크롬 + 블루.
 *   - 데스크(가로 3열, md=900px) · 모바일(세로) 반응형.
 *
 * 재사용:
 *   - 기본 export는 콘텐츠 3스텝. `steps` prop으로 4단계·다른 문구/아이콘 교체 가능(라이브러리용).
 *   - 아이콘 = lucide-react. framer-motion으로 숫자·아이콘·라벨 stagger 진입(순차 등장).
 *
 * 신규 라이브러리 설치 0 (framer-motion·lucide-react 기설치).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Upload,
  FileText,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

export type IconStep = {
  /** 단계 번호(1~) — 숫자 배지에 표기 */
  n: number;
  /** 큼직한 메인 아이콘 */
  icon: LucideIcon;
  /** (선택) 아이콘 타일 우하단에 얹는 작은 accent 배지 아이콘 — "AI 자동" 같은 뉘앙스용 */
  badge?: LucideIcon;
  /** 동사 라벨(제목) */
  title: string;
  /** 한 줄 보조 설명 */
  desc: string;
};

/** 기본값 = 콘텐츠 앱 3스텝 */
const DEFAULT_STEPS: IconStep[] = [
  { n: 1, icon: Upload, title: '사진 올리기', desc: '가게 사진 4장이면 시작' },
  { n: 2, icon: FileText, badge: Sparkles, title: 'AI가 글 자동 발행', desc: '제목·본문·해시태그까지 한 번에' },
  { n: 3, icon: Search, title: '검색에 노출', desc: '네이버·구글에서 우리 가게 발견' },
];

function Step({ step, index, inView }: { step: IconStep; index: number; inView: boolean }) {
  const Icon = step.icon;
  const Badge = step.badge;
  // 스텝 단위 stagger: 아이콘 → 숫자 배지 → 라벨 순서로 살짝씩 지연
  const base = 0.12 + index * 0.16;

  return (
    <motion.div
      className="flex flex-col items-center text-center px-2"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: base }}
    >
      {/* 아이콘 타일 (직각) + 숫자 배지 */}
      <div className="relative">
        <motion.div
          className="flex items-center justify-center w-[92px] h-[92px] md:w-[108px] md:h-[108px] bg-white border border-border-default"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: base }}
        >
          <Icon
            className="w-11 h-11 md:w-12 md:h-12 text-text-primary"
            strokeWidth={1.5}
            aria-hidden
          />
        </motion.div>

        {/* 숫자 배지 — 좌상단, 직각 accent 칩 (스텍 순번 = 유일한 "순서" 신호, 선 없음) */}
        <motion.div
          className="absolute -top-3 -left-3 flex items-center justify-center w-8 h-8 bg-accent text-white text-[15px] font-bold leading-none tabular-nums"
          style={{ fontFamily: 'var(--font-en)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: base + 0.18 }}
        >
          {step.n}
        </motion.div>

        {/* (선택) AI/자동 뉘앙스용 작은 accent 배지 — 우하단 */}
        {Badge && (
          <motion.div
            className="absolute -bottom-2.5 -right-2.5 flex items-center justify-center w-7 h-7 bg-accent-bg border border-accent-border"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: base + 0.28 }}
          >
            <Badge className="w-4 h-4 text-accent" strokeWidth={1.8} aria-hidden />
          </motion.div>
        )}
      </div>

      {/* 동사 라벨 */}
      <motion.h3
        className="mt-6 text-lg md:text-xl font-semibold text-text-primary"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: base + 0.22 }}
      >
        {step.title}
      </motion.h3>

      {/* 보조 설명 */}
      <motion.p
        className="mt-1.5 text-sm text-text-muted max-w-[15rem]"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: base + 0.3 }}
      >
        {step.desc}
      </motion.p>
    </motion.div>
  );
}

export default function S2_IconSteps({
  steps = DEFAULT_STEPS,
  className = '',
}: {
  /** 3~4단계 권장. 미지정 시 콘텐츠 앱 3스텝 기본값 */
  steps?: IconStep[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // 3~4열 자동: 4단계면 md 4열, 그 외 md 3열. 단계는 gap(여백)으로만 분리 — 연결선 없음.
  const cols = steps.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 ${cols} gap-y-12 gap-x-6 md:gap-x-8 w-full ${className}`}
    >
      {steps.map((step, i) => (
        <Step key={step.n} step={step} index={i} inView={inView} />
      ))}
    </div>
  );
}
