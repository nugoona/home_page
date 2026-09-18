'use client';

import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { useRevealOnView, RevealHtmlLines } from '@/components/motion/Reveal';
import { homeV2 } from '@/lib/content/home';
import MobileAssetTimeline from './MobileAssetTimeline';

/**
 * S6 · 자산 "남는 것은 사장님의 것이어야 합니다" — 두 자산 스택 (사장님 택1 2026-07-14, 구성①).
 * 기존 AssetSection의 칸 그리드(hairline + '+' 마커) 뼈대 유지 + 두 칸에 자산 목업 추가.
 *
 * ▣ 개념: 시간이 지날수록 자산이 "내 계정·내 판단"에 쌓인다(안심·소유). 처음으로 안 돌아간다.
 *   - 좌 = 콘텐츠 자산: 브라우저 창(Clone03 크롬: 신호등 점 + URL 칩 "사장님의 블로그 계정") 안에
 *     발행 글 카드가 날짜순 계단식 스택(Clone08 DEPLOYS: 아래로 갈수록 살짝 인셋+좁게) + 하단 fade(계속 쌓임).
 *   - 우 = 광고 경험 자산: 월별 리포트 카드 계단식 스택 + "다음 판단에 반영" 한 줄.
 * ▣ Vercel 실측(§8.15): 카드 흰 배경+1px #ECECEC+radius 12, 그림자 `0 6px 16px .04`(퍼짐 금지).
 *   내용 = 제목 텍스트 + 스켈레톤 바(실물 UI 아님). 글자 = font-medium·진한색(§8.14-3).
 * ⛔ 순위·성과 보장 없음(글 제목=무해한 로컬 소재, 리포트=월 라벨만). 대행사 비난 비교 없음.
 *   가짜 네이버/실물 재현 없음(제네릭 브라우저 크롬만). 카피 = home.ts homeV2.asset 토씨 유지.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

const KRUNIT = { fontFamily: 'var(--font-kr)' } as const;

const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';

function PlusMark({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute z-10 block h-3.5 w-3.5 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(15,23,42,0.28)]" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-[rgba(15,23,42,0.28)]" />
    </span>
  );
}

/* ── 좌: 콘텐츠 자산 — 브라우저 창(Clone03 실물 크롬) 안에 글 "컬렉션" 그리드 ── */
const POSTS = [
  { title: '봄 신메뉴 3종 소개', date: '4월 2일', img: '/img/unsplash/webp/photo-1504674900247-0877df9cc836.webp' },
  { title: '주말 디너 코스 이야기', date: '3월 28일', img: '/img/unsplash/webp/photo-1414235077428-338989a2e8c0.webp' },
  { title: '수제 팬케이크 비하인드', date: '3월 21일', img: '/img/unsplash/webp/photo-1567620905732-2d1ec7ab7445.webp' },
  { title: '화덕 피자 굽는 시간', date: '3월 14일', img: '/img/unsplash/webp/photo-1565299624946-b28f40a0ae38.webp' },
  { title: '샐러드 리뉴얼 소식', date: '3월 7일', img: '/img/unsplash/webp/photo-1546069901-ba9599a7e63c.webp' },
  { title: '셰프의 플레이팅 노트', date: '2월 27일', img: '/img/unsplash/webp/photo-1551218808-94e220e084d2.webp' },
];

