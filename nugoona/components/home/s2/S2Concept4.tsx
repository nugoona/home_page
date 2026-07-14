'use client';

/**
 * S2 · 컨셉4 — "넘치는 탭/창"
 * 메시지: "어려운 건 마케팅이 아닙니다. 복잡한 시작입니다."
 *   → 계정·인증·설정·낯선 용어. 진짜 장벽은 '광고를 켜기도 전' 시작 단계에 있다.
 *
 * 기법 출처: components/styles/vercel/Clone03.tsx(겹친 브라우저/패널 창).
 *   Clone03의 "창 문법"만 빌려와(신호등 3점·URL 헤더·창 내부 점선 그리드·겹침 z-index·
 *   contact→ambient 그림자) "정돈된 히어로"가 아니라 "어긋나게 쌓인 과부하"로 재조립했다.
 *   ⛔ 실제 플랫폼 흉내 금지 = 전부 가상 창. 파스텔·보라·순위/성과 보장 없음.
 *
 * 자족적: 외부 컴포넌트 의존 없음(토큰만 var()로 참조). 전역 리셋으로 모서리는 직각(브랜드 언어),
 * 원형 점만 .rounded-dot 예외 사용.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const MONO = {
  fontFamily: "ui-monospace, 'SFMono-Regular', 'Menlo', 'Consolas', monospace",
} as const;

/* macOS 신호등 3점 — Clone03 차용(원형은 .rounded-dot 예외로만 허용) */
function TrafficDots() {
  return (
    <div className="flex items-center gap-[5px]">
      <span className="rounded-dot h-[8px] w-[8px]" style={{ backgroundColor: '#ec6a5e' }} />
      <span className="rounded-dot h-[8px] w-[8px]" style={{ backgroundColor: '#f4bf4f' }} />
      <span className="rounded-dot h-[8px] w-[8px]" style={{ backgroundColor: '#61c454' }} />
    </div>
  );
}

/* 창 내부 점선 그리드 — Clone03의 dashed 그리드 차용(과부하 배경) */
function DashedGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        backgroundImage:
          'repeating-linear-gradient(to right, transparent, transparent 33px, #c8ccd2 33px, #c8ccd2 34px),' +
          'repeating-linear-gradient(to bottom, transparent, transparent 33px, #c8ccd2 33px, #c8ccd2 34px)',
        maskImage: 'linear-gradient(180deg, #000 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, #000 40%, transparent 100%)',
      }}
    />
  );
}

