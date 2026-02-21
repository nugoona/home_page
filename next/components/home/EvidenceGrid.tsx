import FadeUp from '@/components/motion/FadeUp';
import SectionHeader from '@/components/ui/SectionHeader';
import { evidence } from '@/lib/content/home';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ════════════════════════════════════════════════════════════
   Dashboard Mockup — Full KPI + Chart + Platforms
   ════════════════════════════════════════════════════════════ */
function DashboardMockup() {
  const kpis = [
    { label: 'Revenue', value: '₩12,847,200', change: '+18.3%', up: true },
    { label: 'ROAS', value: '785%', change: '+124%', up: true },
    { label: 'Visitors', value: '2,341', change: '+7.2%', up: true },
    { label: 'CVR', value: '3.8%', change: '-0.4%', up: false },
  ];
  const bars = [52, 38, 68, 85, 48, 76, 64];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const platforms = [
    { name: 'Cafe24', color: '#00a651' },
    { name: 'Meta', color: '#0081FB' },
    { name: 'Google', color: '#4285F4' },
    { name: 'GA4', color: '#F9AB00' },
  ];

  return (
    <div className="border border-border-default bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] bg-[#22c55e] rounded-dot" />
          <span className="text-[11px] font-semibold text-text-weak tracking-[0.08em]" style={EN}>
            NGN DASHBOARD
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#ccc]" style={EN}>2026.02.14 14:32</span>
          <span className="text-[10px] text-[#22c55e] font-medium" style={EN}>Live</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-[1px] bg-border-light border-b border-border-light">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-4 bg-white max-sm:p-3">
            <p className="text-[10px] text-text-weak mb-1" style={EN}>{kpi.label}</p>
            <p className="text-[17px] font-semibold text-text-primary tracking-[-0.02em] max-sm:text-[14px]" style={EN}>
              {kpi.value}
            </p>
            <p className={`text-[11px] mt-0.5 font-medium ${kpi.up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`} style={EN}>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 max-sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-text-weak tracking-[0.06em]" style={EN}>WEEKLY REVENUE</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent" />
              <span className="text-[9px] text-text-weak" style={EN}>This week</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent/15" />
              <span className="text-[9px] text-text-weak" style={EN}>Last week</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-2 h-[80px]">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex gap-[2px]" style={{ height: `${h}%` }}>
                <div className="flex-1 bg-accent/12" />
                <div
                  className="flex-1"
                  style={{
                    background: i === 3 ? '#0070f3' : 'linear-gradient(180deg, rgba(0,112,243,0.55) 0%, rgba(0,112,243,0.18) 100%)',
                  }}
                />
              </div>
              <span className="text-[8px] text-[#ccc]" style={EN}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected platforms */}
      <div className="flex items-center gap-5 px-5 py-3 border-t border-border-light bg-[#fafafa]">
        <span className="text-[10px] text-text-weak" style={EN}>Connected</span>
        {platforms.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-dot" style={{ backgroundColor: p.color }} />
            <span className="text-[10px] text-text-body font-medium" style={EN}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   AdCanvas Flow Mockup — URL → AI → Ad (3-step vertical)
   ════════════════════════════════════════════════════════════ */
function AdCanvasFlowMockup() {
  return (
    <div className="flex flex-col">
      {/* Step 1: URL Input */}
      <div className="border border-border-default bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-[#fafafa] border border-border-default flex items-center justify-center">
            <span className="text-[8px] font-semibold text-text-weak" style={EN}>01</span>
          </div>
          <span className="text-[10px] font-semibold text-text-weak tracking-[0.06em]" style={EN}>URL INPUT</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fafafa] border border-border-default">
          <svg className="w-4 h-4 text-[#bbb] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 3H4a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V9" strokeLinecap="round" />
            <path d="M10 3h3v3M13 3L8 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] text-[#aaa] truncate" style={EN}>myshop.cafe24.com/product/12345</span>
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-[1px] h-5 bg-border-default relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-dot" />
        </div>
      </div>

      {/* Step 2: AI Processing */}
      <div className="border border-accent-border p-4" style={{ background: 'rgba(0,112,243,0.02)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-accent/10 border border-accent-border flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-accent" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9 1L3 9h4v6l6-8H9V1z" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold text-accent tracking-[0.06em]" style={EN}>AI PROCESSING</span>
        </div>
        <div className="flex flex-col gap-2">
          {['이미지 자동 추출', '광고 문구 생성', '타겟 오디언스 설정'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#22c55e] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] text-text-body">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-[1px] h-5 bg-border-default relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-dot" />
        </div>
      </div>

      {/* Step 3: Ad Output */}
      <div className="border border-border-default bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-[#fafafa] border border-border-default flex items-center justify-center">
            <span className="text-[8px] font-semibold text-text-weak" style={EN}>03</span>
          </div>
          <span className="text-[10px] font-semibold text-text-weak tracking-[0.06em]" style={EN}>AD OUTPUT</span>
        </div>

        {/* Mini Instagram Ad */}
        <div className="border border-border-default overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border-light">
            <div className="w-5 h-5 rounded-dot bg-gradient-to-br from-[#833AB4] to-[#FD1D1D]" />
            <div>
              <p className="text-[9px] font-semibold text-text-primary" style={EN}>myshop_official</p>
              <p className="text-[7px] text-[#999]" style={EN}>Sponsored</p>
            </div>
          </div>
          <div
            className="aspect-[4/3]"
            style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #fce7f3 100%)' }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
              <span className="text-[20px] font-semibold text-white/30" style={EN}>AD</span>
              <span className="text-[8px] text-white/20" style={EN}>AI Generated Creative</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 border-t border-border-light">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.5">
              <path d="M8 14s-5.5-4.5-5.5-8A3.5 3.5 0 018 3.5 3.5 3.5 0 0113.5 6c0 3.5-5.5 8-5.5 8z" strokeLinejoin="round" />
            </svg>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.5">
              <path d="M14 2L7 9M14 2l-5 12-2-5-5-2 12-5z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div className="bg-accent py-2 text-center">
            <span className="text-[9px] font-semibold text-white" style={EN}>Shop Now</span>
          </div>
        </div>

        {/* Platform buttons */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 py-2 bg-[#fafafa] border border-border-default text-center flex items-center justify-center gap-1.5">
            <div className="w-3 h-3 rounded-dot bg-gradient-to-br from-[#833AB4] to-[#FD1D1D]" />
            <span className="text-[9px] text-text-body font-medium" style={EN}>Instagram</span>
          </div>
          <div className="flex-1 py-2 bg-[#fafafa] border border-border-default text-center flex items-center justify-center gap-1.5">
            <div className="w-3 h-3 rounded-dot bg-[#4285F4]" />
            <span className="text-[9px] text-text-body font-medium" style={EN}>Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Trend Mockup — Ranking Table + Category Analysis
   ════════════════════════════════════════════════════════════ */
function TrendMockup() {
  const rankings = [
    { rank: 1, name: '린넨 블라우스', badge: '신규', cls: 'text-accent bg-accent-bg' },
    { rank: 2, name: '와이드 데님 팬츠', badge: '↑3', cls: 'text-[#22c55e] bg-[rgba(34,197,94,0.08)]' },
    { rank: 3, name: '크롭 가디건', badge: null, cls: '' },
    { rank: 4, name: '미니 플리츠 스커트', badge: '↑7', cls: 'text-[#22c55e] bg-[rgba(34,197,94,0.08)]' },
    { rank: 5, name: '오버사이즈 셔츠', badge: null, cls: '' },
    { rank: 6, name: '코튼 반팔 티셔츠', badge: '↑12', cls: 'text-[#22c55e] bg-[rgba(34,197,94,0.08)]' },
    { rank: 7, name: '슬림 슬랙스', badge: null, cls: '' },
  ];

  const categories = [
    { name: '상의', pct: 42, color: '#0070f3' },
    { name: '하의', pct: 28, color: 'rgba(0,112,243,0.55)' },
    { name: '아우터', pct: 18, color: 'rgba(0,112,243,0.3)' },
    { name: '원피스', pct: 12, color: 'rgba(0,112,243,0.15)' },
  ];

  return (
    <div className="grid grid-cols-[3fr_2fr] gap-4 max-sm:grid-cols-1">
      {/* Left: Ranking */}
      <div className="border border-border-default bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-[#fafafa]">
          <span className="text-[10px] font-semibold text-text-weak tracking-[0.06em]" style={EN}>
            29CM WEEKLY BEST 100
          </span>
          <span className="text-[10px] text-[#ccc]" style={EN}>2026.02 W2</span>
        </div>
        <div className="px-2">
          {rankings.map((item) => (
            <div key={item.rank} className="flex items-center gap-2.5 py-2.5 px-2 border-b border-border-light last:border-b-0">
              <span
                className={`text-[12px] font-semibold w-5 text-center ${item.rank <= 3 ? 'text-text-primary' : 'text-text-disabled'}`}
                style={EN}
              >
                {item.rank}
              </span>
              <div
                className="w-7 h-7 shrink-0 border border-border-light"
                style={{ background: `linear-gradient(135deg, hsl(${item.rank * 40}, 40%, 92%), hsl(${item.rank * 40 + 30}, 45%, 88%))` }}
              />
              <span className="text-[12px] text-text-secondary flex-1 truncate">{item.name}</span>
              {item.badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 ${item.cls}`} style={EN}>{item.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Category + Hot Trend */}
      <div className="flex flex-col gap-4">
        <div className="border border-border-default bg-white overflow-hidden flex-1">
          <div className="px-4 py-3 border-b border-border-light bg-[#fafafa]">
            <span className="text-[10px] font-semibold text-text-weak tracking-[0.06em]" style={EN}>CATEGORY SHARE</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-text-body">{cat.name}</span>
                  <span className="text-[11px] font-semibold text-text-primary" style={EN}>{cat.pct}%</span>
                </div>
                <div className="h-[6px] bg-[#f0f0f0]">
                  <div className="h-full" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-accent-border p-4" style={{ background: 'rgba(0,112,243,0.02)' }}>
          <p className="text-[10px] font-semibold text-accent tracking-[0.06em] mb-2" style={EN}>HOT TREND</p>
          <p className="text-[14px] text-text-primary font-semibold">린넨 블라우스</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[13px] text-accent font-semibold" style={EN}>+340%</span>
            <span className="text-[11px] text-text-weak">검색량 급상승</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Hero Text — before/after 키워드 강조 문장
   ════════════════════════════════════════════════════════════ */
function HeroText({ card }: { card: (typeof evidence.cards)[number] }) {
  const { hero } = card;
  return (
    <div className="px-6 pt-6 pb-4">
      <p
        className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-3"
        style={EN}
      >
        {card.label}
      </p>
      <p className="text-[20px] leading-[1.5] tracking-[-0.02em] text-text-primary">
        {hero.pre}
        <span className="text-text-disabled line-through">{hero.before}</span>
        {hero.mid}
        <span className="text-accent font-semibold">{hero.after}</span>
        {hero.post}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EvidenceGrid — Asymmetric Bento Layout
   ════════════════════════════════════════════════════════════ */
export default function EvidenceGrid() {
  const insight = evidence.cards[1];
  const speed = evidence.cards[0];
  const trend = evidence.cards[2];

  return (
    <div className="py-[100px] px-12 max-md:py-16 max-md:px-6">
      <FadeUp>
        <SectionHeader title={evidence.title} />
      </FadeUp>

      <div className="max-w-[1080px] mx-auto">
        <FadeUp delay={0.1}>
          <div
            className="grid grid-cols-3 gap-4 max-md:grid-cols-1"
            style={{ gridTemplateRows: 'auto auto' }}
          >
            {/* ── Dashboard (Insight) — 2 cols, row 1 ── */}
            <div className="col-span-2 max-md:col-span-1 border border-border-default bg-white overflow-hidden">
              <HeroText card={insight} />
              <div className="px-5 pb-5">
                <DashboardMockup />
              </div>
              <div className="px-6 py-5 border-t border-border-light">
                <p className="text-[17px] leading-[1.65]">
                  <strong className="font-semibold text-text-primary">{insight.title}.</strong>
                  {' '}
                  <span className="text-text-body">{insight.desc}</span>
                </p>
              </div>
            </div>

            {/* ── AdCanvas (Speed) — 1 col, 2 rows ── */}
            <div className="col-span-1 row-span-2 max-md:row-span-1 border border-border-default bg-white overflow-hidden">
              <HeroText card={speed} />
              <div className="px-5 pb-5">
                <AdCanvasFlowMockup />
              </div>
              <div className="px-6 py-5 border-t border-border-light">
                <p className="text-[17px] leading-[1.65]">
                  <strong className="font-semibold text-text-primary">{speed.title}.</strong>
                  {' '}
                  <span className="text-text-body">{speed.desc}</span>
                </p>
              </div>
            </div>

            {/* ── Trend — 2 cols, row 2 ── */}
            <div className="col-span-2 max-md:col-span-1 border border-border-default bg-white overflow-hidden">
              <HeroText card={trend} />
              <div className="px-5 pb-5">
                <TrendMockup />
              </div>
              <div className="px-6 py-5 border-t border-border-light">
                <p className="text-[17px] leading-[1.65]">
                  <strong className="font-semibold text-text-primary">{trend.title}.</strong>
                  {' '}
                  <span className="text-text-body">{trend.desc}</span>
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
