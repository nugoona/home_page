'use client';

import { footer } from '@/lib/content/global';

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {footer.columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-1">
              <p className="text-[13px] font-semibold text-text-primary mb-1">{col.heading}</p>
              {col.lines.map((line, j) => (
                <p key={j} className="text-[12px] text-text-weak">{line}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center relative">
          <p className="text-[12px] text-text-weak">{footer.copyright}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-0 w-10 h-10 flex items-center justify-center border border-[#999] rounded-full text-[#555] hover:text-text-primary hover:border-text-primary transition-colors cursor-pointer"
            aria-label="맨 위로 이동"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 13V3" />
              <path d="M3 7l5-5 5 5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
