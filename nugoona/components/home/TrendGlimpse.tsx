'use client';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const rankings = [
  { rank: 1, name: '오버사이즈 린넨 블레이저', brand: 'STUDIO TOMBOY', badge: 'NEW', badgeColor: '#0070f3', isMine: false },
  { rank: 2, name: '와이드 데님 팬츠 (워싱)', brand: 'MUSINSA STANDARD', badge: '▲ 급상승', badgeColor: '#ef4444', isMine: false },
  { rank: 5, name: '플리츠 미디 스커트', brand: 'COS', badge: '▼ 2', badgeColor: '#999', isMine: false },
  { rank: 7, name: '코튼 크루넥 니트', brand: 'MY BRAND', badge: '▲ 3', badgeColor: '#22c55e', isMine: true },
];

export default function TrendGlimpse() {
  return (
    <div
      style={{
        maxWidth: 760,
        border: '1px solid #eaeaea',
        background: '#fff',
        boxShadow: '0 24px 80px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '18px 28px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', ...EN }}>29CM</span>
          <span style={{ fontSize: 11, color: '#ccc' }}>·</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#171717' }}>니트웨어 베스트</span>
        </div>
        <span style={{ fontSize: 10, color: '#ccc', ...EN }}>2026 W06</span>
      </div>

      {/* Rankings */}
      {rankings.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '18px 28px',
            borderBottom: i < rankings.length - 1 ? '1px solid #f5f5f5' : 'none',
            background: item.isMine ? 'rgba(0,112,243,0.03)' : 'transparent',
            borderLeft: item.isMine ? '3px solid #0070f3' : '3px solid transparent',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: item.isMine ? '#0070f3' : '#171717', width: 32, textAlign: 'right', flexShrink: 0, ...EN }}>
            {item.rank}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.name}
            </p>
            <p style={{ fontSize: 10, color: '#999', marginTop: 2, ...EN }}>{item.brand}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {item.isMine && (
              <span style={{ fontSize: 9, fontWeight: 700, color: '#0070f3', padding: '2px 8px', background: 'rgba(0,112,243,0.08)', ...EN }}>
                자사
              </span>
            )}
            <span style={{ fontSize: 11, fontWeight: 600, color: item.badgeColor, ...EN }}>
              {item.badge}
            </span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: '14px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#bbb" strokeWidth="1.2">
          <circle cx="6" cy="6" r="5" />
          <path d="M6 3v3l2 1" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 10, color: '#bbb' }}>매주 월요일 자동 수집 · 카테고리별 100위</span>
      </div>
    </div>
  );
}
