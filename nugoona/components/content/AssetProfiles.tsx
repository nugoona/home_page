'use client';

/**
 * AssetProfiles — /content "서비스 이용이 끝나도 쌓인 콘텐츠는 그대로 남습니다" 구간 시안(2026-10-09, 직원 PC).
 *
 * 메시지 하나: "끄면 사라지는 광고와 달리, 만든 콘텐츠는 고객님 계정에 그대로 남는다." (검색 효과 약속 아님 — CONTENT §0.5 정직 가드레일)
 * 장면 = 몇 달 운영한 동네 꽃집의 실제 프로필 화면 세 개(네이버 블로그 글 목록 · 인스타 게시물 격자 · 유튜브 쇼츠 탭).
 *        "이게 고객님 계정이다" = 계정 주인 화면(프로필 편집·채널 맞춤설정 단추).
 * 업종 = 동네 꽃집(사장님 2026-10-09 "섹션마다 업종 다르게"). 사진 = 코덱스 생성, 실제 꽃집 사진 조사(reference.md) 반영.
 * 움직임 = 처음부터 무한 반복(등장 애니메이션·딜레이 금지): 격자·목록이 천천히 위로 흐르고, 게시물 수가 가끔 하나씩 오른다.
 * 틀(프로필 머리·탭)은 고정, 내용만 흐른다. 실제 앱 화면은 진짜와 똑같이(§8.7-I 폐기 2026-10-09).
 */

import { useEffect, useState } from 'react';
import NumberFlow from '@number-flow/react';

