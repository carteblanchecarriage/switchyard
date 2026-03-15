import SEOHead from '../../components/SEOHead';
import ArtisanGuide from './ArtisanGuide';

export default function ArtisanGuidePage() {
  return (
    <>
      <SEOHead
        title="Artisan Keycaps Guide | Custom & Collectible | Switchyard"
        description="Everything about artisan keycaps: top makers like Jelly Key and KeyForge, price tiers, where to buy, avoiding scams, and how to start collecting. Tiny sculptures for your keyboard."
        keywords="artisan keycaps, custom keycaps, Jelly Key, KeyForge, Rama Works, artisan guide, collectible keycaps, mechanical keyboard art"
        canonical="/learn/artisan-guide"
      />
      <ArtisanGuide />
    </>
  );
}
