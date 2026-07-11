'use client';

import { motion } from 'framer-motion';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import HeroAurora from '@/components/home/HeroAurora';
import ProductBranch from '@/components/home/ProductBranch';
import Philosophy from '@/components/home/Philosophy';
import StoryStep from '@/components/home/StoryStep';
import CTA from '@/components/home/CTA';
import { promise } from '@/lib/content/home';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const promiseStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};
const promiseCard = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};
// 카드2(요금 그대로) — 스케일 팝 + 보더 accent 글로우 1회(펄스 후 소멸)
const promiseCardGlow = {
  hidden: { opacity: 0, scale: 0.9, boxShadow: '0 0 0 0 rgba(0,112,243,0)' },
  show: {
    opacity: 1,
    scale: 1,
    boxShadow: ['0 0 0 0 rgba(0,112,243,0)', '0 0 24px 2px rgba(0,112,243,0.35)', '0 0 0 0 rgba(0,112,243,0)'],
    transition: {
      opacity: { duration: 0.6, ease: EASE },
      scale: { duration: 0.6, ease: EASE },
      boxShadow: { duration: 1.4, ease: EASE, delay: 0.6 },
    },
  },
};

export default function Home() {
  return (
    <main>
      <OuterContainer>
        {/* S1 · 히어로 (사장님 작품 — 유지) */}
        <Section noBorder>
          <HeroAurora />
        </Section>

        {/* S2 · 두 제품 분기 (홈의 심장) */}
        <Section>
          <ProductBranch />
        </Section>

        {/* S3 · 왜 만들었나 (라이트, 텍스트 전용) */}
        <Section>
          <Philosophy />
        </Section>

        {/* S4 · 회사 약속 */}
        <Section noBorder>
          <StoryStep dark time="∞" step={promise.step} headline={promise.title} subtitle={promise.sub}>
            <motion.div
              variants={promiseStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex gap-4 max-w-[520px] max-md:flex-col"
            >
              {/* 기능 계속↑ — 스케일 팝 + 화살표 무한 부유(유일 허용) */}
              <motion.div variants={promiseCard} className="flex-1 basis-0 border border-white/15 bg-white/[0.03] px-6 py-6">
                <p className="text-[13px] max-md:text-[14px] text-white/50 mb-2">기능</p>
                <p className="text-[26px] font-bold text-white flex items-center gap-1.5" style={EN}>
                  계속
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                    style={{ display: 'inline-block' }}
                  >
                    &uarr;
                  </motion.span>
                </p>
              </motion.div>
              {/* 요금 그대로→ — 스케일 팝 + 보더 accent 글로우 1회('그대로'는 화살표 고정) */}
              <motion.div
                variants={promiseCardGlow}
                className="flex-1 basis-0 border border-accent/40 bg-accent/[0.07] px-6 py-6"
              >
                <p className="text-[13px] max-md:text-[14px] text-white/50 mb-2">요금</p>
                <p className="text-[26px] font-bold text-accent" style={EN}>그대로 &rarr;</p>
              </motion.div>
            </motion.div>
          </StoryStep>
        </Section>

        {/* S5 · CTA */}
        <Section alt noBorder>
          <CTA />
        </Section>
      </OuterContainer>
    </main>
  );
}
