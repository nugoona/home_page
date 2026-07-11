'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, type Variants } from 'framer-motion';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const U = (id: string) => `/img/unsplash/webp/${id}.webp`;

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
export function CountUp({
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
  const [checkIdx, setCheckIdx] = useState(0);
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

  // 분석 단계 체크리스트 — "일이 되어가는 과정"이 눈에 보이도록 500ms 간격 순차 체크
  useEffect(() => {
    if (status !== 'analyzing') { setCheckIdx(0); return; }
    const s1 = setTimeout(() => setCheckIdx(1), 500);
    const s2 = setTimeout(() => setCheckIdx(2), 1000);
    const s3 = setTimeout(() => setCheckIdx(3), 1500);
    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); };
  }, [status]);

  const checklist = ['이미지 추출', '광고 문구 작성', '타깃 설정'];
  const tags = ['2030 여성', '휴양지룩', '패션', '시즌'];

  return (
    <div style={{ width: '100%', position: 'relative', minHeight: 400 }}>
      {/* === Typing Phase === */}
      <motion.div
        animate={{ opacity: status === 'typing' ? 1 : 0, scale: status === 'typing' ? 1 : 0.95 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, pointerEvents: status === 'typing' ? 'auto' : 'none' }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: '#171717', marginBottom: 8 }}>
          상품 URL을 입력하세요
        </p>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
          AI가 상세페이지를 분석하여 광고를 만듭니다
        </p>
        {/* Input — clean static border */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
          <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', background: '#fff', border: '1px solid #0070f3' }}>
            <svg style={{ width: 16, height: 16, color: '#0070f3', marginRight: 8, flexShrink: 0 }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="4" /><path d="M10 10l3.5 3.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 13, color: '#666', ...EN }}>{typed}</span>
            <span style={{ width: 1, height: 16, background: '#0070f3', marginLeft: 2, animation: 'pulse 1s infinite' }} />
          </div>
        </div>
      </motion.div>

      {/* === Analyzing Phase — 체크리스트로 "일이 되어가는 과정"을 눈에 보이게 (스피너 단독 → progress) === */}
      <motion.div
        animate={{ opacity: status === 'analyzing' ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', pointerEvents: status === 'analyzing' ? 'auto' : 'none' }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', marginBottom: 20 }}>AI가 광고를 만들고 있어요</p>
        <div style={{ width: '100%', maxWidth: 240 }}>
          {checklist.map((label, i) => {
            const checked = checkIdx > i;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < checklist.length - 1 ? 12 : 0 }}>
                <motion.div
                  animate={checked ? { scale: [1, 1.2, 1], backgroundColor: '#0070f3', borderColor: '#0070f3' } : { scale: 1, backgroundColor: '#fff', borderColor: '#eaeaea' }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ width: 18, height: 18, border: '1px solid #eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  {checked && (
                    <svg style={{ width: 10, height: 10 }} viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.div>
                <span style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? '#171717' : '#999', transition: 'color 0.3s' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* === Done Phase — Pop + Slide Tags === */}
      <motion.div
        animate={status === 'done' ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: 20, padding: 24, pointerEvents: status === 'done' ? 'auto' : 'none' }}
      >
        {/* Instagram 피드 포스트 실물 미니어처 — "4:5 이미지+카피 카드"였던 결말을 타깃이 매일 보는 실물 화면으로 교체.
            스케일 팝으로 "게시되는" 순간을 연출 (§8.7-I 재설계) */}
        <motion.div
          animate={status === 'done' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          style={{ width: '54%', flexShrink: 0, border: '1px solid #eaeaea', background: '#fff', display: 'flex', flexDirection: 'column' }}
        >
          {/* 프로필 행 — 아바타 + 상호 + Sponsored */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
            <span className="rounded-dot" style={{ width: 24, height: 24, background: '#0070f3', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...EN }}>M</span>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#171717', ...EN }}>myshop_official</span>
              <span style={{ fontSize: 9, color: '#999', ...EN }}>Sponsored</span>
            </div>
            <span style={{ fontSize: 12, color: '#999', letterSpacing: 1 }}>···</span>
          </div>

          {/* 정사각 상품 실사 — L1(§감독관2차): "린넨 원피스" 카피와 매칭되는 화이트 플로럴 랩 원피스 */}
          <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden', background: '#fafafa' }}>
            <img src={U('photo-1496747611176-843222e1e57c')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* 좋아요·댓글·공유 아이콘 행 (직각 이음선 문법 — 곡선 라운드 없음) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px 2px' }}>
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4">
              <path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4">
              <path d="M2 3h12v7H6l-3 3V10H2V3z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4">
              <path d="M2 8l12-5-4 12-2.5-5L2 8z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#171717', padding: '2px 10px 0', ...EN }}>좋아요 1,248개</p>
          <p style={{ fontSize: 11, color: '#171717', padding: '4px 10px 10px', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontWeight: 700, marginRight: 4, ...EN }}>myshop_official</span>
            올여름 가장 시원한 선택. 린넨 원피스 얼리버드 30% 할인
          </p>
        </motion.div>

        {/* Right info — staggered spring pop (Targeting + 게시 버튼) */}
        <div style={{ width: '46%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div
            animate={status === 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
            style={{ border: '1px solid #eaeaea', padding: 16 }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, color: '#666', marginBottom: 6, ...EN }}>Targeting</p>
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
/* 마이샵(여성의류) 4개 상품 — 상품명·서사는 Read로 확인한 실사 내용에 맞춤(TrendShowcase.tsx 감독관2차 확인분과 동일 사진 재사용) */
const CATALOG_PRODUCTS = {
  shirt: { name: '샴브레이 셔츠', price: '₩52,000', img: U('photo-1558171813-4c088753af8f') },
  dress: { name: '플로럴 랩 원피스', price: '₩39,000', img: U('photo-1496747611176-843222e1e57c') },
  denim: { name: '디스트로이드 스키니 데님', price: '₩58,000', img: U('photo-1541099649105-f69ad21f3246') },
  knit: { name: '크림 프린지 니트', price: '₩45,000', img: U('photo-1434389677669-e08b4cac3105') },
} as const;
type CatalogId = keyof typeof CATALOG_PRODUCTS;

function Step02_Catalog({ isActive }: { isActive: boolean }) {
  const [swapped, setSwapped] = useState(false);
  const [postId, setPostId] = useState<CatalogId>('shirt');
  const started = useRef(false);

  useEffect(() => {
    if (!isActive || started.current) return;
    started.current = true;
    // 2위(dress)가 1위(shirt)로 스왑되는 순위 변동 → 그 직후 광고 소재 이미지가 새 1위로 크로스페이드
    const t1 = setTimeout(() => setSwapped(true), 2000);
    const t2 = setTimeout(() => setPostId('dress'), 2350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive]);

  // rank1(swapped 전=shirt) ↔ rank2(dress) 자리만 바뀜, 나머지는 고정
  const order: CatalogId[] = swapped ? ['dress', 'shirt', 'denim', 'knit'] : ['shirt', 'dress', 'denim', 'knit'];

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

      {/* Product Grid — stagger pop 진입 후, 2초 뒤 1·2위가 layout 애니메이션으로 자리를 바꾼다(순위 변동 연출) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {order.map((id, i) => {
          const p = CATALOG_PRODUCTS[id];
          const isBest = i === 0;
          return (
            <motion.div
              key={id}
              layout
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.15, layout: { duration: 0.6, ease: EASE } }}
              style={{ border: '1px solid #eaeaea', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ aspectRatio: '1/1', background: '#fafafa', position: 'relative', overflow: 'hidden' }}>
                <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {isBest && (
                  <motion.span
                    key="best-badge"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ position: 'absolute', top: 6, left: 6, fontSize: 8, fontWeight: 700, color: '#fff', padding: '2px 6px', background: '#0070f3', ...EN }}
                  >
                    BEST
                  </motion.span>
                )}
              </div>
              <div style={{ padding: 8 }}>
                <p style={{ fontSize: 10, color: '#666' }}>{p.name}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#171717', ...EN }}>{p.price}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 미니 인스타 포스트 — Step01 실물 문법(아바타·상호·Sponsored) 재사용, 컴팩트 가로형.
          이미지가 새 1위 상품으로 크로스페이드 → 순위 변동→광고 교체의 인과가 한 화면에서 보인다 */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
        style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid #eaeaea', background: '#fff' }}
      >
        <span className="rounded-dot" style={{ width: 22, height: 22, background: '#0070f3', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...EN }}>M</span>
        <div style={{ width: 44, height: 44, position: 'relative', overflow: 'hidden', flexShrink: 0, background: '#fafafa' }}>
          {(['shirt', 'dress'] as CatalogId[]).map((id) => (
            <motion.img
              key={id}
              src={CATALOG_PRODUCTS[id].img}
              alt=""
              animate={{ opacity: postId === id ? 1 : 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, color: '#999', marginBottom: 2, ...EN }}>myshop_official · Sponsored</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            베스트가 바뀌면, 광고 소재도 따라 바뀝니다
          </p>
        </div>
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
      {/* 검색창 — "검색했더니 내 광고가 나온" 맥락을 명확히 (감독관 보강 지시) */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', border: '1px solid #eaeaea', marginBottom: 20 }}
      >
        <svg style={{ width: 14, height: 14, color: '#999', flexShrink: 0 }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7" cy="7" r="4" /><path d="M10 10l3.5 3.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13, color: '#171717', ...EN }}>여름 원피스</span>
      </motion.div>

      {/* Ad Block 1 */}
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
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
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>
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
                animate={gaugeOn ? { scaleX: 1 } : { scaleX: 0 }}
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
export function Step04_Management({ isActive }: { isActive: boolean }) {
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
          {/* Toggle — smooth slide (C-2: rounded-pill 제거, 직각 트랙 + 원형 thumb 유지) */}
          <div style={{ width: 40, height: 22, display: 'flex', alignItems: 'center', padding: '0 2px', position: 'relative', overflow: 'hidden', border: '1px solid #eaeaea' }}>
            <motion.div
              animate={isActive ? { background: c.on ? '#22c55e' : '#e0e0e0' } : { background: '#e0e0e0' }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
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
              <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', background: '#171717', flexShrink: 0, ...EN }}>
                {step.num}
              </span>
              <div style={{ flex: 1, height: 1, background: '#eaeaea' }} />
            </motion.div>
            <motion.h3 variants={springPop} style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 16 }}>
              {step.title}
            </motion.h3>
            <motion.p variants={springPop} className="max-md:!text-[16px] max-md:!font-medium" style={{ fontSize: 15, color: '#666', lineHeight: 1.65 }}>
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
            {/* 984 = 표준 텍스트 그리드(세로선 스냅 2026-07-11) */}
            <div style={{ maxWidth: 984, margin: '0 auto' }}>
              <p className="max-md:!text-[14px]" style={{ fontSize: 13, fontWeight: 600, color: '#0070f3', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, ...EN }}>AdCanvas</p>
              <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                메타·구글 광고를<br />직접 만들고 관리하세요
              </h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.65, marginBottom: 24 }}>
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

      {/* 브리지 — Step04(광고운영)는 Dashboard·Chatbot 섹션에 위임(사장님 확정, 중복 제거) */}
      <Section alt>
        <div className="py-16 px-12 max-md:py-10 max-md:px-6">
          <FadeUp>
            <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 8 }}>
                만들고 끝이 아닙니다
              </h3>
              <p className="max-md:!text-[16px] max-md:!font-medium" style={{ fontSize: 15, color: '#666' }}>
                운영과 성과는, 아래 대시보드에서 이어집니다.
              </p>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
