import { useEffect, useRef, useState } from 'react';

interface UseOnScreenOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * useOnScreen - Detect when element enters viewport
 * Perfect for lazy loading images, animations, and infinite scroll
 * 
 * @example
 * function LazyImage({ src, alt }) {
 *   const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
 *   
 *   return (
 *     <div ref={ref} style={{ minHeight: '200px' }}>
 *       {isVisible && <img src={src} alt={alt} loading="lazy" />}
 *     </div>
 *   );
 * }
 */
export function useOnScreen(options: UseOnScreenOptions = {}) {
  const { rootMargin = '0px', threshold = 0, triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIntersecting(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, triggerOnce]);

  return [ref, isIntersecting] as const;
}

/**
 * useMediaQuery - Detect if media query matches
 * Perfect for responsive design without layout shifts
 * 
 * @example
 * function ResponsiveNav() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    // Initial check
    updateMatch(media);

    // Modern API
    if (media.addEventListener) {
      media.addEventListener('change', updateMatch);
      return () => media.removeEventListener('change', updateMatch);
    }
    
    // Legacy API (older browsers)
    media.addListener(updateMatch);
    return () => media.removeListener(updateMatch);
  }, [query]);

  return matches;
}

/**
 * useClickOutside - Detect clicks outside element
 * Perfect for dropdowns, modals, popovers
 * 
 * @example
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useClickOutside(() => setIsOpen(false));
 *   
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div>Dropdown content</div>}
 *     </div>
 *   );
 * }
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * usePrevious - Get previous value of state
 * Perfect for detecting changes and animations
 * 
 * @example
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *   
 *   useEffect(() => {
 *     if (count > prevCount) {
 *       console.log('Increased!');
 *     }
 *   }, [count, prevCount]);
 * }
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const prevRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    prevRef.current = ref.current;
    ref.current = value;
  }, [value]);

  return prevRef.current;
}
