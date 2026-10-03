'use client';

/* /lab/hero — /content 히어로 "그래픽 아트" 거친 시안 4안 (사장님 검수, 2026-07-16)
   의도: "지금 이 순간에도 무진장 많은 검색이 일어나고 있다"를 주인공급 그래픽 아트로.
   메인 문구("누구나 검색 결과에 내 스토어가 보이길")와 한 몸. ⛔엑셀식 그리드 칸 나열 폐기.
   재료 = 소스 갤러리(§8.13 2종): Particles·AnimatedBeam·Typewriter·Marquee 조합·변형.
   거친 시안(§8.7-0) — 당선안만 §8.16 좌표계로 정밀 승격. */

import { useEffect, useRef, useState, forwardRef } from 'react';
import { Particles } from '@/components/lab-sources/magicui/particles';
import { AnimatedBeam } from '@/components/lab-sources/magicui/animated-beam';
import { Marquee } from '@/components/lab-sources/magicui/marquee';
import { cn } from '@/lib/utils';

const EN = { fontFamily: 'var(--font-en)' } as const;

/* ── 공통: 메인 문구 ── */
function HeroCopy({ dark = false }: { dark?: boolean }) {
  return (
    <div className="relative z-20 text-center px-6">
      <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0070f3]" style={EN}>누구나 콘텐츠</p>
      <h1 className={`mb-5 text-[clamp(28px,3.8vw,46px)] font-semibold leading-[1.12] tracking-[-0.03em] ${dark ? 'text-white' : 'text-[#171717]'}`}>
        누구나 검색 결과에<br /><span className="text-[#0070f3]">내 스토어가</span> 바로 보이길 원합니다
      </h1>
      <p className={`mx-auto mb-7 max-w-[430px] text-[16px] leading-[1.5] font-medium ${dark ? 'text-white/55' : 'text-[#666]'}`}>
        광고는 멈추면 사라지지만 꾸준히 쌓은 글은 검색에 남아 스토어를 계속 보이게 합니다
      </p>
      <span className={`inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold ${dark ? 'bg-white text-[#0a0a0a]' : 'bg-[#171717] text-white'}`}>
        1개월 무료로 시작
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M6 4l4 4-4 4" /></svg>
      </span>
    </div>
  );
}

const QUERIES = [
  '공릉동 맛집', '성수동 카페', '강남 필라테스', '종로 미용실', '연남동 브런치', '부평 피부과',
  '잠실 영어학원', '망원 소품샵', '홍대 타투', '서면 국밥', '수원 헬스장', '일산 네일',
  '판교 코딩학원', '제주 흑돼지', '대구 곱창', '부천 정형외과', '청주 미용실', '광주 감성카페',
];

/* ═══ A · 별처럼 점멸 — 검색어들이 공간 곳곳에서 떠올랐다 사라짐 (Particles + 타이포 농담) ═══ */
/* 좌표 고정(랜덤 금지 = hydration 안전). 크기·농담·딜레이 제각각 = "수많음"의 온도 */
const STARS: { q: string; x: number; y: number; s: number; o: number; d: number }[] = [
  { q: '공릉동 맛집', x: 8, y: 18, s: 15, o: 0.5, d: 0 },
  { q: '성수동 카페', x: 78, y: 12, s: 20, o: 0.75, d: 1.2 },
  { q: '강남 필라테스', x: 22, y: 66, s: 13, o: 0.35, d: 2.4 },
  { q: '종로 미용실', x: 66, y: 76, s: 17, o: 0.6, d: 0.7 },
  { q: '연남동 브런치', x: 42, y: 8, s: 13, o: 0.4, d: 3.1 },
  { q: '부평 피부과', x: 90, y: 45, s: 14, o: 0.45, d: 1.8 },
  { q: '잠실 영어학원', x: 5, y: 42, s: 12, o: 0.3, d: 2.0 },
  { q: '망원 소품샵', x: 58, y: 30, s: 15, o: 0.5, d: 4.0 },
  { q: '홍대 타투', x: 14, y: 86, s: 16, o: 0.55, d: 0.4 },
  { q: '서면 국밥', x: 84, y: 88, s: 13, o: 0.4, d: 2.8 },
  { q: '수원 헬스장', x: 34, y: 90, s: 12, o: 0.3, d: 1.5 },
  { q: '판교 코딩학원', x: 70, y: 58, s: 14, o: 0.45, d: 3.6 },
  { q: '제주 흑돼지', x: 28, y: 34, s: 12, o: 0.35, d: 4.4 },
  { q: '일산 네일', x: 50, y: 82, s: 14, o: 0.45, d: 5.0 },
];
function SceneA() {
  return (
    <div className="relative overflow-hidden bg-white py-28">
      <Particles className="absolute inset-0" quantity={70} color="#171717" size={0.35} staticity={60} ease={60} />
      {/* 검색어 별 — 각자 위상 다른 페이드 인아웃 */}
      <div className="absolute inset-0" aria-hidden>
        {STARS.map((st) => (
          <span
            key={st.q}
            className="absolute whitespace-nowrap font-medium text-[#171717] will-change-[opacity]"
            style={{
              left: `${st.x}%`, top: `${st.y}%`, fontSize: st.s,
              animation: `starFade 7s ease-in-out ${st.d}s infinite`,
              ['--peak' as string]: st.o,
            }}
          >
            <svg className="mr-1.5 inline-block -mt-0.5" width={st.s * 0.72} height={st.s * 0.72} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" aria-hidden><circle cx="7" cy="7" r="4.3" /><path d="M10.4 10.4 14 14" /></svg>
            {st.q}
          </span>
        ))}
      </div>
      <HeroCopy />
      <style>{`@keyframes starFade { 0%,100% { opacity: 0 } 45%,60% { opacity: var(--peak) } }`}</style>
    </div>
  );
}

