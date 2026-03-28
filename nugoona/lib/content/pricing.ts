export const pricingHero = {
  title: 'Pricing',
  sub: '투명한 월정액. 광고비에 대한 수수료는 없습니다.',
};

export const plans = [
  {
    name: 'Dashboard',
    badge: null,
    price: '9.9',
    unit: '만원/월',
    vat: 'VAT 별도',
    desc: '매출·광고·방문자 데이터를 한 화면에서',
    cta: '무료 체험 시작',
    ctaVariant: 'outline' as const,
    features: [
      '카페24 매출 연동',
      'Meta·Google 광고 성과',
      'GA4 방문자 분석',
      '12+ 대시보드 위젯',
      'AI 월간 리포트',
      '이메일 지원',
    ],
  },
  {
    name: 'Business',
    badge: '추천',
    price: '29.9',
    unit: '만원/월',
    vat: 'VAT 별도',
    desc: 'Dashboard + AdCanvas + Trend 올인원',
    cta: '무료 체험 시작',
    ctaVariant: 'solid' as const,
    features: [
      'Dashboard 전체 기능',
      'AdCanvas 광고 생성·관리',
      'Trend 경쟁사 분석',
      '이미지 벤치마크',
      '검색량 분석',
      '우선 지원',
    ],
    note: '광고비 별도 (Meta·Google에 직접 결제)',
  },
  {
    name: '소상공인',
    badge: null,
    price: '3.9',
    unit: '만원/월',
    vat: 'VAT 별도',
    desc: '월 광고비 200만원 이하 사업자 전용',
    cta: '문의하기',
    ctaVariant: 'outline' as const,
    features: [
      'Dashboard 핵심 기능',
      'AdCanvas 원클릭 광고',
      '월 광고비 200만원 이하',
      '소상공인 증빙 필요',
    ],
  },
];

export const comparisonTable = {
  headers: ['기능', 'Dashboard', 'Business', '소상공인'],
  rows: [
    ['카페24 매출 연동', '✓', '✓', '✓'],
    ['Meta 광고 성과', '✓', '✓', '✓'],
    ['Google 광고 성과', '✓', '✓', '—'],
    ['GA4 방문자 분석', '✓', '✓', '—'],
    ['AI 월간 리포트', '✓', '✓', '—'],
    ['AdCanvas 광고 생성', '—', '✓', '✓'],
    ['Trend 경쟁사 분석', '—', '✓', '—'],
    ['이미지 벤치마크', '—', '✓', '—'],
    ['검색량 분석', '—', '✓', '—'],
    ['우선 지원', '—', '✓', '—'],
  ],
};

export const pricingFaq = [
  {
    question: '첫 달 무료는 어떻게 되나요?',
    answer: '가입 후 30일간 선택한 플랜의 모든 기능을 무료로 이용하실 수 있습니다. 카드 등록 없이 시작 가능합니다.',
  },
  {
    question: '광고비는 별도인가요?',
    answer: '네. NGN 이용료와 광고비는 별도입니다. 광고비는 Meta/Google에 직접 결제하시며, NGN은 광고비에 대한 수수료를 받지 않습니다.',
  },
  {
    question: '플랜 변경이 가능한가요?',
    answer: '언제든 업그레이드 또는 다운그레이드 가능합니다. 변경은 다음 결제일부터 적용됩니다.',
  },
  {
    question: '소상공인 프로그램 자격 조건은?',
    answer: '월 광고비 200만원 이하 사업자를 대상으로 합니다. 사업자등록증 등 간단한 증빙이 필요합니다.',
  },
];
