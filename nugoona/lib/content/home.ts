/* 철학(philosophy) = 롱폼 3막(A안 담백·절제). 사장님이 A/B 중 결정 위임 → A 확정(2026-07-12).
   근거 = CONTENT §0.6 태동배경 팩트체크. "15년" 폐기(연도 근거 없음). 토씨 변경 금지. */

export const hero = {
  /* H1 = GPT+사장님 확정(2026-07-08, b1d9b0f) 토씨 그대로 — 임의 변형 금지(2026-07-11 사장님 재지적으로 복원) */
  h1: '<span class="text-accent">누구나</span> 마케팅하는 시대',
  sub: '광고도 검색 노출도, 직접 운영하는 마케팅 앱입니다.',
  cta: '무료로 시작하기',
  ctaHref: '/start',
};

/* ── S3 두 제품 분기 (홈의 심장) — components/home/ProductBranch ── */
export const branch = {
  title: '어떤 <span class="text-accent">마케팅</span>이<br>필요하신가요?',
  sub: '필요한 기능부터 시작해 보세요.',
  cards: [
    /* 카드 title·desc = GPT+사장님 확정(2026-07-08, b1d9b0f) 토씨 그대로 — "맡기려던 일"로 분기 */
    {
      eyebrow: '누구나 콘텐츠',
      title: '검색하면 우리 가게가<br><span class="text-accent">먼저</span> 보였으면 좋겠습니다.',
      desc: '블로그와 플레이스, SNS를 꾸준히 발행해 고객이 검색에서 먼저 만날 수 있도록 돕습니다.',
      cta: '노출 살펴보기',
      href: '/content',
      mock: 'search',
    },
    {
      eyebrow: '누구나 광고',
      title: '광고를 <span class="text-accent">직접</span> 운영하고 싶습니다.',
      desc: '메타와 구글 광고를 만들고, 성과까지 한 화면에서 확인합니다.',
      cta: '광고 살펴보기',
      href: '/ads',
      mock: 'dashboard',
    },
  ],
};

/* ── S3 왜 만들었나 — 라이트, 롱폼 3막(글이 주인공, 시각물은 각 막을 거듦 §8.7-I) ──
   A안 확정 토씨 그대로. 각 막 body는 한 문단(2~4문장). 임의 변형 금지. */
export const philosophy = {
  opening: '누구나 마케팅하는 시대, 그 말 뒤에는 이런 생각이 있었습니다.',
  acts: [
    {
      title: '마케팅은 늘 남의 일이었습니다.',
      body: '좋은 노출과 광고는 늘 예산이 큰 쪽의 몫처럼 여겨졌습니다. 검색 노출을 위해서는 키워드 하나에도 매달 적지 않은 비용이 들었고, 결제를 멈추면 그 결과도 함께 사라졌습니다. 광고 대행사는 작은 예산으로 시작하는 스토어를 맡기 어려웠습니다. 그래서 많은 사장님에게 마케팅은 언젠가 해야 할 일이었습니다.',
    },
    {
      title: '그런데 규칙이 바뀌었습니다.',
      body: '검색은 이제 실제 경험을 더 중요하게 봅니다. 오래 남는 노출은 방문과 리뷰, 판매와 구매 같은 실제 기록이 함께 쌓일 때 만들어집니다. 그래서 마케팅은 대신해 주는 기술보다, 이해하고 직접 운영하는 과정이 더 중요해졌습니다.',
    },
    {
      title: '그래서, 직접 할 수 있게 만들었습니다.',
      body: '우리는 어려운 과정은 앱으로 정리하고, 중요한 결정은 사장님이 직접 하도록 만들었습니다. 보이지 않는 것을 보인다고 말하지 않고, 지금 어디에 있는지 있는 그대로 보여드립니다. 발행한 콘텐츠와 광고 운영의 기록은 대행사 계정이 아니라 사장님의 계정에 차곡차곡 남습니다. 지름길보다 오래가는 방법, 우리는 그 길을 만들고 있습니다.',
    },
  ],
};

/* ── S5 콘텐츠(노출) 미리보기 — 노출 킬러 ── */
export const exposure = {
  eyebrow: '누구나 콘텐츠',
  title: '발행이 아니라<span class="comma">,</span><br><span class="text-accent">노출</span>을 확인합니다.',
  sub: '글을 올리는 데서 끝나지 않고, 검색에 실제로 보이는지 매일 확인합니다.',
  killer: '검색과 지도의 노출 방식이 바뀌어도, 앱이 매주 따라갑니다.',
  cta: '노출 살펴보기',
  href: '/content',
};

/* ── S6 회사 약속 — StoryStep(dark) ── */
export const promise = {
  step: 'OUR PROMISE',
  /* 육성 E 원문 그대로(D7 H4) — "앱은 생물처럼 계속 자랍니다. 그동안 요금은 그대로." 창작 금지 */
  title: '기능은 계속 늘어나고,<br>요금은 <span class="text-accent">그대로</span>.',
  sub: '새로운 기능이 추가되어도 기존 고객의 요금은 올리지 않습니다. 한 번 시작하면 오래 사용할수록 더 좋아지는 제품을 만듭니다.',
};

