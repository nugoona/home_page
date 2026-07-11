'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN = { fontFamily: 'var(--font-en)' } as React.CSSProperties;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ══════════════════════════════════════════════════════════════
   IMAGE HELPERS — 감독관 C-3 수리(2026-07-11): public/img/unsplash/webp/
   46개 파일을 실제로 Read하여 내용(품목·색상) 확인 후 재매핑. 키 이름이
   실제 사진 내용과 일치하도록 재설계(추측 매핑 금지 — 전수 실사 확인).
   ══════════════════════════════════════════════════════════════ */
const U = (id: string) => `/img/unsplash/webp/${id}.webp`;

const IMG = {
  knitPoncho:         U('photo-1434389677669-e08b4cac3105'), // 크림 프린지 크로셰 니트
  knitRibGrey:         U('photo-1556905055-8f358a7a47b2'),    // 감독관2차 M1 재확인: 실제는 러스트 니트 비니 + 그레이 리브 니트 + 데님(플랫레이) — 상품명 "니트 비니_Rust"로 역맞춤
  knitSweatshirt:      U('photo-1578587018452-892bacefd3f2'), // 오렌지 크루넥 스웨트
  knitCableCream:      U('photo-1604176354204-9268737828e4'), // 감독관2차 M1 재확인: 실제는 데님 4벌 스택 + 크림 니트 소매(일부) — 니트 단독이 아니므로 상품명은 _Navy로 역맞춤
  knitSage:            U('photo-1516762689617-e1cffcef479d'), // 감독관2차 M1 재확인: 실제는 크림 가디건 + 데님 + 머그컵(플랫레이), 그린 없음 — 상품명 _Cream으로 역맞춤
  knitCardiganDenim:   U('photo-1515886657613-9f3515b0c78f'), // 감독관2차 M1: 실제는 옐로 크롭 후드+트랙팬츠 셋업(농구코트) — 상품명 "옐로 트랙 셋업"으로 역맞춤
  coatPlaid:           U('photo-1485968579580-b6d095142e6e'), // 네이비 체크 코트
  coatCamel:           U('photo-1539533018447-63fcce2678e3'), // 카멜 울 랩 코트
  coatPowderBlue:      U('photo-1539109136881-3be0616acf4b'), // 파우더블루 롱 코트
  jacketLeatherBrown:  U('photo-1487222477894-8943e31ef7b2'), // 브라운 레더 라이더 재킷
  jacketBomberRust:    U('photo-1591047139829-d91aecb6caea'), // 러스트 봄버 재킷
  denimRipped:         U('photo-1541099649105-f69ad21f3246'), // 디스트로이드 스키니 데님
  denimFlatlay:        U('photo-1541099649105-f69ad21f3246'), // 감독관2차 C1: 계란토스트 오식별 교체 → 디스트로이드 스키니 데님(denimRipped와 동일 실사, 공용)
  pantsStripeWide:     U('photo-1509631179647-0177331693ae'), // 감독관2차 M1: 무관 인물사진(CCCP 티셔츠) 오식별 교체 → 블랙 스트라이프 와이드 팬츠(네온사인 배경)
  blouseFloral:        U('photo-1564257631407-4deb1f99d992'), // 화이트 플로럴 아일렛 블라우스
  blouseChambray:      U('photo-1558171813-4c088753af8f'),    // 라이트블루 샴브레이 셔츠
  skirtPleatBlack:      U('photo-1583496661160-fb5886a0aaaa'),// 블랙 플리츠 스커트(+스트라이프 블라우스)
  dressFloralWhite:    U('photo-1496747611176-843222e1e57c'), // 화이트 플로럴 랩 원피스
} as const;

const PT_IMGS = [
  IMG.coatPowderBlue,
  IMG.jacketLeatherBrown,
  IMG.skirtPleatBlack,
  IMG.knitCableCream,
  IMG.knitSweatshirt,
  IMG.denimRipped,
  IMG.denimFlatlay,
  IMG.blouseFloral,
  IMG.coatCamel,
  IMG.knitCardiganDenim,
];

/* ══════════════════════════════════════════════════════════════
   SECTION 1 — 주간 트렌드 브리핑
   ══════════════════════════════════════════════════════════════ */
type BriefingItem = {
  rank: string;
  img: string;
  brand: string;
  name: string;
  change: number; // +N rising, -N drop, 0 = new entry
  thisWeek: number;
  lastWeek: number | null;
};

