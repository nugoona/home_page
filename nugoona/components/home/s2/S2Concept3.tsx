'use client';

/**
 * 홈 S2 — 시안 컨셉 3 "낯선 설정 화면"
 * 메시지: "어려운 건 마케팅이 아닙니다. 복잡한 시작입니다."
 *  → 계정·픽셀·토큰·인증 등 시작 단계의 낯선 용어가 진짜 장벽임을 보여준다.
 *
 * 기법 출처(분석·재조립, 라벨 복붙 아님):
 *  - Clone04(터미널): 창 헤더(신호등 3점 + 중앙 모노 타이틀) + border-bottom / 모노 고정폭 코드값.
 *  - Clone03(브라우저): 창 크롬 + 점선 가이드 / 입력 바.
 *  - Clone08(SSO 폼): 아이콘·라벨 입력 행의 반복 + 물음표/컨트롤.
 * 위 "창+폼" 골격만 빌려 '빽빽한 설정 필드 + 물음표'로 재설계 = 낯섦·막막함.
 * ⚠ 가상 UI(실제 플랫폼 흉내 금지). 라이트·모노크롬 + accent 절제. 모바일 우선.
 */

const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace',
} as const;
const EN = { fontFamily: 'var(--font-en)' } as const;

/* 이 목업 전용 강화 선 색상(전역 --color-border-* 는 그대로 두고 로컬에서만 진하게).
 * 사장님 피드백: 선이 흐리다 → 굵기는 유지, 진하기만 한 단계 올림. */
const LINE = '#c7cbd1'; // was var(--color-border-default) #eaeaea
const LINE_SOFT = '#d3d6db'; // was var(--color-border-light) #f0f0f0
const LINE_ACCENT = 'rgba(0, 112, 243, 0.4)'; // was var(--color-accent-border) rgba(0,112,243,0.15)

/* ── 아이콘 ── */
function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" stroke="#9a9a9a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="6.2" width="8" height="5.4" stroke="#a8a8a8" strokeWidth="1.2" />
      <path d="M4.6 6.2V4.9a2.4 2.4 0 0 1 4.8 0v1.3" stroke="#a8a8a8" strokeWidth="1.2" />
    </svg>
  );
}

/* ── 낯선 용어 위 물음표 배지 ── */
function QMark({ accent = false }: { accent?: boolean }) {
  return (
    <span
      className="rounded-dot inline-flex shrink-0 items-center justify-center"
      style={{
        width: 15,
        height: 15,
        fontSize: 10,
        lineHeight: 1,
        fontWeight: 600,
        color: accent ? 'var(--color-accent)' : '#a3a3a3',
        border: `1px solid ${accent ? LINE_ACCENT : LINE}`,
        background: accent ? 'var(--color-accent-bg)' : '#fff',
        ...EN,
      }}
    >
      ?
    </span>
  );
}

/* ── 토글 (대부분 꺼짐 = 손 못 댐) ── */
function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span
      className="rounded-pill relative inline-block shrink-0"
      style={{ width: 34, height: 20, background: on ? 'var(--color-accent)' : '#e3e3e3', transition: 'background .2s' }}
    >
      <span
        className="rounded-dot absolute top-[2px] bg-white"
        style={{ width: 16, height: 16, left: on ? 16 : 2, boxShadow: '0 1px 2px rgba(0,0,0,0.18)' }}
      />
    </span>
  );
}

type Row = {
  label: string;
  control: 'code' | 'toggle' | 'select';
  value?: string;
  on?: boolean;
  locked?: boolean;
  accentQ?: boolean;
};

const ROWS: Row[] = [
  { label: '전환 추적 픽셀 ID', control: 'code', value: 'px_8f3a••••••2c' },
  { label: 'UTM 캠페인 파라미터', control: 'toggle', on: false, accentQ: true },
  { label: '전환 API 액세스 토큰', control: 'code', value: 'ak_live_••••••••', locked: true },
  { label: '도메인 소유권 인증 · DNS TXT', control: 'code', value: 'v=ngn1 _dkim…' },
  { label: '입찰 전략 · 최적화 이벤트', control: 'select', value: 'oCPM · 전환' },
  { label: '맞춤 타겟 모수 세그먼트', control: 'toggle', on: false },
  { label: '게재 지면 · 노출 위치', control: 'select', value: '자동 · 12개' },
];