/* 겹친 창 하나 — Clone03의 헤더+본문+contact/ambient 그림자 골격 */
function Win({
  style,
  z,
  rotate,
  children,
  className = '',
}: {
  style: React.CSSProperties;
  z: number;
  rotate: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute overflow-hidden border bg-white ${className}`}
      style={{
        borderColor: '#c8ccd2',
        boxShadow:
          '0 0 0 1px rgba(15,23,42,0.18), 0 2px 4px rgba(15,23,42,0.05), 0 16px 34px -12px rgba(15,23,42,0.16)',
        transform: `rotate(${rotate}deg)`,
        zIndex: z,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* 창 헤더(신호등 + 라벨/URL) */
function WinHead({ label, url }: { label?: string; url?: string }) {
  return (
    <div
      className="flex items-center gap-[9px] px-[11px]"
      style={{ height: 30, borderBottom: '1px solid #c8ccd2' }}
    >
      <TrafficDots />
      {url ? (
        <span
          className="truncate"
          style={{ ...MONO, fontSize: 10, color: 'var(--color-text-muted)' }}
        >
          {url}
        </span>
      ) : (
        <span
          className="truncate font-medium"
          style={{ fontSize: 11, color: 'var(--color-text-weak)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* 폼 행 — 회색 스켈레톤 바 금지 → 실제 라벨 + 빈 입력칸/상태칩 */
function FormRow({ label, value, pending }: { label: string; value?: string; pending?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate" style={{ fontSize: 10.5, color: 'var(--color-text-weak)' }}>
        {label}
      </span>
      <span
        className="shrink-0 border px-[7px] py-[2px]"
        style={{
          fontSize: 9.5,
          borderColor: pending ? '#e0b568' : '#c8ccd2',
          color: pending ? '#a9791f' : 'var(--color-text-muted)',
          backgroundColor: pending ? '#fdf7ea' : '#fbfbfb',
          ...(value ? {} : MONO),
        }}
      >
        {pending ? '인증 대기' : value ?? '입력 필요'}
      </span>
    </div>
  );
}

/* 물음표 글리프(용어 장벽 신호) — 흐리게 흩뿌림 */
function Q({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute font-semibold select-none"
      style={{ ...EN, color: 'var(--color-border-mid)', ...style }}
    >
      ?
    </span>
  );
}

export default function S2Concept4() {
  return (
    <section className="w-full overflow-hidden px-6 py-[120px] max-md:py-16">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center">
        {/* ── 섹션 헤드 ── */}
        <div className="text-center">
          <p
            className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em]"
            style={{ ...EN, color: 'var(--color-accent)' }}
          >
            The real barrier
          </p>
          <h2
            className="text-[clamp(28px,4.6vw,46px)] font-bold tracking-[-0.03em] leading-[1.18] text-balance"
            style={{ color: 'var(--color-text-primary)' }}
          >
            어려운 건 마케팅이 아닙니다.
            <br />
            복잡한 <span style={{ color: 'var(--color-accent)' }}>시작</span>입니다.
          </h2>
          <p
            className="mx-auto mt-5 max-w-[520px] text-[clamp(14px,1.6vw,17px)] leading-[1.65]"
            style={{ color: 'var(--color-text-body)' }}
          >
            계정 만들기, 사업자 인증, 픽셀 연동, 처음 보는 용어들.
            진짜 장벽은 광고를 켜기도 전, 이 창들 앞에서 시작됩니다.
          </p>
        </div>

        {/* ── 겹친 창 무대(과부하) ── */}
        <div
          className="relative mt-14 w-full max-w-[960px] max-md:mt-10"
          style={{ height: 'clamp(400px, 56vw, 560px)' }}
        >
          {/* 흩뿌린 물음표(용어 과부하) */}
          <Q style={{ left: '2%', top: '10%', fontSize: 26, opacity: 0.5 }} />
          <Q style={{ right: '4%', top: '4%', fontSize: 34, opacity: 0.45 }} />
          <Q style={{ right: '10%', bottom: '6%', fontSize: 22, opacity: 0.4 }} />
          <Q style={{ left: '46%', bottom: '2%', fontSize: 18, opacity: 0.35 }} />

          {/* W1 — 뒤 창: '넘치는 탭' 브라우저(비즈니스 설정) */}
          <Win
            z={10}
            rotate={-3}
            style={{ left: '4%', top: '4%', width: '62%', maxWidth: 560 }}
          >
            {/* 탭 스트립 — 폭을 넘겨 잘리는 '넘치는 탭' */}
            <div
              className="flex items-center gap-[2px] overflow-hidden px-2"
              style={{ height: 28, backgroundColor: '#f7f7f7', borderBottom: '1px solid #c8ccd2' }}
            >
              {['비즈니스 정보', '사용자', '광고 계정', '데이터 소스', '결제 수단', '파트너', '브랜드 안전성', '도메인'].map(
                (t, i) => (
                  <span
                    key={t}
                    className="shrink-0 border-t border-l border-r px-[7px] py-[3px] truncate"
                    style={{
                      fontSize: 9.5,
                      borderColor: '#c8ccd2',
                      backgroundColor: i === 0 ? '#ffffff' : '#f2f2f2',
                      color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    }}
                  >
                    {t}
                  </span>
                )
              )}
              <span className="shrink-0 pl-1" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                +5
              </span>
            </div>
            <WinHead url="business.settings / verify" />
            <div className="relative px-4 pb-6 pt-4" style={{ minHeight: 176 }}>
              <DashedGrid />
              <div className="relative space-y-[9px]">
                <p className="font-semibold" style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>
                  비즈니스 인증
                </p>
                <FormRow label="사업자 등록번호" />
                <FormRow label="대표자 실명 인증" pending />
                <FormRow label="정산 통화" value="KRW" />
                <FormRow label="세금계산서 이메일" />
              </div>
            </div>
          </Win>

          {/* W2 — 앞 패널: '광고 계정 만들기' 다단계 마법사 */}
          <Win
            z={30}
            rotate={2.5}
            style={{ left: '40%', top: '20%', width: '46%', maxWidth: 400 }}
          >
            <WinHead label="광고 계정 만들기" />
            <div className="px-4 pb-5 pt-4">
              <div className="mb-3 flex items-center gap-1.5">
                {[1, 2, 3, 4].map((n) => (
                  <span
                    key={n}
                    className="flex h-[18px] w-[18px] items-center justify-center border"
                    style={{
                      ...EN,
                      fontSize: 10,
                      borderColor: n === 1 ? 'var(--color-accent)' : '#c8ccd2',
                      color: n === 1 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      backgroundColor: n === 1 ? 'var(--color-accent-bg)' : '#ffffff',
                    }}
                  >
                    {n}
                  </span>
                ))}
                <span className="pl-1.5" style={{ fontSize: 10.5, color: 'var(--color-text-muted)' }}>
                  4단계 중 1단계
                </span>
              </div>
              <div className="space-y-[9px]">
                <FormRow label="계정 이름" />
                <FormRow label="시간대" value="GMT+9" />
                <FormRow label="광고 목표" value="선택 필요" />
                <FormRow label="결제 수단 연결" pending />
              </div>
              <div
                className="mt-4 flex items-center justify-center border py-[7px]"
                style={{
                  borderColor: '#c8ccd2',
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  backgroundColor: '#fafafa',
                }}
              >
                다음 (이전 단계 미완료)
              </div>
            </div>
          </Win>

          {/* W3 — 낮은 왼쪽: '용어' 창(물음표 격자) */}
          <Win
            z={40}
            rotate={4}
            style={{ left: '3%', top: '48%', width: '40%', maxWidth: 340 }}
          >
            <WinHead label="이건 무슨 뜻이죠?" />
            <div className="grid grid-cols-3 gap-[1px] bg-[#c8ccd2] p-[1px]">
              {['CPC', 'ROAS', 'CPM', '도달', '빈도', '전환값'].map((t) => (
                <div
                  key={t}
                  className="flex flex-col items-center justify-center bg-white py-3"
                >
                  <span style={{ ...EN, fontSize: 11.5, color: 'var(--color-text-primary)' }}>{t}</span>
                  <span style={{ ...EN, fontSize: 13, color: 'var(--color-border-mid)' }}>?</span>
                </div>
              ))}
            </div>
          </Win>

          {/* W4 — 낮은 오른쪽: '픽셀/전환 API 연동' 코드 창 */}
          <Win
            z={25}
            rotate={-4.5}
            style={{ right: '2%', top: '52%', width: '43%', maxWidth: 380 }}
          >
            <WinHead url="pixel-setup / install-code" />
            <div className="relative px-4 pb-6 pt-3" style={{ minHeight: 128 }}>
              <DashedGrid />
              <div className="relative space-y-[6px]" style={MONO}>
                {[
                  '<script> init(PIXEL_ID);',
                  "track('PageView');",
                  '// 도메인 인증이 필요합니다',
                  'ERR: 이벤트 수신 안 됨',
                ].map((l, i) => (
                  <p
                    key={i}
                    className="truncate"
                    style={{
                      fontSize: 10.5,
                      color: i === 3 ? '#c0523f' : i === 2 ? 'var(--color-text-muted)' : 'var(--color-text-weak)',
                    }}
                  >
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </Win>

          {/* W5 — 작은 알림: 승인 대기(맨 앞, 살짝 삐져나감) */}
          <Win
            z={50}
            rotate={-1.5}
            style={{ left: '30%', top: '70%', width: '34%', maxWidth: 280 }}
          >
            <div className="flex items-center gap-2 px-3 py-[10px]">
              <span
                className="rounded-dot h-[7px] w-[7px] shrink-0"
                style={{ backgroundColor: '#f4bf4f' }}
              />
              <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                관리자 승인을 기다리는 중…
              </span>
              <span className="ml-auto shrink-0" style={{ ...MONO, fontSize: 10, color: 'var(--color-text-muted)' }}>
                3일째
              </span>
            </div>
          </Win>
        </div>
      </div>
    </section>
  );
}
