import { cn } from '@/lib/utils';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'p' | 'span';
}

/**
 * 진입 페이드업 — CSS 애니메이션 기반(framer-motion 의존 제거).
 * framer-motion 마운트 애니메이션이 일부 모바일 브라우저(삼성 인터넷 등)에서
 * 불발해 콘텐츠가 opacity:0에 갇히던 문제 방지. CSS 애니메이션은 엔진 레벨이라
 * JS 하이컵과 무관하게 실행되고, 애니메이션이 없어도 콘텐츠는 기본 표시된다.
 */
export default function FadeUp({ children, delay = 0, className, as: As = 'div' }: FadeUpProps) {
  return (
    <As
      className={cn('fade-up-css', className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </As>
  );
}
