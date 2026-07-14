'use client';

/**
 * S3 시안 컨셉4 — "선택지 제시"
 * 메시지: "어려운 건 앱이 맡고, 결정은 사람이 합니다."
 *  - 앱이 오늘 발행할 글 후보 4개를 근거까지 미리 차려둔다(어려운 준비).
 *  - 사장님은 그중 하나를 고른다(결정). 선택된 1개만 accent, 나머지는 후보로 남는다.
 *
 * 기법 재조립(§8.13):
 *  - Clone08 배포 리스트 카드의 "행(row) 리스트 + 우측 상태 뱃지" 골격 → 카드 나열 대신 절제된 선택 로우로.
 *  - Clone10 2톤 헤드라인/부드러운 다층 그림자/radial 입체 링 → 선택 인디케이터·프레임에 이식.
 * 노하우(§8.14): 다크태그✗ / 선·글자 또렷 / 다층 그림자 / radial 입체 / 절제=accent 1개 / 모바일 360 우선.
 */

const OPTIONS = [
  {
    title: '가을 신메뉴 3종 이야기',
    reason: '이번 주 손님들이 자주 찾은 키워드를 담았어요',
    channel: '블로그',
    selected: true,
  },
  {
    title: '오늘 내린 원두 한 잔',
    reason: '사진이 잘 나와서 인스타에 어울려요',
    channel: '인스타',
    selected: false,
  },
  {
    title: '주말 예약 안내',
    reason: '주말이 오기 전에 미리 올리기 좋아요',
    channel: '블로그',
    selected: false,
  },
  {
    title: '단골 감사 쿠폰',
    reason: '다시 찾아온 손님에게 보내기 좋아요',
    channel: '인스타',
    selected: false,
  },
] as const;

/* 선택됨: accent 채움 + radial 입체(위 밝게) + 미세 그림자 + 흰 체크 */
function CheckOn() {
  return (
    <span
      className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full"
      style={{
        background: 'radial-gradient(120% 120% at 50% 12%, #3690ff 0%, #0070f3 62%, #005fd0 100%)',
        boxShadow: '0 1px 1px rgba(0,0,0,0.10), 0 4px 10px -2px rgba(0,112,243,0.45)',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2.5 6.2 5 8.6 9.6 3.6"
          stroke="#fff"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* 후보(미선택): 또렷한 링(노하우2 — 옅은 선 금지) */
function CheckOff() {
  return (
    <span
      className="h-[22px] w-[22px] flex-none rounded-full bg-white"
      style={{ boxShadow: 'inset 0 0 0 1.5px #cbcbcb' }}
      aria-hidden
    />
  );
}

export default function S3Concept4() {
  return (
    <div className="w-full bg-[#fafafa] px-4 py-10 sm:py-14">
      <div
        className="mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#ececec] bg-white"
        style={{
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.04), 0 18px 40px -14px rgba(0,0,0,0.12)',
        }}
      >
        {/* ── 프레임 헤더: 좌 앱 라벨 / 우 상태(다크 태그 없이 텍스트) ── */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span
              className="h-[15px] w-[15px] flex-none rounded-[5px]"
              style={{
                background:
                  'radial-gradient(120% 120% at 50% 15%, #3690ff 0%, #0070f3 70%)',
              }}
              aria-hidden
            />
            <span className="text-[13px] font-medium text-[#333]">누구나 콘텐츠</span>
          </div>
          <span className="text-[12px] font-medium text-[#999]">앱이 준비함 · 후보 4</span>
        </div>

        {/* ── 앱의 안내 한 줄(앱은 준비하고, 설명한다) ── */}
        <p
          className="px-5 pt-4 text-[14px] font-medium leading-[1.5] text-[#171717]"
          style={{ textWrap: 'balance' }}
        >
          오늘 올릴 글을 준비했어요. 마음에 드는 걸 하나 고르세요.
        </p>

        {/* ── 후보 리스트: 선택 1개만 accent ── */}
        <ul className="px-2.5 pb-2 pt-3">
          {OPTIONS.map((o) => (
            <li key={o.title} className="relative">
              <div
                className="flex items-start gap-3 rounded-xl px-2.5 py-3"
                style={
                  o.selected
                    ? { background: 'rgba(0,112,243,0.055)' }
                    : undefined
                }
              >
                {/* 선택 강조 바(좌측, 또렷한 accent) */}
                {o.selected && (
                  <span
                    className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full"
                    style={{ background: '#0070f3' }}
                    aria-hidden
                  />
                )}

                {o.selected ? <CheckOn /> : <CheckOff />}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[14.5px] font-medium leading-[1.4] ${
                        o.selected ? 'text-[#0a0a0a]' : 'text-[#222]'
                      }`}
                    >
                      {o.title}
                    </span>
                    {o.selected && (
                      <span
                        className="flex-none rounded-full px-2 py-[1px] text-[10.5px] font-semibold leading-[1.6]"
                        style={{ background: '#0070f3', color: '#fff' }}
                      >
                        선택됨
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-1 text-[12.5px] leading-[1.5] text-[#666]"
                    style={{ textWrap: 'balance' }}
                  >
                    {o.reason}
                  </p>
                </div>

                {/* 채널 메타(어디에 쓸지 — 사장님이 결정) */}
                <span className="mt-[2px] hidden flex-none text-[11.5px] font-medium text-[#999] sm:block">
                  {o.channel}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* ── 결정은 사람이: 하단 액션 ── */}
        <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f0] px-5 py-4">
          <span className="text-[12.5px] font-medium leading-[1.5] text-[#666]">
            고르는 건 사장님 몫이에요
          </span>
          <button
            type="button"
            className="flex-none rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{
              background: '#0070f3',
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.08), 0 6px 14px -4px rgba(0,112,243,0.5)',
            }}
          >
            이 주제로 발행
          </button>
        </div>
      </div>
    </div>
  );
}
