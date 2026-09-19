'use client';

/* /content S1 히어로 — "지금도 수많은 검색이 일어나고 있다" 검색창월(wall) (사장님 확정 2026-07-16)
   좌표계 = OccupancyGrid(§8.16): 텍스트 칸 + 월 칸(그리드 전폭 아님 — 10칸×3행만 점유, 좌우 1칸 checker 여백).
   월 = 직각·회색 검색창 pill(확정 F형: 왼쪽 돋보기 없음·오른쪽 회색 원 버튼)이 빈틈없이 딱 붙은 벽.
   흰 타일 + 1px #ececec 줄눈. 6줄(칸 안 자유 면 — 행당 2줄 밀도). 방향 홀짝 교차, 무한 seamless.
   ⛔ "내 가게가 여기 보입니다" 류 광고 문구 금지 — 검색 키워드만(사장님 교정). */

import { Marquee } from '@/components/lab-sources/magicui/marquee';
import FadeUp from '@/components/motion/FadeUp';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { contentPreviewCopy } from '@/lib/content/content';

const EN = { fontFamily: 'var(--font-en)' } as const;

function SearchGlass() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <circle cx="7" cy="7" r="4.3" /><path d="M10.4 10.4 14 14" />
    </svg>
  );
}
/* 검색창 pill(확정 F형) — 다크 톤온톤 타일(사장님 2026-07-16 "월 다크로" = Linear 문법):
   타일 #161616(배경 #0a0a0a보다 살짝 밝게) + 글자 white/85(또렷) + 버튼 white/7.
   accent = 드문드문 돋보기만 파랗게(#4d9fff) — 죽지 않게 하는 포인트 1계열.
   (검색 실행 펄스는 사장님 반려로 제거) */
function SearchPill({ q, small = false, accent = false }: { q: string; small?: boolean; accent?: boolean }) {
  return (
    <span className={`inline-flex h-full items-center bg-[#161616] ${small ? 'gap-1.5 pl-3 pr-1' : 'gap-2 pl-4 pr-1.5'}`}>
      <span className={`whitespace-nowrap text-white/85 ${small ? 'text-[11px]' : 'text-[12px]'}`}>{q}</span>
      <span className={`inline-flex items-center justify-center rounded-full bg-white/[0.07] ${accent ? 'text-[#4d9fff]' : 'text-white/55'} ${small ? 'h-5 w-5' : 'h-5.5 w-5.5'}`}>
        <SearchGlass />
      </span>
    </span>
  );
}

/* 6줄 — 줄마다 검색어 세트 다르게(세로 어긋남 = 벽돌 무늬) + 방향 홀짝 교차.
   줄당 8개 이상 = 사본 폭 > 컨테이너 폭 → 루프 경계 덜컥임 방지(seamless) */
const WALL: string[][] = [
  ['공릉동 맛집', '성수동 카페', '강남 필라테스', '종로 미용실', '연남동 브런치', '부평 피부과', '잠실 영어학원', '망원 소품샵'],
  ['홍대 타투', '서면 국밥', '수원 헬스장', '일산 네일', '판교 코딩학원', '제주 흑돼지', '대구 곱창', '부천 정형외과'],
  ['청주 미용실', '광주 감성카페', '천안 헬스장', '안양 보습학원', '인천 네일샵', '분당 브런치', '일산 피부과', '성남 국밥'],
  ['노원 필라테스', '강북 미용실', '마포 타투', '송파 디저트', '동탄 맛집', '평택 헬스장', '군산 횟집', '전주 한옥카페'],
  ['속초 대게', '춘천 닭갈비', '김포 필라테스', '광명 미용실', '구리 정형외과', '하남 브런치', '시흥 헬스장', '평촌 영어학원'],
  ['울산 곱창', '창원 국밥', '포항 물회', '여수 게장', '순천 카페', '목포 낙지', '경주 한정식', '진주 냉면'],
];
const DURS = ['[--duration:56s]', '[--duration:64s]', '[--duration:48s]', '[--duration:70s]', '[--duration:52s]', '[--duration:60s]'];

function Wall({ mobile = false }: { mobile?: boolean }) {
  const rows = mobile ? WALL.slice(0, 4) : WALL;
  return (
    /* 다크 톤온톤 월 = 다크 타일(#161616) + 옅은 흰 줄눈(rgba 0.08) — "어둠 속 검색어가 떠오르는 벽".
       gap 통일(--gap:1px)로 keyframe 이동량과 배치 일치 = seamless */
    <div aria-hidden="true" className="relative flex h-full w-full flex-col gap-px overflow-hidden border-x border-white/[0.08] bg-white/[0.08]">
      {rows.map((qs, i) => (
        <Marquee key={i} reverse={i % 2 === 1} className={`${DURS[i]} h-full min-h-0 flex-1 p-0 [--gap:1px] [&>div]:justify-start`}>
          {/* 2회전 = 사본 폭을 컨테이너의 ~1.8배로 → 루프 경계 덜컥임 방지(seamless).
              accent 돋보기 = 9칸당 1개 인덱스 분산(결정적 = hydration 안전) */}
          {[...qs, ...qs].map((q, idx) => (
            <SearchPill key={`${q}-${idx}`} q={q} small={mobile} accent={(i * 3 + idx) % 9 === 4} />
          ))}
        </Marquee>
      ))}
      {/* (라이트 시절 inset 파임 단차는 다크 전환으로 제거 — 어둠 vs 흰 타일 대비가 입체를 담당) */}
    </div>
  );
}

