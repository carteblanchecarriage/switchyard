import type { AppProps } from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary';

// Global styles (all CSS imported here for Next.js compatibility)
import '../index.css';
import '../App.css';
import '../components/Header.css';
import '../components/Footer.css';
import '../components/BlogProductCard.css';
import '../components/FilterChips.css';
import '../components/ProductGrid.css';
import '../components/Wizard.css';
import '../components/ProductModal.css';
import '../pages/blog/BlogPost.css';
import '../pages/Guide.css';
import '../pages/learn/GuidePages.css';
import '../pages/learn/Learn.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
