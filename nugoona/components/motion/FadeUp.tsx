'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'p' | 'span';
}

export default function FadeUp({
  children,
  delay = 0,
  className,
  as = 'div',
}: FadeUpProps) {
  const Component = useMemo(() => motion.create(as), [as]);

  return (
    <Component
      // 마운트 즉시 등장(animate) — whileInView가 일부 모바일 브라우저(삼성 인터넷 등)에서
      // 초기 로드 시 불발해 콘텐츠가 opacity:0에 갇히던 문제 방지. 스크롤 감지 의존 제거.
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={cn(className)}
      style={{ backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
    >
      {children}
    </Component>
  );
}
