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

const EN = { fontFamily: 'var(--font-en)' } as const;

/** 소구 섹션 공통 래퍼 — 번호칩 + 디바이더(ShowcaseRow와 동일 패턴) 위에 확정 목업 컴포넌트를 얹는다. */
function FeatureBlock({
  num, alt, emphasis, children,
}: { num: string; alt?: boolean; emphasis?: boolean; children: React.ReactNode }) {
  return (
    <Section alt={alt}>
      <div className={`max-w-[1080px] mx-auto px-12 max-md:px-6 ${emphasis ? 'py-28 max-md:py-16' : 'py-20 max-md:py-14'}`}>
        <FadeUp className="flex items-center gap-3 mb-10">
          <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717] shrink-0" style={EN}>{num}</span>
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

/* ── 3기둥 미니 라인아트 (§8.7-I: 텍스트-온리 카드 금지 — S9/S11/S12 문법의 미니어처, 직각선·끝 accent 점) ── */
function MiniFanout() {
  return (
    <svg viewBox="0 0 220 96" className="w-full h-[88px] mb-6" aria-hidden>
      <rect x="14" y="30" width="36" height="36" fill="#e9ecef" />
      <path d="M20 58l9-8 7 5 6-6 12 9" fill="none" stroke="#b7bec6" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx="27" cy="41" r="2.5" fill="none" stroke="#b7bec6" strokeWidth="1.5" />
      <path d="M50 48H92" fill="none" stroke="#c9c9c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M92 48V18H150" fill="none" stroke="#c9c9c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M92 48H150" fill="none" stroke="#c9c9c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M92 48V78H150" fill="none" stroke="#c9c9c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx="92" cy="48" r="3" fill="#0070f3" />
      <circle cx="156" cy="18" r="4" fill="#03c75a" />
      <rect x="168" y="14" width="38" height="8" fill="#f0f0f0" />
      <circle cx="156" cy="48" r="4" fill="#e1306c" />
      <rect x="168" y="44" width="30" height="8" fill="#f0f0f0" />
      <circle cx="156" cy="78" r="4" fill="#1877f2" />
      <rect x="168" y="74" width="34" height="8" fill="#f0f0f0" />
    </svg>
  );
}
function MiniNews() {
  return (
    <svg viewBox="0 0 220 96" className="w-full h-[88px] mb-6" aria-hidden>
      <circle cx="20" cy="18" r="4" fill="#03c75a" />
      <rect x="32" y="13" width="92" height="10" fill="#171717" />
      <rect x="132" y="15" width="44" height="6" fill="#e5e5e5" />
      <path d="M20 26V56H44" fill="none" stroke="rgba(0,112,243,0.5)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx="47" cy="56" r="3" fill="#0070f3" />
      <rect x="58" y="40" width="148" height="42" fill="none" stroke="#e5e5e5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <text x="68" y="62" fontSize="20" fill="#171717" fontFamily="var(--font-quote), serif">&ldquo;</text>
      <rect x="84" y="52" width="100" height="7" fill="#f0f0f0" />
      <rect x="84" y="64" width="72" height="7" fill="#f0f0f0" />
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
      <circle cx="152" cy="76" r="4" fill="#03c75a" />
      <circle cx="168" cy="76" r="4" fill="#4285f4" />
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
            <FadeUp>
              <p className="text-[13px] font-semibold text-accent tracking-[0.12em] uppercase mb-5" style={EN}>누구나 콘텐츠</p>
              {/* h1·sub = GPT+사장님 확정(content.ts hero) 토씨 그대로 */}
              <h1 className="text-[clamp(30px,5.2vw,54px)] font-semibold text-white tracking-[-0.04em] leading-[1.14] mb-6"
                dangerouslySetInnerHTML={{ __html: '누구나<span class="comma">,</span> 검색 결과에<br /><span class="text-accent">내 스토어가</span> 바로 보이길 원합니다' }} />
              <p className="text-[clamp(15px,1.8vw,18px)] text-white/55 leading-[1.65] max-w-[600px] mx-auto mb-10">
                광고는 멈추면 사라지지만, 꾸준히 쌓은 글은 검색에 남아 스토어를 계속 보이게 합니다. 그 꾸준함을, 누구나 콘텐츠가 대신합니다.
              </p>
              <Link href="/start" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-white text-[#0a0a0a] text-[15px] font-semibold tracking-[-0.01em] hover:bg-[#e5e5e5] transition-colors mb-16">
                무료로 시작하기
                <svg className="w-4 h-4 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
              </Link>
            </FadeUp>
            {/* 큰 제품 샷 (히어로 하단으로 몰입) */}
            <FadeUp delay={0.15}>
              {/* pc-home-clean = 인사말을 페이지 서사(오늘의 브런치)로 교체한 버전. cropTop 3.2 = 상단 운영자 바(48px/1600) 완전 제거 */}
              <ShotFrame src="/shots/content/pc-home-clean.png" alt="누구나 콘텐츠 대시보드 홈 화면" cropTop={3.2} className="max-w-[980px] mx-auto -mb-16" priority />
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
              <p className="text-[16px] text-text-body leading-[1.7] max-w-[560px] mb-12">
                대행에 매달 비용을 내도, 검색에 우리 가게가 보인다는 보장은 없습니다. 광고는 멈추면 사라지고, 남는 것도 없습니다.
              </p>
            </FadeUp>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6">
              {[['월 30만~100만+', '대행에 매달 나가는 비용'], ['계약에 묶임', '멈추면 노출도 함께 사라짐'], ['보장 없음', '내도 검색에 보인다는 확답은 없음']].map(([n, d]) => (
                <FadeUp key={d}>
                  <p className="text-[clamp(24px,3vw,32px)] font-bold text-text-primary tracking-[-0.02em] mb-2">{n}</p>
                  <p className="text-[14px] text-text-weak leading-[1.6]">{d}</p>
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
              <p className="text-[16px] text-text-body mb-12 max-md:mb-8">뿌리는 대행 대신, 검색에 보이게 하는 정공법.</p>
            </FadeUp>
            <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
              {bridge.map((c, i) => (
                <FadeUp key={c.n} delay={i * 0.08}>
                  {/* §8.7-I: 카드의 주인공 = 미니 라인아트(상단), 텍스트는 하단 보조 */}
                  <div className="h-full border border-border-default bg-white p-7 max-md:p-6">
                    <c.art />
                    <span className="inline-flex w-8 h-8 items-center justify-center text-[12px] font-bold text-white bg-[#171717] mb-5" style={EN}>{c.n}</span>
                    <h3 className="text-[18px] font-bold text-text-primary mb-2">{c.t}</h3>
                    <p className="text-[14px] text-text-body leading-[1.6]">{c.d}</p>
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
                    <p className="text-[13px] text-text-body leading-[1.6]">{e.d}</p>
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
              <p className="text-[15px] text-text-body text-center mb-12">첫 달 무료. 카드 없이 시작합니다.</p>
            </FadeUp>
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {[{ name: '베이직', price: '99,000', unit: '원 / 월', note: '영상 없이, 전 기능 그대로', accent: false }, { name: '프리미엄', price: '390,000~', unit: '원 / 월', note: '영상·쇼츠 제작 포함', accent: true }].map((p) => (
                <FadeUp key={p.name}>
                  <div className={`h-full border p-8 ${p.accent ? 'border-accent bg-accent-bg' : 'border-border-default bg-white'}`}>
                    <p className="text-[13px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-4" style={EN}>{p.name}</p>
                    <p className="mb-1"><span className="text-[clamp(30px,4vw,44px)] font-bold text-text-primary" style={EN}>{p.price}</span><span className="text-[14px] text-text-weak ml-1">{p.unit}</span></p>
                    <p className="text-[14px] text-text-body mt-4">{p.note}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* ── S10 진화 선언 ── */}
        <Section noBorder>
          <StoryStep dark time="∞" step="OUR PROMISE" headline={'앱은 계속 자랍니다<span class="comma">,</span><br />요금은 <span class="text-accent">그대로</span>입니다'} subtitle="기능이 늘어도 쓰던 요금은 오르지 않습니다. 한번 시작하면 계속 나아지는 도구를 씁니다.">
            <div className="flex gap-4 max-w-[520px] max-md:flex-col">
              <div className="flex-1 border border-white/15 bg-white/[0.03] px-6 py-7"><p className="text-[13px] text-white/50 mb-2">기능</p><p className="text-[26px] font-bold text-white" style={EN}>계속 &uarr;</p></div>
              <div className="flex-1 border border-accent/40 bg-accent/[0.07] px-6 py-7"><p className="text-[13px] text-white/50 mb-2">요금</p><p className="text-[26px] font-bold text-accent" style={EN}>그대로 &rarr;</p></div>
            </div>
          </StoryStep>
        </Section>

        {/* ── S11 마감 CTA ── */}
        <Section alt noBorder>
          <div className="py-20 px-12 text-center max-md:py-16 max-md:px-6" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}>
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">한 달, 카드 없이 먼저 써 보세요</h2>
              <p className="text-[15px] text-white/50 mb-10">약정도 카드도 없습니다. 가게 이름만 입력하면 세팅해 드립니다.</p>
              <div className="flex justify-center gap-3 max-sm:flex-col max-sm:items-center">
                <Link href="/start" className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all">무료로 시작하기</Link>
                <Link href="/ads" className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-transparent text-white/75 border border-white/20 hover:bg-white/[0.06] transition-all max-sm:w-full max-sm:max-w-[320px]">광고까지 직접 운영하려면 →</Link>
              </div>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
