import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import StoryStep from '@/components/home/StoryStep';
import ShotFrame from '@/components/ui/ShotFrame';
import S9_ChannelFanout from '@/components/styles/S9_ChannelFanout';
import S11_NewsEngine from '@/components/styles/S11_NewsEngine';
import S12_MapExposure from '@/components/styles/S12_MapExposure';
import S14_Generate from '@/components/styles/S14_Generate';
import S10_RankTrack from '@/components/styles/S10_RankTrack';
import S13_Onboarding from '@/components/styles/S13_Onboarding';
import { promise } from '@/lib/content/home';

const EN = { fontFamily: 'var(--font-en)' } as const;

/** 소구 섹션 공통 래퍼 — 번호칩 + 디바이더(ShowcaseRow와 동일 패턴) 위에 확정 목업 컴포넌트를 얹는다. */
function FeatureBlock({
  num, alt, emphasis, children,
}: { num: string; alt?: boolean; emphasis?: boolean; children: React.ReactNode }) {
  return (
    <Section alt={alt}>
      <div className={`max-w-[1080px] mx-auto px-12 max-md:px-6 ${emphasis ? 'py-28 max-md:py-16' : 'py-20 max-md:py-14'}`}>
        <FadeUp className="flex items-center gap-3 mb-10">
          <span className="w-8 h-8 flex items-center justify-center text-[13px] font-bold text-white bg-[#171717] shrink-0" style={EN}>{num}</span>
          <div className="flex-1 h-px bg-border-default" />
        </FadeUp>
        {children}
      </div>
    </Section>
  );
}

export const metadata: Metadata = {
  // 히어로 = GPT+사장님 확정 카피(2026-07-08, lib/content/content.ts hero) 토씨 그대로 — 임의 변형 금지(2026-07-11 재확정 "원문 그대로")
  title: '누구나, 검색 결과에 내 스토어가 바로 보이길 원합니다',
  description:
    '광고는 멈추면 사라지지만, 꾸준히 쌓은 글은 검색에 남아 스토어를 계속 보이게 합니다. 그 꾸준함을, 누구나 콘텐츠가 대신합니다.',
};

/* ── 3기둥 미니 다이어그램 (§8.7-I + 사내 목업 기준 = /ads DataPipelineVisual 문법:
      노드 = 보더 박스+컬러 점+실제 라벨 / 엣지 = 직각 엘보+흐르는 도트(SMIL — 서버 컴포넌트에서도 동작) ── */
