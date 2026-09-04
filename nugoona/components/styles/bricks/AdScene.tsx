'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import S42AdScene from '@/components/home/s4/S42AdScene';

/* ═══════════════════════════════════════════════════════════════
   광고 "장면" — 콘텐츠(PhoneScene)와 좌우 대칭(폰 왼쪽·텍스트 오른쪽).
   실제 아이폰 목업 PNG(phone-frame.png) + 대시보드 앱 스샷. 광고 톤 = 블루(#0070f3).
   폰 목업 노하우 = DESIGN §8.7-I (프레임 z2·스샷 z1·노치회피 marginTop·93% 중앙·반사).
   카피 = branch.cards[1] 확정본.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
          {/* "광고 만들기 → 성과 → 챗봇" 3단 장면 — 사장님 2026-07-14 S4-2 확정, PC에도 동일 노출(사장님 지시).
              (구 PC 실사 아이폰 스샷 목업은 git 이력 fe318cf 참조) */}
          <div className="w-full">
            <S42AdScene />
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
            <img src="/img/logo/na.svg?v=20" alt="누구나 광고 로고" style={{ height: 30, width: 30, display: 'block' }} />
            <span className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">누구나 광고</span>
          </div>
          {/* S4 광고 = 메인페이지 V2 최종원고(2026-07-13 사장님 확정) */}
          <h2 className="text-text-primary font-bold tracking-[-0.03em] leading-[1.2] text-[clamp(28px,3.6vw,40px)] mb-5">
            광고를 만들고 운영하는 일을<br />누구나 할 수 있도록
          </h2>
          {/* 서브 = 텍스트 감량 확정(2026-07-14 사장님 — 1줄·크게, 둘째 서브·PC/MOBILE 라벨 삭제) */}
          <p className="text-text-body text-[17px] max-md:text-[15px] font-medium leading-[1.55] tracking-[-0.01em] max-w-[460px] mb-8 md:leading-[1.35]">
            광고를 만들고 운영하며 성과까지 한 화면에서 확인합니다
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
