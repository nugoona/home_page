'use client';

/**
 * StartScene — /content "상호명만 넣어주세요" 구간 · 정지 화면 시안 6판(2026-10-09, 직원 PC) — 움직임 전 O/X 용(§8.7-0).
 *
 * 문법 = 광고 페이지 "상품 URL 하나로 광고를 준비합니다"(AdsCanvasFlow 메타 그룹)를 그대로 이어받음(기준 33 — 사장님 "누구나 광고 쪽을 봐라"):
 *   단계 헤드(번호 필 + 문장 제목) · 흰 카드(1px #EDEDED + 그림자 0 1px 2px .03) · 카드 사이 흰 원 화살 · 과정은 좁게, 완성 실물은 크게.
 *   01 가게 이름 입력(02 카드 세로 중앙) → 02 조사한 재료(지도 그림·메뉴판·리뷰·손님 검색어 알약) → 03 완성 실물 = 네이버 블로그 글
 *   (16:9 사진 · 제목의 굵은 낱말 넷 ↔ 재료 넷 · 본문 몇 줄 · 중략 ⋯ · 메타).
 * 수집물은 실물처럼 풍성하게(기준 32). 지도 = 코덱스 그림(media/meat-start/ui/map.png, 네이버 지도 참고).
 * 검색어 = 다크 알약(§8.17 칩=다크 필) + 월간 검색량·경쟁도(읽히는 회색, 사장님 지시 — 수치는 가상).
 * 통과 후 움직임(§9 1안): 이름 치기 → 02 재료가 차례로 채워짐 → 각 재료에서 낱말이 떨어져 03 제목의 뻔한 낱말을 수직 컷으로 교체 → 머묾 → 되돌림.
 * 가게 이름·주소·메뉴·리뷰·검색어·본문은 가상. 사진 = 코덱스 생성(조사 = scratchpad photos-meat/reference*.md).
 */

const ACCENT = '#0070f3';
const C_BORDER = '#EDEDED';
const C_SHADOW = '0 1px 2px rgba(0,0,0,0.03)';
const EN = { fontFamily: 'var(--font-en)' } as const;
const NUM = { fontVariantNumeric: 'tabular-nums' } as const;
const NAME = '망원 숯불집';

const MENU = [
  { name: '숙성 삼겹살', g: '180g', price: '16,000', top: true },
  { name: '숙성 목살', g: '180g', price: '16,000', top: true },
  { name: '항정살', g: '150g', price: '17,000' },
  { name: '된장찌개', g: '', price: '7,000' },
];
const REVIEWS = ['고기가 두툼하고 안 질겨요', '회식 자리로 딱이에요'];
const KEYWORDS = [
  { k: '망원동삼겹살', vol: '2,400', comp: '낮음' },
  { k: '망원동고기집', vol: '1,900', comp: '보통' },
  { k: '망원역맛집', vol: '5,100', comp: '높음' },
  { k: '망원 숯불구이', vol: '880', comp: '낮음' },
];
const COMP_COLOR: Record<string, string> = { 낮음: '#22c55e', 보통: '#f59e0b', 높음: '#ef4444' };

/* 제목 — 재료에서 온 낱말만 굵게(지도→망원역 3분 · 메뉴판→숙성 삼겹살 · 리뷰→두툼하게 · 검색어→망원동삼겹살) */
const TITLE: { t: string; own?: boolean }[] = [
  { t: '망원역 3분', own: true }, { t: ', ' },
  { t: '숙성 삼겹살', own: true }, { t: '을 숯불에 ' },
  { t: '두툼하게', own: true }, { t: ' 굽는 ' },
  { t: '망원동삼겹살', own: true }, { t: ' 맛집' },
];

/** 단계 헤드 — 구 상호명 구간 S8Step 위계(사장님 2026-07-18 "한 번에 안 읽힘" 교정값) 이식:
    번호 필 22px + 제목 15.5px 굵게(주인공) + 설명 12.5px muted 한 줄(한 단 뒤로). 광고 CvStep 의 min-h 로 세 칸 화살 기준선 통일 */
