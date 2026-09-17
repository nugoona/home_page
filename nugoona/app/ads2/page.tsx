'use client';

/* ══════════════════════════════════════════════════════════════════
   /ads2 — 시안 비교용 임시 페이지 (2026-09-18, 사장님 승인)
   목적 = 원본 /ads 를 한 글자도 건드리지 않고 챗봇 섹션 대안을 나란히 비교.
   🛑 이 페이지는 손님용이 아니다. Nav 미등록 · 낙점 후 원본 반영하고 삭제 예정.

   【왜 고치나 — 사실 근거】
   현재 /ads 챗봇 목업은 "메타 예산 20% 올려줘 → ₩500,000 → ₩600,000 → 위저드에서 확인"
   을 보여준다. 그러나 ngn_dashboard 기능 지도(.ngn-map/stage-7-chatbot.json #541)는:
     "🛑 닫혔습니다. 대화창에서는 광고를 켜거나 끄거나 예산을 바꿀 수 없습니다.
      '광고 운영 메뉴에서 직접 바꿔 주세요' 안내만 나갑니다."
   2026-09-02 서버 차단(410). #516 = "실행하거나 실행한 척하는 것" 금지가 서버에서 강제됨.
   → 지금 홈페이지는 닫힌 기능을 팔고 있다.

   【지도가 확인해 준, 실제로 되는 것】
     · 매출·광고 숫자 조회 (#500)
     · 용어·사용법 설명 (#500)
     · 만들기/운영 화면으로 보내는 이동 안내 = 딥링크 (#541, 실행이 아니라 이동)

   【톤앤매너 = DESIGN §8.17 준수】
     색 3개(순백·잉크 #171717·accent #0070f3) / 선 1px / 블러 금지(그림자는 원작 선명 2겹)
     eyebrow = ✦ + 대문자 tracking .14em / 호칭 "고객님" / 빈칸 지양
   ══════════════════════════════════════════════════════════════════ */

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────
   챗 껍데기 — 원작 ChatMock의 틀 그대로 (다크 #111 · 1px white/10 ·
   그림자 선명 2겹 · 헤더 초록점 + "데모 화면" · 하단 입력창 타이핑)
   ───────────────────────────────────────────────────────────── */
function ChatShell({
  active, children, typed, minH = 400,
}: { active: boolean; children: ReactNode; typed: string; minH?: number }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="border border-white/10 bg-[#111] overflow-hidden"
      style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.28), 0 10px 24px rgba(0,0,0,0.22)' }}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <span className="rounded-dot h-2 w-2 bg-[#22c55e]" />
        <span className="text-[13px] font-semibold text-white/80">NGN Assistant</span>
        <span className="ml-auto text-[11px] text-white/65">데모 화면</span>
      </div>

      <div className="flex flex-col gap-3 px-5 py-5" style={{ minHeight: minH }}>
        {children}
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3.5">
        <div className="flex h-11 items-center gap-2 border border-white/15 bg-white/[0.07] px-3.5">
          <span className="flex min-w-0 flex-1 items-center text-[13px] text-white/90">
            <span className="truncate">
              {typed.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: 1 } : {}}
                  transition={reduce ? { duration: 0 } : { duration: 0, delay: 2.3 + i * 0.09 }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            <motion.span
              aria-hidden
              className="ml-[2px] inline-block h-[15px] w-[1.5px] shrink-0 bg-white/80"
              animate={reduce ? { opacity: 0.6 } : { opacity: [1, 0, 1] }}
              transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'linear' }}
            />
          </span>
          <span className="rounded-dot flex h-7 w-7 shrink-0 items-center justify-center bg-accent">
            <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h9M8 4l4 4-4 4" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* 말풍선 등장 — 원작과 동일 타이밍(0.2 + i*0.45) */
const pop = (active: boolean, i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: active ? { opacity: 1, y: 0 } : {},
  transition: { duration: 0.5, ease: EASE, delay: 0.2 + i * 0.45 },
});

