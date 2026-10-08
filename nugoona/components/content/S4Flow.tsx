'use client';

/**
 * S4Flow — /content 채널 구간 재설계 시안(2026-10-08, 직원 PC).
 *
 * 메시지 하나: "폰 사진첩에서 고른 사진·영상이, 알아서 채널마다 살아 움직이는 콘텐츠가 된다."
 *  - 시작: 폰 사진첩에서 오늘 미용한 아이들 사진 3장 + 영상 1개를 고른다(1~4 번호) → 말 한마디
 *  - 진행: 고른 사진이 복제되어 각 채널 카드로 날아간다(공유 레이아웃 전환) · 영상은 쇼츠 틀로
 *  - 완성 후에도 **채널답게 계속 산다**(사장님 2026-10-08 "무빙을 위한 무빙이 아니라 살아 움직이는 콘텐츠"):
 *      인스타 = 미용 후 ↔ 미용 전 사진이 넘어가고, 가끔 하트가 채워지며 좋아요가 조금씩 오른다
 *      블로그 = 글이 천천히 위로 흐르며 본문·사진이 이어진다(끊김 없는 반복)
 *      쇼츠 = 빈 세로 틀(영상은 사장님이 쇼츠 프로그램으로 만들어 넣는다)
 *      페이스북 = 정지(네 카드가 다 움직이면 시끄럽다 — 카드당 살아 있는 신호 1개 원칙 §8.7 8조-6)
 * 업종 = 애견미용(사장님 확정 2026-10-08, 여러 마리). 사진 = 코덱스 생성(현장 폰 사진 질감, 사람 얼굴·글자 없음).
 * ⚠ 짝퉁 실물 금지(§8.7-I): 인스타·블로그 화면을 픽셀 흉내 내지 않고 우리 카드 문법 안에서 움직임만 채널답게.
 * 카피: 섹션 제목·단계 제목은 기존 확정 문구. 목업 안 예시 글(가게 이야기)은 초안 — 사장님 확인 대상.
 */

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useInView } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import { VerticalVideoFrame } from './ContentSections';
import { multiChannel } from '@/lib/content/content';

type Phase = 'input' | 'picked' | 'output';

const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';
const EN = { fontFamily: 'var(--font-en)' } as const;
const FLY = { duration: 0.95, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };
const G = (n: string) => `/img/content/groom/${n}.jpg`;

/** 날아가는 사진 3장: 0 = 보리(블로그) · 1 = 콩이(인스타) · 2 = 두부(페이스북) */
const PHOTOS = [G('dog2-after'), G('dog1-after'), G('dog3-after')];

/** 날아가는 사진 — 같은 layoutId가 사진첩 칸 → 채널 카드로 옮겨 가며 위치·크기·비율이 이어진다 */
function FlyPhoto({ i, className = '' }: { i: number; className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <motion.img layoutId={`s4f-p${i}`} transition={FLY} src={PHOTOS[i]} alt="" className={`block object-cover ${className}`} />
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
/* 미용사 사진첩 15칸 — 오늘 미용한 아이들(전·중·후)과 가게. 같은 사진 두 번 금지.
   pick = 선택 순번, fly = 날아갈 사진 번호, video = 쇼츠로 갈 영상(썸네일 = 솜이 미용 중) */
const GALLERY: { src: string; pick?: number; fly?: number; video?: boolean }[] = [
  { src: G('dog1-before') },
  { src: G('dog1-after'), pick: 1, fly: 1 },
  { src: G('shop-props') },
  { src: G('dog2-before') },
  { src: G('dog4-during'), pick: 4, video: true },
  { src: G('dog2-during') },
  { src: G('dog2-after'), pick: 2, fly: 0 },
  { src: G('dog3-before') },
  { src: G('dog1-during') },
  { src: G('dog3-after'), pick: 3, fly: 2 },
  { src: G('dog4-before') },
  { src: G('shop-inside') },
  { src: G('dog3-during') },
  { src: G('dog4-after') },
  { src: G('shop-waiting') },
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  {g.video && (
                    <>
                      {!out && <motion.span layoutId="s4f-v" transition={FLY} className="absolute inset-0 block bg-[#171717]/0" />}
                      <span className="absolute inset-0 z-[1] flex items-center justify-center bg-black/25" aria-hidden><svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5 19 12 8 18.5z" /></svg></span>
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
      {/* 말 한마디 — 폰 밖 말풍선(미용사가 폰에 대고 말하는 장면). 다 고른 뒤에 뜬다 */}
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
        &ldquo;오늘 미용한 아이들로 글 써줘&rdquo;
      </motion.p>
    </div>
  );
}

/* ── 블로그: 글이 천천히 위로 흐른다(끊김 없는 반복 = 같은 글 두 벌 이어 붙이고 -50%까지) ── */
const BLOG_TITLE = '토이푸들 보리, 곰돌이 컷으로 단정해졌어요';
const BLOG_BODY: { p?: string; img?: string }[] = [
  { p: '털이 자라 얼굴이 안 보이던 보리가 한 달 만에 왔어요. 엉킨 곳부터 천천히 풀었습니다.' },
  { img: G('dog2-before') },
  { p: '목욕 후 드라이로 곱슬을 펴 가며 빗질하면 컷이 고르게 나와요.' },
  { img: G('dog2-during') },
  { p: '얼굴은 동그랗게, 다리는 가볍게. 집에서도 빗질만 해 주시면 오래 갑니다.' },
];

function BlogArticle({ out, hero }: { out: boolean; hero: boolean }) {
  return (
    <div>
      <span className="relative block aspect-[4/3]">
        {hero ? (out ? <FlyPhoto i={0} className="absolute inset-0 h-full w-full" /> : <Slot className="absolute inset-0" />) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={PHOTOS[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </span>
      <div className="px-3 pb-1 pt-2.5">
        <motion.p initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out && hero ? 0.7 : 0, duration: 0.5 }} className="text-[13px] font-bold leading-[1.4] text-text-primary">
          {BLOG_TITLE}
        </motion.p>
      </div>
      {BLOG_BODY.map((b, i) =>
        b.p ? (
          <motion.p key={i} initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out && hero ? 0.9 : 0, duration: 0.5 }} className="px-3 py-1.5 text-[11px] leading-[1.6] text-text-body">
            {b.p}
          </motion.p>
        ) : (
          /* 사진이 날아와 글이 생기기 전에는 본문 사진도 숨긴다(먼저 보이면 "이미 있던 글"처럼 읽힌다) */
          /* eslint-disable-next-line @next/next/no-img-element */
          <motion.img key={i} src={b.img} alt="" initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out && hero ? 1.0 : 0, duration: 0.5 }} className="mx-3 my-1.5 block aspect-[4/3] w-[calc(100%-24px)] object-cover" />
        ),
      )}
      <span className="block h-4" />
    </div>
  );
}

