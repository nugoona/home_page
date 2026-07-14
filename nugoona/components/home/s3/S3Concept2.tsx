'use client';

import FadeUp from '@/components/motion/FadeUp';

/*
 * S3 시안 2 — "분업 대비" (어려운 건 앱이 맡고, 결정은 사람이 합니다)
 * ────────────────────────────────────────────────────────────
 * 컨셉: 좌우 비대칭 대비.
 *   좌(넓게·여러 항목) = 앱이 자동으로 끝낸 일 3가지(준비·설명·알림) → 전부 완료 체크.
 *   우(좁게·하나)     = 사장님이 하는 일은 딱 하나(결정) → 유일하게 accent로 살아있음.
 * "어려운 준비는 다 됐고, 남은 건 당신의 결정 하나"를 색·수량 비대칭으로 각인.
 *
 * 카피 = home.ts homeV2.ourWay (body[0]=앱이 하는 일 / body[1]=사람이 하는 일).
 * 기법 재조립: Clone02(카드 프레임 + 열 구분선 + 아이콘/라벨/값 행) · Clone07(칸 내부 제목→아이콘→설명 위계).
 * §8.14 준수: 다크태그 없음 / 선 opacity 0.4+ / font-medium+진한색 / 다층 그림자 / radial 입체 / 모바일 우선.
 */

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* 앱이 자동으로 끝낸 일 = body[0] "준비하고, 설명하고, 다음 일을 알려줍니다" 분해 */
const APP_TASKS = [
  { title: '준비를 끝냈습니다', desc: '올릴 콘텐츠와 광고 설정을 앱이 미리 만들어 둡니다.' },
  { title: '이유를 설명했습니다', desc: '무엇을, 왜 이렇게 했는지 근거를 함께 보여줍니다.' },
  { title: '다음 일을 알려드립니다', desc: '지금 확인할 것과 이어서 할 일을 짚어 줍니다.' },
] as const;

/* ── 완료 체크 (좌측, 모노크롬 — 이미 끝난 일) ── */
function DoneCheck() {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-dot"
      style={{
        width: 26,
        height: 26,
        background: 'radial-gradient(120% 120% at 50% 25%, #3a3a3a 0%, #1a1a1a 100%)',
        boxShadow: '0 1px 2px rgba(15,23,42,0.18), 0 3px 8px -2px rgba(15,23,42,0.12)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12.5 10 17.5 19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ── 결정 아이콘 (우측, accent — 사람이 하는 유일한 능동 행위 = 탭/선택) ── */
function DecideIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden>
      {/* 커서/탭 제스처 */}
      <path
        d="M11 6.5a2 2 0 0 1 4 0v9.2l1.1-2.1a2 2 0 0 1 3.6 1.7l-.3.7 1.4.5a3 3 0 0 1 1.9 3.6l-1 3.5a3.4 3.4 0 0 1-3.2 2.4h-4.3a3.4 3.4 0 0 1-2.7-1.3l-3.6-4.7a2.1 2.1 0 0 1 3-2.9l1.8 1.5V6.5Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function S3Concept2() {
  return (
    <section className="w-full bg-bg py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1080px] px-5 md:px-8">
        {/* ── 헤드라인 ── */}
        <FadeUp>
          <h2
            className="font-medium text-text-primary"
            style={{ fontSize: 'clamp(26px, 5vw, 42px)', lineHeight: 1.28, letterSpacing: '-0.02em' }}
          >
            어려운 건 앱이 맡고,
            <br />
            결정은 사람이 합니다.
          </h2>
          <p className="mt-4 max-w-[540px] font-medium text-text-weak" style={{ fontSize: 15, lineHeight: 1.6 }}>
            준비도, 설명도, 다음 일 안내도 앱이 합니다. 사장님은 마지막 하나, 결정만 하시면 됩니다.
          </p>
        </FadeUp>

        {/* ── 비대칭 프레임: 좌(앱 3항목) / 세로선 / 우(결정 1개) ── */}
        <FadeUp delay={0.1}>
          <div
            className="mt-10 grid overflow-hidden border md:grid-cols-[1.55fr_1px_1fr]"
            style={{ borderColor: 'var(--color-border-default)' }}
          >
            {/* ═══ 좌: 앱이 자동으로 끝낸 일 ═══ */}
            <div className="bg-bg-alt px-6 py-7 md:px-9 md:py-9">
              <div className="flex items-center gap-2">
                <span style={{ ...EN, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }} className="text-text-muted">
                  APP
                </span>
                <span className="font-medium text-text-body" style={{ fontSize: 13 }}>
                  앱이 자동으로 끝낸 일
                </span>
              </div>

              <ul className="mt-6 flex flex-col">
                {APP_TASKS.map((t, i) => (
                  <li
                    key={t.title}
                    className="flex items-start gap-3.5 py-4"
                    style={i > 0 ? { borderTop: '1px solid var(--color-border-default)' } : undefined}
                  >
                    <DoneCheck />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-text-primary" style={{ fontSize: 15.5, lineHeight: 1.4 }}>
                          {t.title}
                        </span>
                        <span
                          style={{ ...EN, fontSize: 11, fontWeight: 500, letterSpacing: '0.03em' }}
                          className="shrink-0 text-text-muted"
                        >
                          자동
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-text-weak" style={{ fontSize: 13, lineHeight: 1.55 }}>
                        {t.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 세로 구분선 (데스크탑) */}
            <div className="hidden md:block" style={{ background: 'var(--color-border-default)' }} />

            {/* ═══ 우: 사장님이 하는 일 = 딱 하나 ═══ */}
            <div
              className="relative flex flex-col justify-center px-6 py-9 md:px-9"
              style={{ borderTop: '1px solid var(--color-border-default)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{ ...EN, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}
                  className="text-accent"
                >
                  YOU
                </span>
                <span className="font-medium text-text-body" style={{ fontSize: 13 }}>
                  사장님이 하는 일
                </span>
              </div>

              {/* 결정 노드 1개 — radial 입체 + 다층 그림자 (§8.14-5) */}
              <div className="mt-7 flex flex-col items-start">
                <span
                  className="flex items-center justify-center rounded-dot"
                  style={{
                    width: 62,
                    height: 62,
                    background: 'radial-gradient(120% 120% at 50% 22%, #3d92ff 0%, #0070f3 60%, #005ad1 100%)',
                    boxShadow:
                      '0 0 0 1px rgba(0,90,209,0.25), 0 2px 4px rgba(0,80,200,0.20), 0 10px 24px -6px rgba(0,112,243,0.40)',
                  }}
                >
                  <DecideIcon />
                </span>

                <div className="mt-5">
                  <span className="font-medium text-text-primary" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>
                    결정
                  </span>
                  <span
                    className="ml-2 align-middle"
                    style={{ ...EN, fontSize: 12, fontWeight: 600 }}
                  >
                    <span className="text-accent">×1</span>
                  </span>
                </div>
                <p className="mt-2 font-medium text-text-body" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  무엇을 보여주고 어디에 사용할지는
                  <br className="hidden sm:block" /> 사장님이 직접 결정합니다.
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