function Me({ active, i, children }: { active: boolean; i: number; children: ReactNode }) {
  return (
    <motion.div {...pop(active, i)} className="self-end max-w-[78%] bg-accent px-4 py-2.5 text-[13px] leading-[1.65] text-white">
      {children}
    </motion.div>
  );
}

function Ai({ active, i, children, wide }: { active: boolean; i: number; children: ReactNode; wide?: boolean }) {
  return (
    <motion.div {...pop(active, i)} className={`self-start ${wide ? 'max-w-[86%]' : 'max-w-[82%]'} bg-white/[0.06] px-4 py-3 text-[13px] leading-[1.65] text-[#ddd]`}>
      {children}
    </motion.div>
  );
}

/* 이동 안내 카드 — 원작의 "예산 변경 카드" 자리를 그대로 쓰되 성격을 바꿈.
   실행 카드(❌ 지도상 닫힘) → 화면으로 보내는 이동 안내(✅ #541 딥링크 근거) */
function GoCard({ active, i, label, desc, cta }: { active: boolean; i: number; label: string; desc: string; cta: string }) {
  return (
    <motion.div {...pop(active, i)} className="self-start w-[86%]">
      <div className="mb-2 bg-white/[0.06] px-4 py-3 text-[13px] leading-[1.65] text-[#ddd]">{desc}</div>
      <div className="border border-white/10 bg-white/[0.03] p-3.5">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] text-white/70">{label}</span>
          <span className="text-[10px] text-white/50" style={EN}>Shortcut</span>
        </div>
        <div className="flex h-9 w-full items-center justify-center gap-1.5 bg-accent text-[13px] font-semibold text-white">
          {cta}
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
        </div>
        <p className="mt-2 text-[10px] leading-[1.5] text-white/60">눌러서 바로 그 화면으로 이동합니다</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 1 — 「길 안내」  질문을 '어떻게'로 바꾸고, 답은 화면으로 데려다준다
   ───────────────────────────────────────────────────────────── */
function PlanA({ active }: { active: boolean }) {
  return (
    <ChatShell active={active} typed="요즘 뭐가 잘 팔려?">
      <Me active={active} i={0}>이번 달 광고 성과 어때?</Me>
      <Ai active={active} i={1}>
        이번 달 종합 ROAS는 <b className="text-white">452%</b>예요. Meta가 583%로 가장 효율이 좋고,
        검색 유입도 전월 대비 <b className="text-white">+15%</b> 올랐어요.
      </Ai>
      <Me active={active} i={2}>메타 예산은 어디서 바꿔?</Me>
      <GoCard
        active={active}
        i={3}
        desc="광고 운영 메뉴에서 바꾸실 수 있어요. 바로 열어드릴게요."
        label="광고 운영 · Meta"
        cta="광고 운영 메뉴 열기"
      />
    </ChatShell>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 2 — 「세 가지 질문」  잘하는 일 셋(숫자 조회 · 용어 설명 · 길 안내)을 한 화면에
   ───────────────────────────────────────────────────────────── */
function PlanB({ active }: { active: boolean }) {
  return (
    <ChatShell active={active} typed="요즘 뭐가 잘 팔려?" minH={440}>
      <Me active={active} i={0}>어제 매출 얼마야?</Me>
      <Ai active={active} i={1}>
        어제 매출은 <b className="text-white">₩1,284,000</b>, 주문 <b className="text-white">37건</b>이에요.
        지난주 같은 요일보다 <b className="text-white">+12%</b> 늘었어요.
      </Ai>
      <Me active={active} i={2}>ROAS가 무슨 뜻이야?</Me>
      <Ai active={active} i={3} wide>
        광고비 1원으로 매출이 몇 원 나왔는지예요. <b className="text-white">452%</b>면
        1만 원 써서 4만 5천 원을 벌었다는 뜻이에요.
      </Ai>
      <Me active={active} i={4}>메타 광고는 어디서 만들어?</Me>
      <GoCard
        active={active}
        i={5}
        desc="광고 만들기 화면에서 시작하시면 돼요."
        label="광고 만들기 · Meta"
        cta="광고 만들기 열기"
      />
    </ChatShell>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 3 — 「한 가지를 깊게」  질문 하나 · 글자 크게 (모바일 가독 우선)
   ───────────────────────────────────────────────────────────── */
function PlanC({ active }: { active: boolean }) {
  const stat = [
    { k: '매출', v: '₩12,800,000', s: '지난달 대비 +23.4%' },
    { k: 'ROAS', v: '452%', s: 'Meta 583 · Google 397' },
  ];
  return (
    <ChatShell active={active} typed="지난달이랑 비교해줘">
      <Me active={active} i={0}>이번 달 광고 어때?</Me>
      <Ai active={active} i={1} wide>
        <span className="text-[15px] leading-[1.6]">
          Meta가 가장 효율이 좋아요. 검색 유입도 전월보다 <b className="text-white">+15%</b> 늘었어요.
        </span>
      </Ai>
      {/* 모바일 = 1열(390px에서 ₩12,800,000이 두 줄로 깨짐 — 실측 후 수정) */}
      <motion.div {...pop(active, 2)} className="self-start grid w-[86%] grid-cols-2 gap-2 max-md:w-full max-md:grid-cols-1">
        {stat.map((it) => (
          <div key={it.k} className="border border-white/10 bg-white/[0.03] p-3.5">
            <p className="text-[11px] text-white/70">{it.k}</p>
            <p className="mt-1 whitespace-nowrap text-[18px] font-bold text-white" style={EN}>{it.v}</p>
            <p className="mt-1.5 text-[10px] leading-[1.5] text-white/60">{it.s}</p>
          </div>
        ))}
      </motion.div>
      <Ai active={active} i={3} wide>
        더 자세한 숫자나 모르는 용어는 그대로 물어보세요. 쉬운 말로 설명해 드릴게요.
      </Ai>
    </ChatShell>
  );
}

/* ─────────────────────────────────────────────────────────────
   시안 한 벌 = 좌 카피 + 우 목업 (원본 /ads 챗봇 섹션과 같은 배치)
   ───────────────────────────────────────────────────────────── */
function Trial({
  no, name, why, heading, body, control, children,
}: {
  no: string; name: string; why: string;
  heading: ReactNode; body: string; control: string; children: (active: boolean) => ReactNode;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="border-t border-[#ECECEC]">
      {/* 시안 머리띠 — 비교용 표시(원본엔 없음) */}
      <div className="bg-[#171717] px-12 py-3 max-md:px-6">
        <div className="mx-auto flex max-w-[1080px] items-baseline gap-3">
          <span className="text-[13px] font-bold text-white" style={EN}>{no}</span>
          <span className="text-[15px] font-semibold text-white">{name}</span>
          <span className="text-[13px] text-white/60 max-md:hidden">{why}</span>
        </div>
        <p className="mx-auto mt-1.5 hidden max-w-[1080px] text-[13px] leading-[1.5] text-white/60 max-md:block">{why}</p>
      </div>

      <div className="mx-auto max-w-[1080px] px-12 py-20 max-md:px-6 max-md:py-12">
        <div className="grid grid-cols-[5fr_6fr] items-center gap-14 max-md:grid-cols-1 max-md:gap-10">
          <FadeUp>
            <div className="mb-5 flex items-center gap-2">
              <span aria-hidden className="text-[13px] text-accent">✦</span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-text-weak" style={EN}>AI Chat</span>
            </div>
            <h3 className="mb-4 text-[clamp(22px,3vw,30px)] font-bold leading-[1.25] tracking-[-0.02em] text-text-primary text-balance">
              {heading}
            </h3>
            <p className="mb-3 text-[15px] font-medium leading-[1.65] text-text-body max-md:text-[16px]">{body}</p>
            <p className="text-[15px] font-medium leading-[1.65] text-text-body max-md:text-[16px]">{control}</p>
          </FadeUp>

          <div className="max-md:order-[-1]">
            <FadeUp delay={0.12}>{children(inView)}</FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Ads2Page() {
  return (
    <main className="bg-white">
      {/* 안내 — 이 페이지의 정체 */}
      <div className="border-b border-[#ECECEC] px-12 py-14 max-md:px-6 max-md:py-10">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden className="text-[13px] text-accent">✦</span>
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-text-weak" style={EN}>Compare</span>
          </div>
          <h1 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary text-balance">
            챗봇 장면 — 어느 쪽이 나으세요?
          </h1>
          <p className="mt-4 max-w-[680px] text-[15px] font-medium leading-[1.6] text-text-body max-md:text-[16px]">
            지금 광고 페이지에는 <b className="text-text-primary">&ldquo;메타 예산 20% 올려줘 → 예산을 바꿀게요&rdquo;</b> 장면이 있습니다.
            그런데 앱에서는 <b className="text-text-primary">9월 2일부터 대화로 예산을 바꾸는 길이 닫혔습니다.</b>{' '}
            지금은 &ldquo;광고 운영 메뉴에서 직접 바꿔 주세요&rdquo; 안내만 나갑니다. 그래서 세 가지로 고쳐 봤습니다.
          </p>
          <p className="mt-3 max-w-[680px] text-[14px] leading-[1.6] text-text-weak">
            그림 틀·색·그림자·타이핑 연출은 원본 그대로입니다. <b className="text-text-body">바뀐 건 대사와 카드의 성격뿐</b>입니다.
            왼쪽 글(카피)도 사실에 맞게 바꿔 봤는데, 이건 제안이니 문장은 고치셔도 됩니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['색 3개 유지', '1px 선 유지', '블러 없음', '원본 무수정'].map((t) => (
              <span key={t} className="bg-[#171717] px-2.5 py-1 text-[11px] font-medium text-white">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <Trial
        no="01"
        name="길 안내"
        why="지금 장면과 가장 가깝습니다 — 질문만 '어디서 바꿔?'로 바꾸고, 답이 그 화면으로 데려다줍니다"
        heading={<>어려운 광고를, 쉬운 대화로.</>}
        body="매출과 광고 수치, 어려운 용어를 물어보면 쉬운 말로 설명합니다."
        control="바꾸고 싶은 것이 있으면 그 화면까지 바로 안내합니다."
      >
        {(a) => <PlanA active={a} />}
      </Trial>

      <Trial
        no="02"
        name="세 가지 질문"
        why="이 앱이 잘하는 일 셋을 한 화면에 — 숫자 조회 · 용어 설명 · 길 안내"
        heading={<>모르는 건 그 자리에서<br />물어보세요.</>}
        body="어제 매출부터 처음 듣는 용어까지, 화면을 헤매지 않고 바로 묻습니다."
        control="어디서 하는 일인지도 알려주고, 그 화면으로 데려다줍니다."
      >
        {(a) => <PlanB active={a} />}
      </Trial>

      <Trial
        no="03"
        name="한 가지를 깊게"
        why="질문 하나만 크게 — 휴대폰에서 글자가 가장 잘 읽힙니다"
        heading={<>이번 달 어땠는지,<br />한마디로 물어보세요.</>}
        body="흩어진 숫자를 모으지 않아도 한 번에 답이 옵니다."
        control="모르는 용어는 그대로 물어보시면 쉬운 말로 설명합니다."
      >
        {(a) => <PlanC active={a} />}
      </Trial>

      {/* 꼬리 — 원본 확인 동선 */}
      <div className="border-t border-[#ECECEC] px-12 py-14 max-md:px-6 max-md:py-10">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-[14px] font-medium text-text-body">원본과 비교하시려면</span>
          <a href="/ads" className="text-[14px] font-semibold text-accent underline underline-offset-4">지금 광고 페이지 열기 →</a>
          <span className="text-[13px] text-text-weak">원본은 한 글자도 바뀌지 않았습니다.</span>
        </div>
      </div>
    </main>
  );
}