/* PC 12열 × 8행(셀 정사각, 하단 빈 행 없음 §8.16-C).
   텍스트 = c[3,11] r[2,6](중심축 line7 대칭) / 월 = 10칸×3행 c[2,12] r[6,9] — 전폭 아님, 좌우 1칸 checker(사장님 "그리드 다 쓰지 말고 10×3") */
const D_AREAS: GridArea[] = [
  { key: 'text', c: [3, 11], r: [2, 6], className: 'flex flex-col items-center justify-center text-center px-6' },
  { key: 'wall', c: [2, 12], r: [6, 9], className: 'relative' },
];
/* 모바일 6열 × 8행 — h1/sub/cta 각자 행 점유(§8.18-H 문법)하되 **폭은 우리 카피에 최적화**:
   홈 h1(한 줄·짧음)과 달리 /content h1은 길어 4칸(c[2,6])이면 3줄로 깨짐(사장님 반려 2026-07-16
   "홈 좌표를 그대로 따라하지 말고 모바일 최적화") → 풀폭 c[1,7] + 내부 px로 2줄 확보.
   월 풀폭 r[6,9]. 하단 빈 행 없음 */
/* 텍스트 = c[2,6] + 좌우 c1·c6 checker 세로줄(사장님 2026-07-16 "좌우 칸칸이 세로줄") — 홈 HeroB 모바일 문법.
   선 톤 = darkFaint(rgba 0.06, §8.18-H "Grid보다 텍스트 먼저")라 긴 h1이 칸을 살짝 넘어도 안 싸움 */
const M_AREAS: GridArea[] = [
  { key: 'm-head', c: [2, 6], r: [2, 4], className: 'flex flex-col items-center justify-center text-center' },
  { key: 'm-sub', c: [2, 6], r: [4, 5], className: 'flex items-center justify-center text-center' },
  { key: 'm-cta', c: [2, 6], r: [5, 6], className: 'flex items-center justify-center' },
  /* r[6,7] = 빈 checker 행 — CTA와 월 사이 여백(사장님 2026-07-17 "너무 붙어있어", §8.18-H 아래 여백 행 문법) */
  { key: 'wall-m', c: [1, 7], r: [7, 10], className: 'relative' },
];

/* (제품 배지 = 삭제 확정 — 사장님 2026-07-18 "헤드라인 위 로고+제품명 지워라", 콘텐츠·광고 양 히어로 공통.
   구 확정 2026-07-16 "로고 배지 표기"는 이 지시로 폐기) */
/* h1 — "바로" 제거(사장님 2026-07-16). 다크 히어로(사장님 2026-07-16 Linear 레퍼런스 — §8.17 다크=선언부 정본 회귀).
   accent = 다크 위 밝은 파랑 #4d9fff(홈 다크 히어로와 동일) */
const H1_HTML = <>누구나 검색 결과에<br /><span className="text-[#4d9fff]">내 가게가</span> 보이길 원합니다</>;
/* 줄바꿈 = 사장님 지정(2026-07-16): "…쌓은 글은 / 검색에 남아…" */
const SUB_HTML = <>광고는 멈추면 사라지지만 꾸준히 쌓은 글은<br />검색에 남아 가게를 계속 보이게 합니다</>;
/* 시안용 설명 — 개선안 §4.1 운영 흐름의 의미를 두 줄로 압축.
   【왜】구 설명은 광고와 비교하며 "검색에 남는다"까지만 말한다. §4.1이 "첫 화면은 검색 순위
   도구보다 **콘텐츠 운영 전체**를 보여준다"고 한 지점이다. 제목(열망)은 2026-07-17 확정 카피라
   손대지 않고, 설명 두 줄만 운영 흐름으로 바꿔 사장님이 나란히 비교하실 수 있게 했다.
   줄 수는 그대로 둘이다. */
const SUB_FLOW = <>{contentPreviewCopy.heroLines[0]}<br />{contentPreviewCopy.heroLines[1]}</>;
/* ⚠ §4.1 설명 후보 전체를 옮기지 않고, 글감→발행 흐름만 남긴다.
   둘 다 넣었더니 모바일에서 2줄(44자) → 4줄(69자), 높이가 두 배가 됐다(390·320px 실측).
   사장님 반복 지적이 "텍스트가 많아버리고 정보 전달이 안 된다"이므로 첫 화면에서 늘리지 않는다.
   뒤 문장("발행 후 검색 위치를 확인해 다음 콘텐츠에 반영")이 말하는 것은
   페이지 뒤쪽 검색 현황 구간이 **장면으로** 보여 준다 — 글로 두 번 말하지 않는다. */

