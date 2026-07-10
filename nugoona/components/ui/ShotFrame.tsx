import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  src: string;
  alt: string;
  /** 상단 크롭 비율(%) — 데모/운영자 바 제거용. 0이면 통짜 */
  cropTop?: number;
  /** next/image intrinsic 힌트 (비율용) */
  w?: number;
  h?: number;
  className?: string;
  priority?: boolean;
}

/**
 * 실제 앱 스크린샷을 랜딩에 얹는 프레임 — 라운드 없이(브랜드 직각) + 드롭섀도로 깊이.
 * cropTop으로 상단 운영자/데모 바를 잘라 깨끗한 제품 화면만 보이게.
 */
export default function ShotFrame({ src, alt, cropTop = 0, w = 1600, h = 1000, className, priority }: Props) {
  return (
    <div
      className={cn('relative overflow-hidden border border-border-default bg-white', className)}
      style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.14), 0 6px 24px rgba(0,0,0,0.06)' }}
    >
      <div style={cropTop ? { marginTop: `-${cropTop}%` } : undefined}>
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          className="w-full h-auto block"
          priority={priority}
          unoptimized
        />
      </div>
    </div>
  );
}
