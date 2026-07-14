'use client';

/**
 * S2 시안 2 — "쌓이는 단계" (컨셉: 복잡한 시작 = 진짜 장벽)
 * 섹션 메시지: "어려운 건 마케팅이 아닙니다. 복잡한 시작입니다."
 *
 * ── 소스 분석 → 재조립 (Clone08·Clone10) ──
 * · Clone08 배포 카드 4장의 "계단 캐스케이드"(left 290→309 증가 + width 397→359 감소로 우측 정렬 계단)를
 *   차용 → 여기선 marginLeft를 index 배수로 밀어 우측 정렬 계단 스택으로 재설계(끝없이 쌓이는 느낌).
 * · Clone10 카드 하단 fade-out 마스크(linear-gradient mask)를 차용 → 스택 맨 아래를 흐리게 잘라
 *   "끝이 없다"를 시각화. Web Vitals 타일의 "라벨 작게 위 / 값 크게" 정보 위계도 카드 내부에 이식.
 * · 색 절제: 전부 모노크롬 hairline(#eaeaea) + accent 1회(eyebrow)만. 완료 체크가 아니라 "필수"만
 *   누적되는 부담. 짝퉁 실물·파스텔·스켈레톤 바 나열 없음(추상 라인 아이콘).
 *
 * 자족적: 외부 content/data·모션 라이브러리 의존 없음. 라이트 배경. 모바일 우선(360 안전).
 */

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ── 추상 라인 아이콘 (모노크롬, 짝퉁 실물 금지) ── */
const ICON_STROKE = '#6b6b6b'; // 사장님 피드백: 선 흐림 → 진하게(굵기는 유지, 색만 진하게)
/* 이 목업 전용 hairline 색 — 전역 --color-border-default(#eaeaea)가 너무 흐려 로컬 오버라이드로 진하게 */
const LINE_COLOR = '#c8ccd2';
function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={ICON_STROKE}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
const AccountIcon = () => (
  <Ico>
    <circle cx="9" cy="8" r="3.4" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0M18 8v6M15 11h6" />
  </Ico>
);
const DocIcon = () => (
  <Ico>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </Ico>
);
const CardIcon = () => (
  <Ico>
    <rect x="3" y="6" width="18" height="12" rx="1" />
    <path d="M3 10h18M7 15h3" />
  </Ico>
);
const PixelIcon = () => (
  <Ico>
    <path d="M4 4h4M4 4v4M20 4h-4M20 4v4M4 20h4M4 20v-4M20 20h-4M20 20v-4" />
    <circle cx="12" cy="12" r="2.4" />
  </Ico>
);
const TargetIcon = () => (
  <Ico>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Ico>
);
const SlidersIcon = () => (
  <Ico>
    <path d="M5 4v6M5 14v6M12 4v3M12 11v9M19 4v9M19 17v3" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="9" r="2" />
    <circle cx="19" cy="15" r="2" />
  </Ico>
);
const GlossaryIcon = () => (
  <Ico>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
    <path d="M5 17a3 3 0 0 1 3-3h11" />
  </Ico>
);

/* ── 시작 단계 (계정→인증→…→용어). 완료가 아니라 계속 쌓이는 "필수" ── */
type Step = { n: string; label: string; sub: string; Icon: () => React.JSX.Element };
const STEPS: Step[] = [
  { n: '01', label: '계정 만들기', sub: '광고 계정 개설 · 이메일 인증', Icon: AccountIcon },
  { n: '02', label: '사업자 인증', sub: '서류 제출 · 심사 대기', Icon: DocIcon },
  { n: '03', label: '결제 수단 등록', sub: '카드 · 세금계산서 설정', Icon: CardIcon },
  { n: '04', label: '전환 추적 심기', sub: '픽셀 · 이벤트 코드 삽입', Icon: PixelIcon },
  { n: '05', label: '타겟 설정', sub: '관심사 · 유사 모수 지정', Icon: TargetIcon },
  { n: '06', label: '예산 · 입찰', sub: '일 예산 · 입찰 방식 결정', Icon: SlidersIcon },
  { n: '07', label: '용어 학습', sub: 'CPC · ROAS · CTR · CPM …', Icon: GlossaryIcon },
];

