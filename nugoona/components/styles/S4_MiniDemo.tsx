'use client';

/**
 * S4_MiniDemo — 랜딩용 개념 그래픽 "스타일④: 미니 인터랙티브 데모"
 *
 * 개념: 방문자가 샘플 사진을 직접 누르면 → 그 자리에서 AI가 글을 타이핑하듯 써 내려가고
 *       → 여러 채널에 발행되고 → 네이버 검색결과에 '우리 스토어'가 뜨는 걸
 *       직접 눌러 확인한다. "영상·설명 대신 진짜 제품처럼 눌러보는 축소판 — 한 번 만지면 안다."
 *
 * 상태 기계: idle → writing(타이핑) → publishing(채널 점등) → result(검색결과 등장)
 *   · 타이핑 = setInterval 한 글자씩 · 채널 발행 = 순차 점등 · 검색결과 = accent 하이라이트 인라인 재현
 *   · 재생/리셋 포함 · 사진마다 글·키워드·스토어가 달라져 "진짜 반응하는 제품"처럼 느껴지게
 *
 * ⛔ 노드-선 다이어그램 금지. accent(#0070f3)·직각(전역 border-radius:0)·미니멀. 데스크·모바일 반응형.
 * 신규 라이브러리 0 — framer-motion(설치됨) + React state만.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

type Step = 'idle' | 'writing' | 'publishing' | 'result';

interface Sample {
  emoji: string;
  gradient: string;
  keyword: string;
  store: string;
  desc: string;
  reviews: number;
  body: string;
}

/* 샘플 3종 — 고른 사진에 따라 글·키워드·스토어가 달라진다(제품이 진짜 반응하는 느낌) */
const SAMPLES: Sample[] = [
  {
    emoji: '🥞',
    gradient: 'linear-gradient(135deg,#fff6e9,#ffe7c7)',
    keyword: '성수동 브런치',
    store: '오늘의 브런치, 성수',
    desc: '성수동 · 브런치 카페 · 리뷰 214',
    reviews: 214,
    body: '성수동에서 브런치 찾으신다면 여기예요. 갓 구운 리코타 팬케이크와 직접 만든 에그 베네딕트, 향 좋은 핸드드립까지 한 접시에. 주말 웨이팅 있으니 미리 예약하고 오세요.',
  },
  {
    emoji: '☕',
    gradient: 'linear-gradient(135deg,#f3ede6,#e2d3c2)',
    keyword: '성수 카페 추천',
    store: '성수 로스터리',
    desc: '성수동 · 로스터리 카페 · 리뷰 187',
    reviews: 187,
    body: '직접 볶은 원두로 내리는 성수 로스터리입니다. 고소한 라떼 한 잔에 창가 햇살 좋은 자리까지. 노트북 작업하기 딱 좋은 조용한 2층도 있어요. 오늘 로스팅한 원두는 소량만 판매합니다.',
  },
  {
    emoji: '🍰',
    gradient: 'linear-gradient(135deg,#fdeef2,#f6d7e2)',
    keyword: '성수 디저트 맛집',
    store: '성수 디저트랩',
    desc: '성수동 · 디저트 전문 · 리뷰 302',
    reviews: 302,
    body: '매일 아침 굽는 성수 디저트랩의 시그니처 바스크 치즈케이크. 겉은 진하고 속은 촉촉하게, 당도는 딱 기분 좋을 만큼만. 제철 과일 타르트는 재료 소진 시 조기 마감되니 서둘러 오세요.',
  },
];

const CHANNELS = ['네이버 블로그', '네이버 플레이스', '인스타그램', '구글 비즈니스'];
const STEP_LABELS = ['사진 선택', 'AI 작성', '발행', '검색 노출'] as const;
const STEP_INDEX: Record<Step, number> = { idle: 0, writing: 1, publishing: 2, result: 3 };

const COMPETITORS = ['○○ 카페', '△△ 하우스'];

