// 누구나 글로벌 셸 카피 — Nav·Footer·PromoBanner (E2-4). E3-1이 이 데이터로 컴포넌트 재배선.
// IA(CONTENT §0) = /, /content, /ads, /start 4곳만 존재 — ⛔없는 페이지(구 /features·/pricing·/about) 링크 금지.
// Footer 회사 정보 = 기존 Footer.tsx 실데이터 정본화(사실, 지어내기 아님).
import type { Cta } from './types';

// Nav — 로고→/ · 누구나 컨텐츠→/content · NGN 대시보드→/ads · [무료로 시작하기]→/start
export const nav = {
  brand: { text: 'NGN', href: '/' } satisfies Cta,
  links: [
    { text: '누구나 컨텐츠', href: '/content' },
    { text: 'NGN 대시보드', href: '/ads' },
  ] satisfies Cta[],
  cta: { text: '무료로 시작하기', href: '/start' } satisfies Cta,
};

// PromoBanner — "첫 달 무료·카드 없음" 1줄
export const promoBanner = {
  text: '지금 시작하면 첫 달 무료, 카드도 필요 없습니다',
  link: { text: '자세히 보기', href: '/start' } satisfies Cta,
};

// Footer — 3열(회사·사업정보·연락처) + 카피라이트. 값은 실회사정보.
export const footer = {
  columns: [
    {
      heading: '누구나컴퍼니',
      lines: ['대표 최우현', '주소 : 서울시 노원구 공릉로34길 62'],
    },
    {
      heading: '사업 정보',
      lines: ['사업자등록번호 : 544-02-02671', '통신판매업신고번호 : 2023-서울노원-1648'],
    },
    {
      heading: '연락처',
      lines: ['대표번호 : 010-2781-4543', '이메일문의 : oscar@nugoona.co.kr'],
    },
  ],
  copyright: '© 2025 누구나컴퍼니. All rights reserved.',
};
