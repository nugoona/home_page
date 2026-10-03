'use client';

import { useEffect, useRef, useState } from 'react';
import S41SearchScene from '@/components/home/s4/S41SearchScene';

/**
 * 모바일 제품 캐러셀 카드 시안 비교(2026-07-15) — 사장님 "목업 페이지 만들어서 시안 보여줘".
 * 목업 크기 편차(폰·문서·검색)를 어떤 카드 형태로 담을지 3방향을 실기기에서 비교.
 *   A 폰(기기) 프레임 / B 다크 카드 / C 풀블리드(scale cover)
 * ⛔ 홈 본체 미변경 — 여기서 확정 후 TwoAppsRail에 이식.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const STEPS = [
  { n: '01', label: '사진 4장만 올리면' },
  { n: '02', label: '글이 자동으로 완성되고' },
  { n: '03', label: '검색에서 찾아져요' },
];

/* scale FIT(전체 보이게) / COVER(꽉 채우고 넘침 crop) 공용 훅 */
function useMockScale(mode: 'fit' | 'cover' | 'width') {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      el.querySelectorAll<HTMLElement>('[data-mockarea]').forEach((area) => {
        const mock = area.querySelector<HTMLElement>('[data-mock]');
        if (!mock) return;
        mock.style.transform = 'scale(1)';
        const sw = area.clientWidth / mock.offsetWidth;
        const sh = area.clientHeight / mock.offsetHeight;
        const s = mode === 'fit' ? Math.min(sw, sh) : mode === 'cover' ? Math.max(sw, sh) : sw;
        mock.style.transform = `scale(${s})`;
      });
    };
    run();
    const t = window.setTimeout(run, 300);
    window.addEventListener('resize', run);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', run); };
  }, [mode]);
  return ref;
}

function DotBar({ active, dot }: { active: number; dot: string }) {
  return (
    <div className="mt-5 flex items-center gap-2" aria-hidden>
      {STEPS.map((s, i) => (
        <span key={s.n} className="h-[6px] rounded-full transition-all duration-300" style={{ width: active === i ? 26 : 6, background: active === i ? dot : '#cfd2d6' }} />
      ))}
      <span className="ml-auto text-[12px] font-bold tracking-[0.06em] text-[#8a8f96]" style={{ fontFamily: 'var(--font-en)' }}>
        {String(active + 1).padStart(2, '0')}<span className="mx-0.5 text-[#c4c8cd]">/</span>03
      </span>
    </div>
  );
}

/* ── A. 폰(기기) 프레임 — 목업을 세로 기기 화면 안에 FIT. 기기 크기 통일 = 붕 뜸 없음 ── */
function CarouselA() {
  const [active, setActive] = useState(0);
  const scRef = useMockScale('fit');
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 14;
    setActive(Math.max(0, Math.min(2, Math.round(el.scrollLeft / step))));
  };
  return (
    <div ref={scRef}>
      <div onScroll={onScroll} className="-mx-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map((s, i) => (
          <div key={s.n} className="shrink-0 basis-[74%] snap-start">
            {/* 기기 베젤 — 다크 프레임 + 노치 느낌 상단 바 */}
            <div className="overflow-hidden rounded-[30px] bg-[#111317] p-2.5" style={{ boxShadow: '0 10px 30px rgba(15,23,42,0.18)' }}>
              <div className="relative flex h-[13px] items-center justify-center">
                <span className="h-[4px] w-[46px] rounded-full bg-[#2c2f36]" />
              </div>
              <div className="overflow-hidden rounded-[22px] bg-white">
                {/* 앱 상단 바(스텝 라벨) */}
                <div className="flex items-center gap-2 border-b border-[#F1F1F1] px-3.5 py-2.5">
                  <span className="flex h-[22px] items-center bg-[#171717] px-2 text-[11px] font-bold text-white" style={{ fontFamily: 'var(--font-en)' }}>{s.n}</span>
                  <span className="text-[13.5px] font-bold tracking-[-0.02em] text-text-primary" style={KR}>{s.label}</span>
                </div>
                <div data-mockarea className="relative h-[380px] overflow-hidden px-3 py-3">
                  <div data-mock className="absolute left-1/2 top-3 -translate-x-1/2" style={{ transformOrigin: 'top center' }}>
                    <S41SearchScene part={(i + 1) as 1 | 2 | 3} hideHead />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DotBar active={active} dot="#0070f3" />
    </div>
  );
}

/* ── B. 다크 카드 — 어두운 카드 위 흰 목업 대비. 여백도 다크라 붕 뜸이 티 안 남 ── */
function CarouselB() {
  const [active, setActive] = useState(0);
  const scRef = useMockScale('fit');
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 14;
    setActive(Math.max(0, Math.min(2, Math.round(el.scrollLeft / step))));
  };
  return (
    <div ref={scRef}>
      <div onScroll={onScroll} className="-mx-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map((s, i) => (
          <div key={s.n} className="shrink-0 basis-[82%] snap-start">
            <div className="flex h-[400px] flex-col overflow-hidden rounded-[20px]" style={{ background: '#0d1017', boxShadow: '0 12px 28px rgba(15,23,42,0.16)' }}>
              <div className="flex items-center gap-2.5 px-4 py-3.5">
                <span className="flex h-[24px] items-center bg-white px-2.5 text-[12px] font-bold leading-none text-[#0d1017]" style={{ fontFamily: 'var(--font-en)' }}>{s.n}</span>
                <span className="text-[15px] font-bold tracking-[-0.02em] text-white" style={KR}>{s.label}</span>
              </div>
              <div data-mockarea className="relative min-h-0 flex-1 overflow-hidden px-4 pb-4">
                <div data-mock className="absolute left-1/2 top-0 -translate-x-1/2" style={{ transformOrigin: 'top center' }}>
                  <S41SearchScene part={(i + 1) as 1 | 2 | 3} hideHead />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DotBar active={active} dot="#4d9fff" />
    </div>
  );
}

