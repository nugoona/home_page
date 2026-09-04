'use client';

/**
 * OccupancyGrid — NGN Grid Occupancy 시스템 공용 컴포넌트 (2026-07-14 사장님 확정, 히어로 기준).
 *
 * 원칙:
 *  - 페이지 전체가 하나의 그리드 좌표계. 콘텐츠는 셀 정수 개를 병합 점유하는 "칸(면)".
 *  - 칸 내부에 그리드 선 절대 금지. 선은 칸 경계에만(실제 CSS Grid 점유 — 오버레이·가림 아님).
 *  - 간격 = margin 금지, 빈 칸/행이 담당.
 *  - 셀은 항상 정사각: 컨테이너 aspectRatio(cols/rows) + 행 1fr.
 *    (⚠️ 100vw 기반 행높이는 부모 max-w와 어긋나 세로 직사각 — 히어로에서 실증)
 *  - ★모든 섹션이 1×1 바둑판일 필요 없음 — 바둑판은 히어로의 표현. 다른 섹션은
 *    같은 좌표에 스냅된 큰 칸으로 균형 분할(checker=false + blank 칸 명시).
 *
 * 좌표 = 1-based 그리드 라인 [start, end). 12열 중심축 = line 7(짝수 span만 정중앙 가능).
 */

export interface GridArea {
  key: string;
  c: [number, number];
  r: [number, number];
  /** true = 콘텐츠 없는 빈 칸(구획 선만) */
  blank?: boolean;
  /** 칸 내부 정렬 오버라이드(기본 중앙) */
  className?: string;
}

const TONE = {
  dark: {
    line: '1px 0 0 rgba(255,255,255,0.12)',
    border: '0.5px solid rgba(255,255,255,0.12)',
  },
  light: {
    line: '1px 0 0 #ECECEC',
    border: '1px solid #ECECEC',
  },
  /* 모바일 칸칸이 전용 — 배경 #fafafa에 대비되게 선을 진하게(사장님 2026-07-16 "옅은 회색에 선만 보이게") */
  gridline: {
    line: '1px 0 0 #d8d8d8',
    border: '1px solid #d8d8d8',
  },
  /* 히어로 모바일 전용 — 그리드가 콘텐츠보다 뒤로 물러나게 선을 더 흐리게(2026-07-16 GPT PM) */
  darkFaint: {
    line: '1px 0 0 rgba(255,255,255,0.06)',
    border: '0.5px solid rgba(255,255,255,0.06)',
  },
} as const;

/** 섹션 경계 여백 줄 — "가장 작은 정사각형 한 줄"(사장님 확정 2026-07-15, §8.16-C).
    PC 12칸 / 모바일 6칸 checker 1행. 섹션과 섹션 사이에 page.tsx에서 삽입.
    thin = 세로선 없는 얇은 무지대(높이 절반, 위아래 가로선 2개 = "두 줄" — 사장님 2026-07-15, Vercel 여백 줄 실측 문법) */
