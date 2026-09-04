'use client';

import { useEffect, useRef } from 'react';

/**
 * 라인 마스크 리빌(이노션 이식 2026-07-15) 공용 유틸 — ★모바일 전용.
 * 실제 마스크 동작 CSS는 globals.css `.reveal-line`(키프레임 lineRise + [data-reveal] paused/running).
 * PC(md=900px↑)는 globals.css 미디어쿼리에서 완전 무력화 → 공유 컴포넌트에 감싸도 PC는 정적 텍스트 그대로.
 */

/** 섹션 루트 ref — 스크롤 진입 1회 감지 → data-reveal wait→in. <section>에 단다. */
export function useRevealOnView<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute('data-reveal', 'in');
          io.disconnect();
        }
      },
      { rootMargin: '-12% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** 리빌 한 줄 — .reveal-line(overflow-hidden 줄 상자) > 직계(animationDelay 소지) > 실제 콘텐츠. */
export function RevealLine({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`reveal-line ${className ?? ''}`}>
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

/** dangerouslySetInnerHTML용 헤딩을 <br> 단위로 쪼개 줄마다 RevealLine으로 감싼다.
 *  baseDelay부터 stepDelay(기본 0.15s)씩 시차. PC에서는 CSS가 무력화하므로 시각적으로 정적. */
export function RevealHtmlLines({
  html,
  baseDelay = 0,
  stepDelay = 0.15,
}: {
  html: string;
  baseDelay?: number;
  stepDelay?: number;
}) {
  const lines = html.split(/<br\s*\/?>/i);
  return (
    <>
      {lines.map((line, i) => (
        <RevealLine key={`${i}-${line}`} delay={baseDelay + i * stepDelay}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </RevealLine>
      ))}
    </>
  );
}
