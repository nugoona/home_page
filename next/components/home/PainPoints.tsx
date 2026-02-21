'use client';

import FadeUp from '@/components/motion/FadeUp';
import { painPoints } from '@/lib/content/home';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const SF = 'var(--font-en)';

/* ════════════════════════════════════════════════════════════
   Card 1 — 보이지 않는 내 광고 성과
   플로우 다이어그램: 플랫폼 → Agency → You(?)
   ════════════════════════════════════════════════════════════ */
function Skeleton1() {
  return (
    <div className="absolute inset-0 bg-[#f3f4f6] flex items-center justify-center p-4">
      <svg viewBox="0 0 380 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* 곡선 연결선 */}
        <path d="M 100 55 C 138 55, 148 100, 172 108" fill="none" stroke="#0081FB" strokeWidth="2.5" />
        <path d="M 100 130 C 138 130, 148 130, 172 130" fill="none" stroke="#ea4335" strokeWidth="2.5" />
        <path d="M 100 205 C 138 205, 148 160, 172 152" fill="none" stroke="#00a651" strokeWidth="2.5" />
        <path d="M 258 130 C 282 130, 296 130, 310 130" fill="none" stroke="#999" strokeWidth="1.8" strokeDasharray="6 4" />

        {/* Meta */}
        <rect x="8" y="32" width="92" height="46" rx="12" fill="white" stroke="#0081FB" strokeWidth="1.2" />
        <circle cx="30" cy="55" r="7" fill="#0081FB" />
        <text x="45" y="61" fill="#222" fontSize="14" fontWeight="700" style={{ fontFamily: SF }}>Meta</text>

        {/* Google */}
        <rect x="8" y="107" width="92" height="46" rx="12" fill="white" stroke="#ea4335" strokeWidth="1.2" />
        <circle cx="30" cy="130" r="7" fill="#ea4335" />
        <text x="45" y="136" fill="#222" fontSize="14" fontWeight="700" style={{ fontFamily: SF }}>Google</text>

        {/* Cafe24 */}
        <rect x="8" y="182" width="92" height="46" rx="12" fill="white" stroke="#00a651" strokeWidth="1.2" />
        <circle cx="30" cy="205" r="7" fill="#00a651" />
        <text x="45" y="211" fill="#222" fontSize="14" fontWeight="700" style={{ fontFamily: SF }}>Cafe24</text>

        {/* Agency */}
        <rect x="172" y="92" width="86" height="76" rx="16" fill="#1a1a1a" />
        <text x="215" y="136" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" style={{ fontFamily: SF }}>Agency</text>

        {/* You(?) */}
        <rect x="310" y="100" width="62" height="60" rx="14" fill="white" stroke="#222" strokeWidth="1.2" />
        <text x="341" y="138" textAnchor="middle" fill="#222" fontSize="24" fontWeight="800" style={{ fontFamily: SF }}>?</text>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Card 2 — 복잡한 광고 관리자
   Meta Ads Manager 와이어프레임
   ════════════════════════════════════════════════════════════ */
function Skeleton2() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="w-full h-full bg-white overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0081FB]">
          <div className="w-4 h-4 bg-white/30 rounded-full" />
          <span className="text-[11px] font-bold text-white" style={EN}>Meta Ads Manager</span>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#ddd]">
          {['Campaigns', 'Ad Sets', 'Ads'].map((tab, i) => (
            <div
              key={i}
              className="flex-1 text-center py-2"
              style={{
                borderBottom: i === 0 ? '2px solid #0081FB' : '2px solid transparent',
                color: i === 0 ? '#0081FB' : '#aaa',
                fontSize: '10px',
                fontWeight: 700,
                ...EN,
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-[#ddd] bg-[#fafafa]">
          {['Filter ▾', 'Date ▾', 'Columns ▾'].map((f, i) => (
            <span key={i} className="text-[8px] text-[#555] px-1.5 py-0.5 border border-[#ccc] rounded bg-white font-semibold" style={EN}>{f}</span>
          ))}
          <div className="ml-auto flex gap-1">
            <div className="w-4 h-4 border border-[#ccc] rounded flex items-center justify-center">
              <span className="text-[8px] text-[#555]">⊞</span>
            </div>
            <div className="w-4 h-4 border border-[#ccc] rounded flex items-center justify-center">
              <span className="text-[8px] text-[#555]">↓</span>
            </div>
          </div>
        </div>

        {/* Content: sidebar + main */}
        <div className="flex" style={{ height: '150px' }}>
          {/* Sidebar */}
          <div className="w-[72px] border-r border-[#ddd] py-2 px-2 flex flex-col gap-1">
            {[
              { label: 'All', active: true },
              { label: 'Active', active: false },
              { label: 'Inactive', active: false },
              { label: 'Draft', active: false },
              { label: 'Error', active: false },
            ].map((item, i) => (
              <div
                key={i}
                className="text-[8px] px-1.5 py-1 rounded"
                style={{
                  backgroundColor: item.active ? '#0081FB12' : 'transparent',
                  color: item.active ? '#0081FB' : '#888',
                  fontWeight: item.active ? 700 : 600,
                  ...EN,
                }}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main table */}
          <div className="flex-1 overflow-hidden">
            {/* Column headers */}
            <div className="flex items-center px-2 py-1.5 border-b border-[#ddd] bg-[#fafafa]">
              <div className="w-3 h-3 border border-[#bbb] rounded-sm mr-2" />
              {['Name', 'Status', 'Budget', 'Results', 'CPC'].map((col, i) => (
                <span key={i} className="text-[7px] text-[#555] flex-1 truncate font-bold" style={EN}>{col}</span>
              ))}
            </div>
            {/* Table rows */}
            {[
              { status: '#22c55e' },
              { status: '#f59e0b' },
              { status: '#ef4444' },
              { status: '#22c55e' },
              { status: '#999' },
            ].map((row, i) => (
              <div key={i} className="flex items-center px-2 py-[7px] border-b border-[#eee]">
                <div className="w-3 h-3 border border-[#ccc] rounded-sm mr-2" />
                <div className="flex-1 h-[3px] bg-[#ddd] rounded-full mr-2" style={{ maxWidth: `${55 + i * 10}%` }} />
                <div className="w-[6px] h-[6px] rounded-full mr-2" style={{ backgroundColor: row.status }} />
                <div className="flex-1 h-[3px] bg-[#e5e5e5] rounded-full mr-1" />
                <div className="flex-1 h-[3px] bg-[#e5e5e5] rounded-full mr-1" />
                <div className="flex-1 h-[3px] bg-[#e5e5e5] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Card 3 — 막막한 광고 제작
   깔끔하게 정렬된 광고 포맷 프레임 + "?"
   ════════════════════════════════════════════════════════════ */
function Skeleton3() {
  return (
    <div className="absolute inset-0 bg-[#f3f4f6] flex items-center justify-center p-3">
      <svg viewBox="-1 -1 302 252" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* 이미지 플레이스홀더 아이콘 (산+해) */}
        <defs>
          <symbol id="img-icon" viewBox="0 0 24 24">
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.8" fill="currentColor" />
            <path d="M21 15l-5-5L5 21" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </symbol>
        </defs>

        {/* Row 1: Feed (1:1) + Story (9:16) */}
        <rect x="0" y="0" width="168" height="168" rx="8" fill="white" stroke="#aaa" strokeWidth="1.2" strokeDasharray="6 3" />
        <use href="#img-icon" x="60" y="60" width="48" height="48" color="#ccc" />
        <text x="84" y="155" textAnchor="middle" fill="#999" fontSize="9" fontWeight="600" style={{ fontFamily: SF }}>1080 × 1080</text>

        <rect x="184" y="0" width="116" height="168" rx="8" fill="white" stroke="#aaa" strokeWidth="1.2" strokeDasharray="6 3" />
        <use href="#img-icon" x="222" y="60" width="40" height="40" color="#ccc" />
        <text x="242" y="155" textAnchor="middle" fill="#999" fontSize="9" fontWeight="600" style={{ fontFamily: SF }}>1080 × 1920</text>

        {/* Row 2: Display banner */}
        <rect x="0" y="186" width="300" height="52" rx="8" fill="white" stroke="#aaa" strokeWidth="1.2" strokeDasharray="6 3" />
        <use href="#img-icon" x="138" y="196" width="24" height="24" color="#ccc" />
        <text x="260" y="218" textAnchor="middle" fill="#999" fontSize="9" fontWeight="600" style={{ fontFamily: SF }}>1200 × 628</text>

        {/* Platform badges */}
        <rect x="10" y="10" width="40" height="16" rx="4" fill="#0081FB" />
        <text x="30" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" style={{ fontFamily: SF }}>Meta</text>

        <rect x="194" y="10" width="40" height="16" rx="4" fill="#ea4335" />
        <text x="214" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" style={{ fontFamily: SF }}>Google</text>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
const skeletons = [Skeleton1, Skeleton2, Skeleton3];

/* ════════════════════════════════════════════════════════════
   PainPoints — Main Section
   ════════════════════════════════════════════════════════════ */
export default function PainPoints() {
  return (
    <div>
      {/* Section Header */}
      <div className="pt-16 pb-8 px-12 max-md:pt-12 max-md:px-6 text-center">
        <FadeUp>
          <p className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-3" style={EN}>
            Problems
          </p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.02em] leading-[1.15] text-text-primary mb-1.5">
            {painPoints.title}
          </h2>
          <p className="text-[18px] text-text-primary font-light leading-[1.6] max-w-[520px] mx-auto">
            {painPoints.subtitle}
          </p>
        </FadeUp>
      </div>

      {/* 3-column grid */}
      <div className="border-t border-b border-border-default grid grid-cols-3 max-md:grid-cols-1">
        {painPoints.cells.map((cell, i) => {
          const Skeleton = skeletons[i];
          const isLast = i === painPoints.cells.length - 1;
          return (
            <div
              key={i}
              className={`flex flex-col ${!isLast ? 'max-md:border-b max-md:border-border-default' : ''}`}
              style={{ borderRight: isLast ? 'none' : '1px solid var(--color-border-default)' }}
            >
              <FadeUp delay={i * 0.08}>
                {/* Mobile: 좌 텍스트 + 세로선 + 우 비주얼 */}
                <div className="md:hidden flex items-stretch min-h-[200px]">
                  <div className="flex-1 px-4 py-5 flex flex-col justify-center">
                    <p className="text-[11px] font-semibold text-accent tracking-[0.08em] uppercase mb-2" style={EN}>
                      {cell.num}
                    </p>
                    <h3 className="text-[17px] font-bold tracking-[-0.01em] leading-[1.3] text-text-primary mb-2">
                      {cell.title}
                    </h3>
                    <p className="text-[12px] text-text-primary font-light leading-[1.5]">
                      {cell.bullets[0]}
                    </p>
                  </div>
                  <div className="relative w-[50%] shrink-0 border-l border-border-default bg-[#f3f4f6]">
                    <Skeleton />
                  </div>
                </div>

                {/* Desktop: 텍스트 위 */}
                <div className="hidden md:block px-6 pt-6 pb-5">
                  <p className="text-[11px] font-semibold text-accent tracking-[0.08em] uppercase mb-3" style={EN}>
                    {cell.num}
                  </p>
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] leading-[1.3] text-text-primary mb-2">
                    {cell.title}
                  </h3>
                  <p className="text-[14px] text-text-primary font-light leading-[1.5]">
                    {cell.bullets[0]}
                  </p>
                </div>
              </FadeUp>

              {/* Desktop: 비주얼 아래 */}
              <FadeUp delay={i * 0.08 + 0.05}>
                <div className="relative h-[260px] border-t border-border-default hidden md:block">
                  <Skeleton />
                </div>
              </FadeUp>
            </div>
          );
        })}
      </div>
    </div>
  );
}
