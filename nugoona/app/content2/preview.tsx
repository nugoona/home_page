'use client';

/* ══════════════════════════════════════════════════════════════════
   /content2 — 콘텐츠 페이지 핵심 3구간 디자인 검토 시안 (원본 /content 무수정)

   【사장님 피드백 2026-09-18 — 기획은 승인, 디자인은 미승인】
     "기획은 좋고 뭘 보여줘야 할지는 확실히 맞아. 이 방향이 맞아."
     "모바일은 조금 텍스처가 꾸역꾸역 너무 많이 들어와서 안 보여. 뭔 말하려고 하는지 잘 안 보이고."

   【코덱스 1차 시안(67b8a20)의 실측 문제 — 이번에 고친 것】
     ① 실제 사진이 **0장**이었다. 폴더/문서 아이콘 → 화살표 → 글자 상자라 "자료가 콘텐츠로
        바뀐다"는 변환이 추상적이었다. 기존 홈(S41SearchScene)은 폰 목업 안에 **실제 사진 4장**을
        넣어 변환을 보여준다 — 이 격차가 "완성도 차이"의 정체다.
     ② 모바일 한 화면에 제목+배지+아이콘+화살표+상자2+문장+캡션 **7종이 같은 무게로 경쟁**했다.
     ③ PC는 세 구간이 전부 같은 회색 테두리 상자라 구간 구분이 안 됐다(§3.2 "비슷한 상자 반복").
     ④ PC 왼쪽 제목 아래 **큰 빈칸**(§8.17 "빈칸 지양" 위반).
     ⑤ 모바일에서 순환 4단계가 **2×2로 접혀 순서가 깨짐**("정하기→자료준비" "발행→검색확인"으로 읽힘).

   【이번 설계】
     · 변환 = **실제 사진 → 그 사진이 들어간 글 카드**. 같은 사진이 양쪽에 나와야 "이게 저게 됐다"가 읽힌다.
     · 모바일 = §8.18 대원칙 "PC를 세로로 쌓은 게 아니라 **별도 설계**".
       한 화면 = [주 메시지] → [장면 하나] → [보조 설명] 순서. 장면 안 요소는 최대 3종.
     · 구간마다 **다른 형태**를 준다(사진 변환 / 갈래 흐름 / 순위표+되돌아가는 화살). 상자 반복 회피.
     · 색 3개(#fff·#171717·#0070f3)·선 1px #ECECEC·블러 금지·강조는 테두리(§8.17·§8.15).
   ══════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { ArrowRight, Camera, FolderOpen, Search, RotateCcw } from 'lucide-react';
import OuterContainer from '@/components/layout/OuterContainer';
import styles from './preview.module.css';

/** 자료 준비 두 갈래 — 같은 사진이 '올린 자료'와 '완성된 글'에 모두 나와야 변환이 읽힌다 */
const METHODS = {
  now: {
    tab: '지금 올리기',
    plan: '누구나 콘텐츠',
    lead: '오늘 찍은 사진 몇 장과 짧은 메모',
    shots: ['/img/content/cake-1.jpg', '/img/content/cake-2.jpg', '/img/content/cake-3.jpg'],
    memo: '오늘 찍은 것 · 짧은 메모 한 줄',
    /* 지금 올리기 = 한 편. 아래 batch(여러 편)와 **개수 차이**가 두 방식의 차이를 보여준다 */
    results: [
      { img: '/img/content/cake-1.jpg', title: '오늘 새로 나온 딸기 케이크를 소개합니다', body: '생딸기를 아침에 손질해 크림과 함께 올렸어요.' },
    ],
    meta: '한 편 준비됨',
    note: '직접 올린 자료를 채널에 맞는 콘텐츠로 만들고, 발행과 노출까지 이어갑니다.',
  },
  batch: {
    tab: '사진 맡기기',
    plan: '콘텐츠 플러스',
    lead: '갖고 있던 사진을 한꺼번에',
    /* 같은 가게(인테리어) 사진으로 통일 — 업종이 섞이면 "한 가게의 쌓인 사진"으로 안 읽힌다 */
    shots: ['/img/content/biz-interior-1.jpg', '/img/content/biz-interior-2.jpg', '/img/content/biz-interior-3.jpg', '/img/content/biz-interior-4.jpg'],
    memo: '지난 시공 사진 모음 · 한 번에 맡김',
    /* 맡기면 **여러 편**. 카드를 실제로 3장 보여줘야 "여러 편"이 설득된다(1장 + 빈 줄은 부족) */
    results: [
      { img: '/img/content/biz-interior-1.jpg', title: '작은 방을 넓어 보이게 한 시공', body: '가구 배치와 조명으로 넓어 보이게 했습니다.' },
      { img: '/img/content/biz-interior-3.jpg', title: '침실 무드를 바꾼 한 가지', body: '조명 하나로 분위기가 달라진 사례입니다.' },
      { img: '/img/content/biz-interior-4.jpg', title: '거실 조명, 이렇게 골랐습니다', body: '같은 자재로 시공한 다른 집 이야기입니다.' },
    ],
    meta: '여러 편 준비됨 · 추천 글감에 나누어 담김',
    note: '한 번 맡긴 자료를 추천 글감에 나누어 담아, 여러 편의 검토 글을 준비합니다.',
  },
} as const;

