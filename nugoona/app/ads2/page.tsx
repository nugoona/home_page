'use client';

/* ══════════════════════════════════════════════════════════════════
   /ads2 — 시안 비교용 임시 페이지 (사장님 승인 2026-09-18)
   🛑 손님용 아님. Nav 미등록. 낙점되면 원본에 반영하고 다음 섹션 시안으로 갈아끼운다.
   이력: 1차 = 챗봇 3안(2026-09-18, 사장님 낙점 "2번" → 원본 반영 완료, 커밋 1196e6a)
        2차 = 월간 리포트 3안 ← 지금

   【왜 고치나 — 사실 근거】
   현재 /ads 리포트 목업은 ①헤더 "매월 1일 **오전 7시 5분** 업데이트" ②칩 "**9개의** 섹션"
   ③각주 "아래 **여덟 개** 섹션의 숫자를 모두 읽고" 라고 말한다. 그러나 기능 지도
   (ngn_dashboard/.ngn-map/stage-6-report.json)는:
     · 구성 = **6개 영역**(#460~#465). #466 = 7~9번은 읽기·쓰기 모두 거부.
       ①지난달 매출 ②손님이 어디서 와서 어떻게 샀나 ③어떤 상품이 잘됐나
       ④광고 성과 ⑤시장에서 뭐가 팔리나(29CM) ⑥이번 달 목표와 할 일
     · 시각 = 1일 **06:00** 숫자 합치기 → **06:20** 스냅샷(해설 없음) → **16:00** AI 해설 붙여 완성
       (#470~#472, "업체당 약 10분 소요"). **오전 7시 5분은 어디에도 없다.**
   → 9개를 6개로 줄이고, 없는 시각을 지운다.

   【디자인 계승】RptSidebar 실측값 그대로 — 카드 440px · 보더 #EDEDED ·
     그림자 0 6px 24px rgba(0,0,0,.09) · 헤더 #171717 · AI분석 좌보더 #003366 / 배경 #F8F9FA ·
     미니카드 보더 #f0f0f0. §8.17 색 3개·1px 선·블러 금지 준수.
   ══════════════════════════════════════════════════════════════════ */

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import { Marquee } from '@/components/lab-sources/magicui/marquee';

const EN = { fontFamily: 'var(--font-en)' } as const;
const C_BORDER = '#EDEDED';
const CARD_SHADOW = '0 6px 24px rgba(0,0,0,0.09)';

/* ─────────────────────────────────────────────────────────────
   지도 6개 영역 — 구 9개를 합쳐 맞춘 것
   구 '주요 유입 채널' + '고객 방문·구매 여정'  → ② 손님 유입과 구매 여정
   구 '시장 트렌드 확인' + '시장과 자사몰 비교'  → ⑤ 시장에서 뭐가 팔리나
   구 '익월 목표·시장 전망' + 고정컷 '전략 액션 플랜' → ⑥ 이번 달 목표와 할 일
   ───────────────────────────────────────────────────────────── */