function StepCard({ step, i }: { step: Step; i: number }) {
  // Clone08 캐스케이드 재조립: index 배수만큼 우측으로 밀어 계단(끝은 컨테이너 우변에 정렬).
  const marginLeft = `calc(var(--step) * ${i})`;
  // 아래로 갈수록 희미해짐 = 원경으로 밀려나는 스택(끝없음). 가독 하한 0.5.
  const opacity = Math.max(0.5, 1 - i * 0.072);
  // 상단 카드일수록 elevation 강하게 → 겹쳐 쌓인 카드 더미의 깊이감(광원 상단, slate 틴트).
  const lift = Math.max(0, 6 - i);
  const boxShadow =
    `0 0 0 1px rgba(15,23,42,0.45), ` +
    `0 ${1 + lift}px ${8 + lift * 3}px -2px rgba(15,23,42,${(0.06 - i * 0.006).toFixed(3)})`;
  const { Icon } = step;
  return (
    <div
      className="relative flex items-center gap-3.5 bg-white px-4 py-3 max-md:gap-2.5 max-md:px-3 max-md:py-2.5"
      style={{ marginLeft, opacity, boxShadow, zIndex: STEPS.length - i }}
    >
      {/* 스텝 번호 — en, 우측 정렬 muted (Clone08 slug 톤) */}
      <span
        className="w-[26px] shrink-0 text-right text-[13px] font-medium tabular-nums text-text-muted max-md:w-[22px] max-md:text-[11px]"
        style={EN}
      >
        {step.n}
      </span>
      {/* 추상 아이콘 박스 (Clone08 인프라 카드 hairline 박스) */}
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center border max-md:h-8 max-md:w-8"
        style={{ borderColor: LINE_COLOR }}
      >
        <Icon />
      </span>
      {/* 정보 위계 (Clone10 타일): 라벨 크게 진하게 위 / 부연 작게 muted 아래 */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium tracking-[-0.01em] text-text-primary max-md:text-[13px]">
          {step.label}
        </div>
        <div className="truncate text-[12px] text-text-muted max-md:text-[10.5px]" style={EN}>
          {step.sub}
        </div>
      </div>
      {/* 완료(✓)가 아니라 "필수"만 계속 붙는다 = 부담 누적 */}
      <span
        className="shrink-0 border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-text-muted max-md:px-1.5 max-md:text-[9px]"
        style={{ borderColor: LINE_COLOR }}
      >
        필수
      </span>
    </div>
  );
}

export default function S2Concept2() {
  return (
    <section className="flex justify-center bg-bg px-6 py-[120px] max-md:px-5 max-md:py-16">
      <div className="w-full max-w-[720px]">
        {/* ── 헤더 ── */}
        <div className="mb-12 text-center max-md:mb-9">
          <p
            className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-accent max-md:mb-3"
            style={EN}
          >
            The Real Barrier
          </p>
          <h2 className="text-[clamp(26px,4vw,40px)] font-semibold leading-[1.25] tracking-[-0.03em] text-balance">
            <span className="text-text-weak">어려운 건 마케팅이 아닙니다.</span>
            <br />
            <span className="text-text-primary">복잡한 시작입니다.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[440px] text-[15px] font-light leading-[1.6] tracking-[-0.02em] text-text-weak max-md:mt-4 max-md:text-[13.5px]">
            계정 · 인증 · 픽셀 · 예산 · 용어… 정작 마케팅은 시작도 못 했는데,
            준비할 것만 끝없이 쌓입니다.
          </p>
        </div>

        {/* ── 쌓이는 스택 (하단 fade-out = Clone10 마스크로 "끝없음" 표현) ── */}
        <div
          className="[--step:2.3rem] max-md:[--step:0.8rem]"
          style={{
            // 사장님 피드백: fade가 너무 흐림 → 중간 stop을 고opacity로 유지해 살짝만 진하게(끝없음 컨셉은 유지)
            WebkitMaskImage:
              'linear-gradient(to bottom, black 74%, rgba(0,0,0,0.92) 88%, transparent 99%)',
            maskImage:
              'linear-gradient(to bottom, black 74%, rgba(0,0,0,0.92) 88%, transparent 99%)',
          }}
        >
          <div className="flex flex-col gap-2.5 max-md:gap-2">
            {STEPS.map((step, i) => (
              <StepCard key={step.n} step={step} i={i} />
            ))}
            {/* 고스트 행 — 계단의 끝에서 계속 이어짐(끝나지 않는다) */}
            <div
              className="flex items-center gap-3 border border-dashed bg-white/60 px-4 py-3 text-[13px] text-text-muted max-md:px-3 max-md:py-2.5 max-md:text-[11.5px]"
              style={{
                marginLeft: `calc(var(--step) * ${STEPS.length})`,
                opacity: 0.5,
                borderColor: LINE_COLOR,
              }}
            >
              <span className="text-[15px] leading-none">+</span>
              <span>그리고 아직 더 남았습니다</span>
            </div>
          </div>
        </div>

        {/* ── 마무리 캡션 (헤드라인과 호응: 마케팅은 아직 시작도 안 함) ── */}
        <p className="mt-9 text-center text-[15px] font-medium tracking-[-0.01em] text-text-primary max-md:mt-7 max-md:text-[13.5px]">
          이미 7가지. 마케팅은 아직 시작도 하지 못했습니다.
        </p>
      </div>
    </section>
  );
}
