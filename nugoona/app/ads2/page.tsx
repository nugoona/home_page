'use client';

/* ══════════════════════════════════════════════════════════════════
   /ads2 — 시안 비교용 임시 페이지 (사장님 승인 2026-09-18)
   🛑 손님용 아님. Nav 미등록. 낙점되면 원본에 반영하고 다음 시안으로 갈아끼운다.
   이력: 1차 챗봇 3안(낙점 "2번" → 반영 1196e6a) / 2차 월간 리포트 3안(낙점 "1번" → 반영 b9eff7f)
        3차 = 메인 홈 업데이트 연표 ← 지금  ※주소 이름은 ads2지만 이번 대상은 **메인(홈)**이다.

   【왜 고치나 — 사실 근거】
   홈 하단 "필요한 기능은 계속 더해집니다" 로그(S7UpdatePairs)에 2026.01 / 2026.04 / 2026.05 /
   2026.06 네 개의 날짜가 박혀 있다. 그런데 lib/content/home.ts 의 주석이 직접 이렇게 적고 있다 —
     "promise.log의 실제 기능 + 대표 **가상 날짜** 재활용"
   즉 **날짜는 지어낸 것**이다. 개선안 docs/홈페이지-개선안.md §3.6:
     "실제 출시 이력이 아닌 2026.01·2026.04 등의 날짜를 제거한다.
      날짜 없이 확인된 개선 방향만 제시한다: 더 정확한 목표 검색어 / 더 쉬운 콘텐츠 준비 /
      더 분명한 발행 일정 / 더 이해하기 쉬운 성과 확인."

   ⚠ 중요 — **기능은 진짜, 날짜만 가짜다.** 월간 리포트·애드캔버스는 지도에서 실재 확인했고
     목표 검색어·노출 현황은 콘텐츠 앱 기능이다. 그래서 "기능 목록을 지운다"가 답이 아니라
     "날짜를 어떻게 처리하느냐"가 선택지다.

   【함께 걸린 것】 맨 아래 마무리 문장 "새로운 기능에도 기존 고객은 추가 비용이 없습니다".
   §3.6이 점검 대상으로 지목했고 §7.6은 "모든 미래 영상 제작까지 무료라는 오해를 만들 수 있다"며
   "이용 중인 플랜의 기본 요금은 그대로 유지됩니다"를 제안한다. 안마다 다르게 넣어 비교한다.

   【디자인 계승】S7UpdatePairs 실측값 그대로 — divide-y #F0F0F0 / 행 py-3.5 / 날짜칸 64px /
     제품 점 6px(콘텐츠 #0070f3 · 광고 #0aa5c9) / NOW = accent 8px 펄스 / 마무리 = accent 스팬.
   ══════════════════════════════════════════════════════════════════ */

import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';

const EN = { fontFamily: 'var(--font-en)' } as const;
const TAG: Record<string, string> = { '누구나 콘텐츠': '#0070f3', '누구나 광고': '#0aa5c9' };

/* 지금 화면에 나가는 4행 (날짜 = 가상) */
const NOW_ROWS = [
  { date: '2026.01', product: '누구나 콘텐츠', done: '목표 검색어와 노출 현황 추가' },
  { date: '2026.04', product: '누구나 광고', done: '광고 소재 만들기 추가' },
  { date: '2026.05', product: '누구나 콘텐츠', done: '노출 소식과 검색 변화 확인 추가' },
  { date: '2026.06', product: '누구나 광고', done: '월간 리포트 자동 생성' },
];

/* 개선안 §3.6이 제시한 "확인된 개선 방향" 4가지 */
const DIRECTIONS = [
  { product: '누구나 콘텐츠', done: '더 정확한 목표 검색어' },
  { product: '누구나 콘텐츠', done: '더 쉬운 콘텐츠 준비' },
  { product: '누구나 콘텐츠', done: '더 분명한 발행 일정' },
  { product: '누구나 광고', done: '더 이해하기 쉬운 성과 확인' },
];

function Dot({ product }: { product: string }) {
  return <span aria-hidden className="rounded-dot h-[6px] w-[6px] shrink-0" style={{ background: TAG[product] }} />;
}