const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';
const APP_FONT = { fontFamily: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", Roboto, "Malgun Gothic", sans-serif' } as const;
const F = (n: string) => `/img/content/flower/${n}.jpg`;
const SHOP = '하루꽃집';
const SHOP_ID = 'haru_flower';
const AVATAR = F('f-hand-white');

/* 18장 순서 = 인스타 격자(최신이 위). 블로그·쇼츠는 같은 사진에서 골라 쓴다 */
const ALL = [
  'f-hand-tulip', 'f-make-4-ribbon', 'f-bouquet', 'f-hand-carnation', 'f-counter', 'f-hand-gerbera',
  'f-basket', 'f-hand-sunflower', 'f-shop', 'f-make-2-gather', 'f-hand-mini', 'f-plants',
  'f-hand-white', 'f-entrance', 'f-make-3-wrap', 'f-door-buckets', 'f-ribbon', 'f-make-1-trim',
];

/** 몇 초마다 하나씩 오르는 숫자 — 계정이 계속 살아 있다는 신호(처음부터 돈다) */
function useTicker(start: number, ms: number) {
  const [n, setN] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}

/** 내용이 끝없이 위로 흐르는 창 — 같은 내용 두 벌을 이어 붙여 -50%까지(이음매 없음) */
function Flow({ children, sec }: { children: React.ReactNode; sec: number }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div className="ap-flow" style={{ animationDuration: `${sec}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}

function Phone({ children, label, icon }: { children: React.ReactNode; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="mb-1.5 flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] font-semibold text-text-weak">{label}</span>
      </p>
      <div className="flex h-[440px] flex-col overflow-hidden bg-white text-black max-md:h-[460px]" style={{ ...APP_FONT, border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
        {children}
      </div>
    </div>
  );
}

const ICON = {
  blog: <span className="flex h-[14px] w-[14px] items-center justify-center bg-[#03c75a]"><svg width="8" height="8" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg></span>,
  insta: (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <defs><radialGradient id="ap-ig" cx="0.27" cy="1.08" r="1.3"><stop offset="0" stopColor="#fdf497" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#285AEB" /></radialGradient></defs>
      <rect width="24" height="24" rx="5.4" fill="url(#ap-ig)" />
      <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
    </svg>
  ),
  yt: <svg width="16" height="12" viewBox="0 0 28 20" aria-hidden><rect width="28" height="20" rx="5" fill="#FF0000" /><path d="M11 6v8l7-4z" fill="#fff" /></svg>,
};

/* ── 네이버 블로그(모바일 앱 결) — 블로그 이름·이웃 수 / 글 목록(제목·날짜·오른쪽 썸네일) ── */
const BLOG_POSTS = [
  { t: '가을 튤립 들어왔어요, 노랑·흰색 반반', d: '2026. 10. 7.', img: 'f-hand-tulip' },
  { t: '꽃다발 리본은 이렇게 묶어요', d: '2026. 10. 2.', img: 'f-make-4-ribbon' },
  { t: '어버이날 카네이션 꽃다발 정리', d: '2026. 5. 6.', img: 'f-hand-carnation' },
  { t: '여름 해바라기, 오래 보는 방법', d: '2026. 7. 18.', img: 'f-hand-sunflower' },
  { t: '꽃 냉장고 안 오늘의 꽃', d: '2026. 9. 12.', img: 'f-shop' },
  { t: '선물용 꽃바구니 크기 고르기', d: '2026. 8. 22.', img: 'f-basket' },
  { t: '처음 오시는 길, 골목 안 꽃집', d: '2026. 3. 4.', img: 'f-entrance' },
];

function BlogProfile() {
  const posts = useTicker(128, 5200);
  return (
    <>
      <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: '#f0f0f0' }}>
        <span className="text-[13px] font-extrabold text-[#03c75a]">blog</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" aria-hidden><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
      </div>
      <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AVATAR} alt="" className="rounded-dot h-10 w-10 shrink-0 object-cover" />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold leading-[1.3]">{SHOP} 이야기</p>
          <p className="mt-0.5 flex items-center whitespace-nowrap text-[10px] leading-none text-[#888]">이웃 342 · 전체글&nbsp;<NumberFlow value={posts} /></p>
        </div>
      </div>
      <div className="flex gap-3 border-b px-3 text-[11px] font-semibold" style={{ borderColor: '#f0f0f0' }}>
        <span className="border-b-2 border-black pb-1.5">글</span>
        <span className="pb-1.5 text-[#999]">카테고리</span>
        <span className="pb-1.5 text-[#999]">이웃</span>
      </div>
      <Flow sec={36}>
        {BLOG_POSTS.map((p) => (
          <div key={p.t} className="flex items-center gap-2.5 border-b px-3 py-2.5" style={{ borderColor: '#f5f5f5' }}>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[12px] font-semibold leading-[1.4]">{p.t}</p>
              <p className="mt-1 text-[10px] text-[#999]">{p.d}</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={F(p.img)} alt="" className="h-[52px] w-[52px] shrink-0 object-cover" />
          </div>
        ))}
      </Flow>
    </>
  );
}

/* ── 인스타그램 프로필(계정 주인 화면) — 사진·게시물/팔로워/팔로잉·이름·소개·프로필 편집/공유·탭·격자 ── */
function InstaProfile() {
  const posts = useTicker(214, 4300);
  return (
    <>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[13px] font-bold">{SHOP_ID}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" aria-hidden><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </div>
      <div className="flex items-center gap-4 px-3">
        <span className="rounded-dot block h-[52px] w-[52px] shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AVATAR} alt="" className="h-full w-full object-cover" />
        </span>
        <div className="grid flex-1 grid-cols-3 text-center">
          <span className="flex flex-col items-center"><b className="flex h-[17px] items-center text-[13px] leading-none"><NumberFlow value={posts} /></b><span className="text-[10px]">게시물</span></span>
          <span className="flex flex-col items-center"><b className="flex h-[17px] items-center text-[13px] leading-none">1,284</b><span className="text-[10px]">팔로워</span></span>
          <span className="flex flex-col items-center"><b className="flex h-[17px] items-center text-[13px] leading-none">186</b><span className="text-[10px]">팔로잉</span></span>
        </div>
      </div>
      <div className="px-3 pt-2">
        <p className="text-[11px] font-semibold leading-[1.4]">{SHOP}</p>
        <p className="text-[11px] leading-[1.4] text-[#333]">동네 골목 작은 꽃집 · 꽃다발 · 꽃바구니</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-2.5 pt-2.5">
        <span className="rounded-pill bg-[#efefef] py-[5px] text-center text-[11px] font-semibold">프로필 편집</span>
        <span className="rounded-pill bg-[#efefef] py-[5px] text-center text-[11px] font-semibold">프로필 공유</span>
      </div>
      <div className="grid grid-cols-3 border-t" style={{ borderColor: '#efefef' }}>
        <span className="flex justify-center border-b border-black py-1.5"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg></span>
        <span className="flex justify-center py-1.5"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M10 8.5v7l6-3.5z" fill="#8e8e8e" /></svg></span>
        <span className="flex justify-center py-1.5"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M6 20c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5" /></svg></span>
      </div>
      <Flow sec={40}>
        <div className="grid grid-cols-3 gap-[2px] pb-[2px]">
          {ALL.map((n) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={n} src={F(n)} alt="" className="aspect-[3/4] w-full object-cover" />
          ))}
        </div>
      </Flow>
    </>
  );
}

/* ── 유튜브 채널 쇼츠 탭(계정 주인 화면) — 채널 사진·이름·@·구독자·동영상 수 / 채널 맞춤설정·동영상 관리 / 탭 / 9:16 썸네일 격자 ── */
const SHORTS = [
  { img: 'f-make-2-gather', v: '1.2천회' }, { img: 'f-hand-tulip', v: '846회' }, { img: 'f-make-3-wrap', v: '2.3천회' },
  { img: 'f-hand-gerbera', v: '598회' }, { img: 'f-basket', v: '1.1천회' }, { img: 'f-make-1-trim', v: '931회' },
  { img: 'f-hand-sunflower', v: '1.7천회' }, { img: 'f-door-buckets', v: '702회' }, { img: 'f-hand-carnation', v: '3.4천회' },
];

function ShortsChannel() {
  const vids = useTicker(48, 6100);
  return (
    <>
      <div className="flex items-center gap-2.5 px-3 pb-2 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AVATAR} alt="" className="rounded-dot h-11 w-11 shrink-0 object-cover" />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold leading-[1.3]">{SHOP}</p>
          <p className="truncate text-[10px] leading-[1.45] text-[#606060]">@{SHOP_ID} · 구독자 612명</p>
          <p className="flex items-center whitespace-nowrap text-[10px] leading-[1.45] text-[#606060]">동영상&nbsp;<NumberFlow value={vids} />개</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-2">
        <span className="rounded-pill bg-[#f2f2f2] py-[5px] text-center text-[11px] font-semibold">채널 맞춤설정</span>
        <span className="rounded-pill bg-[#f2f2f2] py-[5px] text-center text-[11px] font-semibold">동영상 관리</span>
      </div>
      <div className="flex gap-3.5 border-b px-3 text-[11px] font-semibold text-[#606060]" style={{ borderColor: '#e5e5e5' }}>
        <span className="pb-1.5">홈</span>
        <span className="pb-1.5">동영상</span>
        <span className="border-b-2 border-black pb-1.5 text-black">Shorts</span>
        <span className="pb-1.5">재생목록</span>
      </div>
      <Flow sec={44}>
        <div className="grid grid-cols-3 gap-[3px] p-[3px]">
          {SHORTS.map((s) => (
            <span key={s.img} className="relative block aspect-[9/16] overflow-hidden" style={{ borderRadius: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={F(s.img)} alt="" className="h-full w-full object-cover" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.55))' }} />
              <span className="absolute bottom-1 left-1.5 flex items-center gap-0.5 text-[9px] font-semibold text-white">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                {s.v}
              </span>
            </span>
          ))}
        </div>
      </Flow>
    </>
  );
}

export function AssetProfiles() {
  return (
    <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:gap-4">
      <Phone label="블로그" icon={ICON.blog}><BlogProfile /></Phone>
      <Phone label="인스타그램" icon={ICON.insta}><InstaProfile /></Phone>
      <Phone label="유튜브" icon={ICON.yt}><ShortsChannel /></Phone>
      <style>{`
        .ap-flow { animation-name: apFlow; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
        @keyframes apFlow { from { transform: translateY(0); } to { transform: translateY(-50%); } }
      `}</style>
    </div>
  );
}
