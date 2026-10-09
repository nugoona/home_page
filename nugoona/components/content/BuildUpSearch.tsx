'use client';

/**
 * BuildUpSearch — /content 2번 구간 "검색에 보이려면 꾸준히 올려야 합니다" 그림(2026-10-09, 직원 PC · 사장님 승인).
 *
 * 말하려는 것: "꾸준히 올리면, 손님이 검색할 때 우리 가게가 보인다."
 * 보여 줄 것 = 네이버 모바일 블로그 검색 결과(실제 화면 2026-10-09 캡처 문법 그대로 — 초록 N 검색창 · 탭 · 정렬 ·
 *   프로필·블로그 이름·날짜 / 파란 제목(검색어 굵게) / 요약 2줄(검색어 굵게) / 사진 3장 + 사진 수).
 * 움직임(원리 연기 — §8.19-E): 결과 세 칸 안에서 다른 가게 글이 하나씩 우리 가게 글로 바뀐다 = 꾸준히 올릴수록 검색에 더 자주 보인다.
 *   칸 크기 고정(제목·요약 줄 수 고정), 내용만 겹쳐 바뀐다(밀림 금지). 처음부터 무한 반복.
 * 폰으로 글 쓰기 장면은 뺐다(상호명·채널 구간이 이미 보여 줌). 가게 이름·제목·요약은 가상. 사진 = 코덱스 생성(photos-cake/reference.md 조사 후).
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const C = (n: string) => `/img/content/cake/${n}.jpg`;
const BORDER = '#EDEDED';
const SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)';
const NAVER_GREEN = '#03c75a';
const NAVER_BLUE = '#0068c3';
const QUERY = ['성수', '딸기', '케이크'];

type Post = { blog: string; when: string; title: string; snippet: string; imgs: [string, string, string]; count: number; ours?: boolean };

const OTHER_A: Post = { blog: '준희의 일상 이야기', when: '1일 전', title: '성수역 핫플 디저트, 딸기 생크림 케이크 후기', snippet: '다음에 방문하면 딸기 케이크 말고 초코도 먹어 보려고요. 성수 카페 투어 중에 들른 곳인데…', imgs: ['other-1', 'other-2', 'other-3'], count: 19 };
const OTHER_B: Post = { blog: '냠냠 탐험가', when: '2주 전', title: '성수 카페 케이크 맛집 정리 | 딸기 시즌', snippet: '요즘 성수에서 딸기 케이크 파는 곳을 모아 봤어요. 주말엔 줄이 길어서 평일 추천…', imgs: ['cake-a', 'cake-b', 'cake-c'], count: 27 };
const SOSO_1: Post = { blog: '성수 소소 이야기', when: '3시간 전', title: '성수 딸기 케이크, 오늘 들어온 딸기로 다시 올렸어요', snippet: '성수동 작은 디저트 카페 소소입니다. 아침에 들어온 딸기로 생크림 케이크를 새로 만들었어요…', imgs: ['soso-1', 'soso-2', 'soso-3'], count: 12, ours: true };
const SOSO_2: Post = { blog: '성수 소소 이야기', when: '1주 전', title: '성수 카페 홀케이크 픽업, 이렇게 포장해 드려요', snippet: '기념일 딸기 케이크 픽업 오시는 분들이 많아 포장 과정을 보여 드려요. 창가 자리에서…', imgs: ['soso-4', 'soso-5', 'soso-6'], count: 9, ours: true };
const SOSO_3: Post = { blog: '성수 소소 이야기', when: '2주 전', title: '딸기 타르트 새로 나왔어요 | 성수 디저트 카페', snippet: '딸기 케이크 다음으로 많이 찾으시던 타르트를 시작했어요. 성수역에서 걸어서 5분…', imgs: ['soso-7', 'soso-8', 'soso-9'], count: 15, ours: true };

/* 세 칸의 변화 — 우리 글이 하나씩 늘어난다 */
const FRAMES: [Post, Post, Post][] = [
  [OTHER_A, SOSO_1, OTHER_B],
  [SOSO_2, SOSO_1, OTHER_B],
  [SOSO_2, SOSO_1, SOSO_3],
];
const HOLD = [2200, 2200, 3600];