/* 미니 글 카드 — 실물 썸네일(보존 자산 unsplash) + 제목 + 날짜 (많음 = 컬렉션) */
function PostCard({ title, date, img }: { title: string; date: string; img: string }) {
  return (
    <div
      className="overflow-hidden rounded-[9px] bg-white"
      style={{ border: `1px solid ${BORDER}`, boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 3px 8px rgba(0,0,0,0.03)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" className="h-[64px] w-full object-cover" loading="lazy" />
      <div className="px-2 pb-2 pt-1.5">
        <p className="truncate text-[11.5px] font-semibold tracking-[-0.01em] text-text-primary">{title}</p>
        <p className="text-[10px] text-text-muted" style={EN}>
          {date}
        </p>
      </div>
    </div>
  );
}

function ContentStack() {
  return (
    <div
      className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[12px] bg-white"
      style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}
    >
      {/* 브라우저 크롬 — Clone03 실측: 컬러 신호등 + 모노 URL */}
      <div className="relative flex h-9 items-center border-b border-border-light bg-white px-3.5">
        <div className="flex items-center gap-1">
          <span className="h-[9px] w-[9px] rounded-full bg-[#ec6a5e]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#f4bf4f]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#61c454]" />
        </div>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[11.5px] text-[#7d7d7d]">
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none" aria-hidden>
            <rect x="2.2" y="5.6" width="8.6" height="6" rx="1.2" stroke="#7d7d7d" strokeWidth="1.1" />
            <path d="M4.1 5.4V4a2.4 2.4 0 0 1 4.8 0v1.4" stroke="#7d7d7d" strokeWidth="1.1" />
          </svg>
          고객님의 블로그
        </span>
      </div>

      {/* 창 내부: 점선 그리드 칸(Clone03) 위에 글 컬렉션 2열 + 하단 fade(계속 쌓임) */}
      <div className="relative">
        {/* 점선 칸 배경 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent calc(50% - 0.5px), rgba(15,23,42,0.07) calc(50% - 0.5px), rgba(15,23,42,0.07) calc(50% + 0.5px), transparent calc(50% + 0.5px))',
          }}
        />
        {/* 하단 페이드 제거(사장님 2026-07-15 "아래 페이드 넣지마") — 카드가 창 하단에서 그대로 끝남 */}
        <div className="relative grid grid-cols-2 gap-2.5 px-3.5 pb-2 pt-3.5">
          {POSTS.map((p) => (
            <PostCard key={p.title} title={p.title} date={p.date} img={p.img} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 우: 광고 경험 자산 — 포개진 리포트 서류철 (앞장 전체 + 뒷장들은 제목 줄만) ── */
function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0">
      <rect x="4" y="2.5" width="14" height="17" rx="2.5" stroke="#9a9a9a" strokeWidth="1.6" />
      <path d="M7.5 7.5h7M7.5 11h7M7.5 14.5h4.5" stroke="#9a9a9a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* 월별 KPI (예시 지표 — AdScene 대시보드 목업과 동일한 '현황 표시' 관례. 성과 보장 아님) */
const KPI = [
  { label: '광고비', value: '342,180', unit: '원' },
  { label: '주문', value: '47', unit: '건' },
  { label: '클릭', value: '1,203', unit: '회' },
];
/* 막대 높이 — 콘텐츠 창(415px)과 전체 높이 균형(사장님 2026-07-14 두 목업 높이 맞춤) */
const BARS_H = [31, 47, 25, 55, 39, 64, 50];

function ReportStack() {
  return (
    <div className="mx-auto flex w-full max-w-[340px] flex-col">
      {/* 리포트 대시보드 — 콘텐츠 창과 동일 폭·동일 카드 문법(Clone08 그림자·radius) */}
      <div
        className="overflow-hidden rounded-[12px] bg-white"
        style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-text-primary">4월 광고 리포트</span>
          <DocIcon />
        </div>
        {/* KPI 3칸 (EN·tabular 숫자) */}
        <div className="grid grid-cols-3 divide-x divide-border-light border-b border-border-light">
          {KPI.map((k) => (
            <div key={k.label} className="px-3 py-3.5">
              <p className="text-[10.5px] text-text-muted">{k.label}</p>
              <p className="mt-0.5 text-[14px] font-bold tracking-[-0.01em] text-text-primary [font-variant-numeric:tabular-nums]" style={EN}>
                {k.value}
                <span className="ml-0.5 text-[10px] font-medium text-text-muted" style={KRUNIT}>
                  {k.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
        {/* 주간 막대 차트 (잉크 톤, 최신 주만 진하게 — 절제) */}
        <div className="border-b border-border-light px-4 pb-3.5 pt-3">
          <p className="mb-2 text-[10.5px] text-text-muted">일별 주문</p>
          <div className="flex items-end gap-1.5" aria-hidden>
            {BARS_H.map((h, i) => (
              <span
                key={i}
                className="w-full rounded-[3px]"
                style={{ height: h, background: i === BARS_H.length - 2 ? '#171717' : '#E6E8EB' }}
              />
            ))}
          </div>
        </div>
        {/* 채널별 지출 (콘텐츠 창과 높이 균형 — AdScene 관례의 현황 표시) */}
        <div className="px-4 pb-3 pt-2.5">
          <p className="mb-1.5 text-[10.5px] text-text-muted">채널별</p>
          {[
            { ch: 'Meta', spend: '136,452', cnt: '14' },
            { ch: 'Google', spend: '98,540', cnt: '9' },
            { ch: '검색광고', spend: '107,188', cnt: '24' },
          ].map((r) => (
            <div key={r.ch} className="flex items-center justify-between border-b border-border-light py-2.5 last:border-b-0">
              <span className="text-[11.5px] font-semibold tracking-[-0.01em] text-text-body" style={EN}>
                {r.ch}
              </span>
              <span className="text-[11.5px] text-text-muted [font-variant-numeric:tabular-nums]" style={EN}>
                {r.spend}
                <span style={KRUNIT}>원</span> · 주문 {r.cnt}
                <span style={KRUNIT}>건</span>
              </span>
            </div>
          ))}
        </div>
        {/* 하단 시트 탭 — 엑셀처럼 월별 리포트가 쌓임 (4월 활성) */}
        <div className="flex items-center gap-0 border-t border-border-light bg-[#f7f8f9] px-2 pt-1">
          {['4월', '3월', '2월', '1월'].map((m, i) => (
            <span
              key={m}
              className={
                i === 0
                  ? 'rounded-t-[6px] border border-b-0 border-[#ECECEC] bg-white px-3 py-1 text-[11px] font-semibold text-text-primary'
                  : 'px-3 py-1 text-[11px] font-medium text-text-muted'
              }
              style={EN}
            >
              {m}
            </span>
          ))}
          <span className="px-1.5 pb-0.5 text-[11px] text-text-muted" style={EN}>
            ···
          </span>
        </div>
      </div>

    </div>
  );
}

/* Grid Occupancy 편입(2026-07-15, §8.16): 자체 보더 박스 폐지 → 페이지 좌표계 칸으로.
   head 풀폭 / 자산 셀 2열 / 결론 풀폭. 모바일 = 풀폭 세로 스택. */
const D_AREAS: GridArea[] = [
  { key: 'head', c: [1, 13], r: [1, 3], className: 'flex items-center' },
  { key: 'cell0', c: [1, 7], r: [3, 10] },
  { key: 'cell1', c: [7, 13], r: [3, 10] },
  { key: 'conclusion', c: [1, 13], r: [10, 12], className: 'flex items-center justify-center' }, // 결론 2줄(재설계 2026-07-15)
];

export default function S6AssetStacks() {
  /* 위계 재설계(2026-07-15 사장님 지시서): 헤드 → 두 제품 핵심 메시지(크게, 목업보다 먼저) → 목업(증명) → 결론.
     목업이 주인공이고 카피가 주석이던 구조 폐기. */
  const { head, cells, conclusion } = homeV2.asset;
  /* ★ 정식 제품명 + 로고 (표기 규칙: "누구나 콘텐츠"/"누구나 광고" — 임의 축약 금지) */
  const products = [
    { logo: '/img/logo/nc.svg?v=16', name: '누구나 콘텐츠' },
    { logo: '/img/logo/na.svg?v=20', name: '누구나 광고' },
  ];
  const mocks = [<ContentStack key="c" />, <ReportStack key="r" />];
  const headRevealRef = useRevealOnView<HTMLDivElement>();

  const headBlock = (
    <div className="px-8 py-8 lg:px-12">
      <span className="mb-5 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
          <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
        </svg>
        <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#555555]" style={{ fontFamily: 'var(--font-en)' }}>
          Asset
        </span>
      </span>
      <h2 className="text-[clamp(26px,3.4vw,40px)] font-bold text-text-primary tracking-[-0.04em] leading-[1.26] text-balance">
        <RevealHtmlLines html={head} />
      </h2>
    </div>
  );

  const cellBlock = (i: number) => (
    <div className="flex h-full flex-col px-8 py-8 lg:px-10">
      {/* 로고 확대(사장님 2026-07-15 "에셋 목업 위 로고도 너무 작아") */}
      <span className="inline-flex items-center gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={products[i].logo} alt={`${products[i].name} 로고`} style={{ height: 56, width: 56, display: 'block' }} />
        <span className="text-[16px] font-bold tracking-[-0.01em] text-text-primary">{products[i].name}</span>
      </span>
      {/* 핵심 메시지 — 목업보다 먼저 읽히는 주인공(사장님 지시서 2026-07-15) */}
      <h3
        className="mt-4 text-[clamp(19px,1.9vw,25px)] font-bold leading-[1.35] tracking-[-0.03em] text-text-primary"
        dangerouslySetInnerHTML={{ __html: cells[i].msg }}
      />
      {/* 목업 = 메시지의 증명(아래) */}
      <div className="mt-7 flex flex-1 flex-col justify-start">{mocks[i]}</div>
    </div>
  );

  /* 결론 칸 = 설계된 배너(도트 배경+투톤 한 줄 + Clone05 하드웨어 — 사장님 2026-07-15 "썰렁한 박스 디자인 추가").
     Clone05 문법 이식: ①십자(+)는 그리드 선이 맞물리는 칸 코너 교차점 2개(대각, #a3a3a3 1.5px)
     ②상단 경계 위 "잘린 다크 요소" 짧은 바(h2 잉크) ③그리드 라인에 스냅한 세로선 1개(2/12 지점). */
  const conclusionBlock = (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* 세로선 시안 제거(사장님 2026-07-15 "쓸데없이 세로 구획") — 십자·다크 바만 유지 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 90% at 50% 50%, #000 40%, transparent 100%)',
        }}
      />
      {/* 십자 마커 — 칸 코너 교차점(그리드 선 맞물림) 대각 2개 */}
      <svg aria-hidden className="pointer-events-none absolute" style={{ left: -16, top: -16 }} width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 1v30M1 16h30" stroke="#a3a3a3" strokeWidth="1.5" />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute" style={{ right: -16, bottom: -16 }} width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 1v30M1 16h30" stroke="#a3a3a3" strokeWidth="1.5" />
      </svg>
      {/* 상단 경계 위 잘린 다크 요소(Clone05 최상단 바) */}
      <span aria-hidden className="pointer-events-none absolute top-0 h-[2px] w-[150px] bg-[#171717]" style={{ right: '12.5%' }} />
      <p className="relative px-8 text-left text-[clamp(23px,2.8vw,33px)] leading-[1.35] tracking-[-0.035em]">
        <span className="font-medium text-[#6b7280]">서비스 이용이 종료되어도</span><br />
        <span className="font-bold text-text-primary">발행한 콘텐츠와 광고 계정은<br />고객님의 것으로 남습니다</span>
      </p>
    </div>
  );

  const renderD = (key: string) =>
    key === 'head' ? headBlock : key === 'cell0' ? cellBlock(0) : key === 'cell1' ? cellBlock(1) : conclusionBlock;

  return (
    <section className="relative bg-bg">
      {/* 모바일 — 풀폭 세로 스택 */}
      {/* 모바일 리듬 표준(사장님 2026-07-15 "따닥따닥 조잡" — 여백도 디자인) */}
      <div className="bg-[#fafafa] md:hidden">
        {/* 안 A 타임라인 이음선(2026-07-16 사장님 확정, /lab/assets에서 이식). 결론 배너는 아래 그대로 */}
        <div className="px-6 pb-6 pt-20"><MobileAssetTimeline /></div>
        {/* 결론 = PC 배너 문법 이식(도트+투톤+잘린 다크 바 — 실기기 "맨 텍스트라 깨져 보임" 반려 2026-07-15). 카피 토씨·줄바꿈 정본 그대로 */}
        <div className="relative px-6 py-16 text-center">
          <span aria-hidden className="pointer-events-none absolute top-0 h-[2px] w-[110px] bg-[#171717]" style={{ right: '12.5%' }} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              WebkitMaskImage: 'radial-gradient(ellipse 84% 90% at 50% 50%, #000 40%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 84% 90% at 50% 50%, #000 40%, transparent 100%)',
            }}
          />
          <p className="relative inline-block text-left text-[clamp(20px,5.4vw,25px)] leading-[1.5] tracking-[-0.03em]">
            <span className="font-medium text-[#6b7280]">서비스 이용이 종료되어도</span><br />
            <span className="font-bold text-text-primary">발행한 콘텐츠와 광고 계정은<br />고객님의 것으로 남습니다</span>
          </p>
        </div>
      </div>

      {/* PC — 칸: head 풀폭 / 자산 셀 2열 / 결론 풀폭 */}
      <OccupancyGrid cols={12} rows={11} areas={D_AREAS} mobile={false} render={renderD} />
    </section>
  );
}
