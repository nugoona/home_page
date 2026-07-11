'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   콘텐츠 "장면" — 히어로 다음. 실제 앱 홈 스샷을 '그대로' 모바일폰 목업에 담고,
   옆에 로고·카피·바로가기. 라이트 배경(히어로가 다크라 대비).
   사장님 방향 2026-07-12: "다크 빼고 라이트 · 폰 캡 씌워 · PC버전 멘트 작게 옆에 · 바로가기 버튼".
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="inline-flex items-center justify-center w-7 h-7 text-[15px] font-bold text-white"
              style={{ background: '#2fd46b', fontFamily: 'var(--font-en)' }}
            >
              N
            </span>
            <span className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">누구나 콘텐츠</span>
          </div>
          <h2 className="text-text-primary font-bold tracking-[-0.03em] leading-[1.2] text-[clamp(28px,3.6vw,40px)] mb-5">
            검색에 <span style={{ color: '#2fd46b' }}>보이고</span> 싶습니다
          </h2>
          <p className="text-text-body text-[16px] md:text-[17px] leading-[1.7] max-w-[420px] mb-8">
            블로그와 플레이스, SNS까지. 사진·메모만 올리면 글이 되고,
            검색에서 고객이 내 가게를 먼저 만납니다.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/content"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#171717] text-white text-[15px] font-semibold tracking-[-0.02em] no-underline transition-all duration-250 hover:bg-[#333]"
            >
              노출 살펴보기
              <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
            <span className="text-[12px] font-semibold text-text-weak tracking-[0.1em]" style={{ fontFamily: 'var(--font-en)' }}>
              PC / MOBILE
            </span>
          </div>
        </motion.div>

        {/* 우: 실제 앱 홈 스샷 — 모바일폰 목업(캡)에 담음, 페이드 없음 */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="flex justify-center md:justify-end"
        >
          {/* 폰 캡 — 아이폰 스타일 목업(다이나믹 아일랜드·사이드 버튼·티타늄 베젤). 실물이라 라운딩 예외 */}
          <div
            style={{
              position: 'relative',
              width: 272,
              maxWidth: '100%',
              padding: 11,
              background: 'linear-gradient(145deg, #43434a 0%, #1c1c1f 42%, #101013 100%)',
              borderRadius: 48,
              boxShadow:
                '0 44px 84px -26px rgba(0,0,0,0.42), 0 10px 24px rgba(0,0,0,0.14), inset 0 0 0 2px rgba(255,255,255,0.07), inset 0 1px 1px rgba(255,255,255,0.14)',
            }}
          >
            {/* 사이드 버튼 — 좌: 무음/볼륨, 우: 전원 */}
            <span style={{ position: 'absolute', left: -2.5, top: 96, width: 3, height: 26, background: '#26262a', borderRadius: 3 }} />
            <span style={{ position: 'absolute', left: -2.5, top: 138, width: 3, height: 46, background: '#26262a', borderRadius: 3 }} />
            <span style={{ position: 'absolute', left: -2.5, top: 196, width: 3, height: 46, background: '#26262a', borderRadius: 3 }} />
            <span style={{ position: 'absolute', right: -2.5, top: 166, width: 3, height: 66, background: '#26262a', borderRadius: 3 }} />

            {/* 스크린 */}
            <div style={{ position: 'relative', borderRadius: 38, overflow: 'hidden', background: '#f2f3f5' }}>
              {/* 상태바 여백 — 다이나믹 아일랜드가 앱 콘텐츠를 가리지 않게(스샷은 상태바 제거본) */}
              <div style={{ height: 32, background: '#f2f3f5' }} />
              <Image
                src="/shots/content/app-home-mobile.jpg"
                alt="누구나 콘텐츠 앱 홈 — 1년치 글 주제·블로그·인스타·내 가게 노출"
                width={1080}
                height={2113}
                style={{ display: 'block', width: '100%', height: 'auto' }}
                priority
              />
              {/* 다이나믹 아일랜드 */}
              <span
                style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: 86, height: 25, background: '#000', borderRadius: 999, zIndex: 3 }}
              />
              {/* 화면 앞 반사(유리 글레어) — 실사 퀄리티 */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 4,
                  background:
                    'linear-gradient(125deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 13%, rgba(255,255,255,0) 33%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.05) 100%)',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