function NowRow({ delay }: { delay: number }) {
  return (
    <FadeUp delay={delay}>
      <div className="flex items-center gap-4 py-3.5 max-md:gap-3">
        <span className="w-[64px] shrink-0 text-[13px] font-semibold tracking-[0.06em] text-accent" style={EN}>NOW</span>
        <p className="flex-1 text-[15px] font-semibold leading-[1.45] text-text-primary max-md:text-[14px]">
          고객에게 필요한 기능을 계속 업데이트합니다.
        </p>
        <span aria-hidden className="rounded-dot h-[8px] w-[8px] shrink-0 animate-pulse bg-accent" style={{ boxShadow: '0 0 0 3px rgba(0,112,243,0.18)' }} />
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 1 — 「날짜만 뺀다」 한 일은 그대로, 왼쪽 날짜 칸만 없앤다
   ───────────────────────────────────────────────────────────── */
function PlanA() {
  return (
    <div className="divide-y divide-[#F0F0F0] border-y border-[#F0F0F0]">
      {NOW_ROWS.map((p, i) => (
        <FadeUp key={p.done} delay={Math.min(0.08 + i * 0.04, 0.3)}>
          <div className="flex items-center gap-4 py-3.5 max-md:gap-3">
            <Dot product={p.product} />
            <p className="flex-1 text-[15px] font-medium leading-[1.45] tracking-[-0.01em] text-text-primary max-md:text-[14px]">{p.done}</p>
            <span className="shrink-0 text-[12px] font-medium tracking-[-0.01em] text-[#6b7280] max-md:hidden">{p.product}</span>
          </div>
        </FadeUp>
      ))}
      <NowRow delay={0.32} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 2 — 「해온 일 → 해갈 일」 개선안 §3.6의 "방향" 4가지로 교체
   ───────────────────────────────────────────────────────────── */
function PlanB() {
  return (
    <div className="divide-y divide-[#F0F0F0] border-y border-[#F0F0F0]">
      {DIRECTIONS.map((p, i) => (
        <FadeUp key={p.done} delay={Math.min(0.08 + i * 0.04, 0.3)}>
          <div className="flex items-center gap-4 py-3.5 max-md:gap-3">
            <Dot product={p.product} />
            <p className="flex-1 text-[15px] font-medium leading-[1.45] tracking-[-0.01em] text-text-primary max-md:text-[14px]">{p.done}</p>
            <span className="shrink-0 text-[12px] font-medium tracking-[-0.01em] text-[#6b7280] max-md:hidden">{p.product}</span>
          </div>
        </FadeUp>
      ))}
      <NowRow delay={0.32} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 3 — 「제품 두 줄기」 날짜 대신 제품을 왼쪽 칸에 세워 두 갈래로 읽히게
   ───────────────────────────────────────────────────────────── */
function PlanC() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const groups = [
    { product: '누구나 콘텐츠', items: ['목표 검색어와 노출 현황', '노출 소식과 검색 변화 확인'] },
    { product: '누구나 광고', items: ['광고 소재 만들기', '월간 리포트 자동 생성'] },
  ];
  return (
    <div ref={ref} className="divide-y divide-[#F0F0F0] border-y border-[#F0F0F0]">
      {groups.map((g, gi) => (
        <div key={g.product} className="flex gap-4 py-3.5 max-md:gap-3">
          <span className="flex w-[96px] shrink-0 items-center gap-1.5 pt-[2px] max-md:w-[70px]">
            <Dot product={g.product} />
            <span className="text-[12px] font-semibold tracking-[-0.01em] text-[#6b7280] max-md:text-[11px]">
              {g.product.replace('누구나 ', '')}
            </span>
          </span>
          <div className="flex-1">
            {g.items.map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + (gi * 2 + i) * 0.08 }}
                className="text-[15px] font-medium leading-[1.7] tracking-[-0.01em] text-text-primary max-md:text-[14px]"
              >
                {t}
              </motion.p>
            ))}
          </div>
        </div>
      ))}
      <NowRow delay={0.4} />
    </div>
  );
}

/* ───────────────────────── 시안 한 벌 ───────────────────────── */
function Trial({ no, name, why, closing, children }: { no: string; name: string; why: string; closing: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-[#ECECEC]">
      <div className="bg-[#171717] px-12 py-3 max-md:px-6">
        <div className="mx-auto flex max-w-[1080px] items-baseline gap-3">
          <span className="text-[13px] font-bold text-white" style={EN}>{no}</span>
          <span className="text-[15px] font-semibold text-white">{name}</span>
          <span className="text-[13px] text-white/60 max-md:hidden">{why}</span>
        </div>
        <p className="mx-auto mt-1.5 hidden max-w-[1080px] text-[13px] leading-[1.5] text-white/60 max-md:block">{why}</p>
      </div>

      <div className="mx-auto max-w-[1080px] px-12 py-16 max-md:px-6 max-md:py-10">
        <div className="grid grid-cols-[5fr_7fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
          <FadeUp>
            <span className="mb-5 flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
              </svg>
              <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#555555]" style={EN}>Updates</span>
            </span>
            <h2 className="text-[clamp(26px,3.2vw,40px)] font-bold leading-[1.22] tracking-[-0.04em] text-text-primary text-balance">
              필요한 기능은<br />계속 더해집니다
            </h2>
          </FadeUp>
          <div>{children}</div>
        </div>

        {/* 마무리 문장 — 안마다 다르다 */}
        <div className="mt-10 flex justify-center text-center">{closing}</div>
      </div>
    </section>
  );
}

function Closing({ children }: { children: ReactNode }) {
  return (
    <FadeUp delay={0.2}>
      <p className="inline-block px-8 text-left text-[clamp(20px,5.4vw,25px)] font-bold leading-[1.5] tracking-[-0.02em] text-text-primary md:text-[clamp(23px,2.8vw,33px)]">
        {children}
      </p>
    </FadeUp>
  );
}

export default function Ads2Page() {
  return (
    <main className="bg-white">
      <div className="border-b border-[#ECECEC] px-12 py-14 max-md:px-6 max-md:py-10">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden className="text-[13px] text-accent">✦</span>
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-text-weak" style={EN}>Compare</span>
          </div>
          <h1 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary text-balance">
            메인 홈 &mdash; 업데이트 연표, 어느 쪽이 나으세요?
          </h1>
          <p className="mt-4 max-w-[700px] text-[15px] font-medium leading-[1.6] text-text-body max-md:text-[16px]">
            홈 아래쪽 &ldquo;필요한 기능은 계속 더해집니다&rdquo; 목록에 <b className="text-text-primary">2026.01 · 2026.04 · 2026.05 · 2026.06</b> 네 개의
            날짜가 있습니다. 그런데 코드 주석이 직접 <b className="text-text-primary">&ldquo;대표 가상 날짜&rdquo;</b>라고 적어두었습니다 &mdash; 지어낸 날짜입니다.
          </p>
          <p className="mt-3 max-w-[700px] text-[14px] leading-[1.6] text-text-weak">
            ⚠ <b className="text-text-body">기능은 진짜입니다.</b> 월간 리포트·광고 소재 만들기는 앱에 실제로 있습니다. 날짜만 가짜입니다.
            그래서 &ldquo;목록을 지운다&rdquo;가 아니라 <b className="text-text-body">날짜 자리를 어떻게 하느냐</b>가 선택입니다.
          </p>
          <div className="mt-5 border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3">
            <p className="text-[13px] font-semibold text-text-primary">맨 아래 문장도 함께 보십시오</p>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-text-body">
              지금은 &ldquo;<b>새로운 기능에도 기존 고객은 추가 비용이 없습니다</b>&rdquo;입니다. 앞으로 만들 <b>모든 것이 공짜</b>라는 약속으로 읽힐 수 있어
              개선안이 점검 대상으로 짚었습니다(영상 제작 같은 게 생기면 충돌). 안마다 다르게 넣었습니다.
            </p>
          </div>
        </div>
      </div>

      <Trial
        no="01"
        name="날짜만 뺀다"
        why="한 일은 그대로 두고 왼쪽 날짜 칸만 없앱니다 — 변화가 가장 적습니다"
        closing={<Closing>새로운 기능에도 기존 고객은<br /><span className="text-accent">추가 비용이 없습니다</span></Closing>}
      >
        <PlanA />
      </Trial>

      <Trial
        no="02"
        name="해온 일 → 해갈 일"
        why="개선안이 제시한 네 방향으로 바꿉니다 — 지난 일이 아니라 앞으로 좋아질 것"
        closing={<Closing>이용 중인 플랜의 기본 요금은<br /><span className="text-accent">그대로 유지됩니다</span></Closing>}
      >
        <PlanB />
      </Trial>

      <Trial
        no="03"
        name="제품 두 줄기"
        why="날짜 자리에 제품을 세워 콘텐츠·광고 두 갈래로 읽히게 합니다"
        closing={<Closing>지금 가입하신 요금은<br /><span className="text-accent">쓰시는 동안 그대로입니다</span></Closing>}
      >
        <PlanC />
      </Trial>

      <div className="border-t border-[#ECECEC] px-12 py-14 max-md:px-6 max-md:py-10">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-[14px] font-medium text-text-body">지금 홈과 비교하시려면</span>
          <a href="/" className="text-[14px] font-semibold text-accent underline underline-offset-4">메인 홈 열기 →</a>
          <span className="text-[13px] text-text-weak">아래쪽 &ldquo;필요한 기능은 계속 더해집니다&rdquo; 자리입니다. 아직 안 고쳤습니다.</span>
        </div>
      </div>
    </main>
  );
}