function Cta({ mobile = false, link = false }: { mobile?: boolean; link?: boolean }) {
  /* 다크 히어로 CTA = 흰 배경 + 잉크 글자(홈 HeroB 문법). PC도 라운드(사장님 2026-07-20 "히어로 버튼 전부 라운드")
     ★2026-09-19 `link` — 이 버튼은 **눌리지 않는 글자**였다(span, 감싸는 링크 없음).
     §4.1 "첫 무료 시작 문구를 실제 /start 버튼으로 만든다"의 대상이 바로 여기다.
     ⚠ 카피 파일(lib/content/content.ts)에는 href가 적혀 있었지만 이 화면은 그 데이터를 쓰지 않는다 —
     파일만 보고 "연결됨"이라 판정하면 안 되는 자리다. 모양·크기·색은 그대로 두고 링크만 씌운다. */
  const cls = `rounded-pill inline-flex items-center gap-2 bg-white font-semibold text-[#0a0a0a] transition-colors hover:bg-[#eaeaea] ${mobile ? 'px-7 py-3 text-[14px]' : 'px-8 py-4 text-[15px]'}`;
  const inner = (
    <>
      1개월 무료로 시작
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M6 4l4 4-4 4" /></svg>
    </>
  );
  if (link) return <a href="/start" style={{ color: '#0a0a0a' }} className={`${cls} no-underline`}>{inner}</a>;
  return <span className={cls}>{inner}</span>;
}

function renderCell(key: string, sub: React.ReactNode = SUB_HTML, link = false) {
  switch (key) {
    case 'text': /* PC — 한 칸에 로고배지+h1+sub+cta (다크: 흰 타이포 + 회색 서브 = Linear 위계) */
      return (
        <FadeUp>
          {/* 미세 딥섀도(다크 위 검정 그림자 = 깊이, blur 작게 — 뿌염 금지 선) */}
          <h1 className="mb-5 text-[clamp(30px,4.4vw,52px)] font-semibold leading-[1.12] tracking-[-0.04em] text-white [text-shadow:0_1px_0_rgba(0,0,0,0.45),0_3px_8px_rgba(0,0,0,0.35)]">{H1_HTML}</h1>
          <p className="mx-auto mb-7 text-[16px] font-medium leading-[1.5] text-white/55">{sub}</p>
          <Cta link={link} />
        </FadeUp>
      );
    case 'm-head': /* 모바일 — 로고배지 + h1(24px·자간 -0.02em §8.18-H) */
      return (
        <FadeUp>
          <h1 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-white [text-shadow:0_1px_0_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.35)]">{H1_HTML}</h1>
        </FadeUp>
      );
    case 'm-sub':
      return <p className="text-[14px] font-medium leading-[1.5] text-white/55">{sub}</p>;
    case 'm-cta':
      return <Cta mobile link={link} />;
    default:
      return <Wall mobile={key === 'wall-m'} />;
  }
}

/* 십자(+) 마커 — 그리드 선이 맞물리는 교차점에만(§8.16-E, 섹션당 2~3개). 월 상단 좌우 모서리 2개 */
function Cross({ left, top }: { left: string; top: string }) {
  return (
    <svg
      className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{ left, top }}
      width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" aria-hidden
    >
      <path d="M5.5 0v11M0 5.5h11" />
    </svg>
  );
}

export default function ContentHero({ flow = false }: { flow?: boolean } = {}) {
  /* flow = 설명 두 줄을 §4.1 운영 흐름으로. 기본 false면 원본 /content 출력 그대로다. */
  const cell = (key: string) => renderCell(key, flow ? SUB_FLOW : SUB_HTML, flow);
  /* 다크 히어로(사장님 2026-07-16, Linear 레퍼런스) = §8.17 "다크=선언부" 정본 회귀.
     checker·선 = dark 톤(rgba 0.12), 배경 = 홈 다크 계열 #0a0a0a */
  return (
    <div className="lab-sources-scope relative bg-[#0a0a0a]">
      <OccupancyGrid cols={12} rows={8} areas={D_AREAS} tone="dark" checker mobile={false} render={cell} />
      <OccupancyGrid cols={6} rows={9} areas={M_AREAS} tone="darkFaint" checker mobile render={cell} />
      {/* 월 상단 모서리 교차점 = (line2, line6)·(line12, line6) — PC 12×8 기준 % */}
      <Cross left="8.3333%" top="62.5%" />
      <Cross left="91.6667%" top="62.5%" />
    </div>
  );
}
