import type { PricingTier } from './types';

/**
 * 요금 정본 데이터 — CEO 2차 확정 2026-07-20 (근거: docs/랜딩-아이디어로그.md 결정 로그 "요금제 2차 확정")
 * 구조 = 실제 판매 범위가 확정된 콘텐츠 9.9 / 광고 19.9 두 상품.
 * 영상 제작과 여러 가게 요금은 실제 사용 원가가 쌓인 뒤 별도로 정한다.
 * 카드 문법 = Vercel 실물 참조(인라인 배지·설명 2줄·상속 문구·기능별 lucide 아이콘·하단 pill CTA). 액센트 바 = 제거(CEO).
 * ⛔ 금지: 순위·노출 보장 표현 / "소상공인" / 광고비 구간 과금(수수료 부활 — 영구 금지).
 */

export const pricingHero = {
  title: 'Pricing',
  sub: '투명한 월 정액. 광고비에 붙는 수수료는 없습니다.',
};

/** 동결 약속 (CEO 승인 문구 — 페이지 하단 CTA 선언) */
export const freezePromise = {
  heading: '지금 가입하신 요금은,',
  headingLine2: '쓰시는 동안 그대로입니다.',
  body: '앱은 계속 진화해도 가입하신 요금은 오르지 않습니다. 신규 가입 요금은 달라질 수 있습니다.',
  cta: { text: '무료로 시작', href: '/start' },
  sub: '첫 달 무료 · 카드 등록 없이 시작',
};

export const pricingFootnote =
  '모든 요금제 1개월 무료 · 카드 등록 필요 없음 · 약정 없음 · VAT 별도';

/** 회사 전체 요금표. 아직 확정하지 않은 영상 제작과 여러 가게 상품은 표시하지 않는다. */
export const planTiers = [
  {
    name: '누구나 콘텐츠',
    price: '99,000',
    priceUnit: '원 / 월',
    tagline: '사진부터 네이버 블로그 발행과 노출 확인까지.',
    featured: true,
    features: [
      { icon: 'send', text: '네이버 블로그 글과 대표 이미지' },
      { icon: 'search', text: '목표 검색어와 추천 주제' },
      { icon: 'trending', text: '검색 노출 위치 매일 확인' },
      { icon: 'refresh', text: '노출 소식 주 1회 자동 반영' },
      { icon: 'calendar', text: '검토 또는 자동 승인과 예약 발행' },
      { icon: 'message', text: '사진을 첨부할 수 있는 앱 안 문의' },
    ],
    cta: { text: '무료로 시작', href: '/start', sub: '카드 등록 필요 없음' },
  },
  {
    name: '누구나 광고',
    price: '199,000',
    priceUnit: '원 / 월',
    tagline: '광고 제작부터 성과까지 전부. 광고비 수수료 없음.',
    features: [
      { icon: 'dashboard', text: '매출·광고·방문자 통합 대시보드' },
      { icon: 'click', text: '애드캔버스 광고 제작·운영 (메타·구글)' },
      { icon: 'bot', text: 'AI 챗봇' },
      { icon: 'file', text: '월간 AI 리포트' },
      { icon: 'chart', text: '29CM·에이블리 트렌드 · 경쟁 비교' },
    ],
    cta: { text: '무료로 시작', href: '/start', sub: '카드 등록 필요 없음' },
  },
] satisfies PricingTier[];

export const pricingFaq = [
  {
    question: '첫 달 무료는 어떻게 되나요?',
    answer:
      '가입 후 30일간 선택한 요금제의 기능을 무료로 이용하실 수 있습니다. 카드 등록 없이 시작합니다.',
  },
  {
    question: '나중에 요금이 오르면 어떻게 되나요?',
    answer:
      '지금 가입하신 요금은 쓰시는 동안 그대로입니다. 신규 가입 요금이 조정되더라도, 이미 가입하신 분께는 적용되지 않습니다.',
  },
  {
    question: '광고비는 별도인가요?',
    answer:
      '네. 이용료와 광고비는 별도입니다. 광고비는 Meta·Google에 직접 결제하시며, 광고비에 붙는 수수료는 없습니다.',
  },
  {
    question: '궁금한 것은 어디에 물어보나요?',
    // ★2026-09-18 교정(사장님 확정) — 구 답변은 "누구나 콘텐츠 앱의 문의함"만 안내해서
    //   광고만 쓰는 고객은 갈 곳이 없었다. 광고 앱 문의함은 아직 만들지 않았다(사장님).
    //   그래서 콘텐츠는 기존 문의함, 광고는 대표 메일로 나눠 안내한다.
    //   ⚠ 광고 앱에 문의함이 생기면 이 답변을 다시 고칠 것.
    answer:
      '누구나 콘텐츠는 앱의 문의함에서 질문과 화면 사진을 함께 보내 주세요. 운영자가 확인한 답변도 같은 문의함에서 볼 수 있습니다. 누구나 광고는 oscar@nugoona.co.kr로 보내 주세요.',
  },
  {
    question: '요금제 변경이 가능한가요?',
    answer: '언제든 변경 가능합니다. 변경은 다음 결제일부터 적용됩니다.',
  },
];
