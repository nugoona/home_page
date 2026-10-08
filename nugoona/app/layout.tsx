import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import PromoBanner from '@/components/layout/PromoBanner';
import Analytics from '@/components/layout/Analytics';
import CommaStyler from '@/components/layout/CommaStyler';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-en',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NGN — 누구나 마케팅하는 시대',
    template: '%s | NGN',
  },
  description:
    '광고도 노출도, 한 화면에서 이해하고 직접 합니다. 검색 노출부터 광고 성과까지, 대행 없이 스스로 이해하고 운영하세요.',
  keywords: [
    '온라인광고', '검색노출', '콘텐츠자동화', '광고대시보드', '메타광고',
    '구글광고', '네이버노출', '이커머스마케팅', 'NGN', '누구나컴퍼니',
  ],
  authors: [{ name: '누구나컴퍼니' }],
  metadataBase: new URL('https://www.nugoona.co.kr'),
  openGraph: {
    title: 'NGN — 누구나 마케팅하는 시대',
    description:
      '광고도 노출도, 한 화면에서 이해하고 직접 합니다. 검색 노출부터 광고 성과까지, 대행 없이.',
    type: 'website',
    siteName: 'NGN',
    images: ['/img/icons/logo2.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NGN — 누구나 마케팅하는 시대',
    description:
      '광고도 노출도, 한 화면에서 이해하고 직접 합니다. 검색 노출부터 광고 성과까지, 대행 없이.',
    images: ['/img/icons/logo2.webp'],
  },
  icons: {
    // ★2026-10-08 새 회사 심벌(사장님 확정 2026-10-07, DESIGN §8.8 — 구 마스터 N 대체)
    icon: [
      { url: '/img/brand/company/favicon.ico', sizes: 'any' },
      { url: '/img/brand/company/png/symbol-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/brand/company/png/symbol-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/img/brand/company/png/symbol-256.png',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={interTight.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* 명조(--font-quote) — 목업 안 '실제 발행된 글' 인용 전용 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap"
        />
      </head>
      <body>
        <Analytics />
        <PromoBanner />
        <Nav />
        {children}
        <Footer />
        <CommaStyler />
      </body>
    </html>
  );
}