const SECTIONS: { n: string; t: string; ai: string; body: ReactNode }[] = [
  {
    n: '01', t: '지난달 매출', ai: '매출은 줄었지만 광고 효율은 좋아졌어요.',
    body: (
      <div className="grid grid-cols-3 gap-[3px]">
        {[['매출', '₩34.0M', '#dc3545', '▼6.9%'], ['주문', '610건', '#dc3545', '▼1.6%'], ['ROAS', '641%', '#28a745', '▲38%p']].map(([l, v, c, d]) => (
          <div key={l} className="border border-[#F0F0F0] px-1 py-[3px]">
            <p className="text-[6px] text-[#868E96]">{l}</p>
            <p className="text-[7.5px] font-bold text-[#212529]" style={EN}>{v}</p>
            <p className="text-[5.5px] font-bold" style={{ color: c as string, fontFamily: 'var(--font-en)' }}>{d}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '02', t: '손님 유입과 구매 여정', ai: '인스타 유입은 늘었는데 장바구니 이탈도 늘었어요.',
    body: (
      <div className="space-y-[3px]">
        <div className="flex bg-[#003366] px-1 py-[2px] text-[5.5px] font-bold text-white"><span className="flex-1">채널</span><span className="w-7 text-right">유입수</span><span className="w-6 text-right">비중</span></div>
        {[['네이버 검색', '4,120', '33%'], ['인스타그램', '3,610', '29%']].map(([c, n, r]) => (
          <div key={c} className="flex border-b border-[#F5F5F5] px-1 py-[2px] text-[6px] text-[#495057]"><span className="flex-1">{c}</span><span className="w-7 text-right" style={EN}>{n}</span><span className="w-6 text-right" style={EN}>{r}</span></div>
        ))}
        {[['유입', '12,400', 92, '#1e293b'], ['장바구니', '980', 56, '#9fb6d4'], ['주문', '610', 30, '#0070f3']].map(([l, n, w, c]) => (
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-[26px] shrink-0 text-[5.5px] text-[#868E96]">{l}</span>
            <span className="h-[7px]" style={{ width: `${w}%`, background: c as string, opacity: 0.75 }} />
            {/* nowrap = 좁은 칸에서 "12,400"이 두 줄로 깨지던 것 수정(실측) */}
            <span className="whitespace-nowrap text-[5.5px] text-[#495057]" style={EN}>{n}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '03', t: '어떤 상품이 잘됐나', ai: '린넨 원피스가 구매·조회 모두 1위예요.',
    body: (
      <div className="space-y-[3px]">
        {[['린넨 원피스', 90], ['프린지 니트', 64], ['샴브레이 셔츠', 46]].map(([n, w]) => (
          <div key={n as string} className="flex items-center gap-1">
            <span className="w-[34px] shrink-0 truncate text-[5.5px] text-[#495057]">{n}</span>
            <span className="h-[6px] bg-[#9fb6d4]" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '04', t: '광고 성과', ai: '영상 소재의 효율이 이미지보다 높아요.',
    body: (
      <div className="space-y-[2px]">
        {[['1', '여름 신상 15초 영상', '812%'], ['2', '원피스 단품 이미지', '641%'], ['3', '룩북 캐러셀', '397%']].map(([r, n, v]) => (
          <div key={r as string} className="flex items-center gap-1 border-b border-[#F5F5F5] py-[2px] text-[6px]">
            <span className="flex h-[8px] w-[8px] items-center justify-center bg-[#003366]/20 text-[5px] font-bold text-[#003366]" style={EN}>{r}</span>
            <span className="min-w-0 flex-1 truncate text-[#495057]">{n}</span>
            <span className="font-bold text-[#0070f3]" style={EN}>{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '05', t: '시장에서 뭐가 팔리나', ai: '여름 원피스가 빠르게 오르고 있어요. 우리가 8% 저렴해요.',
    body: (
      <div className="space-y-[3px]">
        <div className="grid grid-cols-5 gap-[3px]">
          {['/img/ads/set-7.webp', '/img/ads/set-9.webp', '/img/ads/set-8.webp', '/img/ads/set-10.webp', '/img/unsplash/webp/photo-1434389677669-e08b4cac3105.webp'].map((im) => (
            <span key={im} className="relative block aspect-square overflow-hidden bg-[#fafafa]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im} alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
          ))}
        </div>
        <div className="flex border-b border-[#F5F5F5] px-1 py-[2px] text-[6px] text-[#495057]"><span className="flex-1 text-[#868E96]">평균가</span><span className="w-9 text-right" style={EN}>₩42,000</span><span className="w-9 text-right font-bold" style={EN}>₩38,600</span></div>
      </div>
    ),
  },
  {
    n: '06', t: '이번 달 목표와 할 일', ai: '다음 달은 성수기예요. 목표를 높여도 좋아요.',
    body: (
      <div className="grid grid-cols-3 gap-[3px]">
        {[['작년 7월', '₩29.8M', '#495057'], ['올해 6월', '₩34.0M', '#495057'], ['7월 목표', '+5~10%', '#0070f3']].map(([l, v, c]) => (
          <div key={l as string} className="border border-[#F0F0F0] px-1 py-[3px] text-center">
            <p className="text-[5.5px] text-[#868E96]">{l}</p>
            <p className="text-[7px] font-bold" style={{ color: c as string, fontFamily: 'var(--font-en)' }}>{v}</p>
          </div>
        ))}
      </div>
    ),
  },
];

/* 고정 컷 = ⑥ 이번 달 목표와 할 일. 구 RPT_PLAN 그대로(리포트가 내놓는 제안 = 지도 #465) */
const PLAN = [
  { icon: '🎯', title: '‘린넨 원피스’ 예산 집중', b1: '이번 달 ROAS가 가장 높았던 상품입니다.', b2: ' 다음 달 광고 예산을 20% 더 배정해 성수기 수요를 잡으세요.' },
  { icon: '🛒', title: '장바구니 이탈 회복', b1: '담김은 늘었지만 주문 전환이 줄었습니다.', b2: ' 이탈 고객 리타겟팅 광고를 켜 두세요.' },
];

/* 카드 머리 — 셋이 공유. 시각 문구만 안마다 다르다 */
function Head({ sub }: { sub: string }) {
  return (
    <div className="flex items-center justify-between bg-[#171717] px-4 py-3">
      <div>
        <p className="flex items-center gap-2 text-[12.5px] font-bold text-white">
          2026. 6 월간 리포트
          <span className="ads-pulse flex h-[14px] items-center bg-[#0070f3] px-1.5 text-[7.5px] font-bold text-white" style={EN}>NEW</span>
        </p>
        <p className="mt-0.5 text-[9px] font-medium text-white/70">{sub}</p>
      </div>
      <span className="text-[10px] font-medium text-white/65">데모 화면</span>
    </div>
  );
}

function PlanBlock({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  const typed = PLAN[0].b1 + PLAN[0].b2;
  const b1Len = PLAN[0].b1.length;
  return (
    <>
      <p className="text-[12px] font-bold tracking-[-0.01em] text-[#171717]">
        이번 달 목표와 할 일 <span className="ml-1 text-[9.5px] font-medium text-[#666]">이것부터 하세요</span>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {PLAN.map((c, ci) => (
          <div key={c.title} className="border border-[#eeeeee] bg-white p-2.5">
            <p className="flex items-center gap-1.5 border-b border-[#f0f0f0] pb-1.5">
              <span className="text-[13px] leading-none">{c.icon}</span>
              <span className="text-[10.5px] font-bold leading-[1.3] tracking-[-0.01em] text-[#171717]">{c.title}</span>
            </p>
            <p className="mt-1.5 min-h-[52px] text-[9.5px] font-medium leading-[1.6] text-[#495057] max-md:min-h-0">
              {ci === 0 ? (
                <>
                  {typed.split('').map((ch, i) => (
                    <motion.span key={i} className={i >= b1Len ? 'max-md:hidden' : undefined} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={reduce ? { duration: 0 } : { duration: 0, delay: 0.7 + i * 0.05 }}>{ch}</motion.span>
                  ))}
                  <motion.span aria-hidden className="ml-[2px] inline-block h-[10px] w-[1.5px] bg-[#171717]/60 align-middle" animate={reduce ? { opacity: 0.5 } : { opacity: [1, 0, 1] }} transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'linear' }} />
                </>
              ) : (
                <>{c.b1}<span className="max-md:hidden">{c.b2}</span></>
              )}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 1 — 「정직하게 6개로」 지금 구조 그대로, 숫자만 사실에 맞춤
   ───────────────────────────────────────────────────────────── */
function PlanA({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  const rolling = SECTIONS.slice(0, 5); // ⑥은 고정 컷이 담당
  return (
    <div className="w-[440px] max-w-full bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: CARD_SHADOW }}>
      <Head sub="매월 1일 업데이트" />
      <div className="p-4">
        <PlanBlock inView={inView} reduce={reduce} />
        <div className="mt-2 border-l-[3px] border-[#003366] bg-[#F8F9FA] px-3 py-2">
          <p className="text-[9.5px] font-medium leading-[1.6] text-[#495057]">
            <b className="font-bold text-[#003366]">AI 분석</b> — 아래 다섯 개 섹션의 숫자를 모두 읽고 내린 결론입니다.
          </p>
        </div>
        <div className="lab-sources-scope relative mt-2 h-[190px] overflow-hidden border-y border-[#ececec]">
          <Marquee vertical className="h-full p-0 [--duration:24s] [--gap:0.5rem]">
            {rolling.map((m) => (
              <div key={m.t} className="grid grid-cols-[1fr_86px] gap-1.5">
                <div className="border border-[#f0f0f0] bg-white p-2">
                  <p className="mb-1.5 text-[9px] font-bold text-[#003366]">{m.t}</p>
                  {m.body}
                </div>
                <div className="border-l-2 border-[#003366]/60 bg-[#F8F9FA] p-1.5">
                  <p className="text-[7.5px] font-bold text-[#003366]/70">AI 분석</p>
                  <p className="mt-1 text-[6.5px] font-medium leading-[1.55] text-[#495057]">{m.ai}</p>
                </div>
              </div>
            ))}
          </Marquee>
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 5px 6px -4px rgba(0,0,0,0.16), inset 0 -5px 6px -4px rgba(0,0,0,0.16)' }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 2 — 「여섯 개를 한눈에」 도는 것 없이 목차를 다 보여준다
   ───────────────────────────────────────────────────────────── */
function PlanB({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  return (
    <div className="w-[440px] max-w-full bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: CARD_SHADOW }}>
      <Head sub="매월 1일 업데이트" />
      <div className="p-4">
        <PlanBlock inView={inView} reduce={reduce} />
        <div className="mt-2 border-l-[3px] border-[#003366] bg-[#F8F9FA] px-3 py-2">
          <p className="text-[9.5px] font-medium leading-[1.6] text-[#495057]">
            <b className="font-bold text-[#003366]">AI 분석</b> — 여섯 개 섹션의 숫자를 모두 읽고 내린 결론입니다.
          </p>
        </div>
        <div className="mt-2 border-y border-[#ececec] py-1">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.3 + i * 0.09 }}
              className="flex items-center gap-2 border-b border-[#F5F5F5] px-1 py-[7px] last:border-b-0"
            >
              <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center bg-[#003366] text-[7px] font-bold text-white" style={EN}>{s.n}</span>
              <span className="min-w-0 flex-1 truncate text-[10px] font-bold text-[#171717]">{s.t}</span>
              <span className="min-w-0 flex-[1.3] truncate text-[8.5px] font-medium text-[#495057]">{s.ai}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-2 text-[8.5px] font-medium text-[#868E96]">섹션마다 숫자와 AI 해설이 함께 담깁니다</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 3 — 「어떻게 만들어지나」 밤새 모으고 → 낮에 해설 붙고 → 완성
   (개선안 §5.3 "완성 화면만 놓지 말고 겪는 과정을 보여라")
   ───────────────────────────────────────────────────────────── */
function PlanC({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  const steps = [
    { k: '새벽', t: '지난달 숫자를 모읍니다', d: '매출·유입·상품·광고·시장' },
    { k: '낮', t: 'AI가 해설을 붙입니다', d: '여섯 개 섹션에 한 줄씩' },
    { k: '완성', t: '할 일까지 정리해 도착', d: '이번 달 이것부터 하세요' },
  ];
  return (
    <div className="w-[440px] max-w-full bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: CARD_SHADOW }}>
      <Head sub="매월 1일 업데이트" />
      <div className="p-4">
        {/* 만들어지는 3단계 */}
        <div className="grid grid-cols-3 gap-1.5">
          {steps.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.2 + i * 0.28 }}
              className="border border-[#eeeeee] bg-white p-2.5"
            >
              <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-[#003366]" style={EN}>{s.k}</p>
              <p className="mt-1.5 text-[10px] font-bold leading-[1.35] tracking-[-0.01em] text-[#171717]">{s.t}</p>
              <p className="mt-1 text-[8.5px] font-medium leading-[1.5] text-[#868E96]">{s.d}</p>
            </motion.div>
          ))}
        </div>

        {/* 완성물 미리보기 — 섹션 6개가 채워지는 장면 */}
        <div className="mt-2.5 border-y border-[#ececec] py-2">
          <p className="mb-1.5 text-[9px] font-bold text-[#003366]">완성된 리포트</p>
          <div className="grid grid-cols-2 gap-1.5">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 1.0 + i * 0.13 }}
                className="flex items-center gap-1.5 border border-[#f0f0f0] bg-white px-2 py-[6px]"
              >
                <span className="flex h-[13px] w-[13px] shrink-0 items-center justify-center bg-[#003366] text-[6.5px] font-bold text-white" style={EN}>{s.n}</span>
                <span className="min-w-0 flex-1 truncate text-[9px] font-bold text-[#171717]">{s.t}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-2 border-l-[3px] border-[#003366] bg-[#F8F9FA] px-3 py-2">
          <p className="text-[9.5px] font-medium leading-[1.6] text-[#495057]">
            <b className="font-bold text-[#003366]">AI 분석</b> — 여섯 개 섹션의 숫자를 모두 읽고 이번 달 할 일을 짚어 드립니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 시안 한 벌 ───────────────────────── */
function Trial({
  no, name, why, heading, body, children,
}: { no: string; name: string; why: string; heading: ReactNode; body: string; children: (inView: boolean, reduce: boolean) => ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = !!useReducedMotion(); // 훅은 boolean|null 반환 — 자식 시그니처에 맞춰 좁힌다

  return (
    <section ref={ref} className="border-t border-[#ECECEC]">
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
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-text-weak" style={EN}>Report</span>
            </div>
            <h3 className="mb-4 text-[clamp(22px,3vw,30px)] font-bold leading-[1.25] tracking-[-0.02em] text-text-primary text-balance">{heading}</h3>
            <p className="text-[15px] font-medium leading-[1.65] text-text-body max-md:text-[16px]">{body}</p>
          </FadeUp>

          {/* ⚠ w-full 필수 — 없으면 440px 카드가 모바일(390)에서 화면 밖으로 잘린다(실측).
              원본 AdsReportScene도 `w-full max-w-[980px]` 로 감싸서 해결하고 있다. */}
          <div className="w-full min-w-0 max-md:order-[-1]">
            <FadeUp delay={0.12}>
              <div
                className="flex w-full justify-center px-8 py-12 max-md:px-4 max-md:py-8"
                style={{ background: '#FAFAFA', backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)', backgroundSize: '14px 14px', border: `1px solid ${C_BORDER}` }}
              >
                {children(inView, reduce)}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
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
            월간 리포트 — 어느 쪽이 나으세요?
          </h1>
          <p className="mt-4 max-w-[680px] text-[15px] font-medium leading-[1.6] text-text-body max-md:text-[16px]">
            지금 광고 페이지는 리포트가 <b className="text-text-primary">&ldquo;9개 섹션&rdquo;</b>이고
            <b className="text-text-primary"> &ldquo;매월 1일 오전 7시 5분&rdquo;</b>에 온다고 말합니다.
            그런데 실제 리포트는 <b className="text-text-primary">6개</b>이고, 완성되는 시각은
            <b className="text-text-primary"> 오후</b>입니다. 오전 7시 5분은 근거가 없습니다.
          </p>
          <p className="mt-3 max-w-[680px] text-[14px] leading-[1.6] text-text-weak">
            세 안 모두 <b className="text-text-body">6개로 맞추고 시각을 뺐습니다.</b> 다른 건
            <b className="text-text-body"> 6개를 어떻게 보여주느냐</b>입니다. 카드 틀·색·그림자는 원본 그대로입니다.
          </p>
          <div className="mt-5 border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3">
            <p className="text-[13px] font-semibold text-text-primary">실제 6개 (앱 기능 지도 기준)</p>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-text-body">
              ① 지난달 매출 · ② 손님이 어디서 와서 어떻게 샀나 · ③ 어떤 상품이 잘됐나 ·
              ④ 광고 성과 · ⑤ 시장에서 뭐가 팔리나 · ⑥ 이번 달 목표와 할 일
            </p>
          </div>
        </div>
      </div>

      <Trial
        no="01"
        name="정직하게 6개로"
        why="지금 모양 그대로 — 도는 카드를 8개에서 5개로 줄이고 숫자만 사실에 맞췄습니다"
        heading={<>한 달의 결과와, 다음<br />할 일을 정리합니다.</>}
        body="매출과 유입, 상품과 광고를 함께 살펴보고 이번 달 확인할 내용을 쉬운 말로 정리합니다."
      >
        {(v, r) => <PlanA inView={v} reduce={r} />}
      </Trial>

      <Trial
        no="02"
        name="여섯 개를 한눈에"
        why="도는 것 없이 목차를 다 보여줍니다 — 몇 개인지가 아니라 무엇이 들었는지"
        heading={<>무엇이 담기는지<br />먼저 보여드립니다.</>}
        body="여섯 가지를 한 번에 정리해 드립니다. 섹션마다 숫자와 AI 해설이 함께 담깁니다."
      >
        {(v, r) => <PlanB inView={v} reduce={r} />}
      </Trial>

      <Trial
        no="03"
        name="어떻게 만들어지나"
        why="완성품만 놓지 않고 만들어지는 과정을 보여줍니다 — 새벽에 모으고, 낮에 해설이 붙고, 완성"
        heading={<>매달 1일,<br />저절로 정리돼 있습니다.</>}
        body="지난달 숫자를 모으고 해설을 붙여 이번 달 할 일까지 정리해 드립니다."
      >
        {(v, r) => <PlanC inView={v} reduce={r} />}
      </Trial>

      <div className="border-t border-[#ECECEC] px-12 py-14 max-md:px-6 max-md:py-10">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-[14px] font-medium text-text-body">원본과 비교하시려면</span>
          <a href="/ads" className="text-[14px] font-semibold text-accent underline underline-offset-4">지금 광고 페이지 열기 →</a>
          <span className="text-[13px] text-text-weak">원본은 아직 9개짜리 그대로입니다.</span>
        </div>
      </div>
    </main>
  );
}
