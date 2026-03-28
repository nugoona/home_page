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
    default: 'NGN - 온라인 광고, 이제 직접 하세요',
    template: '%s | NGN',
  },
  description:
    '상품 URL 하나면 메타·구글 광고가 만들어집니다. 매출·광고·방문자 데이터를 한 화면에서. 대행사 수수료 대신 월 9.9만원.',
  keywords: [
    'AI광고', '온라인광고', '메타광고', '구글광고', '인스타광고',
    '광고자동화', '이커머스마케팅', '대시보드', 'NGN', '누구나컴퍼니',
  ],
  authors: [{ name: '누구나컴퍼니' }],
  metadataBase: new URL('https://www.nugoona.co.kr'),
  openGraph: {
    title: 'NGN - 온라인 광고, 이제 직접 하세요',
    description:
      '상품 URL 하나면 메타·구글 광고가 만들어집니다. 매출·광고·방문자 데이터를 한 화면에서. 대행사 수수료 대신 월 9.9만원.',
    type: 'website',
    siteName: 'NGN',
    images: ['/img/icons/logo2.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NGN - 온라인 광고, 이제 직접 하세요',
    description:
      '상품 URL 하나면 메타·구글 광고가 만들어집니다. 매출·광고·방문자 데이터를 한 화면에서. 대행사 수수료 대신 월 9.9만원.',
    images: ['/img/icons/logo2.webp'],
  },
  icons: {
    icon: '/img/icons/logo2.webp',
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