function Step({ n, label, desc }: { n: string; label: string; desc: string }) {
  return (
    /* 휴대폰 = 번호 필이 왼쪽 세로 줄기 위에 꿰어진다(-ml-9 로 줄기 자리로 내어 놓음). 고정 헤드는 효과 없어 폐기(사장님 2026-10-09) */
    <div className="mb-3 flex min-h-[64px] items-start gap-3 max-md:-ml-9 max-md:min-h-0 max-md:gap-[7px]">
      <span className="mt-[3px] flex h-[22px] shrink-0 items-center bg-[#171717] px-2 text-[11px] font-bold leading-none tracking-[0.04em] text-white" style={EN}>{n}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[15.5px] font-bold leading-[1.3] tracking-[-0.02em] text-text-primary max-md:text-[14.5px]">{label}</p>
        <p className="mt-1 text-[12.5px] font-medium leading-[1.5] text-text-muted">{desc}</p>
      </div>
    </div>
  );
}

/** 휴대폰 세로 줄기 — 이 단계 번호 필 아래에서 다음 단계 번호 필 위까지 이어지는 선 + 끝에 V 화살촉(§8.7-A 모바일 화살 정본: 가는 라인 V촉 #171717).
    다음 단계와의 간격(28px)만큼 블록 밖으로 내려간다. PC 에서는 숨김 */
function Spine() {
  return (
    <span aria-hidden className="pointer-events-none absolute bottom-[-25px] left-[14px] top-[30px] w-px bg-[#171717] md:hidden">
      <svg width="11" height="7" viewBox="0 0 11 7" fill="none" className="absolute -left-[5px] bottom-0"><path d="M0.5 0.5L5.5 6l5-5.5" stroke="#171717" strokeWidth="1.1" /></svg>
    </span>
  );
}

/** 카드 사이 화살 — 광고 CvArrow(center) 와 같은 값: 흰 원 44px + 그림자 2겹 + 채운 삼각. 모바일 숨김 */
function Arrow() {
  return (
    <div className="hidden items-center justify-center self-stretch pt-[76px] md:flex" aria-hidden>
      <span className="rounded-dot flex h-11 w-11 items-center justify-center bg-white" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.12)' }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><line x1="1" y1="6" x2="10" y2="6" stroke="#171717" strokeWidth="1.6" /><path d="M10 1.2L17 6l-7 4.8z" fill="#171717" /></svg>
      </span>
    </div>
  );
}

/** 02 카드 안 구획 머리 — 광고 02 카드의 "수집된 사진 6장 / 광고에 쓸 사진을 고르세요" 줄과 같은 값 */
function Head({ l, r }: { l: string; r?: string }) {
  return (
    <p className="mb-2 flex items-baseline justify-between">
      <span className="text-[10.5px] font-bold tracking-[0.02em] text-[#666]">{l}</span>
      {r && <span className="text-[9.5px] font-medium text-[#999]">{r}</span>}
    </p>
  );
}

