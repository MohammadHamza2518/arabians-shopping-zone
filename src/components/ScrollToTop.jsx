import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component automatically scrolls the window to the very top (0, 0)
 * whenever the route pathname or search parameters change.
 * This guarantees that clicking any footer link, navbar link, or product card
 * always lands the user professionally at the top of the new page.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, search]);

  return null;
}
