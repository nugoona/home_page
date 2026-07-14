'use client';

/**
 * 홈 S3 — 시안 1 "승인 카드"
 * 메시지(ourWay): "어려운 건 앱이 맡고, 결정은 사람이 합니다."
 *   → 앱이 어려운 준비(글감·초안·발행 시간)를 다 차려두고,
 *     사장님은 그걸 보고 "이대로 발행"을 결정한다. 준비(앱)와 결정(사람)이 한 화면에.
 *   ⚠ 결정의 주체 = 사장님. 앱은 준비 완료까지만, 승인 버튼은 사장님의 손에 있다(커서 마커로 명시).
 *
 * 기법 재조립(Vercel 소스 분석 → 우리 톤으로 변형, 라벨 복붙 아님):
 *  - Clone01 AppCard: 상단 콘텐츠는 또렷, 하단은 linear mask로 fade → 여기선 "앱이 준비한 초안 미리보기"를
 *    카드 상단에 두고, 준비물 목록으로 아래를 채워 fade 대신 '차려둠'을 채움으로 표현.
 *  - Clone08 노치 배지 + ScoreRing: 상태 뱃지/체크 링 기법 → accent 체크 아이콘(준비 완료 표식)으로 변형.
 *  - Clone08 SSO 카드의 '입력→버튼' 세로 흐름 + Log In 버튼: 카드 하단 결정 바(발행 버튼)로 재조립.
 *  - §8.14: 다크태그 금지(라이트 pill) / 선 opacity 0.4+ / 글자 font-medium·진한색 / 다층 부드러운 그림자 /
 *    배경 도트는 별도 absolute 레이어 + mask 분리 / accent 절제(체크·발행 버튼·커서만).
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;

/* 앱이 준비해 둔 것 — body[0] "앱은 준비하고, 설명하고, 다음 일을 알려줍니다."의 구체화 */
const PREPARED: readonly string[] = [
  '이번 주 글감을 골라뒀어요',
  '초안까지 미리 써뒀어요',
  '올리기 좋은 시간도 찾았어요',
];

