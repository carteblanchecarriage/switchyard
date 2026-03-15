import SEOHead from '../../components/SEOHead';
import LayoutSizesGuide from './LayoutSizesGuide';

export default function LayoutSizesPage() {
  return (
    <>
      <SEOHead
        title="Keyboard Layout Sizes Explained | 40% to Full-Size | Switchyard"
        description="Visual guide to keyboard sizes: 40%, 60%, 65%, 75%, TKL, full-size. Compare widths, pros/cons, and find your perfect layout."
        keywords="keyboard layout sizes, 60% vs 65% vs 75%, keyboard size comparison, TKL keyboard, full size keyboard layout"
        canonical="/learn/layout-sizes"
      />
      <LayoutSizesGuide />
    </>
  );
}