/** 변환 장면 — 왼쪽 실제 사진 / 오른쪽 그 사진이 들어간 글 카드. PC·모바일 공용(배치만 CSS로 다름) */
function TransformScene({ m }: { m: (typeof METHODS)[keyof typeof METHODS] }) {
  return (
    <div className={styles.scene}>
      {/* 왼쪽 = 올린 자료(실제 사진). 오른쪽 글 카드에 **같은 사진이 다시 나오는 것**이
          "이게 저게 됐다"를 읽히게 하는 장치다 — 아이콘으로는 이 연결이 안 생긴다. */}
      <div className={styles.sceneSide}>
        <p className={styles.sceneLabel}>{m.lead}</p>
        <div className={styles.shotGrid}>
          {m.shots.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
        <p className={styles.memo}>{m.memo}</p>
      </div>

      <div className={styles.sceneArrow} aria-hidden="true"><ArrowRight size={22} strokeWidth={1.4} /></div>

      <div className={styles.sceneSide}>
        <p className={styles.sceneLabel}>준비된 콘텐츠</p>
        <div className={styles.postList}>
          {m.results.map((r) => (
            <article key={r.title} className={styles.post}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.img} alt="" loading="lazy" />
              <div>
                <h4>{r.title}</h4>
                <p>{r.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.memo}>{m.meta}</p>
      </div>
    </div>
  );
}

export default function ContentPreview() {
  const [method, setMethod] = useState<'now' | 'batch'>('batch');
  const m = METHODS[method];

  return (
    <main className={styles.preview}>
      <OuterContainer>
        <div className={styles.reviewBar}>
          <span>디자인 검토안 · 핵심 3구간</span>
          <a href="/content">기존 페이지 보기 <ArrowRight size={14} /></a>
        </div>

        <header className={styles.intro}>
          <div className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/nc.svg?v=16" alt="" width={40} height={40} />
            <span>누구나 콘텐츠</span>
          </div>
          <h1>찍어둔 사진과 영상이<br />꾸준히 발행되는<br className={styles.mobileBreak} /> 가게 콘텐츠가 됩니다.</h1>
          <p>무엇을 올릴지 정하고, 채널에 맞게 만들고, 예약 발행합니다.<br className={styles.pcOnly} /> 발행 후에는 실제 검색 위치를 확인해 다음 콘텐츠에 반영합니다.</p>
        </header>

        {/* ── 1구간 · 자료 준비 두 갈래 ───────────────────────────── */}
        <section id="materials" className={styles.block} aria-labelledby="materials-title">
          <div className={styles.blockHead}>
            <span className={styles.eyebrow}>✦ 자료 준비</span>
            <h2 id="materials-title">지금 찍은 자료도,<br />갖고 있던 자료도.</h2>
            <p>오늘 찍은 걸 바로 올리셔도 되고, 쌓아둔 사진을 한꺼번에 맡기셔도 됩니다.</p>
          </div>

          <div className={styles.switcher} role="group" aria-label="자료 준비 방식">
            {(Object.keys(METHODS) as (keyof typeof METHODS)[]).map((k) => (
              <button key={k} type="button" aria-pressed={method === k} onClick={() => setMethod(k)}>
                {k === 'now' ? <Camera size={18} strokeWidth={1.7} /> : <FolderOpen size={18} strokeWidth={1.7} />}
                {METHODS[k].tab}
                <span className={styles.planTag}>{METHODS[k].plan}</span>
              </button>
            ))}
          </div>

          <div className={styles.stage} aria-live="polite">
            <TransformScene m={m} />
            <p className={styles.stageNote}>{m.note}</p>
          </div>
          <p className={styles.caption}>기능 설명용 장면입니다. 사진 맡기기와 영상 제작의 이용 범위는 다릅니다.</p>
        </section>

        {/* ── 2구간 · 글감과 촬영 안내 ───────────────────────────── */}
        <section className={styles.block} aria-labelledby="planning-title">
          <div className={styles.blockHead}>
            <span className={styles.eyebrow}>✦ 글감과 촬영 안내</span>
            <h2 id="planning-title">무엇을 만들지도<br />함께 정합니다.</h2>
            <p>가게 이름 하나에서 세 가지가 함께 정해집니다.</p>
          </div>

          <div className={styles.branch}>
            {/* 출발점 — ⛔ 입력창처럼 보이지 않게 한다(§0 "가게 이름은 실제로 입력할 수 있는
                검색창처럼 보이지 않게"). 테두리 없는 큰 글자 + 라벨로 처리. */}
            <div className={styles.origin}>
              <span className={styles.originLabel}>시작은</span>
              <strong>가게 이름</strong>
              <span className={styles.originNote}>하나면 됩니다</span>
            </div>

            {/* 갈래 — 세로선 하나에서 셋으로 뻗는다. 상자 대신 선+글자(상자 반복 회피) */}
            <div className={styles.fork} aria-hidden="true"><span /></div>

            <ol className={styles.branchList}>
              <li>
                <span className={styles.branchIcon}><Search size={19} strokeWidth={1.5} /></span>
                <div><h3>목표 검색어</h3><p>어디에서 발견되고 싶은지</p></div>
              </li>
              <li>
                <span className={styles.branchIcon}><FolderOpen size={19} strokeWidth={1.5} /></span>
                <div><h3>추천 글감</h3><p>무엇을 꾸준히 이야기할지 — 1년치를 미리</p></div>
              </li>
              <li>
                <span className={styles.branchIcon}><Camera size={19} strokeWidth={1.5} /></span>
                <div><h3>촬영 안내</h3><p>어떤 사진과 영상을 준비하면 좋은지</p></div>
              </li>
            </ol>
          </div>
        </section>

        {/* ── 3구간 · 발행 그다음 ─────────────────────────────────
             §3.4 "마지막 두 단계가 단순 글 작성 도구와의 차이다" → 이 구간이 주인공.
             ⛔ 순위 상승·성과 보장 그림 금지 — 현재 위치만 정직하게 보여준다. */}
        <section className={styles.block} aria-labelledby="feedback-title">
          <div className={styles.blockHead}>
            <span className={styles.eyebrow}>✦ 발행 그다음</span>
            <h2 id="feedback-title">글을 만들었다고<br />끝내지 않습니다.</h2>
            <p>목표 검색어에서 지금 어디에 보이는지 매일 확인합니다.</p>
          </div>

          <div className={styles.loop}>
            <div className={styles.rank}>
              <div className={styles.rankHead}><Search size={17} strokeWidth={1.7} /><strong>검색 위치 확인</strong><span>설명용 예시</span></div>
              <div className={styles.rankRow}><span>연남동 미용실</span><strong>1페이지</strong></div>
              <div className={styles.rankRow}><span>합정 미용실</span><strong>2페이지 14위</strong></div>
              <div className={`${styles.rankRow} ${styles.rankMiss}`}><span>홍대 두피 관리</span><strong>아직 보이지 않음</strong></div>
            </div>

            {/* 되돌아가는 화살 — 이 구간의 주인공. 아직 안 보이는 검색어가 다음 글감이 된다 */}
            <div className={styles.back}>
              <RotateCcw size={26} strokeWidth={1.4} aria-hidden="true" />
              <p><strong>아직 보이지 않는 검색어</strong>가<br />다음에 쓸 글감이 됩니다.</p>
            </div>
          </div>
          <p className={styles.caption}>순위 상승을 약속하지 않습니다. 지금 보이는 위치를 그대로 알려드립니다.</p>
        </section>

        <footer className={styles.closing}>
          <div>
            <h2>가게 이름만 알려주시면<br />시작 준비를 도와드립니다.</h2>
            <p>발행한 글과 콘텐츠는 고객님의 계정에 남습니다.</p>
          </div>
          <a href="/start" className={styles.cta}>한 달 무료로 시작하기 <ArrowRight size={18} /></a>
        </footer>
      </OuterContainer>
    </main>
  );
}
