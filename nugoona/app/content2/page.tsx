import type { Metadata } from 'next';
import ContentPreview from './preview';

export const metadata: Metadata = {
  title: '누구나 콘텐츠 · 디자인 검토안',
  robots: { index: false, follow: false },
};

export default function Page() { return <ContentPreview />; }
