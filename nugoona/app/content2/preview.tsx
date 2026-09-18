'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, Camera, Check, FileText, FolderOpen, Search, RotateCcw, CalendarDays } from 'lucide-react';
import OuterContainer from '@/components/layout/OuterContainer';
import { SpacerRow } from '@/components/layout/OccupancyGrid';
import styles from './preview.module.css';

// 원본 /content와 분리된 디자인 검토안. 앱 화면 복제나 실제 고객 데이터가 아닌 기능 설명 모듈.
export default function ContentPreview() {
  const [method, setMethod] = useState<'now' | 'batch'>('batch');
  const batch = method === 'batch';
  return <main className={styles.preview}>
    <OuterContainer>
      <div className={styles.reviewBar}><span>디자인 검토안 · 핵심 3구간</span><a href="/content">기존 페이지 보기 <ArrowRight size={14} /></a></div>
      <header className={styles.intro}>
        <div className={styles.brand}><img src="/img/logo/nc.svg?v=16" alt="" width={40} height={40} /><span>누구나 콘텐츠</span></div>
        <h1>찍어둔 사진과 영상이<br />꾸준히 발행되는<br className={styles.mobileBreak} /> 가게 콘텐츠가 됩니다.</h1>
        <p>무엇을 올릴지 정하고, 채널에 맞게 만들고, 예약 발행합니다.<br />발행 후에는 실제 검색 위치를 확인해 다음 콘텐츠에 반영합니다.</p>
        <a className={styles.introLink} href="#materials">자료 준비부터 살펴보기 <ArrowDown size={17} /></a>
      </header>
      <SpacerRow thin top />

      <section id="materials" className={styles.section} aria-labelledby="materials-title">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>✦ 자료 준비</span>
          <h2 id="materials-title">지금 찍은 자료도,<br />갖고 있던 자료도.</h2>
          <p>지금 사진·영상 올리기<br />갖고 있던 사진 맡기기</p>
        </div>
        <div className={styles.method}>
          <div className={styles.switcher} role="group" aria-label="자료 준비 방식">
            <button type="button" aria-pressed={!batch} onClick={() => setMethod('now')}><Camera size={19} />지금 올리기</button>
            <button type="button" aria-pressed={batch} onClick={() => setMethod('batch')}><FolderOpen size={19} />사진 맡기기</button>
          </div>
          <div className={styles.methodBody} aria-live="polite">
            <div className={styles.methodTop}><span>{batch ? '갖고 있던 사진을 한꺼번에' : '사진·영상과 짧은 메모'}</span><span className={styles.plan}>{batch ? '콘텐츠 플러스' : '누구나 콘텐츠'}</span></div>
            <div className={styles.transformation}>
              <div className={styles.materialStack} aria-hidden="true">
                <div className={styles.backSheet} /><div className={styles.middleSheet} />
                <div className={styles.frontSheet}>{batch ? <FolderOpen size={46} strokeWidth={1} /> : <Camera size={46} strokeWidth={1} />}<span>{batch ? '찍어둔 사진' : '오늘의 자료'}</span></div>
              </div>
              <ArrowRight className={styles.transformArrow} size={25} strokeWidth={1} aria-hidden="true" />
              <div className={styles.resultSheets}>
                {(batch ? ['추천 글감에 나누어 담고', '여러 편의 검토 글 준비'] : ['사진과 메모를 담아', '채널에 맞는 콘텐츠 준비']).map((text, i) => <div key={text}><FileText size={20} strokeWidth={1.3} /><span>{text}</span>{i === 1 && <Check size={17} className={styles.blue} />}</div>)}
              </div>
            </div>
            <p className={styles.methodNote}>{batch ? '한 번 맡긴 자료로 여러 편의 검토 글을 준비합니다.' : '직접 올린 자료를 콘텐츠로 만들고 발행·노출까지 관리합니다.'}</p>
          </div>
          <div className={styles.caption}>기능 설명용 장면 · 사진 맡기기와 영상 제작의 이용 범위는 다릅니다.</div>
        </div>
      </section>
      <SpacerRow thin top />

      <section className={styles.planning} aria-labelledby="planning-title">
        <div className={styles.planningHead}><span className={styles.eyebrow}>✦ 글감과 촬영 안내</span><h2 id="planning-title">무엇을 만들지도<br />함께 정합니다.</h2><p>목표 검색어에서 글감으로,<br />글감에서 촬영 안내로 이어집니다.</p></div>
        <div className={styles.planFlow}>
          <div className={styles.store}><span>시작은</span><strong>가게 이름</strong><span>가게에 맞는 목표 키워드를 찾아 드립니다</span></div>
          <div className={styles.down}><ArrowDown size={23} strokeWidth={1} aria-hidden="true" /></div>
          <div className={styles.planSteps}>
            <article><Search size={24} strokeWidth={1.2} /><h3>목표 검색어</h3><p>어디에서<br />발견되고 싶은지</p></article>
            <article><FileText size={24} strokeWidth={1.2} /><h3>추천 글감</h3><p>무엇을 꾸준히<br />이야기할지</p></article>
            <article><Camera size={24} strokeWidth={1.2} /><h3>촬영 안내</h3><p>어떤 사진과 영상을<br />준비하면 좋은지</p></article>
          </div>
          <div className={styles.year}><CalendarDays size={23} strokeWidth={1.2} /><span>1년치 글감을 미리 짭니다.</span></div>
        </div>
      </section>
      <SpacerRow thin top />

      <section className={styles.feedback} aria-labelledby="feedback-title">
        <div className={styles.feedbackHead}><span className={styles.eyebrow}>✦ 발행 그다음</span><h2 id="feedback-title">글을 만들었다고<br />끝내지 않습니다.</h2><p>목표 검색어에서 실제로 보이는 위치를 매일 확인합니다.</p></div>
        <div className={styles.feedbackGrid}>
          <div className={styles.exposure}>
            <div className={styles.panelTitle}><Search size={20} /><strong>검색 위치 확인</strong><span>설명용 예시</span></div>
            <div className={styles.exposureRow}><span>목표 검색어 A</span><strong>2페이지 14위</strong></div>
            <div className={styles.exposureRow}><span>목표 검색어 B</span><strong>아직 보이지 않음</strong></div>
            <p>순위 상승을 약속하지 않습니다.<br />현재 보이는 위치를 확인합니다.</p>
          </div>
          <div className={styles.feedbackArrow}><ArrowRight size={32} strokeWidth={1.2} aria-hidden="true" /></div>
          <div className={styles.nextContent}><RotateCcw size={32} strokeWidth={1.2} /><h3>다음 콘텐츠에<br />반영합니다.</h3><p>아직 보이지 않는 검색어는<br />다음 콘텐츠를 정하는 데 반영합니다.</p></div>
        </div>
        <div className={styles.cycle}><span>무엇을 만들지 정하기</span><ArrowRight size={16} /><span>자료 준비</span><ArrowRight size={16} /><span>제작·검토·발행</span><ArrowRight size={16} /><strong>검색 확인·다음 콘텐츠</strong></div>
      </section>
      <SpacerRow thin top />
      <footer className={styles.closing}><div><h2>가게 이름만 알려주시면<br />시작 준비를 도와드립니다.</h2><p>발행한 글과 콘텐츠는 고객님의 계정에 남습니다.</p></div><a href="/start" className={styles.cta}>한 달 무료로 시작하기 <ArrowRight size={18} /></a></footer>
    </OuterContainer>
  </main>;
}