/* accent 체크 아이콘 (준비 완료 표식) */
function CheckMark() {
  return (
    <span
      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
      style={{
        background: 'radial-gradient(120% 120% at 50% 25%, #2a8bff 0%, #0070f3 100%)',
        boxShadow: '0 2px 5px rgba(0,112,243,0.28), 0 1px 1px rgba(0,112,243,0.20)',
      }}
      aria-hidden
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.4 6.3 5 8.8 9.6 3.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function S3Concept1() {
  return (
    <section className="w-full bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5">
        {/* ── 섹션 헤드 ── */}
        <div className="mx-auto max-w-[640px] text-center">
          <span
            className="mb-5 inline-block text-xs font-medium tracking-[0.18em] text-text-muted"
            style={{ fontFamily: 'var(--font-en)' }}
          >
            OUR WAY
          </span>
          <h2 className="text-[clamp(1.7rem,5.2vw,2.7rem)] font-semibold leading-[1.3] tracking-[-0.02em]" style={KR}>
            <span className="text-text-primary">어려운 건 앱이 맡고,</span>
            <br />
            <span className="text-text-primary">결정은 </span>
            <span className="text-text-primary">사람</span>
            <span className="text-text-primary">이 합니다.</span>
          </h2>
        </div>

        {/* ── 승인 카드 ── */}
        <div className="relative mx-auto mt-14 w-full max-w-[420px]">
          {/* 배경 도트 (별도 레이어 + mask 분리) */}
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.055) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 45%, #000 40%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 80% 80% at 50% 45%, #000 40%, transparent 100%)',
            }}
          />

          <div
            className="overflow-hidden rounded-[18px] border bg-white"
            style={{
              borderColor: '#eaeaea',
              boxShadow:
                '0 1px 2px rgba(15,23,42,0.06), 0 18px 40px -14px rgba(15,23,42,0.14), 0 4px 10px -6px rgba(15,23,42,0.10)',
            }}
          >
            {/* 상단: 앱이 준비했다는 상태 바 */}
            <div className="flex items-center gap-2.5 border-b px-5 py-3.5" style={{ borderColor: '#f0f0f0' }}>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-[7px]"
                style={{ background: '#111', color: '#fff' }}
                aria-hidden
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7.4 5.7 10 11 3.6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[13.5px] font-medium text-text-body" style={KR}>
                누구나 콘텐츠
              </span>
              <span
                className="ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)', fontFamily: 'var(--font-kr)' }}
              >
                준비 완료
              </span>
            </div>

            {/* 초안 미리보기 (앱이 차려둔 결과물) */}
            <div className="px-5 pt-5">
              <p className="text-[11.5px] font-medium tracking-[0.02em] text-text-muted" style={KR}>
                이번 주 추천 글
              </p>
              <p className="mt-1.5 text-[17px] font-semibold leading-[1.4] tracking-[-0.01em] text-text-primary [text-wrap:balance]" style={KR}>
                가을 신메뉴, 이렇게 소개해 보세요
              </p>
              <p className="mt-2.5 text-[13.5px] font-medium leading-[1.6] text-text-body [text-wrap:balance]" style={KR}>
                날이 선선해지면서 따뜻한 메뉴를 찾는 분이 늘고 있어요. 새로 나온 메뉴의 재료와 어울리는 시간대를 담아 초안을 써뒀습니다.
              </p>
            </div>

            {/* 앱이 해둔 것 체크리스트 */}
            <ul className="mt-5 space-y-2.5 px-5">
              {PREPARED.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckMark />
                  <span className="text-[13.5px] font-medium leading-[1.4] text-text-body" style={KR}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* 결정 바 — 여기서부터는 사장님의 몫 */}
            <div className="mt-5 border-t px-5 py-4" style={{ borderColor: '#f0f0f0', background: '#fafafa' }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13.5px] font-medium text-text-body" style={KR}>
                  이대로 발행할까요?
                </span>
                <div className="relative flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-[9px] px-3 py-2 text-[13px] font-medium"
                    style={{ background: '#fff', border: '1px solid #e2e2e2', color: 'var(--color-text-body)', fontFamily: 'var(--font-kr)' }}
                  >
                    고쳐서 쓰기
                  </button>
                  <button
                    type="button"
                    className="rounded-[9px] px-4 py-2 text-[13px] font-semibold text-white"
                    style={{
                      background: 'linear-gradient(180deg, #1a82ff 0%, #0070f3 100%)',
                      boxShadow: '0 2px 6px rgba(0,112,243,0.30), 0 1px 1px rgba(0,112,243,0.20)',
                      fontFamily: 'var(--font-kr)',
                    }}
                  >
                    이대로 발행
                  </button>

                  {/* 사장님 커서 마커 — 결정의 주체가 사람임을 명시 */}
                  <div className="pointer-events-none absolute -bottom-6 right-1.5 flex items-center gap-1.5">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden style={{ filter: 'drop-shadow(0 1px 2px rgba(15,23,42,0.25))' }}>
                      <path d="M3 2 3 14.2 6.3 11 8.4 15.4 10.5 14.4 8.4 10 12.6 9.8 3 2Z" fill="#111" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold text-white"
                      style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-kr)' }}
                    >
                      사장님
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 역할 분담 캡션 (앱 / 사람) — ourWay.body 두 줄 ── */}
        <div className="mx-auto mt-16 grid max-w-[720px] gap-x-10 gap-y-8 sm:grid-cols-2">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="mb-2.5 text-[11.5px] font-semibold tracking-[0.14em] text-text-muted" style={{ fontFamily: 'var(--font-en)' }}>
              APP
            </span>
            <p className="text-[15px] font-medium leading-[1.5] text-text-body [text-wrap:balance]" style={KR}>
              앱은 준비하고, 설명하고, 다음 일을 알려줍니다.
            </p>
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="mb-2.5 text-[11.5px] font-semibold tracking-[0.14em]" style={{ fontFamily: 'var(--font-en)', color: 'var(--color-accent)' }}>
              YOU
            </span>
            <p className="text-[15px] font-medium leading-[1.5] text-text-primary [text-wrap:balance]" style={KR}>
              무엇을 보여주고 어디에 사용할지는 사장님이 직접 결정합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
