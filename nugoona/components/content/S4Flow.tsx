'use client';

/**
 * S4Flow — /content 채널 구간 재설계 시안(2026-10-08, 직원 PC).
 *
 * 메시지 하나: "폰 사진첩에서 고른 사진·영상이, 알아서 채널마다 살아 움직이는 콘텐츠가 된다."
 *  - 시작: 폰 사진첩에서 오늘 미용한 아이들 사진 2장 + 영상 1개를 고른다(1~3 번호) → 말 한마디
 *  - 진행: 왼쪽 화살이 그려지고 가운데 "콘텐츠가 됩니다" 카드 → 고른 사진이 복제되어 각 채널로 날아가며 카드의 체크가 하나씩 찍힌다
 *  - 완성 후에도 **채널답게 계속 산다**(사장님 2026-10-08 "무빙을 위한 무빙이 아니라 살아 움직이는 콘텐츠"):
 *      블로그 = 글이 천천히 위로 흐르며 본문·사진이 이어진다(끊김 없는 반복, 우리 카드 문법 — 사장님 "블로그는 어쩔 수 없다")
 *      인스타 = **실제 피드 게시물 재현** · 미용 후 ↔ 미용 전 넘김, 가끔 큰 하트·좋아요 증가
 *      쇼츠 = **실제 재생 화면 재현** · 사진(영상 대기)·좋아요 증가·빨간 재생 막대. 영상은 사장님이 쇼츠 프로그램으로 제작 예정
 *      페이스북 = 이 시안에서 제외(실제 화면 3개가 들어갈 자리 없음 — 사장님 확인 대상)
 * 업종 = 애견미용(사장님 확정 2026-10-08, 여러 마리). 사진 = 코덱스 생성(현장 폰 사진 질감, 사람 얼굴·글자 없음).
 * ⚠ §8.7-I "짝퉁 실물 재현 금지"는 이 구간에서 사장님 지시로 해제(2026-10-08 "인스타·쇼츠 틀은 실제랑 똑같이").
 *    해제 이유 = 금지의 근거가 "어설픈 흉내"였으므로, 실제 치수·아이콘·문구를 정확히 재현해 그 우려를 없앤다.
 * 카피: 섹션 제목·"올리세요"·"확인하고 발행"은 기존 확정 문구. 가운데 "콘텐츠가 됩니다"는 사장님 지시(구 "글이 됩니다").
 *       목업 안 예시 글(가게 이야기)은 초안 — 사장님 확인 대상.
 */

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useInView } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import { multiChannel } from '@/lib/content/content';

type Phase = 'input' | 'picked' | 'output';

const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';
const EN = { fontFamily: 'var(--font-en)' } as const;
const FLY = { duration: 0.95, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };
const G = (n: string) => `/img/content/groom/${n}.jpg`;

/** 날아가는 사진 2장: 0 = 보리(블로그) · 1 = 콩이(인스타). 영상(솜이)은 쇼츠로 */
const PHOTOS = [G('dog2-after'), G('dog1-after')];

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

/** 화살(§8.7-A 정본: PC = 선 1.6px + 채운 삼각 / 모바일 = 가는 선 + V촉).
    칸을 꽉 채워 양쪽 요소에 밀착(사이 틈 금지 — 정본). on = 흐름이 그 화살을 지나갈 때 왼쪽부터 그려진다 */
function Arrow({ on }: { on: boolean }) {
  return (
    <>
      <span className="hidden h-[14px] items-center md:flex md:self-center" aria-hidden>
        <motion.span className="flex h-full w-full origin-left items-center" initial={false} animate={{ scaleX: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <span className="block h-[1.6px] flex-1 bg-[#171717]" />
          <svg width="8" height="11" viewBox="0 0 8 11" className="-ml-px shrink-0"><path d="M0 0.3L8 5.5 0 10.7z" fill="#171717" /></svg>
        </motion.span>
      </span>
      <span className="flex justify-center py-3 md:hidden" aria-hidden>
        <motion.svg width="14" height="32" viewBox="0 0 14 32" fill="none" className="origin-top" initial={false} animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.45 }}>
          <line x1="7" y1="1" x2="7" y2="30" stroke="#171717" strokeWidth="1.1" /><path d="M2 25l5 5 5-5" stroke="#171717" strokeWidth="1.1" />
        </motion.svg>
      </span>
    </>
  );
}

