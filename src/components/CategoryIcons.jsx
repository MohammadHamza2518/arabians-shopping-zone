import React from 'react';

/**
 * Bespoke Islamic & Arabian Luxury Category Icons
 * Handcrafted 24x24 scalable vector icons designed specifically for Arabians Shopping Zone.
 */

// 1. Rub el Hizb ۞ Islamic 8-Point Star (Browse Categories Heading)
export function BrowseCategoriesHeaderIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="1.5" />
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="1.5" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

// 2. Royal Crown Emblem (All Products / Complete Royal Catalog)
export function AllProductsRoyalIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18l2.5-10 4.5 5 4-7 4 7 4.5-5L21 18H3z" />
      <path d="M3 18h18v2.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V18z" />
      <circle cx="5.5" cy="8" r="0.8" fill="currentColor" />
      <circle cx="14" cy="6" r="0.8" fill="currentColor" />
      <circle cx="21" cy="8" r="0.8" fill="currentColor" />
    </svg>
  );
}

// 3. Arabian Thobe & Jubba (Wearing & Royal Attire)
export function ArabianThobeIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Saudi style standing mandarin collar */}
      <path d="M9 3h6v2.5H9z" />
      {/* Hidden button placket */}
      <path d="M12 5.5v5" />
      <circle cx="12" cy="7.2" r="0.75" fill="currentColor" />
      <circle cx="12" cy="9.2" r="0.75" fill="currentColor" />
      {/* Tailored long robe & cuffs */}
      <path d="M9 3.5L4.5 7.5l2 3 2.5-1.5V21h6V9l2.5 1.5 2-3L15 3.5" />
      <path d="M9 21h6" />
    </svg>
  );
}

// 4. Sunnah Superfood Honey Jar & Barley (Health & Sunnah Foods)
export function SunnahFoodIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Honey Jar Body */}
      <path d="M6.5 8.5h11l-1.3 9.5a3 3 0 0 1-3 2H10.8a3 3 0 0 1-3-2L6.5 8.5z" />
      {/* Jar Rim & Cap */}
      <rect x="5.5" y="5.5" width="13" height="3" rx="1" />
      <path d="M9 3.5h6v2H9z" />
      {/* Pure organic honey droplet */}
      <path d="M12 11c-.9 1.2-1.5 2-1.5 2.8a1.5 1.5 0 0 0 3 0c0-.8-.6-1.6-1.5-2.8z" fill="currentColor" />
    </svg>
  );
}

// 5. Crystal Flacon & Dehnul Oud (Fragrance, Oud & Attar)
export function ArabianOudIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Crystal Glass Flacon Body */}
      <rect x="5.5" y="9" width="13" height="12" rx="3.5" />
      {/* Golden Collar */}
      <path d="M9.5 6h5v3h-5z" />
      {/* Traditional Domed Stopper */}
      <path d="M12 2.5a2.2 2.2 0 0 1 2.2 2H9.8a2.2 2.2 0 0 1 2.2-2z" />
      {/* Scent dispersion core */}
      <circle cx="12" cy="15" r="2" />
      <path d="M12 11.5v1.5" />
    </svg>
  );
}

// 6. Sacred Mihrab Arch Frame (Islamic Home Decor)
export function IslamicDecorIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Outer Mihrab Frame */}
      <path d="M4 21V10a8 8 0 0 1 16 0v11" />
      {/* Ogee Arch Point */}
      <path d="M4 10c4-1 8-5 8-5s4 4 8 5" />
      <path d="M3 21h18" />
      {/* Sacred Calligraphy / Star Emblem */}
      <path d="M12 11.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-.9-1.8.9.4-2-1.5-1.4 2-.3z" fill="currentColor" />
    </svg>
  );
}

// 7. Intertwined Rings & Sacred Nikah (Nikah & Wedding Collection)
export function NikahWeddingIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Groom & Bride Interlocking Rings */}
      <circle cx="9" cy="13.5" r="4.8" />
      <circle cx="15" cy="13.5" r="4.8" />
      {/* Brilliant Cut Solitaire / Dulhan Sparkle */}
      <path d="M9 4.8l1.4 2.7H7.6L9 4.8z" fill="currentColor" />
      <path d="M15 4.5l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z" />
    </svg>
  );
}