/* ── C. 풀블리드 — 목업이 카드를 꽉 채움(COVER, 넘침 crop) + 스텝 라벨 상단 오버레이 ── */
function CarouselC() {
  const [active, setActive] = useState(0);
  const scRef = useMockScale('cover');
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 14;
    setActive(Math.max(0, Math.min(2, Math.round(el.scrollLeft / step))));
  };
  return (
    <div ref={scRef}>
      <div onScroll={onScroll} className="-mx-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map((s, i) => (
          <div key={s.n} className="shrink-0 basis-[82%] snap-start">
            <div className="relative h-[400px] overflow-hidden rounded-[20px] border border-[#E2E4E8] bg-white" style={{ boxShadow: '0 12px 28px rgba(15,23,42,0.1)' }}>
              <div data-mockarea className="absolute inset-0 overflow-hidden">
                <div data-mock className="absolute left-1/2 top-0 -translate-x-1/2" style={{ transformOrigin: 'top center' }}>
                  <S41SearchScene part={(i + 1) as 1 | 2 | 3} hideHead />
                </div>
              </div>
              {/* 상단 라벨 오버레이 */}
              <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 px-4 py-3" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))' }}>
                <span className="flex h-[22px] items-center bg-[#171717] px-2 text-[11px] font-bold text-white" style={{ fontFamily: 'var(--font-en)' }}>{s.n}</span>
                <span className="text-[14px] font-bold tracking-[-0.02em] text-text-primary" style={KR}>{s.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DotBar active={active} dot="#0070f3" />
    </div>
  );
}

/* ── D. 애플식 — 세로 긴 다크 카드, 상단 텍스트 + 하단 목업 폭 꽉(위 여백=다크 흡수, 아래=자연 크롭) ── */
function CarouselD() {
  const [active, setActive] = useState(0);
  const scRef = useMockScale('width');
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 14;
    setActive(Math.max(0, Math.min(2, Math.round(el.scrollLeft / step))));
  };
  /* 제품 성격 반영 배경(애플은 제품별 다크/라이트) — 여기선 단계별 딥톤 통일 */
  return (
    <div ref={scRef}>
      <div onScroll={onScroll} className="-mx-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map((s, i) => (
          <div key={s.n} className="shrink-0 basis-[80%] snap-start">
            <div className="relative h-[540px] overflow-hidden rounded-[28px]" style={{ background: '#0c0e12', boxShadow: '0 16px 36px rgba(15,23,42,0.2)' }}>
              {/* 상단 텍스트(애플 = 제목+부제 위, 비주얼 아래) */}
              <div className="absolute inset-x-0 top-0 z-10 px-6 pt-7">
                <span className="text-[12px] font-bold tracking-[0.14em] text-white/40" style={{ fontFamily: 'var(--font-en)' }}>STEP {s.n}</span>
                <h3 className="mt-2 text-[23px] font-bold leading-[1.25] tracking-[-0.02em] text-white" style={KR}>{s.label}</h3>
              </div>
              {/* 하단 목업 — 폭 꽉, 상단은 텍스트 아래에서 시작, 아래는 카드 경계 자연 크롭 */}
              <div data-mockarea className="absolute inset-x-0 bottom-0 top-[112px] overflow-hidden">
                <div data-mock className="absolute left-1/2 top-5 -translate-x-1/2" style={{ transformOrigin: 'top center' }}>
                  <S41SearchScene part={(i + 1) as 1 | 2 | 3} hideHead />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DotBar active={active} dot="#4d9fff" />
    </div>
  );
}

function Row({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-neutral-200 px-6 py-14">
      <div className="mb-1 text-[13px] font-bold tracking-[0.08em] text-neutral-400" style={{ fontFamily: 'var(--font-en)' }}>{title}</div>
      <p className="mb-7 text-[14px] text-neutral-500" style={KR}>{note}</p>
      {children}
    </section>
  );
}

export default function CarouselLab() {
  return (
    <main className="mx-auto min-h-screen max-w-[440px] bg-white pb-24">
      <div className="px-6 pb-4 pt-10">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-text-primary" style={KR}>캐러셀 카드 시안 3안</h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-neutral-500" style={KR}>
          목업 크기가 제각각이라 흰 박스로는 여백이 생깁니다. 세 방향을 폰에서 스와이프해 비교해 보세요.
        </p>
      </div>
      <Row title="D · APPLE STYLE ★" note="세로 긴 다크 카드 — 상단 텍스트 + 하단 목업 폭 꽉. 위 여백은 다크가 흡수, 아래는 애플처럼 자연 크롭(붕 뜸·잘린 티 없음)">
        <CarouselD />
      </Row>
      <Row title="A · DEVICE FRAME" note="목업을 기기(폰) 화면 안에 넣어 크기를 통일 — 붕 뜸 없음, 앱 소개 느낌">
        <CarouselA />
      </Row>
      <Row title="B · DARK CARD" note="어두운 카드 위 흰 목업 대비 — 여백도 다크라 붕 뜸이 눈에 안 띔">
        <CarouselB />
      </Row>
      <Row title="C · FULL-BLEED" note="목업이 카드를 꽉 채움(넘치면 크롭) + 라벨은 상단 오버레이 — 인스타식">
        <CarouselC />
      </Row>
    </main>
  );
}