function MiniFanout() {
  const edges = ['M56 48H92', 'M92 48V18H128', 'M92 48H128', 'M92 48V78H128'];
  return (
    <svg viewBox="0 0 220 96" className="w-full h-[88px] mb-6" aria-hidden>
      <defs>
        <path id="mf1" d="M56 48H92V18H128" />
        <path id="mf2" d="M56 48H128" />
        <path id="mf3" d="M56 48H92V78H128" />
      </defs>
      {/* 소스 노드: 사진 */}
      <rect x="14" y="32" width="42" height="32" fill="#fff" stroke="#c9cdd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M20 56l8-7 6 4 5-5 11 8" fill="none" stroke="#b7bec6" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx="26" cy="41" r="2.2" fill="none" stroke="#b7bec6" strokeWidth="1.5" />
      {edges.map((d) => <path key={d} d={d} fill="none" stroke="#c9c9c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
      <circle cx="92" cy="48" r="3" fill="#0070f3" />
      {/* 채널 노드: 보더 박스 + 컬러 점 + 라벨 */}
      {[["#03c75a", '블로그', 18], ['#e1306c', '인스타그램', 48], ['#1877f2', '페이스북', 78]].map(([c, label, y]) => (
        <g key={label as string}>
          <rect x={128} y={(y as number) - 11} width="78" height="22" fill="#fff" stroke="#c9cdd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx={140} cy={y as number} r="3.2" fill={c as string} />
          <text x={149} y={(y as number) + 3.5} fontSize="10" fontWeight="600" fill="#333">{label}</text>
        </g>
      ))}
      {/* 흐르는 도트 (파이프라인 문법) */}
      {['mf1', 'mf2', 'mf3'].map((id, i) => (
        <circle key={id} r="2.4" fill="#0070f3">
          <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ))}
    </svg>
  );
}
function MiniNews() {
  return (
    <svg viewBox="0 0 220 96" className="w-full h-[88px] mb-6" aria-hidden>
      <defs><path id="mn1" d="M24 30V56H56" /></defs>
      {/* 소식 노드 */}
      <rect x="12" y="8" width="122" height="22" fill="#fff" stroke="#c9cdd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <circle cx="24" cy="19" r="3.2" fill="#03c75a" />
      <text x="33" y="22.5" fontSize="10" fontWeight="600" fill="#333">플레이스 노출 소식</text>
      {/* 엣지 + 도트 */}
      <path d="M24 30V56H56" fill="none" stroke="rgba(0,112,243,0.5)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx="56" cy="56" r="3" fill="#0070f3" />
      <circle r="2.4" fill="#0070f3"><animateMotion dur="2.2s" repeatCount="indefinite"><mpath href="#mn1" /></animateMotion></circle>
      {/* 글 노드 */}
      <rect x="64" y="40" width="142" height="42" fill="#fff" stroke="#c9cdd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {/* 실물 인용(감독관 4차 하2 — 스켈레톤 바 대신 아래 02 섹션의 실제 인용 미니어처) */}
      <text x="72" y="58" fontSize="16" fill="#171717" fontFamily="var(--font-quote), serif">&ldquo;</text>
      <text x="84" y="57" fontSize="9.5" fill="#333" fontFamily="var(--font-quote), serif">성수역 3번 출구에서 걸어서 5분</text>
      <text x="84" y="72" fontSize="8" fill="#0070f3">— 다음 글에 자동 반영</text>
    </svg>
  );
}
function MiniMap() {
  return (
    <svg viewBox="0 0 220 96" className="w-full h-[88px] mb-6" aria-hidden>
      <path d="M0 30H220M0 66H220M60 0V96M128 0V96M182 0V96" stroke="#ececec" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <rect x="70" y="38" width="48" height="20" fill="#f6f6f6" />
      <rect x="138" y="38" width="34" height="20" fill="#f6f6f6" />
      <path d="M94 48V30" stroke="#0070f3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <rect x="87" y="16" width="14" height="14" fill="#0070f3" />
      {/* 채널 노드: 점+라벨 (파이프라인 문법 — 라벨 없는 점 금지) */}
      <g>
        <rect x="108" y="70" width="52" height="18" fill="#fff" stroke="#c9cdd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx="118" cy="79" r="3" fill="#03c75a" />
        <text x="125" y="82.5" fontSize="9" fontWeight="600" fill="#333">네이버</text>
      </g>
      <g>
        <rect x="164" y="70" width="46" height="18" fill="#fff" stroke="#c9cdd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx="174" cy="79" r="3" fill="#4285f4" />
        <text x="181" y="82.5" fontSize="9" fontWeight="600" fill="#333">구글</text>
      </g>
    </svg>
  );
}

const bridge = [
  { n: '01', t: '전 채널 발행', d: '사진 한 번이면 블로그·플레이스·SNS까지', art: MiniFanout },
  { n: '02', t: '노출 소식 자동 반영', d: '노출 방식이 바뀌어도 앱이 매주 따라감', art: MiniNews },
  { n: '03', t: '지도·플레이스 노출', d: '네이버는 함께, 구글은 대신', art: MiniMap },
];

/* ── 기능 그리드 글리프 (§8.7-I — stroke 1.5, 직각) ── */
const GLYPH = {
  reply: <path d="M3 4h14v9H9l-4 4v-4H3z" />,
  video: <><rect x="3" y="4" width="14" height="12" /><path d="M9 8l4 2-4 2z" /></>,
  voice: <><rect x="8" y="3" width="4" height="8" /><path d="M5 9v1a5 5 0 0 0 10 0V9M10 15v3M7 18h6" /></>,
  thumb: <><rect x="3" y="4" width="14" height="12" /><circle cx="8" cy="8" r="1.4" /><path d="M3 14l5-4 4 3 2-2 3 3" /></>,
  cal: <><rect x="3" y="4" width="14" height="13" /><path d="M3 8h14M7 3v3M13 3v3" /><circle cx="10" cy="12.5" r="1.2" fill="currentColor" stroke="none" /></>,
  multi: <><rect x="6" y="3" width="11" height="11" /><path d="M3 7v10h10" /></>,
} as const;

const extras = [
  { t: '리뷰 답글 초안', d: '배민·쿠팡 리뷰에 맞춘 답글을 먼저 써 둡니다', g: GLYPH.reply },
  { t: '영상·쇼츠 제작', d: '사진으로 릴스·쇼츠까지 자동으로', g: GLYPH.video },
  { t: '말로 수정', d: '“더 친근하게” 한마디면 글이 바뀝니다', g: GLYPH.voice },
  { t: '썸네일 자동 생성', d: '칸 편집까지, 손이 덜 갑니다', g: GLYPH.thumb },
  { t: '발행 스케줄', d: '채널당 하루 1건, 스팸처럼 안 보이게', g: GLYPH.cal },
  { t: '여러 가게 한 계정', d: '가게가 여럿이어도 한 곳에서', g: GLYPH.multi },
];

export default function ContentPage() {
  return (
    <main>
      <OuterContainer>
        {/* ── S1 히어로 (다크 선언 + 큰 제품샷) ── */}
        <Section dark noBorder>
          <div className="relative px-12 pt-28 pb-0 text-center max-md:px-6 max-md:pt-16" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a2a18 0%, #0a0a0a 62%)' }}>
            {/* 필름 노이즈 — 그린-블랙 그라데이션 밴딩 완화(§8.6, HeroAurora와 동일 fractalNoise) */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />
            <FadeUp className="relative z-10">
              <p className="text-[13px] max-md:text-[14px] font-semibold text-accent tracking-[0.08em] uppercase mb-5" style={EN}>누구나 콘텐츠</p>
              {/* h1·sub = GPT+사장님 확정(content.ts hero) 토씨 그대로 */}
              <h1 className="text-[clamp(30px,5.2vw,54px)] font-semibold text-white tracking-[-0.04em] leading-[1.14] mb-6"
                dangerouslySetInnerHTML={{ __html: '누구나<span class="comma">,</span> 검색 결과에<br /><span class="text-accent">내 스토어가</span> 바로 보이길 원합니다' }} />
              <p className="text-[clamp(15px,1.8vw,18px)] max-md:text-[16px] text-white/55 leading-[1.65] max-w-[600px] mx-auto mb-10">
                광고는 멈추면 사라지지만, 꾸준히 쌓은 글은 검색에 남아 스토어를 계속 보이게 합니다. 그 꾸준함을, 누구나 콘텐츠가 대신합니다.
              </p>
              <Link href="/start" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0a0a0a] text-[15px] font-semibold tracking-[-0.02em] hover:bg-[#eaeaea] transition-colors mb-16">
                무료로 시작하기
                <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
              </Link>
            </FadeUp>
            {/* 큰 제품 샷 (히어로 하단으로 몰입) */}
            <FadeUp delay={0.15} className="relative z-10">
              {/* pc-home-clean = 인사말을 페이지 서사(오늘의 브런치)로 교체한 버전. cropTop 3.2 = 상단 운영자 바(48px/1600) 완전 제거 */}
              {/* max-md:mb-0 — 음수 마진이 모바일에서 다음 섹션 헤드라인과 8px 겹침(감독관 4차 C-1 실측) */}
              <ShotFrame src="/shots/content/pc-home-clean.png" alt="누구나 콘텐츠 대시보드 홈 화면" cropTop={3.2} className="max-w-[980px] mx-auto -mb-16 max-md:mb-0" priority />
            </FadeUp>
          </div>
        </Section>

        {/* ── S2 시장 현실 ── */}
        <Section crossMarks>
          <div className="py-24 px-12 max-w-[1080px] mx-auto max-md:py-14 max-md:px-6">
            <FadeUp>
              {/* 헤드라인 = GPT+사장님 확정(2026-07-11) — 구 문구는 금지어 "보장" 포함이라 폐기 */}
              <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-5 max-w-[640px]">
                맡긴다고 검색 결과에<br /><span className="text-accent">바로 보이는 것은 아닙니다</span>
              </h2>
              <p className="text-[16px] max-md:font-medium text-text-body leading-[1.65] max-w-[560px] mb-12">
                대행에 매달 비용을 내도, 검색에 우리 가게가 보인다는 보장은 없습니다. 광고는 멈추면 사라지고, 남는 것도 없습니다.
              </p>
            </FadeUp>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6">
              {[['월 30만~100만+', '대행에 매달 나가는 비용'], ['계약에 묶임', '멈추면 노출도 함께 사라짐'], ['보장 없음', '내도 검색에 보인다는 확답은 없음']].map(([n, d]) => (
                <FadeUp key={d}>
                  <p className="text-[clamp(24px,3vw,32px)] font-bold text-text-primary tracking-[-0.02em] mb-2">{n}</p>
                  <p className="text-[14px] max-md:font-medium text-text-weak leading-[1.65]">{d}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* ── S3 정공법 브리지 ── */}
        <Section alt>
          <div className="py-24 px-12 max-w-[1080px] mx-auto max-md:py-14 max-md:px-6">
            <FadeUp>
              {/* 헤드라인 = GPT+사장님 확정(2026-07-11) */}
              <h2 className="text-[clamp(26px,4vw,38px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-3">검색은 <span className="text-accent">꾸준함</span>이 만듭니다</h2>
              <p className="text-[16px] max-md:font-medium text-text-body mb-12 max-md:mb-8">뿌리는 대행 대신, 검색에 보이게 하는 정공법.</p>
            </FadeUp>
            <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
              {bridge.map((c, i) => (
                <FadeUp key={c.n} delay={i * 0.08}>
                  {/* §8.7-I: 카드의 주인공 = 미니 라인아트(상단), 텍스트는 하단 보조 */}
                  <div className="h-full border border-border-default bg-white p-7 max-md:p-6">
                    <c.art />
                    <span className="inline-flex w-8 h-8 items-center justify-center text-[13px] font-bold text-white bg-[#171717] mb-5" style={EN}>{c.n}</span>
                    <h3 className="text-[18px] font-bold text-text-primary mb-2">{c.t}</h3>
                    <p className="text-[14px] max-md:font-medium text-text-body leading-[1.65]">{c.d}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* ── S4 전매체 발행 — ① 확정 목업 ── */}
        <FeatureBlock num="01">
          <S9_ChannelFanout />
        </FeatureBlock>

        {/* ── S5 노출 소식 자동 반영(킬러 · 최대 비중) — ③ 확정 목업 ── */}
        <FeatureBlock num="02" alt emphasis>
          <S11_NewsEngine />
        </FeatureBlock>

        {/* ── S6 플레이스·지도 — ④ 확정 목업 ── */}
        <FeatureBlock num="03">
          <S12_MapExposure />
        </FeatureBlock>

        {/* ── S7 노출 증명(키워드 선정 → 순위) — ② + ⑤ 확정 목업 ── */}
        <FeatureBlock num="04" alt>
          <S14_Generate />
          <div className="my-14 border-t border-border-default max-md:my-10" />
          <S10_RankTrack />
        </FeatureBlock>

        {/* ── S8 시작 부담 제로 — ⑥ 확정 목업 ── */}
        <FeatureBlock num="05">
          <S13_Onboarding />
        </FeatureBlock>

        {/* ── S9 기능 그리드 ── */}
        <Section alt>
          <div className="py-24 px-12 max-w-[1080px] mx-auto max-md:py-14 max-md:px-6">
            <FadeUp>
              {/* 헤드라인 = GPT+사장님 확정(2026-07-11, 대안 채택 — "이 밖에도" 위치 맥락 유지) */}
              <h2 className="text-[clamp(26px,4vw,38px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-12 max-md:mb-8">이 밖에도 필요한 기능을 담았습니다</h2>
            </FadeUp>
            <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-sm:gap-4">
              {extras.map((e, i) => (
                <FadeUp key={e.t} delay={(i % 3) * 0.08}>
                  <div className="h-full border border-border-default bg-white p-6">
                    {/* §8.7-I 글리프 — stroke 1.5, 직각 */}
                    <svg viewBox="0 0 20 20" className="w-[20px] h-[20px] mb-4 text-text-weak" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" aria-hidden>
                      {e.g}
                    </svg>
                    <h3 className="text-[15px] font-bold text-text-primary mb-1.5">{e.t}</h3>
                    <p className="text-[13px] max-md:text-[14px] max-md:font-medium text-text-body leading-[1.65]">{e.d}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 가격 ── */}
        <Section crossMarks>
          <div className="py-24 px-12 max-w-[900px] mx-auto max-md:py-14 max-md:px-6">
            <FadeUp>
              <h2 className="text-[clamp(26px,4vw,38px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] text-center mb-3">요금</h2>
              <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-text-body text-center mb-12">첫 달 무료. 카드 없이 시작합니다.</p>
            </FadeUp>
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {[{ name: '베이직', price: '99,000', unit: '원 / 월', note: '영상 없이, 전 기능 그대로', accent: false }, { name: '프리미엄', price: '390,000~', unit: '원 / 월', note: '영상·쇼츠 제작 포함', accent: true }].map((p) => (
                <FadeUp key={p.name}>
                  <div className={`h-full border p-8 ${p.accent ? 'border-accent bg-accent-bg' : 'border-border-default bg-white'}`}>
                    <p className="text-[13px] max-md:text-[14px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-4" style={EN}>{p.name}</p>
                    <p className="mb-1"><span className="text-[clamp(30px,4vw,44px)] font-bold text-text-primary" style={EN}>{p.price}</span><span className="text-[14px] max-md:font-medium text-text-weak ml-1">{p.unit}</span></p>
                    <p className="text-[14px] max-md:font-medium text-text-body mt-4">{p.note}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* ── S10 진화 선언 — 카피 = 홈(lib/content/home.ts promise) 정본과 동일 문장 통일(M-3) ── */}
        <Section noBorder>
          <StoryStep dark time="∞" step={promise.step} headline={promise.title} subtitle={promise.sub}>
            <div className="flex gap-4 max-w-[520px] max-md:flex-col">
              <div className="flex-1 border border-white/15 bg-white/[0.03] px-6 py-7"><p className="text-[13px] max-md:text-[14px] text-white/50 mb-2">기능</p><p className="text-[26px] font-bold text-white" style={EN}>계속 &uarr;</p></div>
              <div className="flex-1 border border-accent/40 bg-accent/[0.07] px-6 py-7"><p className="text-[13px] max-md:text-[14px] text-white/50 mb-2">요금</p><p className="text-[26px] font-bold text-accent" style={EN}>그대로 &rarr;</p></div>
            </div>
          </StoryStep>
        </Section>

        {/* ── S11 마감 CTA ── */}
        <Section alt noBorder>
          <div className="py-20 px-12 text-center max-md:py-16 max-md:px-6" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}>
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">한 달, 카드 없이 먼저 써 보세요</h2>
              <p className="text-[15px] max-md:text-[16px] text-white/50 mb-10">약정도 카드도 없습니다. 가게 이름만 입력하면 세팅해 드립니다.</p>
              <div className="flex justify-center gap-3 max-sm:flex-col max-sm:items-center">
                <Link href="/start" className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#eaeaea] transition-all">무료로 시작하기</Link>
                {/* 인라인 색 고정 — text-white 클래스가 이 a에서만 미적용되는 렌더 이슈(감독관 3차 실측 #333) 방어 */}
                <Link href="/ads" className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-transparent hover:bg-white/[0.06] transition-all max-sm:w-full max-sm:max-w-[320px]" style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)' }}>광고까지 직접 운영하려면 →</Link>
              </div>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