/* ── 아이콘(인라인 SVG, 외부 자산 0) ── */
function IconSearch({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.6">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M11 11l3 3" strokeLinecap="round" />
    </svg>
  );
}
function IconCheck({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2">
      <path d="M3 8.5l3.2 3.2L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconReplay({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" strokeLinecap="round" />
      <path d="M13.8 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 상단 스텝 인디케이터 ── */
function Stepper({ step }: { step: Step }) {
  const active = STEP_INDEX[step];
  return (
    <div className="flex items-center gap-1.5 max-md:gap-1">
      {STEP_LABELS.map((label, i) => {
        const on = i <= active;
        const current = i === active && step !== 'result';
        return (
          <div key={label} className="flex items-center gap-1.5 max-md:gap-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'rounded-dot w-1.5 h-1.5 transition-colors duration-300',
                  on ? 'bg-accent' : 'bg-border-mid',
                  current && 'animate-pulse'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-300 max-md:hidden',
                  on ? 'text-accent' : 'text-text-disabled'
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <span className={cn('block w-4 h-px transition-colors duration-300 max-md:w-2', i < active ? 'bg-accent' : 'bg-border-mid')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 발행 채널 칩 ── */
function ChannelChip({ label, lit }: { label: string; lit: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={lit ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.35, ease: EASE }}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 border text-[11px] font-medium transition-colors duration-300 max-md:text-[10px] max-md:px-2',
        lit ? 'border-accent bg-accent-bg text-accent' : 'border-border-default bg-white text-text-disabled'
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-3.5 h-3.5 rounded-dot transition-colors duration-300',
          lit ? 'bg-accent text-white' : 'bg-border-light text-transparent'
        )}
      >
        <IconCheck size={9} color="currentColor" />
      </span>
      {label}
    </motion.div>
  );
}

export default function S4_MiniDemo({ className }: { className?: string }) {
  const [step, setStep] = useState<Step>('idle');
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [lit, setLit] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const sample = SAMPLES[picked ?? 0];
  const typingDone = typed.length >= sample.body.length;

  /* 리셋 */
  const reset = useCallback(() => {
    setStep('idle');
    setPicked(null);
    setTyped('');
    setLit(0);
    setConfirmed(false);
  }, []);

  /* 사진 선택 → 시작 */
  const start = useCallback((i: number) => {
    setPicked(i);
    setTyped('');
    setLit(0);
    setConfirmed(false);
    setStep('writing');
  }, []);

  /* 타이핑 애니 (setInterval 한 글자씩) */
  useEffect(() => {
    if (step !== 'writing' || picked === null) return;
    const full = SAMPLES[picked].body;
    setTyped('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        window.setTimeout(() => setStep('publishing'), 650);
      }
    }, 26);
    return () => clearInterval(id);
  }, [step, picked]);

  /* 발행: 채널 순차 점등 */
  useEffect(() => {
    if (step !== 'publishing') return;
    setLit(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setLit(n);
      if (n >= CHANNELS.length) {
        clearInterval(id);
        window.setTimeout(() => setStep('result'), 750);
      }
    }, 360);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div
      className={cn(
        'w-full max-w-[560px] mx-auto border border-border-default bg-white',
        'shadow-[0_24px_80px_rgba(0,0,0,0.07),0_4px_20px_rgba(0,0,0,0.03)]',
        className
      )}
    >
      {/* 헤더: 브라우저 점 + 타이틀 + 스텝 + 리셋 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default bg-bg-alt max-md:px-3">
        <div className="flex items-center gap-1.5 shrink-0 max-md:hidden">
          <span className="rounded-dot w-2 h-2 bg-[#e0e0e0]" />
          <span className="rounded-dot w-2 h-2 bg-[#e0e0e0]" />
          <span className="rounded-dot w-2 h-2 bg-[#e0e0e0]" />
        </div>
        <span className="text-[11px] font-bold text-text-primary tracking-tight" style={EN}>
          nugoona · LIVE DEMO
        </span>
        <div className="flex-1" />
        <Stepper step={step} />
        {step !== 'idle' && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 px-2 py-1 border border-border-default bg-white text-[10px] font-medium text-text-muted hover:border-accent hover:text-accent transition-colors shrink-0"
            aria-label="처음부터 다시 보기"
          >
            <IconReplay size={11} />
            <span className="max-md:hidden">다시</span>
          </button>
        )}
      </div>

      {/* 진행 바 */}
      <div className="h-0.5 w-full bg-border-light overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${(STEP_INDEX[step] / (STEP_LABELS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>

      {/* 스테이지 */}
      <div className="relative min-h-[340px] p-5 max-md:min-h-[320px] max-md:p-4">
        <AnimatePresence mode="wait">
          {/* ───────── ① IDLE: 사진 고르기 ───────── */}
          {step === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col h-full"
            >
              <div className="mb-1 text-[15px] font-bold text-text-primary leading-snug max-md:text-[14px]">
                사진 4장이면 끝.
              </div>
              <p className="text-[12px] text-text-muted mb-5 max-md:mb-4">
                나머지 글쓰기·발행·검색 노출은 전부 자동입니다. 직접 눌러보세요.
              </p>

              <div className="grid grid-cols-3 gap-2.5 max-md:gap-2">
                {SAMPLES.map((s, i) => (
                  <button
                    key={s.keyword}
                    type="button"
                    onClick={() => start(i)}
                    aria-label={`${s.keyword} 샘플 사진으로 데모 시작`}
                    className="group relative aspect-square border border-border-default hover:border-accent focus-visible:border-accent outline-none transition-colors overflow-hidden"
                    style={{ background: s.gradient }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[38px] max-md:text-[30px] transition-transform duration-300 group-hover:scale-110">
                      {s.emoji}
                    </span>
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-white/85 text-[8px] font-semibold text-text-muted" style={EN}>
                      SAMPLE
                    </span>
                    <span className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/45 to-transparent text-[10px] font-medium text-white text-left leading-tight">
                      {s.keyword}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-5 flex items-center gap-1.5 text-[11px] text-accent font-medium">
                <motion.span
                  animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[14px] leading-none"
                >
                  👆
                </motion.span>
                아무 사진이나 누르면 5초 만에 결과까지 봅니다
              </div>
            </motion.div>
          )}

          {/* ───────── ② WRITING: AI 타이핑 ───────── */}
          {step === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex gap-4 h-full max-md:flex-col max-md:gap-3"
            >
              {/* 선택 사진 */}
              <div className="shrink-0 max-md:flex max-md:items-center max-md:gap-3">
                <div
                  className="w-28 h-28 border border-border-default flex items-center justify-center text-[46px] max-md:w-16 max-md:h-16 max-md:text-[30px]"
                  style={{ background: sample.gradient }}
                >
                  {sample.emoji}
                </div>
                <div className="mt-2 max-md:mt-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-bg text-accent text-[10px] font-semibold">
                    <IconCheck size={9} /> 사진 선택됨
                  </span>
                  <p className="text-[11px] text-text-muted mt-1.5 max-md:mt-1">{sample.keyword}</p>
                </div>
              </div>

              {/* 글 작성 패널 */}
              <div className="flex-1 border border-border-default bg-bg-alt flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-light bg-white">
                  <span className="rounded-dot w-1.5 h-1.5 bg-accent animate-pulse" />
                  <span className="text-[11px] font-semibold text-accent" style={EN}>Claude</span>
                  <span className="text-[11px] text-text-muted">
                    {typingDone ? '작성 완료' : '가 글을 쓰는 중…'}
                  </span>
                </div>
                <div className="p-3 flex-1">
                  <p className="text-[13px] font-bold text-text-primary mb-1.5">{sample.store}</p>
                  <p className="text-[12px] leading-relaxed text-text-body break-keep">
                    {typed}
                    {!typingDone && <span className="inline-block w-px h-3.5 bg-accent align-middle ml-px animate-pulse" />}
                  </p>
                </div>
                <div className="px-3 py-2 border-t border-border-light flex items-center gap-1.5">
                  <span className="text-[10px] text-text-disabled">
                    {typingDone ? '발행 준비 중…' : '사진을 읽고 우리 가게 글을 자동 작성합니다'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───────── ③ PUBLISHING: 채널 순차 발행 ───────── */}
          {step === 'publishing' && (
            <motion.div
              key="publishing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[15px] font-bold text-text-primary max-md:text-[14px]">한 번에 여러 곳에 발행 중…</span>
              </div>
              <p className="text-[12px] text-text-muted mb-5">글 한 편이 채널마다 형식에 맞춰 자동으로 올라갑니다.</p>

              {/* 발행 대상 글 요약 */}
              <div className="flex items-center gap-3 px-3 py-2.5 border border-border-default bg-bg-alt mb-5">
                <div
                  className="w-10 h-10 shrink-0 border border-border-light flex items-center justify-center text-[22px]"
                  style={{ background: sample.gradient }}
                >
                  {sample.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-text-primary truncate">{sample.store}</p>
                  <p className="text-[11px] text-text-muted truncate">{sample.body.slice(0, 26)}…</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-md:gap-1.5">
                {CHANNELS.map((ch, i) => (
                  <ChannelChip key={ch} label={ch} lit={i < lit} />
                ))}
              </div>

              <div className="mt-auto pt-5 flex items-center gap-1.5 text-[11px] text-text-muted">
                <span className="rounded-dot w-1.5 h-1.5 bg-accent animate-pulse" />
                {lit}/{CHANNELS.length} 채널 발행 완료
              </div>
            </motion.div>
          )}

          {/* ───────── ④ RESULT: 검색결과 등장(직접 눌러 확인) ───────── */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-bg text-accent text-[10px] font-semibold">
                  <IconCheck size={9} /> 발행 완료
                </span>
                <span className="text-[13px] font-bold text-text-primary max-md:text-[12px]">이제 검색에 우리 가게가 뜹니다</span>
              </div>

              {/* 검색창 */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-2 border-[#03c75a] mb-3">
                <span className="text-[13px] text-text-primary flex-1" style={EN}>{sample.keyword}</span>
                <IconSearch size={15} color="#03c75a" />
              </div>

              {/* 결과 리스트 */}
              <div className="flex flex-col gap-2 flex-1">
                {/* #1 우리 스토어 — 클릭해 확인 */}
                <motion.button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
                  className="relative text-left border border-accent bg-accent-bg px-3.5 py-3 outline-none hover:shadow-[0_0_0_3px_rgba(0,112,243,0.12)] focus-visible:shadow-[0_0_0_3px_rgba(0,112,243,0.12)] transition-shadow"
                  aria-label="검색결과 우리 스토어 — 눌러서 확인"
                >
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-white bg-accent px-1.5 py-0.5" style={EN}>
                    검색 노출 · MY STORE
                  </span>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
                    <span className="text-[14px] font-semibold text-text-primary">{sample.store}</span>
                  </div>
                  <p className="text-[11px] text-text-body leading-relaxed pr-16">
                    {sample.desc} · “{sample.body.slice(0, 16)}…”
                  </p>

                  {/* 클릭 확인 오버레이 */}
                  <AnimatePresence>
                    {confirmed && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-accent"
                      >
                        <IconCheck size={10} /> 실제 검색에서도 이렇게 우리 가게가 노출됩니다
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* 경쟁 결과(흐림) */}
                {COMPETITORS.map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.1 }}
                    className="border border-border-light px-3.5 py-3"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-dot w-1.5 h-1.5 bg-[#ccc]" />
                      <span className="text-[13px] font-medium text-text-muted">{name}</span>
                    </div>
                    <span className="block h-1.5 w-3/4 bg-[#ededed]" />
                  </motion.div>
                ))}
              </div>

              {/* 하단 CTA: 확인 유도 + 다시 하기 */}
              <div className="mt-4 flex items-center gap-2">
                {!confirmed ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-1 text-[11px] font-medium text-accent"
                  >
                    👆 위 결과를 눌러 확인해 보세요
                  </motion.span>
                ) : (
                  <span className="text-[11px] font-medium text-text-muted">사진 4장으로 여기까지 — 전부 자동이었습니다.</span>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-accent bg-accent text-white text-[11px] font-semibold hover:bg-[#005fd0] transition-colors"
                >
                  <IconReplay size={12} /> 다시 해보기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
