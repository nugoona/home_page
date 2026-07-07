// 누구나 홈페이지 콘텐츠 공통 타입 (스프린트 2 · E2-1)
// 카피는 컴포넌트에 하드코딩하지 않고 이 lib/content에서 공급한다(DESIGN §7-6).

export interface Cta {
  text: string;
  href: string;
  /** 버튼 옆/아래 보조 문구 (예: "카드 필요 없음") */
  sub?: string;
}

/** 아이콘/제목/설명 카드 (bento·그리드·3카드 공용) */
export interface Card {
  label?: string;
  title: string;
  desc?: string;
}

/** 번호+제목+설명 스텝 (작동 방식·기대관리) */
export interface Step {
  num: string;
  title: string;
  desc?: string;
}

/** 가격 티어 (PricingCards 공용 — /content 2티어·/ads 4티어) */
export interface PricingTier {
  name: string;
  /** 표시 가격 문자열. 예: "99,000", "390,000~490,000", "문의" */
  price: string;
  /** 단위·부가 표기. 예: "원 / 월" */
  priceUnit?: string;
  /** 한 줄 성격 규정. 예: "영상 빼고 전부" */
  tagline: string;
  features: string[];
  cta: Cta;
  /** 추천 강조 티어 */
  featured?: boolean;
}

/** 가격 섹션 전체 (헤드라인 + 티어 + 공통 하단 문구) */
export interface PricingBlock {
  heading: string;
  sub?: string;
  tiers: PricingTier[];
  /** 전 티어 공통 하단 고정 문구 */
  footnote: string;
}

/** 크로스셀 한 줄 (랜딩 간 이동) */
export interface CrossSell {
  text: string;
  cta: Cta;
}
