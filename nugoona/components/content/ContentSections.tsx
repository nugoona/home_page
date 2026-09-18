'use client';

/* /content S2·S3·S4 — 재작업 v2 (2026-07-17, §8.7-K 디자인 검수표 A→B→C 통과 기준)
   1차 반려: "카피의 기계적 배치 = 와이어프레임(20%)". v2 = 홈 실물 재질 이식(§8.15-3 실측 발췌):
   · 크롬 = S6AssetStacks 실측(h-9·신호등 9px #ec6a5e/#f4bf4f/#61c454·타이틀 11.5px #7d7d7d)
   · 카드 = 흰 + 1px #ECECEC + 그림자 '0 1px 2px .04, 0 6px 16px .04'(§8.15 Vercel 실측)
   · 무대 = 도트 레이어 + edge mask(§8.14-6) + 십자 마커(교차점, rgba .28)
   · 실카피(명조 인용) + 상태 부속(체크·타임스탬프) — 스켈레톤만 나열 금지(§8.7-K B5)
   · 사진 = 사장님 승인 임시 자산(/img/content/hero-1~3.jpg) 재사용
   [A 분석표]
   S2: 메시지 "광고는 꺼지면 사라지고, 쌓인 글은 남는다" / 장면 = 같은 시간이 지난 뒤 남은 것의 대비
       (좌: 집행이 끊긴 광고 리포트 문서 / 우: 계속 쌓이는 글 카드 스택) / 스펙트럼 = 실물 유사(리포트·글카드)
       / 모션 1 = 글 스택이 한 장씩 쌓임
   S4: 메시지 "간단한 입력 하나가 채널별 형식으로 각각 발행된다" / 장면 = 업로드 화면 → 흐름 → 채널별 포스트
       / 스펙트럼 = 실물 유사(앱 업로드 창 + 채널 포스트 유사물, 픽셀 재현 아님) / 모션 1 = 이음선 도트 흐름 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import { AnimatedBeam } from '@/components/lab-sources/magicui/animated-beam';
import { BorderBeam } from '@/components/lab-sources/magicui/border-beam';
import { BackgroundBeams } from '@/components/lab-sources/aceternity/background-beams';
import { MinimalCard, MinimalCardImage, MinimalCardTitle, MinimalCardDescription } from '@/components/lab-sources/cultui/minimal-card';
import { buildup, bridge, multiChannel } from '@/lib/content/content';

const EN = { fontFamily: 'var(--font-en)' } as const;
const QUOTE = { fontFamily: 'var(--font-quote), serif' } as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';
const MINI_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 3px 8px rgba(0,0,0,0.03)';

/* ── 공용 소품 (홈 실물 문법) ── */

/** 브라우저 크롬 — S6AssetStacks 실측(Clone03 계열) */
function Chrome({ title }: { title: string }) {
  return (
    <div className="relative flex h-9 items-center gap-2 border-b border-border-light bg-white px-3">
      <div className="flex shrink-0 items-center gap-1">
        <span className="rounded-dot h-[9px] w-[9px] bg-[#ec6a5e]" />
        <span className="rounded-dot h-[9px] w-[9px] bg-[#f4bf4f]" />
        <span className="rounded-dot h-[9px] w-[9px] bg-[#61c454]" />
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11.5px] text-[#7d7d7d]">{title}</span>
    </div>
  );
}

/** 영문 단락 라벨(eyebrow) — 홈 실물 문법(S6AssetStacks 실측: ✦ 22px + 13px 영문 대문자 0.14em #555) */
export function Eyebrow({ label, center, dark }: { label: string; center?: boolean; dark?: boolean }) {
  return (
    <span className={`mb-5 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill={dark ? '#ffffff' : '#333333'} />
      </svg>
      <span className={`text-[13px] font-medium uppercase tracking-[0.14em] ${dark ? 'text-white/55' : 'text-[#555555]'}`} style={EN}>{label}</span>
    </span>
  );
}

/** 십자 마커 — 홈 PlusMark 실측(rgba .28) */
function Plus({ className, dark }: { className: string; dark?: boolean }) {
  const line = dark ? 'rgba(255,255,255,0.30)' : 'rgba(15,23,42,0.28)';
  return (
    <span aria-hidden className={`absolute z-10 block h-3.5 w-3.5 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: line }} />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2" style={{ background: line }} />
    </span>
  );
}

/** 도트 무대 — §8.15 실측(#FAFAFA + 도트 그리드 + edge mask, 별도 absolute 레이어). dark = 다크 밴드용 반전 */
function DotStage({ dark }: { dark?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${dark ? 'bg-[#111113]' : 'bg-[#fafafa]'}`}
      style={{
        backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'} 1px, transparent 1px)`,
        backgroundSize: '22px 22px',
        maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 55%, transparent 100%)',
      }}
    />
  );
}

/* ═══════════════ S2 · 카피 + 비주얼(사장님 2026-07-17 시안 안2 확정 → 같은 날 2차 교정) ═══════════════
   2차 교정(사장님): ①스켈레톤 네모칸 = "목업 수준, 뭔지 모름" → 홈 실물 문법(S41 02 문서 카드·03 검색 브라우저)
   그대로 — 실카피·실사진·신호등 크롬. ②모바일 수평 흐름 금지(§8.18) → 모바일 = 세로 스택 + 세로 이음선(MobileOurWay 문법),
   PC만 수평 점 흐름. ⛔ 네이버 브랜드 마크 미사용(결과 문법만) · 내 글 = 결과 "중간"(순위 보장 회피). */

/* ── S2 v4 (사장님 2026-07-17 3차 지시): 폰 실화면 + 채널 카드 콜라주 + 실제 검색창 ──
   ① 주체 = 폰 목업(S41 phone-frame 축소) 속 NC 앱 "새 글" 실화면(칩 폐기)
   ② 발행물 = 채널 카드 3장(블로그·인스타·쇼츠)이 폰에 물려 계단식 겹침(벽돌 수직 스택 아님·캐러셀 금지)
   ③ 검색창 = 검색버튼(그린)·탭바까지 실제 검색결과 레이아웃(⛔네이버 로고는 §7 짝퉁 실물 금지라 미사용)
   ④ 서사 = 블로그 카드 제목("딸기 케이크가 새로 나왔습니다")이 검색 결과 내 글로 재등장 */

/* 폰 좌표계 — S41SearchScene 실측 비례 축소(보임 폭 220px·하단 크롭 = 발행 버튼을 무는 홀더 컷) */
const P_VISIBLE_W = 220;
const P_VISIBLE_H = 218; // 음성 입력까지(세로 압축 — 발행 이후는 매체 칩 행이 말함)
const P_FRAME_W = Math.round(P_VISIBLE_W / 0.386); // ≈ 570
const P_LEFT = -Math.round(P_FRAME_W * 0.304);
const P_TOP = -Math.round(P_FRAME_W * 0.1105);
const P_SCALE = (P_FRAME_W * 0.359) / 1080;
const P_SCREEN = { left: 31.7, top: 12.35, width: 35.9, height: 74.7 };

/** 폰 속 NC 앱 "새 글" 화면 — 1080 좌표계(S41 문법). 판독 안 되는 부제 삭제·글자 상향(검수 #11) */
function S2PhoneApp() {
  return (
    <div style={{ width: 1080, transformOrigin: '0 0', transform: `scale(${P_SCALE})`, fontFamily: 'var(--font-kr)', padding: '150px 90px 0', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo/nc.svg?v=16" alt="" style={{ width: 56, height: 56 }} />
        <span style={{ fontSize: 38, fontWeight: 700, color: '#16161a', letterSpacing: '-0.01em' }}>누구나 콘텐츠</span>
      </div>
      <p style={{ fontSize: 58, fontWeight: 800, color: '#16161a', letterSpacing: '-0.02em', margin: '30px 0 0' }}>새 글 쓰기</p>
      {/* 사진 2장 + 영상 1개(플레이 마크) — 전부 정사각(사장님 2026-07-17) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22, marginTop: 46 }}>
        {['/img/content/cake-1.jpg', '/img/content/cake-2.jpg', '/img/content/cake-3.jpg'].map((src, i) => (
          <span key={src} style={{ position: 'relative', display: 'block', aspectRatio: '1 / 1', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {i === 2 && (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 88, height: 88, borderRadius: 999, background: 'rgba(0,0,0,0.5)', border: '4px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="#fff" aria-hidden style={{ marginLeft: 6 }}><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
            )}
          </span>
        ))}
      </div>
      {/* 음성 한마디 — 글자 상향(판독) */}
      <div style={{ marginTop: 42, display: 'flex', alignItems: 'center', gap: 20, border: '2px solid #e4e4e7', background: '#fafafa', padding: '30px 34px' }}>
        <svg width="38" height="38" viewBox="0 0 20 20" fill="none" stroke="#9297a0" strokeWidth="1.4" aria-hidden><rect x="8" y="3" width="4" height="9" rx="2" /><path d="M5 9v1a5 5 0 0 0 10 0V9M10 15v3" /></svg>
        <span style={{ fontSize: 35, color: '#3a3a40' }}>오늘 새로 나온 딸기 케이크예요</span>
      </div>
      {/* 발행 버튼 — 크롭선이 이 버튼 중간을 지나감 = 의도된 홀더 컷 */}
      <div style={{ marginTop: 44, height: 130, background: '#0070f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 42, fontWeight: 800 }}>
        발행하기
      </div>
    </div>
  );
}

/** 폰 목업(작게·하단 크롭) — 홈 S41 phone-frame 문법 축소판.
    잘린 단면 = 밀착 구획선(홈 StepHead 문법: 중앙 도톰·양끝 fade — §8.17 "선을 붙여") */
function S2Phone() {
  return (
    <div className="relative" style={{ width: P_VISIBLE_W }} aria-hidden>
      <div className="overflow-hidden" style={{ width: P_VISIBLE_W, height: P_VISIBLE_H }}>
        <div style={{ position: 'relative', width: P_FRAME_W, left: P_LEFT, top: P_TOP, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.10))' }}>
          <div
            style={{
              position: 'absolute',
              left: `${P_SCREEN.left}%`,
              top: `${P_SCREEN.top}%`,
              width: `${P_SCREEN.width}%`,
              height: `${P_SCREEN.height}%`,
              overflow: 'hidden',
              borderRadius: 16,
              background: '#f4f4f7',
              zIndex: 1,
            }}
          >
            <S2PhoneApp />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/shots/content/phone-frame.png" alt="" style={{ position: 'relative', display: 'block', width: '100%', zIndex: 2 }} />
        </div>
      </div>
      {/* 잘린 단면 밀착 구획선 — 홈 StepHead 실측 문법 */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px]"
        style={{ background: 'radial-gradient(ellipse 52% 100% at 50% 100%, #8f8f8f 0%, rgba(143,143,143,0.35) 60%, transparent 100%)' }}
      />
    </div>
  );
}

/* 매체 로고 타일 3장 — 배경 = 발행물 사진(옅게), 중앙 = 로고만 크게(흰 배지 래핑·제목 박스·셰이드 없음).
   칸 = Vercel 얇은 1px 테두리 + 옅은 그림자. 로고 = 자작 SVG 글리프 — 매체 표기이지 UI 재현 아님 */
const S2_MEDIA = [
  {
    name: '네이버 블로그',
    img: '/img/content/cake-1.jpg',
    logo: (
      <span className="flex h-[42px] w-[42px] items-center justify-center bg-[#03c75a]" aria-hidden>
        <svg width="21" height="21" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
      </span>
    ),
  },
  {
    name: '인스타그램',
    img: '/img/content/cake-2.jpg',
    logo: (
      /* 공식 앱 아이콘 그라디언트 근사(radial 노랑→주황→핑크 + 우상 보라) — 매체 공식 로고라 §7-7 예외(사장님 2026-07-17 실로고 지시) */
      <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <radialGradient id="s2-ig-a" cx="0.27" cy="1.08" r="1.3">
            <stop offset="0" stopColor="#fdf497" />
            <stop offset="0.09" stopColor="#fdd663" />
            <stop offset="0.45" stopColor="#fd5949" />
            <stop offset="0.6" stopColor="#d6249f" />
            <stop offset="0.9" stopColor="#7638fa" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="5.4" fill="url(#s2-ig-a)" />
        <g fill="none" stroke="#fff" strokeWidth="1.9">
          <rect x="4.6" y="4.6" width="14.8" height="14.8" rx="4.4" />
          <circle cx="12" cy="12" r="3.6" />
        </g>
        <circle cx="17.2" cy="6.8" r="1.15" fill="#fff" />
      </svg>
    ),
  },
  {
    name: '페이스북',
    img: '/img/content/cake-3.jpg',
    logo: (
      <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#1877F2" /><path d="M15.6 12.9l.5-3h-2.9V8c0-.85.4-1.6 1.7-1.6h1.3V3.8s-1.2-.2-2.3-.2c-2.4 0-3.9 1.4-3.9 4v2.3H7.4v3H10v7h3.2v-7z" fill="#fff" /></svg>
    ),
  },
];

/** 매체 로고 타일 행 — 폰 크롭 단면을 덮으며 올라탐(싹둑 마감 겸용) */
function S2MediaChips() {
  return (
    <div className="relative z-10 mx-auto flex w-max gap-2">
      {S2_MEDIA.map((m, i) => (
        <motion.span
          key={m.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.12 }}
          className="relative flex h-[92px] w-[92px] items-center justify-center overflow-hidden bg-white"
          style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}
          role="img"
          aria-label={m.name}
        >
          {/* 배경 사진 원본 + 검정 오버레이로 다크 톤 다운(로고 가독 — 사장님 2026-07-17 "투명도 = 다크지 화이트가 아님") */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={m.img} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <span aria-hidden className="absolute inset-0 bg-black/45" />
          <span className="relative">{m.logo}</span>
        </motion.span>
      ))}
    </div>
  );
}

/** 콜라주 — 폰(상단 크롭) 중앙 + 매체 칩 행이 단면을 덮음. PC·모바일 공용(세로 압축판) */
function S2Collage() {
  return (
    <div role="img" aria-label="누구나 콘텐츠 앱이 블로그·인스타그램·페이스북용 콘텐츠를 준비하는 장면" className="w-full max-w-[340px] md:[zoom:1.22]">
      <div className="mx-auto" style={{ width: P_VISIBLE_W }}>
        <S2Phone />
      </div>
      <div className="-mt-5">
        <S2MediaChips />
      </div>
    </div>
  );
}

/** 검색 브라우저 — 실제 검색결과 레이아웃(검색바+그린 버튼+탭바, ⛔네이버 로고 미사용 §7).
    내 글 제목·사진 = 블로그 채널 카드와 동일(서사 연결) */
function S2SearchWindow() {
  return (
    <div
      className="w-full max-w-[300px] overflow-hidden bg-white"
      style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}
      role="img"
      aria-label="검색 결과에서 발행한 글이 발견되는 화면"
    >
      {/* 크롬 — 공용 Chrome 재사용(검수 #12, 홈 S6 실측 문법) */}
      <Chrome title="통합검색" />

      {/* 검색바 + 그린 검색 버튼 */}
      <div className="flex items-center gap-2 px-4 pt-3.5">
        <S2TypeQuery />
        <span className="flex h-9 w-11 items-center justify-center bg-[#03c75a]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 4.5 4.5" />
          </svg>
        </span>
      </div>

      {/* 탭바 — 블로그 활성 */}
      <div className="mt-2.5 flex gap-4 border-b px-4 text-[12px]" style={{ borderColor: BORDER }}>
        <span className="pb-2 font-medium text-text-weak">전체</span>
        <span className="border-b-2 border-[#171717] pb-2 font-bold text-text-primary">블로그</span>
        <span className="pb-2 font-medium text-text-weak">이미지</span>
        <span className="pb-2 font-medium text-text-weak">지도</span>
      </div>

      {/* 결과① 플레이스 — "블로그만 걸리는 게 아니라 여러 갈래"(사장님 2026-07-17) */}
      <div className="flex items-center gap-2 px-4 pb-3 pt-3">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#171717" strokeWidth="1.5" aria-hidden className="shrink-0"><path d="M10 18s-6-5.1-6-9.5A6 6 0 0 1 16 8.5C16 12.9 10 18 10 18Z" /><circle cx="10" cy="8.5" r="2" /></svg>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-text-primary">성수 소소 <span className="ml-1 font-medium text-text-muted">카페 · 성수동</span></p>
          <p className="truncate text-[11px] text-text-weak">새 소식 · 딸기 케이크가 새로 나왔습니다</p>
        </div>
        <span className="whitespace-nowrap text-[10.5px] font-semibold text-accent">내 가게</span>
      </div>

      <div aria-hidden className="h-[6px] w-full bg-[#f4f5f7]" />

      {/* 사이: 다른 결과 = 스켈레톤(§8.18-C — 내 글이 결과 "중간" = 순위 보장 회피) */}
      <div className="px-4 pb-3 pt-3">
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="rounded-dot h-4 w-4 bg-[#EBEBEB]" />
          <span aria-hidden className="block h-[9px] w-[88px] bg-[#EBEBEB]" />
        </div>
        <span aria-hidden className="mt-2 block h-[11px] w-[62%] bg-[#E4E6E9]" />
      </div>

      <div aria-hidden className="h-[6px] w-full bg-[#f4f5f7]" />

      {/* ★ 내 가게 글(실물 — 블로그 채널 카드와 같은 제목·같은 사진) */}
      <div className="px-4 pb-4 pt-3">
        <div className="flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/cake-2.jpg" alt="" className="rounded-dot h-[18px] w-[18px] object-cover" loading="lazy" />
          <span className="min-w-0 truncate text-[11.5px] font-medium text-text-body">성수 소소</span>
          <span className="whitespace-nowrap text-[11.5px] text-text-muted/80">· 방금 전</span>
          <span className="ml-auto whitespace-nowrap text-[10.5px] font-semibold text-accent">내 가게</span>
        </div>
        {/* 제목 파랑 = accent 단일(검수 #9 — 비토큰 파랑 2종 제거) */}
        <p className="mt-1.5 text-[14.5px] font-bold leading-[1.4] tracking-[-0.01em] text-accent">
          딸기 케이크가 새로 나왔습니다
        </p>
        <div className="mt-2 flex gap-3">
          <p className="min-w-0 flex-1 text-[12.5px] leading-[1.55] tracking-[-0.01em] text-text-body">
            오늘 새로 나온 <b>딸기 케이크</b>를 소개합니다. 생딸기를 아침에 손질해 크림과 함께 올렸어요. 매장에서 준비한 과정을...
          </p>
          <span className="relative h-[76px] w-[76px] shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/cake-1.jpg" alt="" className="h-full w-full object-cover" loading="lazy" />
          </span>
        </div>
      </div>

      <div aria-hidden className="h-[6px] w-full bg-[#f4f5f7]" />

      {/* 아래: 다른 결과 = 스켈레톤(얇게 — 세로 절약) */}
      <div className="px-4 pb-3.5 pt-3">
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="rounded-dot h-4 w-4 bg-[#EBEBEB]" />
          <span aria-hidden className="block h-[9px] w-[76px] bg-[#EBEBEB]" />
        </div>
        <span aria-hidden className="mt-2 block h-[11px] w-[58%] bg-[#E4E6E9]" />
      </div>
    </div>
  );
}

/** PC 전용 수평 커넥터 — §8.15 정본 선(중앙 진하고 양끝 fade, 1.7px) + 흐르는 점 1개(검수 #7 절제) */
/** 검색어 타이핑 — 한 글자씩 스냅 등장(duration 0 = 딱딱. 사장님 2026-07-20 "스르륵 마스크 벗겨지듯 금지").
    reduce 분기 없음(장식 모션 분기 제거 원칙 — 사장님 폰 reduce-motion) */
function S2TypeQuery() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const q = '성수 딸기 케이크';
  return (
    <span ref={ref} className="flex h-9 flex-1 items-center border-2 border-[#03c75a] bg-white px-3 text-[13px] font-medium text-text-primary">
      <span>
        {q.split('').map((ch, i) => (
          <motion.span key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0, delay: 0.5 + i * 0.12 }}>{ch === ' ' ? ' ' : ch}</motion.span>
        ))}
      </span>
      <motion.span aria-hidden className="ml-[2px] inline-block h-[14px] w-[1.5px] bg-[#171717]/70" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }} />
    </span>
  );
}

