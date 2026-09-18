'use client';

import { motion } from 'framer-motion';

/**
 * S4-1 모바일 목업 — "사진 4장 → 자동 글 → 검색 발견" 세로 정렬 3단 (7차 개정, 2026-07-14)
 * 메시지: "검색할 때 우리 가게를 찾을 수 있도록"
 *
 * ▣ 7차 개정(사장님): ①번호 pill 약함 → Vercel StoryStep 문법(큰 EN 숫자 + 라벨, 왼쪽 축 고정)
 *   ②"누가 글을 쓰는지" 불명 → 01 = 사진 4장 업로드 장면(폰), 02 = NC가 자동 완성한 글 문서
 *   ③지그재그 배치 → 좌측 정렬 축 통일, 위→아래 = 순서. 겹침은 세로 절약용으로만(살짝).
 *   같은 사진·같은 제목이 01→02→03에 재등장 = 화살표 없는 서사 연결.
 * ▣ 원복: 직전 버전 = S41SearchScene.v18-overlap.bak (cp로 즉시 복원 가능)
 * ⛔ 내 가게 글 = 검색 결과 "중간"(순위 보장 회피). 네이버 브랜드 마크 미사용(결과 문법만).
 */

/* 화면 개구부 = 캔버스 알파 스캔 실측 인셋 */
const SCREEN = { left: 31.7, top: 12.35, width: 35.9, height: 74.7 };
const FRAME_W = 673;
const PHONE_W = Math.round(FRAME_W * 0.386); // ≈ 260
const PHONE_LEFT = -Math.round(FRAME_W * 0.304);
const PHONE_TOP = -Math.round(FRAME_W * 0.1105);
const APP_SCALE = (FRAME_W * 0.359) / 1080; // ≈ 0.2237

const BORDER = '#ECECEC';
const LINK = '#2f6fd8';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* 업로드할 사진 4장 — 02 문서·03 검색 결과에 재등장(서사 연결) */
const PHOTOS = [
  '/img/unsplash/webp/photo-1504674900247-0877df9cc836.webp',
  '/img/unsplash/webp/photo-1414235077428-338989a2e8c0.webp',
  '/img/unsplash/webp/photo-1567620905732-2d1ec7ab7445.webp',
  '/img/unsplash/webp/photo-1546069901-ba9599a7e63c.webp',
];

/* 단계 헤더 — Vercel StoryStep 문법: 큰 EN 숫자(옅게) + 한글 라벨. 왼쪽 축 고정 = 순서. */
/* 단계 헤드 = 다크 필 뱃지 + 굵은 라벨, 단계 사이 hairline 구획(사장님 2026-07-15 "구획·뱃지로 가독") */
function StepHead({ n, label, first }: { n: string; label: string; first?: boolean }) {
  /* 구획선 = 직전 목업 잘린 단면에 밀착 + 중앙 도톰·양끝 fade(사장님 2026-07-15 "중간은 조금 굵고 양옆 얇아지게") */
  return (
    /* 구획선(top-0)은 모바일에서도 잘린 이미지에 밀착 — 숨은 선 아래 pt로(사장님 2026-07-15 "떨어져서 싹둑 잘린 느낌") */
    <div className={first ? 'mb-3.5' : 'relative mb-3.5 pt-8 max-md:pt-12'}>
      {!first && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: 'radial-gradient(ellipse 52% 100% at 50% 0%, #8f8f8f 0%, rgba(143,143,143,0.35) 60%, transparent 100%)' }}
        />
      )}
      <div className="flex items-center gap-3">
        <span
          className="flex h-[26px] items-center bg-[#171717] px-2.5 text-[13px] font-bold leading-none tracking-[0.04em] text-white"
          style={{ fontFamily: 'var(--font-en)' }}
        >
          {n}
        </span>
        <span className="text-[16.5px] font-bold leading-none tracking-[-0.02em] text-text-primary">{label}</span>
        {/* 제품 표식 반복(Toss 문법) — 모바일 컨텍스트 재공급("이 단계가 어느 제품 것인지"). PC 숨김 */}
        <span className="ml-auto flex items-center gap-1.5 md:hidden">
          <span aria-hidden className="rounded-dot h-[6px] w-[6px] bg-[#0070f3]" />
          <span className="text-[11px] font-medium tracking-[-0.01em] text-[#6b7280]">누구나 콘텐츠</span>
        </span>
      </div>
    </div>
  );
}

