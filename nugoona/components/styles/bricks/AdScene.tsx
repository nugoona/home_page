'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   광고 "장면" — 콘텐츠(PhoneScene)와 좌우 대칭(폰 왼쪽·텍스트 오른쪽).
   실제 아이폰 목업 PNG(phone-frame.png) + 대시보드 앱 스샷. 광고 톤 = 블루(#0070f3).
   폰 목업 노하우 = DESIGN §8.7-I (프레임 z2·스샷 z1·노치회피 marginTop·93% 중앙·반사).
   카피 = branch.cards[1] 확정본.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BLUE = '#0070f3';
const SCREEN = { left: 31.6, top: 12.4, width: 36.2, height: 73.6 };

export default function AdScene() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1080px] px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* 좌: 폰 목업(대시보드) — 대칭이라 왼쪽. 모바일에선 텍스트 먼저 */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="flex justify-center md:justify-start order-2 md:order-1 min-w-0"
        >
          {/* 모바일: 앱 스샷을 1px 검은 박스로 크게(하단 크롭) — 사장님 2026-07-12 */}
          <div className="md:hidden w-full max-w-[400px] rounded-[26px] border border-[#111] overflow-hidden bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)]" style={{ maxHeight: 560 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/shots/content/app-dashboard-mobile.jpg" alt="누구나 광고 앱 대시보드 — 순매출·주문·방문자·광고 성과(ROAS)" className="block w-full" />
          </div>
          {/* PC: 실사 아이폰 목업 */}
          <div className="max-md:hidden" style={{ position: 'relative', width: 440, maxWidth: '100%', filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.22))' }}>
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
                src="/shots/content/app-dashboard-mobile.jpg"
                alt="누구나 광고 앱 대시보드 — 순매출·주문·방문자·광고 성과(ROAS)"
                style={{ display: 'block', width: '93%', height: 'auto', margin: '8% auto 0' }}
              />
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/shots/content/phone-frame.png"
              alt=""
              aria-hidden
              style={{ position: 'relative', display: 'block', width: '100%', height: 'auto', zIndex: 2 }}
            />
          </div>
        </motion.div>

        {/* 우: 로고 + 카피 + 바로가기 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="order-1 md:order-2"
        >
          <div className="inline-flex items-center gap-2.5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/na.svg?v=16" alt="누구나 광고 로고" style={{ height: 30, width: 30, display: 'block' }} />
            <span className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">누구나 광고</span>
          </div>
          <h2 className="text-text-primary font-bold tracking-[-0.03em] leading-[1.2] text-[clamp(28px,3.6vw,40px)] mb-5">
            광고를 <span style={{ color: BLUE }}>직접</span> 하고 싶습니다
          </h2>
          <p className="text-text-body text-[16px] leading-[1.45] max-w-[420px] mb-8">
            메타와 구글 광고를 만들고, 성과까지 한 화면에서 확인합니다.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/ads"
              style={{ color: '#ffffff' }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#171717] text-[15px] font-semibold tracking-[-0.02em] no-underline transition-all duration-250 hover:bg-[#333]"
            >
              광고 살펴보기
              <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
            <span className="text-[11px] font-semibold text-text-weak tracking-[0.08em]" style={{ fontFamily: 'var(--font-en)' }}>
              PC / MOBILE
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
