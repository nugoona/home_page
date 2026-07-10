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
        {/* "예시 화면" = 콜드 리드 지적(데모 숫자 출처 표시 없음 → 과장 의심) 대응 — 전 목업 공통 라벨 */}
        <span className="text-[10px] text-white/30 ml-auto">예시 화면</span>
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
      {/* ── 대화 쇼케이스 ── */}
      <Section id="chatbot">
        <div ref={ref} className="py-20 px-12 max-w-[1080px] mx-auto max-md:py-12 max-md:px-6">
          <div className="grid grid-cols-[5fr_6fr] gap-14 items-center max-md:grid-cols-1 max-md:gap-10">
            {/* 좌 텍스트 */}
            <FadeUp>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717]" style={EN}>01</span>
                <div className="flex-1 h-px bg-border-default" />
              </div>
              <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-4">
                복잡한 화면 대신<br />말로 묻고 운영하세요
              </h3>
              <p className="text-[15px] text-text-body leading-[1.7] mb-5">
                &quot;이번 달 광고 어때?&quot;부터 &quot;예산 올려줘&quot;까지. 복잡한 관리자 화면을 몰라도 대화로 확인하고 조정합니다.
                광고 제어는 위저드에서 확인한 뒤 안전하게 실행됩니다.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['AI', '광고 말로 제어', 'AI 진단', '자유 질문'].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium px-2.5 py-1" style={{ border: '1px solid #e0e0e0', color: '#333', ...EN }}>{tag}</span>
                ))}
              </div>
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
