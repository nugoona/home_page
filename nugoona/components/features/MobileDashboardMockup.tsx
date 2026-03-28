'use client';

export default function MobileDashboardMockup() {
  return (
    <div className="border border-border-default bg-white overflow-hidden max-w-[360px] mx-auto">
      {/* Phone frame top bar */}
      <div className="bg-[#f8f8f8] border-b border-border-default px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-text-weak" style={{ fontFamily: 'var(--font-en)' }}>9:41</span>
        <span className="text-[10px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-en)' }}>NGN Dashboard</span>
        <div className="flex gap-1">
          <span className="w-3 h-2 bg-text-weak opacity-40" />
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 space-y-3 text-[11px]">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center h-[22px] px-2 border border-border-default text-[10px] text-text-body">demo</span>
            <span className="inline-flex items-center h-[22px] px-2 border border-border-default text-[10px] text-text-body">이번 달</span>
          </div>
          <p className="text-[9px] text-text-weak">업데이트: 2026.02.09 09:00</p>
        </div>

        {/* Shortcut cards */}
        <a className="flex items-center justify-between p-3 border border-[#e8e0f8] bg-[#f8f5ff]">
          <div>
            <p className="text-[10px] font-semibold text-[#7c3aed] tracking-[0.05em]" style={{ fontFamily: 'var(--font-en)' }}>TREND</p>
            <p className="text-[9px] text-text-body mt-0.5">플랫폼 베스트 상품 트렌드 분석</p>
          </div>
          <span className="text-text-weak text-[14px]">&rsaquo;</span>
        </a>
        <a className="flex items-center justify-between p-3 border border-[#d5f0f0] bg-[#f0fafa]">
          <div>
            <p className="text-[10px] font-semibold text-[#0891b2] tracking-[0.05em]" style={{ fontFamily: 'var(--font-en)' }}>AD CANVAS</p>
            <p className="text-[9px] text-text-body mt-0.5">광고 캠페인 운영 및 관리</p>
          </div>
          <span className="text-text-weak text-[14px]">&rsaquo;</span>
        </a>

        {/* KPI Section */}
        <div>
          <p className="text-[10px] font-semibold text-text-primary mb-2">사이트 성과 요약</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '사이트 매출', value: '12,847,200' },
              { label: '방문자', value: '3,842' },
              { label: '주문수', value: '127' },
              { label: '매출대비 광고비', value: '8.2%' },
            ].map((kpi) => (
              <div key={kpi.label} className="border border-border-default p-2.5">
                <p className="text-[9px] text-text-weak mb-1">{kpi.label}</p>
                <p className="text-[13px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-en)' }}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product sales table */}
        <div>
          <p className="text-[10px] font-semibold text-text-primary mb-2">카페24 상품판매</p>
          <table className="w-full text-[9px]">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left py-1.5 font-medium text-text-weak">상품명</th>
                <th className="text-right py-1.5 font-medium text-text-weak">판매</th>
                <th className="text-right py-1.5 font-medium text-text-weak">매출</th>
              </tr>
            </thead>
            <tbody className="text-text-body">
              {[
                ['demo 상품 A', '24', '1,896,000'],
                ['demo 상품 B', '18', '1,422,000'],
                ['demo 상품 C', '15', '1,185,000'],
              ].map(([name, qty, rev]) => (
                <tr key={name} className="border-b border-border-light">
                  <td className="py-1.5">{name}</td>
                  <td className="text-right py-1.5" style={{ fontFamily: 'var(--font-en)' }}>{qty}</td>
                  <td className="text-right py-1.5" style={{ fontFamily: 'var(--font-en)' }}>{rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ad performance summary */}
        <div>
          <p className="text-[10px] font-semibold text-text-primary mb-2">광고 성과 요약</p>
          <div className="border border-border-default p-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-text-weak">광고비</span>
              <span className="font-semibold text-text-primary" style={{ fontFamily: 'var(--font-en)' }}>1,052,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-weak">ROAS</span>
              <span className="font-semibold text-text-primary" style={{ fontFamily: 'var(--font-en)' }}>785%</span>
            </div>
          </div>
          <table className="w-full text-[9px] mt-2">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left py-1.5 font-medium text-text-weak">계정</th>
                <th className="text-right py-1.5 font-medium text-text-weak">광고비</th>
                <th className="text-right py-1.5 font-medium text-text-weak">ROAS</th>
              </tr>
            </thead>
            <tbody className="text-text-body">
              <tr className="border-b border-border-light">
                <td className="py-1.5"><span className="inline-flex items-center h-[14px] px-1 text-[7px] font-semibold text-white bg-[#1877f2] mr-1" style={{ fontFamily: 'var(--font-en)' }}>META</span>demo</td>
                <td className="text-right py-1.5" style={{ fontFamily: 'var(--font-en)' }}>827,400</td>
                <td className="text-right py-1.5" style={{ fontFamily: 'var(--font-en)' }}>1,024%</td>
              </tr>
              <tr className="border-b border-border-light">
                <td className="py-1.5"><span className="inline-flex items-center h-[14px] px-1 text-[7px] font-semibold text-white bg-[#34a853] mr-1" style={{ fontFamily: 'var(--font-en)' }}>GOOGLE</span>demo</td>
                <td className="text-right py-1.5" style={{ fontFamily: 'var(--font-en)' }}>225,000</td>
                <td className="text-right py-1.5" style={{ fontFamily: 'var(--font-en)' }}>412%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LIVE ad previews */}
        <div>
          <p className="text-[10px] font-semibold text-text-primary mb-2">LIVE 광고 미리보기</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'demo 여름 신상 컬렉션', account: 'demo · 전환', color: '#e8d8c8' },
              { name: 'demo 크림 베스트셀러', account: 'demo · 유입', color: '#d8e8d8' },
            ].map((ad) => (
              <div key={ad.name} className="border border-border-default overflow-hidden">
                <div className="aspect-square flex items-center justify-center" style={{ background: ad.color }}>
                  <span className="text-[8px] text-text-weak">AD</span>
                </div>
                <div className="p-2">
                  <p className="text-[9px] font-medium text-text-primary leading-tight">{ad.name}</p>
                  <p className="text-[8px] text-text-weak mt-0.5">{ad.account}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
