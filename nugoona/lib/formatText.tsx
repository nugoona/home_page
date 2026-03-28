'use client';

import { useEffect } from 'react';

export function useCommaSerif() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      'main h1, main h2, main h3, main p, main td, main li, main span'
    );
    targets.forEach((el) => {
      if (el.querySelector('script, style, input, textarea')) return;
      const children = Array.from(el.childNodes);
      children.forEach((node) => {
        if (node.nodeType === 3 && node.textContent?.includes(',')) {
          const frag = document.createDocumentFragment();
          const parts = node.textContent.split(',');
          parts.forEach((part, i) => {
            if (i > 0) {
              const span = document.createElement('span');
              span.className = 'comma';
              span.textContent = ',';
              frag.appendChild(span);
            }
            if (part) frag.appendChild(document.createTextNode(part));
          });
          node.parentNode?.replaceChild(frag, node);
        }
      });
    });
  }, []);
}
