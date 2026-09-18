'use client';

/* ══════════════════════════════════════════════════════════════════
   /ads2 — 시안 비교용 임시 페이지 (사장님 승인 2026-09-18)
   🛑 손님용 아님. Nav 미등록. 낙점되면 원본에 반영하고 다음 시안으로 갈아끼운다.
   이력: 챗봇 3안(낙점 2 → 1196e6a) / 리포트 3안(낙점 1 → b9eff7f) / 연표 3안(낙점 3 → 6f5eb0c)
        4차 = **요금표 구조** ← 지금

   【사장님 지적 2가지 (2026-09-18)】
   ① "누구나 콘텐츠랑 누구나 광고는 **아예 다른 앱**인데 4개를 붙여놓으니
      하나의 앱에 4개 플랜처럼 보인다" ← 가장 큰 문제
   ② "왠지 **밋밋하다**. 선이 너무 옅어서 그런 건지." (⛔ 억지로 뭘 더 넣으라는 뜻이 아님)

   【해결의 근거 — 정본에 이미 답이 있다】
   · DESIGN §1 = "제품 표기 = **NC/NA 로고 + 제품명**(✦아이콘·한글 라벨 금지). PC 40px·모바일 32px"
   · DESIGN §8.17 니즈 원문 = "로고는 **작게 쓰지 말 것**" / "칸칸이의 한 칸으로 꽉 채워도 돼"
   → 두 앱을 가르는 정본다운 장치 = **로고를 크게 세우는 것**. 이게 ①을 풀면서 ②(밋밋함)도 같이 푼다.
     밋밋함의 정체는 선 굵기가 아니라 **시각적 앵커(눈이 걸리는 지점)가 없는 것**이다.
     선을 진하게 하는 건 §8.17 "선 = 1px 고정" 위반이라 택하지 않았다.

   【공통으로 넣은 강조】§8.15 Vercel 실측 = "강조는 그림자가 아니라 **테두리 색·굵기**
     (Clone01 active 카드 = 1.5px 검정 border)". 추천 카드에 이 문법을 적용했다.
     ⛔ 블러·큰 그림자로 띄우지 않았다(§8.14-4·§8.17 블러 금지).
   ══════════════════════════════════════════════════════════════════ */

import { useState, type ReactNode } from 'react';
import FadeUp from '@/components/motion/FadeUp';

const EN = { fontFamily: 'var(--font-en)' } as const;
const LINE = '#ECECEC';

type Plan = { name: string; price: string; unit: string; desc: string; inherits?: string; items: string[]; cta: string; ctaSub: string; featured?: boolean };

const NC: Plan[] = [
  { name: '누구나 콘텐츠', price: '99,000', unit: '원 / 월', desc: '자료를 그때그때 직접 올릴 수 있는 가게를 위해.',
    items: ['네이버 블로그 글과 대표 이미지', '목표 검색어와 추천 주제', '검색 노출 위치 매일 확인', '노출 소식 주 1회 자동 반영', '검토 또는 자동 승인과 예약 발행', '사진을 첨부할 수 있는 앱 안 문의'],
    cta: '무료로 시작', ctaSub: '카드 등록 필요 없음' },
  { name: '콘텐츠 플러스', price: '149,000', unit: '원 / 월', desc: '사진은 많지만 매번 고르기 어려워 한꺼번에 맡기는 가게를 위해.',
    inherits: '누구나 콘텐츠의 모든 기능, 그리고:', featured: true,
    items: ['갖고 있던 사진 한꺼번에 맡기기', '맡긴 사진을 추천 글감에 자동 배분', '한 번 맡긴 자료로 여러 편 준비', '사진 보관함과 진행 상태 확인'],
    cta: '무료로 시작', ctaSub: '카드 등록 필요 없음' },
  { name: '콘텐츠 스튜디오', price: '299,000', unit: '원 / 월 부터', desc: '사진과 짧은 영상 운영을 함께 맡기는 가게를 위해.',
    inherits: '콘텐츠 플러스의 모든 기능, 그리고:',
    items: ['갖고 있던 영상 한꺼번에 맡기기', '쇼츠·릴스로 쓸 장면 선별', '제목·설명·해시태그 준비', '쇼츠·릴스 예약 발행'],
    cta: '상담 신청', ctaSub: '제공 편수에 따라 상담' },
];

const NA: Plan[] = [
  { name: '누구나 광고', price: '199,000', unit: '원 / 월', desc: '광고 제작부터 성과 확인까지, 이해하며 직접 운영하세요. 처음 연결과 사용은 저희가 도와드립니다.',
    items: ['매출·광고·방문자 통합 대시보드', '애드캔버스 광고 제작·운영 (메타·구글)', 'AI 챗봇 — 자료 조회·용어 설명·사용 안내', '월간 AI 리포트', '29CM·에이블리 트렌드 · 경쟁 비교'],
    cta: '무료로 시작', ctaSub: '카드 등록 필요 없음' },
];

