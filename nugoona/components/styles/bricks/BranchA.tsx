'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { branch } from '@/lib/content/home';

/* ═══════════════════════════════════════════════════════════════
   벽돌2 · 홈 분기 카드 — 시안 A "살아있는 두 데모"
   각 카드 안에서 그 제품이 실제로 '일하는' 3막(비포→진행→애프터)을
   스크롤 진입(useInView once) 시 발화한다. 카피는 lib/content/home 의
   branch(title/sub/cards)를 토씨 그대로 import — 카드 하단에 배치.
     · 콘텐츠(그린 #2fd46b): 검색창 타이핑 → 검색 → 내 플레이스/블로그가
       상단 노출되는 순간(순위 상승·하이라이트 점등).
     · 광고(블루 #3e8bff): 상품 URL 입력 → 이미지·문구·타깃 체크 →
       인스타 실물 포스트로 조립되어 게시되는 순간.
   제품색은 카드 래퍼에서 CSS 변수(--color-accent)를 갈아끼워
   카피의 text-accent 스팬까지 제품색으로 물들인다(카피 무변형).
   ═══════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;
const EN = { fontFamily: 'var(--font-en)' } as React.CSSProperties;

const GREEN = '#2fd46b';   // 콘텐츠 제품색
const BLUE = '#3e8bff';    // 광고 제품색
const NAVER = '#03c75a';   // 네이버 크롬(데이터색 §8.9)
const POST_IMG = '/img/unsplash/webp/photo-1496747611176-843222e1e57c.webp'; // AdCanvas 재사용 실사

/* ── 카운트업(뷰 진입·active 시 0→target) ── */
function CountUp({ target, active, suffix = '' }: { target: number; active: boolean; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1000;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setV(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return <>{v.toLocaleString('ko-KR')}{suffix}</>;
}

/* ── 공용 목업 상단바(브라우저/앱 크롬 + LIVE 펄스) ── */
function DemoTopBar({ url, color }: { url: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-default bg-white">
      <span className="rounded-dot inline-block" style={{ width: 8, height: 8, background: '#e0e0e0' }} />
      <span className="rounded-dot inline-block" style={{ width: 8, height: 8, background: '#e0e0e0' }} />
      <span className="rounded-dot inline-block" style={{ width: 8, height: 8, background: '#e0e0e0' }} />
      <span className="flex-1 ml-2 truncate text-[11px] text-text-muted" style={EN}>{url}</span>
      <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted" style={EN}>
        <motion.span
          className="rounded-dot inline-block"
          style={{ width: 6, height: 6, background: color }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: EASE }}
        />
        LIVE
      </span>
    </div>
  );
}

/* ================================================================
   콘텐츠 데모 — 검색 → 내 플레이스/블로그 상단 노출
   ================================================================ */
const CONTENT_QUERY = '성수동 브런치 카페';

function ContentDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'idle' | 'searching' | 'results'>('idle');
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const TYPE_MS = 62;
    const typeDur = CONTENT_QUERY.length * TYPE_MS;
    let i = 0;
    const typeId = setInterval(() => {
      i++;
      setTyped(CONTENT_QUERY.slice(0, i));
      if (i >= CONTENT_QUERY.length) clearInterval(typeId);
    }, TYPE_MS);
    const t1 = setTimeout(() => setPhase('searching'), typeDur + 320);
    const t2 = setTimeout(() => setPhase('results'), typeDur + 1180);
    return () => { clearInterval(typeId); clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  const typing = typed.length < CONTENT_QUERY.length;
  const results = phase === 'results';
  const revealed = phase !== 'idle';

  return (
    <div ref={ref} className="flex flex-col h-full bg-white">
      <DemoTopBar url="search.naver.com" color={GREEN} />

      <div className="flex flex-col flex-1 p-5 max-md:p-6">
        {/* 검색창 — 네이버 크롬(타이핑) */}
        <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ border: `2px solid ${NAVER}` }}>
          <span className="flex-1 text-[13px] max-md:text-[14px] text-text-primary" style={EN}>
            {typed}
            {typing && (
              <span
                className="inline-block align-middle ml-0.5"
                style={{ width: 1, height: 14, background: NAVER, animation: 'pulse 1s infinite' }}
              />
            )}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={NAVER} strokeWidth="1.75">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
        </div>

        {/* 결과 영역 */}
        <div className="relative flex flex-col gap-2.5 mt-3 flex-1">
          {/* 스캔 라인(검색 실행 순간) */}
          {phase === 'searching' && (
            <motion.div
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: '100%', opacity: [0, 1, 0] }}
              transition={{ duration: 0.85, ease: 'linear' }}
              className="pointer-events-none absolute left-0 right-0 z-10"
              style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }}
            />
          )}

          {/* #1 내 플레이스 — 순위 상승·하이라이트 점등 */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={results ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex items-start justify-between gap-3"
            style={{ border: `1px solid ${GREEN}`, background: 'rgba(47,212,107,0.08)', padding: '12px 14px' }}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <motion.span
                className="rounded-dot inline-block shrink-0 mt-1"
                style={{ width: 7, height: 7, background: GREEN, color: 'rgba(47,212,107,0.5)' }}
                animate={results ? { boxShadow: ['0 0 0 0 currentColor', '0 0 7px 2px currentColor', '0 0 0 0 currentColor'] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: EASE, delay: 0.6 }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 shrink-0" style={{ color: GREEN, background: 'rgba(47,212,107,0.12)', ...EN }}>
                    플레이스
                  </span>
                  <span className="text-[14px] max-md:text-[15px] font-semibold text-text-primary truncate">오늘의 브런치, 성수</span>
                </div>
                <p className="text-[11px] text-text-body leading-relaxed">
                  성수동 · 브런치 카페 · 리뷰 <CountUp target={214} active={results} />
                </p>
              </div>
            </div>
            {/* 순위 상승 인디케이터(pathLength 상승선) */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px] font-bold whitespace-nowrap" style={{ color: GREEN, ...EN }}>▲ 3위→1위</span>
              <svg width="34" height="16" viewBox="0 0 34 16" fill="none">
                <motion.path
                  d="M2 13 L11 9 L20 11 L32 3"
                  stroke={GREEN}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: results ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                />
                <motion.circle
                  cx="32" cy="3" r="1.8" fill={GREEN}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: results ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 1.05 }}
                />
              </svg>
            </div>
          </motion.div>

          {/* #2 블로그 — 상단 노출 */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={results ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            style={{ border: `1px solid rgba(47,212,107,0.35)`, padding: '10px 14px' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-bold px-1.5 py-0.5 shrink-0" style={{ color: GREEN, background: 'rgba(47,212,107,0.12)', ...EN }}>
                블로그
              </span>
              <span className="text-[13px] max-md:text-[14px] font-medium text-text-primary truncate">성수동 브런치 맛집, 다녀왔어요</span>
            </div>
            <p className="text-[11px] text-text-muted">방문 리뷰 · 사진 12장</p>
          </motion.div>

          {/* 경쟁 결과(흐림) */}
          {['○○ 카페', '△△ 브런치하우스'].map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              animate={revealed ? { opacity: 0.5 } : { opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.35 + i * 0.1 }}
              className="flex items-center gap-2"
              style={{ border: '1px solid #f0f0f0', padding: '9px 14px' }}
            >
              <span className="rounded-dot inline-block shrink-0" style={{ width: 6, height: 6, background: '#ccc' }} />
              <span className="text-[12px] text-text-muted whitespace-nowrap">{name}</span>
              <span className="block h-1.5 flex-1" style={{ background: '#ededed' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   광고 데모 — URL 입력 → 체크리스트 → 인스타 실물 포스트 게시
   ================================================================ */
const ADS_URL = 'myshop.cafe24.com/product/12345';
const ADS_CHECKS = ['이미지 추출', '광고 문구 작성', '타깃 설정'];

function AdsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'input' | 'checking' | 'posted'>('input');
  const [checkIdx, setCheckIdx] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const TYPE_MS = 34;
    const typeDur = ADS_URL.length * TYPE_MS;
    let i = 0;
    const typeId = setInterval(() => {
      i++;
      setTyped(ADS_URL.slice(0, i));
      if (i >= ADS_URL.length) clearInterval(typeId);
    }, TYPE_MS);
    const t1 = setTimeout(() => setPhase('checking'), typeDur + 420);
    const t2 = setTimeout(() => setPhase('posted'), typeDur + 420 + 1850);
    return () => { clearInterval(typeId); clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  useEffect(() => {
    if (phase !== 'checking') return;
    const s1 = setTimeout(() => setCheckIdx(1), 450);
    const s2 = setTimeout(() => setCheckIdx(2), 900);
    const s3 = setTimeout(() => setCheckIdx(3), 1350);
    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); };
  }, [phase]);

  const typing = typed.length < ADS_URL.length;
  const posted = phase === 'posted';

  return (
    <div ref={ref} className="flex flex-col h-full bg-white">
      <DemoTopBar url="app.ngn.co.kr/create" color={BLUE} />

      <div className="relative flex-1">
        {/* ── ① URL 입력 ── */}
        <motion.div
          animate={{ opacity: phase === 'input' ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6"
          style={{ pointerEvents: phase === 'input' ? 'auto' : 'none' }}
        >
          <p className="text-[13px] max-md:text-[14px] font-semibold text-text-primary mb-1.5">상품 URL을 붙여넣으세요</p>
          <p className="text-[11px] max-md:text-[13px] text-text-weak mb-5">AI가 상세페이지를 읽고 광고를 만듭니다</p>
          <div className="flex items-center gap-2 w-full max-w-[300px] px-3.5 h-11" style={{ border: `1px solid ${BLUE}` }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={BLUE} strokeWidth="1.5" className="shrink-0">
              <circle cx="7" cy="7" r="4" /><path d="M10 10l3.5 3.5" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] text-text-weak truncate" style={EN}>{typed}</span>
            {typing && <span style={{ width: 1, height: 14, background: BLUE, animation: 'pulse 1s infinite' }} />}
          </div>
        </motion.div>

        {/* ── ② 체크리스트(진행) + animateMotion 데이터 도트 ── */}
        <motion.div
          animate={{ opacity: phase === 'checking' ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6"
          style={{ pointerEvents: phase === 'checking' ? 'auto' : 'none' }}
        >
          <p className="text-[13px] max-md:text-[14px] font-semibold text-text-primary mb-5">AI가 광고를 만들고 있어요</p>
          <div className="relative flex gap-3">
            {/* 데이터 흐름 도트(SMIL) */}
            <svg width="8" height="96" viewBox="0 0 8 96" fill="none" className="shrink-0">
              <path d="M4 4 V 92" stroke={BLUE} strokeWidth="1" opacity="0.2" />
              <circle r="2.5" fill={BLUE}>
                <animateMotion dur="1.4s" repeatCount="indefinite" path="M4 4 V 92" />
              </circle>
            </svg>
            <div className="flex flex-col gap-3.5">
              {ADS_CHECKS.map((label, i) => {
                const done = checkIdx > i;
                return (
                  <div key={label} className="flex items-center gap-2.5">
                    <motion.span
                      animate={done
                        ? { scale: [1, 1.2, 1], background: BLUE, borderColor: BLUE }
                        : { scale: 1, background: '#fff', borderColor: '#eaeaea' }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="inline-flex items-center justify-center shrink-0"
                      style={{ width: 18, height: 18, border: '1px solid #eaeaea' }}
                    >
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5">
                          <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </motion.span>
                    <span
                      className="text-[13px] max-md:text-[14px]"
                      style={{ fontWeight: done ? 600 : 400, color: done ? '#171717' : '#999', transition: 'color 0.3s' }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── ③ 인스타 실물 포스트 조립·게시 ── */}
        <motion.div
          animate={{ opacity: posted ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-5 max-md:p-6"
          style={{ pointerEvents: posted ? 'auto' : 'none' }}
        >
          <motion.div
            animate={posted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="w-full max-w-[210px] flex flex-col"
            style={{ border: '1px solid #eaeaea', background: '#fff' }}
          >
            {/* 프로필 행 */}
            <div className="flex items-center gap-2 px-2.5 py-2">
              <span className="rounded-dot inline-flex items-center justify-center shrink-0" style={{ width: 22, height: 22, background: BLUE, color: '#fff', fontSize: 10, fontWeight: 700, ...EN }}>M</span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] font-bold text-text-primary truncate" style={EN}>myshop_official</span>
                <span className="text-[9px] text-text-muted" style={EN}>Sponsored</span>
              </div>
              <span className="text-[12px] text-text-muted tracking-widest">···</span>
            </div>
            {/* 상품 실사 */}
            <div className="relative w-full overflow-hidden" style={{ height: 128, background: '#fafafa' }}>
              <img src={POST_IMG} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover' }} />
            </div>
            {/* 좋아요·댓글·공유 라인아트 */}
            <div className="flex items-center gap-3 px-2.5 pt-2 pb-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4">
                <path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4">
                <path d="M2 3h12v7H6l-3 3V10H2V3z" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4">
                <path d="M2 8l12-5-4 12-2.5-5L2 8z" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[11px] font-bold text-text-primary px-2.5 pt-0.5" style={EN}>
              좋아요 <CountUp target={1248} active={posted} />개
            </p>
            <p className="text-[11px] text-text-primary px-2.5 pt-1 pb-2.5 leading-snug truncate">
              <span className="font-bold mr-1" style={EN}>myshop_official</span>
              올여름 가장 시원한 선택, 린넨 원피스 30% 할인
            </p>
          </motion.div>

          {/* 게시 완료 칩 */}
          <motion.div
            animate={posted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.7 }}
            className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1"
            style={{ background: 'rgba(62,139,255,0.08)' }}
          >
            <motion.span
              className="rounded-dot inline-block"
              style={{ width: 6, height: 6, background: BLUE, color: 'rgba(62,139,255,0.5)' }}
              animate={posted ? { boxShadow: ['0 0 0 0 currentColor', '0 0 7px 2px currentColor', '0 0 0 0 currentColor'] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: EASE, delay: 1 }}
            />
            <span className="text-[11px] font-bold" style={{ color: BLUE, ...EN }}>Instagram 게시 완료</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================
   메인 — 분기 2카드
   ================================================================ */
export default function BranchA() {
  return (
    <section className="py-[100px] px-12 max-md:py-16 max-md:px-6 bg-white">
      {/* 헤더(카피 무변형) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-14 max-md:mb-10"
      >
        <h2
          className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-4"
          dangerouslySetInnerHTML={{ __html: branch.title }}
        />
        <p className="text-[16px] max-md:font-medium text-text-body">{branch.sub}</p>
      </motion.div>

      {/* 2카드 */}
      <div className="grid grid-cols-2 gap-6 max-w-[1080px] mx-auto max-md:grid-cols-1">
        {branch.cards.map((c, i) => {
          const isContent = c.mock === 'search';
          const color = isContent ? GREEN : BLUE;
          return (
            <motion.div
              key={c.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              /* 카드 범위 안에서만 강조색을 제품색으로 — 카피의 text-accent 스팬이 물든다 */
              style={{ ['--color-accent' as string]: color } as React.CSSProperties}
            >
              <Link
                href={c.href}
                className="group flex flex-col h-full border border-border-default bg-white overflow-hidden transition-all duration-300 hover:border-border-hover hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
              >
                {/* 살아있는 데모 */}
                <div className="h-[360px] max-md:h-[420px] border-b border-border-default overflow-hidden">
                  {isContent ? <ContentDemo /> : <AdsDemo />}
                </div>

                {/* 텍스트(카피 무변형) */}
                <div className="p-7 flex flex-col flex-1 max-md:p-6">
                  <p className="text-[11px] max-md:text-[13px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3" style={EN}>
                    {c.eyebrow}
                  </p>
                  <h3
                    className="text-[clamp(20px,2.4vw,26px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3"
                    dangerouslySetInnerHTML={{ __html: c.title }}
                  />
                  <p className="text-[14px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.65] mb-6 flex-1">{c.desc}</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium group-hover:gap-2.5 transition-[gap] duration-150"
                    style={{ color }}
                  >
                    {c.cta}
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M6 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
