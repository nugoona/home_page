'use client';

/**
 * S4Flow — /content 채널 구간 재설계 시안(2026-10-08, 직원 PC · 사장님 "너무 기계적, 와닿지 않는다").
 *
 * 메시지 하나: "맡긴 사진·영상이, 알아서 여러 채널 콘텐츠로 펼쳐진다."
 * 구 01→02→03 세 창 나열(같은 무게·번호·화살 = 설명서 인상)을 버리고 **한 무대에서 일어나는 변환**으로 바꾼다.
 *  - 시작: 올린 사진 3장 + 영상 1개 + 메모
 *  - 진행: 같은 사진이 복제되어 각 채널 카드 자리로 날아간다(공유 레이아웃 전환) · 영상은 쇼츠 틀로
 *  - 완성: 블로그·인스타·페이스북·쇼츠가 펼쳐진 상태로 고정(1회 재생 — 홈 MobileOrbit 선례)
 * 근거: DESIGN §8.7-I "자동화 = 과정이 눈앞에서 일어나는 시퀀스" · §8.7-A 화살 정본(PC 채운 삼각/모바일 V촉)
 *       · §8.7-H 랜딩 밀도(앱 UI 축소 금지) · 쇼츠는 사진이 아니라 영상에서 나온다(쇼츠 프로젝트 사실 — 사진만으로 쇼츠 = 미정)
 * 카피: 기존 확정 문구만(단계 제목 3개를 작은 라벨로, 단계 설명 3줄은 뺌 — 사장님 확인 대상)
 */

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useInView } from 'framer-motion';
import { VerticalVideoFrame } from './ContentSections';
import { multiChannel } from '@/lib/content/content';

type Phase = 'input' | 'picked' | 'output';

const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';
const EN = { fontFamily: 'var(--font-en)' } as const;
const FLY = { duration: 0.95, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };
const PHOTOS = ['/img/content/biz-pension-1.jpg', '/img/content/biz-pension-2.jpg', '/img/content/biz-pension-3.jpg'];