/** 검색어 낱말을 굵게 */
function Bold({ text, blue }: { text: string; blue?: boolean }) {
  const re = new RegExp(`(${QUERY.join('|')})`, 'g');
  return (
    <>
      {text.split(re).map((part, i) =>
        QUERY.includes(part) ? <b key={i} className={`font-bold ${blue ? '' : 'text-[#111]'}`}>{part}</b> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

function Result({ p }: { p: Post }) {
  return (
    <div className="px-4 py-4">
      <p className="flex items-center gap-2 text-[12px]">
        {p.ours ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={C('soso-1')} alt="" className="rounded-dot h-6 w-6 object-cover" />
        ) : (
          <span className="rounded-dot block h-6 w-6 bg-[#E8E8E8]" />
        )}
        <span className="font-medium text-[#333]">{p.blog}</span>
        <span className="text-[#999]">· {p.when}</span>
        {p.ours && <span className="ml-auto bg-[#0070f3] px-1.5 text-[11px] font-bold leading-[18px] text-white">내 가게</span>}
      </p>
      <p className="mt-2 truncate text-[16px] leading-[1.38] tracking-[-0.01em]" style={{ color: NAVER_BLUE }}>
        <Bold text={p.title} blue />
      </p>
      <p className="mt-1.5 line-clamp-2 min-h-[38px] text-[13px] leading-[1.45] text-[#555]">
        <Bold text={p.snippet} />
      </p>
      <div className="mt-2.5 grid grid-cols-3 gap-[3px] overflow-hidden">
        {p.imgs.map((n, i) => (
          <span key={n} className="relative block aspect-square overflow-hidden bg-[#F2F2F2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={C(n)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {i === 2 && <span className="rounded-dot absolute bottom-1.5 right-1.5 bg-black/55 px-1.5 text-[11px] font-semibold leading-[18px] text-white">{p.count}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BuildUpSearch() {
  const [f, setF] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setF((v) => (v + 1) % FRAMES.length), HOLD[f]);
    return () => clearTimeout(id);
  }, [f]);
  const frame = FRAMES[f];

  return (
    <div className="relative px-8 py-10 max-md:px-4 max-md:py-7" style={{ background: '#FAFAFA', backgroundImage: 'radial-gradient(#dcdcdc 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="mx-auto w-full max-w-[400px] overflow-hidden bg-white" style={{ border: `1px solid ${BORDER}`, boxShadow: SHADOW }}>
        {/* 검색창 */}
        <div className="px-3 pt-3">
          <div className="rounded-pill flex h-11 items-center gap-2.5 px-4" style={{ boxShadow: 'inset 0 0 0 1px #E3E3E3' }}>
            <span className="text-[19px] font-black leading-none" style={{ color: NAVER_GREEN }}>N</span>
            <span className="text-[15px] font-bold text-[#111]">성수 딸기 케이크</span>
          </div>
        </div>
        {/* 탭 · 정렬 */}
        <div className="mt-2 flex items-center gap-4 border-b px-4 text-[14px]" style={{ borderColor: '#F0F0F0' }}>
          <span className="border-b-2 border-[#111] pb-2 font-bold text-[#111]">블로그</span>
          <span className="pb-2 text-[#666]">카페</span>
          <span className="pb-2 text-[#666]">이미지</span>
          <span className="pb-2 text-[#666]">지식iN</span>
        </div>
        <div className="flex justify-end gap-3 border-b px-4 py-2 text-[12px]" style={{ borderColor: '#F0F0F0' }}>
          <span className="font-bold text-[#111]">· 관련도순</span>
          <span className="text-[#999]">· 최신순</span>
        </div>
        {/* 결과 세 칸 — 칸마다 내용만 겹쳐 바뀐다 */}
        <div className="divide-y" style={{ borderColor: '#F0F0F0' }}>
          {frame.map((p, i) => (
            <div key={i} className="grid" style={{ borderColor: '#F0F0F0' }}>
              {/* 바뀌는 순간 옛 글과 새 글이 같은 칸에 겹쳐 서로 교차(칸 크기 그대로 — 흰 깜빡임·밀림 없음) */}
              <AnimatePresence initial={false}>
                <motion.div key={p.title} className="col-start-1 row-start-1 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <Result p={p} />
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