const RISING_ALL: BriefingItem[] = [
  /* 감독관 2·3차 연속 "썸네일이 니트로 읽힘"(76px 축소 시) → 상품명 역맞춤 */
  { rank: '전체 17위', img: IMG.jacketBomberRust,    brand: '에르블랑',   name: '집업 니트 블루종_Rust Brown',          change: 75, thisWeek: 17, lastWeek: 92 },
  { rank: '전체 12위', img: IMG.jacketLeatherBrown,  brand: '라빈느',     name: '레더 블루종 재킷_Brown',               change: 61, thisWeek: 12, lastWeek: 73 },
  { rank: '전체 38위', img: IMG.knitPoncho,          brand: '소울리브',   name: '프린지 크로셰 니트 가디건_Ivory',       change: 57, thisWeek: 38, lastWeek: 95 },
  { rank: '전체 25위', img: IMG.blouseFloral,        brand: '데이브리즈', name: '플로럴 레이스 블라우스_White',          change: 41, thisWeek: 25, lastWeek: 66 },
];
const NEW_ALL: BriefingItem[] = [
  { rank: '전체 8위',  img: IMG.knitRibGrey,      brand: '코지랩',     name: '니트 비니 세트_Rust',             change: 0, thisWeek: 8,  lastWeek: null },
  { rank: '전체 15위', img: IMG.denimRipped,      brand: '미뉴에뜨',   name: '디스트로이드 스키니 데님_Blue',    change: 0, thisWeek: 15, lastWeek: null },
  { rank: '전체 23위', img: IMG.dressFloralWhite, brand: '하루클로젯', name: '플로럴 랩 원피스_White',           change: 0, thisWeek: 23, lastWeek: null },
  { rank: '전체 29위', img: IMG.skirtPleatBlack,  brand: '포레스트블룸', name: '플리츠 미디 스커트_Black',       change: 0, thisWeek: 29, lastWeek: null },
];
const DROP_ALL: BriefingItem[] = [
  { rank: '전체 88위', img: IMG.coatCamel,       brand: '에르블랑',   name: '오버핏 울 랩 코트_Camel',        change: -25, thisWeek: 88, lastWeek: 63 },
  { rank: '전체 71위', img: IMG.coatPlaid,       brand: '블루밍샵',   name: '체크 울 코트_Navy',              change: -18, thisWeek: 71, lastWeek: 53 },
  { rank: '전체 45위', img: IMG.knitCableCream,  brand: '르비앙',     name: '케이블 니트 가디건_Navy',         change: -12, thisWeek: 45, lastWeek: 33 },
  { rank: '전체 62위', img: IMG.pantsStripeWide, brand: '소울리브',   name: '스트라이프 와이드 팬츠_Black',    change: -9,  thisWeek: 62, lastWeek: 53 },
];
const RISING_KNIT: BriefingItem[] = [
  { rank: '니트웨어 36위', img: IMG.knitSweatshirt,    brand: '에르블랑', name: '브이넥 크루 니트_Orange',            change: 53, thisWeek: 36, lastWeek: 89 },
  { rank: '니트웨어 23위', img: IMG.knitSage,          brand: '라빈느',   name: '라운드 니트_Cream',                  change: 52, thisWeek: 23, lastWeek: 75 },
  { rank: '니트웨어 11위', img: IMG.knitCardiganDenim, brand: '소울리브', name: '옐로 트랙 셋업',                     change: 37, thisWeek: 11, lastWeek: 48 },
  { rank: '니트웨어 21위', img: IMG.knitPoncho,        brand: '코지랩',   name: '캐시미어 프린지 니트_Ivory',          change: 32, thisWeek: 21, lastWeek: 53 },
];
const NEW_PANTS: BriefingItem[] = [
  { rank: '바지 2위', img: IMG.denimRipped,       brand: '미뉴에뜨',   name: 'Distressed Skinny Denim Pants_Blue', change: 0, thisWeek: 2, lastWeek: null },
  { rank: '바지 3위', img: IMG.denimFlatlay,      brand: '에르블랑',   name: 'Straight Denim Pants_Blue',          change: 0, thisWeek: 3, lastWeek: null },
  { rank: '바지 4위', img: IMG.pantsStripeWide,   brand: '하루클로젯', name: 'Stripe Wide Pants_Black',            change: 0, thisWeek: 4, lastWeek: null },
  { rank: '바지 6위', img: IMG.knitCardiganDenim, brand: '라빈느',     name: 'Yellow Track Set',                   change: 0, thisWeek: 6, lastWeek: null },
];

const BRIEFING_CATS = ['전체', '니트웨어', '단독', '바지', '상의', '셋업', '스커트', '아우터', '원피스'];
type BFilter = '급상승' | '신규 진입' | '순위 하락';
const B_FILTERS: BFilter[] = ['급상승', '신규 진입', '순위 하락'];

function getBriefingData(cat: string, f: BFilter): BriefingItem[] {
  if (cat === '니트웨어' && f === '급상승') return RISING_KNIT;
  if (cat === '바지' && f === '신규 진입') return NEW_PANTS;
  if (f === '신규 진입') return NEW_ALL;
  if (f === '순위 하락') return DROP_ALL;
  return RISING_ALL;
}