/* ── 폰 사진첩 — 같은 페이지 S2 폰과 같은 프레임(phone-frame.png·화면 좌표) / 내용은 다르게(S2 = 앱 새 글, 여기 = 사진첩 고르기) ── */
const G_FRAME_W = 540;
const G_SCREEN = { left: 31.7, top: 12.35, width: 35.9, height: 74.7 }; // phone-frame.png 화면 영역(%) — S2와 동일
const G_VISIBLE_W = Math.round(G_FRAME_W * 0.386); // 보이는 폭 ≈ 208(베젤 포함)
const G_VISIBLE_H = 386; // 폰 아래 둥근 모서리가 시작되기 전에서 자른다 — 그 아래는 화면 흰 바탕이 모서리 밖으로 삐져나와 보였다(사장님 2026-10-08 "사진 아래 하얀 거"). 사진이 잘린 선까지 찬다(홀더 컷 §8.18-B)
const G_LEFT = -Math.round(G_FRAME_W * 0.304);
const G_TOP = -Math.round(G_FRAME_W * 0.1105);
/* 미용사 사진첩 15칸 — 오늘 미용한 아이들(전·중·후)과 가게. 같은 사진 두 번 금지.
   pick = 선택 순번, fly = 날아갈 사진 번호, video = 쇼츠로 갈 영상(썸네일 = 솜이 미용 중) */
const GALLERY: { src: string; pick?: number; fly?: number; video?: boolean; zoom?: string }[] = [
  { src: G('dog1-before') },
  { src: G('dog1-after'), pick: 1, fly: 1 },
  { src: G('shop-props') },
  { src: G('dog2-before') },
  { src: G('dog4-during'), pick: 3, video: true },
  { src: G('dog2-during') },
  { src: G('dog2-after'), pick: 2, fly: 0 },
  { src: G('dog3-before') },
  { src: G('dog1-during') },
  { src: G('dog3-after') },
  { src: G('dog4-before') },
  { src: G('shop-inside') },
  { src: G('dog3-during') },
  { src: G('dog4-after') },
  { src: G('shop-waiting') },
  /* 6번째 줄 — 폰 아래까지 사진이 차게(사장님 2026-10-08 "사진 아래 하얀 거 안 나오게"). 남은 1장 + 연속 촬영처럼 확대한 2장 */
  { src: G('shop-entrance') },
  { src: G('dog2-after'), zoom: '50% 30%' },
  { src: G('dog1-during'), zoom: '60% 35%' },
];

