'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// 라벨 = 확정 제품명 "누구나 콘텐츠 / 누구나 광고"(사장님+GPT 개명 확정 2026-07-11 — 구 "NGN 대시보드" 폐기,
// NGN은 로고·영문 표기 전용 강등). 기능명으로 바꾸지 말 것(사장님 지적 2026-07-11).
const links = [
  { href: '/content', label: '누구나 콘텐츠' },
  { href: '/ads', label: '누구나 광고' },
  { href: '/pricing', label: '요금' }, // 신 요금 페이지 연결 (CEO 지시 2026-07-20)
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasPromo, setHasPromo] = useState(false);

  /* Watch body.has-promo class to offset nav below promo banner */
  useEffect(() => {
    const check = () => setHasPromo(document.body.classList.contains('has-promo'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      if (isHome) {
        const hero = document.querySelector('.vi-hero, [data-hero]');
        const heroH = hero ? hero.getBoundingClientRect().height : 0;
        setScrolled(window.scrollY > heroH - 80);
      } else {
        setScrolled(window.scrollY > 60);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
  }, [pathname]);

  function toggleMenu() {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.classList.toggle('menu-open', next);
  }

  const navBg = 'bg-white border-b border-border-default';

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 h-[70px] transition-all duration-200 ${navBg}`}
        style={{ top: hasPromo ? '40px' : '0px' }}
      >
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          {/* ★2026-10-08 새 회사 로고(가로·영문 NUGOONA, 흰 바탕이라 dark-text) — 구 "NGN" 글자 대체. 파일 그대로(DESIGN §8.8) */}
          <Link href="/" className="-ml-1.5 flex items-center" aria-label="누구나 컴퍼니 홈">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/brand/company/horizontal-en-dark-text.svg" alt="NUGOONA" className="block h-[42px] w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[14px] font-medium transition-colors ${
                  pathname === l.href
                    ? 'text-black'
                    : 'text-text-secondary hover:text-black'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link
            href="/start"
            className="hidden md:inline-flex items-center h-9 px-5 text-[13px] font-semibold"
            style={{ backgroundColor: '#171717', color: '#ffffff', border: '1px solid #333' }}
          >
            무료로 시작하기
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer"
            onClick={toggleMenu}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <span
              className={`block w-5 h-[1.5px] bg-text-primary transition-all duration-200 ${
                menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-text-primary transition-all duration-200 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-text-primary transition-all duration-200 ${
                menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu — 닫힘 상태 invisible: 화면 밖 대기 중 캡처·스크린리더 노출 방지(감독관 C-1, 2026-07-11) */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full invisible'
        }`}
        style={{ paddingTop: hasPromo ? '110px' : '70px' }}
      >
        <div className="flex flex-col p-8 gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[18px] font-medium text-text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/start"
            className="flex items-center justify-center h-12 text-[15px] font-semibold text-white btn-gradient-dark w-full mt-4"
            onClick={() => setMenuOpen(false)}
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </>
  );
}