export function SpacerRow({ tone = 'light', thin = false, noMobileGrid = false, top = false }: { tone?: 'light' | 'dark'; thin?: boolean; noMobileGrid?: boolean; top?: boolean }) {
  /* top = PC 격자 행 윗선(2026-07-20 사장님 '칸칸이 윗줄 안 보임' — /content·/ads처럼 위 섹션에 하단선이 없는 페이지 전용. 홈은 기본 false: 그리드 하단선과 겹쳐 두꺼워짐) */
  const line = tone === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid #ECECEC';
  /* ★07-16 갱신(§8.18-I): 모바일 여백 = 칸칸이(checker). 구 "모바일 항상 thin(떠 있는 조각 반려)"은 뒤집힘
     — 위 섹션 borderBottom에 border-t로 붙여 '조각' 아님. thinBar는 이제 PC thin + noMobileGrid 자리 전용. */
  const thinBar = (extraCls: string) => (
    <div aria-hidden className={`${tone === 'dark' ? 'bg-[#05070d]' : 'bg-bg'} ${extraCls}`} style={{ height: 'clamp(26px, 3.3vw, 42px)', borderBottom: line }} />
  );
  const mobileTone = tone === 'dark' ? 'dark' : 'gridline';
  const topLine = tone === 'dark' ? 'rgba(255,255,255,0.12)' : '#d8d8d8';
  /* 모바일 = 칸칸이(배경 옅은 회색 #fafafa → 흰색 네모 없이 선만 도드라짐, 사장님 2026-07-16).
     위 경계선(border-t)으로 '윗줄 선' 보장, 셀 우측 세로선+아래 가로선과 합쳐 완결된 칸칸이 */
  const mobileChecker = (
    <div className="border-t md:hidden" style={{ borderColor: topLine }}>
      <OccupancyGrid cols={6} rows={1} areas={[]} tone={mobileTone} checker mobile render={() => null} />
    </div>
  );
  /* noMobileGrid = 칸칸이가 공간을 너무 차지해 '붕 떠' 보이는 자리(예: CTA 위) — 모바일도 얇은 줄로(사장님 2026-07-16) */
  const mobileEl = noMobileGrid ? thinBar('md:hidden') : mobileChecker;
  /* thin = 모바일은 칸칸이(또는 noMobileGrid 시 얇은 줄) / PC만 얇은 무지대 두 줄 */
  if (thin) {
    return (
      <div className={tone === 'dark' ? 'bg-[#05070d]' : 'bg-[#fafafa] md:bg-bg'}>
        {mobileEl}
        {thinBar('hidden md:block')}
      </div>
    );
  }
  return (
    <div className={tone === 'dark' ? 'bg-[#05070d]' : 'bg-[#fafafa] md:bg-bg'}>
      {mobileEl}
      <div className="hidden md:block" style={top ? { borderTop: line } : undefined}>
        <OccupancyGrid cols={12} rows={1} areas={[]} tone={tone} checker mobile={false} render={() => null} />
      </div>
    </div>
  );
}

export default function OccupancyGrid({
  cols,
  rows,
  areas,
  tone = 'light',
  checker = false,
  mobile,
  className = '',
  render,
}: {
  cols: number;
  rows: number;
  areas: GridArea[];
  tone?: keyof typeof TONE;
  /** true = 미점유 영역을 1×1 빈 셀 바둑판으로 채움(히어로). false = 미점유 투명(선 없음) */
  checker?: boolean;
  /** md 분기: true = 모바일 전용(grid md:hidden), false = 데스크톱 전용, undefined = 항상 표시 */
  mobile?: boolean;
  className?: string;
  render: (key: string) => React.ReactNode;
}) {
  const t = TONE[tone];
  const cellStyle = { boxShadow: t.line, borderBottom: t.border } as const;

  const empties: React.ReactNode[] = [];
  if (checker) {
    for (let r = 1; r <= rows; r += 1) {
      for (let c = 1; c <= cols; c += 1) {
        const occupied = areas.some((a) => c >= a.c[0] && c < a.c[1] && r >= a.r[0] && r < a.r[1]);
        if (!occupied) {
          empties.push(<div key={`${c}-${r}`} style={{ gridColumn: c, gridRow: r, ...cellStyle }} aria-hidden />);
        }
      }
    }
  }

  const visibility = mobile === undefined ? 'grid' : mobile ? 'grid md:hidden' : 'hidden md:grid';

  return (
    <div
      className={`relative ${visibility} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        aspectRatio: `${cols} / ${rows}`,
      }}
    >
      {empties}
      {areas.map((a) => (
        <div
          key={a.key}
          className={a.className ?? 'flex items-center justify-center'}
          style={{
            gridColumn: `${a.c[0]} / ${a.c[1]}`,
            gridRow: `${a.r[0]} / ${a.r[1]}`,
            ...cellStyle,
          }}
          aria-hidden={a.blank || undefined}
        >
          {a.blank ? null : render(a.key)}
        </div>
      ))}
    </div>
  );
}
