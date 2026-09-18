import type { Metadata } from 'next';
import AdsPreview from './preview';

export const metadata: Metadata = {
  title: '광고 비교 시안',
  robots: { index: false, follow: false },
};

export default function Ads2Page() {
  return <AdsPreview />;
}