export const painPoints = {
  title: '광고, 이대로 괜찮으신가요?',
  subtitle: '많은 이커머스 브랜드가 겪는 세 가지 문제.',
  bridge: 'NGN은 이 세 가지를 한 번에 해결합니다.',
  cells: [
    {
      num: 'Problem 01',
      title: '보이지 않는 내 광고 성과',
      desc: '',
      bullets: [
        '성과 확인도, 요청도 대행사를 거쳐야 하는 구조',
      ],
    },
    {
      num: 'Problem 02',
      title: '복잡한 광고 관리자',
      desc: '',
      bullets: [
        '인터페이스가 복잡해 직접 운영이 쉽지 않음',
      ],
    },
    {
      num: 'Problem 03',
      title: '막막한 광고 제작',
      desc: '',
      bullets: [
        '가이드대로 만들기 어렵고, 실수 위험이 큼',
      ],
    },
  ],
};

export const solution = {
  label: 'Solution',
  title: '맡겨야 아는 게 아니라<span class="comma">,</span><br>알면 <span class="text-accent">직접</span> 하게 됩니다.',
  desc: '거쳐야만 보이던 성과를, 이제 스스로 이해하고 운영합니다.',
};

export const evidence = {
  title: '마케팅의 세 가지 핵심,<br>NGN이 대신합니다.',
  cards: [
    {
      label: 'Speed',
      hero: {
        pre: '',
        before: '대행사',
        mid: ' 없이는 못 만들던 광고, 이제 ',
        after: 'URL 하나',
        post: '면 됩니다.',
      },
      title: 'URL 하나로 광고 완성',
      desc: '상품 URL만 입력하면 AI가 이미지·문구·타겟을 자동 생성합니다.',
    },
    {
      label: 'Insight',
      hero: {
        pre: '',
        before: '보고서',
        mid: ' 기다리지 마세요. 매출·광고·ROAS, ',
        after: '지금 바로',
        post: ' 확인하세요.',
      },
      title: '흩어진 데이터를 한 화면에',
      desc: 'Cafe24·Meta·Google·GA4를 하나의 대시보드에서 실시간으로.',
    },
    {
      label: 'Trend',
      hero: {
        pre: '',
        before: '경쟁사',
        mid: ' 베스트셀러, 직접 찾지 마세요. 인기 상품이 매주 ',
        after: '자동 수집',
        post: '됩니다.',
      },
      title: '경쟁사 트렌드 자동 수집',
      desc: '29CM·Ably 베스트 100을 매주 자동 수집하고 급상승을 감지합니다.',
    },
  ],
};

export const features = [
  {
    label: 'AdCanvas',
    title: 'URL 하나로<br>Instagram·Google 광고까지',
    desc: '상품 URL을 넣으면 AI가 이미지를 추출하고, 광고 문구를 작성합니다. 원클릭으로 게시.',
    bullets: [
      'URL 입력만으로 상품 이미지 자동 추출',
      'AI가 광고 문구·타겟팅 자동 설정',
      'Instagram·Google 원클릭 게시',
      '카페24·메이크샵·고도몰·아임웹 지원',
    ],
    link: '/features#adcanvas',
    frameUrl: 'adcanvas.nugoona.co.kr',
    img: 'https://picsum.photos/seed/adcanvas-ui/800/500',
    alt: false,
    reverse: false,
  },
  {
    label: 'Dashboard',
    title: '매출·광고·방문자,<br>실시간으로',
    desc: 'Cafe24 매출, Meta·Google 광고, GA4 방문자를 하나의 대시보드에서 확인하세요.',
    bullets: [
      'Cafe24 매출 데이터 실시간 연동',
      'Meta·Google 광고 성과 통합 조회',
      'GA4 방문자·유입 소스 분석',
      '12+ 위젯 대시보드로 한눈에',
    ],
    link: '/features#dashboard',
    frameUrl: 'dashboard.nugoona.co.kr',
    img: 'https://picsum.photos/seed/dashboard-ui/800/500',
    alt: true,
    reverse: true,
  },
  {
    label: 'AI Report',
    title: '매달 1일,<br>AI가 사업을 분석합니다',
    desc: 'Claude AI가 5개 플랫폼의 전월 데이터를 수집하고 9개 관점에서 분석합니다.',
    bullets: [
      '매출·광고·트래픽 데이터 자동 수집',
      '9개 섹션 심층 분석 리포트',
      '전월 대비 변화 포인트 도출',
      '실행 가능한 인사이트 자동 제안',
    ],
    link: '/features#dashboard',
    frameUrl: 'dashboard.nugoona.co.kr/report',
    img: 'https://picsum.photos/seed/report-ai/800/500',
    alt: false,
    reverse: false,
  },
  {
    label: 'Trend',
    title: '경쟁사 베스트셀러를<br>매주 자동으로',
    desc: '29CM, Ably의 베스트 100을 자동 수집. 급상승·신규진입을 감지합니다.',
    bullets: [
      '29CM·Ably 베스트 100 자동 수집',
      '급상승·신규진입 상품 감지',
      '카테고리별 트렌드 분석',
      '이미지 벤치마크·검색량 분석',
    ],
    link: '/features#trend',
    frameUrl: 'trend.nugoona.co.kr',
    img: 'https://picsum.photos/seed/trend-data/800/500',
    alt: true,
    reverse: true,
  },
];