function PhoneGallery({ phase }: { phase: Phase }) {
  const picked = phase !== 'input';
  const out = phase === 'output';
  return (
    <div className="relative flex w-full flex-col items-center md:block md:w-fit">
      <div className="relative overflow-hidden" style={{ width: G_VISIBLE_W, height: G_VISIBLE_H }}>
        <div style={{ position: 'relative', width: G_FRAME_W, left: G_LEFT, top: G_TOP, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.10))' }}>
          <div className="absolute z-[1] overflow-hidden bg-white" style={{ left: `${G_SCREEN.left}%`, top: `${G_SCREEN.top}%`, width: `${G_SCREEN.width}%`, height: `${G_SCREEN.height}%`, borderRadius: 16 }}>
            <div className="flex items-end justify-between px-3 pb-2 pt-8">
              <span className="text-[13px] font-bold text-text-primary">최근 항목</span>
              <motion.span initial={false} animate={{ opacity: picked ? 1 : 0 }} transition={{ delay: picked ? 0.9 : 0 }} className="text-[11px] font-bold text-[#0070f3]">3개 선택</motion.span>
            </div>
            <div className="grid grid-cols-3 gap-[2px]">
              {GALLERY.map((g, i) => (
                <span key={i} className="relative block aspect-square overflow-hidden bg-[#171717]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt="" className="absolute inset-0 h-full w-full object-cover" style={g.zoom ? { transform: 'scale(1.9)', transformOrigin: g.zoom } : undefined} />
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
      <span aria-hidden className="absolute left-1/2 h-[3px] -translate-x-1/2 md:left-0 md:translate-x-0" style={{ width: G_VISIBLE_W, top: G_VISIBLE_H - 3, background: 'radial-gradient(ellipse 52% 100% at 50% 100%, #8f8f8f 0%, rgba(143,143,143,0.35) 60%, transparent 100%)' }} />
      {/* 말 한마디 — 폰 밖 말풍선(미용사가 폰에 대고 말하는 장면). 다 고른 뒤에 뜬다 */}
      <motion.p
        initial={false}
        animate={picked ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: picked ? 1.2 : 0, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[3] -mt-10 flex w-full max-w-[260px] items-center gap-2 bg-white px-3 py-2 text-[12px] font-medium leading-[1.4] text-text-primary md:ml-12 md:mt-5 md:w-max md:max-w-[240px] md:pl-2"
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


/* ══ 실제 앱 화면 재현(사장님 2026-10-08 "인스타·쇼츠 틀은 실제랑 똑같이 — 좋아요도 뭣도") ══
   §8.7-I "짝퉁 실물 재현 금지"의 이유 = 어설픈 흉내. 여기서는 실제 앱 치수·아이콘·문구를 정확히 재현해 그 우려를 없앤다.
   글꼴 = 각 앱처럼 기기 기본 글꼴. 블로그는 "어쩔 수 없다"(사장님) — 우리 카드 문법 유지 */
const APP_FONT = { fontFamily: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", Roboto, "Malgun Gothic", sans-serif' } as const;
const SHOP_ID = 'monggeul_grooming';
const IG_HEART = 'M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938z';

/** 인스타그램 피드 게시물 — 머리(프로필 고리·계정·더보기) / 4:5 사진 넘김(1/2 표시·파란 점) / 하트·댓글·공유·저장 / 좋아요·본문·댓글·시간 */
const INSTA_SLIDES = [PHOTOS[1], G('dog1-before')];

function InstaPost({ out }: { out: boolean }) {
  const [idx, setIdx] = useState(0);
  const [likes, setLikes] = useState(126);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0); // 사진 가운데 큰 하트 — 바뀔 때마다 한 번 뜬다
  useEffect(() => {
    if (!out) return;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setIdx((v) => (v + 1) % INSTA_SLIDES.length);
      if (n % 2 === 1) {
        setLikes((v) => v + 1 + (n % 3));
        setLiked(true);
        setBurst((v) => v + 1);
      }
    }, 2800);
    return () => clearInterval(id);
  }, [out]);
  return (
    <div className="flex h-full flex-col bg-white text-black" style={{ ...APP_FONT, border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      {/* 머리 */}
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="rounded-dot block h-[26px] w-[26px] shrink-0 p-[1.5px]" style={{ background: 'conic-gradient(from 210deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)' }}>
          <span className="rounded-dot block h-full w-full overflow-hidden border-[1.5px] border-white bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={G('shop-props')} alt="" className="h-full w-full object-cover" />
          </span>
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-[1.3]">{SHOP_ID}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" aria-hidden><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
      </div>
      {/* 사진 넘김 */}
      <span className="relative block aspect-[4/5] shrink-0 overflow-hidden bg-[#efefef]">
        {out ? (
          <>
            {INSTA_SLIDES.map((src, i) => (
              <motion.span key={i} className="absolute inset-0 block" initial={i === 0 ? false : { x: '100%' }} animate={{ x: `${(i - idx) * 100}%` }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}>
                {i === 0 ? (
                  <FlyPhoto i={1} className="absolute inset-0 h-full w-full" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </motion.span>
            ))}
            <span className="rounded-pill absolute right-2 top-2 z-[1] bg-black/60 px-[7px] py-[2px] text-[10px] font-medium text-white">{idx + 1}/{INSTA_SLIDES.length}</span>
            {burst > 0 && (
              <motion.svg key={burst} viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 z-[1] -ml-8 -mt-8 h-16 w-16" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.15, 1, 1], opacity: [0, 1, 1, 0] }} transition={{ duration: 0.9, times: [0, 0.25, 0.6, 1] }} aria-hidden style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}>
                <path d={IG_HEART} fill="#fff" />
              </motion.svg>
            )}
          </>
        ) : (
          <Slot className="absolute inset-0" />
        )}
      </span>
      {/* 버튼 줄 + 넘김 점(가운데) */}
      <div className="relative flex items-center gap-3 px-2.5 pb-1 pt-2">
        <motion.svg key={`h${burst}`} width="20" height="20" viewBox="0 0 24 24" aria-hidden initial={burst ? { scale: 0.7 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}>
          <path d={IG_HEART} fill={liked ? '#ff3040' : 'none'} stroke={liked ? '#ff3040' : '#000'} strokeWidth="2" strokeLinejoin="round" />
        </motion.svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinejoin="round" aria-hidden><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinejoin="round" aria-hidden><line x1="22" y1="3" x2="9.218" y2="10.083" /><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" /></svg>
        <span className="absolute left-1/2 top-[14px] flex -translate-x-1/2 gap-[3px]" aria-hidden>
          {INSTA_SLIDES.map((_, i) => (
            <span key={i} className={`rounded-dot block h-[5px] w-[5px] transition-colors duration-300 ${i === idx ? 'bg-[#0095f6]' : 'bg-[#a8a8a8]'}`} />
          ))}
        </span>
        <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinejoin="round" aria-hidden><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" /></svg>
      </div>
      <motion.div initial={false} animate={{ opacity: out ? 1 : 0 }} transition={{ delay: out ? 0.8 : 0 }} className="flex-1 px-2.5 pb-2.5">
        <p className="text-[11px] font-semibold leading-[1.5]">좋아요 <NumberFlow value={likes} />개</p>
        <p className="text-[11px] leading-[1.45]"><span className="font-semibold">{SHOP_ID}</span> 콩이 동그란 얼굴 컷 <span className="whitespace-nowrap text-[#00376b]">#말티즈미용</span> <span className="whitespace-nowrap text-[#00376b]">#동네애견미용</span></p>
        <p className="mt-0.5 text-[11px] leading-[1.45] text-[#737373]">댓글 8개 모두 보기</p>
        <p className="text-[10px] leading-[1.6] text-[#737373]">1시간 전</p>
      </motion.div>
    </div>
  );
}

/** 쇼츠 오른쪽 세로 줄 단추 */
function RailBtn({ d, label }: { d: string; label: React.ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-[2px]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))' }}><path d={d} /></svg>
      <span className="text-[9px] font-medium leading-none text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{label}</span>
    </span>
  );
}

/** 유튜브 쇼츠 재생 화면 — 위(검색·더보기) / 오른쪽 세로 줄(좋아요·싫어요·댓글·공유·리믹스·음원) / 아래(채널·구독·제목·음원) / 빨간 재생 막대.
    영상은 사장님이 쇼츠 프로그램으로 만든다 — 그 전까지 솜이 사진을 천천히 당겨 보이게 깔아 둔다(가짜 영상 파일은 쓰지 않는다) */
function ShortsPlayer({ out }: { out: boolean }) {
  const [likes, setLikes] = useState(384);
  useEffect(() => {
    if (!out) return;
    let n = 0;
    const id = setInterval(() => { n += 1; setLikes((v) => v + 1 + (n % 2)); }, 3400);
    return () => clearInterval(id);
  }, [out]);
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0f0f0f] text-white" style={APP_FONT}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={G('dog4-after')} alt="" className="s4f-kenburns absolute inset-0 h-full w-full object-cover" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[22%]" style={{ background: 'linear-gradient(rgba(0,0,0,0.35), transparent)' }} />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.62))' }} />
      {/* 위 */}
      <span className="absolute right-2 top-2 flex items-center gap-2.5" aria-hidden>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
      </span>
      {/* 오른쪽 세로 줄 */}
      <span className="absolute bottom-[62px] right-1.5 flex flex-col items-center gap-[10px]">
        <RailBtn d="M8 21H4V10h4v11zm2-11.8V21h8.4c.9 0 1.7-.6 1.9-1.5l1.6-6.7c.3-1.2-.6-2.3-1.9-2.3H15l.9-4.3c.1-.6-.1-1.2-.5-1.6L14.5 3 10 9.2z" label={<NumberFlow value={likes} />} />
        <RailBtn d="M16 3h4v11h-4V3zm-2 11.8V3H5.6c-.9 0-1.7.6-1.9 1.5L2.1 11.2c-.3 1.2.6 2.3 1.9 2.3H9l-.9 4.3c-.1.6.1 1.2.5 1.6l.9.9 4.5-6.2z" label="싫어요" />
        <RailBtn d="M4 4h16v12H8.8L4 20.2V4z" label="27" />
        <RailBtn d="M15 5.6 20.7 12 15 18.4V14h-1c-4 0-7.1 1-9.8 3.1 1.8-4.1 5.1-6.4 9.9-7.1l.9-.1V5.6M14 3v6C6.2 10.1 3.1 15.3 2 21c2.8-4 6.4-6 12-6v6l8-9-8-9z" label="공유" />
        <RailBtn d="M17 4v3h-5a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4h5v3l4-4-4-4z" label="리믹스" />
        <span className="block h-[22px] w-[22px] overflow-hidden border-2 border-white/90 bg-[#333]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={G('shop-props')} alt="" className="h-full w-full object-cover" />
        </span>
      </span>
      {/* 아래 — 채널·구독·제목·음원 */}
      <span className="absolute bottom-[10px] left-2 right-[40px] block">
        <span className="flex items-center gap-1.5">
          <span className="rounded-dot block h-[18px] w-[18px] shrink-0 overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={G('shop-props')} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0 truncate text-[10px] font-semibold">@{SHOP_ID}</span>
          <span className="rounded-pill shrink-0 bg-white px-2 py-[3px] text-[10px] font-semibold leading-none text-[#0f0f0f]">구독</span>
        </span>
        <span className="mt-1.5 block text-[11px] leading-[1.35]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>솜이 미용 전 → 후, 솜사탕 얼굴 완성</span>
        <span className="mt-1 flex items-center gap-1 text-[9px] text-white/90">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M12 3v10.6A4 4 0 1 0 14 17V7h4V3h-6z" /></svg>
          <span className="truncate">원본 오디오 · {SHOP_ID}</span>
        </span>
      </span>
      {/* 재생 막대 */}
      <span className="absolute inset-x-0 bottom-0 block h-[2px] bg-white/30">
        <span className="s4f-progress block h-full bg-[#ff0033]" />
      </span>
      <style>{`
        .s4f-kenburns { animation: s4fKb 14s ease-in-out infinite alternate; transform-origin: 50% 40%; }
        @keyframes s4fKb { from { transform: scale(1); } to { transform: scale(1.08); } }
        .s4f-progress { animation: s4fProg 14s linear infinite; transform-origin: left; }
        @keyframes s4fProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </div>
  );
}

/** 가운데 = 앱이 만드는 자리. 심벌 + "콘텐츠가 됩니다" + 만들어지는 세 가지(채널에 도착할 때마다 체크).
    사장님 2026-10-08 "로고만 덩그러니 + 글자 = 안 예쁘다 · 글이 아니라 콘텐츠" */
const MAKES = [
  { icon: ICON.blog, name: '블로그 글' },
  { icon: ICON.insta, name: '인스타 게시물' },
  { icon: ICON.shorts, name: '쇼츠 영상' },
];

function MakerCard({ phase }: { phase: Phase }) {
  const out = phase === 'output';
  return (
    <div className="mx-auto w-full max-w-[260px] bg-white p-3 md:max-w-none" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      <div className="flex items-center gap-2 md:flex-col md:items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/brand/content/symbol.svg" alt="누구나 콘텐츠" className="h-10 w-10 shrink-0 md:h-11 md:w-11" />
        <p className="text-[13px] font-bold leading-[1.3] tracking-[-0.02em] text-text-primary">콘텐츠가 됩니다</p>
      </div>
      <ul className="mt-2.5 space-y-1.5 border-t pt-2.5" style={{ borderColor: BORDER }}>
        {MAKES.map((m, i) => (
          <li key={m.name} className="flex items-center gap-1.5 text-[11px] font-medium text-text-body">
            {m.icon}
            <span className="min-w-0 flex-1 truncate">{m.name}</span>
            <motion.span
              initial={false}
              animate={out ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0.25 }}
              transition={{ delay: out ? 0.55 + i * 0.18 : 0, type: 'spring', stiffness: 420, damping: 20 }}
              className={`rounded-dot flex h-[14px] w-[14px] shrink-0 items-center justify-center transition-colors duration-300 ${out ? 'bg-[#0070f3]' : 'bg-[#e5e5e5]'}`}
            >
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M3 8.5l3.2 3L13 5" /></svg>
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
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
    /* 고르는 장면(번호 + 말풍선)은 최소 2.1초 보여 준 뒤 날린다 */
    const wait = Math.max(300, 2100 - (Date.now() - pickedAt));
    const t2 = setTimeout(() => setPhase('output'), wait);
    return () => clearTimeout(t2);
  }, [phase, resultsInView, pickedAt, freeze]);
  const out = phase === 'output';
  const s = multiChannel.steps;

  return (
    <LayoutGroup id="s4flow">
      <div ref={ref} className="relative mx-auto flex w-full max-w-[1040px] flex-col md:grid md:grid-cols-[208px_36px_128px_36px_1fr] md:items-start">
        {/* ── 올리세요: 내 폰 사진첩에서 고른다 ── */}
        <div className="min-w-0">
          <Label>{s[0].title}</Label>
          <PhoneGallery phase={phase} />
        </div>

        <Arrow on={phase !== 'input'} />

        {/* ── 콘텐츠가 됩니다: 앱이 만드는 자리 ── */}
        <div className="md:self-center">
          <MakerCard phase={phase} />
        </div>

        <Arrow on={out} />

        {/* ── 확인하고 발행: 채널마다 살아 움직임(인스타·쇼츠 = 실제 앱 화면) ── */}
        <div ref={resultsRef} className="min-w-0">
          <Label>{s[2].title}</Label>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[0.8fr_1fr_1.17fr] md:gap-3">
            {/* 블로그 — 글이 위로 흐른다(우리 카드 문법 유지) */}
            <div className="col-span-2 flex h-[300px] flex-col md:col-span-1 md:h-auto">
              <ChannelTag icon={ICON.blog} name="블로그" />
              <BlogCard out={out} />
            </div>
            {/* 휴대폰 = 인스타 아래에 쇼츠를 세로로(사장님 2026-10-08 "슬라이드처럼 하지 말고 인스타 아래에").
                반씩 나란히 두면 폭 145px라 실제 화면 부속이 넘치고 겹쳤다(실측) → 둘 다 전폭. PC = 이 묶음이 사라지고(contents) 격자 칸으로 */}
            <div className="col-span-2 flex flex-col gap-2.5 md:contents">
              {/* 인스타그램 — 실제 피드 게시물 */}
              <div className="flex min-w-0 flex-col">
                <ChannelTag icon={ICON.insta} name="인스타그램" />
                <InstaPost out={out} />
              </div>
              {/* 쇼츠 — 실제 재생 화면(9:16) */}
              <div className="flex min-w-0 flex-col">
                <ChannelTag icon={ICON.shorts} name="쇼츠·릴스" />
                <span className="relative block aspect-[9/16] w-full" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
                  <span className={`absolute inset-0 block ${out ? 'invisible' : ''}`}><Slot className="h-full w-full" /></span>
                  {out && (
                    <motion.span layoutId="s4f-v" transition={FLY} className="absolute inset-0 block overflow-hidden">
                      <ShortsPlayer out={out} />
                    </motion.span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