function BlogCard({ out }: { out: boolean }) {
  return (
    <Card className="relative flex-1">
      {/* 글 두 벌을 이어 붙여 -50%까지 흘린다 = 이음매 없는 반복. 사진이 도착하고 2.4초 뒤 시작 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="s4f-blog-scroll" style={{ animationPlayState: out ? 'running' : 'paused' }}>
          <BlogArticle out={out} hero />
          <BlogArticle out={out} hero={false} />
        </div>
      </div>
      <style>{`
        .s4f-blog-scroll { animation: s4fBlog 26s linear 2.4s infinite; will-change: transform; }
        @keyframes s4fBlog { from { transform: translateY(0); } to { transform: translateY(-50%); } }
      `}</style>
    </Card>
  );
}

/* ── 인스타: 미용 후 ↔ 미용 전 넘김 + 가끔 하트 + 좋아요 조금씩 ── */
const INSTA_SLIDES = [PHOTOS[1], G('dog1-before')];

function InstaCard({ out }: { out: boolean }) {
  const [idx, setIdx] = useState(0);
  const [likes, setLikes] = useState(126);
  const [heart, setHeart] = useState(0); // 하트가 눌린 횟수 — 바뀔 때마다 톡 튄다
  useEffect(() => {
    if (!out) return;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setIdx((v) => (v + 1) % INSTA_SLIDES.length);
      if (n % 2 === 0) {
        setLikes((v) => v + 1 + (n % 3));
        setHeart((v) => v + 1);
      }
    }, 2800);
    return () => clearInterval(id);
  }, [out]);
  const liked = heart > 0;
  return (
    <Card className="flex flex-1 flex-col">
      <span className="relative block aspect-square overflow-hidden md:aspect-[4/5]">
        {out ? (
          <>
            {INSTA_SLIDES.map((src, i) =>
              i === 0 ? (
                <motion.span key={i} className="absolute inset-0 block" initial={false} animate={{ x: `${(i - idx) * 100}%` }} transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}>
                  <FlyPhoto i={1} className="absolute inset-0 h-full w-full" />
                </motion.span>
              ) : (
                <motion.span key={i} className="absolute inset-0 block" initial={{ x: '100%' }} animate={{ x: `${(i - idx) * 100}%` }} transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </motion.span>
              ),
            )}
            {/* 넘김 점 — 사진 위 아래쪽 */}
            <span className="absolute bottom-2 left-1/2 z-[1] flex -translate-x-1/2 gap-1" aria-hidden>
              {INSTA_SLIDES.map((_, i) => (
                <span key={i} className={`rounded-dot block h-[5px] w-[5px] transition-colors duration-300 ${i === idx ? 'bg-white' : 'bg-white/45'}`} />
              ))}
            </span>
          </>
        ) : (
          <Slot className="absolute inset-0" />
        )}
      </span>
      <motion.div initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.8 : 0 }} className="px-2.5 pb-2 pt-2">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-text-primary">
          <motion.svg key={heart} width="14" height="14" viewBox="0 0 16 16" aria-hidden initial={heart ? { scale: 0.6 } : false} animate={{ scale: [0.6, 1.25, 1] }} transition={{ duration: 0.45 }}>
            <path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" fill={liked ? '#ed4956' : 'none'} stroke={liked ? '#ed4956' : '#171717'} strokeWidth="1.4" strokeLinejoin="round" />
          </motion.svg>
          <span>좋아요</span>
          <NumberFlow value={likes} className="tabular-nums" style={EN} />
        </p>
        <p className="mt-1 text-[11px] leading-[1.45] text-text-body">콩이 동그란 얼굴 컷 <span className="text-[#00376b]">#말티즈미용</span></p>
      </motion.div>
    </Card>
  );
}

