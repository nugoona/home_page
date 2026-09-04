'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import S41SearchScene from '@/components/home/s4/S41SearchScene';

/* ═══════════════════════════════════════════════════════════════
   콘텐츠 "장면" — 실제 아이폰 목업 PNG(Vecteezy, 화면·배경 투명)에 앱 홈 스샷을 끼움.
   프레임은 위 레이어, 스샷은 화면 영역(측정: 4000px 기준 폰 bbox L1216 T442 R2761 B3539)에 배치.
   사장님 방향 2026-07-12: "모바일 캡은 다운받아" → 실사 목업 사용.
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
          <div className="inline-flex items-center gap-2.5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/nc.svg?v=16" alt="누구나 콘텐츠 로고" style={{ height: 30, width: 30, display: 'block' }} />
            <span className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">누구나 콘텐츠</span>
          </div>
          {/* S4 콘텐츠 = 메인페이지 V2 최종원고(2026-07-13 사장님 확정) */}
          <h2 className="text-text-primary font-bold tracking-[-0.03em] leading-[1.2] text-[clamp(28px,3.6vw,40px)] mb-5">
            검색할 때 우리 가게를 찾을 수 있도록
          </h2>
          {/* 서브 = 텍스트 감량 확정(2026-07-14 사장님 — 1줄·크게, 둘째 서브·PC/MOBILE 라벨 삭제) */}
          <p className="text-text-body text-[17px] max-md:text-[15px] font-medium leading-[1.55] tracking-[-0.01em] max-w-[440px] mb-8 md:leading-[1.35]">
            사진과 짧은 메모를 채널에 맞는 콘텐츠로 정리합니다
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
          {/* "앱 → 검색 발견" 3단 합성 장면 — 사장님 2026-07-14 시안 D 확정, PC에도 동일 노출(사장님 지시).
              (구 PC 실사 아이폰 스샷 목업은 git 이력 fe318cf 참조 — 실사 통짜 = 이해를 못 시켜 폐기) */}
          <div className="w-full">
            <S41SearchScene />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