/* ═══ B · 사방에서 한 점으로 수렴 — 검색어들이 빛줄기로 중앙 검색점에 흘러듦 (AnimatedBeam) ═══ */
const BNode = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(({ children, className }, ref) => (
  <div ref={ref} className={cn('z-10 whitespace-nowrap bg-white px-3.5 py-2 text-[13px] font-medium text-[#333] border border-[#ececec]', className)}>
    {children}
  </div>
));
BNode.displayName = 'BNode';

function SceneB() {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const n = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  return (
    <div className="relative overflow-hidden bg-white py-24">
      <HeroCopy />
      {/* 수렴 장면 */}
      <div ref={box} className="relative mx-auto mt-14 h-[340px] w-full max-w-[880px]">
        {/* 주변 검색어 노드 (좌3 우3) */}
        <div className="absolute left-4 top-4"><BNode ref={n[0]}>공릉동 맛집</BNode></div>
        <div className="absolute left-10 top-[150px]"><BNode ref={n[1]}>성수동 카페</BNode></div>
        <div className="absolute left-2 bottom-6"><BNode ref={n[2]}>강남 필라테스</BNode></div>
        <div className="absolute right-6 top-6"><BNode ref={n[3]}>종로 미용실</BNode></div>
        <div className="absolute right-2 top-[160px]"><BNode ref={n[4]}>연남동 브런치</BNode></div>
        <div className="absolute right-10 bottom-4"><BNode ref={n[5]}>부평 피부과</BNode></div>
        {/* 중앙 = 검색 한 점 (잉크 원 + 돋보기) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div ref={hub} className="rounded-dot flex h-20 w-20 items-center justify-center bg-[#171717]">
            <svg width="30" height="30" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" aria-hidden><circle cx="7" cy="7" r="4.3" /><path d="M10.4 10.4 14 14" /></svg>
          </div>
        </div>
        {n.map((r, i) => (
          <AnimatedBeam key={i} containerRef={box} fromRef={r} toRef={hub} curvature={[-40, 0, 40, -40, 0, 40][i]} duration={4 + i * 0.6} delay={i * 0.5} pathColor="#ececec" pathOpacity={1} pathWidth={1.2} gradientStartColor="#0070f3" gradientStopColor="#4d9fff" />
        ))}
      </div>
    </div>
  );
}

/* ═══ C · 라이브 타이핑 — 큰 검색창에 검색어가 실시간으로 입력됐다 지워짐 + 뒤 흐릿한 군중 ═══ */
function useTyping(words: string[]) {
  const [txt, setTxt] = useState('');
  useEffect(() => {
    let w = 0, ch = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w];
      if (!del) {
        ch += 1; setTxt(word.slice(0, ch));
        if (ch === word.length) { del = true; t = setTimeout(tick, 1400); return; }
        t = setTimeout(tick, 95);
      } else {
        ch -= 1; setTxt(word.slice(0, ch));
        if (ch === 0) { del = false; w = (w + 1) % words.length; t = setTimeout(tick, 350); return; }
        t = setTimeout(tick, 45);
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [words]);
  return txt;
}
function SceneC() {
  const txt = useTyping(['공릉동 맛집', '성수동 카페', '부평 피부과', '잠실 영어학원', '홍대 타투']);
  return (
    <div className="relative overflow-hidden bg-white py-28">
      {/* 뒤 흐릿한 검색 군중(고정 좌표·저농도) */}
      <div className="absolute inset-0 select-none" aria-hidden>
        {STARS.slice(0, 10).map((st) => (
          <span key={st.q} className="absolute whitespace-nowrap font-medium text-[#171717]" style={{ left: `${st.x}%`, top: `${st.y}%`, fontSize: st.s - 1, opacity: 0.10 }}>{st.q}</span>
        ))}
      </div>
      <HeroCopy />
      {/* 주인공: 큰 검색창 + 라이브 타이핑 */}
      <div className="relative z-20 mx-auto mt-12 flex h-[72px] w-full max-w-[560px] items-center gap-4 border-[1.5px] border-[#171717] bg-white px-6">
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.6" strokeLinecap="round" aria-hidden><circle cx="7" cy="7" r="4.3" /><path d="M10.4 10.4 14 14" /></svg>
        <span className="flex-1 text-left text-[20px] font-medium text-[#171717]">
          {txt}
          <span className="ml-0.5 inline-block h-[24px] w-[2px] translate-y-[4px] animate-pulse bg-[#0070f3]" />
        </span>
        <span className="hidden sm:inline-flex items-center bg-[#0070f3] px-5 py-2.5 text-[14px] font-semibold text-white">검색</span>
      </div>
      <p className="relative z-20 mt-5 text-center text-[13px] text-[#999]" style={EN}>지금 이 순간에도, 누군가 검색하고 있습니다</p>
    </div>
  );
}

/* ═══ D · 깊이감 타이포 스트림 — pill·칸 없이 순수 타이포가 층별 크기·농담·속도로 흐름 ═══ */
const LAYERS: { qs: string[]; size: number; o: number; dur: string; rev: boolean }[] = [
  { qs: QUERIES.slice(0, 6), size: 40, o: 0.14, dur: '[--duration:70s]', rev: false },
  { qs: QUERIES.slice(6, 12), size: 24, o: 0.32, dur: '[--duration:46s]', rev: true },
  { qs: QUERIES.slice(12, 18), size: 17, o: 0.62, dur: '[--duration:34s]', rev: false },
];
function SceneD() {
  return (
    <div className="lab-sources-scope relative overflow-hidden bg-white py-24">
      <HeroCopy />
      <div className="relative mt-14 flex flex-col gap-5">
        {LAYERS.map((ly, i) => (
          <Marquee key={i} reverse={ly.rev} className={`${ly.dur} p-0 [--gap:3.5rem]`}>
            {ly.qs.map((q) => (
              <span key={q} className="whitespace-nowrap font-semibold tracking-[-0.02em] text-[#171717]" style={{ fontSize: ly.size, opacity: ly.o }}>
                {q}
              </span>
            ))}
          </Marquee>
        ))}
        {/* 가장 앞층: accent 하나만 또렷하게 = "그 검색에 내 스토어" 연결 */}
        <Marquee className="[--duration:40s] p-0 [--gap:4rem]">
          {['내 스토어가 여기 보입니다', '공릉동 맛집', '성수동 카페', '종로 미용실', '연남동 브런치'].map((q, i) => (
            <span key={q} className={`whitespace-nowrap text-[15px] font-semibold ${i === 0 ? 'text-[#0070f3]' : 'text-[#171717] opacity-45'}`}>
              {i === 0 && <svg className="mr-1.5 inline-block -mt-0.5" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden><circle cx="7" cy="7" r="4.3" /><path d="M10.4 10.4 14 14" /></svg>}
              {q}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

/* ═══ 페이지 ═══ */
const SCENES = [
  { id: 'A', name: '별처럼 점멸', note: '검색어들이 공간 곳곳에서 떠올랐다 사라짐 — 수많음의 온도(크기·농담 제각각)', C: SceneA },
  { id: 'B', name: '한 점으로 수렴', note: '흩어진 검색들이 빛줄기를 타고 중앙 검색점으로 — 그 끝에 내 스토어', C: SceneB },
  { id: 'C', name: '라이브 타이핑', note: '큰 검색창에 지금 입력되는 중 + 뒤로 흐릿한 검색 군중', C: SceneC },
  { id: 'D', name: '깊이감 타이포 스트림', note: 'pill·칸 없이 순수 타이포가 층별 크기·농담·속도로 흐름(맨 앞층에 accent 한 줄)', C: SceneD },
];

export default function HeroLab() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-screen bg-white" />;
  return (
    <main>
      <div className="border-b border-[#eaeaea] px-6 py-5">
        <p className="text-[13px] font-bold text-[#171717]" style={EN}>/lab/hero — "지금도 수많은 검색이 일어나고 있다" 그래픽 아트 시안 4안 (거친 시안 · 당선안만 §8.16 정밀 승격)</p>
      </div>
      {SCENES.map((s) => (
        <section key={s.id} className="border-b-8 border-[#f4f4f4]">
          <div className="px-6 py-4 text-[13px] text-[#666]" style={EN}>
            <b className="text-[#171717]">{s.id} · {s.name}</b> — {s.note}
          </div>
          <s.C />
        </section>
      ))}
    </main>
  );
}
