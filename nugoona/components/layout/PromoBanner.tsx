'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('promo-closed') !== '1') {
      setVisible(true);
      document.body.classList.add('has-promo');
    }
  }, []);

  function close() {
    setVisible(false);
    document.body.classList.remove('has-promo');
    sessionStorage.setItem('promo-closed', '1');
  }

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black text-white text-[13px] h-10 flex items-center justify-center">
      <div className="flex items-center gap-4 px-6">
        <span>지금 시작하면 첫 달 무료</span>
        <Link href="/start" className="text-white/70 hover:text-white transition-colors">
          자세히 보기 &rarr;
        </Link>
        <button
          onClick={close}
          className="absolute right-4 text-white/50 hover:text-white text-lg leading-none cursor-pointer"
          aria-label="닫기"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
