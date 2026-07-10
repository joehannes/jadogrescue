import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window back to the top whenever the route changes, so every
 * navigation (header, footer, mobile drawer, logo, in-page CTAs — any link
 * that changes the path) lands the visitor at the top of the new page.
 *
 * Anchored (hash) links are left alone so in-page jumps still work.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [pathname, hash]);

  return null;
};
