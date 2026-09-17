'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

/* 대화 목업 — 다크 챗 UI (숫자 조회 · 용어 설명 · 화면 안내)
   export = /ads 재사용(사장님 2026-07-18 "예전 다크버전 그대로 갖고 와" — 원작 틀·색·그림자 불변)

   ★2026-09-18 대사 교체(사장님 낙점 "2번" = 세 가지 질문). 틀·색·그림자·타이핑은 원작 그대로.
   【왜】구 대사 "메타 예산 20% 올려줘 → ₩500,000→₩600,000 → 위저드에서 확인"은 닫힌 기능이다.
     근거 = ngn_dashboard/.ngn-map/stage-7-chatbot.json #541
       "🛑 닫혔습니다. 대화창에서는 광고를 켜거나 끄거나 예산을 바꿀 수 없습니다.
        '광고 운영 메뉴에서 직접 바꿔 주세요' 안내만 나갑니다." (2026-09-02 서버 차단 410)
     같은 지도 #516 = "실행하거나 실행한 척하는 것" 금지가 서버에서 강제됨.
   【대신 보여주는 것 — 지도상 실제로 되는 것】
     · 매출·광고 숫자 조회 (#500)  · 용어·사용법 설명 (#500)
     · 만들기/운영 화면으로 보내는 이동 안내 = 딥링크 (#541, 실행이 아니라 이동)
   ⚠ 앱이 또 바뀌면 여기도 바뀌어야 한다. 이 주석의 지도 번호부터 다시 읽을 것. */
