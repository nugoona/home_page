'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <div className="border-t border-border-default">
      {items.map((item, i) => (
        <div key={i} className="border-b border-border-default">
          <button
            className="w-full flex justify-between items-center py-5 text-left text-[15px] font-medium text-text-primary cursor-pointer bg-transparent border-none hover:text-text-body transition-colors gap-4"
            style={{ fontFamily: 'inherit' }}
            onClick={() => toggle(i)}
          >
            <span>{item.question}</span>
            <svg
              className={`w-[18px] h-[18px] text-text-weak shrink-0 transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-5 text-[14px] text-text-body leading-[1.7]">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
