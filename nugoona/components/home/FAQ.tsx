import FadeUp from '@/components/motion/FadeUp';
import Accordion from '@/components/ui/Accordion';
import GridDivider from '@/components/ui/GridDivider';

import { faqItems } from '@/lib/content/home';

export default function FAQ() {
  return (
    <div>
      <GridDivider />
      <div className="grid grid-cols-1 md:grid-cols-[4fr_8fr] gap-0">
      <div className="py-16 px-12 max-md:py-10 max-md:px-6 max-md:pb-0 flex items-start justify-center">
        <FadeUp>
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.2] md:whitespace-nowrap">
            자주 묻는 질문.
          </h2>
        </FadeUp>
      </div>
      <div className="relative md:border-l md:border-border-default py-12 px-12 max-md:p-6">
        <FadeUp>
          <Accordion items={faqItems} />
        </FadeUp>
      </div>
      </div>
    </div>
  );
}
