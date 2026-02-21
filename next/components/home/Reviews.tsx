import CrossMark from '@/components/ui/CrossMark';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const stats = [
  {
    highlight: '수수료가 1/7로 줄었는데',
    desc: '불편함 없이 동일한 성과를 유지하고 있어서 만족합니다.',
    sourceLine1: '여성 데일리룩\n브랜드 대표',
    sourceLine2: '월 광고비\n500만원',
  },
  {
    highlight: 'URL만 넣으면 광고가 바로 나와서',
    desc: '디자이너 없이도 인스타 광고를 직접 돌리고 있어요.',
    sourceLine1: '뷰티 종합몰 마케터',
    sourceLine2: 'AdCanvas 사용',
  },
  {
    highlight: '경쟁사 트렌드를 매주 자동으로 받아보니까',
    desc: '미팅 준비가 확 줄었고 시즌 대응도 빨라졌어요.',
    sourceLine1: '홈데코 셀렉트숍 MD',
    sourceLine2: '월 광고비\n2,000만원',
  },
];

export default function Reviews() {
  return (
    <div className="relative border-t border-border-default">
      <CrossMark position="top-left" />
      <CrossMark position="top-right" />
      <CrossMark position="bottom-left" />
      <CrossMark position="bottom-right" />
      {/* Header */}
      <div className="pt-16 pb-8 px-12 max-md:pt-12 max-md:px-6 max-md:text-center">
        <p className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-3" style={EN}>
          Results
        </p>
        <p className="text-[clamp(22px,3vw,32px)] tracking-[-0.02em]">
          <span className="text-text-secondary">모든 고객사가 </span>
          <strong className="font-semibold text-text-primary">비용은 줄이고 효율은 높였습니다.</strong>
        </p>
      </div>

      {/* 3-column stats */}
      <div className="border-t border-border-default grid grid-cols-3 max-md:grid-cols-1">
        {stats.map((s, i) => (
          <div
            key={i}
            className="px-8 py-10 max-md:px-4 max-md:py-6 flex flex-col"
            style={{
              boxShadow: i < stats.length - 1 ? '1px 0 0 var(--color-border-default)' : 'none',
            }}
          >
            {/* Desktop */}
            <div className="hidden md:flex md:flex-col md:flex-1">
              <span className="text-[36px] leading-none text-accent font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</span>
              <div className="mb-5 flex-1">
                <p className="text-[17px] leading-[1.7] tracking-[-0.02em] text-text-primary">
                  <strong className="font-semibold">{s.highlight}</strong>
                  <br />{s.desc}
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto items-stretch">
                <span className="flex-1 flex items-center justify-center text-center text-[12px] font-medium text-white bg-[#171717] px-2 py-1.5">{s.sourceLine1.replace(/\n/g, ' ')}</span>
                <span className="flex-1 flex items-center justify-center text-center text-[12px] font-medium text-white bg-[#171717] px-2 py-1.5">{s.sourceLine2.replace(/\n/g, ' ')}</span>
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col flex-1">
              <span className="text-[32px] leading-none text-accent font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</span>
              <p className="text-[14px] leading-[1.7] tracking-[-0.02em] text-text-primary mb-4">
                <strong className="font-semibold">{s.highlight}</strong>
                {' '}{s.desc}
              </p>
              <div className="mt-auto flex gap-2 flex-wrap">
                <span className="inline-flex items-center text-[11px] font-medium text-text-primary border border-[#bbb] px-3 py-1.5">{s.sourceLine1.replace(/\n/g, ' ')}</span>
                <span className="inline-flex items-center text-[11px] font-medium text-text-primary border border-[#bbb] px-3 py-1.5">{s.sourceLine2.replace(/\n/g, ' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
