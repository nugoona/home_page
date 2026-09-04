/* /ads 히어로 궤도 장면 — 사장님 레퍼런스 샷(동심 링 + 중앙 코어 + 매체 위성, 하단 잘림) 다크 번역.
   ★v4(사장님 2026-07-18): "로고가 궤도 따라 천천히 돌아야" — 궤도 회전 복원(갤러리 magicui OrbitingCircles
   원본, 링별 다른 속도·역방향·아주 느리게). v2 정적화는 과잉 교정이었음 — 반려 원인은 회전이 아니라
   위성 부족(빈 화면 순간)이었다 → 위성 9종으로 확충(항상 여러 개 보임).
   위성 = 근거 있는 것만(features-master B7·B8): 페이스북·인스타(메타 분리)·구글·GA4·네이버(검색량 API)
   ·cafe24·메이크샵·고도몰·아임웹(B8 지원몰). ⛔29CM·에이블리 = 제휴 오인 후환으로 제외 유지(사장님).
   ⚠함정(재발 방지): animate-orbit 유틸은 .lab-sources-scope 전용 + OrbitingCircles는 부모 flex 중앙 전제. */
const EN = { fontFamily: 'var(--font-en)' } as const;

/** 위성 카드 — 다크 글래스 타일. 원형(사장님 2026-07-18 "테두리는 원이 더 예쁨" — 직각 원칙의 명시 예외) */
function Sat({ children, label, size }: { children: React.ReactNode; label: string; size: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)',
      }}
      aria-label={label}
    >
      {children}
    </span>
  );
}

/* 로고 — 공식 아이콘 재현(§7-7 예외 판례) + 워드마크(브랜드색 불확실한 곳은 중립 백색 — 틀린 색이 더 어색) */
const LOGOS = {
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect x="1.5" y="5" width="21" height="14" rx="3.5" fill="#FF0000" />
      <path fill="#fff" d="M10 9.2l6 2.8-6 2.8z" />
    </svg>
  ),
  facebook: (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="#fff" d="M15.6 15.1l.5-3.2h-3.1V9.8c0-.9.4-1.7 1.8-1.7h1.4V5.3s-1.3-.2-2.5-.2c-2.5 0-4.2 1.5-4.2 4.3v2.4H6.7v3.2h2.8V23a11 11 0 0 0 3.5 0v-7.9h2.6Z" />
    </svg>
  ),
  /* instagram = InstaLogo 함수로 별도(defs id를 벌마다 고유화 — PC/모바일 2벌 렌더 시 id 중복이면
     display:none 쪽 gradient를 참조해 무채색 렌더. /content "인스타 defs id 접두" 교훈 재발 사례) */
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1C3.25 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z" />
    </svg>
  ),
  ga4: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <rect x="15.5" y="3" width="5.5" height="18" rx="2.75" fill="#F9AB00" />
      <rect x="9.2" y="10" width="5.5" height="11" rx="2.75" fill="#E37400" />
      <circle cx="5.75" cy="18.25" r="2.75" fill="#E37400" />
    </svg>
  ),
  naver: (
    <span className="flex h-[19px] w-[19px] items-center justify-center bg-[#03c75a]">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="#fff" aria-hidden><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
    </span>
  ),
  /* 워드마크 — 타일 확대(icon 46/40, 사장님 2026-07-19 "텍스트 안 보여")에 맞춰 판독 가능 크기로 상향 */
  cafe24: <span className="text-[8px] font-extrabold tracking-[-0.04em] text-[#6d9aff]" style={EN}>cafe24</span>,
  makeshop: <span className="text-[6px] font-extrabold tracking-[-0.04em] text-white/85" style={EN}>MAKESHOP</span>,
  godo: <span className="text-[8px] font-extrabold tracking-[-0.02em] text-white/85" style={EN}>godo</span>,
  imweb: <span className="text-[8px] font-extrabold tracking-[-0.02em] text-white/85" style={EN}>imweb</span>,
} as const;

/** 인스타그램 — 공식 그라디언트 아이콘(§7-7 예외 = 매체 공식 로고). idp = 벌별 defs id 접두(중복 금지) */
function InstaLogo({ idp }: { idp: string }) {
  const gid = `${idp}-ig`;
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="0.27" cy="1.08" r="1.3">
          <stop offset="0" stopColor="#fdf497" /><stop offset="0.09" stopColor="#fdd663" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="5.4" fill={`url(#${gid})`} />
      <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
    </svg>
  );
}