export function StartScene() {
  return (
    <div
      className="relative flex flex-col gap-y-7 px-4 py-7 md:gap-y-0 md:px-7 md:py-9"
      style={{ background: '#FAFAFA', backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)', backgroundSize: '30px 30px', border: `1px solid ${C_BORDER}` }}
    >
      {/* ── 01 · 가게 이름 — 무대 맨 위 가로 띠(사장님 2026-10-09: 01 칸 위아래 빈 공간 → 구조로 없앰) ── */}
      <div className="relative max-md:pl-9 md:flex md:flex-col md:items-center">
        <Spine />
        {/* PC = 제목 위 · 창 아래, 둘 다 가운데(사장님 2026-10-09 "왼쪽 제목·오른쪽 창 금지") */}
        <div className="md:[&>div]:justify-center"><Step n="01" label="가게 이름만 넣으면 시작됩니다" desc="주소·전화·메뉴는 적지 않아도 됩니다" /></div>
        <div className="flex w-full items-center gap-2 bg-white p-2 md:mt-2 md:max-w-[640px] md:p-3" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
          <span className="flex min-w-0 flex-1 items-center gap-2.5 px-1.5 text-[13px] font-semibold text-[#111] md:px-3 md:text-[18px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.4" strokeLinecap="round" aria-hidden className="md:h-5 md:w-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="flex min-w-0 items-center"><span className="truncate">{NAME}</span><span className="ss-caret ml-[2px] inline-block h-[18px] w-[2px] shrink-0 md:h-[22px]" style={{ background: ACCENT }} /></span>
          </span>
          <span className="flex h-[30px] shrink-0 items-center bg-[#0070f3] px-3 text-[11.5px] font-bold text-white md:h-[44px] md:px-5 md:text-[15px]">내 가게 찾기</span>
        </div>
      </div>

      {/* 01 → 아래 두 칸: 가운데 세로 화살(PC) */}
      <div className="hidden justify-center py-4 md:flex" aria-hidden>
        <span className="rounded-dot flex h-11 w-11 items-center justify-center bg-white" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.12)' }}>
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none"><line x1="6" y1="1" x2="6" y2="10" stroke="#171717" strokeWidth="1.6" /><path d="M1.2 10L6 17l4.8-7z" fill="#171717" /></svg>
        </span>
      </div>

      <div className="flex flex-col gap-y-7 md:grid md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:gap-0">
      {/* ── 02 · 조사한 재료 — 지도 · 메뉴판 · 리뷰 · 손님 검색어 ── */}
      <div className="relative min-w-0 max-md:w-full max-md:pl-9">
        <Spine />
        <Step n="02" label="가게를 조사해 글 재료를 모읍니다" desc="플레이스의 지도·메뉴판·리뷰와 손님 검색어" />
        <div className="grid grid-cols-[1.25fr_1fr] gap-x-4 bg-white p-2.5 max-md:grid-cols-1" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
          <div className="col-span-2 max-md:col-span-1">
          <Head l="지도" r="망원역 도보 3분" />
          <span className="relative block aspect-[5/2] overflow-hidden max-md:aspect-[5/2]" style={{ border: `1px solid ${C_BORDER}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/meat/map-mangwon.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </span>
          </div>

          <div className="mt-3 border-t pt-2.5" style={{ borderColor: '#F0F0F0' }}>
            <Head l="메뉴판" r="플레이스에서 읽음" />
            <ul className="text-[11px] text-[#111]">
              {MENU.map((m, i) => (
                <li key={m.name} className={`flex h-[26px] items-center gap-1.5 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: '#F3F3F3' }}>
                  {m.top && <span className="shrink-0 bg-[#111] px-1 text-[8px] font-bold leading-[13px] text-white">대표</span>}
                  <span className="truncate font-semibold">{m.name}</span>
                  <span className="ml-auto shrink-0 text-[#666]" style={NUM}>{m.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 flex flex-col border-t pt-2.5" style={{ borderColor: '#F0F0F0' }}>
            <Head l="리뷰" r="방문자 리뷰 1,284" />
            <p className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold leading-none text-[#111]" style={NUM}>4.6</span>
              <span className="text-[11px] text-[#ff3b30]">★</span>
            </p>
            <ul className="mt-2 flex flex-1 flex-col justify-between gap-1.5">
              {REVIEWS.map((r) => (
                <li key={r} className="flex items-center bg-[#FAFAFA] px-2 py-1.5 text-[11px] leading-[1.4] text-[#111] md:flex-1" style={{ border: `1px solid ${C_BORDER}` }}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 mt-3 border-t pt-2.5 max-md:col-span-1" style={{ borderColor: '#F0F0F0' }}>
            <Head l="손님 검색어" r="월간 검색량 · 경쟁" />
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5 max-md:grid-cols-1 max-md:gap-y-1.5">
              {KEYWORDS.map((k) => (
                <li key={k.k} className="flex min-w-0 flex-col gap-1 md:items-start max-md:flex-row max-md:items-center max-md:gap-2.5">
                  <span className="rounded-pill flex h-[26px] shrink-0 items-center whitespace-nowrap bg-[#171717] px-3 text-[11px] font-bold text-white">{k.k}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap pl-1 text-[10.5px] text-[#666] max-md:pl-0" style={NUM}>
                    <span>{k.vol}</span>
                    <span className="rounded-dot inline-block h-[7px] w-[7px]" style={{ background: COMP_COLOR[k.comp] }} />
                    <span>{k.comp}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Arrow />

      {/* ── 03 · 완성 실물 = 네이버 블로그 글(주인공) ── */}
      <div className="relative min-w-0 max-md:w-full max-md:pl-9 md:flex md:flex-col md:self-stretch">
        <Step n="03" label="그 재료로 우리 가게 글이 완성됩니다" desc="뻔한 글이 아니라 우리 가게 말로" />
        <article className="flex flex-col bg-white md:flex-1" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
          {/* 블로그 상단 — 블로그 이름·날짜 */}
          <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: `1px solid ${C_BORDER}` }}>
            <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center bg-[#03c75a]"><svg width="9" height="9" viewBox="0 0 12 12" fill="#fff" aria-hidden><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg></span>
            <span className="truncate text-[10.5px] font-bold text-[#111]">{NAME} 이야기</span>
            <span className="ml-auto shrink-0 text-[9.5px] text-[#999]" style={NUM}>2026. 10. 13.</span>
          </div>
          {/* 사진 = 최소 16:9(사장님), PC 는 02 카드 높이에 맞춰 남는 높이를 채운다(빈 칸 금지) */}
          <span className="relative block aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[260px] md:flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/meat/place-main.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </span>
          <div className="px-3 pb-2.5 pt-3">
            <h3 className="text-[15px] leading-[1.4] tracking-[-0.01em] text-[#111]" style={{ wordBreak: 'keep-all' }}>
              {TITLE.map((w, i) => <span key={i} className={w.own ? 'font-bold' : 'font-normal'}>{w.t}</span>)}
            </h3>
            {/* 본문 몇 줄 + 중략 — 재료가 글 안에 들어간 것이 보이게(굵게) */}
            <p className="mt-2.5 text-[11px] leading-[1.6] text-[#333]" style={{ wordBreak: 'keep-all' }}>
              <b className="font-semibold">망원역</b> 2번 출구에서 걸어 3분. 직접 숙성한 <b className="font-semibold">삼겹살</b>을 숯불 위에 올리면 겉은 바삭하고 속은 촉촉하게 익습니다. 손님들이 가장 많이 하는 말은 <b className="font-semibold">“두툼하고 안 질겨요”</b>.
            </p>
            <p className="my-2 flex items-center gap-2 text-[#999]" aria-hidden>
              <span className="h-px flex-1 bg-[#EDEDED]" /><span className="text-[11px] tracking-[2px]">⋯</span><span className="h-px flex-1 bg-[#EDEDED]" />
            </p>
            <p className="text-[11px] leading-[1.6] text-[#333]" style={{ wordBreak: 'keep-all' }}>
              회식 자리로 찾으시는 분들께는 단체석을 미리 깔아 드립니다. <b className="font-semibold">#망원동삼겹살</b> <b className="font-semibold">#망원역맛집</b>
            </p>
          </div>
        </article>
      </div>
      </div>
      {/* 입력창 커서 깜빡임 — 화면이 살아 있다는 신호 하나만(사장님 2026-10-09 "휘황찬란하다고 좋은 게 아니다") */}
      <style>{`
        .ss-caret { animation: ssCaret 1.06s steps(1, end) infinite; }
        @keyframes ssCaret { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .ss-caret { animation: none; } }
      `}</style>
    </div>
  );
}
