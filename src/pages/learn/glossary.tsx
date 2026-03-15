import SEOHead from '../../components/SEOHead';
import Glossary from '../Glossary';

export default function GlossaryPage() {
  return (
    <>
      <SEOHead
        title="Keyboard Glossary - Mechanical Keyboard Terms Defined | Switchyard"
        description="Master mechanical keyboard terminology with our comprehensive glossary. Learn what actuation, lubing, hot-swappable, PCB, stabilizers, and more mean in the keyboard world."
        keywords="mechanical keyboard glossary, keyboard terminology, keycap definition, switch terms, group buy definition, hot-swap meaning, keyboard glossary, QMK, stabilizers, keycap profile"
        canonical="/learn/glossary"
      />
      <Glossary />
    </>
  );
}