export default function S2Concept3() {
  return (
    <section className="w-full bg-[var(--color-bg)] px-5 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[720px]">
        {/* ── 섹션 헤드 ── */}
        <div className="mb-9 sm:mb-12">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-dot inline-block" style={{ width: 5, height: 5, background: 'var(--color-accent)' }} />
            <span
              className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
              style={EN}
            >
              The real barrier
            </span>
          </div>

          <h2
            className="text-[26px] font-semibold leading-[1.32] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[36px] sm:leading-[1.25]"
          >
            어려운 건 마케팅이 아닙니다.
            <br />
            <span className="text-[var(--color-text-muted)]">복잡한 </span>시작입니다.
          </h2>

          <p className="mt-4 max-w-[520px] text-[15px] leading-[1.7] text-[var(--color-text-weak)] sm:text-[16px]">
            계정 연동, 픽셀 설치, 전환 이벤트, 토큰 인증… 광고를 만들기도 전에
            <br className="hidden sm:block" />
            낯선 설정 화면부터 막힙니다. 필드마다 물음표가 붙습니다.
          </p>
        </div>

        {/* ── 설정 패널(창) ── */}
        <div
          className="w-full overflow-hidden border bg-white"
          style={{ borderColor: LINE, boxShadow: 'var(--shadow-mock)' }}
        >
          {/* 창 헤더: 신호등 + 중앙 모노 타이틀 (Clone04 기법) */}
          <div
            className="relative flex items-center px-4"
            style={{ height: 44, borderBottom: `1px solid ${LINE_SOFT}`, background: '#fbfbfb' }}
          >
            <span className="flex" style={{ gap: 6 }}>
              <span className="rounded-dot" style={{ width: 10, height: 10, background: '#e0e0e0' }} />
              <span className="rounded-dot" style={{ width: 10, height: 10, background: '#e0e0e0' }} />
              <span className="rounded-dot" style={{ width: 10, height: 10, background: '#e0e0e0' }} />
            </span>
            <span
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] sm:text-[13px]"
              style={{ ...MONO, color: '#9a9a9a' }}
            >
              advertising-setup.config
            </span>
          </div>

          {/* 진행 메타 — '끝이 안 보임'의 막막함 */}
          <div
            className="flex items-center justify-between px-4 py-2.5 sm:px-6"
            style={{ borderBottom: `1px dashed ${LINE}`, background: '#fcfcfc' }}
          >
            <span className="text-[11.5px] sm:text-[12px]" style={{ ...MONO, color: '#a3a3a3' }}>
              step 03 / 12
            </span>
            <span className="text-[11.5px] sm:text-[12px]" style={{ ...MONO, color: '#a3a3a3' }}>
              필드 47개 남음
            </span>
          </div>

          {/* 설정 행 반복 (Clone08 입력행 기법 → 낯선 용어 + ? + 컨트롤) */}
          <div>
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center gap-3 px-4 py-3.5 sm:px-6 sm:py-4"
                style={{
                  borderBottom: i === ROWS.length - 1 ? 'none' : `1px solid ${LINE_SOFT}`,
                  opacity: row.locked ? 0.6 : 1,
                }}
              >
                {/* 라벨 + 물음표 */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <QMark accent={row.accentQ} />
                  <span className="truncate text-[13.5px] text-[var(--color-text-secondary)] sm:text-[14.5px]">
                    {row.label}
                  </span>
                  {row.locked && (
                    <span className="ml-0.5 shrink-0">
                      <Lock />
                    </span>
                  )}
                </div>

                {/* 컨트롤 */}
                <div className="flex shrink-0 items-center justify-end" style={{ minWidth: 92 }}>
                  {row.control === 'toggle' && <Toggle on={row.on} />}

                  {row.control === 'code' && (
                    <span
                      className="max-w-[128px] truncate border px-2 py-1 text-[11.5px] sm:max-w-[160px] sm:text-[12px]"
                      style={{ ...MONO, color: '#8a8a8a', borderColor: LINE, background: '#f7f7f7' }}
                    >
                      {row.value}
                    </span>
                  )}

                  {row.control === 'select' && (
                    <span
                      className="flex max-w-[132px] items-center gap-1.5 border px-2 py-1 text-[11.5px] sm:max-w-[168px] sm:text-[12px]"
                      style={{ color: '#8a8a8a', borderColor: LINE, background: '#fff' }}
                    >
                      <span className="truncate">{row.value}</span>
                      <Chevron />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 비활성 저장 바 — '아직 아무것도 못 했다' */}
          <div
            className="flex items-center justify-between px-4 py-3 sm:px-6"
            style={{ borderTop: `1px solid ${LINE_SOFT}`, background: '#fbfbfb' }}
          >
            <span className="text-[11.5px] sm:text-[12px]" style={{ color: '#b0b0b0' }}>
              필수 항목 6개 미완료
            </span>
            <span
              className="border px-3 py-1.5 text-[12px] sm:text-[13px]"
              style={{ color: '#bdbdbd', borderColor: LINE, background: '#f5f5f5' }}
            >
              저장
            </span>
          </div>
        </div>

        {/* ── 패널 하단 캡션 ── */}
        <p className="mt-5 text-center text-[13px] leading-[1.6] text-[var(--color-text-muted)] sm:text-[13.5px]">
          만들기도 전에 지치는 이유,
          <br />
          시작 화면이 이미 낯설기 때문입니다.
        </p>
      </div>
    </section>
  );
}