/** 날아가는 사진 — 같은 layoutId가 입력 칸 → 채널 카드로 옮겨 가며 위치·크기·비율이 이어진다 */
function FlyPhoto({ i, className = '', pos }: { i: number; className?: string; pos?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <motion.img layoutId={`s4f-p${i}`} transition={FLY} src={PHOTOS[i]} alt="" className={`block object-cover ${className}`} style={{ objectPosition: pos }} />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2.5 text-[14px] font-bold tracking-[-0.02em] text-text-primary">{children}</p>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`overflow-hidden bg-white ${className}`} style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>{children}</div>;
}

function ChannelTag({ icon, name }: { icon: React.ReactNode; name: string }) {
  return (
    <p className="mb-1.5 flex items-center gap-1.5">
      {icon}
      <span className="text-[11px] font-semibold text-text-weak">{name}</span>
    </p>
  );
}

const ICON = {
  blog: <span className="flex h-[14px] w-[14px] items-center justify-center bg-[#03c75a]"><svg width="8" height="8" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg></span>,
  insta: (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <defs><radialGradient id="s4f-ig" cx="0.27" cy="1.08" r="1.3"><stop offset="0" stopColor="#fdf497" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#285AEB" /></radialGradient></defs>
      <rect width="24" height="24" rx="5.4" fill="url(#s4f-ig)" />
      <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
    </svg>
  ),
  fb: <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#1877F2" /><path d="M15.6 12.9l.5-3h-2.9V8c0-.85.4-1.6 1.7-1.6h1.3V3.8s-1.2-.2-2.3-.2c-2.4 0-3.9 1.4-3.9 4v2.3H7.4v3H10v7h3.2v-7z" fill="#fff" /></svg>,
  shorts: <span className="flex h-[14px] w-[14px] items-center justify-center bg-[#171717]"><svg width="7" height="7" viewBox="0 0 24 24" fill="#fff"><path d="M9 6.5 18 12l-9 5.5z" /></svg></span>,
};

/** 채널 카드가 아직 비어 있을 때의 자리 — 같은 크기 유지(레이아웃 점프 방지) */
function Slot({ className = '' }: { className?: string }) {
  return <span className={`block bg-[#f4f4f5] ${className}`} />;
}

/** PC 가로 화살(§8.7-A 정본: 짧은 선 + 채운 삼각) / 모바일 세로 V촉 */
function Arrow() {
  return (
    <>
      <span className="hidden items-center justify-center md:flex md:self-center" aria-hidden>
        <svg width="44" height="14" viewBox="0 0 44 14" fill="none"><line x1="2" y1="7" x2="32" y2="7" stroke="#171717" strokeWidth="1.6" /><path d="M32 1.8L40 7l-8 5.2z" fill="#171717" /></svg>
      </span>
      <span className="flex justify-center py-3 md:hidden" aria-hidden>
        <svg width="14" height="32" viewBox="0 0 14 32" fill="none"><line x1="7" y1="1" x2="7" y2="30" stroke="#171717" strokeWidth="1.1" /><path d="M2 25l5 5 5-5" stroke="#171717" strokeWidth="1.1" /></svg>
      </span>
    </>
  );
}

/* ── 폰 사진첩 — 같은 페이지 S2 폰과 같은 프레임(phone-frame.png·화면 좌표) / 내용은 다르게(S2 = 앱 새 글, 여기 = 사진첩 고르기) ── */
const G_FRAME_W = 540;
const G_SCREEN = { left: 31.7, top: 12.35, width: 35.9, height: 74.7 }; // phone-frame.png 화면 영역(%) — S2와 동일
const G_VISIBLE_W = Math.round(G_FRAME_W * 0.386); // 보이는 폭 ≈ 208(베젤 포함)
const G_VISIBLE_H = 408; // 결과 카드 높이에 맞춰 폰 칸을 채운다(빈 여백 금지). 아래는 홀더 컷(§8.18-B)
const G_LEFT = -Math.round(G_FRAME_W * 0.304);
const G_TOP = -Math.round(G_FRAME_W * 0.1105);
/* 사진첩 15칸(폰 칸을 끝까지 채움): 고를 것 4개(사진 3 + 영상 1) + 펜션 사장님 사진첩에 있을 법한 사진.
   같은 사진 두 번 금지(눈에 바로 걸린다). pick = 선택 순번, fly = 날아갈 사진 번호 */
const GALLERY: { src?: string; pick?: number; fly?: number; video?: boolean }[] = [
  { src: '/img/content/biz-interior-1.jpg' },
  { src: PHOTOS[0], pick: 1, fly: 0 },
  { src: '/img/content/atlas-main.jpg' },
  { src: PHOTOS[1], pick: 2, fly: 1 },
  { video: true, pick: 4 },
  { src: '/img/content/biz-interior-2.jpg' },
  { src: '/img/content/hero-2.jpg' },
  { src: PHOTOS[2], pick: 3, fly: 2 },
  { src: '/img/content/biz-interior-3.jpg' },
  { src: '/img/content/atlas-space.jpg' },
  { src: '/img/content/biz-flower.jpg' },
  { src: '/img/content/biz-interior-4.jpg' },
  { src: '/img/content/hero-3.jpg' },
  { src: '/img/content/atlas-wide.jpg' },
  { src: '/img/content/atlas-video.jpg' },
];

function PhoneGallery({ phase }: { phase: Phase }) {
  const picked = phase !== 'input';
  const out = phase === 'output';
  return (
    <div className="relative mx-auto w-fit md:mx-0">
      <div className="relative overflow-hidden" style={{ width: G_VISIBLE_W, height: G_VISIBLE_H }}>
        <div style={{ position: 'relative', width: G_FRAME_W, left: G_LEFT, top: G_TOP, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.10))' }}>
          <div className="absolute z-[1] overflow-hidden bg-white" style={{ left: `${G_SCREEN.left}%`, top: `${G_SCREEN.top}%`, width: `${G_SCREEN.width}%`, height: `${G_SCREEN.height}%`, borderRadius: 16 }}>
            <div className="flex items-end justify-between px-3 pb-2 pt-8">
              <span className="text-[13px] font-bold text-text-primary">최근 항목</span>
              <motion.span initial={false} animate={{ opacity: picked ? 1 : 0 }} transition={{ delay: picked ? 0.9 : 0 }} className="text-[11px] font-bold text-[#0070f3]">4개 선택</motion.span>
            </div>
            <div className="grid grid-cols-3 gap-[2px]">
              {GALLERY.map((g, i) => (
                <span key={i} className="relative block aspect-square overflow-hidden bg-[#171717]">
                  {g.src && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={g.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  {g.video && (
                    <>
                      {!out && <motion.span layoutId="s4f-v" transition={FLY} className="absolute inset-0 block bg-[#171717]" />}
                      <span className="absolute inset-0 z-[1] flex items-center justify-center" aria-hidden><svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5 19 12 8 18.5z" /></svg></span>
                      <span className="absolute bottom-1 right-1.5 z-[1] text-[9px] font-semibold text-white" style={EN}>0:24</span>
                    </>
                  )}
                  {g.fly !== undefined && !out && <FlyPhoto i={g.fly} className="absolute inset-0 h-full w-full" />}
                  {/* 선택 표시 — 고른 칸 = 파란 테두리 + 번호 원(순서대로), 나머지 = 빈 원 */}
                  {g.pick ? (
                    <>
                      <motion.span initial={false} animate={{ opacity: picked ? 1 : 0 }} transition={{ delay: picked ? 0.22 * (g.pick - 1) : 0 }} className="absolute inset-0 z-[1] block" style={{ boxShadow: 'inset 0 0 0 2px #0070f3' }} />
                      <motion.span
                        initial={false}
                        animate={picked ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
                        transition={{ delay: picked ? 0.22 * (g.pick - 1) : 0, type: 'spring', stiffness: 420, damping: 22 }}
                        className="rounded-dot absolute right-1 top-1 z-[2] flex h-[17px] w-[17px] items-center justify-center bg-[#0070f3] text-[10px] font-bold text-white"
                        style={{ boxShadow: '0 0 0 1.5px #fff', ...EN }}
                      >
                        {g.pick}
                      </motion.span>
                    </>
                  ) : (
                    <span className="rounded-dot absolute right-1 top-1 z-[2] block h-[15px] w-[15px] border-[1.5px] border-white/90" />
                  )}
                </span>
              ))}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/shots/content/phone-frame.png" alt="" className="relative z-[2] block w-full" />
        </div>
      </div>
      {/* 잘린 단면 밀착 구획선 — S2 폰과 같은 문법 */}
      <span aria-hidden className="absolute inset-x-0 h-[3px]" style={{ top: G_VISIBLE_H - 3, background: 'radial-gradient(ellipse 52% 100% at 50% 100%, #8f8f8f 0%, rgba(143,143,143,0.35) 60%, transparent 100%)' }} />
      {/* 말 한마디 — 폰 밖 말풍선(손님이 폰에 대고 말하는 장면). 다 고른 뒤에 뜬다 */}
      <motion.p
        initial={false}
        animate={picked ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: picked ? 1.2 : 0, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[3] -mt-10 ml-8 flex w-max max-w-[240px] items-center gap-2 bg-white py-2 pl-2 pr-3 text-[12px] font-medium leading-[1.4] text-text-primary md:ml-12"
        style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}
      >
        <span className="rounded-dot flex h-6 w-6 shrink-0 items-center justify-center bg-[#0070f3]">
          <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.7" aria-hidden><rect x="8" y="3" width="4" height="9" rx="2" /><path d="M5 9v1a5 5 0 0 0 10 0V9M10 15v3" /></svg>
        </span>
        &ldquo;새로 단장한 객실로 소개글 써줘&rdquo;
      </motion.p>
    </div>
  );
}

export function S4Flow({ freeze }: { freeze?: Phase }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [phase, setPhase] = useState<Phase>(freeze ?? 'input');
  useEffect(() => {
    if (freeze || !inView) return;
    const t1 = setTimeout(() => setPhase('picked'), 300);
    const t2 = setTimeout(() => setPhase('output'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, freeze]);
  const out = phase === 'output';
  const s = multiChannel.steps;

  return (
    <LayoutGroup id="s4flow">
      <div ref={ref} className="relative mx-auto flex w-full max-w-[1040px] flex-col md:grid md:grid-cols-[232px_44px_104px_44px_1fr] md:items-start">
        {/* ── 올리세요: 내 폰 사진첩에서 고른다(사장님 "업로드했다는 느낌이 안 든다" → 손님이 매일 하는 동작으로) ── */}
        <div className="min-w-0">
          <Label>{s[0].title}</Label>
          <PhoneGallery phase={phase} />
        </div>

        <Arrow />

        {/* ── 글이 됩니다: 만드는 자리 = 누구나 콘텐츠 ── */}
        <div className="flex flex-row items-center justify-center gap-3 md:flex-col md:gap-2.5 md:self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/brand/content/symbol.svg" alt="누구나 콘텐츠" className="h-14 w-14 md:h-[84px] md:w-[84px]" />
          <p className="text-center text-[14px] font-bold tracking-[-0.02em] text-text-primary">{s[1].title}</p>
        </div>

        <Arrow />

        {/* ── 확인하고 발행: 네 채널로 펼쳐짐 ── */}
        <div className="min-w-0">
          <Label>{s[2].title}</Label>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[1.2fr_1fr_0.78fr] md:grid-rows-2 md:gap-3">
            {/* 블로그 — 주인공(네이버 블로그 운영 중심) */}
            <div className="col-span-2 flex flex-col md:col-span-1 md:row-span-2">
              <ChannelTag icon={ICON.blog} name="블로그" />
              <Card className="flex flex-1 flex-col">
                <span className="relative block aspect-[16/9] md:aspect-auto md:min-h-[140px] md:flex-1">
                  {out ? <FlyPhoto i={0} className="absolute inset-0 h-full w-full" /> : <Slot className="absolute inset-0" />}
                </span>
                <div className="px-3 pb-3 pt-2.5">
                  <motion.p initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.7 : 0, duration: 0.5 }} className="text-[13px] font-bold leading-[1.4] text-text-primary">
                    강릉 오션뷰 펜션, 객실을 새로 단장했습니다
                  </motion.p>
                  <motion.p initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.9 : 0, duration: 0.5 }} className="mt-1 text-[11px] leading-[1.5] text-text-body">
                    창을 열면 바다가 먼저 보입니다. 침구와 조명을 바꾸고 예약을 다시 열었어요.
                  </motion.p>
                </div>
              </Card>
            </div>
            {/* 인스타그램 */}
            <div className="flex flex-col md:col-start-2 md:row-start-1">
              <ChannelTag icon={ICON.insta} name="인스타그램" />
              <Card className="flex flex-1 flex-col">
                <span className="relative block aspect-square md:aspect-[4/3]">
                  {out ? <FlyPhoto i={1} className="absolute inset-0 h-full w-full" /> : <Slot className="absolute inset-0" />}
                </span>
                <motion.p initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.8 : 0 }} className="px-2.5 py-2 text-[11px] text-[#00376b]" style={EN}>#강릉펜션 #오션뷰</motion.p>
              </Card>
            </div>
            {/* 페이스북 */}
            <div className="flex flex-col md:col-start-2 md:row-start-2">
              <ChannelTag icon={ICON.fb} name="페이스북" />
              <Card className="flex flex-1 flex-col">
                <span className="relative block aspect-square md:aspect-auto md:min-h-[96px] md:flex-1">
                  {out ? <FlyPhoto i={2} className="absolute inset-0 h-full w-full" /> : <Slot className="absolute inset-0" />}
                </span>
                <motion.p initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.85 : 0 }} className="px-2.5 py-2 text-[11px] font-bold leading-[1.35] text-text-primary">새 단장한 객실, 예약을 열었습니다</motion.p>
              </Card>
            </div>
            {/* 쇼츠·릴스 — 올린 영상에서(사진이 아니라) */}
            <div className="col-span-2 flex flex-col md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1">
              <ChannelTag icon={ICON.shorts} name="쇼츠·릴스" />
              <Card className="flex flex-1 flex-row md:flex-col">
                {/* PC: 틀 칸이 남는 높이를 채운다(카드 아래 흰 공백 방지). 9:16 비율은 틀 자체가 지키고, 남는 위아래는 같은 잉크 */}
                <span className={`relative block w-[68px] shrink-0 md:flex md:w-full md:flex-1 md:items-center ${out ? 'md:bg-[#171717]' : 'md:bg-[#f4f4f5]'}`}>
                  <span className={`block w-full ${out ? 'invisible' : ''}`}><Slot className="aspect-[9/16] w-full" /></span>
                  {out && (
                    <motion.span layoutId="s4f-v" transition={FLY} className="absolute inset-0 flex items-center bg-[#171717]">
                      <VerticalVideoFrame className="w-full" label={false} />
                    </motion.span>
                  )}
                </span>
                <p className="flex flex-1 items-center px-3 py-2 text-[12px] font-medium text-text-primary md:flex-none">직접 확인 후 발행</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
