'use client';

/**
 * Clone01 — Vercel "Provider degraded? → primary/fallback" 플로우 다이어그램 1:1 복제
 * 원본: C:\Users\oscar\Downloads\vercel_image\image-1783929616832.png (1948×705)
 * - 좌표계 = 원본 px 그대로 (absolute + px)
 * - 실측: 배경 #FAFAFA, 도트 그리드 30px 간격(#EAEAEA, 중심 x≡4.5 / y≡27 mod 30)
 * - 커넥터: 직선(#171717, 양끝 fade) / 대시 S곡선(#C9C9C9) / 실선 S곡선(#171717→끝 fade)
 *   베지어는 실측 검증됨: M1157,387 C1272,387 1283,206 1398,206 (x=1180에서 y=383.5 실측 일치)
 */

const SANS = 'var(--font-en)';
const MONO = "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace";

/* ── 스켈레톤 App 카드 (좌측, 하단 fade-out) ── */
function AppCard() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 260,
        top: 162,
        width: 401,
        height: 443,
        background: '#FFFFFF',
        border: '1px solid #ECECEC',
        borderRadius: 16,
        WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
      }}
    >
      {/* 윈도 점 3개 */}
      {[25, 50, 73.5].map((x) => (
        <div
          key={x}
          style={{
            position: 'absolute',
            left: x,
            top: 25.5,
            width: 15,
            height: 15,
            borderRadius: '50%',
            background: '#E4E4E4',
          }}
        />
      ))}
      {/* App 워드마크 (고스트) */}
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 81,
          fontFamily: SANS,
          fontSize: 48,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#E9E9E9',
        }}
      >
        App
      </div>
      {/* 스켈레톤 바/블록 */}
      <div style={{ position: 'absolute', left: 25, top: 160, width: 287, height: 19, borderRadius: 9.5, background: '#EBEBEB' }} />
      <div style={{ position: 'absolute', left: 25, top: 193, width: 224, height: 19, borderRadius: 9.5, background: '#EBEBEB' }} />
      <div
        style={{
          position: 'absolute',
          left: 25,
          top: 235,
          width: 351,
          height: 96,
          borderRadius: 12,
          background: 'linear-gradient(to bottom, #EBEBEB, #F1F1F1)',
        }}
      />
      <div style={{ position: 'absolute', left: 25, top: 355, width: 253, height: 19, borderRadius: 9.5, background: '#EBEBEB' }} />
      <div style={{ position: 'absolute', left: 25, top: 388, width: 188, height: 18, borderRadius: 9, background: '#EBEBEB' }} />
    </div>
  );
}

/* ── Anthropic 로고마크 근사 (A without crossbar + backslash) ── */
function AnthropicMark() {
  return (
    <svg width={38} height={33} viewBox="0 0 40 34" fill="#141413" aria-hidden>
      <path d="M13.6 0 L19.6 0 L6.4 34 L0 34 Z" />
      <path d="M13.6 0 L19.6 0 L32.8 34 L26.4 34 Z" />
      <path d="M26.6 0 L32.8 0 L40 18.6 L36.9 26.6 Z" />
    </svg>
  );
}

/* ── aws 로고 근사 (워드 + 스마일) ── */
function AwsMark() {
  return (
    <div style={{ width: 46, textAlign: 'center' }}>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 24,
          lineHeight: '22px',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: '#252F3E',
        }}
      >
        aws
      </div>
      <svg width={44} height={13} viewBox="0 0 44 13" fill="none" aria-hidden style={{ display: 'block', margin: '1px auto 0' }}>
        <path d="M2 2.5 C 11 10.5, 29 10.5, 39 4.5" stroke="#FF9900" strokeWidth={3} strokeLinecap="round" />
        <path d="M36.5 1.5 L43 3.2 L38.5 8.2 Z" fill="#FF9900" />
      </svg>
    </div>
  );
}

