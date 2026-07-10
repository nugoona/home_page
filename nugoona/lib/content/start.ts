// 누구나 시작하기 (/start) — 두 갈래 공통 종착 (E2-4). CONTENT §0 /start 기획 이관본.
// 구성: 헤더 + 4필드 폼(관심 제품·상호명·연락처·메모) + 3스텝 기대관리 + FAQ3(카드·약정·해지).
// 알림 채널 = Telegram(E0-1 ⑥) — 단 화면 카피는 채널 무관(작업지시서 E2-4 AC ⑥ 무관).
// 스팸 방어(honeypot·rate limit)는 E3-8 구현 사항 — 화면 카피 아님.
// 톤: 열망 공감·담백·품위. ⛔금지어(1등·보장·최저가·최고·100% / 혁신·솔루션·쉽습니다 / AI·자동 남발) 0.
import type { Step } from './types';

// 헤더 — CONTENT §0 확정 스펙("한 달 무료·카드 없이" + 약정 없음)
export const hero = {
  h1: '한 달 무료로 시작합니다',
  sub: '카드 등록도, 약정도 없습니다. 상호명만 알려주시면 나머지는 준비해 두겠습니다.',
};

// 폼 4필드 — ①관심 제품(둘 다=크로스셀 수확) ②상호·브랜드명 ③연락처 ④메모(선택)
export const form = {
  heading: '무엇부터 시작할지 알려주세요',
  interest: {
    label: '관심 있는 제품',
    options: [
      { value: 'content', text: '누구나 콘텐츠 — 검색에 노출' },
      { value: 'ads', text: 'NGN 대시보드 — 광고를 직접' },
      { value: 'both', text: '둘 다 — 노출부터 광고까지' },
    ],
  },
  business: { label: '상호·브랜드명', placeholder: '스토어 이름' },
  contact: { label: '연락처', placeholder: '전화번호 또는 이메일' },
  memo: { label: '메모', placeholder: '남기실 말씀 (선택)', optional: true },
  submit: '무료로 시작하기',
  note: '카드 등록 없이 시작합니다.',
};

// 3스텝 기대관리 — ①연락 → ②상호명으로 세팅 → ③한 달 무료로 사용
export const steps = {
  heading: '신청하면, 이렇게 진행됩니다',
  items: [
    { num: '01', title: '먼저 연락드립니다', desc: '남겨 주신 연락처로 시작을 안내합니다.' },
    { num: '02', title: '상호명으로 세팅해 둡니다', desc: '스토어 정보를 미리 채워, 바로 쓸 수 있게 준비합니다.' },
    { num: '03', title: '한 달, 무료로 써 보세요', desc: '충분히 써 보고, 맞을 때만 이어가면 됩니다.' },
  ] satisfies Step[],
};

// FAQ 3 — 카드 / 약정 / 해지 (CONTENT §0)
export const faq = [
  { q: '카드를 등록해야 하나요?', a: '아니요. 카드 없이 한 달 동안 모든 기능을 써 보실 수 있습니다.' },
  { q: '약정 기간이 있나요?', a: '없습니다. 이용하는 달만큼만 내면 됩니다.' },
  { q: '언제든 그만둘 수 있나요?', a: '네. 원하실 때 해지할 수 있고, 위약금은 없습니다.' },
];
