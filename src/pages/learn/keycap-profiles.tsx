import SEOHead from '../../components/SEOHead';
import KeycapProfilesGuide from './KeycapProfilesGuide';

export default function KeycapProfilesPage() {
  return (
    <>
      <SEOHead
        title="Keycap Profiles Guide | Cherry SA OEM DSA Explained | Switchyard"
        description="Complete keycap profile guide: Cherry, SA, OEM, DSA, XDA, MT3, KAT. Sculpted vs uniform, ABS vs PBT materials, and which profile to choose."
        keywords="keycap profiles, Cherry profile, SA keycaps, OEM vs Cherry, DSA keycaps, XDA profile, MT3 keycaps, keycap guide"
        canonical="/learn/keycap-profiles"
      />
      <KeycapProfilesGuide />
    </>
  );
}