export function ChatMock({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const bubble = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: active ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, ease: EASE, delay: 0.2 + i * 0.45 },
  });
  /* 타이핑 과정(사장님 2026-07-18 "입력창에서 치는 과정이 나와야 채팅 느낌") —
     말풍선이 다 뜬 뒤 한 글자씩. ⚠조건부 렌더 금지(hydration 교훈) — 항상 렌더, reduce면 즉시 표시
     ★타이밍 = 말풍선 수에 종속. 지금 6개 → 마지막 등장 0.2+5*0.45=2.45s, 애니 0.5s → 2.95s 완료.
       그래서 3.1s부터 타이핑. 말풍선을 더하거나 빼면 이 값도 같이 고칠 것(안 고치면 겹쳐 보인다). */
  const TYPE_START = 3.1;
  const TYPED = '요즘 뭐가 잘 팔려?';

  return (
    <div
      className="border border-white/10 bg-[#111] overflow-hidden"
      /* 그림자 = 선명 2겹(사장님 2026-07-20 "너무 뿌옇게" — 구 24/80 블러 폐기, §8.14 블러 최소 문법) */
      style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.28), 0 10px 24px rgba(0,0,0,0.22)' }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <span className="rounded-dot w-2 h-2 bg-[#22c55e]" />
        <span className="text-[13px] font-semibold text-white/80">NGN Assistant</span>
        {/* "예시 화면" = 콜드 리드 지적(데모 숫자 출처 표시 없음 → 과장 의심) 대응 — 전 목업 공통 라벨 */}
        <span className="text-[11px] text-white/65 ml-auto">데모 화면</span>
      </div>

      {/* 대화 */}
      <div className="px-5 py-5 flex flex-col gap-3 min-h-[440px]">
        {/* ① 숫자 조회 — 지도 #500 */}
        <motion.div {...bubble(0)} className="self-end max-w-[78%] bg-accent text-white text-[13px] leading-[1.65] px-4 py-2.5">
          어제 매출 얼마야?
        </motion.div>

        <motion.div {...bubble(1)} className="self-start max-w-[82%] bg-white/[0.06] text-[#ddd] text-[13px] leading-[1.65] px-4 py-3">
          어제 매출은 <b className="text-white">₩1,284,000</b>, 주문 <b className="text-white">37건</b>이에요. 지난주 같은 요일보다 <b className="text-white">+12%</b> 늘었어요.
        </motion.div>

        {/* ② 용어 설명 — 지도 #500 */}
        <motion.div {...bubble(2)} className="self-end max-w-[78%] bg-accent text-white text-[13px] leading-[1.65] px-4 py-2.5">
          ROAS가 무슨 뜻이야?
        </motion.div>

        <motion.div {...bubble(3)} className="self-start max-w-[86%] bg-white/[0.06] text-[#ddd] text-[13px] leading-[1.65] px-4 py-3">
          광고비 1원으로 매출이 몇 원 나왔는지예요. <b className="text-white">452%</b>면 1만 원 써서 4만 5천 원을 벌었다는 뜻이에요.
        </motion.div>

        {/* ③ 화면 안내(딥링크) — 지도 #541. ⛔실행 카드가 아니다(실행은 닫힘) */}
        <motion.div {...bubble(4)} className="self-end max-w-[78%] bg-accent text-white text-[13px] leading-[1.65] px-4 py-2.5">
          메타 광고는 어디서 만들어?
        </motion.div>

        <motion.div {...bubble(5)} className="self-start max-w-[86%]">
          <div className="bg-white/[0.06] text-[#ddd] text-[13px] leading-[1.65] px-4 py-3 mb-2">
            광고 만들기 화면에서 시작하시면 돼요.
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-white/70">광고 만들기 · Meta</span>
              <span className="text-[10px] text-white/50" style={EN}>Shortcut</span>
            </div>
            <div className="w-full h-9 bg-accent text-white text-[13px] font-semibold flex items-center justify-center gap-1.5">
              광고 만들기 열기
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
            </div>
            <p className="text-[10px] text-white/60 mt-2 leading-[1.5]">눌러서 바로 그 화면으로 이동합니다</p>
          </div>
        </motion.div>
      </div>

      {/* 입력창 — 입력창답게 박스 분리 + 타이핑 과정(사장님 2026-07-18 "다크에 묻혀 안 보임") */}
      <div className="px-4 py-3.5 border-t border-white/[0.06]">
        <div className="flex h-11 items-center gap-2 border border-white/15 bg-white/[0.07] px-3.5">
          <span className="flex min-w-0 flex-1 items-center text-[13px] text-white/90">
            <span className="truncate">
              {TYPED.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: 1 } : {}}
                  transition={reduce ? { duration: 0 } : { duration: 0, delay: TYPE_START + i * 0.09 }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            {/* 커서 — 항상 렌더(reduce면 정지) */}
            <motion.span
              aria-hidden
              className="ml-[2px] inline-block h-[15px] w-[1.5px] shrink-0 bg-white/80"
              animate={reduce ? { opacity: 0.6 } : { opacity: [1, 0, 1] }}
              transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'linear' }}
            />
          </span>
          <span className="rounded-dot w-7 h-7 bg-accent flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h9M8 4l4 4-4 4" /></svg>
          </span>
        </div>
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
                <span className="w-8 h-8 flex items-center justify-center text-[13px] font-bold text-white bg-[#171717]" style={EN}>01</span>
                <div className="flex-1 h-px bg-border-default" />
              </div>
              {/* ★2026-09-18 사실 교정 — 구 카피("말로 묻고 운영하세요"·"대화로 확인하고 조정"·
                  "광고 제어는 위저드에서 확인한 뒤 실행")는 전부 닫힌 기능. 근거 = ChatMock 상단 주석의 지도 번호.
                  구 태그 '광고 말로 제어'(닫힘)·'AI 진단'(근거 없음)·'자유 질문'(지도 #500 = AI가 글을 짓지 않고
                  준비된 카드·창고 숫자로 답함 → 과장) 교체. */}
              <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-4">
                복잡한 화면을 헤매지 말고<br />그냥 물어보세요
              </h3>
              <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.65] mb-5">
                어제 매출부터 처음 듣는 용어까지 쉬운 말로 답합니다.
                어디서 하는 일인지도 그 화면까지 안내합니다.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['AI', '숫자 조회', '용어 설명', '화면 안내'].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium px-2.5 py-1" style={{ border: '1px solid #eaeaea', color: '#333', ...EN }}>{tag}</span>
                ))}
              </div>
              {/* 구 "안전 게이트" = 실행 전 위저드 확인을 가리키던 말. 실행 자체가 닫혀 의미가 사라져 교체 */}
              <p className="text-[14px] text-text-weak" style={EN}>Meta · Google · 화면 바로가기</p>
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