function S2ConnectorH() {
  /* 2026-07-19 모바일 전수조사: 그라디언트 선+파란 도트 흐름 = 폐기 문법 잔재 → 확정 화살(수평, 검정 1.1px) */
  return (
    <div className="flex w-[120px] shrink-0 items-center justify-center max-md:hidden" aria-hidden>
      {/* 버셀식 원형 버튼 결(사장님 2026-07-20): 흰 원 + 스트로크 보더 + 채운 삼각 화살 */}
      {/* 스트로크 없이 선명한 그림자(사장님 2026-07-20 3차 — 검정 스트로크 "버셀 아님" 반려, 블러 최소) */}
      <span className="rounded-dot flex h-11 w-11 items-center justify-center bg-white" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.12)' }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><line x1="1" y1="6" x2="10" y2="6" stroke="#171717" strokeWidth="1.6" /><path d="M10 1.2L17 6l-7 4.8z" fill="#171717" /></svg>
      </span>
    </div>
  );
}

/** 수직 과정 화살 — 규격 정본 = /ads CtVArrow(확정 화살 문법: 짧은 선 #8B939C 1.5px + 채운 정삼각 8×6.93).
    2026-07-19 사장님 "파란 세로선+도트 애니 = 과정 의미 없는 장식, 잘 보이지도 않음" → 페이지 내
    파이프 커넥터(S2 모바일·S3 소식·S4 스텝) 전부 이 화살로 교체. 정적(애니 없음)이 정답 */
function VArrow({ h = 40, className = '' }: { h?: number; className?: string }) {
  /* 2026-07-19 사장님 "버셀 스타일 깔끔한 화살표로" → Geist 아이콘 문법(채운 삼각 폐기,
     가는 스트로크 선 + V자 화살촉 1.5px round) */
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ height: h }} aria-hidden>
      {/* PC = 짧은 선+채운 삼각(사장님 2026-07-20 "라인 화살은 흐름 전달 약함 — 전 페이지 통일") / 모바일 = 가는 라인(기존) */}
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="hidden md:block"><line x1="7" y1="1" x2="7" y2="11" stroke="#171717" strokeWidth="1.6" /><path d="M1.8 11h10.4L7 19z" fill="#171717" /></svg>
      <svg width="12" height="21" viewBox="0 0 12 21" fill="none" className="md:hidden"><path d="M6 1v18.6M1.5 15.5L6 20l4.5-4.5" stroke="#171717" strokeWidth="1.1" /></svg>
    </div>
  );
}

/** 모바일 전용 세로 이음선 — 화살 문법으로 교체(구 accent 선+glow 도트 폐기) */
function S2ConnectorV() {
  /* 모바일도 PC와 같은 원형 버튼 디자인(사장님 2026-07-20 "화살표 PC 버전으로") — 세로 방향 버전 */
  return (
    <div className="flex justify-center py-4 md:hidden" aria-hidden>
      <span className="rounded-dot flex h-11 w-11 items-center justify-center bg-white" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.12)' }}>
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none"><line x1="6" y1="1" x2="6" y2="10" stroke="#171717" strokeWidth="1.6" /><path d="M1.2 10h9.6L6 17z" fill="#171717" /></svg>
      </span>
    </div>
  );
}

