export const featuresHero = {
  label: 'Features',
  title: 'NGN이 제공하는 모든 것',
};

export const adcanvas = {
  id: 'adcanvas',
  label: 'AdCanvas',
  intro: {
    title: '메타·구글 광고를<br>직접 만들고 관리하세요',
    desc: '복잡한 광고 관리자는 잊으세요. 몇 번의 클릭으로 광고 생성, 성과 확인, 예산 조정까지.',
    cta: 'AdCanvas 시작하기',
    video: '/video/ac-intro.mp4',
  },
  features: [
    {
      num: '01',
      title: '상품 URL 하나면 끝',
      desc: '상품 페이지 URL 입력 → AI가 이미지 추출, 광고 문구 작성. 4:5 자동 크롭, Instagram 피드 미리보기. "게시" 버튼 하나로 광고 시작.',
      note: 'Cafe24 · MakeShop · GodoMall · Imweb',
      steps: [
        { num: '1', title: 'URL 입력', desc: '상품 페이지 URL 붙여넣기' },
        { num: '2', title: 'AI 분석', desc: '이미지 추출 + 광고 문구 자동 작성', tag: 'AI' },
        { num: '3', title: '미리보기', desc: '4:5 자동 크롭, Instagram 피드 미리보기' },
        { num: '4', title: '원클릭 게시', desc: 'Meta · Google 동시 게시', tag: 'LIVE' },
      ],
      video: '/video/ac-01-oneclick.mp4',
    },
    {
      num: '02',
      title: '베스트 상품이 바뀌면, 광고도 바뀝니다',
      desc: '자사몰 상품 데이터 → Meta 카탈로그 자동 연동. 베스트셀러가 바뀌면 광고 소재도 자동 업데이트.',
      steps: [
        { num: '1', title: '상품 연동', desc: '자사몰 상품 피드 자동 수집', tag: 'API' },
        { num: '2', title: '카탈로그 세팅', desc: 'Meta 카탈로그 4단계 가이드' },
        { num: '3', title: '자동 갱신', desc: '베스트셀러 변경 → 소재 자동 교체', tag: 'AUTO' },
        { num: '4', title: '다이나믹 광고', desc: '카탈로그 기반 자동 타겟팅', tag: 'LIVE' },
      ],
      video: '/video/ac-02-catalog.mp4',
    },
    {
      num: '03',
      title: '구글 검색광고도 AI가 만들어 줍니다',
      desc: '랜딩 페이지 URL 입력 → AI가 헤드라인·설명문 자동 생성. 실시간 Ad Strength로 광고 효력 확인.',
      note: 'RSA (반응형 검색광고) · PMax · Easy Mode (초보자용)',
      steps: [
        { num: '1', title: 'URL 입력', desc: '랜딩 페이지 URL' },
        { num: '2', title: 'AI 카피라이팅', desc: '헤드라인 · 설명문 자동 생성', tag: 'AI' },
        { num: '3', title: 'Ad Strength', desc: '광고 효력 실시간 체크' },
        { num: '4', title: '캠페인 게시', desc: 'RSA · PMax · Easy Mode', tag: 'LIVE' },
      ],
      video: '/video/ac-03-google.mp4',
    },
    {
      num: '04',
      title: '만들고 끝이 아닙니다 — 광고운영',
      desc: '캠페인 ON/OFF, 예산 조정, 성과 확인. Meta Ads Manager·Google Ads 없이 AdCanvas에서 바로.',
      note: '광고비 · ROAS · CPC · 클릭수 · 전환 · CTR',
      steps: [
        { num: '1', title: 'ON/OFF 제어', desc: '캠페인·세트 즉시 전환' },
        { num: '2', title: '예산 조정', desc: '일별·전체 예산 실시간 변경' },
        { num: '3', title: '성과 분석', desc: '3레벨 드릴다운 (캠페인→세트→광고)' },
        { num: '4', title: '모바일 관리', desc: '스마트폰에서도 동일하게' },
      ],
      video: '/video/ac-04-manage.mp4',
    },
  ],
};

export const dashboard = {
  id: 'dashboard',
  label: 'Dashboard',
  intro: {
    title: '매출·광고·방문자 데이터를<br>한 화면에서',
    desc: '카페24 매출, 메타·구글 광고, GA4 방문자 — 하나의 대시보드에서 실시간 확인.',
    cta: 'Dashboard 시작하기',
  },
  features: [
    {
      num: '01',
      title: '5개 플랫폼 데이터, 1개 화면',
      desc: '카페24 · 메타 · 구글 · GA4 · 외부 마켓플레이스. 순매출, 주문수, 객단가, 방문자, 전환율, ROAS — 9개 핵심 KPI를 한눈에.',
    },
    {
      num: '02',
      title: '매달 1일, AI가 사업을 분석합니다',
      desc: 'Gemini AI가 5개 플랫폼의 전월 데이터를 수집하고 9개 관점에서 분석. 실행 가능한 인사이트를 자동 제안합니다.',
    },
    {
      num: '03',
      title: '모바일에서도 동일하게',
      desc: 'PC와 동일한 대시보드를 모바일에서 이용할 수 있습니다. 디바이스 자동 감지, 터치에 최적화된 카드형 UI.',
    },
  ],
};

export const trend = {
  id: 'trend',
  label: 'Trend',
  intro: {
    title: '경쟁사 베스트셀러를<br>매주 자동으로 추적합니다',
    desc: '29CM, Ably의 카테고리별 베스트 상품 순위 변동. 급상승·신규진입 상품을 자동 감지합니다.',
    cta: 'Trend 시작하기',
  },
  features: [
    {
      num: '01',
      title: '주간 베스트 100, 자동 수집',
      desc: '매주 월요일, 29CM과 Ably의 카테고리별 베스트 100을 자동 수집합니다. 급상승·신규진입·하락 분류.',
    },
    {
      num: '02',
      title: '내 베스트 상품과 비슷한 경쟁 상품은?',
      desc: '자사몰 베스트 상품 기준으로 AI가 29CM/Ably에서 유사 상품을 추천합니다.',
    },
    {
      num: '03',
      title: '우리 브랜드를 얼마나 검색할까?',
      desc: '네이버 검색량 + 구글 유입을 한 화면에 통합합니다. 경쟁사 대비 검색 트렌드 비교.',
    },
  ],
};
