/* /lab/searchpill — 히어로 Marquee용 "검색창 UI 목업" 디자인 후보 (사장님 검수, 2026-07-16)
   조건: 너비 짧게 · 글자 작게 · 심플하고 예쁘게 · ⛔네이버 똑같이 재현 금지(§7-7, 돋보기+검색어로 추상화).
   히어로(라이트+그리드) 위를 다양한 검색어로 옆으로 무한히 흐를 한 칸의 디자인을 고르기 위한 시안. */

import { Marquee } from '@/components/lab-sources/magicui/marquee';

const EN = { fontFamily: 'var(--font-en)' } as const;

function Glass({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <circle cx="7" cy="7" r="4.3" />
      <path d="M10.4 10.4 14 14" />
    </svg>
  );
}

type PillProps = {
  q: string;
  round?: boolean;
  glass?: string;
  cursor?: boolean;
  button?: 'none' | 'gray' | 'accent';
  shadow?: boolean;
  leftGlass?: boolean;
};

function Pill({ q, round = true, glass = '#9aa0a6', cursor = false, button = 'none', shadow = true, leftGlass = true }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 bg-white border border-[#e7e7e7] ${leftGlass ? 'pl-3.5' : 'pl-4'} ${button === 'none' ? 'pr-3.5' : 'pr-1.5'} py-2 ${round ? 'rounded-full' : ''} ${shadow ? 'shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : ''}`}
    >
      {leftGlass && <Glass color={glass} />}
      <span className="whitespace-nowrap text-[13.5px] text-[#333]">{q}</span>
      {cursor && <span className="ml-0.5 inline-block h-[14px] w-[1.5px] animate-pulse bg-[#0070f3]" />}
      {button === 'gray' && (
        <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f1f1f1]">
          <Glass color="#8b8b8b" />
        </span>
      )}
      {button === 'accent' && (
        <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0070f3]">
          <Glass color="#ffffff" />
        </span>
      )}
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <p className="mb-4 text-[13px] font-semibold text-[#171717]" style={EN}>{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

const SETS = [
  ['공릉동 맛집', '성수동 카페', '강남 필라테스', '종로 미용실'],
  ['연남동 브런치', '부평 피부과', '잠실 영어학원', '망원 소품샵'],
  ['홍대 타투', '서면 국밥', '수원 헬스장', '일산 네일'],
];

const FLOW1 = ['공릉동 맛집', '성수동 카페', '강남 필라테스', '종로 미용실', '연남동 브런치', '부평 피부과', '잠실 영어학원'];
const FLOW2 = ['망원 소품샵', '홍대 타투', '서면 국밥', '수원 헬스장', '일산 네일', '판교 코딩학원', '제주 흑돼지'];

export default function SearchPillLab() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage:
          'linear-gradient(#f1f1f1 1px, transparent 1px), linear-gradient(90deg, #f1f1f1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="mx-auto max-w-[1040px] px-10 py-16 max-md:px-6">
        <h1 className="mb-2 text-[24px] font-semibold tracking-[-0.02em] text-[#171717]">검색창 UI 목업 후보</h1>
        <p className="mb-12 text-[14px] leading-relaxed text-[#666]">
          히어로(라이트 + 그리드) 위를 이 검색창이 다양한 검색어로 <b>옆으로 무한히 흐릅니다</b>(Marquee).
          <br />
          아래 후보 중 <b>가장 어울리는 스타일</b>을 골라주세요. 너비 짧게 · 글자 작게 · 네이버 추상화(똑같이 X).
        </p>

        {/* ★ 확정 검색창(직각·회색)으로 Marquee 흐름 — 히어로 미리보기 */}
        <section
          className="lab-sources-scope mb-14 overflow-hidden border border-[#e5e5e5] py-8"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(#f4f4f4 1px, transparent 1px), linear-gradient(90deg, #f4f4f4 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          <p className="mb-5 px-6 text-[13px] font-bold text-[#171717]" style={EN}>★ 확정: 직각·회색 검색창이 옆으로 흐르는 모습 (히어로 미리보기)</p>
          <Marquee className="[--duration:55s]" pauseOnHover>
            {FLOW1.map((q) => (
              <div key={q} className="mx-1.5"><Pill q={q} round={false} leftGlass={false} button="gray" /></div>
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="mt-3 [--duration:48s]">
            {FLOW2.map((q) => (
              <div key={q} className="mx-1.5"><Pill q={q} round={false} leftGlass={false} button="gray" /></div>
            ))}
          </Marquee>
        </section>

        {/* ★ 사장님 확정: F · 왼쪽 돋보기 제외 — 세부(라운드/직각 · 버튼색)만 선택 */}
        <section className="mb-14 border-2 border-[#0070f3] bg-[#f5f9ff] p-6">
          <p className="mb-5 text-[13px] font-bold text-[#0070f3]" style={EN}>★ 확정 방향: F · 왼쪽 돋보기 제외 (검색어 + 오른쪽 검색 버튼) — 세부만 골라주세요</p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-[12px] text-[#666]" style={EN}>라운드·회색</span>
              {['공릉동 맛집', '성수동 카페', '강남 필라테스'].map((q) => <Pill key={q} q={q} leftGlass={false} button="gray" />)}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-[12px] text-[#666]" style={EN}>라운드·accent</span>
              {['종로 미용실', '연남동 브런치', '부평 피부과'].map((q) => <Pill key={q} q={q} leftGlass={false} button="accent" />)}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-[12px] text-[#666]" style={EN}>직각·회색</span>
              {['잠실 영어학원', '망원 소품샵', '홍대 타투'].map((q) => <Pill key={q} q={q} round={false} leftGlass={false} button="gray" />)}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-[12px] text-[#666]" style={EN}>직각·accent</span>
              {['서면 국밥', '수원 헬스장', '일산 네일'].map((q) => <Pill key={q} q={q} round={false} leftGlass={false} button="accent" />)}
            </div>
          </div>
        </section>

        <Row label="A · 미니멀 흰 pill (라운드 · 회색 돋보기)">
          {SETS[0].map((q) => <Pill key={q} q={q} />)}
        </Row>

        <Row label="B · 직각 카드 (우리 톤 §7-1 직각)">
          {SETS[1].map((q) => <Pill key={q} q={q} round={false} />)}
        </Row>

        <Row label="C · accent 블루 돋보기 (라운드)">
          {SETS[2].map((q) => <Pill key={q} q={q} glass="#0070f3" />)}
        </Row>

        <Row label="D · 그린 포인트 돋보기 (네이버 연상·추상, 라운드)">
          {SETS[0].map((q) => <Pill key={q} q={q} glass="#03c75a" />)}
        </Row>

        <Row label="E · 커서 깜빡임 (입력 중 느낌 · 라운드)">
          {SETS[1].map((q) => <Pill key={q} q={q} cursor />)}
        </Row>

        <Row label="F · 검색 버튼 있음 (회색 / accent)">
          <Pill q="공릉동 맛집" button="gray" />
          <Pill q="성수동 카페" button="accent" />
          <Pill q="종로 미용실" round={false} button="gray" />
          <Pill q="강남 필라테스" round={false} button="accent" />
        </Row>

        <Row label="G · 직각 + 커서 (우리 톤 + 입력 중)">
          {SETS[2].map((q) => <Pill key={q} q={q} round={false} cursor />)}
        </Row>
      </div>
    </main>
  );
}
