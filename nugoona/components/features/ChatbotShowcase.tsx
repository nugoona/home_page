'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

/* 대화 목업 — 다크 챗 UI (질문 답변 + 광고 말로 제어) */
function ChatMock({ active }: { active: boolean }) {
  const bubble = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: active ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, ease: EASE, delay: 0.2 + i * 0.45 },
  });

  return (
    <div
      className="border border-white/10 bg-[#111] overflow-hidden"
      style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,112,243,0.05)' }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <span className="rounded-dot w-2 h-2 bg-[#22c55e]" />
        <span className="text-[12px] font-semibold text-white/80">NGN Assistant</span>
        <span className="text-[10px] text-white/30 ml-auto" style={EN}>AI</span>
      </div>

      {/* 대화 */}
      <div className="px-5 py-5 flex flex-col gap-3 min-h-[400px]">
        <motion.div {...bubble(0)} className="self-end max-w-[78%] bg-accent text-white text-[13px] leading-[1.6] px-4 py-2.5">
          이번 달 광고 성과 어때?
        </motion.div>

        <motion.div {...bubble(1)} className="self-start max-w-[82%] bg-white/[0.06] text-[#ddd] text-[13px] leading-[1.7] px-4 py-3">
          이번 달 종합 ROAS는 <b className="text-white">785%</b>예요. Meta가 1,024%로 가장 효율이 좋고, 검색 유입도 전월 대비 <b className="text-white">+15%</b> 올랐어요.
        </motion.div>

        <motion.div {...bubble(2)} className="self-end max-w-[78%] bg-accent text-white text-[13px] leading-[1.6] px-4 py-2.5">
          메타 예산 20% 올려줘
        </motion.div>

        <motion.div {...bubble(3)} className="self-start max-w-[86%]">
          <div className="bg-white/[0.06] text-[#ddd] text-[13px] leading-[1.7] px-4 py-3 mb-2">
            Summer Sale 캠페인 예산을 이렇게 바꿀게요. 확인해 주세요.
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-white/50">Summer Sale · Meta</span>
              <span className="text-[10px] text-white/30" style={EN}>Budget</span>
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[14px] text-white/40 line-through" style={EN}>₩500,000</span>
              <span className="text-white/40">→</span>
              <span className="text-[16px] font-bold text-accent" style={EN}>₩600,000</span>
            </div>
            <div className="w-full h-9 bg-accent text-white text-[12px] font-semibold flex items-center justify-center gap-1.5">
              위저드에서 확인
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
            </div>
            <p className="text-[10px] text-white/30 mt-2 leading-[1.5]">안전을 위해 위저드에서 확인해야 실행됩니다 (자동 집행 아님)</p>
          </div>
        </motion.div>
      </div>

      {/* 입력창 */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-t border-white/[0.06]">
        <span className="flex-1 text-[12px] text-white/30">매출·광고·트렌드, 무엇이든 물어보세요</span>
        <span className="rounded-dot w-7 h-7 bg-accent flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h9M8 4l4 4-4 4" /></svg>
        </span>
      </div>
    </div>
  );
}

export default function ChatbotShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      {/* ── 섹션 히어로 (다크) ── */}
      <Section id="chatbot" dark>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 25% 0%, #1a1040 0%, #0a0a0a 60%)' }}
        />
        <div className="relative grid grid-cols-[7fr_5fr] max-md:grid-cols-1">
          {/* 좌: 대형 워드 + 데모 */}
          <div className="relative flex flex-col [box-shadow:1px_0_0_rgba(255,255,255,0.12)] max-md:[box-shadow:none] max-md:border-b max-md:border-[rgba(255,255,255,0.12)]">
            <FadeUp className="flex-1 flex flex-col">
              <div className="flex-1 px-12 py-12 md:py-20 flex flex-col justify-center items-center text-center gap-7 max-md:px-6 max-md:py-10">
                <p
                  className="text-white select-none"
                  style={{ fontSize: 'clamp(44px, 6vw, 72px)', fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 0.9 }}
                >
                  Chatbot
                </p>
                <a
                  href="https://board.nugoona.co.kr/demo/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-pill inline-flex items-center justify-between gap-4 bg-white pl-6 pr-2 py-2 hover:bg-[#f0f0f0] transition-colors duration-200 max-w-[280px] w-full"
                >
                  <span className="text-[14px] font-bold text-[#171717] tracking-[-0.01em]">직접 데모 경험하기</span>
                  <span className="rounded-dot w-9 h-9 bg-[#171717] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h8M9 5l3 3-3 3" /></svg>
                  </span>
                </a>
              </div>
            </FadeUp>
          </div>

          {/* 우: 카피 */}
          <div className="flex flex-col">
            <FadeUp delay={0.1} className="flex-1 flex flex-col">
              <div className="flex-1 px-12 py-12 md:py-20 flex flex-col justify-center max-md:px-6 max-md:py-10">
                <p className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-4" style={EN}>Chatbot</p>
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold text-white tracking-[-0.03em] leading-[1.15] mb-4">
                  복잡한 화면 대신<br />말로 묻고 운영하세요
                </h2>
                <p className="text-[15px] leading-[1.6] mb-6 font-light tracking-[-0.02em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  매출·광고·용어, 무엇이든 쉬운 말로 답합니다. 광고도 대화로 켜고 끄고 예산을 바꿉니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['AI', '광고 말로 제어', 'AI 진단', '자유 질문'].map((tag) => (
                    <span key={tag} className="text-[10px] font-medium px-2.5 py-1" style={{ background: '#fff', color: '#111', ...EN }}>{tag}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* ── 대화 쇼케이스 ── */}
      <Section>
        <div ref={ref} className="py-20 px-12 max-w-[1080px] mx-auto max-md:py-12 max-md:px-6">
          <div className="grid grid-cols-[5fr_6fr] gap-14 items-center max-md:grid-cols-1 max-md:gap-10">
            {/* 좌 텍스트 */}
            <FadeUp>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717]" style={EN}>01</span>
                <div className="flex-1 h-px bg-border-default" />
              </div>
              <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-4">
                묻고, 말로 운영합니다
              </h3>
              <p className="text-[15px] text-text-body leading-[1.7] mb-5">
                &quot;이번 달 광고 어때?&quot;부터 &quot;예산 올려줘&quot;까지. 복잡한 관리자 화면을 몰라도 대화로 확인하고 조정합니다.
                광고 제어는 위저드에서 확인한 뒤 안전하게 실행됩니다.
              </p>
              <p className="text-[14px] text-text-weak" style={EN}>Meta · Google · 안전 게이트</p>
            </FadeUp>

            {/* 우 대화 목업 */}
            <div className="max-md:order-[-1]">
              <FadeUp delay={0.12}>
                <ChatMock active={inView} />
              </FadeUp>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