export const comparison = {
  bigNum: '0',
  numSuffix: '%',
  headline: '대행 수수료 없이 동일한 서비스.',
  sub: '<br class="hidden md:inline" />광고비 규모와 상관없이 NGN은 <span style="color:var(--color-accent)">월정액</span>.',
  badgeText: '',
  rows: [
    { item: '200만원', agency: '"안 받아요"', ngn: '3.9만원/월', agencyStyle: 'not-italic text-[#ccc]' },
    { item: '500만원', agency: '50~75만원/월', ngn: '9.9만원/월' },
    { item: '1,000만원', agency: '70~100만원/월', ngn: '9.9만원/월' },
    { item: '2,000만원', agency: '140~200만원/월', ngn: '29.9만원/월' },
    { item: '광고 제작', agency: '대행사가 함', ngn: 'AI가 자동 생성', noStrike: true },
    { item: '성과 데이터', agency: '월 1회 보고서', ngn: '실시간 대시보드', noStrike: true },
    { item: '광고 조정', agency: '대행사에 요청', ngn: '직접 실시간 조정', noStrike: true },
  ],
};

export const reviews = {
  header: '사용 중인 브랜드의 후기',
  items: [
    {
      quote:
        '대행사에서 월 70만원 내던 걸 NGN으로 바꾸고 수수료가 1/7로 줄었어요. 데이터도 실시간으로 보니까 훨씬 낫습니다.',
      brand: '패션 브랜드 대표',
      role: '월 광고비 500만원 운영',
      tag: '수수료 1/7 절감',
    },
    {
      quote:
        '광고를 처음 해봤는데 상품 URL만 넣으니까 진짜 됐어요. 인스타 광고가 이렇게 쉬운 줄 몰랐습니다.',
      brand: '뷰티 브랜드 마케터',
      role: 'AdCanvas 원클릭 광고 사용',
      tag: 'URL → 광고 자동 생성',
    },
    {
      quote:
        '경쟁사 신상품을 매주 자동으로 알 수 있어서 기획 미팅이 달라졌습니다. 트렌드 분석이 제일 좋아요.',
      brand: '라이프스타일 브랜드 MD',
      role: 'Trend 29CM·Ably 분석',
      tag: '주간 베스트 자동 수집',
    },
  ],
};

export const faqItems = [
  {
    question: 'NGN은 광고 대행사인가요?',
    answer:
      '아니요. NGN은 SaaS 도구입니다. 광고 생성·관리·분석을 직접 하실 수 있도록 돕는 플랫폼이며, 광고비에 대한 수수료를 받지 않습니다. 원하시면 NGN Business 플랜으로 운영 대행도 가능합니다.',
  },
  {
    question: '광고를 직접 해본 적이 없는데 가능한가요?',
    answer:
      '네. AdCanvas는 상품 URL만 입력하면 AI가 이미지·문구·타겟팅까지 자동으로 세팅합니다. 광고 경험이 없어도 바로 시작할 수 있습니다.',
  },
  {
    question: '어떤 광고 채널을 지원하나요?',
    answer:
      'Meta (Instagram/Facebook) 광고와 Google Ads (검색, 디스플레이, Performance Max)를 지원합니다. 두 채널 모두 AdCanvas에서 생성·관리할 수 있습니다.',
  },
  {
    question: '최소 계약 기간이 있나요?',
    answer:
      '없습니다. 월 단위 결제이며 언제든 해지 가능합니다. 첫 달은 무료로 이용하실 수 있습니다.',
  },
  {
    question: '카페24 외 다른 쇼핑몰도 연동되나요?',
    answer:
      '현재 카페24 자사몰 매출 연동을 지원하며, AdCanvas 원클릭 광고는 카페24·메이크샵·고도몰·아임웹 모두 지원합니다. 스마트스토어·쿠팡은 순차 지원 예정입니다.',
  },
  {
    question: '데이터는 안전한가요?',
    answer:
      '모든 데이터는 Google Cloud(BigQuery)에 안전하게 저장됩니다. SQL Injection 방지, XSS 방지 등 보안 기준을 준수하며, 해지 시 데이터 보존/삭제 정책을 안내드립니다.',
  },
];

export const cta = {
  title: '한 달 <span class="text-accent">먼저 써보세요</span>.<br>카드 등록은 필요 없습니다.',
  sub: '약정도 카드도 없습니다. 스토어 이름만 알려주시면 바로 시작할 수 있도록 준비해 드립니다.',
  primaryText: '무료로 시작하기',
  primaryHref: '/start',
  secondaryText: '노출·광고 둘 다 필요해요',
  secondaryHref: '/start',
};