export function S4Flow({ freeze }: { freeze?: Phase }) {
  const ref = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  /* 휴대폰은 결과 카드가 사진첩 아래에 있다 → 결과가 화면에 들어올 때 날아가야 손님이 그 장면을 본다(PC는 둘이 함께 보임) */
  const resultsInView = useInView(resultsRef, { once: true, amount: 0.3 });
  const [phase, setPhase] = useState<Phase>(freeze ?? 'input');
  const [pickedAt, setPickedAt] = useState(0);
  useEffect(() => {
    if (freeze || !inView) return;
    const t1 = setTimeout(() => { setPhase('picked'); setPickedAt(Date.now()); }, 300);
    return () => clearTimeout(t1);
  }, [inView, freeze]);
  useEffect(() => {
    if (freeze || phase !== 'picked' || !resultsInView) return;
    /* 고르는 장면(번호 4개 + 말풍선)은 최소 2.1초 보여 준 뒤 날린다 */
    const wait = Math.max(300, 2100 - (Date.now() - pickedAt));
    const t2 = setTimeout(() => setPhase('output'), wait);
    return () => clearTimeout(t2);
  }, [phase, resultsInView, pickedAt, freeze]);
  const out = phase === 'output';
  const s = multiChannel.steps;

  return (
    <LayoutGroup id="s4flow">
      <div ref={ref} className="relative mx-auto flex w-full max-w-[1040px] flex-col md:grid md:grid-cols-[232px_44px_104px_44px_1fr] md:items-start">
        {/* ── 올리세요: 내 폰 사진첩에서 고른다 ── */}
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

        {/* ── 확인하고 발행: 채널마다 살아 움직임 ── */}
        <div ref={resultsRef} className="min-w-0">
          <Label>{s[2].title}</Label>
          <div className="grid grid-cols-2 gap-2.5 md:h-[392px] md:grid-cols-[1.15fr_1fr_0.72fr] md:grid-rows-[1fr_auto] md:gap-3">
            {/* 블로그 — 주인공(네이버 블로그 운영 중심). 글이 위로 흐른다 */}
            <div className="col-span-2 flex h-[320px] flex-col md:col-span-1 md:row-span-2 md:h-auto">
              <ChannelTag icon={ICON.blog} name="블로그" />
              <BlogCard out={out} />
            </div>
            {/* 인스타그램 — 넘김·하트 */}
            <div className="flex min-h-0 flex-col md:col-start-2 md:row-start-1">
              <ChannelTag icon={ICON.insta} name="인스타그램" />
              <InstaCard out={out} />
            </div>
            {/* 페이스북 — 정지(작은 가로 카드) */}
            <div className="flex flex-col md:col-start-2 md:row-start-2">
              <ChannelTag icon={ICON.fb} name="페이스북" />
              <Card className="flex flex-1 flex-col md:flex-row md:items-center">
                <span className="relative block aspect-square md:h-[64px] md:w-[64px] md:shrink-0">
                  {out ? <FlyPhoto i={2} className="absolute inset-0 h-full w-full" /> : <Slot className="absolute inset-0" />}
                </span>
                <motion.p initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.85 : 0 }} className="px-2.5 py-2 text-[11px] font-bold leading-[1.4] text-text-primary">포메라니안 두부, 동글동글 공 모양 컷</motion.p>
              </Card>
            </div>
            {/* 쇼츠·릴스 — 올린 영상에서(사진이 아니라). 영상은 사장님 제작 예정 = 지금은 빈 세로 틀 */}
            <div className="col-span-2 flex flex-col md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1">
              <ChannelTag icon={ICON.shorts} name="쇼츠·릴스" />
              <Card className="flex flex-1 flex-row md:flex-col">
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
