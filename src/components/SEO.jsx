import { useEffect } from 'react';

const BASE_URL = 'https://arabiansshoppingzone.com';
const DEFAULT_TITLE = 'Arabians Shopping Zone | Royal Sunnah Lifestyle, Authentic Talbina, Thobes & Pure Dehnul Oud';
const DEFAULT_DESCRIPTION = "Shop India's premier royal Sunnah lifestyle boutique. Authentic Talbina dry fruit nutrition, handcrafted Saudi Arabian thobes, aged Dehnul Oud, 3D Islamic wall decor, and custom bespoke Nikah Nama essentials with Pan-India express delivery & Cash on Delivery.";
const DEFAULT_IMAGE = `${BASE_URL}/assets/logo/logo_main.png`;

/**
 * Universal SEO & Schema.org JSON-LD manager for React Router
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema = null
}) {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title 
      ? (title.includes('Arabians') ? title : `${title} | Arabians Shopping Zone`)
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to safely set or update meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to update canonical link
    const setCanonical = (href) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Open Graph Tags (WhatsApp, Facebook, Instagram previews)
    const currentUrl = url || window.location.href;
    setCanonical(currentUrl);

    const fullImage = image && image.startsWith('http') ? image : `${BASE_URL}${image || '/assets/logo/logo_main.png'}`;

    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', fullImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Arabians Shopping Zone');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImage);

    // 5. Dynamic JSON-LD Structured Data
    const scriptId = 'route-jsonld-schema';
    let scriptEl = document.getElementById(scriptId);

    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, image, url, type, schema]);

  return null;
}
