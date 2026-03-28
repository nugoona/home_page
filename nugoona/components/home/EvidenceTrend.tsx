'use client';

import { useState, useEffect } from 'react';
import FadeUp from '@/components/motion/FadeUp';
import GridDivider from '@/components/ui/GridDivider';


const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ════════════════════════════════════════════════════════════
   29CM Ranking Table — Animated (3-state loop)
   ════════════════════════════════════════════════════════════ */
const categories = ['전체', '니트웨어', '바지', '상의', '스커트', '아우터', '원피스'];

interface RankItem {
  rank: string;
  brand: string;
  product: string;
  change: number | 'NEW';
  gradient: string;
  image: string;
}

interface TabState {
  categoryIdx: number;
  subTabIdx: number;
  items: RankItem[];
}

const tabStates: TabState[] = [
  {
    categoryIdx: 0, // 전체
    subTabIdx: 0,    // 급상승
    items: [
      { rank: '전체 9위', brand: '에르블랑', product: '소프트 울 블렌드 니트', change: 61, gradient: 'linear-gradient(135deg, #fde2d4, #f5cac3)', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=160&h=208&fit=crop' },
      { rank: '전체 40위', brand: '하루클로젯', product: '러플 셔링 블라우스', change: 54, gradient: 'linear-gradient(135deg, #d5e5d5, #c1d5c1)', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=160&h=208&fit=crop' },
      { rank: '전체 18위', brand: '포레스트블룸', product: '비건 레더 크롭 자켓', change: 49, gradient: 'linear-gradient(135deg, #ddd5e5, #c5b8d5)', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=160&h=208&fit=crop' },
      { rank: '전체 16위', brand: '어반시크', product: '클래식 트렌치 코트', change: 49, gradient: 'linear-gradient(135deg, #d5dde5, #b8c8d5)', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=160&h=208&fit=crop' },
    ],
  },
  {
    categoryIdx: 0, // 전체
    subTabIdx: 1,    // 신규 진입
    items: [
      { rank: '전체 23위', brand: '로엘', product: '오버사이즈 린넨 블레이저', change: 'NEW', gradient: 'linear-gradient(135deg, #e5ddd5, #d5c8b8)', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=160&h=208&fit=crop' },
      { rank: '전체 51위', brand: '밀로아', product: '핀턱 와이드 팬츠', change: 'NEW', gradient: 'linear-gradient(135deg, #d5e0e5, #b8d0d5)', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=160&h=208&fit=crop' },
      { rank: '전체 67위', brand: '소이런던', product: '플리츠 미디스커트', change: 'NEW', gradient: 'linear-gradient(135deg, #e5d5dd, #d5b8c8)', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=160&h=208&fit=crop' },
      { rank: '전체 82위', brand: '라센토', product: '스퀘어토 스트랩 뮬', change: 'NEW', gradient: 'linear-gradient(135deg, #dde5d5, #c8d5b8)', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=160&h=208&fit=crop' },
    ],
  },
  {
    categoryIdx: 6, // 원피스
    subTabIdx: 0,    // 급상승
    items: [
      { rank: '원피스 3위', brand: '메르시블룸', product: '플라워 패턴 쉬폰 원피스', change: 38, gradient: 'linear-gradient(135deg, #f5e0d0, #e8d0c0)', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=160&h=208&fit=crop' },
      { rank: '원피스 11위', brand: '달리에뜨', product: '셔링 미디 원피스', change: 27, gradient: 'linear-gradient(135deg, #d0e5d8, #c0d5c8)', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=208&fit=crop' },
      { rank: '원피스 8위', brand: '비앙카', product: '슬리브리스 A라인 원피스', change: 22, gradient: 'linear-gradient(135deg, #e0d5e8, #d0c5d8)', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=160&h=208&fit=crop' },
      { rank: '원피스 15위', brand: '르안느', product: '카라 버튼 셔츠 원피스', change: 19, gradient: 'linear-gradient(135deg, #d8dde5, #c0c8d5)', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=160&h=208&fit=crop' },
    ],
  },
];

const subTabs = ['급상승', '신규 진입', '순위 하락'];

function RankingTable() {
  const [stateIdx, setStateIdx] = useState(0);

  /* Preload all 12 thumbnail images on mount */
  useEffect(() => {
    tabStates.forEach((s) =>
      s.items.forEach((item) => {
        const img = new window.Image();
        img.src = item.image;
      })
    );
  }, []);

  /* Cycle every 3.5s — instant swap, no blank frame */
  useEffect(() => {
    const t = setInterval(() => {
      setStateIdx((prev) => (prev + 1) % tabStates.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const state = tabStates[stateIdx];

  return (
    <div className="border border-border-default bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-light bg-[#fafafa]">
        <span className="text-[13px] font-normal text-[#1a1a1a]">
          29CM 2026년 2월 3주차 트렌드
        </span>
        <span className="text-[10px] text-text-weak" style={EN}>
          매주 월요일 오전 9시 업데이트
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 px-5 py-3 border-b border-border-light overflow-x-auto">
        {categories.map((cat, i) => {
          const isActive = i === state.categoryIdx;
          return (
            <span
              key={i}
              className="text-[11px] px-3 py-1.5 whitespace-nowrap shrink-0"
              style={{
                backgroundColor: isActive ? '#171717' : 'transparent',
                color: isActive ? '#fff' : 'var(--color-text-body)',
                fontWeight: isActive ? 600 : 400,
                border: '1px solid',
                borderColor: isActive ? 'transparent' : 'var(--color-border-default)',
                transition: 'background-color 0.4s, color 0.4s, border-color 0.4s',
              }}
            >
              {cat}
            </span>
          );
        })}
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-border-light relative">
        {/* Sliding accent underline */}
        <div
          className="absolute bottom-0 h-[2px] bg-accent"
          style={{
            width: `${100 / 3}%`,
            transform: `translateX(${state.subTabIdx * 100}%)`,
            transition: 'transform 0.4s ease',
          }}
        />
        {subTabs.map((tab, i) => (
          <div
            key={i}
            className="flex-1 text-center py-2.5 text-[12px]"
            style={{
              fontWeight: i === state.subTabIdx ? 600 : 400,
              color: i === state.subTabIdx ? 'var(--color-text-primary)' : 'var(--color-text-body)',
              transition: 'color 0.4s',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[80px_52px_1fr_2fr_80px] px-5 py-2 border-b border-border-light bg-[#fafafa] max-sm:grid-cols-[60px_40px_1fr_1fr_60px]">
        {['랭킹', '썸네일', '브랜드', '상품명', '순위변화'].map((h) => (
          <span key={h} className="text-[10px] text-text-weak font-medium" style={EN}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {state.items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_52px_1fr_2fr_80px] items-center px-5 py-3 border-b border-border-light last:border-b-0 max-sm:grid-cols-[60px_40px_1fr_1fr_60px]"
        >
          <span className="text-[11px] font-semibold text-text-primary" style={EN}>
            {item.rank}
          </span>
          <div
            className="w-10 h-[52px] shrink-0 max-sm:w-8 max-sm:h-10 overflow-hidden"
            style={{ background: item.gradient }}
          >
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] text-[#1a1a1a] font-normal truncate pr-2">
            {item.brand}
          </span>
          <span className="text-[11px] text-[#1a1a1a] font-normal truncate pr-2">
            {item.product}
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{
              ...EN,
              color: item.change === 'NEW' ? '#3b82f6' : '#ef4444',
            }}
          >
            {item.change === 'NEW' ? 'NEW' : `▲${item.change}`}
          </span>
        </div>
      ))}

      {/* Load More */}
      <div className="flex justify-center py-3 border-t border-border-light">
        <span className="text-[12px] font-semibold text-white bg-[#171717] px-6 py-2.5">
          더보기 (16개 더)
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Naver Search Chart
   ════════════════════════════════════════════════════════════ */
const chartPoints = [68, 78, 92, 65, 75, 73, 58, 80, 75, 65, 72, 52, 45, 65, 70, 95, 97, 70, 75, 72, 68, 55, 45, 38];
const brands = [
  { name: '소울리브', vol: '33,800건', color: '#22c55e' },
  { name: '데이브리즈', vol: '27,260건', color: '#3b82f6' },
  { name: '미뉴에뜨', vol: '14,140건', color: '#8b5cf6' },
  { name: '코지랩', vol: '11,500건', color: '#eab308' },
];

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const d = [`M${pts[0].x},${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
  }
  return d.join(' ');
}

function SearchChart() {
  const maxVal = Math.max(...chartPoints);
  const pts = chartPoints.map((v, i) => ({
    x: (i / (chartPoints.length - 1)) * 280,
    y: 80 - (v / maxVal) * 70,
  }));
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L280,80 L0,80 Z`;

  return (
    <div className="border border-border-default bg-white overflow-hidden">
      {/* Chart Section */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-normal text-[#1a1a1a]">
              네이버 일간 검색량 추이
            </span>
            <span className="text-[12px] text-text-weak">ⓘ</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold text-[#22c55e]" style={EN}>1,990건</span>
            <span className="text-[11px] text-[#22c55e]" style={EN}>68건/일</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative">
          <svg viewBox="0 0 280 90" className="w-full h-auto">
            {/* Grid Lines */}
            {[0, 25, 50, 75].map((y) => (
              <line
                key={y}
                x1="0"
                y1={10 + (y / 75) * 70}
                x2="280"
                y2={10 + (y / 75) * 70}
                stroke="#f0f0f0"
                strokeWidth="0.5"
              />
            ))}
            {/* Area Fill */}
            <path d={areaPath} fill="url(#chartGrad)" />
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
                <stop offset="100%" stopColor="rgba(34,197,94,0)" />
              </linearGradient>
            </defs>
            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* X-axis labels */}
          <div className="flex justify-between mt-1.5">
            {['1/17', '1/24', '1/31', '2/7', '2/14'].map((d) => (
              <span key={d} className="text-[8px] text-text-weak" style={EN}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Comparison */}
      <div className="border-t border-border-light p-5">
        <p className="text-[11px] font-normal text-[#1a1a1a] mb-3">
          월간 검색량 비교
        </p>
        <div className="flex flex-col gap-2.5">
          {brands.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-[10px] font-semibold text-text-muted w-3" style={EN}>
                {i + 1}
              </span>
              <div className="w-[3px] h-[12px]" style={{ backgroundColor: b.color }} />
              <span className="text-[10px] text-[#1a1a1a] font-normal w-[72px]">{b.name}</span>
              <span className="text-[11px] font-semibold text-text-primary" style={EN}>
                {b.vol}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Image Benchmark — Animated (4-tab loop, 3×2 grid + score)
   ════════════════════════════════════════════════════════════ */
interface BenchmarkCard {
  platform: string;
  rank: string;
  score: number;
  gradient: string;
  brand: string;
  image: string;
}

interface ScoreKeyword {
  type: string;
  weight: number;
  matched: string;
}

interface BenchmarkState {
  tabName: string;
  scores: ScoreKeyword[];
  searchScope: string;
  cards: BenchmarkCard[];
}

const benchmarkStates: BenchmarkState[] = [
  /* Tab 0 — 울 블렌드 오버사이즈 니트 */
  {
    tabName: '1위 울 블렌드 오버사이즈 니트',
    scores: [
      { type: '카테고리', weight: 10, matched: '니트' },
      { type: '디자인', weight: 8, matched: '오버사이즈' },
      { type: '스타일', weight: 5, matched: '블렌드' },
      { type: '핏', weight: 5, matched: '루즈핏' },
      { type: '패턴', weight: 1, matched: '무지' },
    ],
    searchScope: '29CM·Ably 니트 카테고리 상위 100',
    cards: [
      { platform: 'Ably', rank: '니트 12위', score: 29, gradient: 'linear-gradient(135deg, #2a2025, #1a1520)', brand: '모먼트앤', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '니트 34위', score: 24, gradient: 'linear-gradient(135deg, #1a2025, #15202a)', brand: '레이첼룸', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '니트 58위', score: 19, gradient: 'linear-gradient(135deg, #252020, #201a1a)', brand: '블룸데이', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '니트 8위', score: 27, gradient: 'linear-gradient(135deg, #20251a, #1a2015)', brand: '하루클로젯', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '니트 21위', score: 23, gradient: 'linear-gradient(135deg, #25202a, #1a1525)', brand: '달리에뜨', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '니트 45위', score: 18, gradient: 'linear-gradient(135deg, #201a25, #15202a)', brand: '소이런던', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=700&h=700&fit=crop' },
    ],
  },
  /* Tab 1 — 셔링 퍼프 블라우스 */
  {
    tabName: '2위 셔링 퍼프 블라우스',
    scores: [
      { type: '카테고리', weight: 10, matched: '블라우스' },
      { type: '디자인', weight: 8, matched: '셔링' },
      { type: '스타일', weight: 5, matched: '퍼프' },
      { type: '핏', weight: 5, matched: '레귤러' },
      { type: '패턴', weight: 1, matched: '—' },
    ],
    searchScope: '29CM·Ably 상의 카테고리 상위 100',
    cards: [
      { platform: 'Ably', rank: '상의 19위', score: 28, gradient: 'linear-gradient(135deg, #2a2520, #201a15)', brand: '밀로아', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '상의 41위', score: 23, gradient: 'linear-gradient(135deg, #202520, #1a201a)', brand: '에르블랑', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '상의 67위', score: 18, gradient: 'linear-gradient(135deg, #252020, #201a1a)', brand: '포레스트블룸', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '상의 14위', score: 26, gradient: 'linear-gradient(135deg, #20251a, #1a2015)', brand: '어반시크', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '상의 38위', score: 21, gradient: 'linear-gradient(135deg, #1a2025, #15202a)', brand: '로엘', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '상의 55위', score: 16, gradient: 'linear-gradient(135deg, #251a20, #201520)', brand: '라센토', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&h=700&fit=crop' },
    ],
  },
  /* Tab 2 — 린넨 와이드 슬랙스 */
  {
    tabName: '3위 린넨 와이드 슬랙스',
    scores: [
      { type: '카테고리', weight: 10, matched: '슬랙스' },
      { type: '디자인', weight: 8, matched: '와이드' },
      { type: '스타일', weight: 5, matched: '린넨' },
      { type: '핏', weight: 5, matched: '와이드핏' },
      { type: '패턴', weight: 1, matched: '무지' },
    ],
    searchScope: '29CM·Ably 바지 카테고리 상위 100',
    cards: [
      { platform: 'Ably', rank: '바지 22위', score: 29, gradient: 'linear-gradient(135deg, #202a25, #152520)', brand: '메르시블룸', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '바지 47위', score: 24, gradient: 'linear-gradient(135deg, #2a201a, #201a15)', brand: '비앙카', image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '바지 71위', score: 18, gradient: 'linear-gradient(135deg, #1a2520, #15201a)', brand: '르안느', image: 'https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '바지 13위', score: 27, gradient: 'linear-gradient(135deg, #201a2a, #1a1525)', brand: '코지랩', image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '바지 36위', score: 22, gradient: 'linear-gradient(135deg, #252025, #201a20)', brand: '하루클로젯', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '바지 59위', score: 15, gradient: 'linear-gradient(135deg, #20201a, #1a1a15)', brand: '블룸데이', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&h=700&fit=crop' },
    ],
  },
  /* Tab 3 — 플로럴 플리츠 미디스커트 */
  {
    tabName: '4위 플로럴 플리츠 미디스커트',
    scores: [
      { type: '카테고리', weight: 10, matched: '스커트' },
      { type: '디자인', weight: 8, matched: '플리츠' },
      { type: '스타일', weight: 5, matched: '미디' },
      { type: '핏', weight: 5, matched: 'A라인' },
      { type: '패턴', weight: 1, matched: '플로럴' },
    ],
    searchScope: '29CM·Ably 스커트 카테고리 상위 100',
    cards: [
      { platform: 'Ably', rank: '스커트 31위', score: 29, gradient: 'linear-gradient(135deg, #2a2025, #1a1520)', brand: '모먼트앤', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '스커트 55위', score: 23, gradient: 'linear-gradient(135deg, #1a2520, #15201a)', brand: '달리에뜨', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=700&h=700&fit=crop' },
      { platform: 'Ably', rank: '스커트 78위', score: 17, gradient: 'linear-gradient(135deg, #202a25, #152520)', brand: '밀로아', image: 'https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '스커트 18위', score: 28, gradient: 'linear-gradient(135deg, #201a2a, #1a1525)', brand: '에르블랑', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '스커트 42위', score: 21, gradient: 'linear-gradient(135deg, #252025, #201a20)', brand: '포레스트블룸', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&h=700&fit=crop' },
      { platform: '29CM', rank: '스커트 63위', score: 14, gradient: 'linear-gradient(135deg, #20251a, #1a2015)', brand: '소이런던', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&h=700&fit=crop' },
    ],
  },
];

const scoreBarMax = 10;

function ImageBenchmark() {
  const [tabIdx, setTabIdx] = useState(0);

  /* Preload all 24 benchmark images */
  useEffect(() => {
    benchmarkStates.forEach((s) =>
      s.cards.forEach((c) => {
        const img = new window.Image();
        img.src = c.image;
      })
    );
  }, []);

  /* Auto-cycle tabs */
  useEffect(() => {
    const t = setInterval(() => {
      setTabIdx((prev) => (prev + 1) % benchmarkStates.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const state = benchmarkStates[tabIdx];

  return (
    <div className="border border-border-default bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border-light bg-[#fafafa]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-semibold text-text-primary" style={EN}>
            Image Benchmark
          </span>
          <span
            className="text-[9px] font-semibold text-white px-1.5 py-0.5"
            style={{ backgroundColor: '#8b5cf6' }}
          >
            Beta
          </span>
        </div>
        <p className="text-[10px] text-[#1a1a1a] font-normal">
          자사몰 베스트 상품 기반 트렌드 이미지 추천
        </p>
      </div>

      {/* Product Tabs */}
      <div className="flex gap-1.5 px-5 py-3 border-b border-border-light overflow-x-auto">
        {benchmarkStates.map((s, i) => (
          <span
            key={i}
            className="text-[10px] px-2.5 py-1 whitespace-nowrap shrink-0"
            style={{
              ...EN,
              backgroundColor: i === tabIdx ? '#171717' : 'transparent',
              color: i === tabIdx ? '#fff' : 'var(--color-text-muted)',
              fontWeight: i === tabIdx ? 600 : 400,
              border: '1px solid',
              borderColor: i === tabIdx ? 'transparent' : 'var(--color-border-default)',
              transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            }}
          >
            {s.tabName}
          </span>
        ))}
      </div>

      {/* Score Breakdown — 검색 키워드 */}
      <div className="px-5 py-3.5 border-b border-border-light">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-normal text-[#1a1a1a]">검색 키워드</span>
          <span className="text-[9px] text-text-weak">{state.searchScope}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {state.scores.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[9px] text-text-muted w-[52px] shrink-0">{s.type}({s.weight})</span>
              <div className="flex-1 h-[6px] bg-[#f0f0f0] overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${(s.weight / scoreBarMax) * 100}%`,
                    backgroundColor: s.matched === '—' ? '#d4d4d4' : '#8b5cf6',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              <span className="text-[9px] text-[#1a1a1a] font-normal w-[48px] text-right shrink-0" style={EN}>
                {s.matched}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Grid 3×2 */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {state.cards.map((card, i) => (
          <div key={i} className="overflow-hidden">
            <div className="aspect-[3/4] relative overflow-hidden" style={{ background: card.gradient }}>
              <img
                src={card.image}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Platform Badge */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                <span
                  className="text-[7px] font-semibold text-white px-1 py-0.5"
                  style={{
                    backgroundColor: card.platform === 'Ably' ? '#8b5cf6' : '#171717',
                  }}
                >
                  {card.platform}
                </span>
              </div>
              {/* Score Badge */}
              <div className="absolute bottom-1.5 right-1.5">
                <span className="text-[9px] font-semibold text-white px-1.5 py-0.5 bg-[rgba(0,0,0,0.55)]" style={EN}>
                  {card.score}점
                </span>
              </div>
            </div>
            {/* Info */}
            <div className="pt-1.5">
              <p className="text-[9px] text-text-muted truncate" style={EN}>{card.rank}</p>
              <p className="text-[9px] text-[#1a1a1a] font-normal truncate">{card.brand}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EvidenceTrend — Main Section (Light → Dark transition)
   ════════════════════════════════════════════════════════════ */
export default function EvidenceTrend() {
  return (
    <div>
      <GridDivider />
      {/* Row 1: Dark — Hero (left) + Sub-title (right) */}
      <div className="bg-[#0a0a0a]">
        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr]">
          <div className="pt-[100px] px-12 max-md:pt-16 max-md:px-6 max-md:pb-12 max-md:flex max-md:items-center max-md:justify-center md:py-[100px] md:flex md:items-center md:justify-center">
            <FadeUp>
              <div>
                <p
                  className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-4"
                  style={EN}
                >
                  Trend
                </p>
                <p className="text-[clamp(24px,3.5vw,32px)] font-semibold text-white leading-[1.4] tracking-[-0.02em]">
                  <span className="font-semibold text-accent">경쟁사 베스트셀러</span>, 직접 찾지 마세요.
                  <br />
                  인기 상품이 매주 <span className="font-semibold text-accent">자동 수집</span>됩니다.
                </p>
              </div>
            </FadeUp>
          </div>
          <div className="relative md:border-l md:border-[rgba(255,255,255,0.1)] px-12 pt-6 pb-10 max-md:px-6 max-md:border-t max-md:border-[rgba(255,255,255,0.1)] max-md:pt-8 md:py-[100px] md:flex md:items-center">
            <FadeUp delay={0.15} className="w-full">
            <div>
              <p className="text-[19px] font-semibold text-[rgba(255,255,255,0.9)] leading-[1.4] tracking-[-0.01em] mb-1">
                <span className="text-[#93c5fd]">경쟁사 트렌드</span> 자동 수집.
              </p>
              <p className="text-[15px] text-[rgba(255,255,255,0.85)] font-light leading-[1.4]">
                29CM·Ably 베스트 100을 매주 자동 수집하고<br className="hidden md:inline" /> 급상승을 감지합니다.
              </p>
            </div>
          </FadeUp>
          </div>
        </div>
      </div>

      {/* Row 2: White — Ranking Table */}
      <div className="py-10 px-12 max-md:py-8 max-md:px-6">
        <FadeUp delay={0.12}>
          <RankingTable />
        </FadeUp>
      </div>

      {/* Row 3: Chart + Benchmark */}
      <div className="bg-[#fafafa] md:border-t md:border-border-default">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr]">
          <div className="max-md:px-0">
            <div className="py-32 px-12 max-md:py-10 max-md:px-6 bg-[#0a0a0a]">
              <FadeUp delay={0.2}>
                <div>
                  <p className="text-[19px] font-semibold text-[rgba(255,255,255,0.9)] leading-[1.4] tracking-[-0.01em] mb-4 max-md:mb-1">
                    <span className="text-[#93c5fd]">네이버·구글 검색 트렌드</span>부터<br className="hidden md:inline" /> <span className="text-[#c4b5fd]">AI 이미지 벤치마크</span>까지.
                  </p>
                  <p className="text-[15px] text-[rgba(255,255,255,0.85)] font-light leading-[1.4] md:border-t md:border-[rgba(255,255,255,0.15)] md:pt-4">
                    브랜드 검색량 30일 추이와 경쟁사 비교.
                    <br className="hidden md:inline" />
                    자사몰 베스트 상품과 유사한 트렌드 인기 이미지 추천.
                  </p>
                </div>
              </FadeUp>
            </div>
            <div className="border-t border-border-default py-10 px-6 max-md:py-0 max-md:px-0">
              <FadeUp delay={0.28}>
                <SearchChart />
              </FadeUp>
            </div>
          </div>
          <div className="relative md:border-l md:border-border-default py-10 px-12 max-md:py-4 max-md:px-6">
            <FadeUp delay={0.24}>
              <ImageBenchmark />
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