/* 지그재그 v2(사장님 2026-07-19 "간격이 일정하지 않다" 교정):
   ⚠구 40° 균일+링 교대는 9개(홀수)라 마지막-처음 쌍(insta 0°·imweb 320°)이 같은 바깥 링에서
   40° 인접 = 실제 불균일이었음. → 링별 균일 배분으로 재설계:
   바깥 5개 = 72° 균일 / 중간 4개 = 바깥 갭의 중앙(36° 위상, 90° 간격에 가깝게 0~252 배치).
   전 구간 인접각 36° 균일(288~360 한 구간만 72° — 홀수 9개의 산술적 최소 성김).
   전부 동일 각속도(150s) = 상대 배치 영구 고정. */
/* v3(사장님 2026-07-19 모바일 재지적): 9개 홀수로는 어느 배분이든 한 구간이 빈다(288~360 성김 실증)
   → 유튜브 추가로 10개 짝수화(근거 = features-master B12 구글 PMax 유튜브 에셋)
   = 바깥 5(72° 균일) + 중간 5(정확히 갭 중앙 36° 위상) — 전 구간 인접각 36° 완전 균일 지그재그. */
const SATS: { key: 'insta' | keyof typeof LOGOS; label: string; ring: 1 | 2; deg: number }[] = [
  { key: 'insta', label: '인스타그램', ring: 2, deg: 0 },
  { key: 'facebook', label: '페이스북', ring: 1, deg: 36 },
  { key: 'ga4', label: 'GA4', ring: 2, deg: 72 },
  { key: 'google', label: '구글', ring: 1, deg: 108 },
  { key: 'makeshop', label: '메이크샵', ring: 2, deg: 144 },
  { key: 'naver', label: '네이버', ring: 1, deg: 180 },
  { key: 'godo', label: '고도몰', ring: 2, deg: 216 },
  { key: 'cafe24', label: '카페24', ring: 1, deg: 252 },
  { key: 'imweb', label: '아임웹', ring: 2, deg: 288 },
  { key: 'youtube', label: '유튜브', ring: 1, deg: 324 },
];

/** 궤도 한 벌 — 링 SVG px = 궤도 radius px 완전 일치. 위성 = magicui orbit 키프레임 문법에 각도 수동 지정.
    부모(OccupancyGrid 칸 등 relative) 기준 absolute — top = 12시 위성 잘림 방지 여유 */
export function OrbitScene({ box, rings, icon, core, idp, top = 17 }: { box: number; rings: [number, number, number]; icon: number; core: number; idp: string; top?: number }) {
  const c = box / 2;
  return (
    // lab-sources-scope = animate-orbit 유틸 스코프 · flex 중앙 = orbit 키프레임 absolute 기준점
    <div className="lab-sources-scope absolute left-1/2 flex -translate-x-1/2 items-center justify-center" style={{ width: box, height: box, top }}>
      {/* 정적 동심 링 (점선/실선 교차) — 로고 회전이 주인공이라 링은 고정 */}
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${box} ${box}`} fill="none">
        {/* 링 가시성 상향(사장님 2026-07-19 "외곽 궤도선이 안 보여") — 특히 바깥 점선 */}
        <circle cx={c} cy={c} r={rings[2]} stroke="rgba(255,255,255,0.26)" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx={c} cy={c} r={rings[1]} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <circle cx={c} cy={c} r={rings[0]} stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="3 5" />
      </svg>

      {/* 위성 9 — 40° 간격 링 교대(지그재그), 동일 각속도 150s 시계 방향 */}
      {SATS.map((s) => (
        <div
          key={s.key}
          className="animate-orbit absolute flex transform-gpu items-center justify-center"
          style={{
            '--duration': 150,
            '--radius': rings[s.ring],
            '--angle': s.deg,
            '--icon-size': `${icon}px`,
            width: icon,
            height: icon,
          } as React.CSSProperties}
        >
          <Sat label={s.label} size={icon}>{s.key === 'insta' ? <InstaLogo idp={idp} /> : LOGOS[s.key]}</Sat>
        </div>
      ))}

      {/* 중앙 코어 — NA 로고 + 글로우 펄스 */}
      <span className="ads-pulse pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: core * 3.3, height: core * 3.3, background: 'radial-gradient(closest-side, rgba(0,112,243,0.28), transparent)' }} />
      {/* 코어 = 원형 + 작은 NA(사장님 2026-07-18 2차 "NA 글자 너무 커" — na.svg는 글자 큰 파비콘이라 직접 그림) */}
      <span
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#0070f3] font-extrabold text-white"
        style={{ width: core, height: core, borderRadius: '50%', fontSize: Math.round(core * 0.3), letterSpacing: '0.01em', boxShadow: '0 6px 28px rgba(0,0,0,0.55)', ...EN }}
      >
        NA
      </span>
    </div>
  );
}

/* (구 독립 wrapper는 폐기 — 히어로가 OccupancyGrid 정본 좌표계로 재구축되며 OrbitScene을 칸 안에 직접 배치.
   사용처 = components/ads/AdsHero.tsx) */