export function ContentS2() {
  /* 폰트·위치 = 다른 섹션(S3·S4)과 동일한 기본 포맷 원복(사장님 2026-07-17 "내용만 빼고 다 원복, 너무 커").
     내용 = buildup 확정 카피 그대로. PC 헤드 2줄 / 모바일 3줄. 비주얼 = 안2(카피 아래 중앙).
     하단 여백 축소(사장님 2026-07-17 "S3 위 공백 과다") */
  return (
    <div className="mx-auto max-w-[1200px] px-12 py-20 max-md:px-6 max-md:py-14">
      <div className="max-w-[560px]">
        {/* 헤딩·서브 = SectionHead 통일 규격(2026-07-18: clamp 38·balance) */}
        <Eyebrow label="Build-up" />
        <h2
          className="hidden text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary text-balance md:block"
          dangerouslySetInnerHTML={{ __html: buildup.heading }}
        />
        <h2
          className="text-[26px] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary md:hidden"
          dangerouslySetInnerHTML={{ __html: buildup.headingMobile }}
        />
        <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-[#4f4f4f] text-balance max-md:text-[15px] md:max-w-[680px] md:leading-[1.35]">{buildup.body}</p>
        {/* PC = 서브 텍스트와 동일 크기 + 볼드(사장님 2026-07-20). 모바일 기존 */}
        <p className="mt-4 text-[16px] font-semibold leading-[1.6] text-text-primary max-md:text-[15px] md:text-[clamp(15px,1.4vw,18px)] md:font-bold">{buildup.closing}</p>
      </div>
      <FadeUp delay={0.1}>
        {/* 무대 = 도트 레이어 + 십자 마커(S4 동일 문법 — 검수 #3 "허공 부유" 해소).
            PC = [폰+채널 콜라주] —수평 점 흐름— [검색창] / 모바일 = 세로(수평 이동 금지 §8.18) */}
        <div className="relative mt-14 px-6 py-10 max-md:mt-10 max-md:px-3 max-md:py-7">
          <DotStage />
          <Plus className="right-0 top-0" />
          <Plus className="bottom-0 left-0" />
          <div className="relative flex items-center justify-center gap-0 max-md:flex-col">
            <S2Collage />
            <S2ConnectorH />
            <S2ConnectorV />
            <S2SearchWindow />
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ═══════════════ S3 · 브리지 — 3포인트 목차 + 항목별 미니 프리뷰(사장님 안3 확정 2026-07-17:
   "태그 없고 줄바꿈 이상하고 그래픽 없음" → Eyebrow + 홈 문법 헤딩 + 아래 섹션들(S4·S5·S6)의 미니 예고편) ═══════════════ */

/* 프리뷰 3종(전폭 리치 장면 — 사장님 2026-07-17 "목업 성의 없음, 소스 써서 제대로. 세로 길어도 됨") */

/** 01 채널마다 꾸준히 — 갤러리 A4 Animated Beam 실사용: 글 카드 → 빔 → 채널 로고 3 */
function BridgeBeamScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  /* 도킹 앵커(2026-07-20 사장님 "선 처리 다시" — 1-4-1 교훈 재사용): 선끝 = 카드 우변/타일 좌변 중앙 */
  const fromA = useRef<HTMLSpanElement>(null);
  const inN = useRef<HTMLSpanElement>(null);
  const inI = useRef<HTMLSpanElement>(null);
  const inY = useRef<HTMLSpanElement>(null);
  const toN = useRef<HTMLDivElement>(null);
  const toI = useRef<HTMLDivElement>(null);
  const toY = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative flex h-[164px] items-center justify-between px-3 md:mx-auto md:h-[250px] md:w-full md:max-w-[860px] md:px-4">
      {/* 글 문서 카드 — 업종 = 에스테틱(업종당 1회 규칙, S2 케이크와 분리). PC 460 확대+정보행(사장님 2026-07-20) */}
      <div ref={fromRef} className="relative z-10 w-[176px] bg-white p-3 md:w-[460px] md:p-4" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
        <span ref={fromA} aria-hidden className="absolute right-0 top-1/2 h-0 w-0" />
        <div className="flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo/nc.svg?v=16" alt="" className="h-[13px] w-[13px]" />
          <span className="text-[10px] font-semibold text-text-body md:text-[12px]">누구나 콘텐츠</span>
        </div>
        <p className="mt-1.5 text-[11.5px] font-bold leading-[1.35] text-text-primary md:text-[16.5px]">가을 수분 관리,<br className="md:hidden" /> 이렇게 준비했어요</p>
        <div className="mt-1.5 flex gap-1.5 md:mt-2.5 md:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-esthetic.jpg" alt="" className="h-9 w-9 shrink-0 object-cover md:h-[84px] md:w-[84px]" loading="lazy" />
          <p className="min-w-0 flex-1 text-[9px] leading-[1.5] text-text-weak md:text-[12.5px] md:leading-[1.6]">
            건조해지는 계절이라 관리 순서를 바꿨습니다. 매장에서<span className="hidden md:inline"> 쓰는 제품과 순서를 그대로 소개합니다. 이번 주 예약 손님께 먼저 안내드려요.</span><span className="md:hidden">…</span>
          </p>
        </div>
        {/* PC 전용 정보행 — 블로그 결(S4 03 문법 재사용) */}
        <div className="mt-3 hidden items-center gap-3 border-t pt-2.5 text-[11px] font-medium text-text-weak md:flex" style={{ borderColor: '#f0f0f0' }}>
          <span className="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#e5484d" strokeWidth="1.5" aria-hidden><path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" /></svg>공감 12</span>
          <span>댓글 3</span>
          <span className="ml-auto text-[10.5px] text-text-muted">방금 전 발행</span>
        </div>
      </div>
      {/* 채널 로고 노드 3 — 타일 확대(사장님 2026-07-20 "아이콘 더 키워도 돼": md 48→64, 로고 30) */}
      <div className="flex flex-col gap-2.5 md:gap-4">
        <div ref={toN} className="relative z-10 flex h-10 w-10 items-center justify-center bg-white md:h-16 md:w-16" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          <span ref={inN} aria-hidden className="absolute left-0 top-1/2 h-0 w-0" />
          <span className="flex h-[22px] w-[22px] items-center justify-center bg-[#03c75a] md:h-[30px] md:w-[30px]">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="#fff" className="md:h-[15px] md:w-[15px]"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
          </span>
        </div>
        <div ref={toI} className="relative z-10 flex h-10 w-10 items-center justify-center bg-white md:h-16 md:w-16" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          <span ref={inI} aria-hidden className="absolute left-0 top-1/2 h-0 w-0" />
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="md:h-[30px] md:w-[30px]">
            <defs>
              <radialGradient id="s3-ig-a" cx="0.27" cy="1.08" r="1.3">
                <stop offset="0" stopColor="#fdf497" /><stop offset="0.09" stopColor="#fdd663" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#7638fa" />
              </radialGradient>
            </defs>
            <rect width="24" height="24" rx="5.4" fill="url(#s3-ig-a)" />
            <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
          </svg>
        </div>
        <div ref={toY} className="relative z-10 flex h-10 w-10 items-center justify-center bg-white md:h-16 md:w-16" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          <span ref={inY} aria-hidden className="absolute left-0 top-1/2 h-0 w-0" />
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="md:h-[30px] md:w-[30px]"><rect x="1" y="4.2" width="22" height="15.6" rx="3.6" fill="#ff0033" /><path d="M9.8 8.8v6.4l5.8-3.2z" fill="#fff" /></svg>
        </div>
      </div>
      {/* 빔 3개 — 도킹 앵커(카드 우변 → 타일 좌변), 완만한 대칭 곡률 */}
      <AnimatedBeam containerRef={containerRef} fromRef={fromA} toRef={inN} curvature={-22} pathColor="#d4d4d4" pathOpacity={0.5} pathWidth={1.5} gradientStartColor="#0070f3" gradientStopColor="#4d9fff" duration={3.6} />
      <AnimatedBeam containerRef={containerRef} fromRef={fromA} toRef={inI} curvature={0} pathColor="#d4d4d4" pathOpacity={0.5} pathWidth={1.5} gradientStartColor="#0070f3" gradientStopColor="#4d9fff" duration={3.6} delay={0.6} />
      <AnimatedBeam containerRef={containerRef} fromRef={fromA} toRef={inY} curvature={22} pathColor="#d4d4d4" pathOpacity={0.5} pathWidth={1.5} gradientStartColor="#0070f3" gradientStopColor="#4d9fff" duration={3.6} delay={1.2} />
      {void fromRef}
    </div>
  );
}

/** 02 흐름을 놓치지 않게 — C1 Border Beam(계속 지켜보는 중) + "글로 읽히는" 완결 문장(사장님 2026-07-17:
    헤더·NC 로고·칸 구분 제거, "네이버 노출은 ~하면 더 유리합니다" 식 문장으로) */
function BridgeNewsScene() {
  return (
    <div className="px-3">
      <div className="relative bg-white px-3.5 py-3" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
        <BorderBeam size={44} duration={5} colorFrom="#0070f3" colorTo="#4d9fff" borderWidth={1.5} />
        <p className="flex items-start gap-2">
          <span className="mt-[2px] flex h-[14px] w-[14px] shrink-0 items-center justify-center bg-[#03c75a] md:h-[17px] md:w-[17px]">
            <svg width="7" height="7" viewBox="0 0 12 12" fill="#fff" className="md:h-[9px] md:w-[9px]"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
          </span>
          <span className="text-[11.5px] font-medium leading-[1.55] text-text-body md:text-[14px]">
            네이버 노출은 <b className="font-bold text-text-primary">실제 방문 경험이 담긴 글</b>이 더 유리합니다
          </span>
        </p>
        <p className="mt-2 flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="mt-[2px] shrink-0 md:h-[17px] md:w-[17px]">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1C3.25 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z" />
          </svg>
          <span className="text-[11.5px] font-medium leading-[1.55] text-text-body md:text-[14px]">
            {/* 2026-07-19 감사 교정: "먼저 보입니다"(노출 순서 보장 뉘앙스) → 상식 서술로 완화 */}
            구글 지도는 <b className="font-bold text-text-primary">사진이 담긴 소식</b>이 눈에 잘 띕니다
          </span>
        </p>
      </div>
      {/* 카드→칩 화살 — 니즈 문법: 요소 사이 꽉 + 양끝 5px(PC 채운 삼각) */}
      <span className="hidden justify-center md:flex" aria-hidden>
        <svg width="14" height="34" viewBox="0 0 14 34" fill="none"><line x1="7" y1="5" x2="7" y2="24" stroke="#171717" strokeWidth="1.6" /><path d="M1.8 24h10.4L7 32z" fill="#171717" /></svg>
      </span>
      <span className="md:hidden"><VArrow h={26} /></span>
      <div className="mx-auto flex w-max items-center gap-1.5 border bg-white px-2.5 py-1.5" style={{ borderColor: BORDER, boxShadow: MINI_SHADOW }}>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="2.2" strokeLinecap="round" aria-hidden className="md:h-[13px] md:w-[13px]"><path d="M3 8.5l3.2 3L13 5" /></svg>
        <span className="text-[10.5px] font-bold text-text-primary md:text-[13px]">다음 글에 반영</span>
      </div>
    </div>
  );
}

/** 03 지도 검색까지 — 제네릭 지도 장면 v2(도로 위계·녹지·지명·정렬 디테일 — 특정 지도앱 UI 재현 아님) */
function BridgeMapScene() {
  return (
    <div className="px-3">
      <div className="relative h-[170px] overflow-hidden" style={{ border: `1px solid ${BORDER}`, background: '#eef1f2', boxShadow: CARD_SHADOW }}>
        {/* 블록(건물 면) + 녹지 — 도로가 지나가지 않는 자리에만 */}
        <span aria-hidden className="absolute left-[5%] top-[8%] h-9 w-16 bg-[#e2e6e8]" />
        <span aria-hidden className="absolute left-[26%] top-[10%] h-7 w-10 bg-[#e2e6e8]" />
        <span aria-hidden className="absolute left-[6%] bottom-[8%] h-10 w-12 bg-[#e2e6e8]" />
        <span aria-hidden className="absolute right-[6%] top-[10%] h-10 w-14 bg-[#dcebdd]" />
        <span aria-hidden className="absolute right-[8%] bottom-[10%] h-9 w-16 bg-[#e2e6e8]" />
        <span aria-hidden className="absolute left-[38%] bottom-[6%] h-7 w-12 bg-[#e2e6e8]" />
        {/* 도로 — 외곽선(연회색) 위 흰 길 = 대로 1 + 골목 2 (위계) */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 340 170" preserveAspectRatio="none" aria-hidden>
          <path d="M-8 104 C 70 84, 150 126, 226 98 S 330 70, 350 84" fill="none" stroke="#d8dde0" strokeWidth="16" />
          <path d="M-8 104 C 70 84, 150 126, 226 98 S 330 70, 350 84" fill="none" stroke="#ffffff" strokeWidth="12" />
          <path d="M118 -8 C 112 44, 132 100, 118 178" fill="none" stroke="#d8dde0" strokeWidth="9" />
          <path d="M118 -8 C 112 44, 132 100, 118 178" fill="none" stroke="#ffffff" strokeWidth="6" />
          <path d="M238 -8 C 244 36, 228 76, 240 118" fill="none" stroke="#d8dde0" strokeWidth="8" />
          <path d="M238 -8 C 244 36, 228 76, 240 118" fill="none" stroke="#ffffff" strokeWidth="5" />
        </svg>
        {/* 지명 — 지도 특유의 옅은 라벨 */}
        <span aria-hidden className="absolute left-[7%] top-[38%] text-[9px] font-medium tracking-[0.06em] text-[#a8b0b5]">성수동 2가</span>
        <span aria-hidden className="absolute right-[9%] top-[42%] text-[8.5px] font-medium tracking-[0.06em] text-[#a8b0b5]">서울숲</span>
        {/* 내 가게 핀 — 대로변, drop-in 1회. 라벨-핀-그림자 중심축 정렬 */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          className="absolute left-[46%] top-[18%] flex -translate-x-1/2 flex-col items-center"
        >
          <div className="flex items-center gap-1 whitespace-nowrap bg-white px-2 py-1" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
            <span className="text-[10.5px] font-bold text-text-primary">달빛 에스테틱</span>
            <span className="text-[9px] font-semibold text-accent">내 가게</span>
          </div>
          {/* 칩→핀 꼬리(맞물림) */}
          <span aria-hidden className="h-[5px] w-px bg-[#c9ced2]" />
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 21.5s-7-5.8-7-10.9A7 7 0 0 1 19 10.6c0 5.1-7 10.9-7 10.9Z" fill="#03c75a" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="12" cy="10.4" r="2.6" fill="#fff" />
          </svg>
          {/* 접지 그림자 — 하드 타원(블러 금지) */}
          <span aria-hidden className="rounded-dot -mt-[3px] block h-[3px] w-[11px] bg-[rgba(15,23,42,0.14)]" />
        </motion.div>
        {/* 구글에도 — 우하단 정식 배지(흰 칩) */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white px-1.5 py-1" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1C3.25 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z" />
          </svg>
          <span className="text-[9px] font-semibold text-text-body">구글 지도에도 함께</span>
        </div>
      </div>
    </div>
  );
}

function BridgeRankScene() {
  return (
    <div className="px-3">
      <div className="overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
        <div className="flex items-center border-b px-3.5 py-2.5" style={{ borderColor: BORDER }}>
          <span className="text-[11px] font-bold text-text-primary">목표 검색어 노출</span>
          <span className="ml-auto text-[9.5px] font-semibold text-accent">오늘 확인</span>
        </div>
        {[
          ['성수동 피부관리', '1페이지', '+4'],
          ['성수 에스테틱', '2페이지', '+2'],
          ['서울숲 피부관리', '아직 안 보임', ''],
        ].map(([keyword, rank, change]) => (
          <div key={keyword} className="flex items-center gap-3 border-b px-3.5 py-3 last:border-b-0" style={{ borderColor: '#f0f0f0' }}>
            <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-text-primary">{keyword}</span>
            <span className={`whitespace-nowrap text-[10.5px] font-bold ${rank === '1페이지' ? 'text-accent' : 'text-text-body'}`}>{rank}</span>
            <span className="w-5 text-right text-[9.5px] font-semibold text-[#16823b]">{change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const BRIDGE_SCENES = [<BridgeBeamScene key="b1" />, <BridgeNewsScene key="b2" />, <BridgeRankScene key="b3" />];

export function ContentS3() {
  return (
    <div className="mx-auto max-w-[1200px] px-12 pb-12 pt-8 max-md:px-6 max-md:pb-10 max-md:pt-6">
      <FadeUp>
        <Eyebrow label="Overview" />
        <h2 className="text-[clamp(22px,2.6vw,30px)] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary">
          검색은 <span className="text-accent">꾸준함</span>이 만듭니다
        </h2>
      </FadeUp>
      {/* GPT 개정(2026-07-18): 동일 크기 카드 3개 금지 → 01 전폭 크게 / 02·03 하단 2열 압축 */}
      <div className="relative mt-7 border-y border-border-default max-md:mt-6">
        <Plus className="-left-[7px] -top-[7px]" />
        <Plus className="-bottom-[7px] -right-[7px]" />
        {/* 01 — 주 장면(전폭) */}
        <FadeUp>
          {/* PC도 위 텍스트+아래 목업(사장님 2026-07-20 "좌 텍스트 세로중앙 = 시각적으로 헷갈려" — 02·03과 동일 세로 문법) */}
          <div className="flex flex-col gap-3 border-b border-border-default px-5 py-6 max-md:px-4 md:gap-5">
            <div className="min-w-0">
              {/* 2026-07-19 위계 통일(안1): 회색 번호 라벨 → 다크 필 태그(S4StepHead·S9FeatHead 규격) + 제목 16px */}
              <p className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="flex h-[22px] items-center px-2 text-[11px] font-bold leading-none tracking-[0.04em] bg-[#171717] text-white" style={EN}>{bridge.cards[0].label}</span>
                <span className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">{bridge.cards[0].title}</span>
              </p>
              <p className="text-[13px] font-medium leading-[1.55] text-text-weak max-md:text-[14px]">{bridge.cards[0].desc}</p>
            </div>
            <div>{BRIDGE_SCENES[0]}</div>
          </div>
        </FadeUp>
        {/* 02·03 — 보조(2열 압축) */}
        <div className="grid grid-cols-2 divide-x divide-border-default max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y">
          {[1, 2].map((i) => (
            <FadeUp key={bridge.cards[i].label} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-4 px-5 py-6 max-md:px-4">
                <div className="min-w-0">
                  <p className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <span className="flex h-[22px] items-center px-2 text-[11px] font-bold leading-none tracking-[0.04em] bg-[#171717] text-white" style={EN}>{bridge.cards[i].label}</span>
                    <span className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">{bridge.cards[i].title}</span>
                  </p>
                  <p className="text-[13px] font-medium leading-[1.55] text-text-weak max-md:text-[14px]">{bridge.cards[i].desc}</p>
                </div>
                <div className="mt-auto">{BRIDGE_SCENES[i]}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ S4 · "입력 하나 → 채널별 발행" — 업로드 창 → 흐름 → 채널 포스트 3형 ═══════════════ */

/** 입력 = 앱 업로드 창(사장님 2026-07-17: 사진 2장 + [+ 사진 추가] 업로드 칸 / 음성 = 녹음 활성(파란 마이크+웨이브) + 받아쓴 지시문) */
/** 업로드 화면.
 *  ★2026-09-18 `batch` 선택 인자 추가(기본 false = 원본 /content 출력 그대로).
 *  true면 "갖고 있던 사진을 한꺼번에 맡긴" 상태 — 사진이 많고, 오늘 찍은 메모 대신 보관함 안내가 뜬다.
 *  /content2 비교 시안에서만 켠다(§0.5 "기본값을 그대로 둔 선택 인자로 필요한 부분만"). */
export function InputCard({ batch = false }: { batch?: boolean } = {}) {
  /* 맡기기 = 한 번에 올린 것이라 장 수가 많다. 같은 업종(펜션)으로 통일해야 "한 가게의 쌓인 사진"으로 읽힌다 */
  const shots = batch
    ? ['/img/content/biz-pension-1.jpg', '/img/content/biz-pension-2.jpg', '/img/content/biz-interior-1.jpg', '/img/content/biz-interior-3.jpg']
    : ['/img/content/biz-pension-1.jpg', '/img/content/biz-pension-2.jpg'];
  return (
    <div className="overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      <Chrome title={batch ? '누구나 콘텐츠 · 사진 보관함' : '누구나 콘텐츠 · 새 글'} />
      <div className="p-4">
        <div className="mb-3 grid grid-cols-3 gap-1.5 md:grid-cols-4 md:gap-2">
          {/* 업종 = 펜션(업종당 1회 규칙 — 케이크는 S2에만). PC = 사진 3장(모바일 꺼 그대로 금지 — 2026-07-20) */}
          {shots.map((src) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={src} src={src} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {!batch && <img src="/img/content/biz-pension-3.jpg" alt="" className="hidden aspect-[4/3] w-full object-cover md:block" loading="lazy" />}
          {/* 사진 추가 칸 — 업로드 UI 관례(점선 + 플러스). 맡기기는 "이미 다 올린" 상태라 대신 남은 장수를 센다 */}
          <span className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-0.5 border border-dashed border-[#c9ced2] bg-[#fafafa]">
            {batch ? (
              <span className="text-[10px] font-bold text-text-weak md:text-[12px]" style={EN}>+38</span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#9297a0" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M10 4v12M4 10h12" /></svg>
            )}
            <span className="text-[8.5px] font-medium text-text-muted md:text-[10px]">{batch ? '한꺼번에 맡김' : '사진 추가'}</span>
          </span>
        </div>
        {batch ? (
          /* 맡기기 = 오늘 메모가 아니라 "맡긴 사진이 글감으로 나뉘는" 상태.
             같은 자리, 같은 문법(파란 테두리 한 줄)을 쓰되 내용만 바꾼다 — 새 상자를 만들지 않는다 */
          <div className="flex items-center gap-2.5 border border-[#0070f3]/40 bg-[#0070f3]/[0.04] py-2 pl-2.5 pr-3">
            <span className="rounded-dot flex h-7 w-7 shrink-0 items-center justify-center bg-[#0070f3]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="square" aria-hidden><path d="M3 5h5l1.5 2H17v9H3z" /></svg>
            </span>
            <span className="min-w-0 flex-1 text-[12px] font-medium leading-[1.45] text-text-primary md:text-[13.5px]">
              추천 글감에 나누어 담는 중 · <b className="font-bold">6편 준비됨</b>
            </span>
          </div>
        ) : (
          /* 음성 녹음 활성 — 파란 마이크 + 웨이브 + 받아쓴 지시문("~해줘") */
          <div className="flex items-center gap-2.5 border border-[#0070f3]/40 bg-[#0070f3]/[0.04] py-2 pl-2.5 pr-3">
            <span className="rounded-dot flex h-7 w-7 shrink-0 items-center justify-center bg-[#0070f3]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.6" aria-hidden><rect x="8" y="3" width="4" height="9" rx="2" /><path d="M5 9v1a5 5 0 0 0 10 0V9M10 15v3" /></svg>
            </span>
            {/* 녹음 웨이브 — 살아있는 입력 중 */}
            <span className="flex shrink-0 items-end gap-[2.5px]" aria-hidden>
              {[7, 12, 9, 14, 6, 11, 8].map((h, i) => (
                <span key={i} className="w-[2.5px] bg-[#0070f3]/70" style={{ height: h, animation: `s4wave 1.1s ease-in-out ${i * 0.12}s infinite alternate` }} />
              ))}
              <style>{`@keyframes s4wave { from { transform: scaleY(0.45); } to { transform: scaleY(1); } }`}</style>
            </span>
            <span className="min-w-0 flex-1 text-[12px] font-medium leading-[1.45] md:text-[13.5px] text-text-primary">
              &ldquo;새로 단장한 객실로 소개글 써줘&rdquo;
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── S4 단계별 실물(사장님 안A 확정 2026-07-17: 텍스트 리스트 중복 폐기 → 단계마다 실물 화면, 03이 주인공) ── */

/** 단계 라벨 — 홈 S41 StepHead 문법 축소판(다크 필 번호 + 볼드 라벨 + 한 줄 설명) */
function S4StepHead({ n, label, desc, dark }: { n: string; label: string; desc: string; dark?: boolean }) {
  return (
    <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={`flex h-[22px] items-center px-2 text-[11px] font-bold leading-none tracking-[0.04em] ${dark ? 'bg-white text-[#171717]' : 'bg-[#171717] text-white'}`} style={EN}>{n}</span>
      <span className={`text-[14.5px] font-bold tracking-[-0.02em] md:text-[16px] ${dark ? 'text-white' : 'text-text-primary'}`}>{label}</span>
      <span className={`text-[12px] font-medium md:text-[13px] ${dark ? 'text-white/55' : 'text-text-weak'}`}>{desc}</span>
    </div>
  );
}

/** 02 완성된 글 문서 — 가게 말투 + 손님이 검색하는 말(accent 하이라이트) 실증 */
function S4ArticleCard() {
  return (
    <div className="overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      <Chrome title="누구나 콘텐츠 · 글 완성" />
      <div className="p-3.5 md:p-4">
        <p className="text-[13.5px] font-bold leading-[1.4] tracking-[-0.01em] text-text-primary md:text-[15.5px]">
          <mark className="bg-[#0070f3]/[0.1] px-0.5 text-text-primary">강릉 오션뷰 펜션</mark>, 객실을 새로 단장했습니다
        </p>
        <p className="mt-2 text-[11.5px] leading-[1.65] text-text-body md:text-[13px]">
          창을 열면 바다가 먼저 보입니다. 침구와 조명을 바꾸고 예약을 다시 열었어요.<span className="hidden md:inline"> 바다가 잘 보이는 2층 객실부터 차례로 열어 둡니다.</span> 이번 주는…
        </p>
      </div>
    </div>
  );
}

/** 03 채널 3형식 비교 — 같은 글이 형식만 바뀜(가로 글 / 정사각 / 링크 공유). 높이 차이 = 형식 차이.
    2026-07-19 감사 교정: 쇼츠 열 제거 — 사진 팬아웃 채널 = 블로그·인스타·페이스북(GENERATION.md,
    "youtube/reels는 범위 밖 — 영상 파이프라인 별도"). 쇼츠는 S9에서 "영상 올리면 전문 편집자"로 정확히 다룸 */
function S4FormatRow({ dark, shorts = false }: { dark?: boolean; shorts?: boolean }) {
  /* 2026-07-20 사장님 "모바일 목업을 PC에 그대로 쓰니 개판" — 이 간이 카드는 모바일 전용으로 강등,
     PC = S4FormatRowPC(실물 게시물 밀도·동일 폭 3카드) */
  const chLabel = dark ? 'text-white/60' : 'text-text-weak';
  return (
    <>
    <S4FormatRowPC dark={dark} shorts={shorts} />
    {/* 모바일 = 3카드 폭·높이 균일(사장님 2026-07-20 "PC처럼 폭 같게" — 이미지 4:3 통일 + items-stretch) */}
    {/* shorts면 2×2 — 390px에서 4칸은 카드가 88px로 좁아져 읽히지 않는다 */}
    <div className={`grid items-stretch gap-2 md:hidden ${shorts ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {/* 블로그 — 가로 글 카드 */}
      <div className="flex flex-col">
        <p className="mb-1.5 flex items-center gap-1">
          <span className="flex h-[13px] w-[13px] items-center justify-center bg-[#03c75a]"><svg width="7" height="7" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg></span>
          <span className={`text-[9.5px] font-semibold ${chLabel}`}>블로그</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-pension-1.jpg" alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <div className="px-2 pb-2 pt-1.5">
            <p className="text-[9.5px] font-bold leading-[1.35] text-text-primary">강릉 오션뷰 펜션, 새 단장을 마쳤습니다</p>
            <p className="mt-1 truncate text-[8.5px] leading-[1.5] text-text-weak">창을 열면 바다가 먼저 보입니다…</p>
          </div>
        </div>
      </div>
      {/* 인스타 — 이미지 + 해시태그 */}
      <div className="flex flex-col">
        <p className="mb-1.5 flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <radialGradient id="s4-ig-a" cx="0.27" cy="1.08" r="1.3">
                <stop offset="0" stopColor="#fdf497" /><stop offset="0.09" stopColor="#fdd663" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#7638fa" />
              </radialGradient>
            </defs>
            <rect width="24" height="24" rx="5.4" fill="url(#s4-ig-a)" />
            <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
          </svg>
          <span className={`text-[9.5px] font-semibold ${chLabel}`}>인스타그램</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-pension-2.jpg" alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <p className="px-2 py-1.5 text-[8.5px] font-medium text-text-weak" style={EN}>#강릉펜션 #오션뷰</p>
        </div>
      </div>
      {/* 페이스북 — 링크 공유 카드 */}
      <div className="flex flex-col">
        <p className="mb-1.5 flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#1877F2" /><path d="M15.6 12.9l.5-3h-2.9V8c0-.85.4-1.6 1.7-1.6h1.3V3.8s-1.2-.2-2.3-.2c-2.4 0-3.9 1.4-3.9 4v2.3H7.4v3H10v7h3.2v-7z" fill="#fff" /></svg>
          <span className={`text-[9.5px] font-semibold ${chLabel}`}>페이스북</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-pension-3.jpg" alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          <div className="flex-1 bg-[#FAFAFA] px-2 pb-1.5 pt-1">
            <p className="text-[7.5px] uppercase tracking-[0.03em] text-text-weak" style={EN}>blog.naver.com</p>
            <p className="mt-0.5 text-[9px] font-bold leading-[1.35] text-text-primary">새 단장한 객실, 예약을 열었습니다</p>
          </div>
        </div>
      </div>
      {/* 쇼츠·릴스 — PC와 같은 갈래(§4.4). 카드 안 "직접 확인 후 발행" = §4.5 */}
      {shorts && (
      <div className="flex flex-col">
        <p className="mb-1.5 flex items-center gap-1">
          <span className="flex h-[13px] w-[13px] items-center justify-center bg-[#171717]"><svg width="6" height="6" viewBox="0 0 24 24" fill="#fff"><path d="M9 6.5 18 12l-9 5.5z" /></svg></span>
          <span className={`text-[9.5px] font-semibold ${chLabel}`}>쇼츠·릴스</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
          <span className="relative block aspect-[4/3] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/biz-pension-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 30%' }} loading="lazy" />
            <span aria-hidden className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: 'rgba(22,22,26,0.55)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><path d="M9 6.5 18 12l-9 5.5z" /></svg>
              </span>
            </span>
          </span>
          <div className="flex-1 bg-[#FAFAFA] px-2 pb-1.5 pt-1">
            <p className="text-[9px] font-bold leading-[1.35] text-text-primary">세로 영상</p>
            <p className="mt-0.5 text-[8px] font-medium text-text-muted">직접 확인 후 발행</p>
          </div>
        </div>
      </div>
      )}
    </div>
    </>
  );
}

/** 03 PC 전용 — 실물 게시물 3카드(사장님 2026-07-20 "카드 크기 제각각·게시물 같지도 않음" 재작업).
    문법 = /ads 인스타 실물 04(프로필·액션·좋아요·캡션 풀 구조). 카피·사진 = 기존 확정분 재사용(지어내기 없음) */
function S4FormatRowPC({ dark, shorts = false }: { dark?: boolean; shorts?: boolean }) {
  const chLabel = dark ? 'text-white/60' : 'text-text-weak';
  const CARD = { border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW } as const;
  return (
    /* 그룹 패널(사장님 2026-07-20 "공통 배경으로 그룹처럼") + 카드 높이 균일(items-stretch).
       03 헤드 = 패널 안 상단 중앙(사장님 2026-07-20 "회색 배경 안에 넣어 그룹처럼" — 그룹 라벨 = 그룹 중앙 원칙) */
    /* mt-6 = 01 카드와 분리(사장님 2026-07-20 "붙었어") — 02→03 화살은 h 64로 연장해 밀착 유지 */
    <div className="hidden border border-[#E7E9EC] bg-[#f4f5f7] p-6 md:mt-6 md:block">
    <div className="mb-6 flex justify-center">
      <S4StepHead n="03" label={multiChannel.steps[2].title} desc={multiChannel.steps[2].desc} dark={dark} />
    </div>
    <div className={`grid items-stretch gap-6 ${shorts ? 'grid-cols-4' : 'grid-cols-3'}`}>
      {/* 블로그 — 네이버 블로그 게시물 결 */}
      <div className="flex flex-col">
        <p className="mb-2 flex items-center gap-1.5">
          <span className="flex h-[15px] w-[15px] items-center justify-center bg-[#03c75a]"><svg width="8" height="8" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg></span>
          <span className={`text-[11.5px] font-semibold ${chLabel}`}>블로그</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={CARD}>
          <div className="flex items-center gap-2 px-3 pt-3">
            <span className="rounded-dot flex h-7 w-7 shrink-0 items-center justify-center bg-[#e9edf2] text-[11px] font-bold text-[#495057]">오</span>
            <span className="min-w-0">
              <span className="block truncate text-[11.5px] font-bold text-text-primary">오션뷰 펜션 이야기</span>
              <span className="block text-[10px] text-text-muted">방금 전</span>
            </span>
          </div>
          <p className="px-3 pt-2.5 text-[14px] font-bold leading-[1.4] tracking-[-0.01em] text-text-primary">강릉 오션뷰 펜션, 객실을 새로 단장했습니다</p>
          <p className="px-3 pb-2.5 pt-1 text-[12px] font-medium leading-[1.55] text-text-body">창을 열면 바다가 먼저 보입니다. 침구와 조명을 바꾸고 예약을 다시 열었어요.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-pension-1.jpg" alt="" className="min-h-[150px] w-full flex-1 object-cover" loading="lazy" />
          <p className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium text-text-muted">
            <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#e03131" strokeWidth="1.5" aria-hidden><path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" /></svg>공감 12</span>
            <span>댓글 3</span>
          </p>
        </div>
      </div>
      {/* 인스타그램 — 피드 게시물(/ads 04 실물 문법) */}
      <div className="flex flex-col">
        <p className="mb-2 flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <radialGradient id="s4p-ig-a" cx="0.27" cy="1.08" r="1.3">
                <stop offset="0" stopColor="#fdf497" /><stop offset="0.09" stopColor="#fdd663" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#7638fa" />
              </radialGradient>
            </defs>
            <rect width="24" height="24" rx="5.4" fill="url(#s4p-ig-a)" />
            <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
          </svg>
          <span className={`text-[11.5px] font-semibold ${chLabel}`}>인스타그램</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={CARD}>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="rounded-dot block h-7 w-7 shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/content/biz-pension-2.jpg" alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[11.5px] font-bold text-text-primary" style={EN}>oceanview_pension</span>
            <span className="text-[11px] tracking-[1px] text-[#666]">···</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-pension-2.jpg" alt="" className="aspect-square w-full object-cover" loading="lazy" />
          <div className="flex items-center gap-3 px-3 pb-1 pt-2.5">
            <svg className="h-[17px] w-[17px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" /></svg>
            <svg className="h-[17px] w-[17px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M2 3h12v7H6l-3 3V10H2V3z" strokeLinejoin="round" strokeLinecap="round" /></svg>
            <svg className="h-[17px] w-[17px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M2 8l12-5-4 12-2.5-5L2 8z" strokeLinejoin="round" strokeLinecap="round" /></svg>
            <svg className="ml-auto h-[17px] w-[17px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M3.5 2h9v12L8 11l-4.5 3V2z" strokeLinejoin="round" strokeLinecap="round" /></svg>
          </div>
          <p className="px-3 pt-1 text-[11.5px] font-bold text-text-primary">좋아요 87개</p>
          <p className="px-3 pb-3 pt-0.5 text-[11.5px] leading-[1.5] text-text-primary">
            <span className="font-bold" style={EN}>oceanview_pension</span> 새로 단장한 객실을 소개합니다 <span className="text-[#00376b]">#강릉펜션 #오션뷰</span>
          </p>
        </div>
      </div>
      {/* 페이스북 — 페이지 게시물(본문 + 링크 프리뷰 + 액션 행) */}
      <div className="flex flex-col">
        <p className="mb-2 flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#1877F2" /><path d="M15.6 12.9l.5-3h-2.9V8c0-.85.4-1.6 1.7-1.6h1.3V3.8s-1.2-.2-2.3-.2c-2.4 0-3.9 1.4-3.9 4v2.3H7.4v3H10v7h3.2v-7z" fill="#fff" /></svg>
          <span className={`text-[11.5px] font-semibold ${chLabel}`}>페이스북</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={CARD}>
          <div className="flex items-center gap-2 px-3 pt-3">
            <span className="rounded-dot flex h-7 w-7 shrink-0 items-center justify-center bg-[#e9edf2] text-[11px] font-bold text-[#495057]">오</span>
            <span className="min-w-0">
              <span className="block truncate text-[11.5px] font-bold text-text-primary">강릉 오션뷰 펜션</span>
              <span className="flex items-center gap-1 text-[10px] text-text-muted">방금 전 ·
                <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#868e96" strokeWidth="1.3" aria-hidden><circle cx="8" cy="8" r="6.5" /><path d="M1.5 8h13M8 1.5c2 1.8 2 11.2 0 13M8 1.5c-2 1.8-2 11.2 0 13" /></svg>
              </span>
            </span>
          </div>
          <p className="px-3 py-2.5 text-[12.5px] font-medium leading-[1.5] text-text-primary">새 단장한 객실, 예약을 열었습니다.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-pension-3.jpg" alt="" className="min-h-[150px] w-full flex-1 object-cover" loading="lazy" />
          <div className="bg-[#f0f2f5] px-3 pb-2 pt-1.5">
            <p className="text-[9.5px] uppercase tracking-[0.03em] text-[#65676b]" style={EN}>blog.naver.com</p>
            <p className="mt-0.5 text-[12px] font-bold leading-[1.35] text-text-primary">강릉 오션뷰 펜션, 객실을 새로 단장했습니다</p>
          </div>
          <div className="mx-3 flex items-center justify-between border-t py-2 text-[11px] font-semibold text-[#65676b]" style={{ borderColor: '#e4e6eb' }}>
            <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#65676b" strokeWidth="1.4" aria-hidden><path d="M5 7.5v6H2.5v-6H5zm0 0l2.8-4.9a1.2 1.2 0 012.2.6V6h3.1a1.2 1.2 0 011.2 1.5l-1.1 4.6a1.6 1.6 0 01-1.6 1.4H5" strokeLinejoin="round" /></svg>좋아요</span>
            <span>댓글</span>
            <span>공유</span>
          </div>
        </div>
      </div>
      {/* ★2026-09-19 쇼츠·릴스 — 개선안 §4.4 "블로그·인스타그램, 쇼츠·릴스를 구분해 보여준다".
          구 화면은 세 카드가 전부 글+이미지라 **영상 갈래가 통째로 없었다**(원본도 마찬가지였다).
          앱 지도 1·41·54번 = 올릴 때 [블로그·인스타]와 [쇼츠·릴스]를 먼저 고르고, 영상은 별도 흐름이다.
          카드 안 "직접 확인 후 발행" = §4.5 "영상은 자동 승인 대상이 아니므로 영상까지 자동 승인하는
          화면이나 문구를 만들지 않는다". 목업 **밖**에 주석 줄을 달지 않으려고 카드 안에 넣었다(§7-9). */}
      {shorts && (
      <div className="flex flex-col">
        <p className="mb-2 flex items-center gap-1.5">
          <span className="flex h-[15px] w-[15px] items-center justify-center bg-[#171717]"><svg width="7" height="7" viewBox="0 0 24 24" fill="#fff"><path d="M9 6.5 18 12l-9 5.5z" /></svg></span>
          <span className={`text-[11.5px] font-semibold ${chLabel}`}>쇼츠·릴스</span>
        </p>
        <div className="flex flex-1 flex-col overflow-hidden bg-white" style={CARD}>
          <span className="relative block flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/biz-pension-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 30%' }} loading="lazy" />
            <span aria-hidden className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(22,22,26,0.55)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#ffffff"><path d="M9 6.5 18 12l-9 5.5z" /></svg>
              </span>
            </span>
            <span aria-hidden className="absolute bottom-2 left-2.5 text-[10px] font-semibold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>세로 영상</span>
          </span>
          <p className="px-3 py-2.5 text-[11px] font-medium text-text-muted">직접 확인 후 발행</p>
        </div>
      </div>
      )}
    </div>
    </div>
  );
}

export function ContentS4({ dark, choice = false, shorts = false }: { dark?: boolean; choice?: boolean; shorts?: boolean }) {
  /* ★2026-09-18 `choice` 선택 인자 — 기본 false면 **원본 /content 출력과 완전히 동일**하다.
     true면 01 스텝의 업로드 화면 위에 "오늘 찍은 사진 / 갖고 있던 사진" 전환이 붙고,
     고르면 업로드 화면 자체가 바뀐다(사진 장수·보관함 제목·하단 줄).
     승인 기획 1(지금 올리기와 맡기기의 차이)을 **기존 장면 안에서** 보여주는 확장이며
     /content2 비교 시안에서만 켠다(§0.5 "기본값을 그대로 둔 선택 인자"). */
  const [batch, setBatch] = useState(false);
  /* dark = 다크 밴드(편집 리듬 매핑 2026-07-18 사장님 "채널이 핵심이라 다크로").
     텍스트·무대·십자·스텝만 반전 — 목업 창(업로드·글·3형식)은 흰 실서비스 화면 유지(다크 위 밝은 제품 창 문법) */
  /* 2026-07-20 PC 전면 개편(사장님 "좌 텍스트 옆 거대 공백" 실사): 구 [좌 텍스트|우 세로 3단] 2단 폐기 →
     텍스트 상단 전폭 + 무대 전폭 가로 3열(01|→|02|→|03). 모바일 DOM = 기존 세로 스택 그대로(max-md 분기) */
  return (
    <div className="mx-auto max-w-[1200px] px-12 py-24 max-md:px-6 max-md:py-20">
      <FadeUp>
        <Eyebrow label="Channels" dark={dark} />
        <h2
          className={`mb-4 text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance max-md:text-[26px] ${dark ? 'text-white' : 'text-text-primary'}`}
          dangerouslySetInnerHTML={{ __html: multiChannel.heading }}
        />
        <p className={`mb-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance max-md:text-[15px] md:max-w-[680px] md:leading-[1.35] ${dark ? 'text-white/60' : 'text-[#4f4f4f]'}`}>{multiChannel.body}</p>
        {/* GPT 개정: 배지 박스 → 짧은 보조 정보 */}
        <p className={`flex items-center gap-1.5 text-[13px] font-semibold ${dark ? 'text-white' : 'text-text-primary'}`}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M3 8.5l3.2 3L13 5" /></svg>
          {multiChannel.badge}
        </p>
      </FadeUp>

      {/* 장면: 도트 무대 전폭 — PC 가로 3열 스텝 / 모바일 세로(기존) */}
      <FadeUp delay={0.08}>
        <div className="relative mt-10 px-8 py-9 max-md:mt-8 max-md:px-3 max-md:py-6">
          <DotStage dark={dark} />
          <Plus className="right-0 top-0" dark={dark} />
          <Plus className="bottom-0 left-0" dark={dark} />
          {/* 2026-07-20 3차 교정(사장님 "화살·카드 폭·03 좌측 여백 어긋남"): 01·02·03 전부 같은 960
              컨테이너 좌우 경계에 스냅 — 01 좌측 = 03 좌측, 02 우측 = 03 우측. 화살 = 행 높이 중앙 */}
          <div className="relative mx-auto w-full max-w-[960px] max-md:max-w-[440px]">
            <div className="grid grid-cols-[1fr_56px_1fr] items-start max-md:block">
              <div className="min-w-0">
                <S4StepHead n="01" label={multiChannel.steps[0].title} desc={multiChannel.steps[0].desc} dark={dark} />
                {choice && (
                  /* 전환 — 스텝 라벨 아래, 업로드 화면 위. 기존 카드 문법(1px 선 + 반전 강조)을 그대로 쓴다 */
                  <div className="mb-2.5 flex w-fit border" style={{ borderColor: BORDER }} role="group" aria-label="자료 준비 방식">
                    {([['now', '오늘 찍은 사진'], ['batch', '갖고 있던 사진']] as const).map(([k, label]) => {
                      const on = (k === 'batch') === batch;
                      return (
                        <button
                          key={k}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setBatch(k === 'batch')}
                          className={`min-h-[40px] px-3.5 text-[12.5px] font-semibold transition-colors md:text-[13px] ${on ? 'bg-[#171717] text-white' : 'bg-white text-text-weak hover:text-text-primary'}`}
                          style={k === 'batch' ? { borderLeft: `1px solid ${BORDER}` } : undefined}
                        >
                          {label}
                          {/* ★2026-09-19 이용 조건 — 앱 지도 358번: "사진 맡기기 **이상 요금제**의 업체가…
                              기본 요금제이면 선택 화면은 문의함으로 보내고, 주소를 직접 열어도 서버가 거부합니다."
                              조건 없이 두 버튼을 나란히 두면 누구나 되는 것처럼 읽힌다(개선안 §4.2 "상위 플랜으로
                              확정되면 해당 조건을 함께 표시한다"). 설명 줄을 밖에 달지 않고 **버튼 안**에 붙인다. */}
                          {k === 'batch' && (
                            <span className={`ml-1.5 align-middle text-[10.5px] font-bold ${on ? 'text-white/70' : 'text-text-muted'}`}>플러스</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                <InputCard batch={choice && batch} />
              </div>
              <div className="hidden h-full items-center justify-center self-stretch md:flex" aria-hidden>
                {/* S4 전용 강한 화살(사장님 2026-07-20 "라인 화살은 흐름이 안 와닿아 — 삼각형, 짧게") */}
                <svg width="56" height="14" viewBox="0 0 56 14" fill="none"><line x1="5" y1="7" x2="43" y2="7" stroke="#171717" strokeWidth="1.6" /><path d="M43 1.8L51 7l-8 5.2z" fill="#171717" /></svg>
              </div>
              <span className="md:hidden"><VArrow h={36} /></span>
              <div className="min-w-0">
                <S4StepHead n="02" label={multiChannel.steps[1].title} desc={multiChannel.steps[1].desc} dark={dark} />
                <S4ArticleCard />
                {/* 02→03 긴 화살 — 카드 바로 아래 밀착(사장님 2026-07-20 "카드에 붙어야지") */}
                <span className="hidden justify-center md:flex" aria-hidden>
                  <svg width="14" height="64" viewBox="0 0 14 64" fill="none"><line x1="7" y1="1" x2="7" y2="55" stroke="#171717" strokeWidth="1.6" /><path d="M1.8 55h10.4L7 63z" fill="#171717" /></svg>
                </span>
              </div>
            </div>
            <span className="md:hidden"><VArrow h={44} /></span>
            <div>
              {/* 03 헤드 = PC에선 그룹 패널 안으로 이동(S4FormatRowPC 내부) — 여기 헤드는 모바일 전용 */}
              <div className="md:hidden">
                <S4StepHead n="03" label={multiChannel.steps[2].title} desc={multiChannel.steps[2].desc} dark={dark} />
              </div>
              <S4FormatRow dark={dark} shorts={shorts} />
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ═══════════════ S5 · 노출 소식 자동 반영(킬러) — ★사장님 확정 흐름도 복원(2026-07-18:
   GPT가 타일+수렴 폐기 지시했으나 사장님 "칭찬했던 흐름도, 다시 놓아라" = 상위 지시).
   구성 = 매체 로고 타일 5 → 수렴선+점 → 소식 카드. 근거 = A14. ⛔보장 문구 금지 */

const S5_SOURCES = [
  {
    name: '네이버',
    logo: (
      <span className="flex h-[30px] w-[30px] items-center justify-center bg-[#03c75a]" aria-hidden>
        <svg width="15" height="15" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
      </span>
    ),
  },
  {
    name: '플레이스',
    logo: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 21.5s-7-5.8-7-10.9A7 7 0 0 1 19 10.6c0 5.1-7 10.9-7 10.9Z" fill="#03c75a" />
        <circle cx="12" cy="10.4" r="2.6" fill="#fff" />
      </svg>
    ),
  },
  {
    name: '인스타그램',
    logo: (
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <radialGradient id="s5-ig-a" cx="0.27" cy="1.08" r="1.3">
            <stop offset="0" stopColor="#fdf497" />
            <stop offset="0.09" stopColor="#fdd663" />
            <stop offset="0.45" stopColor="#fd5949" />
            <stop offset="0.6" stopColor="#d6249f" />
            <stop offset="0.9" stopColor="#7638fa" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="5.4" fill="url(#s5-ig-a)" />
        <g fill="none" stroke="#fff" strokeWidth="1.9">
          <rect x="4.6" y="4.6" width="14.8" height="14.8" rx="4.4" />
          <circle cx="12" cy="12" r="3.6" />
        </g>
        <circle cx="17.2" cy="6.8" r="1.15" fill="#fff" />
      </svg>
    ),
  },
  {
    name: '당근',
    logo: (
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
        <path d="M13.6 8.2C17 9 19.5 12 19 15.2c-.5 3.4-3.8 5.9-7.3 5.3C8.3 20 6 16.7 6.6 13.4c.5-3 3.6-5.8 7-5.2Z" fill="#ff6f0f" />
        <path d="M13.2 8.4c-.3-1.6.3-3.3 1.7-4.4.3 1.1.2 2.3-.4 3.3 1.1-.5 2.4-.6 3.5-.1-1.2 1.2-2.9 1.7-4.4 1.4Z" fill="#00a05e" />
      </svg>
    ),
  },
  {
    name: '구글',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1C3.25 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1z" />
        <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z" />
      </svg>
    ),
  },
];

/* S5 다크 밴드 팔레트(2026-07-18 편집 리듬 매핑 — 페이지 다크 정본 #0a0a0a는 page.tsx 밴드가 담당) */
const S5_DARK_SURFACE = '#151517';
const S5_DARK_EDGE = 'rgba(255,255,255,0.14)';
const S5_DARK_LINE = 'rgba(255,255,255,0.10)';

/** 수렴선 — 타일 5개 하단에서 중앙으로 모임(세로 방향). viewBox 340×88 */
function S5ConvergeSvg({ dark }: { dark?: boolean }) {
  /* 2026-07-20 PC 개편 함정 실증(§8.16-D2): 타일 행만 420으로 넓히고 선 좌표는 340 그대로 → 선이 타일과 어긋남.
     좌표는 타일 행과 반드시 동기화 — 모바일 340 / PC 420 두 벌(id 접두 분리) */
  const xsM = [34, 102, 170, 238, 306];
  const xsP = [40, 125, 210, 295, 380];
  return (
    <>
    <svg viewBox="0 0 420 96" className="mx-auto hidden h-auto w-full max-w-[420px] md:block" aria-hidden>
      {xsP.map((x, i) => (
        <path key={x} id={`s5cw-p${i}`} d={`M${x} 0 C ${x} 48, 210 44, 210 96`} fill="none" stroke={dark ? 'rgba(255,255,255,0.22)' : '#d4d4d4'} strokeWidth="1.4" />
      ))}
    </svg>
    <svg viewBox="0 0 340 88" className="mx-auto h-auto w-full max-w-[340px] md:hidden" aria-hidden>
      {/* 2026-07-19 모바일 전수조사: 파란 도트 흐름 애니 제거(폐기 문법) — 수렴 의미는 곡선이 전달 */}
      {xsM.map((x, i) => (
        <path key={x} id={`s5c-p${i}`} d={`M${x} 0 C ${x} 44, 170 40, 170 88`} fill="none" stroke={dark ? 'rgba(255,255,255,0.22)' : '#d4d4d4'} strokeWidth="1.4" />
      ))}
    </svg>
    </>
  );
}

function S5NewsCard({ dark }: { dark?: boolean }) {
  /* 다크 = 표면·헤어라인·텍스트만 반전, 내용·로고 동일(다크 네이티브 — 흰 상자 부착 금지) */
  const rowLine = dark ? S5_DARK_LINE : '#f4f5f7';
  const bodyText = dark ? 'text-white/80' : 'text-text-body';
  const accentText = dark ? 'text-[#4a9eff]' : 'text-accent';
  return (
    <div
      className={`mx-auto w-full max-w-[400px] md:max-w-[560px] ${dark ? '' : 'bg-white'}`}
      style={dark
        ? { background: S5_DARK_SURFACE, border: `1px solid ${S5_DARK_EDGE}` }
        : { border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}
    >
      <div className="flex items-center gap-2 border-b px-3.5 py-2.5" style={{ borderColor: dark ? S5_DARK_LINE : BORDER }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo/nc.svg?v=16" alt="" className="h-[16px] w-[16px]" />
        <span className={`text-[12px] font-bold tracking-[-0.01em] md:text-[14px] ${dark ? 'text-white' : 'text-text-primary'}`}>이번 주 수집</span>
        <span className={`ml-auto text-[10px] tracking-[0.04em] ${dark ? 'text-white/40' : 'text-text-muted'}`} style={EN}>WEEKLY</span>
      </div>
      {/* 매체 5종 전부 — 채널별 이번 주 소식 한 줄씩(사장님 2026-07-17). 전부 중립 정책 서술(보장 문구 금지) */}
      <ul className="px-3.5 py-1">
        <li className="flex items-center gap-2 border-b py-2.5 md:gap-2.5 md:py-3" style={{ borderColor: rowLine }}>
          <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center bg-[#03c75a]" aria-hidden>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
          </span>
          <span className={`text-[12px] font-semibold leading-[1.45] md:text-[13.5px] ${accentText}`}>검색, 실제 방문 경험이 담긴 글 우대</span>
        </li>
        <li className="flex items-center gap-2 border-b py-2.5 md:gap-2.5 md:py-3" style={{ borderColor: rowLine }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
            <path d="M12 21.5s-7-5.8-7-10.9A7 7 0 0 1 19 10.6c0 5.1-7 10.9-7 10.9Z" fill="#03c75a" />
            <circle cx="12" cy="10.4" r="2.6" fill="#fff" />
          </svg>
          <span className={`text-[12px] font-medium leading-[1.45] md:text-[13.5px] ${bodyText}`}>플레이스, 새 소식 글이 지도 검색에 함께 보임</span>
        </li>
        <li className="flex items-center gap-2 border-b py-2.5 md:gap-2.5 md:py-3" style={{ borderColor: rowLine }}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <defs>
              <radialGradient id="s5n-ig-a" cx="0.27" cy="1.08" r="1.3">
                <stop offset="0" stopColor="#fdf497" /><stop offset="0.09" stopColor="#fdd663" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#7638fa" />
              </radialGradient>
            </defs>
            <rect width="24" height="24" rx="5.4" fill="url(#s5n-ig-a)" />
            <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
          </svg>
          <span className={`text-[12px] font-medium leading-[1.45] md:text-[13.5px] ${bodyText}`}>인스타그램, 릴스 커버 비율 변경</span>
        </li>
        <li className="flex items-center gap-2 border-b py-2.5 md:gap-2.5 md:py-3" style={{ borderColor: rowLine }}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <path d="M13.6 8.2C17 9 19.5 12 19 15.2c-.5 3.4-3.8 5.9-7.3 5.3C8.3 20 6 16.7 6.6 13.4c.5-3 3.6-5.8 7-5.2Z" fill="#ff6f0f" />
            <path d="M13.2 8.4c-.3-1.6.3-3.3 1.7-4.4.3 1.1.2 2.3-.4 3.3 1.1-.5 2.4-.6 3.5-.1-1.2 1.2-2.9 1.7-4.4 1.4Z" fill="#00a05e" />
          </svg>
          <span className={`text-[12px] font-medium leading-[1.45] md:text-[13.5px] ${bodyText}`}>당근, 동네 가게 소식 글 영역이 넓어짐</span>
        </li>
        <li className="flex items-center gap-2 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1C3.25 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z" />
          </svg>
          <span className={`text-[12px] font-medium leading-[1.45] md:text-[13.5px] ${bodyText}`}>지도, 사진이 있는 소식을 더 보여주는 흐름</span>
        </li>
      </ul>
    </div>
  );
}

/* ═══════════════ S7 · 순위 추적(TRACKING) — 사장님 확정 2026-07-17:
   [네이버 검색 API 칩] → 세로 이음선(매일 07:40 수집) → 순위 대시보드 실질 창.
   근거 = A12(검색량 게이트·keywordstool)+A13(매일 07:40·4곳 조회·절대순위 "3페이지 27위"·하락 경고만).
   ⛔ 순위 보장 금지 — 전부 측정·표시 프레임(정직 혼재: 잘 나온 것+못 잡은 것+하락 경고). */

/* S7 v3 — GPT 개정(2026-07-18): 브라우저 크롬·무대·십자 제거(데이터 임팩트), 숫자 확대(28px)·보조 문구 확대(12px),
   카드 안 카드 해소(표 하나). 업종 분산 = 미용실(연남동 — 케이크 편중 해소). ⛔순위 보장 금지(측정 표시) */
/* ★검색량 = keywordstool 실측(2026-07-18 페이블 직접 조회, PC+모바일 합 — 사장님 "실제 검색량으로, 적으면 큰 키워드로 교체").
   실측: 홍대미용실 18,630 / 합정미용실 7,540 / 연남동미용실 3,410. (폐기: 연남동펌 = 월 10회 — 사장님 직감 적중)
   서사 = 연남동 소재 미용실이 상권 키워드까지 추적: 동네(연남동)는 1페이지 accent, 큰 상권(홍대)은 아직 3페이지(정직 혼재).
   순위 숫자는 목업 예시(실순위는 실가게 필요). ▼ 하락 삼각형 폐기(사장님 "제대로 못 할 거면 빼") */
const S7_ROWS = [
  { keyword: '연남동 미용실', volume: '월 3,410회 검색', page: '1페이지', rank: 7, accent: true },
  { keyword: '홍대 미용실', volume: '월 18,630회 검색', page: '3페이지', rank: 27, accent: false },
  { keyword: '합정 미용실', volume: '월 7,540회 검색', page: '2페이지', rank: 14, accent: false },
];

/** 순위 숫자 카운트업 — 진입 시 0→N(0.9s easeOut). "매일 확인하는 살아있는 데이터" 동작화(전수조사 애니 2026-07-20) */
function S7RankNum({ n, accent }: { n: number; accent: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, n]);
  return (
    <span ref={ref} className={`w-[42px] text-right text-[28px] font-extrabold leading-none tracking-[-0.02em] ${accent ? 'text-accent' : 'text-text-primary'}`} style={EN}>{v}</span>
  );
}

/** S7 비주얼 — 표 하나(크롬·무대 없음). 상단 출처 행 + 키워드×큰 순위.
    좌측 정렬 = 헤딩과 같은 축(위계 — 중앙 부유 금지, 2026-07-18 편집 리듬 매핑) */
export function ContentS7Visual() {
  return (
    <div className="w-full max-w-[640px]" role="img" aria-label="검색어별 순위 확인">
      {/* 데이터 소스 — 출처 표식 한 줄 */}
      <div className="flex items-center gap-2 border-b-2 pb-2.5" style={{ borderColor: '#171717' }}>
        <span className="flex h-[16px] w-[16px] items-center justify-center bg-[#03c75a]" aria-hidden>
          <svg width="8" height="8" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
        </span>
        <span className="text-[12px] font-bold tracking-[-0.01em] text-text-primary">네이버 검색 API</span>
        <span className="ml-auto text-[11px] font-medium text-text-muted">매일 확인</span>
      </div>
      {S7_ROWS.map((row) => (
        <div key={row.keyword} className="flex items-center justify-between gap-3 border-b py-4" style={{ borderColor: BORDER }}>
          <div className="min-w-0">
            <p className="text-[14.5px] font-bold tracking-[-0.01em] text-text-primary">{row.keyword}</p>
            <p className="mt-1 text-[12px] font-medium text-text-muted">{row.volume}</p>
          </div>
          {/* 순위 = 주인공 — 고정폭 열 정렬(▼ 하락 표시 폐기) */}
          <div className="flex shrink-0 items-baseline">
            <span className={`w-[52px] text-right text-[12px] font-medium ${row.accent ? 'text-accent' : 'text-text-weak'}`}>{row.page}</span>
            <S7RankNum n={row.rank} accent={row.accent} />
            <span className={`ml-0.5 text-[13px] font-bold ${row.accent ? 'text-accent' : 'text-text-primary'}`}>위</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════ S8 · START — 키워드 깔때기 + 글감 스택(사장님 확정 2026-07-17) ═══════════════
   ① 목표 키워드 원리 = "월 검색량 있는 말 × 우리 업종 × 우리 지역" 깔때기 — 갤러리 C8 Marquee 원본:
     흐르던 칩이 필터를 지날수록 줄고, 마지막엔 멈춰 확정(accent). ⛔내부 수치(월 30 등) 노출 금지.
   ② 글감 = "1년 내내 뭘 올릴지 고민 불필요" + "어떻게 1년치나?"의 답 = 각도를 바꾸는 실물 글감 —
     갤러리 D7 CardStack 원본(카드가 계속 넘어감 = 소재가 마르지 않음을 동작으로). 인수 반응 =
     "정교한 원리로 찾는구나(신뢰)" / "추천대로 사진만 넣으면 되겠네(편의)". */

/** 스텝 아이콘 글리프 — 직각·직선 문법(사장님 2026-07-18 "뭉툭·곡선·작아" 반려 → 곡선 0·miter/square·28px) */
const ICON_CLS = 'h-7 w-7';
const ICON_ATTRS = { fill: 'none', stroke: '#171717', strokeWidth: 1.5, strokeLinecap: 'square', strokeLinejoin: 'miter' } as const;
const S8_ICONS = {
  store: <svg viewBox="0 0 24 24" {...ICON_ATTRS} className={ICON_CLS} aria-hidden><path d="M4 10v10.5h16V10M2.5 10l2.2-6h14.6l2.2 6H2.5ZM9.5 20.5V14h5v6.5" /></svg>,
  pin: <svg viewBox="0 0 24 24" {...ICON_ATTRS} className={ICON_CLS} aria-hidden><path d="M3 5.5 9 3l6 2.5L21 3v15.5L15 21l-6-2.5L3 21V5.5ZM9 3v15.5M15 5.5V21" /></svg>,
  chart: <svg viewBox="0 0 24 24" {...ICON_ATTRS} className={ICON_CLS} aria-hidden><path d="M3.5 3.5v17h17" /><path d="M8 20.5v-7M12.5 20.5V8M17 20.5v-11" strokeWidth="2.2" /></svg>,
  grid: <svg viewBox="0 0 24 24" {...ICON_ATTRS} className={ICON_CLS} aria-hidden><rect x="3.5" y="3.5" width="7.5" height="7.5" /><rect x="13" y="3.5" width="7.5" height="7.5" /><rect x="3.5" y="13" width="7.5" height="7.5" /><rect x="13" y="13" width="7.5" height="7.5" /></svg>,
  docs: <svg viewBox="0 0 24 24" {...ICON_ATTRS} className={ICON_CLS} aria-hidden><path d="M8 3.5h11V17" /><rect x="4.5" y="6.5" width="11" height="14" /><path d="M7.5 10.5h5M7.5 13.5h5M7.5 16.5h3.5" /></svg>,
  calendar: <svg viewBox="0 0 24 24" {...ICON_ATTRS} className={ICON_CLS} aria-hidden><rect x="3.5" y="5.5" width="17" height="15" /><path d="M3.5 10h17M8.5 3v5M15.5 3v5M7.5 14h3M13.5 14h3M7.5 17h3" /></svg>,
} as const;

/** 스텝 행 — 좌측 스파인 노드(번호 필) + 제목/설명 + 우측 아이콘. 스파인은 부모에서 연속으로 그림 */
function S8Step({ n, title, desc, icon, extra }: { n: string; title: string; desc: string; icon: React.ReactNode; extra?: React.ReactNode }) {
  /* 위계(사장님 2026-07-18 "한 번에 안 읽힘·위계 없음·작음"): 제목 15.5 굵게 = 주인공,
     설명 muted로 한 단 뒤로(스캔 시 제목만 튀게), 아이콘 28px 세로 중앙 */
  const delay = (parseInt(n, 10) - 1) * 0.14;
  return (
    <motion.div className="relative flex items-start gap-4 py-4 pl-4 pr-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay }}>
      <span className="z-10 mt-[3px] flex h-[22px] shrink-0 items-center bg-[#171717] px-2 text-[11px] font-bold leading-none tracking-[0.04em] text-white" style={EN}>{n}</span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15.5px] font-bold tracking-[-0.02em] leading-[1.3] text-text-primary">
          {title}
          {extra}
        </p>
        <p className="mt-1 text-[12.5px] font-medium leading-[1.5] text-text-muted">{desc}</p>
      </div>
      <span className="shrink-0 self-center">{icon}</span>
    </motion.div>
  );
}

/** 스텝 묶음 — 번호 필들을 관통하는 연속 세로 스파인(끊긴 선·glow 도트 폐기 — 마감) */
function S8StepGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <span aria-hidden className="absolute bottom-5 left-[30px] top-5 w-px bg-[rgba(15,23,42,0.32)]" />
      {children}
    </div>
  );
}

/** 결과 행 — 파스텔 틴트 금지(§7-7): 흰 배경 + hairline + accent 텍스트만 */
function S8Result({ children }: { children: React.ReactNode }) {
  /* 체크 스트로크 그리기 — 스텝 stagger가 끝난 뒤 확정되는 리듬(전수조사 애니 2026-07-20).
     ⚠ SVG 내부 요소는 whileInView(IntersectionObserver) 감지 불가 실증 → 래퍼 div useInView로 트리거 */
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="flex items-center gap-2 border-t px-4 py-3.5" style={{ borderColor: BORDER }}>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="2.4" strokeLinecap="square" aria-hidden>
        <motion.path d="M3 8.5l3.2 3L13 5" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.45, ease: 'easeOut', delay: 0.55 }} />
      </svg>
      {children}
    </div>
  );
}

/** 상호 검색 UI — 앱 시작 화면(A15: 이름 입력이 전부). 서사의 출발점 */
/* ★2026-09-18 `cta` — 개선안 §4.8 "입력되지 않는 '가게 이름' 검색창 모양은 명확한 버튼으로 바꾼다".
   구 화면은 검색창처럼 생겼는데 **누르거나 입력할 수 없는 그림**이었다(role="img").
   손님이 상호를 넣어 보려다 아무 일도 안 일어나는 자리였다.
   §4.8 문장·버튼 이름은 문서 그대로 쓴다. 요소는 늘지 않는다 — 입력칸이 사라지고 버튼이 남는다. */
function S8SearchBox({ cta = false }: { cta?: boolean } = {}) {
  if (cta) {
    return (
      /* 설명 줄은 두지 않는다 — 구간 제목이 이미 "상호명만 알려주세요"라고 말한다.
         3차 시안에서 "같은 말 3번"을 덜어낸 자리에 다시 한 줄을 쌓지 않는다. */
      <div className="mx-auto flex w-full max-w-[440px] flex-col items-center text-center">
        <a
          href="/start"
          style={{ backgroundColor: '#0070f3', color: '#ffffff' }}
          className="inline-flex h-11 items-center px-6 text-[14px] font-bold tracking-[-0.02em] no-underline"
        >
          한 달 무료로 시작하기
        </a>
      </div>
    );
  }
  return (
    /* 테두리 = 진하게 #AEB4BE(사장님 2026-07-20 "너무 회색" — PC·모바일 공통) */
    <div className="mx-auto flex w-full max-w-[440px] items-center gap-2 bg-white p-2.5" style={{ border: '1px solid #AEB4BE', boxShadow: CARD_SHADOW }} role="img" aria-label="가게 이름을 넣는 앱 시작 화면">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9297a0" strokeWidth="2" strokeLinecap="round" aria-hidden className="ml-1.5 shrink-0">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 4.5 4.5" />
      </svg>
      <span className="min-w-0 flex-1 text-[13.5px] font-medium text-text-muted">상호명만 넣어주세요</span>
      <span className="flex h-9 shrink-0 items-center bg-[#0070f3] px-4 text-[13px] font-bold text-white">검색</span>
    </div>
  );
}

/** 창 연결선 — 2026-07-19 사장님 "스토어(START)도 파란색이잖아" → 확정 화살 문법(VArrow)으로 교체 */
function S8Connect() {
  return <VArrow h={34} />;
}

/** 창 타이틀 행 — Chrome(신호등) 대신 카피 문장이 머리(사장님 2026-07-18) */
function S8CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b px-4 py-3.5 text-[17px] font-bold leading-[1.35] tracking-[-0.03em] text-text-primary" style={{ borderColor: BORDER }}>
      {children}
    </p>
  );
}

/** ① 목표 키워드 = 로직 스텝(★사장님 확정형 복원 — GPT 요약 지시 무시, "스텝 로직이 훨씬 낫다") */
function S8KeywordSteps() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }} role="img" aria-label="목표 키워드를 만드는 과정">
      {/* 2026-07-19 감사 교정: "최적의"(우월 뉘앙스) → 깔때기 원리(업종×지역×검색량)에 맞는 표현 */}
      <S8CardTitle>우리 가게에 맞는<br className="hidden md:block" /> 목표 키워드를 찾아 드립니다</S8CardTitle>
      <S8StepGroup>
        <S8Step n="01" icon={S8_ICONS.store} title="업종 분석" desc="우리 가게가 무엇을 파는 곳인지 파악합니다" />
        <S8Step n="02" icon={S8_ICONS.pin} title="지역 분석" desc="어느 동네 손님이 찾는 가게인지 파악합니다" />
        <S8Step
          n="03"
          icon={S8_ICONS.chart}
          title="월간 검색량 추출"
          desc="업종과 지역에 맞는 말 중 실제로 검색되는 말을 고릅니다"
          extra={
            <span className="flex items-center gap-1 border px-1.5 py-0.5" style={{ borderColor: BORDER }}>
              <span className="flex h-[12px] w-[12px] items-center justify-center bg-[#03c75a]" aria-hidden>
                <svg width="6" height="6" viewBox="0 0 12 12" fill="#fff"><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
              </span>
              <span className="text-[9.5px] font-semibold text-text-body">네이버 검색 API</span>
            </span>
          }
        />
      </S8StepGroup>
      <S8Result>
        <span className="text-[15px] font-bold tracking-[-0.02em] text-accent">가게에 알맞은 목표 키워드 확정</span>
      </S8Result>
    </div>
  );
}

/** ② 1년치 글감 = 같은 원리의 로직 스텝(사장님 확정형 복원) */
function S8TopicSteps({ shoot = false }: { shoot?: boolean } = {}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }} role="img" aria-label={shoot ? '1년치 글감과 촬영 안내를 만드는 과정' : '1년치 글감을 만드는 과정'}>
      {/* 2026-07-19 감사 교정: "52개"는 요식업 한 곳 실증치(업종별 가변, 병원 40편) — 확정 숫자 약속 금지.
          정본(easyStart.topics) 어휘 "1년치 글감을 미리 짜 드립니다"로 복원 */}
      <S8CardTitle>어떤 글을 써야 할지 자동으로 분석해<br />1년치 글감을 미리 짭니다</S8CardTitle>
      <S8StepGroup>
        <S8Step n="01" icon={S8_ICONS.grid} title="콘텐츠 글감 분석" desc="메뉴·재료·공간·계절·손님, 글이 될 재료를 전부 찾습니다" />
        <S8Step n="02" icon={S8_ICONS.docs} title="재료 하나를 여러 글로" desc="메뉴 소개로 시작해 재료 이야기, 가게 이야기까지 넓힙니다" />
        <S8Step n="03" icon={S8_ICONS.calendar} title="1년 달력에 배치" desc="계절과 시기에 맞춰 매주 쓸 글감을 미리 정해 둡니다" />
        {/* ★2026-09-18 `shoot` = 촬영 안내(승인 기획 2의 세 번째 갈래). 기본 false면 원본 그대로 3단계.
            글감에서 "그럼 뭘 찍지"가 이어지므로 04로 붙인다 — 별도 구간을 만들지 않는다 */}
        {shoot && <S8Step n="04" icon={S8_ICONS.pin} title="촬영 안내" desc="글감마다 어떤 사진을 준비하면 좋은지 알려 드립니다" />}
      </S8StepGroup>
      <S8Result>
        <span className="text-[15px] font-bold tracking-[-0.02em] text-accent">
          {shoot ? '무엇을 올릴지도, 무엇을 찍을지도 고민하지 않아도 됩니다' : '무엇을 올릴지 고민하지 않아도 됩니다'}
        </span>
      </S8Result>
    </div>
  );
}

/** S8 비주얼 — 사장님 확정 구조 복원: [검색 UI] → [키워드 스텝 창] → [글감 스텝 창] */
export function ContentS8Visual({ enrich = false }: { enrich?: boolean } = {}) {
  /* 2026-07-20 PC 개편(사장님 "중앙 440 세로 3덩이, 좌우 텅" 실사): PC = 검색창 중앙 → 화살 →
     [키워드 창 | 글감 창] 좌우 2열(세로 반감·전폭 사용). 모바일 = 기존 세로 스택 그대로
     ★2026-09-18 `enrich` 선택 인자 — 기본 false면 원본 그대로. true면
     ①검색창에 Chrome 창머리(앱 화면임을 드러냄) ②글감 창에 04 촬영 안내. /content2에서만 켠다 */
  return (
    <div className="py-2">
      <S8SearchBox cta={enrich} />
      <S8Connect />
      <div className="mx-auto flex max-w-[960px] items-stretch justify-center gap-10 max-md:block">
        <div className="min-w-0 flex-1">
          <S8KeywordSteps />
        </div>
        <span className="md:hidden"><S8Connect /></span>
        <div className="min-w-0 flex-1">
          <S8TopicSteps shoot={enrich} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ S9 · 기능 — 좌 = 구획선 칸 기능 리스트 / 우 = 실서비스 화면(사장님 2026-07-18:
   "왼쪽 텍스트 정렬(구획선 네모칸), 오른쪽 실서비스 화면 차용 — 정교하게 구현했구나 느낌").
   우측 실화면 = 업로드 앱 실물 "썸네일 디자인 고르기" 바텀시트 재현(ThumbnailSheet.tsx·module.css 실측
   + /thumbs 실제 서비스 에셋 6장 — 픽셀 근사 아닌 실코드·실에셋 차용, §8.17 타 프로젝트 실코드 허용) */

/* 기능 5개 확정(사장님 2026-07-18): 사진 질문 = 최중요 맨 위 / 쇼츠 = 프리미엄 배지·전문가 편집 /
   말로 수정·검토·일정·음성 업로드 = 중복·부차로 제외. 행 = [좌 텍스트 | 우 목업] */

/** 행 1 목업 — 사진 질문(실기기 answer 화면 실측: 실제 폴백 질문·placeholder 토씨 그대로, Vercel 마감) */
function S9MockPhotoQnA() {
  return (
    /* PC 통확대 = zoom 1.3(사장님 2026-07-20 "PC인데 글자 너무 작아" — S9 목업 4종 공통) */
    <div className="w-full bg-white md:max-w-[460px] md:[zoom:1.3]" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      <div className="flex items-center gap-1.5 border-b px-3.5 py-2.5" style={{ borderColor: BORDER }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo/nc.svg?v=16" alt="" className="h-[14px] w-[14px]" />
        <span className="text-[11px] font-bold text-text-primary">AI가 물어봐요</span>
      </div>
      {/* 업종 = 꽃집(업종당 1회 규칙 — 사장님 2026-07-18) */}
      <div className="flex gap-3 p-3.5">
        <span className="h-[64px] w-[64px] shrink-0 overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/biz-flower.jpg" alt="" className="h-full w-full object-cover" loading="lazy" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-bold leading-[1.45] tracking-[-0.01em] text-text-primary">이 사진은 무엇인가요? 자랑할 점은?</p>
          <div className="mt-2 border bg-[#fafafa] px-2.5 py-2" style={{ borderColor: BORDER }}>
            <p className="text-[11px] font-medium text-text-primary">이번 주 들어온 작약으로 만든 다발이에요<span className="ml-0.5 inline-block h-[11px] w-[1.5px] translate-y-[1.5px] bg-[#0070f3]" /></p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t bg-white px-3.5 py-2" style={{ borderColor: '#f4f5f7' }}>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M3 8.5l3.2 3L13 5" /></svg>
        <span className="text-[10.5px] font-semibold text-accent">답 한 줄이 글에 더해집니다</span>
      </div>
    </div>
  );
}

/** 발행 전 검토 화면의 핵심 행동 */
function S9MockReview() {
  return (
    <div className="w-full bg-white p-3.5 md:max-w-[460px] md:[zoom:1.3]" style={{ border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}>
      {/* 라벨 색 = 진하게(사장님 2026-07-20 "회색 글자 잘 안 보여") */}
      <p className="text-[10.5px] font-bold text-[#495057]">발행 전 검토</p>
      <p className="mt-1 border-l-2 pl-2.5 text-[12px] font-medium leading-[1.5] text-text-body" style={{ borderColor: '#d4d4d4', ...QUOTE }}>&ldquo;이번 주 들어온 작약으로 만든 꽃다발&rdquo;</p>
      <p className="mt-3 flex items-center gap-1.5">
        <span className="flex h-[14px] items-center bg-[#171717] px-1 text-[8px] font-bold text-white" style={EN}>AI</span>
        <span className="text-[10.5px] font-bold text-[#495057]">완성된 글</span>
      </p>
      <div className="mt-1 border bg-[#fafafa] px-2.5 py-2" style={{ borderColor: BORDER }}>
        {/* PC = 자간 촘촘·한 줄(사장님 2026-07-20 — zoom 1.3이라 시각 크기는 유지됨) */}
        <p className="text-[12px] font-medium leading-[1.55] text-text-primary">내용을 읽고 직접 고치거나, 그대로 발행할 수 있습니다.</p>
      </div>
      <span className="mt-2.5 flex h-8 w-full items-center justify-center bg-[#0070f3] text-[11.5px] font-bold text-white">이대로 올리기</span>
    </div>
  );
}

/** 행 4 목업 — 대표 이미지: **같은 사진 + 같은 제목**에 텍스트 디자인만 다른 5종(사장님 교정 2026-07-18).
    각 디자인 = 실서비스 템플릿 HTML 실측 재현(089 테두리 박스 / 095 캡션+흰 띠 / 100 다크 글래스 / 091 하단 / 104 우측) + "외 10종" */
function S9ThumbBase({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block aspect-square overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      {/* 업종 분산 — 피자(같은 사진에 디자인만 다름) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/unsplash/webp/photo-1565299624946-b28f40a0ae38.webp" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      {children}
    </span>
  );
}

function S9MockThumbs() {
  return (
    /* 모바일 = 꽉 채움(max-w 제한 제거, 사장님 2026-07-20 "왼쪽 치우치고 작아") + PC zoom 1.3 */
    <div className="w-full bg-white p-3 md:max-w-[460px] md:[zoom:1.3]" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      {/* 타이포 오버레이 5종 재디자인(사장님 2026-07-20 "하나도 예쁘지 않아") — 원칙: 글자 크게,
          장식 최소(헤어라인·자간·웨이트 변주만), 스크림은 글자 받침 용도로만 */}
      <div className="grid grid-cols-3 gap-1.5">
        {/* A — 에디토리얼 센터: 넓은 자간 EN 라벨 + 헤어라인 + 큰 제목 */}
        <S9ThumbBase>
          <span aria-hidden className="absolute inset-0 bg-black/45" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-[5px]">
            <span className="text-[4.5px] font-semibold tracking-[0.3em] text-white/85" style={EN}>DONGNE BISTRO</span>
            <span aria-hidden className="block h-[1px] w-[16px] bg-white/80" />
            <span className="text-[12px] font-extrabold tracking-[0.06em] text-white">화덕 피자</span>
          </span>
        </S9ThumbBase>
        {/* B — 하단 좌정렬: 진한 하단 그라디언트 + 좌하 큰 제목 */}
        <S9ThumbBase>
          <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)' }} />
          <span className="absolute inset-x-[9%] bottom-[9%]">
            <span className="block text-[4.5px] font-semibold tracking-[0.22em] text-white/75" style={EN}>SINCE 2019</span>
            <span className="mt-[2px] block text-[12.5px] font-extrabold leading-[1.15] text-white">화덕 피자</span>
          </span>
        </S9ThumbBase>
        {/* C — 헤어라인 프레임: 인셋 프레임 + 중앙 제목 */}
        <S9ThumbBase>
          <span aria-hidden className="absolute inset-0 bg-black/35" />
          <span aria-hidden className="absolute inset-[7%] border border-white/85" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-[3px]">
            <span className="text-[11.5px] font-bold tracking-[0.14em] text-white">화덕 피자</span>
            <span className="text-[4px] font-semibold tracking-[0.26em] text-white/80" style={EN}>WOOD FIRED</span>
          </span>
        </S9ThumbBase>
        {/* D — 우측 세로 타이포(구 상단 화이트 밴드 = 카드 흰 배경과 붙어 보여 교체, 사장님 2026-07-20) */}
        <S9ThumbBase>
          <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(0,0,0,0) 32%, rgba(0,0,0,0.62) 100%)' }} />
          <span className="absolute right-[7%] top-1/2 -translate-y-1/2 whitespace-nowrap text-[11.5px] font-extrabold tracking-[0.3em] text-white" style={{ writingMode: 'vertical-rl' }}>화덕 피자</span>
        </S9ThumbBase>
        {/* E — 하단 다크 밴드: 제목 + 우측 EN 캡션 */}
        <S9ThumbBase>
          <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between bg-[rgba(10,10,14,0.88)] px-[8%] py-[6px]">
            <span className="text-[10px] font-extrabold text-white">화덕 피자</span>
            <span className="text-[4px] font-semibold tracking-[0.2em] text-white/70" style={EN}>BISTRO</span>
          </span>
        </S9ThumbBase>
        {/* 더 많은 디자인 */}
        <span className="flex aspect-square flex-col items-center justify-center gap-0.5 bg-[#fafafa]" style={{ border: `1px solid ${BORDER}` }}>
          <span className="text-[13px] font-extrabold leading-none text-text-primary" style={EN}>+10</span>
          <span className="text-[7px] font-medium text-text-muted">더 많은 디자인</span>
        </span>
      </div>
      {/* (하단 작은 회색 캡션 = 삭제 — 사장님 2026-07-20 "작은 글씨 지우라고 했잖아" 공통 원칙 재확인) */}
    </div>
  );
}

function S9MockSchedule() {
  const rows = [
    ['9월 8일 오전 10시', '순두부짬뽕을 찾는 이유', '예약'],
    ['9월 4일 오후 7시', '탕수육 한 접시', '발행'],
    ['9월 1일 오전 11시', '속초 청학동에서 20년', '발행'],
  ];
  return (
    <div className="w-full overflow-hidden bg-white md:max-w-[460px] md:[zoom:1.3]" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      <div className="flex items-center border-b px-3.5 py-2.5" style={{ borderColor: BORDER }}>
        <span className="text-[11px] font-bold text-text-primary">발행 일정</span>
        <span className="ml-auto text-[9.5px] font-semibold text-accent">앞으로 1건</span>
      </div>
      {rows.map(([date, title, state]) => (
        <div key={title} className="flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0" style={{ borderColor: '#f0f0f0' }}>
          <span className="w-[82px] shrink-0 text-[9.5px] font-medium text-text-weak">{date}</span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-text-primary">{title}</span>
          <span className={`text-[9.5px] font-bold ${state === '예약' ? 'text-accent' : 'text-[#16823b]'}`}>{state}</span>
        </div>
      ))}
    </div>
  );
}

/** 기능 머리 — 안1(사장님 2026-07-19 "위계 인식 안 됨·제목 크기 불일치" → 번호 문법 + 단일 규격):
    번호 태그 = S4StepHead 실측 규격 그대로(h-22 다크 필·11px EN) + 제목 16px·서브 13px 통일(구 16.5/15/17 혼재 해소).
    01~05 연속 번호 = "다섯 기능이 한 묶음" 신호(모바일 세로 스크롤에서도 소속 유지) */
function S9FeatHead({ n, title, sub, dark, badge }: { n: string; title: string; sub: string; dark?: boolean; badge?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span className={`flex h-[22px] items-center px-2 text-[11px] font-bold leading-none tracking-[0.04em] ${dark ? 'bg-white text-[#171717]' : 'bg-[#171717] text-white'}`} style={EN}>{n}</span>
        <span className={`text-[16px] font-bold tracking-[-0.02em] ${dark ? 'text-white' : 'text-text-primary'}`}>{title}</span>
        {badge}
      </p>
      <p className={`mt-1.5 max-w-[400px] text-[13px] font-medium leading-[1.55] md:leading-[1.35] ${dark ? 'text-white/70' : 'text-text-weak'}`}>{sub}</p>
    </div>
  );
}

/** S9 전체 — GPT 개정(2026-07-18): 동일 형식 5행 반복 폐기 → 3묶음, 묶음마다 레이아웃 상이 */
export function ContentS9Grid() {
  return (
    <div className="flex flex-col gap-14 max-md:gap-10">
      {/* 01~04 = 균일 2×2 그리드(2026-07-20 니즈 종합 재설계 — 구 페어 행 = 좌 텍스트 세로중앙 부유로
          거대 공백(§8.16-A6 위반)·목업 크기 제각각 반려. 셀 = 번호 헤드 위 + 목업 아래 꽉, S4·카탈로그 문법 통일) */}
      <FadeUp>
        <div className="grid grid-cols-2 gap-x-10 gap-y-12 max-md:grid-cols-1 max-md:gap-y-10">
          <div>
            <S9FeatHead n="01" title="사진에 대해 물어봐요" sub="사진만으로 애매하면 AI가 먼저 물어봅니다. 답 한 줄이 더해질수록 글은 더 정확하고 풍성해집니다." />
            <div className="mt-4 max-md:mt-3"><S9MockPhotoQnA /></div>
          </div>
          <div>
            <S9FeatHead n="02" title="대표 이미지 만들기" sub="다양한 디자인 중에 고르면 사진과 제목이 얹힌 대표 이미지가 됩니다." />
            <div className="mt-4 max-md:mt-3"><S9MockThumbs /></div>
          </div>
          <div>
            <S9FeatHead n="03" title="발행 전에 직접 확인" sub="완성된 글을 읽고 고치거나, 그대로 발행할 수 있습니다." />
            <div className="mt-4 max-md:mt-3"><S9MockReview /></div>
          </div>
          <div>
            <S9FeatHead n="04" title="발행 일정과 이력" sub="앞으로 나갈 글과 이미 발행된 글을 날짜순으로 확인합니다." />
            <div className="mt-4 max-md:mt-3"><S9MockSchedule /></div>
          </div>
        </div>
      </FadeUp>

      {/* 앱 안 문의는 제품의 마지막 안전망이므로 한 단 크게 보여준다. */}
      <FadeUp>
        <div className="relative overflow-hidden px-6 pb-6 pt-7 max-md:px-5" style={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.16)' }}>
          <BorderBeam size={180} duration={9} colorFrom="#0070f3" colorTo="#4d9fff" borderWidth={1.5} />
          <S9FeatHead
            n="05"
            dark
            title="앱 안에서 바로 문의"
            sub="문제가 생긴 화면과 사진을 함께 보내면, 답변이 같은 문의함에 도착합니다."
            badge={
              <span className="flex h-[20px] items-center bg-[#0070f3] px-2 text-[10px] font-bold tracking-[0.06em] text-white" style={EN}>
                SUPPORT
              </span>
            }
          />
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 border border-white/15 bg-white/[0.06] p-4 max-md:grid-cols-1">
            <div>
              <p className="text-[12px] font-bold text-white">글 표지가 이상하게 보여요</p>
              <p className="mt-1 text-[11px] leading-[1.55] text-white/65">현재 화면과 사진 2장이 함께 전달됐어요.</p>
              <div className="mt-3 flex gap-2">
                {['현재 화면', '원본 사진'].map((label) => <span key={label} className="border border-white/20 px-2 py-1 text-[9.5px] font-semibold text-white/70">{label}</span>)}
              </div>
            </div>
            <div className="flex min-w-[180px] flex-col justify-center border-l border-white/15 pl-4 max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-4">
              <p className="text-[10px] font-semibold text-[#4d9fff]">답변 도착</p>
              <p className="mt-1 text-[11px] font-medium leading-[1.5] text-white">확인했습니다. 다시 열면 수정된 표지가 보여요.</p>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ═══════════════ S10 · 자산 — 홈 S6 "고객님의 블로그" 창 실물 + 갤러리 D6 MinimalCard 원본 ═══════════════ */

/* 업종 = 인테리어(업종당 1회·비요식 — 사장님 2026-07-18. 블로그 마케팅 대표 업종) */
const S10_POSTS = [
  { title: '거실 조명, 이렇게 골랐습니다', date: '4월 2일', img: '/img/content/biz-interior-1.jpg' },
  { title: '작은 방을 넓어 보이게 한 시공', date: '3월 26일', img: '/img/content/biz-interior-2.jpg' },
  { title: '침실 무드를 바꾼 한 가지', date: '3월 19일', img: '/img/content/biz-interior-3.jpg' },
  { title: '라탄으로 톤을 맞춘 거실', date: '3월 12일', img: '/img/content/biz-interior-4.jpg' },
];

export function ContentS10Visual() {
  return (
    <div className="mx-auto w-full max-w-[400px] overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }} role="img" aria-label="고객님의 블로그에 쌓인 글">
      {/* 브라우저 크롬 — 홈 S6 실측(신호등 + 자물쇠 + 고객님의 블로그) */}
      <div className="relative flex h-9 items-center border-b px-3.5" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-1">
          <span className="rounded-dot h-[9px] w-[9px] bg-[#ec6a5e]" />
          <span className="rounded-dot h-[9px] w-[9px] bg-[#f4bf4f]" />
          <span className="rounded-dot h-[9px] w-[9px] bg-[#61c454]" />
        </div>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[11.5px] text-[#7d7d7d]">
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none" aria-hidden>
            <rect x="2.2" y="5.6" width="8.6" height="6" rx="1.2" stroke="#7d7d7d" strokeWidth="1.1" />
            <path d="M4.1 5.4V4a2.4 2.4 0 0 1 4.8 0v1.4" stroke="#7d7d7d" strokeWidth="1.1" />
          </svg>
          고객님의 블로그
        </span>
      </div>
      {/* 글 컬렉션 — 갤러리 D6 MinimalCard 원본(다층 그림자 마감) */}
      <div className="grid grid-cols-2 gap-2.5 px-3.5 pb-3.5 pt-3.5">
        {S10_POSTS.map((p) => (
          <MinimalCard key={p.title} className="p-1.5">
            <MinimalCardImage src={p.img} alt="" className="mb-2 h-[72px]" />
            <MinimalCardTitle className="mt-0 px-0.5 text-[11px] leading-[1.35]">{p.title}</MinimalCardTitle>
            <MinimalCardDescription className="mt-0.5 px-0.5 pb-1 text-[9.5px]">{p.date}</MinimalCardDescription>
          </MinimalCard>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ S11 · CTA 다크 — 갤러리 B1 Background Beams 원본 배경 + S8 검색 UI 다크 재수신 ═══════════════ */

/* ★2026-09-18 `cta` — §4.8은 마지막 CTA에도 걸린다. 여기는 링크가 걸려 있어 눌리기는 하지만
   **검색창 모양**이라 "가게 이름을 넣는 칸"으로 읽힌다(넣을 수 없다).
   시안에서는 같은 자리·같은 문장으로 두되 생김새만 버튼으로 바꾼다. 기본값이면 원본 그대로다. */
export function ContentS11Cta({ cta = false }: { cta?: boolean } = {}) {
  return (
    <div className="relative overflow-hidden px-6 pb-36 pt-24 text-center max-md:px-5 max-md:pb-28 max-md:pt-16" style={{ backgroundColor: '#0a0a0a' }}>
      {/* 하단 pb 확대 — GPT: 플로팅 N 버튼이 입력창을 가리지 않게 */}
      <BackgroundBeams className="opacity-70" />
      <div className="relative z-10">
        <h2 className="text-[clamp(28px,3.8vw,44px)] font-semibold leading-[1.18] tracking-[-0.035em] text-white">
          오늘 가게 이름만
          <br />
          {/* cta면 아래에 입력칸이 아니라 버튼이 온다 — 제목이 "입력해 보세요"면 없는 칸을 가리킨다 */}
          {cta ? '알려주세요' : '한 번 입력해 보세요'}
        </h2>
        {/* S8 검색 UI의 다크 버전 — 페이지가 검색으로 시작한 서사를 CTA가 다시 받음 */}
        {cta ? (
          <a
            href="/start"
            style={{ backgroundColor: '#ffffff', color: '#171717' }}
            className="mx-auto mt-9 inline-flex h-12 items-center px-7 text-[15px] font-bold tracking-[-0.02em] no-underline max-md:mt-7"
          >
            한 달 무료로 시작하기
          </a>
        ) : (
        <a href="/start" className="mx-auto mt-9 flex w-full max-w-[420px] items-center gap-2 bg-white p-2 max-md:mt-7">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9297a0" strokeWidth="2" strokeLinecap="round" aria-hidden className="ml-2 shrink-0">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 4.5 4.5" />
          </svg>
          <span className="min-w-0 flex-1 text-left text-[14px] font-medium text-text-muted">가게 이름</span>
          <span className="flex h-10 shrink-0 items-center bg-[#0070f3] px-4 text-[13.5px] font-bold text-white">한 달 무료로 시작</span>
        </a>
        )}
        <p className="mt-4 text-[12.5px] font-medium text-white/45">카드 등록 없이 시작합니다</p>
      </div>
    </div>
  );
}

/** S5 비주얼 — 사장님 확정 흐름도(타일 5 → 수렴 → 소식 카드) 복원 */
export function ContentS5Visual({ dark }: { dark?: boolean }) {
  return (
    <div className="py-2">
      <div className="mx-auto flex w-full max-w-[340px] justify-between md:max-w-[420px]">
        {S5_SOURCES.map((s, i) => (
          <motion.span
            key={s.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.1 + i * 0.08 }}
            className={`flex h-[52px] w-[52px] items-center justify-center md:h-16 md:w-16 ${dark ? '' : 'bg-white'}`}
            style={dark
              ? { background: S5_DARK_SURFACE, border: `1px solid ${S5_DARK_EDGE}` }
              : { border: `1px solid ${BORDER}`, boxShadow: MINI_SHADOW }}
            role="img"
            aria-label={s.name}
          >
            {s.logo}
          </motion.span>
        ))}
      </div>
      <S5ConvergeSvg dark={dark} />
      <S5NewsCard dark={dark} />
    </div>
  );
}