/* 제품 머리 — 로고를 크게. 이게 두 앱을 가르는 앵커다(§1·§8.17) */
function ProductHead({ logo, name, note, size = 40 }: { logo: string; name: string; note: string; size?: number }) {
  return (
    <div className="flex items-start gap-3.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" width={size} height={size} className="shrink-0" style={{ width: size, height: size }} />
      <div className="min-w-0">
        <p className="text-[clamp(19px,2.2vw,24px)] font-bold leading-[1.25] tracking-[-0.03em] text-text-primary">{name}</p>
        <p className="mt-1 text-[14px] font-medium leading-[1.55] text-text-body">{note}</p>
      </div>
    </div>
  );
}

function Card({ p, compact }: { p: Plan; compact?: boolean }) {
  return (
    <div
      className={`relative flex flex-col p-7 max-md:p-6 ${p.featured ? 'bg-white' : 'bg-[#fafafa]'}`}
      /* §8.15 Vercel 실측: 강조 = 1.5px 검정 테두리. 나머지는 1px #ECECEC */
      style={{ border: p.featured ? '1.5px solid #171717' : `1px solid ${LINE}` }}
    >
      <p className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.02em] text-text-primary">
        {p.name}
        {p.featured && <span className="border border-[#171717] px-1.5 py-[1px] text-[11px] font-semibold">추천</span>}
      </p>
      {/* 가격은 절대 줄바꿈되지 않게 — 좁은 칸(안 2 좌우분할)에서 "299,/000"으로 깨졌다(실측) */}
      <p className="mt-3.5 flex flex-wrap items-baseline gap-x-1.5">
        <span className="whitespace-nowrap text-[clamp(24px,2.8vw,34px)] font-bold tracking-[-0.03em] text-text-primary" style={EN}>{p.price}</span>
        <span className="whitespace-nowrap text-[12.5px] font-medium text-text-muted">{p.unit}</span>
      </p>
      <p className="mt-3 text-[13.5px] font-medium leading-[1.6] text-text-body">{p.desc}</p>

      <div className="mt-5 border-t pt-5" style={{ borderColor: LINE }}>
        {p.inherits && <p className="mb-3 text-[12.5px] font-semibold text-text-muted">{p.inherits}</p>}
        <ul className={`flex flex-col gap-2.5 ${compact ? 'md:grid md:grid-cols-2 md:gap-x-6' : ''}`}>
          {p.items.map((t) => (
            <li key={t} className="flex gap-2 text-[13.5px] font-medium leading-[1.5] text-text-body">
              <span aria-hidden className="mt-[7px] h-[3px] w-[3px] shrink-0 bg-[#171717]" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-7">
        <a
          href="/start"
          style={p.featured ? { backgroundColor: '#171717', color: '#ffffff' } : undefined}
          className={`rounded-pill inline-flex h-[42px] items-center justify-center px-6 text-[13.5px] font-semibold transition-all ${
            p.featured ? 'hover:brightness-125' : 'border bg-white text-text-primary hover:border-[#171717]'
          }`}
        >
          {p.cta}
        </a>
        <p className="mt-2.5 text-[12px] text-text-muted">{p.ctaSub}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 1 — 「위아래로 나눔」 제품마다 로고 머리를 세우고 블록을 끊는다
   ───────────────────────────────────────────────────────────── */
function PlanA() {
  return (
    <div className="flex flex-col gap-14">
      <div>
        <FadeUp><ProductHead logo="/img/logo/nc.svg?v=16" name="누구나 콘텐츠" note="가게 콘텐츠를 만들고 발행합니다. 맡기는 양에 따라 세 가지." /></FadeUp>
        <div className="mt-6 grid gap-0 md:grid-cols-3">
          {NC.map((p) => <FadeUp key={p.name}><Card p={p} /></FadeUp>)}
        </div>
      </div>
      {/* 제품 경계 = 굵은 여백 + 전폭 선 하나. 선을 진하게 하지 않고 '끊김'으로 나눈다 */}
      <div className="h-px w-full" style={{ background: LINE }} />
      <div>
        <FadeUp><ProductHead logo="/img/logo/na.svg?v=20" name="누구나 광고" note="쇼핑몰 광고를 만들고 성과를 봅니다. 단일 요금." /></FadeUp>
        <div className="mt-6">
          <FadeUp><Card p={NA[0]} compact /></FadeUp>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 2 — 「좌우로 나눔」 한 화면에 나란히, 사이를 벌려 다른 제품임을 보인다
   ───────────────────────────────────────────────────────────── */
function PlanB() {
  return (
    <div className="grid gap-10 lg:grid-cols-[7fr_3fr] lg:gap-8">
      <div>
        <FadeUp><ProductHead logo="/img/logo/nc.svg?v=16" name="누구나 콘텐츠" note="맡기는 양에 따라 세 가지." size={36} /></FadeUp>
        <div className="mt-5 grid gap-0 md:grid-cols-3">
          {NC.map((p) => <FadeUp key={p.name}><Card p={p} /></FadeUp>)}
        </div>
      </div>
      <div>
        <FadeUp><ProductHead logo="/img/logo/na.svg?v=20" name="누구나 광고" note="단일 요금." size={36} /></FadeUp>
        <div className="mt-5 h-[calc(100%-76px)]">
          <FadeUp><div className="h-full"><Card p={NA[0]} /></div></FadeUp>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   안 3 — 「제품을 골라서 본다」 탭 전환. 한 번에 한 앱만 보여준다
   ───────────────────────────────────────────────────────────── */
function PlanC() {
  const [tab, setTab] = useState<'nc' | 'na'>('nc');
  const tabs = [
    { key: 'nc' as const, logo: '/img/logo/nc.svg?v=16', name: '누구나 콘텐츠', note: '세 가지' },
    { key: 'na' as const, logo: '/img/logo/na.svg?v=20', name: '누구나 광고', note: '단일 요금' },
  ];
  return (
    <div>
      <div className="flex gap-0 border-b" style={{ borderColor: LINE }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2.5 px-6 py-4 text-left transition-all max-md:px-4 ${tab === t.key ? '' : 'opacity-45 hover:opacity-70'}`}
            style={{ borderBottom: tab === t.key ? '2px solid #171717' : '2px solid transparent', marginBottom: '-1px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.logo} alt="" width={30} height={30} style={{ width: 30, height: 30 }} />
            <span className="min-w-0">
              <span className="block text-[15px] font-bold tracking-[-0.02em] text-text-primary max-md:text-[13.5px]">{t.name}</span>
              <span className="block text-[12px] font-medium text-text-muted">{t.note}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === 'nc' ? (
          <div className="grid gap-0 md:grid-cols-3">{NC.map((p) => <Card key={p.name} p={p} />)}</div>
        ) : (
          <Card p={NA[0]} compact />
        )}
      </div>
    </div>
  );
}

function Trial({ no, name, why, children }: { no: string; name: string; why: string; children: ReactNode }) {
  return (
    <section className="border-t" style={{ borderColor: LINE }}>
      <div className="bg-[#171717] px-12 py-3 max-md:px-6">
        <div className="mx-auto flex max-w-[1080px] items-baseline gap-3">
          <span className="text-[13px] font-bold text-white" style={EN}>{no}</span>
          <span className="text-[15px] font-semibold text-white">{name}</span>
          <span className="text-[13px] text-white/60 max-md:hidden">{why}</span>
        </div>
        <p className="mx-auto mt-1.5 hidden max-w-[1080px] text-[13px] leading-[1.5] text-white/60 max-md:block">{why}</p>
      </div>
      <div className="mx-auto max-w-[1180px] px-12 py-16 max-md:px-5 max-md:py-10">{children}</div>
    </section>
  );
}

export default function Ads2Page() {
  return (
    <main className="bg-white">
      <div className="border-b px-12 py-14 max-md:px-6 max-md:py-10" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden className="text-[13px] text-accent">✦</span>
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-text-weak" style={EN}>Compare</span>
          </div>
          <h1 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-text-primary text-balance">
            요금표 &mdash; 두 앱을 어떻게 나눌까요?
          </h1>
          <p className="mt-4 max-w-[700px] text-[15px] font-medium leading-[1.6] text-text-body max-md:text-[16px]">
            지금은 네 칸이 한 줄로 붙어 있어 <b className="text-text-primary">한 앱의 네 가지 플랜</b>처럼 보입니다.
            실제로는 <b className="text-text-primary">콘텐츠(3단)</b>와 <b className="text-text-primary">광고(단일)</b> 두 개의 다른 앱입니다.
          </p>
          <p className="mt-3 max-w-[700px] text-[14px] leading-[1.6] text-text-weak">
            세 안 모두 <b className="text-text-body">제품 로고를 크게 세워</b> 경계를 만들었습니다. 밋밋함도 같은 이유였습니다 &mdash;
            선이 옅어서가 아니라 <b className="text-text-body">눈이 걸릴 지점이 없어서</b>입니다. 선은 규칙대로 1px 그대로 두고,
            추천 카드만 <b className="text-text-body">1.5px 검정 테두리</b>로 세웠습니다(그림자·번짐 없이).
          </p>
        </div>
      </div>

      <Trial no="01" name="위아래로 나눔" why="제품마다 로고 머리를 세우고 블록을 끊습니다 — 경계가 가장 분명합니다">
        <PlanA />
      </Trial>
      <Trial no="02" name="좌우로 나눔" why="한 화면에 나란히 — 둘 다 한눈에 보이면서 영역이 갈립니다">
        <PlanB />
      </Trial>
      <Trial no="03" name="제품을 골라서 본다" why="탭으로 전환 — 한 번에 한 앱만. 가장 단순하지만 나머지가 안 보입니다">
        <PlanC />
      </Trial>

      <div className="border-t px-12 py-14 max-md:px-6 max-md:py-10" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-[14px] font-medium text-text-body">지금 요금 페이지와 비교하시려면</span>
          <a href="/pricing" className="text-[14px] font-semibold text-accent underline underline-offset-4">요금 페이지 열기 →</a>
          <span className="text-[13px] text-text-weak">아직 네 칸이 한 줄로 붙어 있습니다.</span>
        </div>
      </div>
    </main>
  );
}
