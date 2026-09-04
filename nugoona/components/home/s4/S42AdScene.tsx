'use client';

import { motion } from 'framer-motion';

/**
 * S4-2 모바일 목업 — "광고를 만들고 → 성과 한 화면 → 챗봇에 질문" 3단 (2026-07-14, S4-1과 대구)
 * 메시지: "광고를 만들고 운영하는 일을 / 누구나 할 수 있도록"
 *
 * ▣ 가게 = 패션 스토어(사장님 확정 — 누구나 광고 타깃 = 스토어·셀러·브랜드).
 *   브랜드·상품 = 기존 가상 자산 재사용(메르시블룸 · 플라워 패턴 쉬폰 원피스 = EvidenceTrend 매핑,
 *   사진 photo-1572804013309 = S3 챗봇 "이번 주 대표 소재"와 동일 → 홈 전체 서사 연결).
 * ▣ 골격 = S41SearchScene과 동일(큰 EN 숫자 01/02/03 왼쪽 축 + framer 순차 등장 + 같은 소재 관통).
 *   02 대시보드 = 실사(app-dashboard-mobile.jpg) 좌표·수치 재현(순매출 2,334,000 · ROAS 1007% 등 —
 *   기존 AdScene 라이브 수치 관례). 03 챗봇 = AdChatMock perf 대화 재사용(미니).
 * ⛔ ROAS 등 수치 = 화면 예시 표시 관례(성과 보장 문구 아님). 순위·보장 표현 없음.
 */

const SCREEN = { left: 31.7, top: 12.35, width: 35.9, height: 74.7 };
const FRAME_W = 673;
const PHONE_W = Math.round(FRAME_W * 0.386);
const PHONE_LEFT = -Math.round(FRAME_W * 0.304);
const PHONE_TOP = -Math.round(FRAME_W * 0.1105);
const APP_SCALE = (FRAME_W * 0.359) / 1080;

const BORDER = '#ECECEC';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* 광고 소재 — 사장님 기준(2026-07-14): 모델 필수(머리~바스트/니샷) · 스튜디오/단색 배경(야외 화보 ✗)
   · 채도 높고 밝게(모노크롬 톤 속 팝) · 상품 상세페이지에 어울리는 룩. 전 후보 눈으로 선별. */