function BriefingSection() {
  const [cat, setCat]    = useState('전체');
  const [filter, setFilter] = useState<BFilter>('급상승');
  const items = useMemo(() => getBriefingData(cat, filter), [cat, filter]);
  const isNew  = filter === '신규 진입';

  const COL_MAIN  = isNew
    ? '80px 84px 110px 1fr 96px 120px'
    : '80px 84px 110px 1fr 96px 90px 90px';
  const HEADERS = isNew
    ? ['랭킹', '썸네일', '브랜드', '상품명', '이번주 순위', '지난주 순위']
    : ['랭킹', '썸네일', '브랜드', '상품명', '순위변화', '이번주 순위', '지난주 순위'];

  return (
    <Section id="trend">
      {/* Intro */}
      <div className="pt-16 pb-10 px-12 max-md:pt-12 max-md:px-6 text-center">
        <FadeUp>
          <p className="text-[13px] max-md:text-[14px] font-semibold text-accent tracking-[0.08em] uppercase mb-3" style={EN}>
            Trend · Weekly Briefing
          </p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.02em] leading-[1.15] text-text-primary mb-3">
            매주 월요일, MD 회의 전에<br />이미 알고 있습니다.
          </h2>
          <p className="text-[16px] text-text-primary font-light max-md:font-medium leading-[1.65] max-w-[520px] mx-auto tracking-[-0.02em]">
            29CM과 Ably의 급상승·신규진입·순위하락 상품을 카테고리별로 자동 정리합니다.
          </p>
        </FadeUp>
      </div>

      {/* Mockup */}
      <FadeUp>
        <div className="border-t border-border-default">
          <div className="max-w-[1080px] mx-auto">

            {/* Header row */}
            <div className="flex items-center justify-between px-8 pt-6 pb-0 max-md:px-4 max-md:flex-col max-md:items-start max-md:gap-2">
              <h3 className="text-[15px] font-bold text-text-primary tracking-[-0.02em]">
                29CM 2026년 2월 4주차 트렌드
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-text-muted flex items-center gap-1.5" style={EN}>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M8 1v4l2.5 2.5" /><circle cx="8" cy="8" r="7" />
                  </svg>
                  매주 월요일 오전 9시 업데이트
                </span>
                <a
                  href="https://board.nugoona.co.kr/demo/trend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-semibold hover:underline"
                  style={{ color: '#0070f3' }}
                >
                  직접 데모 경험하기 →
                </a>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto px-8 pt-5 pb-0 max-md:px-4 scrollbar-hide">
              {BRIEFING_CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className="shrink-0 px-4 py-1.5 text-[13px] font-semibold transition-colors duration-150"
                  style={{
                    background: cat === c ? '#111' : 'transparent',
                    color:      cat === c ? '#fff' : '#666',
                    border:     cat === c ? '1px solid #111' : '1px solid #eaeaea',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="px-8 pt-4 max-md:px-4">
              <div className="grid grid-cols-3 border border-border-default">
                {B_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="py-3 text-[13px] font-semibold transition-colors duration-150"
                    style={{
                      background:   filter === f ? '#fff' : '#f5f5f5',
                      color:        filter === f ? '#111' : '#999',
                      borderBottom: filter === f ? '2px solid #111' : '2px solid transparent',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="px-8 pb-8 max-md:px-0 overflow-x-auto">
              {/* Column headers */}
              <div
                className="grid items-center py-2.5 px-2 mt-2 text-[10px] font-bold text-text-muted tracking-[0.08em] uppercase border-b border-[#f0f0f0] bg-[#fafafa] max-md:hidden"
                style={{ gridTemplateColumns: COL_MAIN, ...EN }}
              >
                {HEADERS.map((h, i) => (
                  <span key={h} className={i >= 4 ? 'text-right' : ''}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${cat}-${filter}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="grid items-center px-2 py-3 border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors"
                      style={{ gridTemplateColumns: COL_MAIN }}
                    >
                      <span className="text-[11px] text-text-muted">{item.rank}</span>
                      <div className="w-[76px] h-[76px] overflow-hidden bg-[#f5f5f5] shrink-0">
                        <img src={item.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <span className="text-[13px] text-text-weak font-medium truncate pr-2">{item.brand}</span>
                      <span className="text-[13px] text-text-primary font-medium pr-4 truncate">{item.name}</span>
                      {!isNew && (
                        <span
                          className="text-[14px] font-bold text-right"
                          style={{ color: item.change > 0 ? '#ef4444' : item.change < 0 ? '#3b82f6' : '#999' }}
                        >
                          {item.change > 0 ? `▲ ${item.change}` : item.change < 0 ? `▼ ${Math.abs(item.change)}` : '—'}
                        </span>
                      )}
                      <span className="text-[15px] font-bold text-text-primary text-right" style={EN}>{item.thisWeek}</span>
                      <span className="text-[13px] text-right" style={{ color: item.lastWeek === null ? '#333' : '#999', fontWeight: item.lastWeek === null ? 700 : 400, ...EN }}>
                        {item.lastWeek === null ? '순위없음' : item.lastWeek}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* More button */}
              <div className="flex justify-center pt-6">
                <button className="px-8 py-3 bg-[#111] text-white text-[13px] font-bold hover:bg-[#333] transition-colors">
                  더보기 (16개 더)
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION 2 — AI 트렌드 인사이트
   ══════════════════════════════════════════════════════════════ */
type InsightProduct = {
  img: string;
  brand: string;
  name: string;
  rank: number;
  change: number; // + = rising
  price: string;
};

const INSIGHT_PRODUCTS: Record<string, InsightProduct[]> = {
  '급상승': [
    { img: IMG.knitSweatshirt,    brand: '에르블랑',   name: '올데이 브이넥 니트_Orange',       rank: 36, change: 53, price: '69,500' },
    { img: IMG.knitCardiganDenim, brand: '라빈느',     name: '옐로 트랙 셋업',                  rank: 23, change: 52, price: '53,870' },
    { img: IMG.knitSage,          brand: '소울리브',   name: '워셔블 라운드 니트_Cream',        rank: 11, change: 37, price: '46,980' },
    { img: IMG.knitPoncho,        brand: '코지랩',     name: '캐시미어 프린지 니트_Ivory',      rank: 21, change: 32, price: '49,920' },
    { img: IMG.knitRibGrey,       brand: '미뉴에뜨',   name: '니트 비니_Rust',                  rank: 38, change: 31, price: '66,000' },
    { img: IMG.knitCableCream,    brand: '데이브리즈', name: '케이블 가디건_Navy',              rank: 72, change: 27, price: '33,000' },
  ],
  '신규 진입': [
    { img: IMG.denimRipped,      brand: '에르블랑',   name: '디스트로이드 스키니 데님_Deep Blue', rank: 3,  change: 0, price: '55,000' },
    { img: IMG.dressFloralWhite, brand: '하루클로젯', name: '플로럴 랩 미니 원피스_White',        rank: 8,  change: 0, price: '42,000' },
    { img: IMG.pantsStripeWide,  brand: '미뉴에뜨',   name: '스트라이프 와이드 팬츠_Black',       rank: 6,  change: 0, price: '58,900' },
    { img: IMG.skirtPleatBlack,  brand: '소울리브',   name: '플리츠 미디 스커트_Black',           rank: 12, change: 0, price: '49,500' },
    { img: IMG.knitRibGrey,      brand: '라빈느',     name: '니트 비니_Rust',                     rank: 19, change: 0, price: '62,000' },
    { img: IMG.blouseChambray,   brand: '코지랩',     name: '샴브레이 셔츠 블라우스_Blue',        rank: 15, change: 0, price: '38,500' },
  ],
  '순위 하락': [
    { img: IMG.coatCamel,       brand: '에르블랑',   name: '오버핏 울 랩 코트_Camel',        rank: 88, change: -25, price: '119,000' },
    { img: IMG.coatPlaid,       brand: '블루밍샵',   name: '체크 울 코트_Navy',              rank: 71, change: -18, price: '195,000' },
    { img: IMG.knitCableCream,  brand: '르비앙',     name: '터틀넥 케이블 니트_Navy',         rank: 45, change: -12, price: '67,000' },
    { img: IMG.pantsStripeWide, brand: '소울리브',   name: '스트라이프 와이드 팬츠_Black',    rank: 62, change: -9,  price: '49,500' },
    { img: IMG.coatPowderBlue,  brand: '하루클로젯', name: 'Classic Wool Coat_Powder Blue',  rank: 55, change: -7,  price: '188,000' },
    { img: IMG.skirtPleatBlack, brand: '미뉴에뜨',   name: '플리츠 미디 스커트_Black',        rank: 78, change: -5,  price: '72,000' },
  ],
};

type IFilter = '급상승' | '신규 진입' | '순위 하락';
const I_FILTERS: IFilter[] = ['급상승', '신규 진입', '순위 하락'];

const MATERIAL_KEYWORDS = [
  { keys: '울, 캐시미어, 모헤어', desc: '프리미엄 보온 소재. 가볍고 고급스러운 혼방 소재에 대한 수요 지속.' },
  { keys: '데님, 코튼, 스웻', desc: '캐주얼하고 편안한 일상복의 기본 소재로 꾸준한 강세.' },
  { keys: '새틴, 레이스, 시어(Sheer)', desc: '여성스럽고 섬세한 포인트 소재. 신규 진입 급증 중.' },
  { keys: '레더, 트위드, 스웨이드', desc: '간절기 아우터와 셋업에서 고급스러운 트렌디함 부각.' },
];
const MOOD_KEYWORDS = [
  { keys: '레이어드, 오버사이즈, 릴랙스 핏', desc: '편안함과 자연스러움을 중시하는 데일리룩 트렌드 지속.' },
  { keys: '셔링, 프릴, 러플, 홀터넥/V넥', desc: '여성스러움을 극대화하는 트렌디 디테일 및 넥라인.' },
  { keys: '와이드, 스트레이트, 커브드 핏', desc: '다양한 체형 커버와 스타일리시함을 제공하는 하의 실루엣.' },
  { keys: '클래식, 빈티지, 유틸리티', desc: '과거의 감성을 현대적으로 재해석하거나 실용성 강조.' },
];

function InsightSection() {
  const [tab, setTab] = useState<IFilter>('급상승');
  const products = INSIGHT_PRODUCTS[tab];

  const changeColor = (c: number) =>
    c > 0 ? '#ef4444' : c < 0 ? '#3b82f6' : '#666';
  const changeLabel = (c: number) =>
    c > 0 ? `▲+${c}위 급상승` : c < 0 ? `▼${Math.abs(c)}위 하락` : 'NEW';

  return (
    <Section alt>
      {/* Intro — 컴팩트 좌측 정렬(브리핑 표 아래 이어지는 해설 느낌) */}
      <div className="pt-10 pb-6 px-12 max-md:pt-8 max-md:px-6">
        <FadeUp>
          {/* 984 = 표준 텍스트 그리드(세로선 스냅 2026-07-11) */}
          <div className="max-w-[984px] mx-auto">
            <p className="text-[13px] max-md:text-[14px] font-semibold text-accent tracking-[0.08em] uppercase mb-2" style={EN}>
              AI Insight
            </p>
            <h2 className="text-[clamp(20px,2.6vw,28px)] max-md:text-[clamp(24px,7vw,28px)] font-semibold tracking-[-0.02em] leading-[1.25] text-text-primary mb-2">
              수백 개 상품을 직접 볼 수 없을 때, AI가 대신 읽어줍니다.
            </h2>
            <p className="text-[15px] max-md:text-[16px] text-text-primary font-light max-md:font-medium leading-[1.65] tracking-[-0.02em]">
              10년차 패션 MD 페르소나의 AI가 카테고리별 트렌드 키워드와 패턴을 매주 보고서로 작성합니다.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* Mockup */}
      <FadeUp>
        <div className="border-t border-border-default">
          <div className="max-w-[1080px] mx-auto">

            {/* Dark header */}
            <div className="bg-[#111] px-8 py-4 max-md:px-4">
              <p className="text-white text-[14px] font-bold tracking-[-0.02em]">트렌드 데이터 분석</p>
            </div>

            <div className="bg-white border-l border-r border-border-default">
              {/* MY BRAND */}
              <div className="px-8 pt-8 pb-6 border-b border-border-default max-md:px-4">
                <p className="text-[11px] font-bold text-text-muted tracking-[0.08em] uppercase mb-5" style={EN}>
                  | MY BRAND
                </p>

                {/* Brand performance */}
                <div className="bg-[#fafafa] border border-border-default p-5 mb-0">
                  <p className="text-[11px] font-semibold text-text-weak mb-3">자사몰 성과</p>
                  <ul className="space-y-2">
                    <li className="text-[13px] text-text-primary leading-[1.65]">
                      <span className="font-bold">오버핏 울 랩 코트_Camel</span>
                      <span className="text-[#3b82f6] font-semibold ml-2">( -25위 하락 )</span>
                      <span className="text-text-weak"> → 간절기 수요를 겨냥했으나 경쟁 브랜드의 유사 스타일 신규 진입이 집중되며 상대적 노출 감소로 순위 하락.</span>
                    </li>
                  </ul>

                  {/* Product card */}
                  <div className="mt-4 inline-block border border-border-default bg-white p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-[80px] h-[80px] shrink-0 bg-[#f5f5f5] overflow-hidden">
                        <img src={IMG.coatCamel} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-[#1e3a5f] text-white text-[9px] font-bold px-1.5 py-0.5" style={EN}>88위</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-weak font-semibold mb-0.5">에르블랑</p>
                        <p className="text-[13px] font-medium text-text-primary leading-[1.4] mb-2">오버핏 울 랩<br />코트_Camel</p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#3b82f6] bg-[#eff6ff] px-1.5 py-0.5">
                          ▼ 25위 하락
                        </span>
                        <p className="text-[13px] font-bold text-text-primary mt-1.5" style={EN}>₩119,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KEYWORD */}
              <div className="px-8 pt-6 pb-6 border-b border-border-default max-md:px-4">
                <p className="text-[11px] font-bold text-text-muted tracking-[0.08em] uppercase mb-5" style={EN}>
                  KEYWORD
                </p>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  {/* Material */}
                  <div className="bg-[#fafafa] border border-border-default p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 16 16" fill="none" stroke="#666" strokeWidth="1.5">
                        <rect x="2" y="2" width="8" height="8" />
                        <rect x="6" y="6" width="8" height="8" />
                      </svg>
                      <div>
                        <span className="text-[13px] font-bold text-text-primary" style={EN}>Material Trend</span>
                        <span className="text-[11px] text-text-weak ml-2">소재 트렌드</span>
                      </div>
                    </div>
                    <ul className="space-y-2.5">
                      {MATERIAL_KEYWORDS.map((k, i) => (
                        <li key={i} className="text-[13px] text-text-primary leading-[1.65]">
                          <span className="font-bold">{k.keys}</span>
                          <span className="text-text-weak"> — {k.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Mood */}
                  <div className="bg-[#fafafa] border border-border-default p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 16 16" fill="none" stroke="#666" strokeWidth="1.5">
                        <rect x="3" y="3" width="10" height="10" />
                        <path d="M3 8h10M8 3v10" />
                      </svg>
                      <div>
                        <span className="text-[13px] font-bold text-text-primary" style={EN}>Mood &amp; Style</span>
                        <span className="text-[11px] text-text-weak ml-2">무드 &amp; 스타일</span>
                      </div>
                    </div>
                    <ul className="space-y-2.5">
                      {MOOD_KEYWORDS.map((k, i) => (
                        <li key={i} className="text-[13px] text-text-primary leading-[1.65]">
                          <span className="font-bold">{k.keys}</span>
                          <span className="text-text-weak"> — {k.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* TRENDS */}
              <div className="px-8 pt-6 pb-8 max-md:px-4">
                <p className="text-[11px] font-bold text-text-muted tracking-[0.08em] uppercase mb-5" style={EN}>
                  TRENDS
                </p>

                {/* Trend tabs */}
                <div className="flex gap-0 border-b border-border-default mb-6">
                  {I_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setTab(f)}
                      className="px-5 py-2.5 text-[13px] font-semibold transition-colors"
                      style={{
                        color:        tab === f ? '#0070f3' : '#999',
                        borderBottom: tab === f ? '2px solid #0070f3' : '2px solid transparent',
                        marginBottom: '-1px',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Category block */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border border-border-default p-5 bg-white">
                      {/* Category badge + keywords */}
                      <div className="flex items-start gap-3 mb-5">
                        <span className="shrink-0 px-3 py-1 text-[11px] font-bold text-white" style={{ background: '#171717' }}>
                          니트웨어
                        </span>
                        <p className="text-[13px] text-text-primary leading-[1.65]">
                          <span className="font-bold">공통 키워드(V넥, 라운드넥, 워셔블, 코튼, 캐시미어, 레이어드, 홀터넥)</span>
                          {' '}— 간절기에 가볍게 착용하고 레이어링하기 좋은 실용적인 니트웨어와 트렌디한 홀터넥 디자인이 강세.
                        </p>
                      </div>

                      {/* Product grid */}
                      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        {products.map((p, i) => (
                          <div key={i} className="shrink-0 w-[140px]">
                            <div className="relative w-full aspect-square bg-[#f5f5f5] overflow-hidden mb-2">
                              <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                              <span
                                className="absolute top-1.5 left-1.5 w-7 h-7 flex items-center justify-center text-[10px] font-bold text-white"
                                style={{ background: '#1e3a5f', ...EN }}
                              >
                                {p.rank}위
                              </span>
                            </div>
                            <p className="text-[10px] text-text-weak font-semibold mb-0.5">{p.brand}</p>
                            <p className="text-[11px] text-text-primary font-medium leading-[1.4] mb-1.5 line-clamp-1">{p.name}</p>
                            <span
                              className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 mb-1.5"
                              style={{
                                color: changeColor(p.change),
                                background: p.change > 0 ? '#fef2f2' : p.change < 0 ? '#eff6ff' : '#f5f3ff',
                              }}
                            >
                              {changeLabel(p.change)}
                            </span>
                            <p className="text-[13px] font-bold text-text-primary" style={EN}>₩{p.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom border */}
            <div className="h-px bg-border-default" />
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION 3 — 경쟁사 Compare
   ══════════════════════════════════════════════════════════════ */
type CompareProduct = {
  img: string;
  brand: string;
  name: string;
  likes: string;
  bestRank?: number;
};

const COMPARE_BRANDS = ['에르블랑', '라빈느', '소울리브', '코지랩', '미뉴에뜨', '데이브리즈'];

const COMPARE_PRODUCTS: Record<string, CompareProduct[]> = {
  '에르블랑': [
    { img: PT_IMGS[0], brand: '에르블랑', name: '롱 트렌치 코트_Powder Blue',       likes: '4,962', bestRank: 5 },
    { img: PT_IMGS[2], brand: '에르블랑', name: '플리츠 미디 스커트_Black',         likes: '817',   bestRank: undefined },
    { img: PT_IMGS[4], brand: '에르블랑', name: '오버사이즈 크루넥 후디_Orange',   likes: '1,283', bestRank: 4 },
    { img: PT_IMGS[6], brand: '에르블랑', name: '스트레이트 데님 팬츠_Blue',        likes: '392',   bestRank: 3 },
    { img: PT_IMGS[8], brand: '에르블랑', name: '울 블렌드 코트_Camel',              likes: '519',   bestRank: undefined },
    { img: PT_IMGS[1], brand: '에르블랑', name: '레더 블루종 재킷_Brown',        likes: '2,341', bestRank: 7 },
    { img: PT_IMGS[3], brand: '에르블랑', name: '케이블 니트 가디건_Navy',        likes: '1,087', bestRank: undefined },
    { img: PT_IMGS[5], brand: '에르블랑', name: '디스트로이드 스키니 데님_Blue',  likes: '643',   bestRank: undefined },
    { img: PT_IMGS[7], brand: '에르블랑', name: '플로럴 레이스 블라우스_White',   likes: '891',   bestRank: 9 },
    { img: PT_IMGS[9], brand: '에르블랑', name: '옐로 트랙 셋업',                likes: '1,524', bestRank: undefined },
  ],
  '라빈느': [
    { img: PT_IMGS[1], brand: '라빈느', name: '레더 블루종 재킷_Brown',        likes: '3,201', bestRank: 12 },
    { img: PT_IMGS[3], brand: '라빈느', name: '케이블 니트 가디건_Navy',        likes: '2,891', bestRank: 23 },
    { img: PT_IMGS[5], brand: '라빈느', name: 'Distressed Skinny Denim Pants_Blue', likes: '1,047', bestRank: undefined },
    { img: PT_IMGS[7], brand: '라빈느', name: '플로럴 레이스 블라우스_White',   likes: '892',   bestRank: undefined },
    { img: PT_IMGS[9], brand: '라빈느', name: '옐로 트랙 셋업',                 likes: '2,134', bestRank: 31 },
    { img: PT_IMGS[0], brand: '라빈느', name: '롱 트렌치 코트_Powder Blue',    likes: '1,673', bestRank: undefined },
    { img: PT_IMGS[2], brand: '라빈느', name: '플리츠 미디 스커트_Black',      likes: '743',   bestRank: undefined },
    { img: PT_IMGS[4], brand: '라빈느', name: '오버사이즈 크루넥 후디_Orange', likes: '1,298', bestRank: 45 },
    { img: PT_IMGS[6], brand: '라빈느', name: '스트레이트 데님 팬츠_Blue',     likes: '581',   bestRank: undefined },
    { img: PT_IMGS[8], brand: '라빈느', name: '울 블렌드 코트_Camel',          likes: '2,056', bestRank: 38 },
  ],
  '소울리브': [
    { img: PT_IMGS[2], brand: '소울리브', name: '플리츠 미디 스커트_Black',       likes: '1,842', bestRank: 38 },
    { img: PT_IMGS[4], brand: '소울리브', name: '오버사이즈 크루넥 니트_Orange',  likes: '994',   bestRank: undefined },
    { img: PT_IMGS[6], brand: '소울리브', name: '워싱 스트레이트 데님_Blue',      likes: '2,201', bestRank: 18 },
    { img: PT_IMGS[8], brand: '소울리브', name: '울 랩 코트_Camel',               likes: '673',   bestRank: undefined },
    { img: PT_IMGS[0], brand: '소울리브', name: '미니멀 롱 코트_Powder Blue',     likes: '1,456', bestRank: 52 },
    { img: PT_IMGS[1], brand: '소울리브', name: '레더 블루종 재킷_Brown',         likes: '1,087', bestRank: undefined },
    { img: PT_IMGS[3], brand: '소울리브', name: '케이블 니트 가디건_Navy',        likes: '834',   bestRank: undefined },
    { img: PT_IMGS[5], brand: '소울리브', name: '디스트로이드 스키니 데님_Blue',  likes: '2,318', bestRank: 29 },
    { img: PT_IMGS[7], brand: '소울리브', name: '플로럴 레이스 블라우스_White',   likes: '1,691', bestRank: 41 },
    { img: PT_IMGS[9], brand: '소울리브', name: '옐로 트랙 셋업',                 likes: '547',   bestRank: undefined },
  ],
};
// Fill remaining brands with shuffled data
['코지랩', '미뉴에뜨', '데이브리즈'].forEach((brand, bi) => {
  COMPARE_PRODUCTS[brand] = PT_IMGS.map((img, i) => ({
    img,
    brand,
    // 감독관2차 M1 전수점검: PT_IMGS 실사 재확인 후 품목·색상 역맞춤(idx5~9는 slice(0,5)로 미노출이나 데이터 정합성 위해 함께 수정)
    name: ['롱 트렌치 코트_Powder Blue', '레더 블루종 재킷_Brown', '플리츠 미디 스커트_Black', '케이블 니트 가디건_Navy', '오버사이즈 크루넥 후디_Orange',
           '디스트로이드 스키니 데님_Blue', '스트레이트 데님 팬츠_Blue', '플로럴 레이스 블라우스_White', '울 블렌드 코트_Camel', '옐로 트랙 셋업'][i],
    likes: ['1,234', '892', '2,341', '547', '1,876', '3,012', '678', '1,543', '934', '2,187'][i],
    bestRank: [18, undefined, 35, undefined, 62, 7, undefined, 44, undefined, 28][i] as number | undefined,
  }));
});

function CompareSection() {
  const [activeBrand, setActiveBrand] = useState('에르블랑');
  const products = COMPARE_PRODUCTS[activeBrand] ?? COMPARE_PRODUCTS['에르블랑'];

  return (
    <Section>
      {/* Intro */}
      <div className="pt-16 pb-10 px-12 max-md:pt-12 max-md:px-6 text-center">
        <FadeUp>
          <p className="text-[13px] max-md:text-[14px] font-semibold text-accent tracking-[0.08em] uppercase mb-3" style={EN}>
            Competitor Compare
          </p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.02em] leading-[1.15] text-text-primary mb-3">
            오늘 경쟁사가 29CM에서<br />뭘 팔고 있는지 압니다.
          </h2>
          <p className="text-[16px] text-text-primary font-light max-md:font-medium leading-[1.65] max-w-[520px] mx-auto tracking-[-0.02em]">
            경쟁사를 등록하면 그 브랜드의 29CM 추천순 TOP 20 상품을 매일 자동 수집합니다.
          </p>
        </FadeUp>
      </div>

      {/* Mockup */}
      <FadeUp>
        <div className="border-t border-border-default">
          <div className="max-w-[1080px] mx-auto">

            {/* Header */}
            <div className="px-8 pt-6 pb-0 max-md:px-4">
              <h3 className="text-[15px] font-bold text-text-primary tracking-[-0.02em] mb-1">
                29CM 경쟁사 판매순 TOP 20
              </h3>
              <p className="text-[11px] text-text-muted mb-5" style={EN}>
                2026년 02-25 오전 8시 00분 기준 — 판매순 TOP20 / 주간 베스트 상품
              </p>

              {/* Brand tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-0 scrollbar-hide">
                {COMPARE_BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setActiveBrand(b)}
                    className="shrink-0 px-4 py-1.5 text-[13px] font-semibold transition-colors duration-150"
                    style={{
                      background: activeBrand === b ? '#111' : '#f5f5f5',
                      color:      activeBrand === b ? '#fff' : '#666',
                      border:     activeBrand === b ? '1px solid #111' : '1px solid #eaeaea',
                    }}
                  >
                    {b}
                    {b === '에르블랑' && (
                      <span className="ml-1.5 text-[9px] font-bold text-text-weak bg-[#f5f3ff] px-1 py-0.5">자사</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-8 pt-5 pb-8 max-md:px-4"
              >
                {/* 10→5개(1행) 감량 — 재측정 콜드 리드 "카드 나열 반복감·중반 늘어짐" 지적(2026-07-11) */}
                <div className="grid grid-cols-5 gap-3 max-md:grid-cols-2">
                  {products.slice(0, 5).map((p, i) => (
                    <div key={i} className="border border-border-default bg-white overflow-hidden">
                      {/* Image */}
                      <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
                        <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        {/* Rank number */}
                        <span
                          className="absolute top-2 left-2 text-[16px] font-black text-white"
                          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)', ...EN }}
                        >
                          {i + 1}
                        </span>
                        {/* 감독관 3차: 좌측 판매순 번호와 "베스트 N위" 배지가 두 순위 체계로 읽혀 정보 충돌 → 배지 제거 */}
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        <p className="text-[9px] text-text-weak font-semibold mb-0.5">{p.brand}</p>
                        <p className="text-[11px] text-text-primary font-medium leading-[1.4] mb-2 line-clamp-2">{p.name}</p>
                        <div className="flex items-center gap-1 mb-2.5">
                          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="#ef4444"><path d="M8 14s-6-3.5-6-8a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 4.5-6 8-6 8" /></svg>
                          <span className="text-[10px] text-text-muted" style={EN}>{p.likes}</span>
                        </div>
                        <div className="flex gap-1">
                          <button className="flex-1 py-1 text-[9px] font-bold text-[#333] border border-[#eaeaea] hover:bg-[#f5f5f5] transition-colors truncate">
                            바로가기
                          </button>
                          <button className="flex-1 py-1 text-[9px] font-bold text-text-weak border border-border-default hover:bg-[#f5f5f5] transition-colors truncate">
                            최신 리뷰 10
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SEARCH VOLUME (Naver + GSC) — 기존 유지
   ══════════════════════════════════════════════════════════════ */
const NAVER_MY = [
  420, 480, 510, 445, 590, 620, 580, 650, 700, 680,
  740, 720, 810, 850, 830, 880, 910, 890, 950, 980,
  920, 1000, 1040, 990, 1080, 1100, 1050, 1120, 1160, 1200,
];
const NAVER_COMP = [
  680, 650, 700, 720, 710, 680, 720, 690, 670, 710,
  700, 680, 720, 730, 710, 720, 700, 710, 690, 700,
  720, 710, 690, 700, 680, 720, 710, 700, 690, 680,
];
const _NW = 500, _NH = 190, _NP = 10;
const _NMIN = Math.min(...NAVER_MY, ...NAVER_COMP);
const _NMAX = Math.max(...NAVER_MY, ...NAVER_COMP);
const _NR = _NMAX - _NMIN;
function _nLine(data: number[]): string {
  const pts = data.map((v, i) => {
    const x = ((i / (data.length - 1)) * _NW).toFixed(1);
    const y = (_NH - _NP - ((v - _NMIN) / _NR) * (_NH - _NP * 2)).toFixed(1);
    return `${x},${y}`;
  });
  return `M ${pts.join(' L ')}`;
}
const MY_LINE  = _nLine(NAVER_MY);
const MY_AREA  = `${MY_LINE} L ${_NW},${_NH} L 0,${_NH} Z`;
const COMP_LINE = _nLine(NAVER_COMP);

const GSC_ROWS = [
  { query: '린넨 원피스',       clicks: 1240, impressions: 18500, ctr: 6.7, position: 1.8 },
  { query: '여름 원피스 추천',  clicks: 890,  impressions: 24300, ctr: 3.7, position: 3.2 },
  { query: '오버사이즈 셔츠',  clicks: 780,  impressions: 15200, ctr: 5.1, position: 2.4 },
  { query: '데님 팬츠 여성',   clicks: 650,  impressions: 31000, ctr: 2.1, position: 4.8 },
  { query: '코튼 티셔츠',      clicks: 580,  impressions: 22100, ctr: 2.6, position: 3.9 },
  { query: '무지 니트',        clicks: 520,  impressions: 19800, ctr: 2.6, position: 4.1 },
  { query: '크롭 자켓',        clicks: 490,  impressions: 12600, ctr: 3.9, position: 2.9 },
  { query: '플로럴 블라우스',  clicks: 420,  impressions: 16300, ctr: 2.6, position: 5.2 },
  { query: '스트링 팬츠',      clicks: 380,  impressions:  8900, ctr: 4.3, position: 2.1 },
  { query: '여름 바캉스룩',    clicks: 340,  impressions: 28000, ctr: 1.2, position: 7.4 },
];

function NaverLineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="border border-border-default bg-white p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold text-accent tracking-[0.08em] uppercase mb-0.5" style={EN}>
            Naver Search Volume
          </p>
          <p className="text-[13px] font-semibold text-text-primary">일간 검색량 · 최근 30일</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] text-[#22c55e] font-medium">
            <span className="w-4 h-0.5 bg-[#22c55e] inline-block" />내 브랜드
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-text-weak font-medium">
            <span className="w-4 h-0 inline-block" style={{ borderTop: '2px dashed #999' }} />경쟁사
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${_NW} ${_NH}`} className="w-full" style={{ height: '190px' }}>
        <defs>
          <linearGradient id="naverGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((t) => {
          const y = (_NP + t * (_NH - _NP * 2)).toFixed(1);
          return <line key={t} x1="0" y1={y} x2={_NW} y2={y} stroke="#f0f0f0" strokeWidth="1" />;
        })}
        <motion.path d={COMP_LINE} fill="none" stroke="#999" strokeWidth="1.5" strokeDasharray="5 4"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut', delay: 0.4 }} />
        <motion.path d={MY_AREA} fill="url(#naverGradient2)"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 0.6 }} />
        <motion.path d={MY_LINE} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: 'easeInOut' }} />
      </svg>

      <div className="flex items-center justify-between mt-1 mb-4 text-[9px] text-text-weak" style={EN}>
        <span>1일</span><span>8일</span><span>15일</span><span>22일</span><span>30일</span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-default">
        <div>
          <p className="text-[9px] text-text-weak mb-1" style={EN}>Monthly Total</p>
          <p className="text-[20px] font-bold text-[#22c55e]" style={EN}>
            24,300<span className="text-[11px] font-normal text-text-weak ml-1">건</span>
          </p>
        </div>
        <div>
          <p className="text-[9px] text-text-weak mb-1" style={EN}>Daily Avg</p>
          <p className="text-[20px] font-bold text-text-primary" style={EN}>
            810<span className="text-[11px] font-normal text-text-weak ml-1">건</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function GSCQueryTable() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="border border-border-default bg-white overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-border-default bg-[#fafafa] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-accent tracking-[0.08em] uppercase mb-0.5" style={EN}>
            Google Search Console
          </p>
          <p className="text-[13px] font-semibold text-text-primary">검색 유입 키워드 · 최근 28일</p>
        </div>
        <span className="text-[9px] text-text-weak border border-border-default px-2 py-0.5" style={EN}>Top 10</span>
      </div>
      <div
        className="grid px-5 py-2 text-[9px] font-semibold text-text-weak tracking-[0.08em] uppercase border-b border-border-default bg-[#fafafa]"
        style={{ gridTemplateColumns: '1fr 52px 44px 44px 52px', ...EN }}
      >
        <span>검색어</span>
        <span className="text-right">노출</span>
        <span className="text-right">CTR</span>
        <span className="text-right">순위</span>
        <span className="text-right text-accent">클릭</span>
      </div>
      {GSC_ROWS.map((row, i) => (
        <motion.div
          key={i}
          className="grid items-center px-5 py-3 border-b border-border-light last:border-b-0 hover:bg-bg-alt transition-colors"
          style={{ gridTemplateColumns: '1fr 52px 44px 44px 52px' }}
          initial={{ opacity: 0, x: -12 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[9px] text-text-weak shrink-0 w-4" style={EN}>{i + 1}</span>
            <span className="text-[13px] text-text-primary truncate">{row.query}</span>
          </div>
          <span className="text-[11px] text-text-muted text-right" style={EN}>
            {row.impressions >= 1000 ? `${(row.impressions / 1000).toFixed(1)}K` : row.impressions}
          </span>
          <span className="text-[11px] text-text-muted text-right" style={EN}>{row.ctr}%</span>
          <span className="text-[11px] text-text-muted text-right" style={EN}>{row.position}</span>
          <span className="text-[13px] font-bold text-accent text-right" style={EN}>
            {row.clicks.toLocaleString('ko-KR')}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════ */
export default function TrendShowcase() {
  return (
    <>
      {/* 브리지 — 콜드 리드 지적("광고 페이지에 왜 트렌드?" 정체성 이탈) 대응. 문구 = GPT+사장님 확정(2026-07-11) 토씨 그대로 */}
      <Section alt>
        <div className="py-16 px-12 text-center max-md:py-12 max-md:px-6">
          <FadeUp>
            <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3">
              광고를 이해하려면, 시장도 함께 봐야 합니다
            </h3>
            <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-text-weak max-w-[560px] mx-auto leading-[1.65]">
              광고 성과만으로는 다음 선택을 결정하기 어렵습니다. 함께 팔리는 상품과 경쟁사의 흐름까지 함께 봐야 운영의 기준이 생깁니다.
            </p>
          </FadeUp>
        </div>
      </Section>
      <BriefingSection />
      <InsightSection />
      <CompareSection />

      {/* Search Volume */}
      <Section>
        {/* py-16 = 서브 섹션 여백 리듬(64px) 통일(2026-07-11) */}
        <div className="bg-[#0a0a0a] py-16 px-12 max-md:py-10 max-md:px-6">
          <FadeUp>
            {/* 984 = 표준 텍스트 그리드(세로선 스냅 2026-07-11) */}
            <div className="max-w-[984px] mx-auto grid grid-cols-2 gap-12 items-end max-md:grid-cols-1 max-md:gap-6">
              <div>
                <p className="text-[13px] max-md:text-[14px] font-semibold tracking-[0.08em] uppercase mb-3 text-white/40" style={EN}>
                  Search Volume
                </p>
                <h3 className="text-[clamp(22px,3vw,34px)] font-semibold text-white tracking-[-0.02em] leading-[1.2]">
                  검색량도 경쟁사와<br />비교합니다.
                </h3>
              </div>
              <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-white/60 leading-[1.65]">
                네이버 일간 검색량 30일 추이와 Google Search Console 유입 키워드를 한 화면에서. 내 브랜드가 얼마나 검색되는지, 어떤 키워드로 고객이 유입되는지 파악하세요.
              </p>
            </div>
          </FadeUp>
        </div>
        <div className="py-14 px-12 max-md:py-10 max-md:px-6">
          <div className="max-w-[1080px] mx-auto grid grid-cols-[5fr_7fr] gap-6 items-stretch max-md:grid-cols-1">
            <NaverLineChart />
            <GSCQueryTable />
          </div>
        </div>
      </Section>
    </>
  );
}
