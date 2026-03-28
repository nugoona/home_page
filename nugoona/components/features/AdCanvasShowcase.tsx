'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, type Variants } from 'framer-motion';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ================================================================
   SHARED VARIANTS — visible spring physics
   ================================================================ */
const EASE = [0.16, 1, 0.3, 1] as const;
const springPop: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/* ================================================================
   CountUp — animate from 0 to target
   ================================================================ */
function CountUp({
  target, prefix = '', suffix = '', duration = 1.2, active,
}: {
  target: number; prefix?: string; suffix?: string; duration?: number; active: boolean;
}) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current.toLocaleString('ko-KR')}${suffix}`);
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, prefix, suffix, duration]);

  return <span>{display}</span>;
}

/* ================================================================
   DATA
   ================================================================ */
const STEPS = [
  {
    num: '01',
    title: '상품 URL 하나면 끝',
    desc: '상품 페이지 URL 입력 → AI가 이미지 추출, 광고 문구 작성. 4:5 자동 크롭, Instagram 피드 미리보기. "게시" 버튼 하나로 광고 시작.',
    sub: 'Cafe24 · MakeShop · GodoMall · Imweb',
  },
  {
    num: '02',
    title: '베스트 상품이 바뀌면, 광고도 바뀝니다',
    desc: '자사몰 상품 데이터 → Meta 카탈로그 자동 연동. 베스트셀러가 바뀌면 광고 소재도 자동 업데이트. 4단계 가이드로 다이나믹 카탈로그 광고 완성.',
    sub: null,
  },
  {
    num: '03',
    title: '구글 검색광고도 AI가 만들어 줍니다',
    desc: '랜딩 페이지 URL 입력 → AI가 헤드라인·설명문 자동 생성. 실시간 Ad Strength로 광고 효력 확인. RSA부터 Performance Max까지.',
    sub: 'RSA (반응형 검색광고) · PMax · Easy Mode (초보자용)',
  },
  {
    num: '04',
    title: '만들고 끝이 아닙니다 — 광고운영',
    desc: '캠페인 ON/OFF, 예산 조정, 성과 확인. Meta Ads Manager·Google Ads 없이 AdCanvas에서 바로. 캠페인 → 세트 → 광고, 3레벨 분석.',
    sub: '광고비 · ROAS · CPC · 클릭수 · 전환 · CTR',
  },
] as const;

const URLS = [
  'app.ngn.co.kr/create',
  'app.ngn.co.kr/catalog',
  'ads.google.com/campaigns',
  'app.ngn.co.kr/manage',
];

/* ================================================================
   STEP 01 — URL → Analyze → Done
   Gradient Border Spin + Pop + Slide Tags
   ================================================================ */
function Step01_UrlInput({ isActive }: { isActive: boolean }) {
  const [status, setStatus] = useState<'idle' | 'typing' | 'analyzing' | 'done'>('idle');
  const [typed, setTyped] = useState('');
  const url = 'https://myshop.cafe24.com/product/12345';
  const started = useRef(false);

  useEffect(() => {
    if (!isActive || started.current) return;
    started.current = true;
    setStatus('typing');
    let i = 0;
    const typeId = setInterval(() => {
      i++;
      setTyped(url.slice(0, i));
      if (i >= url.length) clearInterval(typeId);
    }, 35);
    const t1 = setTimeout(() => setStatus('analyzing'), 1800);
    const t2 = setTimeout(() => setStatus('done'), 4000);
    return () => { clearInterval(typeId); clearTimeout(t1); clearTimeout(t2); };
  }, [isActive]);

  const tags = ['2030 여성', '휴양지룩', '패션', '시즌'];

  return (
    <div style={{ width: '100%', position: 'relative', minHeight: 340 }}>
      {/* === Typing Phase === */}
      <motion.div
        animate={{ opacity: status === 'typing' ? 1 : 0, scale: status === 'typing' ? 1 : 0.95 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, pointerEvents: status === 'typing' ? 'auto' : 'none' }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: '#171717', marginBottom: 8 }}>
          상품 URL을 입력하세요
        </p>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 24 }}>
          AI가 상세페이지를 분석하여 광고를 만듭니다
        </p>
        {/* Input — clean static border */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
          <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', background: '#fff', border: '1px solid #0070f3' }}>
            <svg style={{ width: 16, height: 16, color: '#0070f3', marginRight: 8, flexShrink: 0 }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="4" /><path d="M10 10l3.5 3.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 12, color: '#666', ...EN }}>{typed}</span>
            <span style={{ width: 1, height: 16, background: '#0070f3', marginLeft: 2, animation: 'pulse 1s infinite' }} />
          </div>
        </div>
      </motion.div>

      {/* === Analyzing Phase — SVG circular spinner (immune to border-radius reset) === */}
      <motion.div
        animate={{ opacity: status === 'analyzing' ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', pointerEvents: status === 'analyzing' ? 'auto' : 'none' }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: 'spin 0.9s linear infinite', marginBottom: 20 }}>
          <circle cx="20" cy="20" r="17" fill="none" stroke="#eaeaea" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="17" fill="none" stroke="#0070f3" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" />
        </svg>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', marginBottom: 4 }}>AI Analyzing...</p>
        <p style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
          이미지 추출 및 카피 작성 중
        </p>
      </motion.div>

      {/* === Done Phase — Pop + Slide Tags === */}
      <motion.div
        animate={status === 'done' ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: 20, padding: 24, pointerEvents: status === 'done' ? 'auto' : 'none' }}
      >
        {/* Image card — spring pop from below */}
        <motion.div
          animate={status === 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          style={{ width: '50%', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #dbeafe, #ede9fe)', border: '1px solid #eaeaea', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: 'rgba(0,112,243,0.15)', ...EN }}>4:5</span>
            <motion.div
              animate={status === 'done' ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
              style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#fff', fontSize: 11, padding: '6px 12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg style={{ width: 14, height: 14 }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              생성 완료
            </motion.div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 8, background: '#f5f5f5', width: '75%', marginBottom: 4 }} />
            <div style={{ height: 8, background: '#f5f5f5', width: '50%' }} />
          </div>
        </motion.div>

        {/* Right info — staggered spring pop */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div
            animate={status === 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            style={{ border: '1px solid #eaeaea', padding: 16 }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, color: '#0070f3', marginBottom: 6, ...EN }}>AI Copywriting</p>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>&quot;올여름 가장 시원한 선택. 린넨 원피스 얼리버드 30% 할인&quot;</p>
          </motion.div>
          <motion.div
            animate={status === 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
            style={{ border: '1px solid #eaeaea', padding: 16 }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 6, ...EN }}>Targeting</p>
            {/* Tags slide in from x */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map((t, i) => (
                <motion.span
                  key={t}
                  animate={status === 'done' ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.1 }}
                  style={{ fontSize: 10, background: '#f5f5f5', color: '#666', padding: '2px 8px' }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div
            animate={status === 'done' ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.75 }}
            style={{ marginTop: 'auto', width: '100%', height: 40, background: '#0070f3', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            광고 게시하기
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   STEP 02 — Meta Catalog
   Stagger Cards + Pulse Badges + Shimmer
   ================================================================ */
function Step02_Catalog({ isActive }: { isActive: boolean }) {
  const products = [
    { name: '플로럴 원피스', price: '₩39,000', badge: 'NEW', color: '#0070f3' },
    { name: '린넨 셔츠', price: '₩52,000', badge: 'TOP', color: '#22c55e' },
    { name: '코튼 팬츠', price: '₩28,000', badge: null, color: '' },
    { name: '스트라이프 니트', price: '₩45,000', badge: 'AUTO', color: '#8b5cf6' },
  ];

  return (
    <div style={{ width: '100%', padding: 24, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #eaeaea' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#171717', ...EN }}>Meta Product Catalog</span>
          <span className="rounded-dot" style={{ width: 8, height: 8, background: '#22c55e', animation: isActive ? 'badgePulse 2s ease-in-out infinite' : 'none', color: 'rgba(34,197,94,0.4)' }} />
        </div>
        <span style={{ fontSize: 10, color: '#999', ...EN }}>Connected</span>
      </motion.div>

      {/* Product Grid — stagger pop */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {products.map((p, i) => (
          <motion.div
            key={i}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.15 }}
            style={{ border: '1px solid #eaeaea', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
          >
<div style={{ aspectRatio: '1/1', background: '#fafafa', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(234,234,234,0.4)' }} />
              {p.badge && (
                <span style={{
                  position: 'absolute', top: 6, left: 6, fontSize: 8, fontWeight: 700, color: '#fff', padding: '2px 6px', background: p.color,
                  animation: p.badge === 'AUTO' ? 'badgePulse 2s ease-in-out infinite' : undefined,
                  ...EN,
                }}>
                  {p.badge}
                </span>
              )}
            </div>
            <div style={{ padding: 8 }}>
              <p style={{ fontSize: 10, color: '#666' }}>{p.name}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#171717', ...EN }}>{p.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sync bar */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
        style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', background: '#fafafa', color: '#171717', fontSize: 11, fontWeight: 500, border: '1px solid #eaeaea' }}
      >
        <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 8a6 6 0 01-6 6M2 8a6 6 0 016-6" strokeLinecap="round" />
        </svg>
        Meta 카탈로그 실시간 동기화 중...
      </motion.div>
    </div>
  );
}

/* ================================================================
   STEP 03 — Google Ads
   Skeleton → Reveal + Ad Strength Gauge Fill
   ================================================================ */
function Step03_GoogleAds({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'skeleton' | 'reveal'>('idle');
  const [gaugeOn, setGaugeOn] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!isActive || started.current) return;
    started.current = true;
    setPhase('skeleton');
    const t1 = setTimeout(() => setPhase('reveal'), 800);
    const t2 = setTimeout(() => setGaugeOn(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive]);

  return (
    <div style={{ width: '100%', padding: 24, display: 'flex', flexDirection: 'column' }}>
      {/* Ad Block 1 */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#171717', ...EN }}>Sponsored</span>
          <span style={{ fontSize: 10, color: '#999' }}>· · ·</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <svg style={{ width: 14, height: 14, color: '#999' }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6" /><path d="M8 5v6M5 8h6" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, color: '#999', ...EN }}>myshop.com</span>
        </div>

        {phase !== 'reveal' ? (
          /* Skeleton bars — CSS animation for pulsing */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
            {['85%', '60%', '70%'].map((w, i) => (
              <div key={i} style={{ height: 14, width: w, background: '#e0e0e0', animation: phase === 'skeleton' ? `skeletonPulse 1.2s ease-in-out ${i * 0.15}s infinite` : undefined }} />
            ))}
          </div>
        ) : (
          /* Revealed text — spring entrance */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1a0dab', lineHeight: 1.3, marginBottom: 8 }}>
              여름 바캉스 룩 1위 | 지금 가입하면 3천원 할인
            </p>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
              트렌디한 스타일과 시원한 소재. 오늘 출발, 내일 도착. 첫 구매 무료 반품 혜택까지 놓치지 마세요.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {['베스트셀러', '신상품', '후기 보기'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  style={{ fontSize: 11, color: '#1a0dab', fontWeight: 500 }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Ad Block 2 */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
        style={{ borderTop: '1px solid #eaeaea', paddingTop: 16, marginBottom: 16 }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: '#171717', ...EN }}>Sponsored</span>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a0dab', lineHeight: 1.3, marginBottom: 4, marginTop: 4 }}>이번 주 베스트셀러 모아보기</p>
        <p style={{ fontSize: 11, color: '#666' }}>실시간 인기 상품 랭킹. 리뷰 4.8점 이상만 엄선.</p>
      </motion.div>

      {/* Ad Strength Gauge — fills from 0% to 75% */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
        style={{ padding: 16, background: 'rgba(0,112,243,0.05)', border: '1px solid rgba(0,112,243,0.15)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0070f3', ...EN }}>Ad Strength</span>
          <motion.span
            animate={gaugeOn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
            style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', ...EN }}
          >
            Excellent
          </motion.span>
        </div>
        <div style={{ display: 'flex', gap: 2, height: 8, width: '100%' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(0,112,243,0.1)', overflow: 'hidden' }}>
              <motion.div
                animate={gaugeOn ? { scaleX: i < 3 ? 1 : 0 } : { scaleX: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.15 }}
                style={{ width: '100%', height: '100%', background: '#0070f3', transformOrigin: 'left' }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   STEP 04 — Campaign Management
   Slide-in Rows + CountUp + Toggle Spring
   ================================================================ */
function Step04_Management({ isActive }: { isActive: boolean }) {
  const campaigns = [
    { name: 'Summer Sale 2026', roas: 350, on: true },
    { name: 'Brand Awareness', roas: 220, on: false },
    { name: 'Retargeting · Warm', roas: 485, on: true },
  ];

  return (
    <div style={{ width: '100%', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {campaigns.map((c, i) => (
        <motion.div
          key={i}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.15 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < 2 ? '1px solid #eaeaea' : 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Green/grey dot — CSS pulse for active */}
            <span className="rounded-dot" style={{
              width: 10, height: 10, display: 'block',
              background: c.on ? '#22c55e' : '#e0e0e0',
              animation: isActive && c.on ? 'badgePulse 2s ease-in-out infinite' : 'none',
              color: 'rgba(34,197,94,0.4)',
            }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', ...EN }}>{c.name}</p>
              <p style={{ fontSize: 11, color: '#999', ...EN }}>
                ROAS <CountUp target={c.roas} suffix="%" duration={1.2} active={isActive} />
              </p>
            </div>
          </div>
          {/* Toggle — smooth slide */}
          <div className="rounded-pill" style={{ width: 40, height: 22, display: 'flex', alignItems: 'center', padding: '0 2px', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              animate={isActive ? { background: c.on ? '#22c55e' : '#e0e0e0' } : { background: '#e0e0e0' }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
              className="rounded-pill"
              style={{ position: 'absolute', inset: 0 }}
            />
            <motion.div
              animate={isActive ? { x: c.on ? 18 : 0 } : { x: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.5 + i * 0.15 }}
              className="rounded-dot"
              style={{ width: 18, height: 18, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1 }}
            />
          </div>
        </motion.div>
      ))}

      {/* Stats — CountUp numbers + scale entrance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
        {[
          { label: 'Total Spend', value: 12, prefix: '₩', suffix: 'M', color: '#171717' },
          { label: 'Total ROAS', value: 340, prefix: '', suffix: '%', color: '#22c55e' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.15 }}
            style={{ border: '1px solid #eaeaea', padding: 16, textAlign: 'center' }}
          >
            <p style={{ fontSize: 10, color: '#999', marginBottom: 4, ...EN }}>{stat.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: stat.color, ...EN }}>
              {stat.suffix === 'M'
                ? <>{stat.prefix}<CountUp target={stat.value} suffix="" duration={1.2} active={isActive} /><span style={{ fontSize: 14 }}>.0M</span></>
                : <CountUp target={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.2} active={isActive} />
              }
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   BROWSER FRAME
   ================================================================ */
function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', border: '1px solid #eaeaea', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 40px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderBottom: '1px solid #eaeaea', background: '#fafafa' }}>
        <span className="rounded-dot" style={{ width: 8, height: 8, background: '#e0e0e0' }} />
        <span className="rounded-dot" style={{ width: 8, height: 8, background: '#e0e0e0' }} />
        <span className="rounded-dot" style={{ width: 8, height: 8, background: '#e0e0e0' }} />
        <span style={{ marginLeft: 12, flex: 1, height: 28, background: '#fff', border: '1px solid #eaeaea', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
          <span style={{ fontSize: 10, color: '#999', ...EN }}>{url}</span>
        </span>
      </div>
      <div style={{ background: '#fff' }}>{children}</div>
    </div>
  );
}

/* ================================================================
   FEATURE ROW — browser left, text right
   Passes isActive to Step AFTER parent entrance (450ms delay)
   ================================================================ */
function FeatureRow({
  step,
  url,
  Media,
  isAlt,
}: {
  step: typeof STEPS[number];
  url: string;
  Media: React.ComponentType<{ isActive: boolean }>;
  isAlt: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!inView) return;
    // Delay internal animations until parent spring entrance is visible
    const t = setTimeout(() => setIsActive(true), 450);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <Section alt={isAlt}>
      <div ref={ref} style={{ padding: '64px 48px', maxWidth: 1080, margin: '0 auto' }} className="max-md:!p-[40px_24px]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
          className="max-md:!grid-cols-1 max-md:!gap-8"
        >
          {/* LEFT: Browser Frame — springs in */}
          <motion.div variants={springPop}>
            <BrowserFrame url={url}>
              <Media isActive={isActive} />
            </BrowserFrame>
          </motion.div>

          {/* RIGHT: Text — staggered spring children */}
          <motion.div variants={staggerContainer}>
            <motion.div variants={springPop} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', background: '#171717', flexShrink: 0, ...EN }}>
                {step.num}
              </span>
              <div style={{ flex: 1, height: 1, background: '#eaeaea' }} />
            </motion.div>
            <motion.h3 variants={springPop} style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 16 }}>
              {step.title}
            </motion.h3>
            <motion.p variants={springPop} style={{ fontSize: 15, color: '#666', lineHeight: 1.7 }}>
              {step.desc}
            </motion.p>
            {step.sub && (
              <motion.p variants={springPop} style={{ marginTop: 16, fontSize: 14, color: '#999' }}>{step.sub}</motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export default function AdCanvasShowcase() {
  return (
    <>
      <Section id="adcanvas" crossMarks>
        <div className="py-20 px-12 max-md:py-12 max-md:px-6">
          <FadeUp>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0070f3', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, ...EN }}>AdCanvas</p>
              <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                메타·구글 광고를<br />직접 만들고 관리하세요
              </h2>
              <p style={{ fontSize: 17, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
                복잡한 광고 관리자는 잊으세요. 몇 번의 클릭으로 광고 생성, 성과 확인, 예산 조정까지.
              </p>
              <Link href="/start" className="inline-flex items-center gap-2 text-[14px] text-accent font-medium hover:gap-3 transition-[gap] duration-150">
                AdCanvas 시작하기
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      <FeatureRow step={STEPS[0]} url={URLS[0]} isAlt={false} Media={Step01_UrlInput} />
      <FeatureRow step={STEPS[1]} url={URLS[1]} isAlt={true} Media={Step02_Catalog} />
      <FeatureRow step={STEPS[2]} url={URLS[2]} isAlt={false} Media={Step03_GoogleAds} />
      <FeatureRow step={STEPS[3]} url={URLS[3]} isAlt={true} Media={Step04_Management} />
    </>
  );
}