/* ── 프로바이더 카드 ── */
function ProviderCard({
  left,
  top,
  logo,
  title,
  subtitle,
  badge,
  active,
}: {
  left: number;
  top: number;
  logo: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 459,
        height: active ? 95 : 96,
        background: '#FFFFFF',
        border: active ? '1.5px solid #171717' : '1px solid #EDEDED',
        borderRadius: 16,
        boxShadow: active ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {/* 로고 슬롯 */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 0,
          height: '100%',
          width: 46,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {logo}
      </div>
      {/* 타이틀 */}
      <div
        style={{
          position: 'absolute',
          left: 81,
          top: 25,
          fontFamily: SANS,
          fontSize: 20,
          lineHeight: '22px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#171717',
        }}
      >
        {title}
      </div>
      {/* 서브타이틀 (모노) */}
      <div
        style={{
          position: 'absolute',
          left: 81,
          top: 50,
          fontFamily: MONO,
          fontSize: 18,
          lineHeight: '24px',
          fontWeight: 400,
          color: '#737373',
        }}
      >
        {subtitle}
      </div>
      {/* 상태 배지 */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            left: 319,
            top: 30,
            width: 115,
            height: 35,
            borderRadius: 17.5,
            background: '#F2F2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SANS,
            fontSize: 18,
            fontWeight: 400,
            color: '#666666',
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

export default function Clone01() {
  return (
    <div
      style={{
        position: 'relative',
        width: 1948,
        height: 705,
        overflow: 'hidden',
        background: '#FAFAFA',
        backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
        backgroundSize: '30px 30px',
        backgroundPosition: '19.5px 12px',
      }}
    >
      {/* ── 커넥터 레이어 (카드/필 아래) ── */}
      <svg
        width={1948}
        height={705}
        viewBox="0 0 1948 705"
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden
      >
        <defs>
          {/* 직선: 양끝 opacity 0 fade */}
          <linearGradient id="vc01-line" gradientUnits="userSpaceOnUse" x1={661} y1={387} x2={888} y2={387}>
            <stop offset="0" stopColor="#171717" stopOpacity={0} />
            <stop offset="0.15" stopColor="#171717" stopOpacity={1} />
            <stop offset="0.85" stopColor="#171717" stopOpacity={1} />
            <stop offset="1" stopColor="#171717" stopOpacity={0} />
          </linearGradient>
          {/* fallback 실선 곡선: 카드에 닿기 전 옅어짐 */}
          <linearGradient id="vc01-fallback" gradientUnits="userSpaceOnUse" x1={1157} y1={388} x2={1398} y2={566}>
            <stop offset="0" stopColor="#171717" stopOpacity={1} />
            <stop offset="0.7" stopColor="#171717" stopOpacity={1} />
            <stop offset="1" stopColor="#171717" stopOpacity={0.12} />
          </linearGradient>
          {/* primary 대시 곡선: 시작만 살짝 fade-in */}
          <linearGradient id="vc01-primary" gradientUnits="userSpaceOnUse" x1={1157} y1={387} x2={1398} y2={206}>
            <stop offset="0" stopColor="#C9C9C9" stopOpacity={0.4} />
            <stop offset="0.12" stopColor="#C9C9C9" stopOpacity={1} />
            <stop offset="1" stopColor="#C9C9C9" stopOpacity={1} />
          </linearGradient>
        </defs>

        {/* App 카드 → 판정 필 (직선) */}
        <line x1={661} y1={387} x2={888} y2={387} stroke="url(#vc01-line)" strokeWidth={2} />

        {/* 판정 필 → Anthropic (대시 S곡선, 실측 베지어) */}
        <path
          d="M1157 387 C1272 387, 1283 206, 1398 206"
          stroke="url(#vc01-primary)"
          strokeWidth={1.7}
          strokeDasharray="6 6"
        />

        {/* 판정 필 → Bedrock (실선 S곡선, 끝 fade) */}
        <path d="M1157 388 C1272 388, 1283 567, 1398 566" stroke="url(#vc01-fallback)" strokeWidth={2} />
      </svg>

      {/* ── App 스켈레톤 카드 ── */}
      <AppCard />

      {/* ── 판정 필: Provider degraded? ── */}
      <div
        style={{
          position: 'absolute',
          left: 888,
          top: 359,
          width: 269,
          height: 57,
          background: '#FFFFFF',
          border: '1px solid #E3E3E3',
          borderRadius: 28.5,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontSize: 20,
          fontWeight: 400,
          color: '#171717',
        }}
      >
        Provider degraded?
      </div>

      {/* ── 엣지 라벨: primary (흰 필, 대시 곡선 위) ── */}
      <div
        style={{
          position: 'absolute',
          left: 1226,
          top: 279,
          width: 101,
          height: 36,
          background: '#FFFFFF',
          border: '1px solid #EBEBEB',
          borderRadius: 18,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontSize: 17,
          fontWeight: 400,
          color: '#525252',
        }}
      >
        primary
      </div>

      {/* ── 엣지 라벨: fallback (검정 필, 실선 곡선 위) ── */}
      <div
        style={{
          position: 'absolute',
          left: 1226,
          top: 460,
          width: 102,
          height: 33,
          background: '#171717',
          borderRadius: 16.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontSize: 17,
          fontWeight: 500,
          color: '#FFFFFF',
        }}
      >
        fallback
      </div>

      {/* ── 프로바이더 카드 ×2 ── */}
      <ProviderCard
        left={1398}
        top={157}
        logo={<AnthropicMark />}
        title="Claude Opus 4.8"
        subtitle="Anthropic"
        badge="Degraded"
      />
      <ProviderCard
        left={1398}
        top={518}
        logo={<AwsMark />}
        title="Claude Opus 4.8"
        subtitle="Amazon Bedrock"
        active
      />
    </div>
  );
}
