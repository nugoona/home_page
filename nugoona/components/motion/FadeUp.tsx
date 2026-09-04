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

  /* ⛔ willChange·backfaceVisibility 영구 지정 금지(2026-07-20 사장님 "글자 흐릿" 진단):
     애니 종료 후에도 GPU 레이어 승격이 남아 텍스트가 회색 AA로 래스터됨(ClearType 상실).
     제거해도 1회성 0.6s 등장 애니 성능 문제 없음 — framer가 애니 중 알아서 최적화 */
  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
