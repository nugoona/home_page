import type { Metadata } from 'next';
import HomePreview from './preview';

export const metadata: Metadata = {
  title: '메인 비교 시안',
  robots: { index: false, follow: false },
};

export default function Home2Page() {
  return <HomePreview />;
}
