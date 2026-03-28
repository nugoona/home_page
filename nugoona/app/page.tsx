import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import HeroAurora from '@/components/home/HeroAurora';
import PainPoints from '@/components/home/PainPoints';
import SolutionSection from '@/components/home/SolutionSection';
import EvidenceInsight from '@/components/home/EvidenceInsight';
import EvidenceSpeed from '@/components/home/EvidenceSpeed';
import EvidenceTrend from '@/components/home/EvidenceTrend';
import ROIComparison from '@/components/home/ROIComparison';
import Reviews from '@/components/home/Reviews';
import FAQ from '@/components/home/FAQ';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <main>
      <OuterContainer>
        <Section noBorder>
          <HeroAurora />
        </Section>

        <Section noBorder>
          <PainPoints />
        </Section>

        <Section crossMarks noBorder>
          <SolutionSection />
        </Section>

        <Section crossMarks noBorder>
          <EvidenceInsight />
        </Section>

        <Section noBorder>
          <EvidenceSpeed />
        </Section>

        <Section noBorder>
          <EvidenceTrend />
        </Section>

        <Section crossMarks noBorder>
          <ROIComparison />
        </Section>

        <Section alt noBorder>
          <Reviews />
        </Section>

        <Section noBorder>
          <FAQ />
        </Section>

        <Section alt noBorder>
          <CTA />
        </Section>
      </OuterContainer>
    </main>
  );
}