const STEP_MOTION = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: EASE, delay },
});

/* part 지정 시 해당 단계만 렌더. hideHead = StepHead 생략(모바일 스텝 탭이 라벨을 대신 — 2026-07-15).
   part 모드 = h-full flex-col: StepHead는 칸 상단 Y 통일, 목업은 남은 공간 세로 중앙(my-auto) */
export default function S41SearchScene({ part, hideHead, loop = false }: { part?: 1 | 2 | 3; hideHead?: boolean; loop?: boolean }) {
  return (
    <div className={part ? 'mx-auto flex w-full max-w-[380px] flex-col' : 'mx-auto w-full max-w-[380px]'} role="img" aria-label="사진 몇 장을 올리면 채널에 맞는 글이 되고, 검색 위치까지 확인하는 3단계 장면">
      {/* ── 01 사진 4장만 올리면 — 폰 업로드 화면(상단 크롭) ── */}
      {(part === undefined || part === 1) && (
      <motion.div {...STEP_MOTION(0)} className={part ? 'relative flex flex-col' : 'relative z-10'}>
        {!hideHead && <StepHead n="01" label="사진 몇 장만 올리면" first />}
        <div
          className={part ? 'mx-auto overflow-hidden' : 'mx-auto overflow-hidden'}
          style={{
            /* 페이드 대신 하드 컷 — 마감은 다음 StepHead의 밀착 구획선이 담당(이중선 방지, 2026-07-15) */
            width: PHONE_W,
            height: 300,
          }}
          aria-hidden
        >
          <div style={{ position: 'relative', width: FRAME_W, left: PHONE_LEFT, top: PHONE_TOP, filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.13))' }}>
            <div
              style={{
                position: 'absolute',
                left: `${SCREEN.left}%`,
                top: `${SCREEN.top}%`,
                width: `${SCREEN.width}%`,
                height: `${SCREEN.height}%`,
                overflow: 'hidden',
                borderRadius: 22,
                background: '#f4f4f7',
                zIndex: 1,
              }}
            >
              {/* 업로드 화면 — 실사 좌표 1080 기준 × scale */}
              <div
                style={{
                  width: 1080,
                  transformOrigin: '0 0',
                  transform: `scale(${APP_SCALE})`,
                  fontFamily: 'var(--font-kr)',
                  padding: '155px 90px 0',
                  boxSizing: 'border-box',
                }}
              >
                <p style={{ fontSize: 30, color: '#7a7a82', margin: 0 }}>사진·메모</p>
                <p style={{ fontSize: 54, fontWeight: 800, color: '#16161a', letterSpacing: '-0.02em', margin: '10px 0 0' }}>
                  오늘 사진 올리기
                </p>
                <p style={{ fontSize: 30, color: '#7a7a82', margin: '16px 0 0' }}>주제 없이 사진만 올려도 글이 돼요</p>

                {/* 사진 그리드 2×2 — 선택 체크 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginTop: 44 }}>
                  {PHOTOS.map((src, i) => (
                    <span key={src} style={{ position: 'relative', display: 'block', height: 395, borderRadius: 36, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <span
                        style={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          width: 64,
                          height: 64,
                          borderRadius: 999,
                          background: '#0070f3',
                          border: '5px solid #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5 10 17.5 19 7.5" />
                        </svg>
                      </span>
                      <span aria-hidden style={{ position: 'absolute', bottom: 20, left: 20, padding: '8px 18px', borderRadius: 999, background: 'rgba(22,22,26,0.55)', color: '#fff', fontSize: 24 }}>
                        {i === 0 ? '오늘 신메뉴' : i === 1 ? '매장' : i === 2 ? '디저트' : '샐러드'}
                      </span>
                    </span>
                  ))}
                </div>

                {/* 올리기 버튼 */}
                <div
                  style={{
                    marginTop: 40,
                    height: 128,
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, #0070f3 0%, #0058c0 100%)',
                    boxShadow: '0 10px 28px rgba(0,88,192,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 40,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {/* ★2026-09-18 "사진 4장 올리기" → 장수를 빼 라벨과 맞춤(§4.9). 그림은 4장 그대로다 */}
                  사진 올리기
                </div>
              </div>
              {/* 유리 글레어 */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(125deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 12%, rgba(255,255,255,0) 32%)',
                }}
              />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/shots/content/phone-frame.png" alt="" aria-hidden style={{ position: 'relative', display: 'block', width: '100%', zIndex: 2 }} />
          </div>
        </div>
      </motion.div>

      )}

      {/* ── 02 글이 자동으로 완성되고 — NC 문서 카드(같은 사진·같은 제목) ── */}
      {(part === undefined || part === 2) && (
      <motion.div {...STEP_MOTION(0.22)} className={part ? 'relative flex flex-col' : 'relative z-20'}>
        {/* 3열(part) 배치 = 칸 경계가 구획이므로 first 스타일(세로 스택에서만 border-t 구획) */}
        {!hideHead && <StepHead n="02" label="채널에 맞는 글이 되고" first={part !== undefined} />}
        <div
          className={part ? 'w-full overflow-hidden rounded-[12px] bg-white px-4 pb-4 pt-3.5' : 'overflow-hidden rounded-[12px] bg-white px-4 pb-4 pt-3.5'}
          style={{ border: `1px solid ${BORDER}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05), 0 14px 30px rgba(0,0,0,0.09)' }}
        >
          <div className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/nc.svg?v=16" alt="" className="h-[15px] w-[15px]" />
            <span className="text-[11px] font-semibold tracking-[-0.01em] text-text-body">누구나 콘텐츠</span>
            <span className="ml-auto text-[10px] tracking-[0.04em] text-text-muted" style={{ fontFamily: 'var(--font-en)' }}>
              DRAFT → DONE
            </span>
          </div>
          <div className="mt-2.5 flex gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold leading-[1.4] tracking-[-0.01em] text-text-primary">
                공릉동 파스타 봄 신메뉴 3종,
                <br />
                이렇게 준비했습니다
              </p>
              <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-[1.55] text-text-body">
                직접 뽑은 생면으로 만든 파스타 세 가지를 소개합니다. 재료 손질부터 플레이팅까지 매장에서 준비한 과정을 담았어요.
              </p>
            </div>
            {/* 01의 첫 사진이 글 대표 이미지로 재등장 */}
            <span className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[9px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTOS[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
          </div>
        </div>
      </motion.div>

      )}

      {/* ── 03 검색에서 찾아져요 — 검색 브라우저(같은 제목·같은 사진 발견) ── */}
      {(part === undefined || part === 3) && (
      <motion.div {...STEP_MOTION(0.44)} className={part ? 'relative flex flex-col' : 'relative z-30'}>
        {!hideHead && <StepHead n="03" label="검색 위치까지 확인합니다" first={part !== undefined} />}
        <div
          className={part ? 'w-full overflow-hidden rounded-[12px] bg-white' : 'overflow-hidden rounded-[12px] bg-white'}
          style={{ border: `1px solid ${BORDER}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05), 0 18px 40px rgba(0,0,0,0.10)' }}
        >
          {/* 크롬: 신호등 + 검색 pill */}
          <div className="flex h-10 items-center gap-3 border-b px-3.5" style={{ borderColor: BORDER }}>
            <span className="flex items-center gap-1">
              <span className="h-[9px] w-[9px] rounded-full bg-[#ec6a5e]" />
              <span className="h-[9px] w-[9px] rounded-full bg-[#f4bf4f]" />
              <span className="h-[9px] w-[9px] rounded-full bg-[#61c454]" />
            </span>
            <span className="flex h-[22px] flex-1 items-center gap-1.5 rounded-full bg-[#f2f3f5] px-3 text-[12px] font-medium text-text-primary">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7d7d7d" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 4.5 4.5" />
              </svg>
              공릉동 파스타
            </span>
          </div>

          {/* 위: 다른 블로그 결과 = 스켈레톤(사장님 2026-07-15 "페이드 말고 스켈레톤, PC도 바꿔 페이드 뭐든 다 싫어").
              내 가게 글만 실제, 나머지는 스켈레톤 = "다른 결과들 사이에서 내 가게가 보인다" */}
          <div className="px-4 pb-3 pt-3">
            <div className="flex items-center gap-1.5">
              <span aria-hidden className="rounded-dot h-4 w-4 bg-[#EBECEF]" />
              <span aria-hidden className="block h-[9px] w-[88px] bg-[#EBECEF]" />
            </div>
            <span aria-hidden className="mt-2 block h-[11px] w-[62%] bg-[#E4E6E9]" />
            <span aria-hidden className="mt-1.5 block h-[9px] w-[82%] bg-[#EDEEF0]" />
          </div>

          <div aria-hidden className="h-[6px] w-full bg-[#f4f5f7]" />

          {/* ★ 내 가게 블로그 글(메인) */}
          <div className="px-4 pb-4 pt-3">
            <div className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/unsplash/webp/photo-1551218808-94e220e084d2.webp" alt="" className="h-[18px] w-[18px] rounded-full object-cover" loading="lazy" />
              <span className="min-w-0 truncate text-[11.5px] font-medium text-text-body">고객님의 파스타 일기</span>
              <span className="whitespace-nowrap text-[11.5px] text-text-muted/80">· 2일 전</span>
              <span className="ml-auto whitespace-nowrap text-[10.5px] font-semibold text-accent">내 가게</span>
            </div>
            <p className="mt-1.5 text-[14.5px] font-bold leading-[1.4] tracking-[-0.01em]" style={{ color: LINK }}>
              <span style={{ color: '#1f5bd0' }}>공릉동 파스타</span> 봄 신메뉴 3종,
              <br />
              이렇게 준비했습니다
            </p>
            <div className="mt-2 flex gap-3">
              <p className="min-w-0 flex-1 text-[12.5px] leading-[1.55] tracking-[-0.01em] text-text-body">
                직접 뽑은 생면으로 만든 <b>파스타</b> 세 가지를 소개합니다. 재료 손질부터 플레이팅까지, 매장에서 준비한 과정을 담았어요. 이번 주부터...
              </p>
              <span className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[10px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute bottom-1 right-1 rounded-[4px] bg-black/55 px-1 text-[10px] font-medium leading-[14px] text-white">4</span>
              </span>
            </div>
          </div>

          <div aria-hidden className="h-[6px] w-full bg-[#f4f5f7]" />

          {/* 아래: 다른 결과 = 스켈레톤(페이드 전면 제거 — 사장님 "페이드 뭐든 다 싫어") */}
          <div className="px-4 pb-4 pt-3">
            <div className="flex items-center gap-1.5">
              <span aria-hidden className="rounded-dot h-4 w-4 bg-[#EBECEF]" />
              <span aria-hidden className="block h-[9px] w-[76px] bg-[#EBECEF]" />
            </div>
            <span aria-hidden className="mt-2 block h-[11px] w-[58%] bg-[#E4E6E9]" />
            <span aria-hidden className="mt-1.5 block h-[9px] w-[70%] bg-[#EDEEF0]" />
          </div>
        </div>
        {/* ★2026-09-18 `loop` = 콘텐츠 순환의 마지막 고리(개선안 §3.4).
            기본 false면 원본 홈 출력 그대로. 구 홈은 "검색 위치 확인"에서 끝나 §3.4가
            "단순 글 작성 도구와의 차이"라 한 **다음 콘텐츠 반영**이 화면에 없었다.
            → 별도 구간·새 단계를 만들지 않고 03 장면 바로 아래 한 줄로 받는다. */}
        {loop && (
          <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold leading-[1.45] text-text-primary">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="1.8" strokeLinecap="square" aria-hidden className="shrink-0">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
            아직 보이지 않는 검색어는 다음에 쓸 글감이 됩니다
          </p>
        )}
      </motion.div>
      )}
    </div>
  );
}
