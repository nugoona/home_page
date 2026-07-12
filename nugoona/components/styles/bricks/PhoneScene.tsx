'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   콘텐츠 "장면" — 실제 아이폰 목업 PNG(Vecteezy, 화면·배경 투명)에 앱 홈 스샷을 끼움.
   프레임은 위 레이어, 스샷은 화면 영역(측정: 4000px 기준 폰 bbox L1216 T442 R2761 B3539)에 배치.
   사장님 방향 2026-07-12: "모바일 캡은 다운받아" → 실사 목업 사용.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* 화면 영역(프레임 PNG 대비 %) — 베젤 안쪽. 렌더로 미세조정한 값. */
const SCREEN = { left: 31.6, top: 12.4, width: 36.2, height: 73.6 };

export default function PhoneScene() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1080px] px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* 좌: 로고 + 카피 + 바로가기 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="inline-flex items-center gap-2.5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/nc.svg?v=14" alt="누구나 콘텐츠 로고" style={{ height: 30, width: 30, display: 'block' }} />
            <span className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">누구나 콘텐츠</span>
          </div>
          <h2 className="text-text-primary font-bold tracking-[-0.03em] leading-[1.2] text-[clamp(28px,3.6vw,40px)] mb-5">
            검색에 <span style={{ color: '#0070f3' }}>보이고</span> 싶습니다
          </h2>
          <p className="text-text-body text-[16px] leading-[1.65] max-w-[420px] mb-8">
            블로그와 플레이스, SNS까지. 사진·메모만 올리면 글이 되고,
            검색에서 고객이 내 가게를 먼저 만납니다.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/content"
              style={{ color: '#ffffff' }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#171717] text-[15px] font-semibold tracking-[-0.02em] no-underline transition-all duration-250 hover:bg-[#333]"
            >
              노출 살펴보기
              <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
            <span className="text-[11px] font-semibold text-text-weak tracking-[0.08em]" style={{ fontFamily: 'var(--font-en)' }}>
              PC / MOBILE
            </span>
          </div>
        </motion.div>

        {/* 우: 실제 아이폰 목업(프레임 PNG) + 화면에 앱 스샷 */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="flex justify-center md:justify-end min-w-0"
        >
          <div style={{ position: 'relative', width: 440, maxWidth: '100%', filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.22))' }}>
            {/* 화면 영역 = 앱 스샷 (프레임 아래 레이어) */}
            <div
              style={{
                position: 'absolute',
                left: `${SCREEN.left}%`,
                top: `${SCREEN.top}%`,
                width: `${SCREEN.width}%`,
                height: `${SCREEN.height}%`,
                overflow: 'hidden',
                borderRadius: 22,
                background: '#f2f3f5',
                zIndex: 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/shots/content/app-home-mobile.jpg"
                alt="누구나 콘텐츠 앱 홈 — 1년치 글 주제·블로그·인스타·내 가게 노출"
                style={{ display: 'block', width: '93%', height: 'auto', margin: '8% auto 0' }}
              />
              {/* 화면 앞 반사(유리 글레어) */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background:
                    'linear-gradient(125deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 12%, rgba(255,255,255,0) 32%)',
                }}
              />
            </div>
            {/* 프레임 (위 레이어, 화면·배경 투명) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/shots/content/phone-frame.png"
              alt=""
              aria-hidden
              style={{ position: 'relative', display: 'block', width: '100%', height: 'auto', zIndex: 2 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
