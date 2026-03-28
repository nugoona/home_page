'use client';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const outputs = [
  { platform: 'Instagram', desc: '피드 광고 · 스토리 광고', color: '#E1306C' },
  { platform: 'Google', desc: '검색광고 · PMax', color: '#4285F4' },
];

export default function AdFlowGlimpse() {
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
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', ...EN }}>
          ADCANVAS
        </span>
        <span style={{ fontSize: 10, color: '#ccc', ...EN }}>AI-Powered</span>
      </div>

      {/* Flow */}
      <div style={{ padding: '32px 28px' }}>
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', background: '#fafafa', border: '1px solid #f0f0f0',
          marginBottom: 20,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#bbb" strokeWidth="1.5">
            <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-3" strokeLinecap="round" />
            <path d="M11 3h4v4M15 3L8 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 13, color: '#999', ...EN }}>myshop.cafe24.com/product/12345</span>
        </div>

        {/* AI Processing */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 20px', background: 'rgba(0,112,243,0.04)', border: '1px solid rgba(0,112,243,0.15)',
          marginBottom: 20,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 2v2M8 12v2M2 8h2M12 8h2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 12, color: '#0070f3', fontWeight: 600 }}>AI가 이미지·문구·타겟을 자동 생성 중...</span>
        </div>

        {/* Outputs */}
        <div style={{ display: 'flex', gap: 12 }} className="max-sm:!flex-col">
          {outputs.map((o) => (
            <div
              key={o.platform}
              style={{
                flex: 1, padding: '18px 20px',
                border: '1px solid #eaeaea', background: '#fff',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{ width: 10, height: 10, background: o.color, flexShrink: 0 }} className="rounded-dot" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', ...EN }}>{o.platform}</p>
                <p style={{ fontSize: 11, color: '#999' }}>{o.desc}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="1.5" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <path d="M3 7l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>

        {/* Supported platforms */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', gap: 20 }}>
          {['Cafe24', 'MakeShop', 'GodoMall', 'Imweb'].map((p) => (
            <span key={p} style={{ fontSize: 10, color: '#ccc', ...EN }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
