import SEOHead from '../../components/SEOHead';
import BeginnersGuide from './BeginnersGuide';

export default function BeginnersGuidePage() {
  return (
    <>
      <SEOHead
        title="Beginner's Guide to Mechanical Keyboards | Switchyard"
        description="New to mechanical keyboards? Learn the basics: switch types explained simply (linear, tactile, clicky), layout sizes, and how to choose your first board. No jargon, just the essentials."
        keywords="mechanical keyboard beginner guide, first mechanical keyboard, switch types, linear vs tactile, keyboard sizes, 60% keyboard, buy first mechanical keyboard"
        canonical="/learn/beginners-guide"
      />
      <BeginnersGuide />
    </>
  );
}