const AD_PHOTO = '/img/unsplash/webp/photo-1554412933-514a83d2f3c8.webp'; // 블랙 코트 니샷 + 화이트·레드 사선 스튜디오
const MEDIA_LIST = [
  AD_PHOTO,
  '/img/unsplash/webp/photo-1488426862026-3ee34a7d66df.webp', // 핑크 벽 + 데님 자켓(바스트)
  '/img/unsplash/webp/photo-1517841905240-472988babdf9.webp', // 블루 벽 + 데님·후디(니샷)
  '/img/unsplash/webp/photo-1529626455594-4ff0802cfb7e.webp', // 청록 프레임 벽 + 흰 티(바스트)
];

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
        {/* 제품 표식 반복(Toss 문법) — 모바일 컨텍스트 재공급. PC 숨김 */}
        <span className="ml-auto flex items-center gap-1.5 md:hidden">
          <span aria-hidden className="rounded-dot h-[6px] w-[6px] bg-[#0aa5c9]" />
          <span className="text-[11px] font-medium tracking-[-0.01em] text-[#6b7280]">누구나 광고</span>
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
export default function S42AdScene({ part, hideHead }: { part?: 1 | 2 | 3; hideHead?: boolean }) {
  return (
    <div className={part ? 'mx-auto flex w-full max-w-[380px] flex-col' : 'mx-auto w-full max-w-[380px]'} role="img" aria-label="광고 소재를 만들고, 성과를 한 화면에서 보고, 궁금한 것은 챗봇에게 묻는 3단계 장면">
      {/* ── 01 광고를 만들고 — AdCanvas 실제 편집 UI 재현(ngn_dashboard ImageCropper.tsx 실측 구조:
           비율 선택 → 크롭 캔버스(드래그·줌) → 줌 슬라이더 → 크롭 적용. "여기서 광고를 만든다"는 도구감) ── */}
      {(part === undefined || part === 1) && (
      <motion.div {...STEP_MOTION(0)} className={part ? 'relative flex flex-col' : 'relative z-10'}>
        {!hideHead && <StepHead n="01" label="광고를 만들고" first />}
        {/* 폰 프레임 안 크롭 화면 — 모바일에서도 실제로 크롭함(사장님). 실사 1080 좌표 × scale, 패딩 90 = 내부 여백 */}
        <div
          className={part ? 'mx-auto overflow-hidden' : 'mx-auto overflow-hidden'}
          style={{
            /* 페이드 대신 하드 컷 — 마감은 다음 StepHead의 밀착 구획선이 담당(이중선 방지, 2026-07-15) */
            width: PHONE_W,
            height: 272,
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
              <div
                style={{
                  width: 1080,
                  transformOrigin: '0 0',
                  transform: `scale(${APP_SCALE})`,
                  fontFamily: 'var(--font-kr)',
                  padding: '150px 90px 0',
                  boxSizing: 'border-box',
                }}
              >
                {/* 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 44, fontWeight: 800, color: '#16161a', letterSpacing: '-0.02em', margin: 0 }}>광고 소재 만들기</p>
                  <p style={{ fontSize: 28, letterSpacing: '0.05em', color: '#7a7a82', margin: 0, fontFamily: 'var(--font-en)' }}>STEP 2 / 3</p>
                </div>

                {/* 비율 선택 */}
                <div style={{ display: 'flex', gap: 16, marginTop: 30, alignItems: 'center' }}>
                  {['1:1', '4:5', '9:16'].map((r) => (
                    <span
                      key={r}
                      style={{
                        padding: '14px 30px',
                        borderRadius: 18,
                        fontSize: 32,
                        fontWeight: 700,
                        fontFamily: 'var(--font-en)',
                        background: r === '4:5' ? '#0070f3' : '#eceef1',
                        color: r === '4:5' ? '#fff' : '#4a4a52',
                      }}
                    >
                      {r}
                    </span>
                  ))}
                  <span style={{ marginLeft: 'auto', fontSize: 26, color: '#7a7a82' }}>피드 4:5</span>
                </div>

                {/* 작업 영역: 좌 미디어 목록 + 우 다크 배경 4:5 캔버스 */}
                <div style={{ display: 'flex', gap: 24, marginTop: 30 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 140, flexShrink: 0 }}>
                    {MEDIA_LIST.map((src, i) => (
                      <span
                        key={src}
                        style={{
                          position: 'relative',
                          display: 'block',
                          height: 140,
                          borderRadius: 20,
                          overflow: 'hidden',
                          ...(i === 0 ? { boxShadow: 'inset 0 0 0 6px #0070f3' } : { opacity: 0.55 }),
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                        {i === 0 && (
                          <span style={{ position: 'absolute', top: 8, right: 8, width: 44, height: 44, borderRadius: 999, background: '#0070f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12.5 10 17.5 19 7.5" />
                            </svg>
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 28, background: '#17181c', padding: '36px 0' }}>
                    {/* 크롭 밖 원본 힌트 */}
                    <span aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 560, height: 640, borderRadius: 18, overflow: 'hidden', opacity: 0.22 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={AD_PHOTO} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    </span>
                    {/* 4:5 크롭 캔버스 */}
                    <span style={{ position: 'relative', display: 'block', width: 440, height: 550, borderRadius: 10, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={AD_PHOTO} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                      <span aria-hidden style={{ position: 'absolute', inset: 0 }}>
                        <span style={{ position: 'absolute', left: '33.3%', top: 0, height: '100%', width: 2, background: 'rgba(255,255,255,0.35)' }} />
                        <span style={{ position: 'absolute', left: '66.6%', top: 0, height: '100%', width: 2, background: 'rgba(255,255,255,0.35)' }} />
                        <span style={{ position: 'absolute', left: 0, top: '33.3%', height: 2, width: '100%', background: 'rgba(255,255,255,0.35)' }} />
                        <span style={{ position: 'absolute', left: 0, top: '66.6%', height: 2, width: '100%', background: 'rgba(255,255,255,0.35)' }} />
                      </span>
                      <span aria-hidden style={{ position: 'absolute', inset: 12 }}>
                        {[
                          { left: 0, top: 0, borderLeft: '6px solid #fff', borderTop: '6px solid #fff' },
                          { right: 0, top: 0, borderRight: '6px solid #fff', borderTop: '6px solid #fff' },
                          { left: 0, bottom: 0, borderLeft: '6px solid #fff', borderBottom: '6px solid #fff' },
                          { right: 0, bottom: 0, borderRight: '6px solid #fff', borderBottom: '6px solid #fff' },
                        ].map((s, i) => (
                          <span key={i} style={{ position: 'absolute', width: 42, height: 42, ...s }} />
                        ))}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 줌 슬라이더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 34 }}>
                  <span style={{ fontSize: 28, color: '#7a7a82' }}>줌</span>
                  <span style={{ position: 'relative', flex: 1, height: 8, borderRadius: 999, background: '#e4e6ea' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '38%', borderRadius: 999, background: '#0070f3' }} />
                    <span style={{ position: 'absolute', left: '38%', top: '50%', transform: 'translate(-50%, -50%)', width: 34, height: 34, borderRadius: 999, background: '#fff', border: '4px solid #0070f3', boxShadow: '0 3px 8px rgba(0,0,0,0.15)' }} />
                  </span>
                  <span style={{ fontSize: 28, color: '#7a7a82', fontFamily: 'var(--font-en)' }}>120%</span>
                </div>

                {/* 액션 */}
                <div style={{ display: 'flex', gap: 20, marginTop: 32 }}>
                  <span style={{ flex: 1, height: 96, borderRadius: 22, background: '#eceef1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#4a4a52' }}>취소</span>
                  <span style={{ flex: 1, height: 96, borderRadius: 22, background: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#fff' }}>크롭 적용</span>
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

      {/* ── 02 성과를 한 화면에서 보고 — 폰 대시보드(실사 좌표·수치 재현) ── */}
      {(part === undefined || part === 2) && (
      <motion.div {...STEP_MOTION(0.22)} className={part ? 'relative flex flex-col' : 'relative z-20'}>
        {/* 3열(part) 배치 = 칸 경계가 구획이므로 first 스타일(세로 스택에서만 border-t 구획) */}
        {!hideHead && <StepHead n="02" label="성과를 한 화면에서 보고" first={part !== undefined} />}
        <div
          className={part ? 'mx-auto overflow-hidden' : 'mx-auto overflow-hidden'}
          style={{
            /* 페이드 대신 하드 컷 — 마감은 다음 StepHead의 밀착 구획선이 담당(이중선 방지, 2026-07-15) */
            width: PHONE_W,
            height: 258,
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
              {/* 대시보드 — 실사(1080) 좌표·수치 재현 */}
              <div
                style={{
                  width: 1080,
                  transformOrigin: '0 0',
                  transform: `scale(${APP_SCALE})`,
                  fontFamily: 'var(--font-kr)',
                  padding: '150px 90px 0',
                  boxSizing: 'border-box',
                }}
              >
                {/* 헤더: NGN + 기간 오늘 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <span style={{ width: 84, height: 84, borderRadius: 24, background: '#16161a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, fontFamily: 'var(--font-en)' }}>N</span>
                  <span style={{ fontSize: 44, fontWeight: 800, color: '#16161a', letterSpacing: '-0.01em', fontFamily: 'var(--font-en)' }}>NGN</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 30px', borderRadius: 999, background: '#ffffff', boxShadow: '0 2px 10px rgba(20,20,30,0.07)', fontSize: 30, color: '#16161a' }}>
                    기간 <b>오늘</b> <span style={{ color: '#7a7a82' }}>▾</span>
                  </span>
                </div>
                <p style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, color: '#4a4a52', margin: '30px 0 0' }}>
                  <span style={{ width: 16, height: 16, borderRadius: 999, background: '#22c55e' }} />
                  최종 업데이트 2026년 7월 14일 3시 15분
                </p>

                {/* 순매출 카드 */}
                <div style={{ marginTop: 34, padding: '42px 50px 46px', borderRadius: 44, background: '#ffffff', boxShadow: '0 8px 24px rgba(20,20,30,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 34, fontWeight: 800, color: '#16161a', margin: 0 }}>순매출</p>
                    <p style={{ fontSize: 28, color: '#7a7a82', margin: 0 }}>7월 14일 (화)</p>
                  </div>
                  <p style={{ fontSize: 76, fontWeight: 800, color: '#16161a', letterSpacing: '-0.02em', margin: '14px 0 0', fontFamily: 'var(--font-en)' }}>
                    2,334,000<span style={{ fontSize: 32, fontWeight: 500, color: '#7a7a82', fontFamily: 'var(--font-kr)' }}>원</span>
                  </p>
                </div>

                {/* KPI 3칸 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 26 }}>
                  {[
                    { l: '주문수', v: '16', u: '건' },
                    { l: '방문자', v: '275', u: '명' },
                    { l: '전환율', v: '5.82', u: '%' },
                  ].map((k) => (
                    <div key={k.l} style={{ padding: '34px 36px 38px', borderRadius: 40, background: '#ffffff', boxShadow: '0 6px 20px rgba(20,20,30,0.05)' }}>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#16161a', margin: 0 }}>{k.l}</p>
                      <p style={{ fontSize: 52, fontWeight: 800, color: '#16161a', margin: '18px 0 0', fontFamily: 'var(--font-en)' }}>
                        {k.v}
                        <span style={{ fontSize: 26, fontWeight: 500, color: '#7a7a82', fontFamily: 'var(--font-kr)' }}>{k.u}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* 광고 성과 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 44 }}>
                  <p style={{ fontSize: 40, fontWeight: 800, color: '#16161a', margin: 0 }}>광고 성과</p>
                  <span style={{ padding: '12px 26px', borderRadius: 999, background: '#ffffff', boxShadow: '0 2px 10px rgba(20,20,30,0.06)', fontSize: 26, color: '#16161a' }}>매체별</span>
                </div>
                <div style={{ marginTop: 24, padding: '38px 50px', borderRadius: 44, background: '#ffffff', boxShadow: '0 8px 24px rgba(20,20,30,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                    <span style={{ width: 64, height: 64, borderRadius: 18, background: '#16161a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 }}>전</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 32, fontWeight: 800, color: '#16161a', margin: 0 }}>전체</p>
                      <p style={{ fontSize: 26, color: '#7a7a82', margin: '6px 0 0' }}>광고비 345,106원 · 구매 47건</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 22, letterSpacing: '0.1em', color: '#a5a5ad', margin: 0, fontFamily: 'var(--font-en)' }}>ROAS</p>
                      <p style={{ fontSize: 52, fontWeight: 800, color: '#16161a', margin: 0, fontFamily: 'var(--font-en)' }}>1007<span style={{ fontSize: 28 }}>%</span></p>
                    </div>
                  </div>
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

      {/* ── 03 궁금한 건 바로 물어보면 — AI 챗봇 문답(AdChatMock perf 대화 재사용) ── */}
      {(part === undefined || part === 3) && (
      <motion.div {...STEP_MOTION(0.44)} className={part ? 'relative flex flex-col' : 'relative z-30'}>
        {!hideHead && <StepHead n="03" label="궁금한 건 바로 물어봐요" first={part !== undefined} />}
        <div
          className={part ? 'w-full overflow-hidden rounded-[14px]' : 'overflow-hidden rounded-[14px]'}
          style={{ background: '#eef1f4', border: `1px solid ${BORDER}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05), 0 14px 30px rgba(0,0,0,0.09)' }}
        >
          <div className="flex flex-col gap-3 px-4 py-4">
            {/* 사용자 질문 — accent 1곳 */}
            <div className="flex items-end justify-end gap-1.5">
              <span className="mb-0.5 text-[10.5px] text-text-muted" style={{ fontFamily: 'var(--font-en)' }}>
                오후 2:14
              </span>
              <div className="max-w-[76%] rounded-[16px] rounded-br-[5px] bg-accent px-3.5 py-2">
                <p className="text-[13px] leading-[1.45] tracking-[-0.01em] text-white">이 광고 지금 잘 되고 있나요?</p>
              </div>
            </div>
            {/* 광고 도우미 답변 */}
            <div className="flex items-start gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#334155]">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="8" width="16" height="11" rx="3" />
                  <path d="M12 5v3" />
                  <circle cx="12" cy="4" r="1" fill="#ffffff" stroke="none" />
                  <circle cx="9.5" cy="13" r="1" fill="#ffffff" stroke="none" />
                  <circle cx="14.5" cy="13" r="1" fill="#ffffff" stroke="none" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="mb-1 pl-1 text-[11px] tracking-[-0.01em] text-text-muted">광고 도우미</p>
                <div className="flex items-end gap-1.5">
                  <div className="max-w-[240px] rounded-[16px] rounded-tl-[5px] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <p className="text-[13px] leading-[1.55] tracking-[-0.01em] text-text-primary">
                      네, 지난주보다 주문이 늘었어요.
                      <br />
                      광고비 <b className="text-accent">1만 원당 3.2명</b>이 장바구니에 담았어요.
                    </p>
                  </div>
                  <span className="mb-0.5 shrink-0 text-[10.5px] text-text-muted" style={{ fontFamily: 'var(--font-en)' }}>
                    오후 2:15
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
}
